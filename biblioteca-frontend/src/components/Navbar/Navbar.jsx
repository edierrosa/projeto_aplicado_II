import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Biblioteca</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios">Usuários</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/livros">Livros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/emprestimos">Empréstimos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
