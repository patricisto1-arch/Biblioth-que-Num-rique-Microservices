export const mockBooks = [
  { id: 1, titre: "Clean Code", auteur: "Robert C. Martin", isbn: "978-0132350884", disponible: true, categorie: "Informatique" },
  { id: 2, titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", isbn: "978-2070408504", disponible: false, categorie: "Littérature" },
  { id: 3, titre: "Introduction to Algorithms", auteur: "Cormen, Leiserson, Rivest, Stein", isbn: "978-0262033848", disponible: true, categorie: "Informatique" },
  { id: 4, titre: "Une si longue lettre", auteur: "Mariama Bâ", isbn: "978-2708702016", disponible: true, categorie: "Littérature africaine" },
];

export const mockUsers = [
  { id: 1, nom: "Thiam", prenom: "Serigne Saliou", email: "s.thiam@dit.sn", type: "ETUDIANT", matricule: "DIT2024-118" },
  { id: 2, nom: "Ndiaye", prenom: "Fatou", email: "f.ndiaye@dit.sn", type: "PROFESSEUR", matricule: "" },
  { id: 3, nom: "Diop", prenom: "Moussa", email: "m.diop@dit.sn", type: "PERSONNEL_ADMIN", matricule: "" },
];

export const mockLoans = [
  {
    id: 1,
    livreId: 2,
    utilisateurId: 1,
    dateEmprunt: "2026-07-01",
    dateRetourPrevue: "2026-07-15",
    dateRetourEffective: null,
    statut: "EN_COURS",
  },
];
