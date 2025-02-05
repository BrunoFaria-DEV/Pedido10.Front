export interface IProduto {
    ID_Produto?: number;          // int? → Opcional
    Nome_Produto: string;         // string (obrigatório)
    Descricao?: string;           // string? → Opcional
    Custo_Producao?: number;      // decimal? → Opcional e convertido para number
    Margem_Lucro?: number;        // decimal? → Opcional e convertido para number
    Preco: number;                // decimal → Obrigatório
    QTDE_Estoque: number;         // int → Obrigatório
  }