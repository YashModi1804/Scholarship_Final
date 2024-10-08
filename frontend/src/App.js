import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Student from './pages/Student'
import AllAdmin from './pages/AllAdmin';
import Status from "./pages/status";
import BankAcc from './pages/BankAcc';
import InsertStudentData from './pages/developer.js';
import Admin from './pages/Admin.js';
import Admin_details from './pages/Admin_details.js';
import AdminLogin from './pages/AdminLogin.js';
import Adean from './pages/Adean.js'
import Dean from './pages/Dean.js'
import SectionHead from './pages/SectionHead.js'
import Aregistrar from './pages/Aregistrar.js'
import Draccounts from './pages/Draccounts.js'
import SuperAdmin from './pages/super_admin.js'
import Home from './pages/Home.js';
import Reset from './pages/Reset.jsx';
import PasswordForm from './pages/PasswordForm.js';
import ResetAdminPassword from './pages/ResetAdmin.js';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/passwordForm" element={<PasswordForm />} />
        <Route path="/resetPassword" element={<Reset />}/>
        <Route path="/resetAdminPassword" element={<ResetAdminPassword />}/>
        <Route path="/student" element={<Student />} />
        <Route path="/allAdmin" element={<AllAdmin />} />
        <Route path="/status" element={<Status/>}/>
        <Route path="/bankAcc" element={<BankAcc/>}/>
        <Route path="/studentDetails" element={<InsertStudentData/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/adean" element={<Adean/>}/>
        <Route path="/dean" element={<Dean/>}/>
        <Route path="/aregistrar" element={<Aregistrar/>}/>
        <Route path="/sectionhead" element={<SectionHead/>}/>
        <Route path="/draccountant" element={<Draccounts/>}/>
        <Route path="/SuperAdmin" element={<SuperAdmin/>}/>
        <Route path="/admin_details" element={<Admin_details/>}/>
        <Route path="/" element={<AdminLogin/>}/>
      </Routes>
    </BrowserRouter>
  );
}
