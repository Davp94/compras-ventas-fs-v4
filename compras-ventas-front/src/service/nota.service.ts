import { apiClient } from "@/config/service.config";
import { NotaRequest } from "@/types/request/NotaRequest";
import { NotaResponse } from "@/types/response/NotaResponse";

export class NotaService {
    public static async create(nota: NotaRequest): Promise<NotaResponse> {
        try {
            const response = await apiClient.post<NotaResponse>("/notas", nota);
            return response.data;
        } catch (error) {
            throw new Error("Error creando nota: " + error);
        }
    }

    public static async getAll(): Promise<NotaResponse[]> {
        try {
            const response = await apiClient.get<NotaResponse[]>("/notas");
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo notas: " + error);
        }
    }
}
