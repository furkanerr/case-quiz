import React, { useState, useEffect, useRef } from "react";
import Results from "../Result/index";
import "./QuizScreen.css"
const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [disableOptions, setDisableOptions] = useState(true);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [initialTimeLeft, setInitialTimeLeft] = useState(10);

  const questionTimerRef = useRef(null);

  // Soruları API'den çek ve şıkları ayrıştır
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        const questionsList = data.slice(0, 10).map((item) => {
          const options = item.body
            .split("\n")
            .slice(0, 4)
            .map((option, index) => ({
              id: String.fromCharCode(65 + index), // A, B, C, D şeklinde id'ler
              text: option.trim(),
            }));
          const correctOptionIndex = Math.floor(Math.random() * options.length);
          return {
            id: item.id,
            question: item.title,
            options: options,
            answer: options[correctOptionIndex].text,
          };
        });
        setQuizQuestions(questionsList);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };

    fetchQuestions();
  }, []);

  // Soru zamanlayıcıyı başlat
  useEffect(() => {
    if (currentQuestionIndex >= quizQuestions.length) return;

    setQuestionTimeLeft(30);
    setInitialTimeLeft(10);
    setDisableOptions(true);

    // İlk 10 saniyeyi başlat
    const initialTimer = setInterval(() => {
      setInitialTimeLeft((prevInitialTime) => {
        if (prevInitialTime > 1) {
          return prevInitialTime - 1;
        } else {
          setDisableOptions(false); // 10 saniye dolduktan sonra şıkları aktif yap
          clearInterval(initialTimer); // İlk zamanlayıcıyı temizle
          return 0;
        }
      });
    }, 1000);

    // Genel zamanlayıcıyı başlat
    questionTimerRef.current = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(questionTimerRef.current);
          handleNextQuestion();
          return 0;
        }
      });
    }, 1000);

    // Temizlik işlemi
    return () => {
      clearInterval(questionTimerRef.current);
      clearInterval(initialTimer);
    };
  }, [currentQuestionIndex]);

  const checkAnswer = (option) => {
    if (!disableOptions) {
      setAnswered(true);
      setSelectedOption(option);
      const correctAnswer = quizQuestions[currentQuestionIndex].answer;
      setResults((prevResults) => [
        ...prevResults,
        {
          question: quizQuestions[currentQuestionIndex].question,
          selectedOption: option,
          correctOption: correctAnswer,
        },
      ]);

      // 2 saniye sonra otomatik olarak diğer soruya geç
      setTimeout(handleNextQuestion, 2000); // 2000 ms = 2 saniye
    }
  };

  const handleNextQuestion = () => {
    setAnswered(false);
    setSelectedOption(null);
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= quizQuestions.length) {
        setShowResults(true);
      }
      return nextIndex;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getOptionStyle = (option) => {
    if (answered) {
      if (option === quizQuestions[currentQuestionIndex].answer) {
        return { backgroundColor: "#12D18E", color: "white" };
      } else if (option === selectedOption) {
        return { backgroundColor: "#F85E5E", color: "white" };
      }
    }
    return { backgroundColor: "#B05BF7", color: "white" };
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswered(false);
    setSelectedOption(null);
    setResults([]);
    setShowResults(false);
    setDisableOptions(true);
    setQuestionTimeLeft(30);
    setInitialTimeLeft(10);
  };

  if (showResults) {
    return <Results results={results} restartQuiz={restartQuiz} />;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div
    className="container"
      style={{ padding: "20px", backgroundColor: "#B05BF7", color: "white" }}
    >
      <div className="question-container" style={{ marginBottom: "20px" }}>
        <h1>Soru: {currentQuestion.question}</h1>
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            disabled={disableOptions}
            onClick={() => checkAnswer(option.text)}
            style={{
              ...getOptionStyle(option.text),
              padding: "10px",
              margin: "5px",
              border:"1px solid white",
              borderRadius: "5px",
            }}
          >
            {option.id}. {option.text}
          </button>
        ))}
        <div style={{ marginTop: "20px" }}>
          <p>Kalan Zaman: {formatTime(questionTimeLeft)}</p>
          <p>Butonların aktif olması için kalan zaman: {initialTimeLeft} seconds</p>{" "}
          {/* İlk 10 saniyeyi göster */}
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            Question {currentQuestionIndex + 1} / {quizQuestions.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
