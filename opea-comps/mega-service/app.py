import json
from fastapi import HTTPException
from comps.cores.proto.api_protocol import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatCompletionResponseChoice,
    ChatMessage,
    UsageInfo
)
from comps.cores.mega.constants import ServiceType, ServiceRoleType
from comps import MicroService, ServiceOrchestrator
import os
import aiohttp
from comps.cores.mega.utils import handle_message
from comps.cores.proto.docarray import LLMParams

from fastapi import Request
from fastapi.responses import StreamingResponse

EMBEDDING_SERVICE_HOST_IP = os.getenv("EMBEDDING_SERVICE_HOST_IP", "0.0.0.0")
EMBEDDING_SERVICE_PORT = os.getenv("EMBEDDING_SERVICE_PORT", 6000)
LLM_SERVICE_HOST_IP = os.getenv("LLM_SERVICE_HOST_IP", "0.0.0.0")
LLM_SERVICE_PORT = os.getenv("LLM_SERVICE_PORT", 9000)


class ExampleService:
    def __init__(self, host="0.0.0.0", port=8000):
        self.host = host
        self.port = port
        self.endpoint = "/v1/example-service"
        self.megaservice = ServiceOrchestrator()
        os.environ["LOGFLAG"] = "true"  # Enable detailed logging
    async def check_ollama_connection(self):
        """Check if we can connect to Ollama"""
        try:
            async with aiohttp.ClientSession() as session:
                # Use the list models endpoint as a health check
                url = f"http://{LLM_SERVICE_HOST_IP}:{LLM_SERVICE_PORT}/api/tags"
                print(f"\nTesting Ollama connection to: {url}")
                async with session.get(url) as response:
                    print(f"Ollama check status: {response.status}")
                    if response.status == 200:
                        models = await response.json()
                        print(f"Available models: {models}")
                    return response.status == 200
        except Exception as e:
            print(f"Failed to connect to Ollama: {e}")
            return False
    def add_remote_service(self):
        #embedding = MicroService(
        #    name="embedding",
        #    host=EMBEDDING_SERVICE_HOST_IP,
        #    port=EMBEDDING_SERVICE_PORT,
        #    endpoint="/v1/embeddings",
        #    use_remote_service=True,
        #    service_type=ServiceType.EMBEDDING,
        #)
        llm = MicroService(
            name="llm",
            host=LLM_SERVICE_HOST_IP,
            port=LLM_SERVICE_PORT,
            endpoint="/v1/chat/completions",
            use_remote_service=True,
            service_type=ServiceType.LLM,
        )
        #self.megaservice.add(embedding).add(llm)
        #self.megaservice.flow_to(embedding, llm)
        print(f"\nConfiguring LLM service:")
        print(f"- Host: {LLM_SERVICE_HOST_IP}")
        print(f"- Port: {LLM_SERVICE_PORT}")
        print(f"- Endpoint: {llm.endpoint}")
        print(f"- Full URL: http://{LLM_SERVICE_HOST_IP}:{LLM_SERVICE_PORT}{llm.endpoint}")        
        self.megaservice.add(llm)
    
    def start(self):

        self.service = MicroService(
            self.__class__.__name__,
            service_role=ServiceRoleType.MEGASERVICE,
            host=self.host,
            port=self.port,
            endpoint=self.endpoint,
            input_datatype=ChatCompletionRequest,
            output_datatype=ChatCompletionResponse,
        )

        self.service.add_route(self.endpoint, self.handle_request, methods=["POST"])
        print(f"Service configured with endpoint: {self.endpoint}")
        self.service.start()
    async def handle_request(self, request: Request):
        data = await request.json()
        print("\n\ndata:\n",data)
        stream_opt = data.get("stream", True)
        print("\n\nstream_pot:\n",data)
        chat_request = ChatCompletionRequest.model_validate(data)
        print("\n\nchat_request:\n",chat_request)
        
        ## TODO: Ask OPEA if the handle_message is intentional to only have the last two messages.
        ## because the dictionaty keys overwrite previous ones so you wont get full history.
        ## NOTE: I think handle_message should not be used when you are directly passing
        ## to an LLM I think this is for formatting for an earlier model in the pipeline
        ## which we don't have.
        #prompt = handle_message(chat_request.messages)

        parameters = LLMParams(
            max_tokens=chat_request.max_tokens if chat_request.max_tokens else 1024,
            top_k=chat_request.top_k if chat_request.top_k else 10,
            top_p=chat_request.top_p if chat_request.top_p else 0.95,
            temperature=chat_request.temperature if chat_request.temperature else 0.01,
            frequency_penalty=chat_request.frequency_penalty if chat_request.frequency_penalty else 0.0,
            presence_penalty=chat_request.presence_penalty if chat_request.presence_penalty else 0.0,
            repetition_penalty=chat_request.repetition_penalty if chat_request.repetition_penalty else 1.03,
            stream=stream_opt,
            model=chat_request.model,
            chat_template=chat_request.chat_template if chat_request.chat_template else None,
        )
        initial_inputs={
            "messages": chat_request.messages,
        }
        print("\n\n\n\nPAYLOAD:\n")
        print(json.dumps(initial_inputs))
        print("\n\n\n\n")
        result_dict, runtime_graph = await self.megaservice.schedule(
            initial_inputs=initial_inputs,
            llm_parameters=parameters
        )
        print("\n\nresult_dict:\n",result_dict)
        for node, response in result_dict.items():
            if isinstance(response, StreamingResponse):
                print("\n\nStreaming response:", response)
                return response
        print("\n\nNo streaming response")
        print("runtime_graph:\n",runtime_graph)
        last_node = runtime_graph.all_leaves()[-1]
        print("last_node:\n",last_node)

        # Handle potential errors in the result
        if last_node in result_dict:
            service_result = result_dict[last_node]
            
            # Handle OpenAI-style chat completion response format
            if isinstance(service_result, dict):
                if 'choices' in service_result and len(service_result['choices']) > 0:
                    message = service_result['choices'][0].get('message', {})
                    response = message.get('content', '')
                elif 'error' in service_result:
                    error = service_result['error']
                    error_msg = error.get('message', 'Unknown error')
                    error_type = error.get('type', 'internal_error')
                    raise HTTPException(
                        status_code=400 if error_type == 'invalid_request_error' else 500,
                        detail=error_msg
                    )
                else:
                    print(f"Unexpected response format: {service_result}")
                    raise HTTPException(
                        status_code=500,
                        detail="Unexpected response format from LLM service"
                    )
            else:
                response = service_result
        else:
            print(f"No result found for node {last_node}")
            raise HTTPException(
                status_code=500,
                detail="No response received from LLM service"
            )

        print("\n\n not a streaming response:\n",response)
        choices = []
        usage = UsageInfo()

        choices.append(
            ChatCompletionResponseChoice(
                index=0,
                message=ChatMessage(role="assistant", content=response),
                finish_reason="stop",
            )
        )
        return ChatCompletionResponse(model="chatqna", choices=choices, usage=usage)
        #try:
        #    # First check Ollama connection
        #    if not await self.check_ollama_connection():
        #        raise Exception("Cannot connect to Ollama service")

        # Format the request for Ollama
        #    ollama_request = {
        #        "model": request.model or "llama3.2:1b",  # or whatever default model you're using
        #        "messages": request.messages,
        #        "stream": False  # disable streaming for now
        #    }
        #    
        #    print("\n\n\n 1. Ollama request:")
        #    print(ollama_request)
        #    # Schedule the request through the orchestrator
        #    result = await self.megaservice.schedule(ollama_request)
        #    print("\n\n\n 2. Ollama response:")
        #    print(result)
        #    
        #    # Extract the actual content from the response
        #    if isinstance(result, tuple) and len(result) > 0:
        #        llm_response = result[0].get('llm/MicroService')
        #        print("\n\n\n 3. LLM response:")
        #        print(llm_response)

        #        print("Status code:", llm_response.status_code)
        #        
        #        # Handle StreamingResponse
        #        response_body = b""
        #        async for chunk in llm_response.body_iterator:
        #            print("Received chunk:", chunk)
        #            response_body += chunk
        #        print("response body:", response_body)
        #        
        #        try:
        #            content = response_body.decode('utf-8')
        #            # Try to parse as JSON if possible
        #            content_json = json.loads(content)
        #            if isinstance(content_json, dict) and 'response' in content_json:
        #                content = content_json['response']
        #        except json.JSONDecodeError:
        #            # If not JSON, use the raw content
        #            pass
        #        except Exception as e:
        #            print(f"Error processing response: {e}")
        #            content = str(response_body)
        #        else:
        #            content = "No response content available"
        #    else:
        #        content = "Invalid response format"

        #    # Create the response
        #    response = ChatCompletionResponse(
        #        model=request.model or "example-model",
        #        choices=[
        #            ChatCompletionResponseChoice(
        #                index=0,
        #                message=ChatMessage(
        #                    role="assistant",
        #                    content=content
        #                ),
        #                finish_reason="stop"
        #            )
        #        ],
        #        usage=UsageInfo(
        #            prompt_tokens=0,
        #            completion_tokens=0,
        #            total_tokens=0
        #        )
        #    )
        #    
        #    return response
        #    
        #except Exception as e:
        #    # Handle any errors
        #    raise HTTPException(status_code=500, detail=str(e))

example = ExampleService()
example.add_remote_service()
example.start()