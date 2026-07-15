
import axios from "axios";

/**
 * Chaque microservice backend a sa propre URL de base, configurable via .env
 * (voir .env.example). Tant que le backend n'est pas prêt, VITE_USE_MOCKS=true
 * fait fonctionner toute l'interface avec des données de test en mémoire.
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

function createClient(baseURL) {
  return axios.create({ baseURL, timeout: 8000 });
}

export const booksApi = createClient(
  import.meta.env.VITE_API_BOOKS_URL || "/api/livres"
);

export const usersApi = createClient(
  import.meta.env.VITE_API_USERS_URL || "/api/utilisateurs"
);

export const loansApi = createClient(
  import.meta.env.VITE_API_LOANS_URL || "/api/emprunts"
);

export function extractErrorMessage(error) {
  if (error?.response) {
    return (
      error.response.data?.message ||
      error.message ||
      "Erreur de communication avec le serveur."
    );
  }
  return error?.message || "Une erreur inattendue est survenue.";
}
