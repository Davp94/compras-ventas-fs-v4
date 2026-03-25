import { apiClient } from "@/config/service.config";
import { NotaRequest } from "@/types/request/NotaRequest";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { NotaResponse } from "@/types/response/NotaResponse";

export class NotaService {
    public static async create(nota: NotaRequest): Promise<any> {
        try {
            const response = await apiClient.post<any>("/notas", nota, {
                responseType: "blob", headers: {"Content-Type": "application/pdf"}
            });
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
    
    public static async getAllClientes(): Promise<ClienteProveedorResponse[]> {
        try {
            const response = await apiClient.get<ClienteProveedorResponse[]>("/notas/clientes");
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo clientes: " + error);
        }
    }
}
