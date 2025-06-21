
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Container, Form, Button, Table, Row, Col} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Estilos padrão
import { adicionarCategoria, buscarCategorias, removerCategoriaDaBase } from "../utils/databaseUtil";
import type { Categoria } from "../utils/util";
import { confirmAlert } from "react-confirm-alert";


const Categorias = () => {

    const [descricao, setDescricao] = useState("");
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState<Categoria[]>([]);
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
        const carregarCategorias = async () => {
            const dados = await buscarCategorias();
            setCategoria(dados);
        };
        carregarCategorias();
    }, []);

const confirmarRemocao = (item:Categoria) => {
        confirmAlert({
            title: "Confirmar exclusão",
            message: "Deseja realmente excluir essa fonte?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => removerCategoria(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Remoção cancelada")
                }
            ]
        });
    };


    const handleAdicionarCategoria = async () => {
        if (!nome ||!descricao) return;

        const novaCategoria: Categoria = {
            nome: nome,
            descricao: descricao,
            dataSalvamento: null
        };

        await adicionarCategoria(novaCategoria);

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarCategorias();
        setCategoria(dadosAtualizados);

        // Limpar campos
        setDescricao("");
        setNome("");
    };

    const removerCategoria = async (categoria : Categoria) => {
        
        if (!categoria.id) {
            console.error("Banco sem ID não pode ser removido.");
        return;
        }
 
        try {
            await removerCategoriaDaBase(categoria.id);

            // Atualiza a lista de fontes na tela removendo o item excluído
            setCategoria((prevCategorias:any) => prevCategorias.filter((f:Categoria) => f.id !== categoria.id));

            mostrarMensagem(`Categoria "${categoria.nome}" removida com sucesso!`, "success");
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
                <span style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>💸 Categorias </span>
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
                        <Button variant="success" onClick={handleAdicionarCategoria}>Adicionar Categoria</Button>
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
                    {categoria.map((item:Categoria, index:number) => {
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

            <Button className="d-flex justify-content-end" variant="success" size="sm" onClick={exibirFormCadastro}>Cadatrar Nova Categoria</Button>
        </Container>
    );
};

export default Categorias;
