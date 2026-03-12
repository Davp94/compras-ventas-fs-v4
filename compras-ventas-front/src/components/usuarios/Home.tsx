
'use client'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber,InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProductService } from '@/service/ProductService';
import { UsuarioResponse } from '@/types/response/UsuariosResponse';
import { ActionTypeEnum } from '@/constant/action.enum';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import UsuariosForm from './Form';

export default function UsuariosHome() {
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [usuarioDialog, setUsuarioDialog] = useState<boolean>(false);
    const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [flagAction, setFlagAction] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<UsuarioResponse[]>>(null);

    useEffect(() => {
        //TODO call hook service to load usuarios
    }, []);

    const openNew = () => {
        setFlagAction(ActionTypeEnum.CREATE)
        setUsuarioDialog(true);
    };

    const hideDialog = (updateData?: boolean) => {
        if(updateData)
            {
                //TODO load data created/update  
            }
        setUsuarioDialog(false);    
    };

    const editUsuario = (usuario: UsuarioResponse) => {
        setFlagAction(ActionTypeEnum.UPDATE);
        setUsuario({...usuario});
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: UsuarioResponse) => {
        confirmDialog({
            message: 'Esta seguro de eliminar el usuario?',
            header: 'CONFIRMACION',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => deleteUser(usuario),
            reject: () => 
                toast.current?.show({
                    severity: 'info',
                    summary: 'Operacion cancelada',
                    detail: 'usuario no eliminado',
                    life: 3000
                })
        });
    };

    const deleteUser = (usuario: UsuarioResponse) => {
        //TODO call deleteusuario;
        toast.current?.show({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'usuario eliminado',
                    life: 3000
        })
        //TODO refresh data;
    }

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData: UsuarioResponse) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={usuarios}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} usuarios" globalFilter={globalFilter} header={header}
                >
                    <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nombres" header="Nombres" sortable className='min-w-2xs'></Column>
                    <Column field="apellidos" header="Apellidos"></Column>
                    <Column field="fechaNacimiento" header="Fecha de nacimiento"  sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="telefono" header="Telefono" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={usuarioDialog} style={{ width: '32rem' }} header="Usuarios Dialog" modal className="p-fluid" onHide={hideDialog}>
                {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(flagAction) && (
                    <UsuariosForm usuario={usuario} hideDialog={hideDialog} flagAction={flagAction} toast={toast} />
                )}
            </Dialog>
        </div>
    );
}
        