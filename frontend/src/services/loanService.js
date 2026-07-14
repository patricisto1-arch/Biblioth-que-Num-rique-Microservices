import { loansApi, USE_MOCKS } from "./api";
import { mockLoans } from "./mockData";

let mockStore = [...mockLoans];

export async function historiqueEmprunts(utilisateurId) {
  if (USE_MOCKS) {
    if (!utilisateurId) return mockStore;
    return mockStore.filter((e) => e.utilisateurId === utilisateurId);
  }
  const { data } = await loansApi.get("/", { params: utilisateurId ? { utilisateurId } : undefined });
  return data;
}

export async function emprunterLivre(livreId, utilisateurId) {
  if (USE_MOCKS) {
    const nouveau = {
      id: Date.now(),
      livreId,
      utilisateurId,
      dateEmprunt: new Date().toISOString().slice(0, 10),
      dateRetourPrevue: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      dateRetourEffective: null,
      statut: "EN_COURS",
    };
    mockStore = [...mockStore, nouveau];
    return nouveau;
  }
  const { data } = await loansApi.post("/", { livreId, utilisateurId });
  return data;
}

export async function retournerLivre(empruntId) {
  if (USE_MOCKS) {
    mockStore = mockStore.map((e) =>
      e.id === empruntId
        ? { ...e, statut: "RETOURNE", dateRetourEffective: new Date().toISOString().slice(0, 10) }
        : e
    );
    return mockStore.find((e) => e.id === empruntId);
  }
  const { data } = await loansApi.patch(`/${empruntId}/retour`, {});
  return data;
}
