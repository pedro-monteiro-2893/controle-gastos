import { collection, addDoc, getDocs,deleteDoc, serverTimestamp, doc  } from "firebase/firestore";
import type { Banco, Categoria, Fatura, Gasto, Investimento } from "./util";
import { db } from "./FireBase";

//Funcoes do tipo POST
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Função para adicionar um novo item
export const adicionarBanco = async (banco:Banco) => {
  try {
    // adiciona a data atual ao objeto
    const bancoComData = {
      ...banco,
     dataSalvamento: serverTimestamp()
    };

    await addDoc(collection(db, "bancos"), bancoComData);
    console.log("Banco adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
  }
};

export const adicionarInvestimento = async (investimento:Investimento) => {
  try {
    // adiciona a data atual ao objeto
    const investimentoComData = {
      ...investimento,
     dataSalvamento: serverTimestamp()
    };

    await addDoc(collection(db, "investimentos"), investimentoComData);
    console.log("Banco adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
  }
};

export const adicionarGasto = async (gasto:Gasto) => {
  try {
    // adiciona a data atual ao objeto
    const gastoComData = {
      ...gasto,
     dataSalvamento: serverTimestamp()
    };

    await addDoc(collection(db, "gastos"), gastoComData);
    console.log("Banco adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
  }
};

export const adicionarCategoria = async (categoria:Categoria) => {
  try {
    // adiciona a data atual ao objeto
    const categoriaComData = {
      ...categoria,
     dataSalvamento: serverTimestamp()
    };

    await addDoc(collection(db, "categorias"), categoriaComData);
    console.log("Banco adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
  }
};

export const adicionarFatura = async (fatura:Fatura) => {
  try {
    // adiciona a data atual ao objeto
    const faturaComData = {
      ...fatura,
      dataHora: serverTimestamp()
    };

    await addDoc(collection(db, "faturas"), faturaComData);
    console.log("Banco adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar banco: ", error);
  }
};

//Funções do tipo GET
////////////////////////////////////////////////////////////////////////////////////////

//Buscar Bancos
export const buscarBancos = async (): Promise<Banco[]> => {
  const querySnapshot = await getDocs(collection(db, "bancos"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Banco[];
};

export const buscarCategorias = async (): Promise<Categoria[]> => {
  const querySnapshot = await getDocs(collection(db, "categorias"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Categoria[];
};

export const buscarGastos = async (): Promise<Gasto[]> => {
  const querySnapshot = await getDocs(collection(db, "gastos"));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dataGasto: data.dataGasto.toDate()
    };
  }) as Gasto[];
};

export const buscarInvestimentos = async (): Promise<Investimento[]> => {
  const querySnapshot = await getDocs(collection(db, "investimentos"));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dataRegistro: data.dataRegistro.toDate()
    };
  }) as Investimento[];
};

// Função para buscar as receitas do banco
export const buscarFaturas = async (): Promise<Fatura[]> => {
  const querySnapshot = await getDocs(collection(db, "faturas"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Fatura[];
};


//Funções do tipo DELETE
////////////////////////////////////////////////////////////////////////////////////////

export const removerBancoDaBase= async (id:string) => {
    try {
        await deleteDoc(doc(collection(db, "bancos"), id)); // Remove do Firestore
    } catch (error) {
        console.log("Erro ao deletar fonte do banco");
    }
};


export const removerCategoriaDaBase= async (id:string) => {
    try {
        await deleteDoc(doc(collection(db, "categorias"), id)); // Remove do Firestore
    } catch (error) {
        console.log("Erro ao deletar fonte do banco");
    }
};

export const removerGastosDaBase= async (id:string) => {
    try {
        await deleteDoc(doc(collection(db, "gastos"), id)); // Remove do Firestore
    } catch (error) {
        console.log("Erro ao deletar fonte do banco");
    }
};

//funcar para remover receita do banco
export const removerFaturaDaBase = async (id:string) => {
    try {
        await deleteDoc(doc(collection(db, "faturas"), id)); // Remove do Firestore
    } catch (error) {
        console.log("Erro ao deletar receita do banco");
    }
};


export const removerInvestimentoDaBase = async (id:string) => {
    try {
        await deleteDoc(doc(collection(db, "investimentos"), id)); // Remove do Firestore
    } catch (error) {
        console.log("Erro ao deletar receita do banco");
    }
};