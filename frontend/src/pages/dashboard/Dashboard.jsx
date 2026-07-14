import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
} from "react-icons/fa";
import { listerLivres } from "../../services/bookService";
import { listerUtilisateurs } from "../../services/userService";
import { historiqueEmprunts } from "../../services/loanService";
import { extractErrorMessage } from "../../services/api";

const cartes = [
  { key: "livres", label: "Total Livres", icon: FaBook, bg: "#e6ebf3", color: "#1b2a4a" },
  { key: "utilisateurs", label: "Utilisateurs", icon: FaUsers, bg: "#e2efe1", color: "#2c6e3f" },
  { key: "empruntsEnCours", label: "Emprunts en cours", icon: FaExchangeAlt, bg: "#f0dcb8", color: "#8a5a1e" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ livres: 0, utilisateurs: 0, empruntsEnCours: 0 });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [livres, utilisateurs, emprunts] = await Promise.all([
          listerLivres(),
          listerUtilisateurs(),
          historiqueEmprunts(),
        ]);
        setStats({
          livres: livres.length,
          utilisateurs: utilisateurs.length,
          empruntsEnCours: emprunts.filter((e) => e.statut !== "RETOURNE").length,
        });
      } catch (e) {
        setErreur(extractErrorMessage(e));
      } finally {
        setChargement(false);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <div className="container-fluid">
        <p className="text-uppercase small fw-semibold mb-1" style={{ color: "var(--bs-secondary)", letterSpacing: "0.08em" }}>
          Tableau de bord
        </p>
        <h2 className="mb-4 fw-bold">Bibliothèque Numérique - DIT</h2>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="row g-4">
          {cartes.map(({ key, label, icon: Icon, bg, color }) => (
            <div className="col-md-4" key={key}>
              <div className="card shadow-hover border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1" style={{ fontFamily: "Inter" }}>{label}</h6>
                    <h2 className="mb-0">{chargement ? "…" : stats[key]}</h2>
                  </div>
                  <div className="stat-icon-wrap" style={{ background: bg }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
