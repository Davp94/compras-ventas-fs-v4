import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputTextAreaController from "../common/InputTextAreaController";
import InputTextController from "../common/InputTextController";
import MultiselectController from "../common/MultiselectController";
import { Button } from "primereact/button";
import { useRoles } from "@/hooks/useRoles";
import { RolRequest } from "@/types/request/RolRequest";

interface RolesFormProps {
  rol: RolResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function RolesForm({
  rol,
  hideDialog,
  toast,
  flagAction,
}: RolesFormProps) {
  const [rolId, setRolId] = useState<number>(0);
  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<RolRequest>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      permisos: [] as number[],
    },
  });
  const { create, update } = useRoles();

  const onSubmit = async () => {
    if (flagAction == ActionTypeEnum.CREATE) {
      const result = getValues();
      try {
        await create(result);
        toast.current?.show({
          severity: "success",
          summary: "Exitoso",
          detail: "rol creado",
          life: 3000,
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al crear el rol",
          life: 3000,
        });
      }

      reset();
    }
    if (flagAction == ActionTypeEnum.UPDATE) {
      const result = getValues();
      try {
        await update(rolId, result);
        toast.current?.show({
          severity: "success",
          summary: "Exitoso",
          detail: "rol actualizado",
          life: 3000,
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al actualizar el rol",
          life: 3000,
        });
      }
      reset();
    }
  };

  const closeForm = (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    if (rol != null && flagAction == ActionTypeEnum.UPDATE) {
      setRolId(rol.id);
      setValue("nombre", rol.nombre);
      setValue("descripcion", rol.descripcion);
      setValue("permisos", rol.permisos || []);
    }
  }, []);

  return (
    <>
      <form className="w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-fluid">
            <InputTextController
              control={control}
              name="nombre"
              rules={{ required: "Nombre requerido" }}
              placeholder="Ingrese el nombre del rol"
            />
          </div>
          <div className="p-fluid">
            <InputTextAreaController
              control={control}
              name="descripcion"
              rules={{ required: "Descripcion requerida" }}
              placeholder="Ingrese la descripcion del rol"
            />
          </div>
          <div className="p-fluid col-span-2">
            <MultiselectController
              control={control}
              name="permisos"
              placeholder="Seleccione los permisos"
              options={[]}
              optionLabel="label"
              optionValue="value"
              display="chip"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-content-end">
          <Button
            label="Cancelar"
            severity="danger"
            onClick={() => closeForm()}
          />
          <Button label="Guardar" onClick={() => onSubmit()} />
        </div>
      </form>
    </>
  );
}
