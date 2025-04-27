import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function KanjiReading() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      question: "新しい くるまですね。",
      underlinedWord: "新しい",
      options: ["あたらしい", "あだらしい", "あらたしい", "あらだしい"],
      correctAnswer: 0
    },
    {
      question: "日本の 文化に 興味が あります。",
      underlinedWord: "文化",
      options: ["もんか", "ぶんか", "もんが", "ぶんが"],
      correctAnswer: 1
    },
    {
      question: "来週 テストが あります。",
      underlinedWord: "来週",
      options: ["きしゅう", "らいしゅう", "きしゅー", "らいしゅー"],
      correctAnswer: 1
    },
    {
      question: "毎日 新聞を 読みます。",
      underlinedWord: "読みます",
      options: ["よみます", "かきます", "ききます", "みます"],
      correctAnswer: 0
    },
    {
      question: "彼は 医者に なりたいです。",
      underlinedWord: "医者",
      options: ["いしゃ", "くすりや", "びょういん", "かんごし"],
      correctAnswer: 0
    }
  ];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    // Check if answer is correct immediately
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setCompleted(false);
  };

  return (
    <div>
      {!completed ? (
        <>
          <div className="border-b pb-4">
            <div className="bg-gray-100 rounded p-2 flex justify-between text-sm mb-4">
              <span>問題 {currentQuestion + 1}/{questions.length}</span>
              <span>スコア: {score}</span>
            </div>
            <p className="text-xl">
              <span>漢字読み練習:</span>
              _のことばはひらがなでどうかきますか。
              <br />
              1・2・3・4からいちばんいいものをひとつえらんでください。
            </p>
          </div>

          <div className="py-4">
            <p className="text-3xl" dangerouslySetInnerHTML={{ 
              __html: questions[currentQuestion].question.replace(
                questions[currentQuestion].underlinedWord, 
                `<span style="text-decoration: underline">${questions[currentQuestion].underlinedWord}</span>`
              ) 
            }} />
          </div>

          <div className="text-2xl mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                } ${
                  showResult && index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : ''
                } ${
                  showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer
                    ? 'bg-red-100 border-red-500'
                    : ''
                }`}
                onClick={() => !showResult && handleAnswerSelect(index)}
              >
                <div className="flex gap-4">
                  <span>{index + 1}</span>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {showResult && (
              <>
                <p className={selectedAnswer === questions[currentQuestion].correctAnswer ? "text-green-600 font-bold mb-3" : "text-red-600 font-bold mb-3"}>
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? "正解！" : "不正解..."}
                </p>
                <Button 
                  onClick={() => {
                    const nextQuestion = currentQuestion + 1;
                    if (nextQuestion < questions.length) {
                      setCurrentQuestion(nextQuestion);
                      setSelectedAnswer(null);
                      setShowResult(false);
                    } else {
                      setCompleted(true);
                    }
                  }} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestion === questions.length - 1 ? '結果を見る' : '次の問題'}
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">クイズ終了!</h2>
          <p className="text-lg mb-2">
            あなたのスコア: {score}/{questions.length}
          </p>
          <p className="mb-6">
            {score === questions.length
              ? '素晴らしい！満点です！'
              : score >= questions.length / 2
              ? 'よくできました！'
              : 'もう一度挑戦しましょう！'}
          </p>
          <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
            もう一度
          </Button>
        </div>
      )}
    </div>
  );
}