import { UsuarioService } from "@/service/usuario.service";
import { UsuarioRequest } from "@/types/request/UsuarioRequest";
import { UsuarioResponse } from "@/types/response/UsuariosResponse";
import { useState } from "react";

export const useUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (usuario: UsuarioRequest): Promise<UsuarioResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuarioService.create(usuario);
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

  const getById = async (id: number): Promise<UsuarioResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuarioService.getById(id);
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

  const getAll = async (): Promise<UsuarioResponse[]> => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuarioService.getAll();
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

  const update = async (
    id: number,
    usuario: UsuarioRequest,
  ): Promise<UsuarioResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuarioService.update(id, usuario);
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

  const remove = async (id: number): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      await UsuarioService.delete(id);
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
    getById,
    getAll,
    update,
    remove,
    loading,
    error,
  };
};
