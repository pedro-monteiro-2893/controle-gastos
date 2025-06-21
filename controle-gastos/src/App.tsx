import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./paginas/NavigationBar";
import HomePage from "./paginas/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bancos from "./paginas/Bancos";
import Faturas from "./paginas/Fatura";
import Categorias from "./paginas/Categorias";

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
      </Routes>
    </Router>
    </>
  )
}

export default App
