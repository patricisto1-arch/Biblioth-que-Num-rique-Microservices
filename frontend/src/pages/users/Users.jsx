import { useEffect, useState } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import { listerUtilisateurs, creerUtilisateur } from "../../services/userService";
import { extractErrorMessage } from "../../services/api";

const vide = { nom: "", prenom: "", email: "", type: "ETUDIANT", matricule: "" };

const libelleType = {
  ETUDIANT: "Étudiant",
  PROFESSEUR: "Professeur",
  PERSONNEL_ADMIN: "Personnel administratif",
};

const badgeType = {
  ETUDIANT: "bg-success",
  PROFESSEUR: "bg-warning text-dark",
  PERSONNEL_ADMIN: "bg-secondary",
};

export default function Users() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [formOuvert, setFormOuvert] = useState(false);
  const [form, setForm] = useState(vide);

  async function charger() {
    setChargement(true);
    setErreur(null);
    try {
      setUtilisateurs(await listerUtilisateurs());
    } catch (e) {
      setErreur(extractErrorMessage(e));
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function soumettre(e) {
    e.preventDefault();
    try {
      await creerUtilisateur(form);
      setForm(vide);
      setFormOuvert(false);
      await charger();
    } catch (e) {
      setErreur(extractErrorMessage(e));
    }
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <FaUsers className="text-primary me-2" />
            Gestion des utilisateurs
          </h2>
          <p className="text-muted mb-0">Étudiants, professeurs et personnel administratif inscrits.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setFormOuvert((v) => !v)}>
          <FaPlus className="me-2" />
          Nouvel utilisateur
        </button>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {formOuvert && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <form onSubmit={soumettre}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Prénom</label>
                  <input
                    className="form-control"
                    required
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Nom</label>
                  <input
                    className="form-control"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="PROFESSEUR">Professeur</option>
                    <option value="PERSONNEL_ADMIN">Personnel administratif</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Matricule (optionnel)</label>
                  <input
                    className="form-control"
                    value={form.matricule}
                    onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setFormOuvert(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {chargement ? (
            <p className="text-center text-muted py-5 mb-0">Chargement des utilisateurs…</p>
          ) : utilisateurs.length === 0 ? (
            <p className="text-center text-muted py-5 mb-0">Aucun utilisateur enregistré.</p>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Matricule</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.prenom} {u.nom}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${badgeType[u.type]}`}>{libelleType[u.type]}</span>
                    </td>
                    <td className="font-monospace small">{u.matricule || "—"}</td>
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
