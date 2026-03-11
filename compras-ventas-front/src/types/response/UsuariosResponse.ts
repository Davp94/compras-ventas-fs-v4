export interface UsuarioResponse {
    id: number;
    nombre: string;
    correo: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    telefono: string;
    direccion: string;
    roles: number[];
}