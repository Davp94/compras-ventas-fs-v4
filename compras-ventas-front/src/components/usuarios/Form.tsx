import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { UsuarioResponse } from "@/types/response/UsuariosResponse";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputTextAreaController from "../common/InputTextAreaController";
import InputTextController from "../common/InputTextController";
import CalendarController from "../common/CalendarController";
import MultiselectController from "../common/MultiselectController";
import { Button } from "primereact/button";
import { RolService } from "@/service/rol.service";

interface UsuariosFormProps {
  usuario: UsuarioResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [rolesUsuario, setRolesUsuario] = useState([]);
  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      id: 0,
      nombre: "",
      correo: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      telefono: "",
      direccion: "",
      roles: [],
    },
  });

  const initForm = async () => {
    //TODO add roles
    const rolesResponse = await RolService.getRoles();
    console.log("🚀 ~ initForm ~ const:", rolesResponse)
    
    setRoles(rolesResponse);
  };

  const onSubmit = () => {
    if (flagAction == ActionTypeEnum.CREATE) {
      const result = getValues();
      //TODO call service;
      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: "usuario creado",
        life: 3000,
      });
      reset();
    }
    if (flagAction == ActionTypeEnum.UPDATE) {
      //TODO call service
      toast.current?.show({
        severity: "success",
        summary: "Exitoso",
        detail: "usuario actualizado",
        life: 3000,
      });
      reset();
    }
  };

  const closeForm = (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    initForm();
  }, []);

  useEffect(() => {
    console.log("ACTUALZIANDO ROLES DE USUARIO");
  }, [rolesUsuario]);
  return (
    <>
      <form className="w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-fluid">
            <InputTextController
              control={control}
              name="nombres"
              rules={{ required: "Nombres requeridos" }}
              placeholder="Ingrese los nombres"
            />
          </div>
          <div className="p-fluid">
            <InputTextController
              control={control}
              name="apellidos"
              rules={{ required: "Apellidos requeridos", maxLength: 20 }}
              placeholder="Ingrese los apellidos"
            />
          </div>
          <div className="p-fluid">
            <InputTextController
              control={control}
              name="correo"
              rules={{
                required: "Nombres requeridos",
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              }}
              placeholder="Ingrese el correo"
            />
          </div>
          <div className="p-fluid">
            <InputTextAreaController
              control={control}
              name="direccion"
              rules={{ required: "Direccion requerida" }}
              placeholder="Ingrese la direccion del usuario"
            />
          </div>
          <div className="p-fluid">
            <InputTextController
              control={control}
              name="telefono"
              rules={{ required: "Telefono requeridos" }}
              placeholder="Ingrese el cortelefonoreo"
            />
          </div>
          <div className="p-fluid">
            <CalendarController
              control={control}
              name="fechaNacimiento"
              rules={{ required: "FechaNacimiento requeridos" }}
              placeholder="Ingrese su fecha de nacimiento"
              dateFormat="dd/mm/yyyy"
            />
          </div>
          <div className="p-fluid">
            <MultiselectController
              control={control}
              name="roles"
              placeholder="Seleccione los roles a asignar"
              options={roles}
              optionLabel="nombre"
              display="chip"
            />
          </div>
          <div>
            <Button
              label="Cancelar"
              severity="danger"
              className="w-full"
              onClick={() => closeForm()}
            />
            <Button
              label="Guardar"
              className="w-full"
              onClick={() => onSubmit()}
            />
          </div>
        </div>
      </form>
    </>
  );
}
