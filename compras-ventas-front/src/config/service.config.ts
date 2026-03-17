import { AuthService } from "@/service/auth.service";
import axios from "axios"
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    async (config: any) => {
        let token = Cookies.get('token')
        if(token && AuthService.isTokenExpired()){
            try {
                token = (await apiClient.post('/login/refresh-token')).data.token;
            } catch (error) {
                throw new Error('Error refreshing token');
            }
        } else {
            config.headers['Authorization']= `Bearer ${token}`
            return config;
        }
        if(token){
            config.headers['Authorization']= `Bearer ${token}`
        }
        return config;
    }
)

apiClient.interceptors.response.use(
    
)