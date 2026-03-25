import { NotaService } from "@/service/nota.service";
import { NotaRequest } from "@/types/request/NotaRequest";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { NotaResponse } from "@/types/response/NotaResponse";
import { useState } from "react";

export const useNotas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const create = async (nota: NotaRequest): Promise<any> => {
        setLoading(true);
        setError("");
        try {
            const response = await NotaService.create(nota);
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

    const getAll = async (): Promise<NotaResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await NotaService.getAll();
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

    const getAllClientes = async (): Promise<ClienteProveedorResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await NotaService.getAllClientes();
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
        create,
        getAll,
        getAllClientes,
        loading,
        error,
    };
};
