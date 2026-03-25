"use client";

import { useEffect, useRef, useState } from "react";
import { ProductoResponse } from "@/types/response/ProductosResponse";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { useInventario } from "@/hooks/useInventario";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";

export default function InventarioHome() {
  const [productos, setProductos] = useState<PaginationResponse<ProductoResponse>>();
  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[]>([]);
  const [productoDialog, setProductoDialog] = useState<boolean>(false);
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalResponse | null>(null);
  const [selectedAlmacen, setSelectedAlmacen] = useState<AlmacenResponse | null>(null);
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [flagAction, setFlagAction] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any[]>>(null);
  const [lazyState, setLazyState] = useState({
    pageSize: 10,
    pageNumber: 1,
    sortField: "",
    sortOrder: 'ASC' as 'ASC' | 'DESC',
  });

  const { getProductos: getProductosHook, getAlmacenes: getAlmacenesHook, getSucursales, loading, error } = useInventario();

  const initComponent = async () => {
    try {
      const sucursales = await getSucursales();
      setSucursales(sucursales);
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener las sucursales",
        life: 3000,
      });
    }
  }

  useEffect(() => {
    initComponent();
  }, []);

  const getAlmacenes = async () => {
    if (selectedSucursal?.id) {
      try {
        const almacenes = await getAlmacenesHook(selectedSucursal.id);
        setAlmacenes(almacenes);
      } catch (error) {
        console.error(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al obtener los almacenes",
          life: 3000,
        });
      }
    }
  }

  useEffect(() => {
    getAlmacenes();
  }, [selectedSucursal]);

  const getProductos = async () => {
    if (selectedAlmacen?.id) {
      try {
        const productos = await getProductosHook({
          ...lazyState,
          almacenId: selectedAlmacen?.id,
          filterValue: globalFilter,
        });
        setProductos(productos);
      } catch (error) {
        console.error(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al obtener los productos",
          life: 3000,
        });
      }
    }

  }
  useEffect(() => {
    getProductos();
  }, [selectedAlmacen, lazyState, globalFilter]);

  const onPage = (event: DataTablePageEvent) => {
    setLazyState({
      ...lazyState,
      pageNumber: event.page ? event.page + 1 : 1,
      pageSize: event.rows,
    });
  };

  const onSort = (event: DataTablePageEvent) => {
    setLazyState({
      ...lazyState,
      sortField: event.sortField,
      sortOrder: event.sortOrder === 1 ? 'ASC' : 'DESC',
    });
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
          onClick={() => console.log('')}
        />
        <Button
          label="Stock"
          icon="pi pi-plus"
          severity="info"
          onClick={() => router.push(`notas/nueva-nota?almacenId=${selectedAlmacen?.id}&tipo=COMPRA`)}
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

  const actionBodyTemplate = (rowData: ProductoResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => console.log("")}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => console.log("")}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Inventario</h4>
      <Dropdown
        value={selectedSucursal}
        onChange={(e) => setSelectedSucursal(e.value)}
        options={sucursales}
        optionLabel="nombre"
        placeholder="Select a Sucursal"
      />
      <Dropdown
        value={selectedAlmacen}
        onChange={(e) => setSelectedAlmacen(e.value)}
        options={almacenes}
        optionLabel="nombre"
        placeholder="Select an Almacen"
      />
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
    <>
      <Toast ref={toast} />
      <Toolbar
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />
      <DataTable
        id="inventarioTable"
        ref={dt}
        value={productos?.content}
        lazy
        paginator
        first={lazyState.pageNumber * lazyState.pageSize}
        rows={lazyState.pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}  productos"
        globalFilter={globalFilter}
        header={header}
        totalRecords={productos?.totalElements}
        onPage={onPage}
        onSort={onSort}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder === 'ASC' ? 1 : -1}
      >
        <Column field="nombre" header="Nombre" sortable />
        <Column field="descripcion" header="Descripción" sortable />
        <Column field="precioVentaActual" header="Precio" sortable />
        <Column field="marca" header="Marca" sortable />
        <Column field="nombreCategoria" header="Categoría" sortable />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </>)

}