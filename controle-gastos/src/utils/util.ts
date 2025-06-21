import { Timestamp } from "firebase/firestore"

export const formatCNPJ = (value:string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '');

    // Aplica a máscara de CNPJ
    if (numericValue.length <= 2) {
        return numericValue;
    } else if (numericValue.length <= 5) {
        return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
        return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
    } else if (numericValue.length <= 12) {
        return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
    } else {
        return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8, 12)}-${numericValue.slice(12, 14)}`;
    }
};

export const possuiDados = (fontes:any) => fontes.size > 0;

export const mesesDoAno = [
    { id: 1, nome: "Janeiro" },
    { id: 2, nome: "Fevereiro" },
    { id: 3, nome: "Março" },
    { id: 4, nome: "Abril" },
    { id: 5, nome: "Maio" },
    { id: 6, nome: "Junho" },
    { id: 7, nome: "Julho" },
    { id: 8, nome: "Agosto" },
    { id: 9, nome: "Setembro" },
    { id: 10, nome: "Outubro" },
    { id: 11, nome: "Novembro" },
    { id: 12, nome: "Dezembro" },
  ];

  export const anosDisponiveis = [
    { id: 3, ano: 2024 },
    { id: 4, ano: 2025 },
    { id: 5, ano: 2026 },
    { id: 6, ano: 2027 },
    { id: 7, ano: 2028 },
    { id: 8, ano: 2029 },
    { id: 9, ano: 2030 },
    { id: 10, ano: 2031 },
  ];

  export const ordemMeses = {
  Janeiro: 1,
  Fevereiro: 2,
  Março: 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12
};

export type Banco = {
  id?: string;
  nome: string;
  descricao: string;
  dataSalvamento: Timestamp | null;
}

export type Categoria = {
  id?: string;
  nome: string;
  descricao: string;
  dataSalvamento: Timestamp | null;
}


export interface Fatura {
  id?: string;
  banco: Banco;
  valor: number;
  mes:string;
  ano:number;
  dataSalvamento: Timestamp | null;
}


