import { NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">Challenge — Notas</h1>
        <nav className="nav">
          <NavLink to="/" end>Activas</NavLink>
          <NavLink to="/archived">Archivadas</NavLink>
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

