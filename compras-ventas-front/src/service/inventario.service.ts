import { apiClient } from "@/config/service.config";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { AuthRequest } from "@/types/request/AuthRequest";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { AuthResponse } from "@/types/response/AuthResponse";
import { ProductoResponse } from "@/types/response/ProductosResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import Cookies from "js-cookie";
export class InventarioService {
  public static async getProductos(params: {
    pageNumber?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    filterValue?: string;
    nombre?: string;
    descripcion?: string;
    codigoBarra?: string;
    marca?: string;
    nombreCategoria?: string;
    almacenId?: number;
  }): Promise<PaginationResponse<ProductoResponse>> {
    try {
      const response = await apiClient.get<PaginationResponse<ProductoResponse>>(
        "/productos/paginacion",
        { params },
      );
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando los productos");
    }
  }

  public static async getProductosAlmacen(almacenId: number): Promise<ProductoResponse[]> {
    try {
      const response = await apiClient.get<ProductoResponse[]>(
        `/productos/almacen/${almacenId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando los productos del almacen");
    }
  }

  public static async getAlmacenes(sucursalId: number): Promise<AlmacenResponse[]> {
    try {
      const response = await apiClient.get<AlmacenResponse[]>(
        `/sucursal/almacen/${sucursalId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando los almacenes");
    }
  }

  public static async getSucursales(): Promise<SucursalResponse[]> {
    try {
      const response = await apiClient.get<SucursalResponse[]>(
        "/sucursal",
      );
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando las sucursales");
    }
  }
}
