import { AuthService } from "@/service/auth.service";
import { AuthRequest } from "@/types/request/AuthRequest";
import { useState } from "react"

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (authRequest: AuthRequest) => {
        setLoading(true);
        setError('');
        try {
            const response = await AuthService.login(authRequest);
            return response;
        } catch (error) {
            if(error instanceof Error){
                setError(error.message)
                throw error;
            }
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        setError('');
        try {
            const response  = await AuthService.logout();
            return response;
        } catch (error) {
            if(error instanceof Error){
                setError(error.message)
                throw error;
            }
        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        logout,
        loading,
        error
    }
}