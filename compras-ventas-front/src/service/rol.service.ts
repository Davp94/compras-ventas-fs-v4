import { apiClient } from "@/config/service.config";
import { RolRequest } from "@/types/request/RolRequest";
import { RolResponse } from "@/types/response/RolResponse";

export class RolService {
  public static async create(rol: RolRequest): Promise<RolResponse> {
    try {
      const response = await apiClient.post<RolResponse>("/rol", rol);
      return response.data;
    } catch (error) {
      throw new Error("Error creando rol: " + error);
    }
  }

  public static async getById(id: number): Promise<RolResponse> {
    try {
      const response = await apiClient.get<RolResponse>(`/rol/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error obteniendo rol: " + error);
    }
  }

  public static async getAll(): Promise<RolResponse[]> {
    try {
      const response = await apiClient.get<RolResponse[]>("/rol");
      return response.data;
    } catch (error) {
      throw new Error("Error obteniendo roles: " + error);
    }
  }

  public static async update(
    id: number,
    rol: RolRequest,
  ): Promise<RolResponse> {
    try {
      const response = await apiClient.put<RolResponse>(`/rol/${id}`, rol);
      return response.data;
    } catch (error) {
      throw new Error("Error actualizando rol: " + error);
    }
  }

  public static async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/rol/${id}`);
    } catch (error) {
      throw new Error("Error eliminando rol: " + error);
    }
  }
}
