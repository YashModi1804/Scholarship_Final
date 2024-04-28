import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { PiStudent } from "react-icons/pi";
import { SiStatuspage } from "react-icons/si";
import { CiBank } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../image/logo.png';

const AllAdmin = () => {
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
      axios.get('/getUsers')
      .then(users => setUsers(users.data))
      .catch(err => console.log(err))
  },[]);

  const handleShowTable = () => {
    setShowTable(true);
  };

  const handleDownloadPDF = () => {
    // Select the element which you want to convert to pdf
    const input = document.getElementById('pdf-table');

    // Create a canvas
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("download.pdf");
      });
  };

  const handleStatusPage = () => {
    navigate('/status'); // Navigate to the status page
  };

  return (
    <>
      <div className='admin-container'>
        <div className='admin-top'>Scholarship Entry Page</div>
        <div className="admin-container-content">
          <div className="admin-container-content-1">
            <div className="admin-sidebar">
              <div className="admin-sidebar-content">
                <div className="current-admin line"><FaRegUserCircle className='react-icon' /> #Sumit</div> 
                <div className="line"><PiStudent /> Student Details</div>
                <div className="line" onClick={handleStatusPage}><SiStatuspage /> Status</div>
                <div className="line"><CiBank /> Bank's Details</div>
              </div>
            </div>
          </div>
          <div className="admin-container-content-2">
            <div className="admin-content">
              <div className='admin-content-1'>
                <label htmlFor="session"><span>*</span>Session</label>
                <select  className='session-Drop-box drop-box'>
                  <option value="session">SPRING 2024</option>
                  <option value="session">AUTUMN 2024</option>
                </select>
                <label htmlFor="year"><span>*</span>Year</label>
                <select  className='year-Drop-box drop-box'>
                  <option value="student">2024</option>
                  <option value="admin">2023</option>
                </select>
                <label htmlFor="month"><span>*</span>Month</label>
                <select  className='month-Drop-box drop-box'>
                  <option value="student">April</option>
                  <option value="admin">March</option>
                </select>
              </div>
              <div className='admin-content-2'>
                <label htmlFor="degree"><span>*</span>Degree</label>
                <select  className='degree-Drop-box drop-box'>
                  <option value="student">PhD</option>
                </select>
                <label htmlFor="branch"><span>*</span>Branch</label>
                <select  className='branch-Drop-box drop-box'>
                  <option value="student">Computer Science Engineering</option>            </select>
              </div>
            </div>
            <div className="admin-buttons">
              <button className='btn' onClick={handleShowTable}>Show</button>
              <button className='btn'>Excel Report</button>
              <button className='btn' onClick={handleDownloadPDF}>Pdf Report</button>
            </div>
          </div>
        </div>
      </div>
      {showTable && (
        <div id="pdf-table">
          <table>
            <thead>
              <tr>
                <th>Reg No-Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Bank A/C</th>
                <th>Full</th>
                <th>Total Days</th>
                <th>Entitlement</th>
                <th>Actual Scholarship</th>
                <th>HRA @18% of Scholarship</th>
                <th>Net Amount</th>
                {/* <th>Supervisor</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map(user => {
                  return (
                    <tr>
                      <td>{user.enrollment}-{user.name}</td>
                      <td>CSE</td>
                      <td>IV</td>
                      <td>xyz</td>
                      <td><input type="checkbox" className='checkbox' /></td>
                      <td><input type="number" /></td>
                      <td><input type="number" /></td>
                      <td><input type="number" /></td>
                      <td><input type="number" /></td>
                      <td><input type="number" /></td>
                      {/* <td>Sparsh Sharma</td> */}
                      <td><div className="action-buttons"><button className='btn'>Process</button><button className='btn'>Lock</button></div></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table> 
        </div>
      )}
    </>
  )
}

export default AllAdmin;
