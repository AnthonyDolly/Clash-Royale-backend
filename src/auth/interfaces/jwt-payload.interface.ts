export interface JwtPayload {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  //TODO: añadir todo lo que quieran grabar en el token
}
