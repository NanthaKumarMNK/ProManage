import React, { useState, useEffect } from "react";
import styles from "./List.module.css";
import close from "../../assets/images/close.png";
import Dot from "../../assets/images/Dot.png";
import ArrowDown from "../../assets/images/ArrowDown.png";
import ArrowUp from "../../assets/images/ArrowUp.png";
import Plus from "../../assets/images/Plus.png";
import { DEFAULT_STATUS } from "../../utils/Headings";
import { getAllList, putList } from "../../apis/proManage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, isBefore, parse } from "date-fns";

export default function List(props) {

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [toggleArrow, setToggleArrow] = useState({});
  const [list, setList] = useState(null);

  const [update, setUpdate] = useState(true);

  const fetchAllList = async (status, date) => {
    const response = await getAllList(status, date);
    setList(response);
  };

  useEffect(() => {
    fetchAllList(props.list, props.selectedFilter);
  }, [props.list, props.selectedFilter, update, props.render]);

  useEffect(() => {
    if (list && Array.isArray(list)) {
      const updatedToggleArrow = {};
      list.forEach((_, index) => {
        updatedToggleArrow[index.toString()] = true;
      });
      setToggleArrow(updatedToggleArrow);
    }
  }, [list]);

  const handleToggleArrow = (index) => {
    setToggleArrow((prevToggleArrow) => ({
      ...prevToggleArrow,
      [index]: !prevToggleArrow[index],
    }));
  };

  const handleDotClick = (taskId) => {
    setActiveTaskId(taskId === activeTaskId ? null : taskId);
  };

  const handleToggleAllFalse = () => {
    const updatedToggleArrow = {};
    Object.keys(toggleArrow).forEach((key) => {
      updatedToggleArrow[key] = false;
    });
    setToggleArrow(updatedToggleArrow);
  };

  const handleCheckbox = async (listId, listKey, checkList) => {
    const formData = {
      checkList: { [listKey]: checkList === "yes" ? "no" : "yes" },
    };
    const response = await putList(listId, formData);
    if (response.message) {
      toast.error(response.message);
    } else {
      setUpdate(!update);
    }
  };

  const handleButtonClick = async (listId, status) => {
    if (status === "Progress") {
      status = "In Progress";
    } else if (status === "To-do") {
      status = "To do";
    }
    const formData = { status: status };
    const response = await putList(listId, formData);
    if (response.message) {
      toast.error(response.message);
    } else {
      props.handleRender();
    }
  };

  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split("/");
    const formattedDate = new Date(`${month}/${day}/${year}`);
    return format(formattedDate, "MMM do");
  };

  const isPastDate = (dateString) => {
    const [month, day, year] = dateString.split("/");
    const taskDate = new Date(`${year}-${month}-${day}`);
    return isBefore(taskDate, new Date());
  };
  const copyText = (listId) => {
    const textToCopy =  `https://09nantha10-gmail-com-cuvette-final-evaluation-may.vercel.app/share/${listId}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Link copied");
  };
  const [isHovered, setIsHovered] = useState("");
  const [activeHoverId, setActiveHoverId] = useState(null);

  const handleMouseOver = (taskId, element) => {
    setIsHovered(element);
    setActiveHoverId(taskId);
  };

  const handleMouseOut = () => {
    setIsHovered("");
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.status}>
        <div className={styles.backlog}>
          <p>{props.list}</p>
          <div>
            <img
              onClick={() => navigate("/create")}
              style={{ display: props.list === "To do" ? "block" : "none" }}
              src={Plus}
              alt="plus"
            />
            <img onClick={handleToggleAllFalse} src={close} alt="close" />
          </div>
        </div>
        <div className={styles.scrolly}>
          {list && list.response && (
            <div className={styles.response}>{list.response}</div>
          )}
          {list &&
            Array.isArray(list) &&
            list.map((task, index) => (
              <div key={task._id} className={styles.task}>
                <div className={styles.priority}>
                  <p>
                    <div
                      className={
                        task.priority === "High"
                          ? styles.high
                          : task.priority === "Moderate"
                          ? styles.moderate
                          : styles.low
                      }
                    ></div>
                    <span>{task.priority.toUpperCase()}&nbsp;PRIORITY</span>
                    {task.users[1] && task.users[1] !== userEmail && (
                      <div
                        className={styles.Assignee}
                        onMouseOver={() => handleMouseOver(task._id, "email")}
                        onMouseOut={handleMouseOut}
                      >
                        {task.users[1] &&
                          task.users[1].slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </p>
                  <img
                    onClick={() => handleDotClick(task._id)}
                    src={Dot}
                    alt="dot"
                  />
                </div>
                <h1
                  className={styles.title}
                  onMouseOver={() => handleMouseOver(task._id, "title")}
                  onMouseOut={handleMouseOut}
                >
                  {task?.title && task.title.length > 20
                    ? `${task.title.slice(0, 20)}...`
                    : task.title}
                </h1>
                <div className={styles.Checklist}>
                  {Object.keys(task.list).length > 0 && (
                    <p>
                      Checklist&nbsp;(
                      {
                        Object.keys(task.checkList).filter(
                          (key) => task.checkList[key] === "yes"
                        ).length
                      }
                      /{Object.keys(task.checkList).length})
                    </p>
                  )}
                  <img
                    onClick={() => handleToggleArrow(index.toString())}
                    style={{
                      display: toggleArrow[index.toString()] ? "none" : "flex",
                    }}
                    src={ArrowUp}
                    alt="arrow-up"
                  />
                  <img
                    onClick={() => handleToggleArrow(index.toString())}
                    style={{
                      display: toggleArrow[index.toString()] ? "flex" : "none",
                    }}
                    src={ArrowDown}
                    alt="arrow-down"
                  />
                </div>
                {Object.keys(task.list).map((key) => (
                  <div
                    key={key}
                    style={{
                      display: toggleArrow[index.toString()] ? "flex" : "none",
                    }}
                    className={styles.List}
                  >
                    <label className={styles.container}>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckbox(task._id, key, task.checkList[key])
                        }
                        checked={task.checkList[key] === "yes"}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <p>{task.list[key]}</p>
                  </div>
                ))}
                <div className={styles.button}>
                  <p
                    style={{
                      backgroundColor:
                        task.status === "Done"
                          ? "#63C05B"
                          : task.status !== "Done" && isPastDate(task.date)
                          ? "#CF3636"
                          : null,
                      color:
                        task.status === "Done"
                          ? "white"
                          : task.status !== "Done" && isPastDate(task.date)
                          ? "white"
                          : null,
                    }}
                  >
                    {formatDate(task.date)}
                  </p>
                  <span>
                    {DEFAULT_STATUS.map((button, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleButtonClick(task._id, button);
                        }}
                        style={{
                          display: props.index !== idx ? "flex" : "none",
                        }}
                      >
                        {button}
                      </button>
                    ))}
                  </span>
                </div>
                <div
                  style={{
                    display: activeTaskId === task._id ? "block" : "none",
                  }}
                  className={styles.action}
                >
                  <div
                    onClick={() =>
                      navigate("/create", {
                        state: {
                          id: task._id,
                          userId: task.userId,
                          listDetails: {
                            title: task.title,
                            status: task.status,
                            priority: task.priority,
                            list: task.list,
                            checkList: task.checkList,
                            date: task.date,
                            users: task.users,
                          },
                          edit: true,
                        },
                      })
                    }
                  >
                    Edit
                  </div>
                  <div onClick={() => copyText(task._id)}>Share</div>
                  <div
                    onClick={() =>
                      task.userId === userId
                        ? navigate(`/delete/${task._id}`)
                        : toast.warning("Only Admin can delete")
                    }
                    style={{ color: "#CF3636" }}
                  >
                    Delete
                  </div>
                </div>
                <div
                  className={`${styles.hoverEmail} ${
                    task._id === activeHoverId && isHovered === "email"
                      ? styles.hover
                      : ""
                  }`}
                >
                  {task?.users[1] && task.users[1]}
                </div>
                <div
                  className={`${styles.hoverTitle}  ${
                    task._id === activeHoverId && isHovered === "title"
                      ? styles.hover
                      : ""
                  }`}
                >
                  {task?.title && task?.title}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
