import React, { useEffect, useState } from "react";
import styles from "./Question.module.css";
import Cup from "../../assets/images/Cup.png";
import { useParams } from "react-router-dom";
import { getQuiz, putImpression } from "../../apis/quiz";

export default function Question() {
  const { quizId } = useParams();
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOptions] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [finished, setFinished] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const fetchQuiz = async () => {
    if (!quizId) {
      return;
    }
    const response = await getQuiz(quizId);
    setQuestion(response);
    if (response.timer && response.timer !== "0") {
      setTimeLeft(parseInt(response.timer));
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (
      question.timer &&
      question.timer !== "0" &&
      timeLeft === 0 &&
      currentQuiz === Object.keys(question.quiz).length - 1
    ) {
      completed();
    }
  }, [currentQuiz, timeLeft, question.timer]);

  useEffect(() => {
    if (question.timer && question.timer !== "0") {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      if (timeLeft === 0) {
        clearInterval(timer);
        if (currentQuiz < Object.keys(question.quiz).length - 1) {
          goToNextQuestion();
        }
      }

      return () => clearInterval(timer);
    }
  }, [currentQuiz, timeLeft, question.timer]);

  const goToNextQuestion = () => {
    if (currentQuiz < Object.keys(question.quiz).length - 1) {
      setCurrentQuiz((prevQuiz) => prevQuiz + 1);
      setTimeLeft(parseInt(question.timer));
    }
  };
  const handleClick = (quizNo, optionKey) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [quizNo]: optionKey,
    }));
  };

  const completed = async () => {
    if (!quizId) {
      return;
    }
    const response = await putImpression(quizId, selectedOption);
    if (response !== null && response !== undefined) {
      setFinished(response);
    } else {
      setFinished(null);
    }
  };

  return (
    <div className={styles.QuestionContainer}>
      {finished === null && (
        <div className={styles.Question}>
          <div className={styles.Timer}>
            <p className={styles.TimerQuestionNumber}>
              {question.quiz &&
                `0${currentQuiz + 1}/0${Object.keys(question.quiz).length}`}
            </p>
            {!question.timer || question.timer === "0" ? (
              <div></div>
            ) : (
              <p className={styles.TimerNumber}>{`00:${
                timeLeft < 10 ? "0" + timeLeft : timeLeft
              }s`}</p>
            )}
          </div>

          {question.quiz &&
            Object.entries(question.quiz).map(
              ([quizNo, quizData], index) =>
                index === currentQuiz && (
                  <div className={styles.quizNo} key={quizNo}>
                    <p className={styles.QuestionName}>{quizData.question} ?</p>
                    <div className={styles.Options}>
                      {Object.entries(quizData.option).map(
                        ([optionKey, optionValue]) => (
                          <div
                            className={`${styles.Option} ${
                              selectedOption[quizNo] === optionKey
                                ? styles.SelectedOption
                                : ""
                            }`}
                            onClick={() => handleClick(quizNo, optionKey)}
                            key={optionKey}
                          >
                            <>
                              {optionValue.text && (
                                <div>{optionValue.text}</div>
                              )}
                              {optionValue.image && (
                                <div
                                  style={{
                                    backgroundImage: `url('${optionValue.image}')`,
                                    backgroundSize: "cover",
                                  }}
                                ></div>
                              )}
                            </>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
            )}

          {currentQuiz === Object.keys(question.quiz ?? {}).length - 1 ? (
            <button onClick={completed}>SUBMIT</button>
          ) : (
            <button onClick={goToNextQuestion}>NEXT</button>
          )}
        </div>
      )}
      {finished !== null && finished !== "Poll" && (
        <div className={styles.Completed}>
          <h1>Congrats Quiz is completed</h1>
          <img src={Cup} alt="Cup" />
          <p>
            Your Score is{" "}
            <span>
              0{finished}/0{Object.keys(question.quiz).length}
            </span>
          </p>
        </div>
      )}
      {finished !== null && finished === "Poll" && (
        <div className={styles.Completed}>
          <h1>Thank you for participating in the Poll</h1>
        </div>
      )}
    </div>
  );
}
