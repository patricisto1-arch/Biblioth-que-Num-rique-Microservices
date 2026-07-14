import { NavLink } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaChartPie,
} from "react-icons/fa";

const links = [
  { to: "/", label: "Dashboard", icon: FaChartPie, end: true },
  { to: "/books", label: "Livres", icon: FaBook },
  { to: "/users", label: "Utilisateurs", icon: FaUsers },
  { to: "/loans", label: "Emprunts", icon: FaExchangeAlt },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-badge">DIT</div>
        <div>
          <p className="brand-title">Bibliothèque</p>
          <p className="brand-sub">Numérique</p>
        </div>
        </div>

      <nav className="nav flex-column">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <Icon className="me-2" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
