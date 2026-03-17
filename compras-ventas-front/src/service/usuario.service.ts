import { apiClient } from "@/config/service.config";
import { UsuarioRequest } from "@/types/request/UsuarioRequest";
import { UsuarioResponse } from "@/types/response/UsuariosResponse";

export class UsuarioService {
  public static async create(
    usuario: UsuarioRequest,
  ): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.post<UsuarioResponse>(
        "/usuario",
        usuario,
      );
      return response.data;
    } catch (error) {
      throw new Error("Error creando usuario: " + error);
    }
  }

  public static async getById(id: number): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.get<UsuarioResponse>(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error obteniendo usuario: " + error);
    }
  }

  public static async getAll(): Promise<UsuarioResponse[]> {
    try {
      const response = await apiClient.get<UsuarioResponse[]>("/usuario");
      return response.data;
    } catch (error) {
      throw new Error("Error obteniendo usuarios: " + error);
    }
  }

  public static async update(
    id: number,
    usuario: UsuarioRequest,
  ): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.put<UsuarioResponse>(
        `/usuario/${id}`,
        usuario,
      );
      return response.data;
    } catch (error) {
      throw new Error("Error actualizando usuario: " + error);
    }
  }

  public static async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/usuario/${id}`);
    } catch (error) {
      throw new Error("Error eliminando usuario: " + error);
    }
  }
}
