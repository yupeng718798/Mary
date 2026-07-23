import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MedicalRecords from '../pages/MedicalRecords';
import Consultation from '../pages/Consultation';
import Medication from '../pages/Medication';
import Profile from '../pages/Profile';
import Chat from '../pages/Chat';
import BottomNav from '../components/BottomNav';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

export default function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/records"
          element={
            <MainLayout>
              <MedicalRecords />
            </MainLayout>
          }
        />
        <Route
          path="/consultation"
          element={
            <MainLayout>
              <Consultation />
            </MainLayout>
          }
        />
        <Route
          path="/medication"
          element={
            <MainLayout>
              <Medication />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout>
              <Chat />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}
