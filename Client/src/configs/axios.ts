import axios from "axios";


const BaseURL = import.meta.env.VITE_BASE_URL ||'http://localhost:3000';

const api = axios.create({ baseURL: BaseURL });

// console.log(BaseURL);

export default api;