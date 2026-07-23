import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MedicalRecords from '../pages/MedicalRecords';
import Consultation from '../pages/Consultation';
import Medication from '../pages/Medication';
import Profile from '../pages/Profile';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/records" element={<MedicalRecords />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="/medication" element={<Medication />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
