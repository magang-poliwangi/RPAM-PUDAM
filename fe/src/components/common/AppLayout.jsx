import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell flex">
      <Sidebar />
      <main className="app-main">
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}
