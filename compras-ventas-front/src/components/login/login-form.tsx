"use client"
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LoginForm() {

    const {
        control,
        getValues,
        formState: { errors },
        watch,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const router = useRouter();
    //TODO define hook login
    const toast = useRef<Toast>(null);
    const onSubmit = () => {
        try {
            const authRequest = getValues();
            console.log(authRequest);
            toast.current?.show({
                severity: 'success',
                summary: 'Login exitoso',
                detail: 'Bienvenido a la app compras ventas',
                life: 3000
            })
            //TODO call servicio
            router.push('/') ;
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error login',
                detail: 'mensaje de error',
                life: 3000
            })
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <div className="flex items-center justify-center w-[500px] p-4">
                <Card className="w-full"
                    title={
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">INGRESO APP</h2>
                        </div>
                    }
                    subTitle="Ingrese sus datos de acceso"
                >
                    <div className="flex flex-col gap-4 p-fluid">
                        <div className="field">
                            <Controller
                                control={control}
                                name="username"
                                rules={{ required: 'Campo requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            placeholder="Ingrese nombre de usuario"
                                        />
                                        {fieldState.error && <small>{fieldState.error.message}</small>}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field">
                            <Controller
                                control={control}
                                name="username"
                                rules={{ required: 'Campo requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Password
                                            id={field.name}
                                            {...field}
                                            placeholder="Ingrese la constraseña"
                                            toggleMask
                                        />
                                        {fieldState.error && <small>{fieldState.error.message}</small>}
                                    </>
                                )}
                            />
                        </div>
                        <Button label="Iniciar Sesion" icon="pi pi-sign-in" className="w-full"
                            onClick={() => onSubmit()} />
                    </div>
                </Card>
            </div>
        </>
    );
}
