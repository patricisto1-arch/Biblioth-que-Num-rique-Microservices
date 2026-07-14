import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <main className="container-fluid p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
