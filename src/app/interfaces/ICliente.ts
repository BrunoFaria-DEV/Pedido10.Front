export interface ICliente {
  ID_Cliente?: number;
  Tipo_Pessoa: boolean;  
  Nome: string;    
  CPF?: string;
  CNPJ?: string;
  Nascimento?: Date;  
  Email: string;
  Telefone?: string;
  Endereco?: string;
  Localizador?: string;
  ID_Cidade?: number;
}