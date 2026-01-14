import axios from "axios";

const newRequest = axios.create({
  // baseURL: "http://localhost:3000/api/",
  baseURL: "https://gigflow-api.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;
