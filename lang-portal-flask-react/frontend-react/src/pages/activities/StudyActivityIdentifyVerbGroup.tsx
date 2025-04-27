import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
//import { SpeakerLoud } from 'lucide-react'

export default function StudyActivityIdentifyVerbGroup() {
  const initialWords = [
    {id: 1,  name: '行く',     group: 'I', explanation: "Ends in く ➜ standard godan verb.", translation: "to go"},
    {id: 2,  name: '飲む',     group: 'I', explanation: "Ends in む ➜ standard godan verb.", translation: "to drink"},
    {id: 3,  name: '話す',     group: 'I', explanation: "Ends in す ➜ standard godan verb.", translation: "to speak/talk"},
    {id: 4,  name: '買う',     group: 'I', explanation: "Ends in う ➜ standard godan verb.", translation: "to buy"},
    {id: 5,  name: '読む',     group: 'I', explanation: "Ends in む ➜ standard godan verb.", translation: "to read"},
    {id: 6,  name: '書く',     group: 'I', explanation: "Ends in く ➜ standard godan verb.", translation: "to write"},
    {id: 7,  name: '遊ぶ',     group: 'I', explanation: "Ends in ぶ ➜ standard godan verb.", translation: "to play"},
    {id: 8,  name: '泳ぐ',     group: 'I', explanation: "Ends in ぐ ➜ standard godan verb.", translation: "to swim"},
    {id: 9,  name: '待つ',     group: 'I', explanation: "Ends in つ ➜ standard godan verb.", translation: "to wait"},
    {id:10,  name: '立つ',     group: 'I', explanation: "Ends in つ ➜ standard godan verb.", translation: "to stand"},

    /* ——— basic high-frequency exceptions ——— */
    {id: 11,  name: '要る',     group: 'I', explanation: "Ends in る but you need 要らない／要ります → consonant-stem (godan).", translation: "to need"},
    {id: 12,  name: '帰る',     group: 'I', explanation: "Returns home: 帰らない／帰ります ⇒ row-shifts, so godan.", translation: "to return home"},
    {id: 13,  name: '切る',     group: 'I', explanation: "To cut: 切らない／切ります ⇒ consonant-stem.", translation: "to cut"},
    {id: 14,  name: '喋る',     group: 'I', explanation: "To chat: 喋らない／喋ります ⇒ godan.", translation: "to chat/talk"},
    {id: 15,  name: '知る',     group: 'I', explanation: "To know: 知らない／知ります ⇒ godan.", translation: "to know"},
    {id: 16,  name: '入る',     group: 'I', explanation: "To enter: 入らない／入ります ⇒ godan.", translation: "to enter"},
    {id: 17,  name: '走る',     group: 'I', explanation: "To run: 走らない／走ります ⇒ godan.", translation: "to run"},
    {id: 18,  name: '減る',     group: 'I', explanation: "To decrease: 減らない／減ります ⇒ godan.", translation: "to decrease"},

    /* ——— intermediate-level exceptions ——— */
    {id: 19,  name: '焦る',     group: 'I', explanation: "To panic/hurry: 焦らない／焦ります ⇒ godan.", translation: "to panic/hurry"},
    {id: 20, name: '限る',     group: 'I', explanation: "To limit: 限らない／限ります ⇒ godan.", translation: "to limit"},
    {id: 21, name: '蹴る',     group: 'I', explanation: "To kick: 蹴らない／蹴ります ⇒ godan.", translation: "to kick"},
    {id: 22, name: '滑る',     group: 'I', explanation: "To slip: 滑らない／滑ります ⇒ godan.", translation: "to slip"},
    {id: 23, name: '握る',     group: 'I', explanation: "To grasp: 握らない／握ります ⇒ godan.", translation: "to grasp"},
    {id: 24, name: '練る',     group: 'I', explanation: "To knead: 練らない／練ります ⇒ godan.", translation: "to knead"},
    {id: 25, name: '参る',     group: 'I', explanation: "Humble go/come: 参らない／参ります ⇒ godan.", translation: "to go/come (humble)"},
    {id: 26, name: '交じる',   group: 'I', explanation: "To mix/mingle: 交じらない／交じります ⇒ godan.", translation: "to mix/mingle"},

    /* ——— advanced/less common exceptions ——— */
    {id: 27, name: '嘲る',     group: 'I', explanation: "To ridicule: 嘲らない／嘲ります ⇒ godan.", translation: "to ridicule"},
    {id: 28, name: '覆る',     group: 'I', explanation: "To overturn: 覆らない／覆ります ⇒ godan.", translation: "to overturn"},
    {id: 29, name: '遮る',     group: 'I', explanation: "To block: 遮らない／遮ります ⇒ godan.", translation: "to block"},
    {id: 30, name: '罵る',     group: 'I', explanation: "To verbally abuse: 罵らない／罵ります ⇒ godan.", translation: "to verbally abuse"},
    {id: 31, name: '捻る',     group: 'I', explanation: "To twist: 捻らない／捻ります ⇒ godan.", translation: "to twist"},
    {id: 32, name: '翻る',     group: 'I', explanation: "To flutter/turn over: 翻らない／翻ります ⇒ godan.", translation: "to flutter/turn over"},
    {id: 33, name: '滅入る',   group: 'I', explanation: "To feel depressed: 滅入らない／滅入ります ⇒ godan.", translation: "to feel depressed"},
    {id: 34, name: '蘇る',     group: 'I', explanation: "To be resurrected: 蘇らない／蘇ります ⇒ godan.", translation: "to be resurrected"},

    /* ——— additional useful exceptions to round out the classic 30 ——— */
    {id: 35, name: '散る',     group: 'I', explanation: "To scatter/fall (blossoms): 散らない／散ります ⇒ godan.", translation: "to scatter/fall (blossoms)"},
    {id: 36, name: '弄る',     group: 'I', explanation: "To fiddle with: 弄らない／弄ります ⇒ godan.", translation: "to fiddle with"},
    {id: 37, name: '茂る',     group: 'I', explanation: "To grow thick: 茂らない／茂ります ⇒ godan.", translation: "to grow thick"},
    {id: 38, name: '舐める',   group: 'I', explanation: "To lick (this one's famously godan: 舐めらない／舐めります).", translation: "to lick"},
    {id: 39, name: '煎る',     group: 'I', explanation: "To roast: 煎らない／煎ります ⇒ godan.", translation: "to roast"},
    {id: 40, name: '照る',     group: 'I', explanation: "To shine (sun): 照らない／照ります ⇒ godan.", translation: "to shine (sun)"},

    {id: 41, name: '食べる',     group: 'II', explanation: "Stem 食べ- ends in the vowel え. る drops cleanly, so it's an ichidan (一段) verb.", translation: "to eat"},
    {id: 42, name: '見る',       group: 'II', explanation: "Stem 見- ends in the vowel い. る drops cleanly—ichidan verb.", translation: "to see/look"},
    {id: 43, name: '教える',     group: 'II', explanation: "Stem 教え- ends in the vowel え. It conjugates as an ichidan verb.", translation: "to teach"},
    {id: 44, name: '寝る',       group: 'II', explanation: "Stem 寝- ends in the vowel え. Follows ichidan patterns.", translation: "to sleep"},
    {id: 45, name: '起きる',     group: 'II', explanation: "Stem 起き- ends in the vowel い. Ichidan verb.", translation: "to wake up"},
    {id: 46, name: '開ける',     group: 'II', explanation: "Stem 開け- ends in the vowel え. Ichidan conjugation.", translation: "to open"},
    {id: 47, name: '閉める',     group: 'II', explanation: "Stem 閉め- ends in the vowel え. Ichidan verb.", translation: "to close"},
    {id: 48, name: '出る',       group: 'II', explanation: "Stem 出- ends in the vowel え (historically い). Conjugates as ichidan.", translation: "to exit/go out"},
    {id: 49, name: '浴びる',     group: 'II', explanation: "Stem 浴び- ends in the vowel い. Ichidan verb.", translation: "to shower/bathe"},
    {id: 50, name: '借りる',     group: 'II', explanation: "Stem 借り- ends in the vowel い. Ichidan verb.", translation: "to borrow"},
    {id: 51, name: '着る',       group: 'II', explanation: "Stem 着- ends in the vowel い. Ichidan verb.", translation: "to wear"},
    {id: 52, name: '信じる',     group: 'II', explanation: "Stem 信じ- ends in the vowel い. Ichidan verb.", translation: "to believe"},
    {id: 53, name: '見せる',     group: 'II', explanation: "Stem 見せ- ends in the vowel え. Ichidan verb.", translation: "to show"},
    {id: 54, name: '分ける',     group: 'II', explanation: "Stem 分け- ends in the vowel え. Ichidan verb.", translation: "to divide"},
    {id: 55, name: '居る',       group: 'II', explanation: "Stem 居- ends in the vowel い. (Note: 要る 'to need' is godan; 居る 'to exist (animate)' is ichidan.)", translation: "to exist (animate)"},
    {id: 56, name: '調べる',     group: 'II', explanation: "Stem 調べ- ends in the vowel え. Ichidan verb.", translation: "to investigate"},
    {id: 57, name: '受ける',     group: 'II', explanation: "Stem 受け- ends in the vowel え. Ichidan verb.", translation: "to receive"},
    {id: 58, name: '考える',     group: 'II', explanation: "Stem 考え- ends in the vowel え. Ichidan verb.", translation: "to think"},
    {id: 59, name: '忘れる',     group: 'II', explanation: "Stem 忘れ- ends in the vowel え. Ichidan verb.", translation: "to forget"},
    {id: 60, name: '出かける',   group: 'II', explanation: "Stem 出かけ- ends in the vowel え. Ichidan verb despite the compound stem.", translation: "to go out"},

    {id: 61, name: 'する',         group: 'III', explanation: 'Core irregular verb "to do."', translation: "to do"},
    {id: 62, name: '来る',         group: 'III', explanation: 'Core irregular verb "to come."', translation: "to come"},
    {id: 63, name: '勉強する',     group: 'III', explanation: 'Compound of 勉強 + する; conjugates like する.', translation: "to study"},
    {id: 64, name: '運動する',     group: 'III', explanation: 'Compound of 運動 + する; conjugates like する.', translation: "to exercise"},
    {id: 65, name: '旅行する',     group: 'III', explanation: 'Compound of 旅行 + する; conjugates like する.', translation: "to travel"},
    {id: 66, name: '連絡する',     group: 'III', explanation: 'Compound of 連絡 + する; conjugates like する.', translation: "to contact"},
    {id: 67, name: '準備する',     group: 'III', explanation: 'Compound of 準備 + する; conjugates like する.', translation: "to prepare"},
    {id: 68, name: '紹介する',     group: 'III', explanation: 'Compound of 紹介 + する; conjugates like する.', translation: "to introduce"},
    {id: 69, name: '参加する',     group: 'III', explanation: 'Compound of 参加 + する; conjugates like する.', translation: "to participate"},
    {id: 70, name: '発表する',     group: 'III', explanation: 'Compound of 発表 + する; conjugates like する.', translation: "to present/announce"},
    {id: 71, name: '経験する',     group: 'III', explanation: 'Compound of 経験 + する; conjugates like する.', translation: "to experience"},
    {id: 72, name: '愛する',       group: 'III', explanation: 'Literally "to love"; dictionary form includes する.', translation: "to love"},
    {id: 73, name: '感謝する',     group: 'III', explanation: 'Compound of 感謝 + する; conjugates like する.', translation: "to thank/appreciate"},
    {id: 74, name: '研究する',     group: 'III', explanation: 'Compound of 研究 + する; conjugates like する.', translation: "to research"},
    {id: 75, name: '持ってくる',   group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to bring"},
    {id: 76, name: '連れてくる',   group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to bring (someone)"},
    {id: 77, name: '呼んでくる',   group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to call and come back"},
    {id: 78, name: '取ってくる',   group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to go get"},
    {id: 79, name: '見つけてくる', group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to go find"},
    {id: 80, name: '持ち帰ってくる',group: 'III', explanation: 'Phrasal verb ending in 来る; conjugates like 来る.', translation: "to bring back"}
  ]

  const [words, setWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isAnswered, setIsAnswered] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)  // Added state for translation visibility

  // Shuffle words function
  const shuffleWords = () => {
    return [...initialWords].sort(() => 0.5 - Math.random())
  }

  // Initialize with shuffled words
  useEffect(() => {
    setWords(shuffleWords())
  }, [])

  // Audio playback function
  const playAudio = async (word) => {
    try {
      setAudioLoading(true)
      
      // Create the audio element
      const audio = new Audio(`/src/assets/audio/${word}.wav`)
      
      // Play the audio
      await audio.play()
      
      // Set up event listener to know when playing is done
      audio.addEventListener('ended', () => {
        setAudioLoading(false)
      })
      
      // Handle errors
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        setAudioLoading(false)
      })
    } catch (error) {
      console.error('Failed to play audio:', error)
      setAudioLoading(false)
    }
  }

  const checkAnswer = (selectedGroup) => {
    if (!words.length) return; // Guard to prevent errors if words array is still empty
    
    const correctGroup = words[currentWordIndex].group
    const isCorrect = selectedGroup === correctGroup
    
    setFeedback({
      isCorrect,
      message: isCorrect 
        ? `正解: Group ${correctGroup} Verb.` 
        : `不正解: Group ${correctGroup} Verb.`,
      explanation: words[currentWordIndex].explanation
    })
    
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }))
    
    setIsAnswered(true)
  }

  const nextWord = () => {
    // Move to the next word or loop back to the beginning
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    setFeedback(null)
    setIsAnswered(false)
    setShowTranslation(false)  // Reset translation visibility for next word
  }

  const restartQuiz = () => {
    // Reshuffle words for new quiz
    setWords(shuffleWords())
    setCurrentWordIndex(0)
    setFeedback(null)
    setScore({ correct: 0, total: 0 })
    setIsAnswered(false)
    setShowTranslation(false)  // Reset translation visibility for restart
  }

  // Reveal translation (one-time action)
  const revealTranslation = () => {
    setShowTranslation(true)
  }

  // If words array is empty, show loading
  if (!words.length) {
    return <div className="text-center p-8">Loading...</div>
  }
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Progress indicator */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Word {currentWordIndex + 1} of {words.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score.correct}/{score.total}
        </div>
      </div>

      {/* Current word display */}
      <div className="text-sm text-gray-500 mb-4">
        Choose the correct verb group
      </div>
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center relative">
        <div className="text-6xl mb-2 font-medium">
          {words[currentWordIndex].name}
        </div>
        
        {/* Translation display - conditionally shown */}
        {showTranslation && (
          <div className="text-sm text-gray-600 mb-3 italic">
            {words[currentWordIndex].translation}
          </div>
        )}
        
        
        {/* Button row for audio and translation */}
        <div className="flex justify-center gap-3">
          <Button 
            onClick={() => playAudio(words[currentWordIndex].name)} 
            variant="outline" 
            size="sm" 
            disabled={audioLoading}
            className="flex items-center gap-2"
          >
            {audioLoading ? "Playing..." : "Play Audio"}
          </Button>
          
          {!showTranslation && (
            <Button
              onClick={revealTranslation}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Reveal Translation
            </Button>
          )}
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="text-xl p-5 flex-1" 
          variant={feedback && words[currentWordIndex].group === "I" ? "default" : "outline"} 
          onClick={() => !isAnswered && checkAnswer("I")}
          disabled={isAnswered}
        >
          I (五段動詞)
        </Button>
        <Button 
          className="text-xl p-5 flex-1" 
          variant={feedback && words[currentWordIndex].group === "II" ? "default" : "outline"} 
          onClick={() => !isAnswered && checkAnswer("II")}
          disabled={isAnswered}
        >
          II (一段動詞)
        </Button>
        <Button 
          className="text-xl p-5 flex-1" 
          variant={feedback && words[currentWordIndex].group === "III" ? "default" : "outline"} 
          onClick={() => !isAnswered && checkAnswer("III")}
          disabled={isAnswered}
        >
          III (不規則動詞)
        </Button>
      </div>

      {/* Feedback area */}
      {feedback && (
        <div className={`text-xl p-4 rounded-lg ${feedback.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="font-bold mb-2">
            {feedback.isCorrect ? "✓ " : "✗ "}{feedback.message}
          </div>
          <div>
            {feedback.explanation}
          </div>
        </div>
      )}

      {/* Next or restart buttons */}
      {isAnswered && (
        <div className="flex justify-center mt-4">
          <Button onClick={nextWord} className="px-8">
            {currentWordIndex === words.length - 1 ? "Finish" : "Next Word"}
          </Button>
        </div>
      )}

      {/* Show results at the end */}
      {currentWordIndex === words.length - 1 && isAnswered && (
        <div className="text-center mt-8">
          <div className="text-xl font-bold mb-2">
            Final Score: {score.correct} out of {words.length}
          </div>
          <Button onClick={restartQuiz} variant="outline" className="mt-2">
            Restart Quiz
          </Button>
        </div>
      )}
    </div>
  )
}