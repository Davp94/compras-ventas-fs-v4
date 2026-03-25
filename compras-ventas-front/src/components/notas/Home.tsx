"use client";
import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { NotaResponse } from "@/types/response/NotaResponse";
import { ActionTypeEnum } from "@/constant/action.enum";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNotas } from "@/hooks/useNotas";
import { useRouter } from "next/navigation";

export default function NotasHome() {
    const [notas, setNotas] = useState<NotaResponse[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | NotaResponse[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<NotaResponse[]>>(null);
    const { getAll } = useNotas();
    const router = useRouter();

    const initComponents = async () => {
        try {
            const notaResponse = await getAll();
            setNotas(notaResponse);
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Error al cargar las notas",
                life: 3000,
            });
            setNotas([]);
        }
    };

    useEffect(() => {
        initComponents();
    }, []);

    const openNew = () => {
        //TODO add sucursal usuario from session
        router.push(`/notas/nueva-nota?sucursalId=${1}`);
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Export"
                icon="pi pi-upload"
                className="p-button-help"
                onClick={exportCSV}
            />
        );
    };

    const actionBodyTemplate = (rowData: NotaResponse) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => console.log('editar nota')}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => console.log('eliminar nota')}
                />
            </React.Fragment>
        );
    };

    const allowExpansion = (rowData: NotaResponse) => {
        return rowData.movimientos! && rowData.movimientos.length > 0;
    };

    const rowExpansionTemplate = (data: NotaResponse) => {
        return (
            <div className="p-3">
                <h5>Detalle de Movimientos</h5>
                <DataTable value={data.movimientos}>
                    <Column field="productoNombre" header="Producto" sortable></Column>
                    <Column field="cantidad" header="Cantidad" sortable></Column>
                    <Column field="tipoMovimiento" header="Tipo Movimiento" sortable></Column>
                    <Column field="precioUnitarioCompra" header="Precio Compra" sortable></Column>
                    <Column field="precioUnitarioVenta" header="Precio Venta" sortable></Column>
                    <Column field="observaciones" header="Observaciones" sortable></Column>
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Notas</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Search..."
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        setGlobalFilter(target.value);
                    }}
                />
            </IconField>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card">
                <Toolbar
                    className="mb-4"
                    start={leftToolbarTemplate}
                    end={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={notas}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notas"
                    globalFilter={globalFilter}
                    header={header}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column expander={allowExpansion} style={{ width: "5rem" }} />
                    <Column
                        field="fecha"
                        header="Fecha"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="tipoNota"
                        header="Tipo Nota"
                        sortable
                        className="min-w-2xs"
                    ></Column>
                    <Column
                        field="clienteProveedorRazoSocial"
                        header="Cliente/Proveedor"
                        sortable
                        style={{ minWidth: "14rem" }}
                    ></Column>
                    <Column
                        field="observaciones"
                        header="Observaciones"
                        sortable
                        style={{ minWidth: "8rem" }}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: "12rem" }}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
}