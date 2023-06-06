import axios from "axios";

const api = axios.create({
    baseURL:'http://10.201.30.192:8080/', //ip do tce
    //baseURL:'http://192.168.251.116:8080/', //ip da undb
    //baseURL:'http://192.168.3.20:8080/', //ip de casa
});

export default api;