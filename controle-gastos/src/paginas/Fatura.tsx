
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Container, Form, Button, Table, Row, Col} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Estilos padrão
import { adicionarBanco, adicionarFatura, buscarBancos, buscarFaturas, removerBancoDaBase, removerFaturaDaBase } from "../utils/databaseUtil";
import { anosDisponiveis, mesesDoAno, ordemMeses, type Banco, type Fatura } from "../utils/util";
import { confirmAlert } from "react-confirm-alert";


const Faturas = () => {

    const [mesSelecionado, setMesSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState(0);
    const [bancoSelecionado, setBancoSelecionado] = useState<Banco | null>(null);
    const [banco, setBanco] = useState<Banco[]>([]);
    const [valor, setValor] = useState(0);
    const [fatura, setFatura] = useState<Fatura[]>([]);
        
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
    
        const bancos = await buscarBancos();
        setBanco(bancos);

        const faturas = await buscarFaturas();
        setFatura(faturas);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    carregarDados();
  }, []);

const confirmarRemocao = (item:Fatura) => {
        confirmAlert({
            title: "Confirmar exclusão",
            message: "Deseja realmente excluir essa fatura?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => removerFatura(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Remoção cancelada")
                }
            ]
        });
    };


    const handleAdicionarFatura = async () => {
        if (!bancoSelecionado ||!mesSelecionado || !anoSelecionado || !valor) return;

        const novaFatura: Fatura = {
            banco: bancoSelecionado,
            mes: mesSelecionado,
            ano: anoSelecionado,
            valor:valor,
            dataSalvamento:null
        };

        await adicionarFatura(novaFatura);

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarFaturas();
        setFatura(dadosAtualizados);

        
    };

    const removerFatura = async (fatura : Fatura) => {
        
        if (!fatura.id) {
            console.error("Banco sem ID não pode ser removido.");
        return;
        }
 
        try {
            await removerFaturaDaBase(fatura.id);

            // Atualiza a lista de fontes na tela removendo o item excluído
            setBanco((prevFaturas:any) => prevFaturas.filter((f:Fatura) => f.id !== fatura.id));

            mostrarMensagem(`Fatura removida com sucesso!`, "success");
        } catch (error) {
            mostrarMensagem("Erro ao remover fatura!", "error");
            console.error("Erro ao remover fatura:", error);
        }
    };


return (
        <Container className="mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold display-5">
        <span style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>📊 Faturas</span>
      </h2>
      <Container className="bg-light border rounded p-4 mt-4 shadow-sm">

        <Form>
          <Form.Group className="mb-3">
            <Row>
              <Col xs={12} md={4}>
                <Form.Label>💰 Banco</Form.Label>
                <Form.Select
                    value={bancoSelecionado?.id || ""}
                    onChange={(e) => {
                    const selecionado = banco.find((b) => b.id === e.target.value);
                    if (selecionado) setBancoSelecionado(selecionado);
                    }}
                >
                  <option value="">Selecione uma fonte</option>
                  {banco.map((banco) => (
                    <option key={banco.id} value={banco.id}>
                      {banco.nome}
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
                <Form.Label>🗓️ Mês</Form.Label>
                <Form.Select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value)}
                >
                  <option value="">Selecione um mês</option>
                  {mesesDoAno.map((mes) => (
                    <option key={mes.id} value={mes.nome}>
                      {mes.nome}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={2}>
                <Form.Label>🗓️ Ano</Form.Label>
                <Form.Select
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(parseFloat(e.target.value))}
                >
                  <option value="">Ano</option>
                  {anosDisponiveis.map((ano) => (
                    <option key={ano.id} value={ano.ano}>
                      {ano.ano}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
          <Button variant="success" onClick={handleAdicionarFatura}>Adicionar Fatura</Button>
        </Form>
      </Container>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Banco</th>
            <th>Valor</th>
            <th>Mês</th>
            <th>Ano</th>
          </tr>
        </thead>
        <tbody>
          { [... fatura].sort((a,b) => 
          {const dataA = a.ano *100 + ordemMeses[a.mes as keyof typeof ordemMeses];
           const dataB = b.ano * 100 + ordemMeses[b.mes as keyof typeof ordemMeses];
           return dataB - dataA;
          })
          .map((item) => (
            <tr key={item.id}>
              <td>{item.banco.nome}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              <td>{item.mes}</td>
              <td>{item.ano}</td>
              <td className="text-center">
                <FaTrash
                  className="text-danger"
                  title="Deletar Fonte"
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

export default Faturas;
