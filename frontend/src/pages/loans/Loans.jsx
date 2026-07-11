import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import { historiqueEmprunts, emprunterLivre, retournerLivre } from "../../services/loanService";
import { listerLivres } from "../../services/bookService";
import { listerUtilisateurs } from "../../services/userService";
import { extractErrorMessage } from "../../services/api";

const badgeStatut = {
  RETOURNE: "bg-success",
  EN_COURS: "bg-warning text-dark",
  EN_RETARD: "bg-danger",
};

const libelleStatut = {
  RETOURNE: "Retourné",
  EN_COURS: "En cours",
  EN_RETARD: "En retard",
};

export default function Loans() {
  const [emprunts, setEmprunts] = useState([]);
  const [livres, setLivres] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [livreId, setLivreId] = useState("");
  const [utilisateurId, setUtilisateurId] = useState("");

  async function charger() {
    setChargement(true);
    setErreur(null);
    try {
      const [e, l, u] = await Promise.all([historiqueEmprunts(), listerLivres(), listerUtilisateurs()]);
      setEmprunts(e);
      setLivres(l);
      setUtilisateurs(u);
    } catch (e) {
      setErreur(extractErrorMessage(e));
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  function nomLivre(id) {
    return livres.find((l) => l.id === id)?.titre ?? `#${id}`;
  }

  function nomUtilisateur(id) {
    const u = utilisateurs.find((u) => u.id === id);
    return u ? `${u.prenom} ${u.nom}` : `#${id}`;
  }

  async function soumettre(e) {
    e.preventDefault();
    if (!livreId || !utilisateurId) return;
    try {
      await emprunterLivre(livreId, utilisateurId);
      setLivreId("");
      setUtilisateurId("");
      await charger();
    } catch (e) {
      setErreur(extractErrorMessage(e));
    }
  }

  async function retourner(emprunt) {
    try {
      await retournerLivre(emprunt.id);
      await charger();
    } catch (e) {
      setErreur(extractErrorMessage(e));
    }
  }

  const livresDisponibles = livres.filter((l) => l.disponible);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <FaExchangeAlt className="text-primary me-2" />
          Gestion des emprunts
        </h2>
        <p className="text-muted mb-0">Emprunter un livre, enregistrer un retour, consulter l'historique.</p>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={soumettre}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Livre</label>
                <select className="form-select" required value={livreId} onChange={(e) => setLivreId(e.target.value)}>
                  <option value="">Sélectionner un livre disponible</option>
                  {livresDisponibles.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.titre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Utilisateur</label>
                <select
                  className="form-select"
                  required
                  value={utilisateurId}
                  onChange={(e) => setUtilisateurId(e.target.value)}
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {utilisateurs.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  Emprunter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {chargement ? (
            <p className="text-center text-muted py-5 mb-0">Chargement de l'historique…</p>
          ) : emprunts.length === 0 ? (
            <p className="text-center text-muted py-5 mb-0">Aucun emprunt enregistré.</p>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Livre</th>
                  <th>Utilisateur</th>
                  <th>Date d'emprunt</th>
                  <th>Retour prévu</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {emprunts.map((e) => (
                  <tr key={e.id}>
                    <td>{nomLivre(e.livreId)}</td>
                    <td>{nomUtilisateur(e.utilisateurId)}</td>
                    <td className="font-monospace small">{e.dateEmprunt}</td>
                    <td className="font-monospace small">{e.dateRetourPrevue}</td>
                    <td>
                      <span className={`badge ${badgeStatut[e.statut]}`}>{libelleStatut[e.statut]}</span>
                    </td>
                    <td>
                      {e.statut !== "RETOURNE" && (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => retourner(e)}>
                          Marquer retourné
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
