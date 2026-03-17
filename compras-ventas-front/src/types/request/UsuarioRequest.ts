export interface UsuarioRequest {
  correo: string;
  password: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  roles: number[];
}