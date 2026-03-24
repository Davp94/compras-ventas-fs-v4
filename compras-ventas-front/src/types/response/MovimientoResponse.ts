export interface MovimientoResponse {
    id:number;
    notaId: number;
    productoId: number;
    almacenId: number;
    productoNombre: string;
    cantidad: number;
    tipoMovimiento: string;
    precioUnitarioCompra: number;
    precioUnitarioVenta: number;
    observaciones: string;
}