import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URI;

export const registerUser = async (formData) => {
  try {
  
    const reqUrl = `${backendUrl}/auth/register`;
    const response = await axios.post(reqUrl, formData);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (formData) => {
  try {
    const reqUrl = `${backendUrl}/auth/login`;
    const response = await axios.post(reqUrl, formData);
    return response.data;
  } catch (error) {
    return(error.response.data);
  }
};

export const getUserData = async (userId) => {
  try {
    const reqUrl = `${backendUrl}/auth/getUserData/${userId}`;
    const response = await axios.get(reqUrl);
    return(response.data);
  } catch (error) {
    console.log(error)
    return(error.response.data);
  }
};

export const putUserData = async (userId,formData) => {
  try {
      const reqUrl = `${backendUrl}/auth/putUserData/${"66572ebf9a2fcba55b0cd8c5"}`;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.put(reqUrl,formData);
      return response.data;
  } catch (error) {
      console.log(error);
      return error.response.data;
     
  }
};

export const putUser = async (formData) => {
  try { 
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const reqUrl = `${backendUrl}/auth/putUser/${userId}`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(formData)
      const response = await axios.put(reqUrl,formData);
      return response.data;
  } catch (error) {
      return error.response.data;
     
  }
};

export const getAssignie = async () => {
  try {
    const userId= localStorage.getItem("userId")
   
    const reqUrl = `${backendUrl}/auth/getAssignie/${userId}`;
    const response = await axios.get(reqUrl);

    return(response.data);
  } catch (error) {
   
    return(error.response.data);
  }
};