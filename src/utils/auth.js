import axios from "axios";
import { BACKEND_URL } from "./constant";

export const verifyToken = async()=>{
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/auth/verify`,{},{
            Headers: {
                'Authorization' : token
            }
        });
        return response
    }
    catch(error){
        return new Error(error.response.data.message);
    }
}