import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { PiStudent } from "react-icons/pi";
import { SiStatuspage } from "react-icons/si";
import { CiBank } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import month from 'months';
import * as XLSX from 'xlsx'; // Import the xlsx library
import daysInMonth from '@stdlib/time-days-in-month' ;
import logo from '../image/logo.png';



const URL = "http://localhost:8800/api/studentDetails/scholarshipDetail";

const AllAdmin = () => {
  const [scholarshipDetail, setScholarshipDetail] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    semester: '',
    branch: '',
    bankAccount: '',
    month:'',
    totalDays: '',
    entitlement: '',
    actualScholarship: '',
    hra: '',
    netAmount: '',
    verification_supervisor: ''
    
  });
  const [loading, setLoading] = useState(true);

  const fetchAndFilterStudents = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`/api/get_supervisor/${userId}`);
      const { name, department } = response.data;
      const studentsResponse = await axios.get('/getScholarshipDetail');
      const filteredStudents = studentsResponse.data.filter(student => (student.supervisor === name && student.branch === department));
      setScholarshipDetail(filteredStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndFilterStudents();
  }, []);

  const handleVerificationToggle = async (index) => {
    try {
      const student = scholarshipDetail[index];
      const updatedResponse = await axios.put(`/api/update_supervisor_verification/verify/${student._id}`);
      const updatedStudent = { ...student, verification_supervisor: true };
      setScholarshipDetail(prevDetails => prevDetails.map((item, idx) => idx === index ? updatedStudent : item));
      toast.success("Verification Supervisor Successful");
      await fetchAndFilterStudents();
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const handleValidationToggle = async (index) => {
    try {
      const student = scholarshipDetail[index];
      const updatedResponse = await axios.put(`/api/update_supervisor_validation/validate/${student._id}`);
      const updatedStudent = { ...student, validation_supervisor: true };
      setScholarshipDetail(prevDetails => prevDetails.map((item, idx) => idx === index ? updatedStudent : item));
      toast.success("Validation Supervisor Successful");
      await fetchAndFilterStudents();
    } catch (error) {
      console.error('Error updating validation status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          enrollment: '',
          semester: '',
          branch: '',
          bankAccount: '',
          month:'',
          totalDays: '',
          entitlement: '',
          actualScholarship: '',
          hra: '',
          netAmount: ''

        });
        toast.success("Update Successful");
        setEditIndex(null);
        await fetchAndFilterStudents();
      } else {
        const errorData = await response.json();
        toast.error(`Update failed: ${errorData.message}`);
        console.error("Error updating details:", errorData);
      }
    } catch (error) {
      console.log("Error updating details: ", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(scholarshipDetail[index]);
  };

  const handleDownloadPDF = async () => {
    if (scholarshipDetail.length === 0) return;

    try {
      // Create a PDF with the fetched data
      let pdfContent = `
        <div id="pdf-content">
        <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-items: center; margin-bottom: 2px; border-bottom: 2px solid black">
          <div><img id="status-logo" src=${logo} alt="Logo"></img></div>
          <div style="text-align:center">
            <h1 style="font-size: 25px; letter-spacing: 1; margin-top: -5px">NATIONAL INSTITUTE OF TECHNOLOGY SRINAGAR</h1>
            <p style="font-size: 18px;">Hazratbal, Srinagar, Kashmir, 190006, J&K, India </p>
          </div>
          <br style="color: black; font-size:5px;" />
        </div>
        <div style="text-align: center; margin-bottom: 10px;"><h1 style="font-size: 22px;">Scholarship Status</h1></div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: -40px;"> 
          <p style="font-size: 18px;"><span id="status-span">Session:</span>Spring 2024</p>
          <p style="font-size: 18px;"><span id="status-span">Month/Year:</span>May/2024</p>
        </div>
          <table border="1" cellspacing="0" cellpadding="5" id="status-table">
          <thead id="status-thead">
            <tr id="status-tr">
              <th id="status-td">Reg No-Name</th>
              <th id="status-td">Branch</th>
              <th id="status-td">Semester</th>
              <th id="status-td">Bank A/C</th>
              <th id="status-td">Full</th>
              <th id="status-td">Total Days</th>
              <th id="status-td">Entitlement</th>
              <th id="status-td">Actual Scholarship</th>
              <th id="status-td">HRA @18% of Scholarship</th>
              <th id="status-td">Net Amount</th>
              <th id="status-td">Supervisor</th>
              <th id="status-td">Action</th>
            </tr>
        </thead>
        <tbody>
      `;

      scholarshipDetail.map((student, index) => {
        pdfContent += `
          <tr id="status-tr">
            <td id="status-td">${student.enrollment}-${student.name}</td>
            <td id="status-td">${student.branch}</td>
            <td id="status-td">IV</td>
            <td id="status-td">${student.accountNo}</td>
            <td id="status-td">${student.checked}</td>
            <td id="status-td">${student.totalDays}</td>
            <td id="status-td">${student.entitlement}</td>
            <td id="status-td">${student.actualScholarship}</td>
            <td id="status-td">${student.hra}</td>
            <td id="status-td">${student.netAmount}</td>
            <td id="status-td">${student.supervisor}</td>
            <td id="status-td">${student.verification_supervisor? "Approved": "Processed"}</td>
          </tr>
        `;
      });
      

      pdfContent += `
            </tbody>
          </table>
        </div>
      `;

      // Convert the HTML content to canvas
      const container = document.createElement('div');
      container.innerHTML = pdfContent;
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Adjust width and height as per the content and canvas dimensions
      const imgWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Open the PDF in a new window
      const pdfBlob = pdf.output('blob');
pdf.save('scholarship_status.pdf');


    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDownloadExcel = () => {
    const headers = [
      'Month',
      'Name',
      'Registration Number',
      'Branch',
      'Semester',
      'Bank Account',
      'Total Days',
      'Entitlement',
      'Actual Scholarship',
      'HRA (18% of Scholarship)',
      'Net Amount',
      'Supervisor',
      'Student Verification',
      'Status'
    ];

    const worksheet = XLSX.utils.json_to_sheet([headers, ...scholarshipDetail.map(detail => [
      month[new Date().getMonth()],
      detail.name,
      detail.enrollment,
      detail.branch,
      detail.semester,
      detail.bankAccount,
      detail.totalDays,
      detail.entitlement,
      detail.actualScholarship,
      detail.hra,
      detail.netAmount,
      detail.supervisor,
      detail.verification_hod ? 'Verified' : 'Not Verified',
      detail.verification_hod ? 'Verified' : 'Not Verified'
    ])]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scholarship Details');
    XLSX.writeFile(workbook, 'ScholarshipDetails.xlsx');
  };

  const handleStatusPage = () => {
    navigate('/status');
  };

  const handleBankDetail = () => {
    navigate('/BankAcc');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCheckboxChange = (index) => {
    const currentTotalDays = daysInMonth(new Date().getMonth() + 1, new Date().getFullYear());
    const entitlementValue = parseFloat(scholarshipDetail[index]?.entitlement || 0);

    const actualScholarshipValue = entitlementValue;
    const hraValue = actualScholarshipValue * 0.18;
    const netAmountValue = actualScholarshipValue + hraValue;

    setFormData((prevFormData) => ({
      ...prevFormData,
      checked: !prevFormData.checked,
      totalDays: currentTotalDays,
      actualScholarship: actualScholarshipValue.toFixed(2),
      hra: hraValue.toFixed(2),
      netAmount: netAmountValue.toFixed(2)
    }));
  };

  return (
    <>
      <div className='admin-container'>
        <div className='admin-top'>Scholarship Entry Page</div>
        <div className="admin-container-content">
          <div className="admin-container-content-1">
            <div className="admin-sidebar">
              <div className="admin-sidebar-content">
                <div className="current-admin line"><FaRegUserCircle className='react-icon' /> #Admin</div>
                <div className="line"><PiStudent /> Student Details</div>
                <div className="line" onClick={handleStatusPage}><SiStatuspage /> Status</div>
                <div className="line" onClick={handleBankDetail}><CiBank /> Bank's Details</div>
              </div>
            </div>
          </div>
          <div className="admin-container-content-2">
            <div className="admin-content">
              <div className='admin-content-1'>
                <label htmlFor="session"><span>*</span>Session</label>
                <select className='session-Drop-box drop-box'>
                  <option value="session">SPRING 2024</option>
                  <option value="session">AUTUMN 2024</option>
                </select>
                <label htmlFor="year"><span>*</span>Year</label>
                <select className='year-Drop-box drop-box'>
                  <option value="student">2024</option>
                  <option value="admin">2023</option>
                </select>
                <label htmlFor="month"><span>*</span>Month</label>
                <select className='month-Drop-box drop-box'>
                  <option value="student">April</option>
                  <option value="admin">March</option>
                </select>
              </div>
            </div>
            <div className="admin-buttons">
              <button className='btn' onClick={() => setShowTable(true)}>Show</button>
              <button className='btn' onClick={handleDownloadExcel}>Excel Report</button>
              <button className='btn' onClick={handleDownloadPDF}>Pdf Report</button>
            </div>
          </div>
        </div>
      </div>
      {showTable && (
        <form onSubmit={handleSubmit}>
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
                  <th>Supervisor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scholarshipDetail.map((student, index) => (
                  <tr key={index}>
                    <td>{student.enrollment}-{student.name}</td>
                    <td>{student.branch}</td>
                    <td>IV</td>
                    <td>{student.accountNo}</td>
                    <td><input 
                      type="checkbox"
                      checked={index === editIndex? formData.checked: student.checked}
                      onChange={() => handleCheckboxChange(index)}
                    /></td>
                    <td><input
                      type="number"
                      name='totalDays'
                      id='totalDays'
                      required
                      disabled={index !== editIndex}
                      value={index === editIndex ? formData.totalDays : scholarshipDetail[index]?.totalDays}
                      onChange={handleInputChange}
                    /></td>
                    <td><input
                      type="number"
                      name='entitlement'
                      id='entitlement'
                      required
                      disabled={index !== editIndex}
                      value={index === editIndex ? formData.entitlement : scholarshipDetail[index]?.entitlement}
                      onChange={handleInputChange}
                    /></td>
                    <td><input
                      type="number"
                      name='actualScholarship'
                      id='actualScholarship'
                      required
                      disabled={index !== editIndex}
                      value={index === editIndex ? formData.actualScholarship : scholarshipDetail[index]?.actualScholarship}
                      onChange={(e) => {
                        const value = e.target.value;
                        const hra = parseFloat(value) * 0.18; // Calculate HRA
                        const netAmount = parseFloat(value) + hra; // Calculate netAmount
                        setFormData({ ...formData, actualScholarship: value, hra: hra.toFixed(2), netAmount: netAmount.toFixed(2) });
                      }}
                    /></td>
                    <td><input
                      type="number"
                      name='hra'
                      id='hra'
                      required
                      disabled={index !== editIndex}
                      value={index === editIndex ? formData.hra : scholarshipDetail[index]?.hra}
                      onChange={handleInputChange}
                    /></td>
                    <td><input
                      type="number"
                      name='netAmount'
                      id='netAmount'
                      required
                      disabled={index !== editIndex}
                      value={index === editIndex ? formData.netAmount : scholarshipDetail[index]?.netAmount}
                      onChange={handleInputChange}
                    /></td>
                    <td>{student.supervisor}</td>
                    <td>
                      <div className='btn-action'>
                        {index === editIndex ? (
                          <button className='btn' type='submit'>Update</button>
                        ) : (
                          <button className='btn' onClick={(e) => {
                            e.preventDefault();
                            handleEdit(index);
                          }}
                        >Edit</button>
                        )}
                        {scholarshipDetail[index].verification_supervisor ? (
                          scholarshipDetail[index].verification_student ? (
                            scholarshipDetail[index].validation_supervisor ? (
                              <button className='btn btn-locked' disabled>Locked</button>
                            ) : (
                              <button className='btn' onClick={(e) => {
                                e.preventDefault();
                                handleValidationToggle(index);
                              }} disabled={scholarshipDetail[index].validation_supervisor}
                                style={{ backgroundColor: scholarshipDetail[index].validation_supervisor ? 'transparent' : 'initial', color: '#4285f4' }}
                              >Lock</button>
                            )
                          ) : (
                            <button className='btn btn-processed' disabled>Processed</button>
                          )
                        ) : (
                          <button className='btn' onClick={(e) => {
                            e.preventDefault();
                            handleVerificationToggle(index);}} disabled={scholarshipDetail[index].verification_supervisor}>Process</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      )}
    </>
  )
}

export default AllAdmin;
