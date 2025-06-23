
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Container, Form, Button, Table, Row, Col} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Estilos padrão
import { adicionarGasto, buscarCategorias, buscarGastos, removerGastosDaBase } from "../utils/databaseUtil";
import { type Categoria, type Gasto } from "../utils/util";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const Gastos = () => {

    //Filtros
    const [filtroCategoria, setFiltroCategoria] = useState<string>("");
    const [filtroMes, setFiltroMes] = useState<string>("");
    const [filtroAno, setFiltroAno] = useState<string>("");



    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
    const [categoria, setCategoria] = useState<Categoria[]>([]);
    const [gasto, setGasto] = useState<Gasto[]>([]);
    const [valor, setValor] = useState(0);
    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

    const handleDateChange = (date: Date | null) => {
        setDataSelecionada(date);
    };

  const gastosFiltrados = gasto.filter((g) => {
  const data = new Date(g.dataGasto as Date);
  const mesGasto = (data.getMonth() + 1).toString();
  const anoGasto = data.getFullYear().toString();
  const categoriaId = g.categoria.id;

  const categoriaOk = !filtroCategoria || filtroCategoria === categoriaId;
  const mesOk = !filtroMes || filtroMes === mesGasto;
  const anoOk = !filtroAno || filtroAno === anoGasto;

  return categoriaOk && mesOk && anoOk;
});


const dadosGraficoCategoria = categoria.map((c) => {
  const total = gastosFiltrados
    .filter((g) => g.categoria.id === c.id)
    .reduce((acc, g) => acc + g.valor, 0);
  return { nome: c.nome, total };
});

const dadosGraficoMensal = [...Array(12)].map((_, i) => {
  const mes = i + 1;
  const total = gasto
    .filter((g) => {
      const data = new Date(g.dataGasto as Date);
      return (
        (!filtroAno || data.getFullYear().toString() === filtroAno) &&
        data.getMonth() + 1 === mes
      );
    })
    .reduce((acc, g) => acc + g.valor, 0);

  return {
    mes: new Date(0, i).toLocaleString("pt-BR", { month: "short" }),
    total,
  };
});



        
    // Callback para exibir a mensagem após a remoção
    const mostrarMensagem = (texto: string, tipo: "success" | "error" | "info" | "warning") => {
  switch (tipo) {
    case "success":
      toast.success(texto);
      break;
    case "error":
      toast.error(texto);
      break;
    case "info":
      toast.info(texto);
      break;
    case "warning":
      toast.warn(texto);
      break;
    default:
      toast(texto);
  }
};




//Carrego os bancos e faturas para popular lista
useEffect(() => {
    const carregarDados = async () => {
      try {
    
        const categorias = await buscarCategorias();
        setCategoria(categorias);

        const gastos = await buscarGastos();
        setGasto(gastos);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    carregarDados();
  }, []);

const confirmarRemocao = (item:Gasto) => {
        confirmAlert({
            title: "Confirmar exclusão",
            message: "Deseja realmente excluir essa fatura?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => removerGasto(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Remoção cancelada")
                }
            ]
        });
    };


    const handleAdicionarGasto = async () => {
        if (!categoriaSelecionada ||!dataSelecionada || !valor) return;

        const novoGasto: Gasto = {
            categoria: categoriaSelecionada,
            dataGasto: dataSelecionada,
            valor:valor,
            dataSalvamento:null
        };

        console.log(novoGasto);

        await adicionarGasto(novoGasto);

        mostrarMensagem("Gasto adicionado com sucesso","success");

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarGastos();
        setGasto(dadosAtualizados);

        
    };

    const removerGasto = async (gasto : Gasto) => {
        
        if (!gasto.id) {
            console.error("Banco sem ID não pode ser removido.");
        return;
        }
 
        try {
            await removerGastosDaBase(gasto.id);

            // Atualiza a lista de fontes na tela removendo o item excluído
            setGasto((prevGastos:any) => prevGastos.filter((f:Gasto) => f.id !== gasto.id));

            mostrarMensagem(`Gasto removida com sucesso!`, "success");
        } catch (error) {
            mostrarMensagem("Erro ao remover Gasto!", "error");
            console.error("Erro ao remover Gasto:", error);
        }
    };

    const totalFiltrado = gastosFiltrados.reduce((acc, g) => acc + g.valor, 0);

return (
  <Container className="mt-4">
    <h2 className="text-center mb-4 text-primary fw-bold display-5">
      <span style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>
        💸 Gastos
      </span>
    </h2>

    {/* Container de Cadastro */}
    <Container className="bg-light border rounded p-4 mt-4 shadow-sm">
      <Form>
        <Form.Group className="mb-3">
          <Row>
            <Col xs={12} md={4}>
              <Form.Label>💸 Categoria</Form.Label>
              <Form.Select
                value={categoriaSelecionada?.id || ""}
                onChange={(e) => {
                  const selecionado = categoria.find((b) => b.id === e.target.value);
                  if (selecionado) setCategoriaSelecionada(selecionado);
                }}
              >
                <option value="">Selecione uma categoria</option>
                {categoria.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label>📊 Valor (R$)</Form.Label>
              <Form.Control
                type="number"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
                placeholder="Ex: 500.00"
              />
            </Col>

            <Col xs={12} md={2}>
              <Form.Label>🗓️ Data</Form.Label>
              <DatePicker
                selected={dataSelecionada}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione uma data"
                className="form-control"
              />
            </Col>
          </Row>
        </Form.Group>
        <Button variant="success" onClick={handleAdicionarGasto}>
          Adicionar Gasto
        </Button>
      </Form>
    </Container>

    {/* Container de Filtros e Gráficos */}
    <Container className="bg-light border rounded p-4 mt-4 shadow-sm">
      <Form>
        <Row className="mb-3">
  <Col xs={12} md={4}>
    <Form.Label>📂 Filtrar por Categoria</Form.Label>
    <Form.Select
      value={filtroCategoria}
      onChange={(e) => setFiltroCategoria(e.target.value)}
    >
      <option value="">Todas</option>
      {categoria.map((c) => (
        <option key={c.id} value={c.id}>{c.nome}</option>
      ))}
    </Form.Select>
  </Col>

  <Col xs={12} md={4}>
    <Form.Label>🗓️ Filtrar por Mês</Form.Label>
    <Form.Select
      value={filtroMes}
      onChange={(e) => setFiltroMes(e.target.value)}
    >
      <option value="">Todos</option>
      {[...Array(12)].map((_, i) => (
        <option key={i} value={(i + 1).toString()}>
          {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
        </option>
      ))}
    </Form.Select>
  </Col>

  <Col xs={12} md={4}>
  <Form.Label>📆 Filtrar por Ano</Form.Label>
  <Form.Select
    value={filtroAno}
    onChange={(e) => setFiltroAno(e.target.value)}
  >
    <option value="">Todos</option>
    {[...new Set(gasto.map((g) =>
      new Date(g.dataGasto as Date).getFullYear()
    ))].map((ano) => (
      <option key={ano} value={ano.toString()}>
        {ano}
      </option>
    ))}
  </Form.Select>
</Col>


  <Col xs={12} md={4}>
    <Form.Label>💰 Total Filtrado (R$)</Form.Label>
    <Form.Control
      type="text"
      value={`R$ ${totalFiltrado.toFixed(2)}`}
      readOnly
      className="bg-light"
    />
  </Col>
</Row>

      </Form>

      <h5 className="mt-4">Resumo por Categoria</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosGraficoCategoria}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>

    <h5 className="mt-4">Resumo Mensal por Ano</h5>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={dadosGraficoMensal}>
    <XAxis dataKey="mes" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="total" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>


    {/* Tabela */}
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>Categoria</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {[...gastosFiltrados]
          .sort((a, b) => {
            const dataA = (a.dataGasto as Date).getTime();
            const dataB = (b.dataGasto as Date).getTime();
            return dataB - dataA;
          })
          .map((item) => (
            <tr key={item.id}>
              <td>{item.categoria.nome}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              <td>{item.dataGasto.toLocaleDateString("pt-BR")}</td>
              <td className="text-center">
                <FaTrash
                  className="text-danger"
                  title="Deletar Gasto"
                  style={{ cursor: "pointer" }}
                  onClick={() => confirmarRemocao(item)}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </Container>
);

};

export default Gastos;
