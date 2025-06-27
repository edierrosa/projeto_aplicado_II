import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import UsuarioCadastro from './pages/UsuarioCadastro';
import Livros from './pages/Livros';
import LivroCadastro from './pages/LivroCadastro';
import Emprestimos from './pages/Emprestimos';
import EmprestimoCadastro from './pages/EmprestimoCadastro';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/cadastro" element={<UsuarioCadastro />} />
        <Route path="/usuarios/cadastro/:id" element={<UsuarioCadastro />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/livros/cadastro" element={<LivroCadastro />} />
        <Route path="/livros/cadastro/:id" element={<LivroCadastro />} />
        <Route path="/emprestimos" element={<Emprestimos />} />
        <Route path="/emprestimos/cadastro" element={<EmprestimoCadastro />} />
      </Routes>
    </Router>
  );
}

export default App;
