import React from 'react';
import logo from '../image/logo.png';

const Header = () => {
  return (
    <>
     <div className="header-container ">
      <div className="header-logo">
        <img src={logo} alt="" />
      </div>
      <div className="header-content">
        <h1>Scholarship Portal</h1>
      </div>
     </div>
    </>
  )
}

export default Header;
