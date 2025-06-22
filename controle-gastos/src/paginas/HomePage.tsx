import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import passiveIncome from '../assets/passive-income.png';
import gastosImage from '../assets/carro.png';
import creditCard from '../assets/credit-card.png';
import moneyBag from '../assets/money-bag.png'

const HomePage = () => {

  const botoes = [
    {
      titulo: "Investimentos",
      imagem: passiveIncome,
      link: "/investimentos"
    },
    {
      titulo: "Gastos",
      imagem: gastosImage,
      link: "/gastos"
    },
    {
      titulo: "Faturas",
      imagem: creditCard,
      link: "/faturas"
    },
    {
      titulo: "Receitas",
      imagem: moneyBag,
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