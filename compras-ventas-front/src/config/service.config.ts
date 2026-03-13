import axios from "axios"

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
        let token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJfZWRtdW5kLnplbWxha0B5YWhvby5jb20iLCJzdWIiOiJlZG11bmQuemVtbGFrQHlhaG9vLmNvbSIsImlhdCI6MTc3MzM2ODcxMywiZXhwIjoxNzczMzY5NjEzfQ.bEUagVw4IzfuG098Bs-UUfZDKJnVCLgGLNbDUAUoYO8sxudJhLr3OgqXjMgeve95op999-cVYakxKW-igpibXg'
        if(token){
            config.headers['Authorization']= `Bearer ${token}`
        }
        return config;
    }
)

apiClient.interceptors.response.use(
    
)