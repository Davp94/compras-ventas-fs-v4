import { apiClient } from "@/config/service.config";
import { RolResponse } from "@/types/response/RolResponse";

export class AuthService {
    public static async login(username: string, password:string): Promise<any> {
        try {
            const response = await apiClient.post<any>("/login", {username: username, password: password})
            return response.data
        } catch (error) {
            throw new Error("Error autenticacion");
        }
    }
}