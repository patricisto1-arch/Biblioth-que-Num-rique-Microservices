import { useEffect, useState } from "react";
import { FaBook, FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import { listerLivres, ajouterLivre, modifierLivre, supprimerLivre } from "../../services/bookService";
import { extractErrorMessage } from "../../services/api";

const vide = { titre: "", auteur: "", isbn: "", categorie: "", disponible: true };

export default function Books() {
  const [livres, setLivres] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [formOuvert, setFormOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState(null);
  const [form, setForm] = useState(vide);

  async function charger(q) {
    setChargement(true);
    setErreur(null);
    try {
      setLivres(await listerLivres(q));
    } catch (e) {
      setErreur(extractErrorMessage(e));
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  function ouvrirAjout() {
    setEnEdition(null);
    setForm(vide);
    setFormOuvert(true);
  }

  function ouvrirEdition(livre) {
    setEnEdition(livre);
    setForm({ ...livre });
    setFormOuvert(true);
  }

  async function soumettre(e) {
    e.preventDefault();
    try {
      if (enEdition) {
        await modifierLivre(enEdition.id, form);
      } else {
        await ajouterLivre(form);
      }
      setFormOuvert(false);
      await charger(recherche);
    } catch (e) {
      setErreur(extractErrorMessage(e));
    }
  }

  async function supprimer(livre) {
    if (!confirm(`Supprimer "${livre.titre}" ?`)) return;
    try {
      await supprimerLivre(livre.id);
      await charger(recherche);
    } catch (e) {
      setErreur(extractErrorMessage(e));
    }
  }

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <FaBook className="text-primary me-2" />
            Gestion des livres
          </h2>
          <p className="text-muted mb-0">Catalogue, recherche, ajout et modification des ouvrages.</p>
        </div>
        <button className="btn btn-primary" onClick={ouvrirAjout}>
          <FaPlus className="me-2" />
          Ajouter un livre
        </button>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="input-group mb-4" style={{ maxWidth: 420 }}>
        <span className="input-group-text bg-white">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par titre, auteur ou ISBN…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && charger(recherche)}
        />
        <button className="btn btn-outline-secondary" onClick={() => charger(recherche)}>
          Rechercher
        </button>
      </div>

      {formOuvert && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <form onSubmit={soumettre}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Titre</label>
                  <input
                    className="form-control"
                    required
                    value={form.titre}
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Auteur</label>
                  <input
                    className="form-control"
                    required
                    value={form.auteur}
                    onChange={(e) => setForm({ ...form, auteur: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">ISBN</label>
                  <input
                    className="form-control"
                    required
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Catégorie</label>
                  <input
                    className="form-control"
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Disponibilité</label>
                  <select
                    className="form-select"
                    value={form.disponible ? "1" : "0"}
                    onChange={(e) => setForm({ ...form, disponible: e.target.value === "1" })}
                  >
                    <option value="1">Disponible</option>
                    <option value="0">Emprunté</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setFormOuvert(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {enEdition ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {chargement ? (
            <p className="text-center text-muted py-5 mb-0">Chargement du catalogue…</p>
          ) : livres.length === 0 ? (
            <p className="text-center text-muted py-5 mb-0">Aucun livre trouvé.</p>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>ISBN</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {livres.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.titre}</strong>
                      {l.categorie && <div className="text-muted small">{l.categorie}</div>}
                    </td>
                    <td>{l.auteur}</td>
                    <td className="font-monospace small">{l.isbn}</td>
                    <td>
                      <span className={`badge ${l.disponible ? "bg-success" : "bg-warning text-dark"}`}>
                        {l.disponible ? "Disponible" : "Emprunté"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => ouvrirEdition(l)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => supprimer(l)}>
                          <FaTrash />
                        </button>
                      </div>
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
