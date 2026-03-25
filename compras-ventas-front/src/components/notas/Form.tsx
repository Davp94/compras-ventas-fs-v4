"use client";
import { useNotas } from "@/hooks/useNotas";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { ProductoResponse } from "@/types/response/ProductosResponse";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DropdownController from "../common/DropdownController";
import { Card } from "primereact/card";
import InputTextAreaController from "../common/InputTextAreaController";
import { Button } from "primereact/button";
import InputTextController from "../common/InputTextController";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { useInventario } from "@/hooks/useInventario";
export default function NotaForm() {
    const [tipo, setTipo] = useState<string[]>(["COMPRA", "VENTA"]);
    const [modalReport, setModalReport] = useState<boolean>(false);
    const [urlReport, setUrlReport] = useState<string>("");
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
    const [clientesProveedores, setClientesProveedores] = useState<ClienteProveedorResponse[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<ProductoResponse[]>([]);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { create, getAllClientes } = useNotas();
    const { getAlmacenes,  getProductosAlmacen } = useInventario();
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
        //TODO get all almacenes
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
            const blob = new Blob([response], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            //open in other tab browser
            window.open(url, "_blank");
            //download
            const link = document.createElement("a");
            link.href = url;
            link.download = "nota.pdf";
            link.click();
            //open in modal
            setUrlReport(url);
            setModalReport(true);

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Controller
                                        name={`movimientos.${index}.productoId`}
                                        control={control}
                                        rules={{ required: "Producto requerido" }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <AutoComplete
                                                    field="nombre"
                                                    value={productos.find((p) => p.id === field.value)}
                                                    suggestions={filteredProductos}
                                                    completeMethod={searchProducto}
                                                    onSelect={(e) => onProductoSelect(e.value, index)}
                                                    dropdown
                                                    placeholder="Seleccione el producto"
                                                />
                                                {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                    <Controller
                                        name={`movimientos.${index}.cantidad`}
                                        control={control}
                                        rules={{ required: "Cantidad requerida" }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputNumber
                                                    value={field.value}
                                                    onValueChange={(e) => field.onChange(e.value)}
                                                    placeholder="Cantidad"
                                                />
                                                {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                    {getValues('tipoNota') === "COMPRA" ? (
                                        <Controller
                                            name={`movimientos.${index}.precioUnitarioCompra`}
                                            control={control}
                                            rules={{ required: "Precio requerido" }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <InputNumber
                                                        value={field.value}
                                                        onValueChange={(e) => field.onChange(e.value)}
                                                        placeholder="Precio"
                                                    />
                                                    {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                                </>
                                            )}
                                        />
                                    ) : (
                                        <Controller
                                            name={`movimientos.${index}.precioUnitarioVenta`}
                                            control={control}
                                            rules={{ required: "Precio requerido" }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <InputNumber
                                                        value={field.value}
                                                        onValueChange={(e) => field.onChange(e.value)}
                                                        placeholder="Precio"
                                                    />
                                                    {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                                </>
                                            )}
                                        />
                                    )}
                                    <Controller
                                        name={`movimientos.${index}.subtotal`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputNumber
                                                    value={field.value}
                                                    onValueChange={(e) => field.onChange(e.value)}
                                                    placeholder="Total"
                                                />
                                                {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                    <div>
                                        <InputTextController
                                            name={`movimientos.${index}.observaciones`}
                                            control={control}
                                            rules={{ required: "Observación requerida" }}
                                            placeholder="Observación"
                                        />
                                    </div>
                                    {fields.length > 1 && (
                                        <Button
                                            icon="pi pi-trash"
                                            severity="danger"
                                            onClick={() => removeMovimiento(index)}
                                        />
                                    )}

                                </div>
                            </div>
                        ))}
                    </Card>
                    <Card title="Resumen">
                        <div className="flex flex-column gap-2">
                            <div className="flex justify-content-between">
                                <label>Subtotal</label>
                                <label>{getValues('total').toFixed(2) || '0.00'}</label>
                            </div>
                            <div className="flex justify-content-between">
                                <label>Descuentos</label>
                                <label>{getValues('descuentos').toFixed(2) || '0.00'}</label>
                            </div>
                            <div className="flex justify-content-between">
                                <label>Impuesto</label>
                                <label>{getValues('impuestos').toFixed(2) || '0.00'}</label>
                            </div>
                        </div>
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
            <Dialog
                visible={modalReport}
                onHide={() => setModalReport(false)}
                style={{ width: '50vw' }}
            >
                <div className="flex justify-center">
                    <iframe src={urlReport} width="100%" height="500px" />
                    {/* <embed src={urlReport} type="application/pdf" width="100%" height="500px" /> */}
                </div>
            </Dialog>
        </>
    );
}