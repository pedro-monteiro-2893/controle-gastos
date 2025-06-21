
import { useState, useEffect } from "react";
import { FaRedo, FaTrash } from "react-icons/fa";
import { Container, Form, Button, Table, Row, Col, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Estilos padrão
import { adicionarInvestimento, buscarBancos, buscarInvestimentos, removerInvestimentoDaBase } from "../utils/databaseUtil";
import { categoriasInvestimento, type Banco, type Investimento } from "../utils/util";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format } from "date-fns";



const Investimentos = () => {

    //Filtros
    const [filtroCategoria, setFiltroCategoria] = useState<string>("");

    const [bancoSelecionado, setBancoSelecionado] = useState<Banco | null>(null);
    const [banco, setBanco] = useState<Banco[]>([]);
    const [investimento, setInvestimento] = useState<Investimento[]>([]);
    const [valor, setValor] = useState(0);
    const [tipoInvestimento, setTipoInvestimento] = useState("");
    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

    const handleDateChange = (date: Date | null) => {
        setDataSelecionada(date);
    };

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

    const investimentosFiltrados = investimento.filter((i) => {
        return !filtroCategoria || filtroCategoria === i.tipoInvestimento;
    });

    const agrupado = new Map<string, Record<string, any>>();

    investimentosFiltrados.forEach((item) => {
        const data = format(item.dataRegistro, "dd/MM/yyyy");
        const categoria = item.tipoInvestimento;

        if (!agrupado.has(data)) {
            agrupado.set(data, { data });
        }

        const entrada = agrupado.get(data)!;
        entrada[categoria] = (entrada[categoria] || 0) + item.valor;
    });

    const dadosGraficoMultilinhas = Array.from(agrupado.values())
        .sort((a, b) => {
            const [diaA, mesA, anoA] = a.data.split("/").map(Number);
            const [diaB, mesB, anoB] = b.data.split("/").map(Number);
            return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
        });

    const dadosGraficoLinha = investimentosFiltrados.reduce((acc: Record<string, { total: number, rawDate: Date }>, item) => {
        const rawDate = item.dataRegistro;
        const formattedDate = format(rawDate, "dd/MM/yyyy");

        if (!acc[formattedDate]) {
            acc[formattedDate] = { total: 0, rawDate };
        }

        acc[formattedDate].total += item.valor;
        return acc;
    }, {});


    // Transforma em array para o gráfico
    const dadosGraficoPorData = Object.entries(dadosGraficoLinha)
        .map(([data, { total, rawDate }]) => ({ data, total, rawDate }))
        .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());


    //Carrego os bancos e faturas para popular lista
    useEffect(() => {
        const carregarDados = async () => {
            try {

                const bancos = await buscarBancos();
                setBanco(bancos);

                const investimentos = await buscarInvestimentos();
                setInvestimento(investimentos);

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        carregarDados();
    }, []);

    const confirmarRemocao = (item: Investimento) => {
        confirmAlert({
            title: "Confirmar exclusão",
            message: "Deseja realmente excluir essa fatura?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => removerInvestimento(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Remoção cancelada")
                }
            ]
        });
    };


       const confirmarReentrada = (item: Investimento) => {
        confirmAlert({
            title: "Confirmar Repetir o valor do investimento para data de hoje",
            message: "Deseja realmente repetir a operacao ?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => repetirEntrada(item)
                },
                {
                    label: "Cancelar",
                    onClick: () => console.log("Repetição cancelada")
                }
            ]
        });
    };

    

    const repetirEntrada = async (item:Investimento) => {

        const novoInvestimento: Investimento = {
            banco: item.banco,
            dataRegistro: new Date(),
            valor: item.valor,
            tipoInvestimento: item.tipoInvestimento,
            dataSalvamento: null
        };

        await adicionarInvestimento(novoInvestimento);

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarInvestimentos();
        setInvestimento(dadosAtualizados);

    };


    const handleAdicionarInvestimento = async () => {
        if (!bancoSelecionado || !dataSelecionada || !valor || !tipoInvestimento) return;

        const novoInvestimento: Investimento = {
            banco: bancoSelecionado,
            dataRegistro: dataSelecionada,
            valor: valor,
            tipoInvestimento: tipoInvestimento,
            dataSalvamento: null
        };

        await adicionarInvestimento(novoInvestimento);

        // Atualizar lista após salvar no Firebase
        const dadosAtualizados = await buscarInvestimentos();
        setInvestimento(dadosAtualizados);


    };

    const removerInvestimento = async (investimento: Investimento) => {

        if (!investimento.id) {
            console.error("Banco sem ID não pode ser removido.");
            return;
        }

        try {
            await removerInvestimentoDaBase(investimento.id);

            // Atualiza a lista de fontes na tela removendo o item excluído
            setInvestimento((prevInvestimentos: any) => prevInvestimentos.filter((f: Investimento) => f.id !== investimento.id));

            mostrarMensagem(`Fatura removida com sucesso!`, "success");
        } catch (error) {
            mostrarMensagem("Erro ao remover fatura!", "error");
            console.error("Erro ao remover fatura:", error);
        }
    };


    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4 text-primary fw-bold display-5">
                <span style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>📈 Investimentos</span>
            </h2>
            <Container className="bg-light border rounded p-4 mt-4 shadow-sm">

                <Form>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col xs={12} md={3}>
                                <Form.Label>💰 Banco</Form.Label>
                                <Form.Select
                                    value={bancoSelecionado?.id || ""}
                                    onChange={(e) => {
                                        const selecionado = banco.find((b) => b.id === e.target.value);
                                        if (selecionado) setBancoSelecionado(selecionado);
                                    }}
                                >
                                    <option value="">Selecione um Banco</option>
                                    {banco.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col xs={12} md={3}>
                                <Form.Label> Tipo Investimento</Form.Label>
                                <Form.Select
                                    value={tipoInvestimento}
                                    onChange={(e) => setTipoInvestimento(e.target.value)}
                                >
                                    <option value="">Selecione um tipo</option>
                                    {categoriasInvestimento.map((c) => (
                                        <option key={c.id} value={c.nome}>
                                            {c.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col xs={12} md={3}>
                                <Form.Label>📊 Valor (R$)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={valor}
                                    onChange={(e) => setValor(parseFloat(e.target.value))}
                                    placeholder="Ex: 500.00"
                                />
                            </Col>

                            <Col xs={12} md={3}>
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
                    <Button variant="success" onClick={handleAdicionarInvestimento}>Adicionar Investimento</Button>
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
                                {categoriasInvestimento.map((c) => (
                                    <option key={c.id} value={c.nome}>{c.nome}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                </Form>

                <h5 className="mt-4">Evolucao Patrimonio Total</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dadosGraficoPorData}>
                        <XAxis dataKey="data" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>

                <h5 className="mt-5">Evolução por Categoria</h5>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dadosGraficoMultilinhas}>
                        <XAxis dataKey="data" />
                        <YAxis />
                        <Tooltip />
                        {
                            categoriasInvestimento.map((c) => (
                                <Line
                                    key={c.nome}
                                    type="monotone"
                                    dataKey={c.nome}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))
                        }
                    </LineChart>
                </ResponsiveContainer>

            </Container>

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Banco</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {[...investimento].sort((a, b) => {
                        const dataA = (a.dataRegistro as Date).getTime();
                        const dataB = (b.dataRegistro as Date).getTime();
                        return dataB - dataA;
                    })
                        .map((item) => (
                            <tr key={item.id}>
                                <td>{item.banco.nome}</td>
                                <td>{item.tipoInvestimento}</td>
                                <td>R$ {item.valor.toFixed(2)}</td>
                                <td>{item.dataRegistro.toLocaleDateString("pt-BR")}</td>
                                <td className="text-center">
                                    <FaRedo
                                        className="text-sucess"
                                        title="Repetir Entrada"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => confirmarReentrada(item)}
                                    />
                                </td>
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

export default Investimentos;
