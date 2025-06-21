import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./paginas/NavigationBar";
import HomePage from "./paginas/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bancos from "./paginas/Bancos";
import Faturas from "./paginas/Fatura";
import Categorias from "./paginas/Categorias";
import Gastos from "./paginas/Gastos";
import Investimentos from "./paginas/Investimentos";

function App() {

  return (
    <>
    <Router>
      <NavigationBar/>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Routes>
        <Route path="/controle-gastos" element={<HomePage/>}  />
        <Route path="/bancos" element={<Bancos/>}  />
        <Route path="/faturas" element={<Faturas/>}  />
        <Route path="/categorias" element={<Categorias/>}  />
        <Route path="/gastos" element={<Gastos/>}  />
        <Route path="/investimentos" element={<Investimentos/>}  />
      </Routes>
    </Router>
    </>
  )
}

export default App
