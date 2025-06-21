
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Container, Form, Button, Table, Row, Col} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Estilos padrão
import { adicionarBanco, buscarBancos, removerBancoDaBase } from "../utils/databaseUtil";
import type { Banco } from "../utils/util";
import { confirmAlert } from "react-confirm-alert";


const Bancos = () => {

    const [descricao, setDescricao] = useState("");
    const [nome, setNome] = useState("");
    const [banco, setBanco] = useState<Banco[]>([]);
    const [displayForm, setDisplayForm] = useState(false);
        
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

useEffect(() => {
        const carregarBancos = async () => {
            const dados = await buscarBancos();
            setBanco(dados);
        };
        carregarBancos();
    }, []);

const confirmarRemocao = (item:Banco) => {
        confirmAlert({
            title: "Confirmar exclusão",
            message: "Deseja realmente excluir essa fonte?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => removerBanco(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Remoção cancelada")
                }
            ]
        });
    };


    const handleAdicionarBanco = async () => {
        if (!nome ||!descricao) return;

        const novoBanco: Banco = {
            nome: nome,
            descricao: descricao,
            dataSalvamento: null
        };

        await adicionarBanco(novoBanco);

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarBancos();
        setBanco(dadosAtualizados);

        // Limpar campos
        setDescricao("");
        setNome("");
    };

    const removerBanco = async (banco : Banco) => {
        
        if (!banco.id) {
            console.error("Banco sem ID não pode ser removido.");
        return;
        }
 
        try {
            await removerBancoDaBase(banco.id);

            // Atualiza a lista de fontes na tela removendo o item excluído
            setBanco((prevBancos:any) => prevBancos.filter((f:Banco) => f.id !== banco.id));

            mostrarMensagem(`Banco "${banco.nome}" removida com sucesso!`, "success");
        } catch (error) {
            mostrarMensagem("Erro ao remover banco!", "error");
            console.error("Erro ao remover banco:", error);
        }
    };

    const exibirFormCadastro = () => {
        setDisplayForm(true);
    }

return (
        <Container className="mt-4">
            <h2 className="text-center mb-4 text-primary fw-bold display-5">
                <span style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>💰 Bancos </span>
            </h2>

            {displayForm &&
                <Container className="bg-light border rounded p-4 mt-4 shadow-sm">
                <Form>
                    <Form.Group className="mb-3">
                        <Row className="justify-content-center g-3"> {/* Centraliza e adiciona espaçamento */}
                            <Col xs={12} md={6}> {/* Ocupa 4 colunas no md+ e 12 em telas menores */}
                                <Form.Label className="fw-bold">Nome</Form.Label>
                                <Form.Control
                                    required={true}
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Banco do Brasil, Nubank ..."
                                />
                            </Col>
            
                            <Col xs={12} md={6}>
                                <Form.Label className="fw-bold">Descrição</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Ex: Breve descrição..."
                                />
                            </Col>
                        </Row>
                    </Form.Group>
            
                    <div className="text-center"> {/* Centraliza o botão */}
                        <Button variant="success" onClick={handleAdicionarBanco}>Adicionar Banco</Button>
                    </div>
                </Form>
            </Container>}

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    {banco.map((item:Banco, index:number) => {
                        return (
                            <tr key={item.id || index}>
                                <td>{item.nome}</td>
                                <td>{item.descricao}</td>
                                <td className="text-center">
                                    <FaTrash
                                        className="text-danger"
                                        title="Deletar Fonte"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => confirmarRemocao(item)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Button className="d-flex justify-content-end" variant="success" size="sm" onClick={exibirFormCadastro}>Cadatrar Novo Banco</Button>
        </Container>
    );
};

export default Bancos;
