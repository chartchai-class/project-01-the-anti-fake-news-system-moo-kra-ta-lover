import axios from "axios";

const apiclient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,

    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default apiclient;   