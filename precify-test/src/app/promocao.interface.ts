export interface ICategoria {
  id: number,
  nome: string
}

export interface IPromocao {
  id?: number,
  GTIN: string,
  descricao: string,
  precoRegular: number,
  precoPromocional: number,
  dataInicial: Date,
  dataFinal: Date,
  categoria: ICategoria
}