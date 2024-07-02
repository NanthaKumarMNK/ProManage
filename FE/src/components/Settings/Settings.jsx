import React, { useState,useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Settings.module.css';
import Email from '../../assets/images/Email.png';
import Eye from '../../assets/images/Eye.png';
import Lock from '../../assets/images/Lock.png';
import Name from '../../assets/images/Name.png';
import { getUserData,putUserData } from '../../apis/auth'; 
import Logout from '../Logout/Logout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate=useNavigate()
  const [displayBg,setDisplayBg]=useState("")
  const [formData, setFormData] = useState({
    name: '',
    oldPassword: '',
    email: '',
    newPassword: '',
  });
  const userId=localStorage.getItem("userId")
  const handleComponent = (comp) => {
    setDisplayBg(comp)
  };
  const [wrongResponse,serWrongResponse]=useState({})
  const fetchUserData = async () => {
 
      const response = await getUserData(userId);
      setFormData((prev) => ({
        ...prev,
        name: response.name,
        email: response.email,
      }));
  };
  useEffect(() => {
   fetchUserData()
  }, []);

  const [toggleVisibility, setToggleVisibility] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setToggleVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const response = await putUserData(userId,formData);
      
      if (Object.keys(response).length !== 0) {
        if (response.password || response.email) {
            localStorage.clear();
            navigate("/");
        }
        if (response.name) {
            formData.name = response.userToUpdate.name; 
        }
    }

    if (response.errorMessage) {
        toast.error(response.errorMessage);
        return;
    }
    if (Object.keys(response).length === 0) {
        toast.info('No change');
    }
      
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    {displayBg !==''&& <div className={styles.background}></div>}
    {displayBg ==='Logout'&& <Logout handleComponent={handleComponent}/>}
    <div className={styles.settingsContainer}>
      <Navbar handleComponent={handleComponent}/>
      <div className={styles.Settings}>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <img className={styles.img} src={Name} alt="Name" />
            <input
              name="name"
              type="text"
              value={formData.name}
              placeholder="Name"
              onChange={handleInputChange}
            />
          </div>
          {wrongResponse?.name && <span>{wrongResponse?.name}</span>}
          <div>
            <img className={styles.img} src={Email} alt="Email" />
            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Updated Email"
              onChange={handleInputChange}
            />
          </div>
          {wrongResponse?.email && <span>{wrongResponse?.email}</span>}
          <div>
            <img className={styles.img} src={Lock} alt="Old Password" />
            <input
              name="oldPassword"
              type={toggleVisibility.oldPassword ? 'text' : 'password'}
              value={formData.oldPassword}
              placeholder="Old Password"
              onChange={handleInputChange}
            />
            <img
              onClick={() => togglePasswordVisibility('oldPassword')}
              className={styles.Eye}
              src={Eye}
              alt="Toggle Old Password Visibility"
            />
          </div>
          {wrongResponse?.oldPassword && <span>{wrongResponse?.oldPassword}</span>}
          <div>
            <img className={styles.img} src={Lock} alt="New Password" />
            <input
              name="newPassword"
              type={toggleVisibility.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              placeholder="New Password"
              onChange={handleInputChange}
            />
            <img
              onClick={() => togglePasswordVisibility('newPassword')}
              className={styles.Eye}
              src={Eye}
              alt="Toggle New Password Visibility"
            />
          </div>
          {wrongResponse?.newPassword && <span>{wrongResponse?.newPassword}</span>}
          <button type="submit" className={styles.Btn}>
            Update
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
