import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
const Home = () => {

  const navigate = useNavigate();

  const handleUser = () => {
    navigate('/login');
  }
  const handleAdmin = () => {
    navigate('/adminLogin');
  }

  return (
    <>
      <div className="admin-top">Scholarship Portal</div>
      <div className="home-container">
        {/* <div className="admin-top" id="home-top">Scholarship Portal</div> */}
        <div className="home-section">
          <div className="home-user home-section-common" onClick={handleUser}>
            <div className="user-logo"><FaUserGraduate className='home-logo' /></div>
            <div>User</div>
          </div>
          <div className="home-admin home-section-common" onClick={handleAdmin}>
            <div className="admin-logo"><FaUser className='home-logo' id='home-logo-admin' /></div>
            <div>Admin</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home