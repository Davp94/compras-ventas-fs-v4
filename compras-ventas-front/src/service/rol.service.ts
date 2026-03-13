import { apiClient } from "@/config/service.config";
import { RolResponse } from "@/types/response/RolResponse";

export class RolService {
    public static async getRoles(): Promise<RolResponse[]> {
        try {
            const response = await apiClient.get<RolResponse[]>("/rol")
            return response.data
        } catch (error) {
            throw new Error("Error recuperando los roles");
        }
    }
}