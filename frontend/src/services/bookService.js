import { booksApi, USE_MOCKS } from "./api";
import { mockBooks } from "./mockData";

let mockStore = [...mockBooks];

export async function listerLivres(recherche) {
  if (USE_MOCKS) {
    if (!recherche) return mockStore;
    const q = recherche.toLowerCase();
    return mockStore.filter(
      (l) =>
        l.titre.toLowerCase().includes(q) ||
        l.auteur.toLowerCase().includes(q) ||
        l.isbn.includes(q)
    );
  }
  const { data } = await booksApi.get("/", { params: recherche ? { q: recherche } : undefined });
  return data;
}

export async function ajouterLivre(livre) {
  if (USE_MOCKS) {
    const nouveau = { ...livre, id: Date.now() };
    mockStore = [...mockStore, nouveau];
    return nouveau;
  }
  const { data } = await booksApi.post("/", livre);
  return data;
}

export async function modifierLivre(id, livre) {
  if (USE_MOCKS) {
    mockStore = mockStore.map((l) => (l.id === id ? { ...l, ...livre } : l));
    return mockStore.find((l) => l.id === id);
  }
  const { data } = await booksApi.put(`/${id}`, livre);
  return data;
}

export async function supprimerLivre(id) {
  if (USE_MOCKS) {
    mockStore = mockStore.filter((l) => l.id !== id);
    return;
  }
  await booksApi.delete(`/${id}`);
}
