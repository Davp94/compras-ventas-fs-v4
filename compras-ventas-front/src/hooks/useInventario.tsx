import { useState } from "react";
import { InventarioService } from "@/service/inventario.service";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { ProductoResponse } from "@/types/response/ProductosResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";

export const useInventario = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getProductos = async (params: {
        pageNumber?: number;
        pageSize?: number;
        sortField?: string;
        sortOrder?: "ASC" | "DESC";
        filterValue?: string;
        nombre?: string;
        descripcion?: string;
        codigoBarra?: string;
        marca?: string;
        nombreCategoria?: string;
        almacenId?: number;
    }): Promise<PaginationResponse<ProductoResponse>> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getProductos(params);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                throw error;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getProductosAlmacen = async (
        almacenId: number
    ): Promise<ProductoResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getProductosAlmacen(almacenId);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                throw error;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAlmacenes = async (
        sucursalId: number
    ): Promise<AlmacenResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getAlmacenes(sucursalId);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                throw error;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getSucursales = async (): Promise<SucursalResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getSucursales();
            return response;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                throw error;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        getProductos,
        getProductosAlmacen,
        getAlmacenes,
        getSucursales,
        loading,
        error,
    };
};
