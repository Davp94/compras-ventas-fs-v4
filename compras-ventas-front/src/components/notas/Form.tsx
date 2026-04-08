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
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { useInventario } from "@/hooks/useInventario";

export default function NotaForm() {
    const [tipo] = useState<string[]>(["Compra", "Venta"]);
    const [modalReport, setModalReport] = useState<boolean>(false);
    const [urlReport, setUrlReport] = useState<string>("");

    // Data lists
    const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
    const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [clientesProveedores, setClientesProveedores] = useState<ClienteProveedorResponse[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<ProductoResponse[]>([]);

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { create, getAllClientes } = useNotas();
    const { getAlmacenes, getProductosAlmacen, getSucursales } = useInventario();
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
            tipoNota: "Compra",
            impuestos: 0,
            descuentos: 0,
            observaciones: "",
            usuarioId: Number(usuarioId),
            clienteProveedorId: 0,
            sucursalId: 0,
            almacenId: 0,
            total: 0,
            movimientos: [
                {
                    cantidad: 1,
                    precioUnitarioCompra: 0,
                    precioUnitarioVenta: 0,
                    observaciones: "",
                    productoId: 0,
                    almacenId: 0,
                    tipoMovimiento: "Entrada",
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
    const watchTipoNota = watch('tipoNota');
    const watchSucursalId = watch('sucursalId');
    const watchAlmacenId = watch('almacenId');
    const watchTotal = watch('total');

    const initForm = async () => {
        try {
            const [clientes, sucs] = await Promise.all([
                getAllClientes(),
                getSucursales()
            ]);
            setClientesProveedores(clientes);
            setSucursales(sucs);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos iniciales' });
        }
    }

    // When Sucursal changes, load Almacenes
    useEffect(() => {
        if (watchSucursalId) {
            getAlmacenes(watchSucursalId).then(alms => {
                setAlmacenes(alms);
                setProductos([]); // Reset products safely if sucursal changes
            }).catch(() => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar almacenes' });
            });
        }
    }, [watchSucursalId]);

    // When Almacen changes, load Productos
    useEffect(() => {
        if (watchAlmacenId) {
            getProductosAlmacen(watchAlmacenId).then(prods => {
                setProductos(prods);
            }).catch(() => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar productos' });
            });
        }
    }, [watchAlmacenId]);

    const searchProducto = (event: any) => {
        const query = (event.query || "").toLowerCase();
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(query) ||
            producto.descripcion.toLowerCase().includes(query)
        );
        setFilteredProductos(filtered);
    }

    const onProductoSelect = (producto: ProductoResponse, index: number) => {
        const movimiento = getValues('movimientos')[index];
        movimiento.productoId = producto.id;
        movimiento.precioUnitarioCompra = watchTipoNota === 'Compra' ? producto.precioVentaActual : 0;
        movimiento.precioUnitarioVenta = producto.precioVentaActual || 0;

        // Ensure Almacen is synchronised with the global selection
        movimiento.almacenId = watchAlmacenId;

        setValue(`movimientos.${index}`, movimiento);
    }

    // Auto-calculate total and subtotal when relevant fields change automatically
    useEffect(() => {
        const currentMovimientos = watchMovimientos || [];
        let newTotal = 0;
        currentMovimientos.forEach((mov: any, index: number) => {
            const precio = watchTipoNota === 'Compra' ? mov.precioUnitarioCompra : mov.precioUnitarioVenta;

            // Ensure values are treated as numbers and default to 0
            const qty = Number(mov.cantidad) || 0;
            const price = Number(precio) || 0;
            const subtotal = qty * price;

            if (mov.subtotal !== subtotal) {
                setValue(`movimientos.${index}.subtotal`, subtotal, { shouldDirty: true });
            }
            newTotal += subtotal;
        });

        const descuento = Number(watchDescuento) || 0;
        const impuestos = Number(watchImpuestos) || 0;
        const finalTotal = newTotal - descuento + impuestos;

        if (watchTotal !== finalTotal) {
            setValue('total', finalTotal, { shouldDirty: true });
        }
    }, [watchMovimientos, watchDescuento, watchImpuestos, watchTipoNota, watchTotal, setValue]);

    const addMovimiento = () => {
        append({
            cantidad: 1,
            precioUnitarioCompra: 0,
            precioUnitarioVenta: 0,
            observaciones: "",
            productoId: 0,
            almacenId: watchAlmacenId,
            tipoMovimiento: watchTipoNota,
            subtotal: 0,
        });
    }

    const removeMovimiento = (index: number) => {
        remove(index);
    }

    const onSubmit = async () => {
        try {
            const formData = getValues();
            const submitData = {
                ...formData,
                movimientos: formData.movimientos.map(m => ({
                    ...m,
                    tipoMovimiento: formData.tipoNota,
                    almacenId: formData.almacenId
                }))
            };

            const response = await create(submitData);

            let blob;
            if (response instanceof Blob) {
                blob = response;
            } else {
                blob = new Blob([response], { type: "application/pdf" });
            }
            const url = URL.createObjectURL(blob);

            window.open(url, "_blank");

            const link = document.createElement("a");
            link.href = url;
            link.download = `nota_${Date.now()}.pdf`;
            link.click();

            setUrlReport(url);
            setModalReport(true);

            toast.current?.show({
                severity: "success",
                summary: "Exitoso",
                detail: "Nota procesada exitosamente",
                life: 3000,
            });

            // Remove navigation to let the modal be shown without navigating immediately.
            // Action moved in Dialog hide
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Error al registrar la nota",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
            <Toast ref={toast} />
            <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="text-900 font-bold text-3xl mb-2">Crear Nota</h1>
                    <p className="text-600 mb-0">Gestión de comprobante y movimientos de almacén</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                <Card title="Datos Generales" className="shadow-2 border-round">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-900">Tipo de Nota</label>
                            <DropdownController
                                control={control}
                                name="tipoNota"
                                rules={{ required: "Tipo de nota requerido" }}
                                placeholder="Seleccione el tipo de nota"
                                options={tipo}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-900">Cliente/Proveedor</label>
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
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-900">Sucursal</label>
                            <DropdownController
                                control={control}
                                name="sucursalId"
                                rules={{ required: "Sucursal requerida" }}
                                placeholder="Seleccione sucursal"
                                options={sucursales}
                                optionLabel="nombre"
                                optionValue="id"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-900">Almacén</label>
                            <DropdownController
                                control={control}
                                name="almacenId"
                                rules={{ required: "Almacén requerido" }}
                                placeholder="Seleccione almacén"
                                options={almacenes}
                                optionLabel="nombre"
                                optionValue="id"
                            // disabled={!watchSucursalId}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col gap-2">
                            <label className="font-medium text-900">Observaciones</label>
                            <InputTextAreaController
                                control={control}
                                name="observaciones"
                                rules={{ required: "Observaciones requeridas" }}
                                placeholder="Ingrese las observaciones generales de la transacción"
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    title="Productos y Movimientos"
                    className="shadow-2 border-round"
                    subTitle={
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            label="Agregar Movimiento"
                            severity="success"
                            size="small"
                            onClick={addMovimiento}
                            disabled={!watchAlmacenId}
                        />
                    }>

                    {!watchAlmacenId && (
                        <div className="p-message p-message-info mb-4 border-round flex align-items-center p-3 surface-50 text-blue-800">
                            <span className="p-message-icon pi pi-info-circle mr-2 text-xl font-bold"></span>
                            <span className="p-message-text">Seleccione un Almacén primero para agregar productos.</span>
                        </div>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                                <span className="font-bold text-gray-700 text-lg">Movimiento #{index + 1}</span>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        label="Eliminar"
                                        severity="danger"
                                        text
                                        size="small"
                                        onClick={() => removeMovimiento(index)}
                                    />
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                                <div className="flex flex-col gap-2 xl:col-span-5">
                                    <label className="font-medium text-gray-700 text-sm">Producto</label>
                                    <Controller
                                        name={`movimientos.${index}.productoId`}
                                        control={control}
                                        rules={{ required: "Producto requerido", min: 1 }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <AutoComplete
                                                    field="nombre"
                                                    value={productos.find((p) => p.id === field.value)}
                                                    suggestions={filteredProductos}
                                                    completeMethod={searchProducto}
                                                    onSelect={(e) => onProductoSelect(e.value, index)}
                                                    dropdown
                                                    placeholder="Buscar o seleccionar producto"
                                                    disabled={!watchAlmacenId}
                                                    className="w-full"
                                                />
                                                {fieldState.error && <small className="text-red-500">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 xl:col-span-2">
                                    <label className="font-medium text-gray-700 text-sm">Cantidad</label>
                                    <Controller
                                        name={`movimientos.${index}.cantidad`}
                                        control={control}
                                        rules={{ required: "Cantidad", min: 1 }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputNumber
                                                    value={field.value}
                                                    onValueChange={(e) => field.onChange(e.value)}
                                                    placeholder="1"
                                                    className="w-full"
                                                />
                                                {fieldState.error && <small className="text-red-500">Valor inválido</small>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 xl:col-span-2">
                                    <label className="font-medium text-gray-700 text-sm">Precio Unitario</label>
                                    <Controller
                                        name={`movimientos.${index}.${watchTipoNota === 'COMPRA' ? 'precioUnitarioCompra' : 'precioUnitarioVenta'}`}
                                        control={control}
                                        rules={{ required: "Precio requerido", min: 0 }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <InputNumber
                                                    value={field.value}
                                                    onValueChange={(e) => field.onChange(e.value)}
                                                    placeholder="0.00"
                                                    mode="decimal"
                                                    minFractionDigits={2}
                                                    className="w-full"
                                                />
                                                {fieldState.error && <small className="text-red-500">Requerido</small>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 xl:col-span-3">
                                    <label className="font-medium text-gray-700 text-sm">Subtotal</label>
                                    <Controller
                                        name={`movimientos.${index}.subtotal`}
                                        control={control}
                                        render={({ field }) => (
                                            <InputNumber
                                                value={field.value}
                                                readOnly
                                                mode="decimal"
                                                minFractionDigits={2}
                                                className="w-full opacity-90 p-inputnumber-readonly"
                                                inputClassName="bg-gray-100 font-bold text-gray-800"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="xl:col-span-12 flex flex-col gap-2 mt-2">
                                    <label className="font-medium text-gray-700 text-sm">Observación de Movimiento</label>
                                    <InputTextController
                                        name={`movimientos.${index}.observaciones`}
                                        control={control}
                                        rules={{ required: false }}
                                        placeholder="Comentarios o detalles adicionales (Opcional)"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </Card>

                <Card title="Resumen" className="shadow-2 border-round">
                    <div className="flex flex-col gap-4 md:w-1/2 lg:w-1/3 ml-auto text-lg mt-2">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-700 font-bold uppercase tracking-wider text-sm">Total de Nota</span>
                            <span className="text-green-800 font-bold text-2xl block bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                                Bs. {(Number(watchTotal) || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                label="Cancelar"
                                severity="danger"
                                outlined
                                onClick={onCloseForm}
                                className="px-5 w-auto"
                            />
                            <Button type="submit" label="Procesar y Guardar" icon="pi pi-save" className="px-5 font-bold w-auto" />
                        </div>
                    </div>
                </Card>
            </form>

            <Dialog
                header="Comprobante Generado"
                visible={modalReport}
                onHide={() => {
                    setModalReport(false);
                    router.back();
                }}
                className="w-[400px] md:w-[800px] lg:w-[1000px]"
                maximizable
            >
                <div className="flex justify-center w-full" style={{ height: '70vh' }}>
                    <iframe src={urlReport} className="w-full h-full border-none rounded" title="Reporte PDF" />
                </div>
            </Dialog>
        </div>
    );
}