import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaChartPie,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div
      className="bg-primary text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <div className="text-center mb-5">
        <h3>📚</h3>
        <h5>Bibliothèque</h5>
        <small>DIT</small>
      </div>

      <ul className="nav flex-column">

        <li className="nav-item mb-3">
          <Link className="nav-link text-white" to="/">
            <FaChartPie className="me-2" />
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link className="nav-link text-white" to="/books">
            <FaBook className="me-2" />
            Livres
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link className="nav-link text-white" to="/users">
            <FaUsers className="me-2" />
            Utilisateurs
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/loans">
            <FaExchangeAlt className="me-2" />
            Emprunts
          </Link>
        </li>

      </ul>
    </div>
  );
}