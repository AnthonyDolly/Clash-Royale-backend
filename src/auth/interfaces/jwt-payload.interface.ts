export interface JwtPayload {
  id: string;
  name: string;
  role: string;
  photo: string;
  points: number;
  //TODO: añadir todo lo que quieran grabar en el token
}
