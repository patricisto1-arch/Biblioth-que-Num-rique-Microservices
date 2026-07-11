import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-grow-1 bg-light min-vh-100">
        <main className="container-fluid p-4">
          {children}
        </main>
      </div>
    </div>
  );
}