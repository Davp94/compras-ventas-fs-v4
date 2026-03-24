import { useNotas } from "@/hooks/useNotas";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { ProductoResponse } from "@/types/response/ProductosResponse";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useFieldArray, useForm } from "react-hook-form";
import DropdownController from "../common/DropdownController";
import { Card } from "primereact/card";
import InputTextAreaController from "../common/InputTextAreaController";
import { Button } from "primereact/button";
import InputTextController from "../common/InputTextController";
export default function NotaForm() {
    const [tipo, setTipo] = useState<string[]>(["COMPRA", "VENTA"]);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [clientesProveedores, setClientesProveedores] = useState<ClienteProveedorResponse[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<ProductoResponse[]>([]);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { create } = useNotas();
    const usuarioId = Cookies.get("identifier");

    const {
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        handleSubmit,
        watch,
    } = useForm({
        defaultValues: {
            tipoNota: "COMPRA",
            impuestos: 0,
            descuentos: 0,
            observaciones: "",
            usuarioId: Number(usuarioId),
            clienteProveedorId: 0,
            total: 0,
            movimientos: [
                {
                    cantidad: 0,
                    precioUnitarioCompra: 0,
                    precioUnitarioVenta: 0,
                    observaciones: "",
                    productoId: 0,
                    almacenId: 0,
                    tipoMovimiento: "COMPRA",
                    subtotal: 0,
                }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "movimientos",
    });

    const watchMovimientos = watch('movimientos');
    const watchDescuento = watch('descuentos');
    const watchImpuestos = watch('impuestos');

    const initForm = async () => {
        //TODO get all clientes
        //TODO get all productos
    }

    const searchProducto = (event: any) => {
        const query = event.query.toLowerCase();
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(query) ||
            producto.descripcion.toLowerCase().includes(query)
        );
        setFilteredProductos(filtered);
    }

    const onProductoSelect = (producto: ProductoResponse, index: number) => {
        const movimiento = getValues('movimientos')[index];
        movimiento.productoId = producto.id;
        movimiento.precioUnitarioCompra = 0;
        movimiento.precioUnitarioVenta = producto.precioVentaActual;
        setValue(`movimientos.${index}`, movimiento);
        calcutateTotal(index);
    }

    const calcutateTotal = (index: number) => {
        const movimiento = getValues('movimientos')[index];
        const total = movimiento.cantidad * movimiento.precioUnitarioVenta;
        setValue(`movimientos.${index}.subtotal`, total);
        calculateTotalGlobal();
    }

    const calculateTotalGlobal = () => {
        const movimientos = getValues('movimientos');
        const total = movimientos.reduce((acc, movimiento) => acc + movimiento.subtotal, 0);
        setValue('total', total);
    }

    const addMovimiento = () => {
        append({
            cantidad: 0,
            precioUnitarioCompra: 0,
            precioUnitarioVenta: 0,
            observaciones: "",
            productoId: 0,
            almacenId: 0,
            tipoMovimiento: "COMPRA",
            subtotal: 0,
        });
    }

    const removeMovimiento = (index: number) => {
        remove(index);
        calculateTotalGlobal();
    }

    const onSubmit = async () => {
        try {
            const response = await create(getValues());
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
    }

    const onCloseForm = () => {
        reset();
        router.back();
    }

    useEffect(() => {
        initForm();
    }, [])

    useEffect(() => {
        calculateTotalGlobal();
    }, [watchMovimientos, watchDescuento, watchImpuestos])

    return (
        <>
            <Toast ref={toast} />
            <div>
                <div>
                    <h1>Crear Nota</h1>
                    <p>Creacion de nota de compra/venta con movimientos de inventario</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
                    <Card title="Datos Generales">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-fluid">
                            <DropdownController
                                control={control}
                                name="tipoNota"
                                rules={{ required: "Tipo de nota requerido" }}
                                placeholder="Seleccione el tipo de nota"
                                options={tipo}
                            />
                        </div>
                        <div className="p-fluid">
                            <DropdownController
                                control={control}
                                name="clienteProveedorId"
                                rules={{ required: "Cliente/Proveedor requerido" }}
                                placeholder="Seleccione el cliente/proveedor"
                                options={clientesProveedores}
                                optionLabel="razonSocial"
                                optionValue="id"
                            />
                        </div>
                        <div className="p-fluid col-span-2">
                            <InputTextAreaController
                                control={control}
                                name="observaciones"
                                rules={{ required: "Observaciones requeridas" }}
                                placeholder="Ingrese las observaciones"
                            />
                        </div>
                    </div>

                    </Card>
                    <Card 
                    title="Productos y Movimientos" 
                    subTitle={
                        <Button
                            icon="pi pi-plus"
                            label="Agregar Movimiento"
                            severity="success"
                            size="small"
                            onClick={() => addMovimiento()}
                        />
                    }>
                        {fields.map((field, index) => (
                            <div key={field.id}>
                                <InputTextController
                                    control={control}
                                    name={`movimientos.${index}.productoId`}
                                    rules={{ required: "Producto requerido" }}
                                    placeholder="Seleccione el producto"
                                />
                            </div>
                        ))}
                    </Card>
                    <Card title="Resumen">
                        
                    </Card>
                    <div className="flex gap-2 justify-content-end">
                        <Button
                            label="Cancelar"
                            severity="danger"
                            onClick={() => onCloseForm()}
                        />
                        <Button label="Guardar" onClick={() => onSubmit()} />
                    </div>
                </form>
            </div>

        </>
    );
}