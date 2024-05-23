import React from 'react';
import { FaUser, FaUserGraduate } from "react-icons/fa";
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';

// Import your background image
import backgroundImage from '../image/scholarship.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleUser = () => {
    navigate('/login');
  }

  const handleAdmin = () => {
    navigate('/adminLogin');
  }
  // style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}

  return (
    <>
      {/* <Header /> */}
      <div className='login-top'>National Institute of Technology Srinagar</div>
      <div className="home-container-main">
        <div className="home-container">
          {/* <div className="home-container-main-text">Scholarship Portal</div> */}
          <div className="home-section">
            <div className="home-user home-section-common" onClick={handleUser}>
              <div className="user-logo"><FaUserGraduate className='home-logo' /></div>
              <div className='home-section-text'>User</div>
            </div>
            <div className="home-admin home-section-common" onClick={handleAdmin}>
              <div className="admin-logo"><FaUser className='home-logo' id='home-logo-admin' /></div>
              <div className='home-section-text'>Admin</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
