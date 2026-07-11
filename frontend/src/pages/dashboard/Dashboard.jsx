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

        <h2 className="mb-4 fw-bold">
          Tableau de bord
        </h2>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="row g-4">

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6>Total Livres</h6>
                  <h2>{chargement ? "…" : stats.livres}</h2>
                </div>

                <FaBook size={40} className="text-primary"/>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6>Utilisateurs</h6>
                  <h2>{chargement ? "…" : stats.utilisateurs}</h2>
                </div>

                <FaUsers size={40} className="text-success"/>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6>Emprunts en cours</h6>
                  <h2>{chargement ? "…" : stats.empruntsEnCours}</h2>
                </div>

                <FaExchangeAlt size={40} className="text-danger"/>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
