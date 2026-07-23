import { BrowserRouter, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppRouter from './router';
import { AppProvider } from './context/AppContext';

function Layout() {
  const location = useLocation();
  const isLogin = location.pathname === '/';

  if (isLogin) {
    return <AppRouter />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <Navbar />
        <main style={{ marginTop: '64px', padding: '32px' }}>
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AppProvider>
  );
}
