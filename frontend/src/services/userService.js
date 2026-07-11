import { usersApi, USE_MOCKS } from "./api";
import { mockUsers } from "./mockData";

let mockStore = [...mockUsers];

export async function listerUtilisateurs() {
  if (USE_MOCKS) return mockStore;
  const { data } = await usersApi.get("/");
  return data;
}

export async function creerUtilisateur(utilisateur) {
  if (USE_MOCKS) {
    const nouveau = { ...utilisateur, id: Date.now() };
    mockStore = [...mockStore, nouveau];
    return nouveau;
  }
  const { data } = await usersApi.post("/", utilisateur);
  return data;
}
