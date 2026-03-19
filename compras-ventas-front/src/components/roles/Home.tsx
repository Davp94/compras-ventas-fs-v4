"use client";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RolResponse } from "@/types/response/RolResponse";
import { ActionTypeEnum } from "@/constant/action.enum";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import RolesForm from "./Form";
import { useRoles } from "@/hooks/useRoles";

export default function RolesHome() {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [rolDialog, setRolDialog] = useState<boolean>(false);
  const [rol, setRol] = useState<RolResponse | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [flagAction, setFlagAction] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<RolResponse[]>>(null);
  const { getAll, remove } = useRoles();

  const initComponents = async () => {
    const rolResponse = await getAll();
    setRoles(rolResponse);
  };
  useEffect(() => {
    initComponents();
  }, []);

  const openNew = () => {
    setFlagAction(ActionTypeEnum.CREATE);
    setRolDialog(true);
  };

  const hideDialog = (updateData?: boolean) => {
    if (updateData) {
      initComponents();
    }
    setRol(null);
    setRolDialog(false);
  };

  const editRol = (rol: RolResponse) => {
    setFlagAction(ActionTypeEnum.UPDATE);
    setRol({ ...rol });
    setRolDialog(true);
  };

  const confirmDeleteRol = (rol: RolResponse) => {
    confirmDialog({
      message: "Esta seguro de eliminar el rol?",
      header: "CONFIRMACION",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => deleteRol(rol),
      reject: () =>
        toast.current?.show({
          severity: "info",
          summary: "Operacion cancelada",
          detail: "rol no eliminado",
          life: 3000,
        }),
    });
  };

  const deleteRol = (rol: RolResponse) => {
    remove(rol.id);
    toast.current?.show({
      severity: "success",
      summary: "Exitoso",
      detail: "rol eliminado",
      life: 3000,
    });
    initComponents();
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

  const actionBodyTemplate = (rowData: RolResponse) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editRol(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteRol(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Roles</h4>
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
          value={roles}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="id"
            header="Id"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="nombre"
            header="Nombre"
            sortable
            className="min-w-2xs"
          ></Column>
          <Column
            field="descripcion"
            header="Descripcion"
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

      <Dialog
        visible={rolDialog}
        style={{ width: "48rem" }}
        header="Roles Dialog"
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(
          flagAction,
        ) && (
          <RolesForm
            rol={rol}
            hideDialog={hideDialog}
            flagAction={flagAction}
            toast={toast}
          />
        )}
      </Dialog>
    </div>
  );
}
