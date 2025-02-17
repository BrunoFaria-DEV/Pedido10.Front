import { IUsuario } from "../interfaces/IUsuario";

export class Usuario implements IUsuario {
    constructor(
      public ID_Usuario: string,
      public Nome: string,
      public Email: string,
      public Senha: string,
      public Plano_Usuario: string,
      public Status: string,
      public Tipo_Usuario: string,
    ) {}
  }