import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URI;

export const getAllList = async (status, date) => {
  try {
    const email = localStorage.getItem("userEmail");
    const reqUrl = `${backendUrl}/proManage/getAllList/${email}?status=${status}&date=${date}`;
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAnalytics = async () => {
  try {
    const reqUrl = `${backendUrl}/proManage/getAnalytics`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getList = async (listId) => {
  try {
    const reqUrl = `${backendUrl}/proManage/list/${listId}`;
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    return response.data;
  }
};

export const deleteList = async (listId) => {
  try {
    const reqUrl = `${backendUrl}/proManage/delete/${listId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.delete(reqUrl);
    return response;
  } catch (error) {
    return response;
  }
};

export const postCreateList = async (formData) => {
  try {
    const reqUrl = `${backendUrl}/proManage/createList`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(reqUrl, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const putEditList = async (listId, formData) => {
  try {
    const reqUrl = `${backendUrl}/proManage/editList/${listId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.put(reqUrl, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const putList = async (listId, formData) => {
  try {
    const reqUrl = `${backendUrl}/proManage/putList/${listId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.put(reqUrl, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
