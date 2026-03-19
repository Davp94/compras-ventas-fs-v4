import { RolService } from "@/service/rol.service";
import { RolRequest } from "@/types/request/RolRequest";
import { RolResponse } from "@/types/response/RolResponse";
import { useState } from "react";

export const useRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (rol: RolRequest): Promise<RolResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.create(rol);
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

  const getById = async (id: number): Promise<RolResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getById(id);
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

  const getAll = async (): Promise<RolResponse[]> => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getAll();
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
    rol: RolRequest,
  ): Promise<RolResponse> => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.update(id, rol);
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
      await RolService.delete(id);
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
