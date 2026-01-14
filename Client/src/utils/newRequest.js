import axios from "axios";

const newRequest = axios.create({
  // baseURL: "http://localhost:3000/api/",
  baseURL: "https://gigflow-platform-lfjc.onrender.com/api/",
  withCredentials: true,
});

export default newRequest;
