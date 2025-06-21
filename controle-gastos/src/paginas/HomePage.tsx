import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {

  const botoes = [
    {
      titulo: "Investimentos",
      imagem: "/passive-income.png",
      link: "/investimentos"
    },
    {
      titulo: "Gastos",
      imagem: "/carro.png",
      link: "/gastos"
    },
    {
      titulo: "Faturas",
      imagem: "/credit-card.png",
      link: "/faturas"
    },
    {
      titulo: "Receitas",
      imagem: "/money-bag.png",
      link: "/receitas"
    }
  ];

    return (
        <Container className="py-4">
      <Row className="justify-content-center g-4">
        {botoes.map((botao, index) => (
          <Col key={index} xs={6} md={3} className="text-center">
            <Button
              as={Link as any}
              to={botao.link}
              variant="light"
              className="w-100 p-3 border rounded shadow-sm d-flex flex-column align-items-center"
            >
              <img
                src={botao.imagem}
                alt={botao.titulo}
                style={{ width: "60px", height: "60px", marginBottom: "10px" }}
              />
              <span>{botao.titulo}</span>
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
    
};

export default HomePage;