## How to run the LLM Service

We are using Ollama which is being delivered via docker compose.

We can set the port that the LLM will listening on.
`9000` is ideal when looking at many existing OPEA megasservice default ports.
This will default to 8008 if not set.

```sh
LLM_ENDPOINT_PORT=9000 docker compose up
```

When you start the Ollama it doesn't have the model downloade.
So we'll need to download the model via the API for ollama.

### Download (Pull) a model

```sh
curl http://localhost:9000/api/pull -d '{
  "model": "llama3.2:1b"
}'
```

## How to access the Jaeger UI

When you run docker compose it should start up Jager.

```sh
http://localhost:16686/
```

## How to Run the Mega Service Example

```sh
python app.py
```

## Testing the App

Install Jq so we can pretty JSON on output.
```sh
sudo apt-get install jq
```
https://jqlang.org/download/


cd opea-comps/mega-service
```sh
curl -X POST http://localhost:8000/v1/example-service \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:1b",
    "messages": "Hello, how are you?"
  }' | jq '.' > output/$(date +%s)-response.json
```

```sh
  curl -X POST http://localhost:8000/v1/example-service \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello, this is a test message"
      }
    ],
    "model": "llama3.2:1b",
    "max_tokens": 100,
    "temperature": 0.7
  }' | jq '.' > output/$(date +%s)-response.json
```