import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Quiz data
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
  },
  {
    question: "今日は 天気が いいです。",
    underlinedWord: "天気",
    options: ["てんき", "でんき", "たんき", "だんき"],
    correctAnswer: 0
  },
  {
    question: "山の 上から 海が 見えます。",
    underlinedWord: "山",
    options: ["やま", "さん", "せん", "たけ"],
    correctAnswer: 0
  }
];

// Component for the quiz header
function QuizHeader({ questionsCount }) {
  return (
    <div className="border-b pb-4">
      <p className="text-xl">
        <span>漢字読み練習:</span>
        _のことばはひらがなでどうかきますか。
        <br />
        1・2・3・4からいちばんいいものをひとつえらんでください。
      </p>
    </div>
  );
}

// Component for quiz questions
function QuizQuestion({ question, questionIndex, selectedAnswer, onAnswerSelect, completed }) {
  const baseButtonStyle = "p-3 text-lg shadow-none text-black disabled:opacity-100";
  
  // Styles for different button states
  const buttonStyles = {
    // Quiz mode (not completed)
    notCompleted: {
      selected: "border-blue-500 bg-blue-50",
      unselected: "border-white hover:bg-gray-50"
    },
    // Results mode (completed)
    completed: {
      correctSelected: "bg-green-100 border-green-700 border-2",   // User selected correct answer
      incorrectSelected: "bg-red-100 border-red-700 border-2",  // User selected wrong answer
      correctUnselected: "bg-gray-200 border-gray-200 border-2", // Changed to gray for correct answer user didn't select
      unselected: "border-white text-black border-2"  // Wrong answer user didn't select
    }
  };
  
  // Function to determine which style to apply based on current state
  const getButtonClassName = (answerIndex) => {
    // Not completed yet - quiz mode
    if (!completed) {
      const isSelected = selectedAnswer === answerIndex;
      const stateStyle = isSelected ? buttonStyles.notCompleted.selected : buttonStyles.notCompleted.unselected;
      return `${baseButtonStyle} ${stateStyle}`;
    }
    
    // Completed - results mode
    const isSelected = selectedAnswer === answerIndex;
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isSelected && isCorrect) {
      return `${baseButtonStyle} ${buttonStyles.completed.correctSelected}`;
    } else if (isSelected && !isCorrect) {
      return `${baseButtonStyle} ${buttonStyles.completed.incorrectSelected}`;
    } else if (!isSelected && isCorrect) {
      return `${baseButtonStyle} ${buttonStyles.completed.correctUnselected}`;
    } else {
      return `${baseButtonStyle} ${buttonStyles.completed.unselected}`;
    }
  };


  return (
    <div className="py-3">
      <p className="text-xl mb-4 text-black" dangerouslySetInnerHTML={{ 
        __html: question.question.replace(
          question.underlinedWord, 
          `<span style="text-decoration: underline">${question.underlinedWord}</span>`
        ) 
      }} />

      <div className="choices flex flex-wrap gap-3 text-xl">
        {question.options.map((option, aIndex) => (
          <Button
            key={aIndex}
            variant="outline"
            disabled={completed}
            className={getButtonClassName(aIndex)}
            onClick={() => !completed && onAnswerSelect(questionIndex, aIndex)}
          >
            <div className="flex gap-4">
              <span>{aIndex + 1}</span>
              <span>{option}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

// Component for the quiz results
function QuizResults({ score, totalQuestions }) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="bg-gray-100 rounded p-2 text-xl">
        <span>結果: {score}/{totalQuestions}</span>
      </div>
    </div>
  );
}

// Main KanjiReading component
export default function KanjiReading() {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].correctAnswer) {
        newScore++;
      }
    }
    setScore(newScore);
    setCompleted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setScore(0);
    setCompleted(false);
  };

  const isAllQuestionsAnswered = () => {
    return !selectedAnswers.includes(null);
  };

  return (
    <div>
      {/* Conditional rendering only for headers */}
      {completed ? (
        <QuizResults score={score} totalQuestions={questions.length} />
      ) : (
        <QuizHeader questionsCount={questions.length} />
      )}
      
      {/* Questions are rendered regardless of completed state */}
      {questions.map((question, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={question}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          onAnswerSelect={handleAnswerSelect}
          completed={completed}
        />
      ))}

      {/* Conditional rendering for the action button */}
      <div className="mt-6 mb-8 flex">
        {completed ? (
          <Button 
            onClick={resetQuiz} 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
          >
            もう一度
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
            disabled={!isAllQuestionsAnswered()}
          >
            採点する
          </Button>
        )}
      </div>
    </div>
  );
}