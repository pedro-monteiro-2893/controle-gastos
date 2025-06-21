import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Controle de Gastos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/controle-gastos">Home</Nav.Link>
            <Nav.Link as={Link} to="/investimentos">Investimentos</Nav.Link>
            <Nav.Link as={Link} to="/gastos">Gastos</Nav.Link>
            <Nav.Link as={Link} to="/faturas">Histórico Faturas</Nav.Link>
            <Nav.Link as={Link} to="/receitas">Receitas</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;