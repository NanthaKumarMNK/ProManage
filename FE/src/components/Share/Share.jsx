import React, { useState, useEffect } from 'react';
import styles from './Share.module.css';
import ProManager from '../../assets/images/Pro_Manager.png';
import { getList } from '../../apis/proManage';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parse, isAfter } from 'date-fns';

export default function Share() {
  const [task, setTask] = useState(null);
  const [statusStyles, setStatusStyles] = useState({});
  const { listId } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getList(listId);
        if (response.errorMessage) {
          toast.error(response.errorMessage);
        } else {
          setTask(response);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to fetch task.');
      }
    };

    fetchTask();
  }, [listId]);

  useEffect(() => {
    const getStatusStyles = () => {
      if (!task) return {}; 

      if (task.status === 'Done') {
        return { backgroundColor: '#63C05B', color: 'white' };
      } else if (isAfter(parse(task.date, 'MM/dd/yyyy', new Date()), new Date())) {
        return { backgroundColor: '#FF2473', color: 'white' };
      } else {
        return {}; 
      }
    };

    setStatusStyles(getStatusStyles());
  }, [task]); 
  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
    return format(parsedDate, 'MMM d');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.ShareContainer}>
        <div className={styles.heading}>
          <img src={ProManager} alt="ProManager Logo" />
          <p>Pro Manage</p>
        </div>

        <div className={styles.status}>
          <div className={styles.task}>
            <div className={styles.priority}>
              <div>
                <div
                  className={
                    task && task.priority === 'High'
                      ? styles.high
                      : task && task.priority === 'Moderate'
                      ? styles.moderate
                      : styles.low
                  }
                ></div>
                <span>{task && task.priority.toUpperCase()} PRIORITY</span>
              </div>
            </div>
            <h1>{task && task.title}</h1>
            <div className={styles.Checklist}>
              <p>
                Checklist{' '}
                {task &&
                  `(${Object.keys(task.checkList).filter((key) => task.checkList[key] === 'yes').length}/
                  ${Object.keys(task.checkList).length})`}
              </p>
            </div>

            <div className={styles.scroll}>
              {task &&
                Object.keys(task.list).map((key) => (
                  <div className={styles.List} key={key}>
                    <label className={styles.container}>
                      <input type="checkbox" checked={task.checkList[key] === 'yes'} readOnly />
                      <span className={styles.checkmark}></span>
                    </label>
                    <p>{task.list[key]}</p>
                  </div>
                ))}
            </div>

            <div className={styles.button}>
              <p className={styles.due}>Due Date</p>
              <p
  className={styles.date}
  style={{
    backgroundColor:
      task && task.status !== 'Done' && isAfter(new Date(), parse(task.date, 'MM/dd/yyyy', new Date()))
        ? '#CF3636'
        : '',
    color:
      task && task.status !== 'Done' && isAfter(new Date(), parse(task.date, 'MM/dd/yyyy', new Date()))
        ? 'white'
        : '',
  }}
>
  {formatDate(task && task.date)}
</p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
