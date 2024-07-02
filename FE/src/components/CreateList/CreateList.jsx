import React, { useState, useEffect } from "react";
import styles from "./CreateList.module.css";
import Plus from "../../assets/images/Plus.png";
import Delete from "../../assets/images/Delete.png";
import Arrow from "../../assets/images/Arrow.png";
import Dashboard from "../Dashboard/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { postCreateList, putEditList } from "../../apis/proManage";
import { getAssignie } from "../../apis/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateList(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [listUserId]=useState(state?.userId)
  const userId = localStorage.getItem("userId");

  const [stateId] = useState(state?.id);
  const [stateData] = useState(state?.listDetails);
  const userEmail = localStorage.getItem("userEmail");
  const [formData, setFormData] = useState(
    state ? stateData: 
        {
          priority: "",
          title: "",
          date: "",
          list: { 1: "" },
          checkList: { 1: "no" },
          users: [userEmail],
        }
  );

  const [assignee, setAssignee] = useState([]);
  const [toggleDisplay,setToggleDisplay]=useState(false)

  const handleEmail = (element) => {
    if (userId!==listUserId){
      toast.info("Only admin can edit assignee")
      return
    }
    setToggleDisplay(false)
    if (formData.users.length > 1 && formData.users[1]===element) {
      setFormData((prev) => ({
        ...prev,
        users: [prev.users[0]],
      }));
    } else if(formData.users.length > 1 && formData.users[1]!==element) {
      setFormData((prev) => ({
        ...prev,
        users: [prev.users[0],element],
      }));
    }
      else {
      setFormData({
        ...formData,
        users: [...formData.users, element],
      });
    }
  };

  useEffect(() => {
    fetchAssignee();
  }, []);

  const fetchAssignee = async () => {
    try {
      const response = await getAssignie();
      setAssignee(response.assignie);
    } catch (error) {
      toast.info("Loading assignees failed.");
    }
  };

  const [listCount, setListCount] = useState(1);
  const [priorityBg, setPriorityBg] = useState(state ? stateData.priority: "");

  const handlePriority = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority: priority,
    }));
    setPriorityBg(priority);
  };

  const handleAdd = () => {
    const newListCount = listCount + 1;

    setFormData((prev) => ({
      ...prev,
      list: {
        ...prev.list,
        [newListCount]: "",
      },
      checkList: {
        ...prev.checkList,
        [newListCount]: "no",
      },
    }));
    setListCount(newListCount);
  };

  const handleDelete = (index) => {
    const updatedList = { ...formData.list };
    const updatedCheckList = { ...formData.checkList };

    delete updatedList[index];
    delete updatedCheckList[index];

    const reorderedList = {};
    const reorderedCheckList = {};
    Object.keys(updatedList).forEach((key, newIndex) => {
      reorderedList[newIndex + 1] = updatedList[key];
      reorderedCheckList[newIndex + 1] = updatedCheckList[key];
    });

    setFormData((prev) => ({
      ...prev,
      list: reorderedList,
      checkList: reorderedCheckList,
    }));
    setListCount((prev) => prev - 1);
  };

  const handleChange = (event, index) => {
    const { value } = event.target;

    setFormData((prev) => ({
      ...prev,
      list: {
        ...prev.list,
        [index]: value,
      },
    }));
  };

  const handleDate = (event) => {
    const { value } = event.target;
    const dateObj = new Date(value);
    const formattedDate = `${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}/${dateObj.getFullYear()}`;
    setFormData((prev) => ({
      ...prev,
      date: formattedDate,
    }));
  };

  const handleCheckBox = (key) => {
    setFormData((prev) => ({
      ...prev,
      checkList: {
        ...prev.checkList,
        [key]: prev.checkList[key] === "no" ? "yes" : "no",
      },
    }));
  };
  
  const handleSave = async () => {
    function checkAllValues(obj) {
      const { assign, ...rest } = obj;
      for (let key in rest) {
        if (typeof rest[key] === "object" && rest[key] !== null) {
          if (!checkAllValues(rest[key])) {
            return false;
          }
        } else {
          if (!rest[key] && key !== "assign") {
            return false;
          }
        }
      }
      return true;
    }

    const allKeysFilled = checkAllValues(formData);
    if (!allKeysFilled) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    
      if (state?.edit) {
        const response = await putEditList(stateId, formData);
        if (response.message) {
          toast.success(response.message);
          navigate("/dashboard");
        }
        if (response.errormessage) {
          toast.error(response.errormessage);
        }
      } 
   else{
          const response = await postCreateList(formData);
        if (response.message) {
          toast.success(response.message);
          navigate("/dashboard");
        }
        if (response.errormessage) {
          toast.error(response.errormessage);
        }
        }
      
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.background}></div>
      <div className={styles.CreateListContainer}>
        <div className={styles.Title}>
          <p>Title&nbsp;<span>*</span></p>
        </div>
        <div className={styles.TitleName}>
          <input
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter Task Title"
          />
        </div>
        <div className={styles.Priority}>
          <p>Select&nbsp;Priority&nbsp;<span>*</span></p>
          <button
            className={priorityBg === "High" ? styles.priorityBg : ""}
            onClick={() => handlePriority("High")}
          >
            <p className={styles.high}></p>
            HIGH&nbsp;PRIORITY
          </button>
          <button
            className={priorityBg === "Moderate" ? styles.priorityBg : ""}
            onClick={() => handlePriority("Moderate")}
          >
            <p className={styles.moderate}></p>
            MODERATE&nbsp;PRIORITY
          </button>
          <button
            className={priorityBg === "Low" ? styles.priorityBg : ""}
            onClick={() => handlePriority("Low")}
          >
            <p className={styles.low}></p>
            LOW&nbsp;PRIORITY
          </button>
        </div>

        <div className={styles.select}>
          Assign&nbsp;to
          <div onClick={()=>setToggleDisplay(!toggleDisplay)}> {formData.users.length > 1 ? formData.users[1] : "Add an assignee"}
           
            <img src={Arrow} alt="arrow" />
          </div>
        </div>
        {assignee.length>0 && toggleDisplay&&<div id={styles.option}>
          {assignee.map((element) => (
            <div key={element}>
              <div className={styles.initial}>{element.slice(0, 2).toUpperCase()}</div>
              {element}
              <button
                className={styles.optionButton}
                onClick={() => handleEmail(element)} 
              >
                Assign
              </button>
            </div>
          ))}
        </div>}

        <div className={styles.Checklist}>
          Checklist&nbsp;(
          {Object.keys(formData.checkList).filter(
            (key) => formData.checkList[key] === "yes"
          ).length}/
          {Object.keys(formData.checkList).length})&nbsp;<span>*</span>
        </div>
        <div className={styles.tasks}>
          {Object.keys(formData.list).map((key, index) => (
            <div className={styles.task} key={key}>
              <label
                onClick={() => handleCheckBox(key)}
                className={styles.container}
              >
                <input
                  type="checkbox"
                  checked={formData.checkList[key] === "yes"}
                  onChange={() => handleCheckBox(key)}
                />
                <span className={styles.checkmark}></span>
              </label>
              <input
                className={styles.list}
                placeholder="Task"
                value={formData.list[key]}
                onChange={(e) => handleChange(e, key)}
              />
              <img
                src={Delete}
                onClick={() => handleDelete(key)}
                alt="Delete task"
              />
            </div>
          ))}
        </div>
        <div className={styles.Add}>
          <img onClick={handleAdd} src={Plus} alt="Add task" />
          <p onClick={handleAdd}>Add New</p>
        </div>
        <div className={styles.button}>
        {/* <div>Select Due Date</div> */}
          <input
            onChange={handleDate}
           
            type="date"
          />
          <div>
            <button onClick={() => navigate("/dashboard")} className={styles.btn2}>
              Cancel
            </button>
            <button className={styles.btn1} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
     <div ><Dashboard /></div> 
    </>
  );
}

