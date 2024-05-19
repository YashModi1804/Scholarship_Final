import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Status = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the scholarship details when the component mounts
    const fetchScholarshipDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/api/get_supervisor/${userId}`);
        const { name, department } = response.data;
        const studentsResponse = await axios.get('/getScholarshipDetail');
        const filteredStudents = studentsResponse.data.filter(student => (student.supervisor === name && student.branch === department));
        setStudents(filteredStudents);// Assuming response.data is an array of student details
      } catch (error) {
        console.error('Error fetching scholarship details:', error);
      }
    };

    fetchScholarshipDetails();
  }, []);

  const handleShowButtonClick = async () => {
    if (students.length === 0) return;

    try {
      // Create a PDF with the fetched data
      let pdfContent = `
        <div id="pdf-content">
          <h2>Scholarship Apply Student List</h2>
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Student Name</th>
                <th>Enrollment No.</th>
                <th>Branch Name</th>
                <th>Supervisor</th>
                <th>HOD</th>
                <th>Associate Dean</th>
                <th>Dean</th>
                <th>Section Head</th>
                <th>Assistant Registrar</th>
                <th>DR Accountants</th>
              </tr>
            </thead>
            <tbody>
      `;

      students.forEach((student, index) => {
        pdfContent += `
          <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.enrollment}</td>
            <td>${student.branch}</td>
            <td style="color: ${student.verification_supervisor ? 'black' : 'red'};">${student.verification_supervisor ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_hod ? 'black' : 'red'};">${student.verification_hod ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_adean ? 'black' : 'red'};">${student.verification_adean ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_dean ? 'black' : 'red'};">${student.verification_dean ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_sectionHead ? 'black' : 'red'};">${student.verification_sectionHead ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_AssistantRegistrar ? 'black' : 'red'};">${student.verification_AssistantRegistrar ? 'Approved' : 'Pending'}</td>
            <td style="color: ${student.verification_DRAccountant ? 'black' : 'red'};">${student.verification_DRAccountant ? 'Approved' : 'Pending'}</td>
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
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <div className="admin-container-content-2 status-container">
        <div className="status-text">
          <h1 className='bankAcc-text'>Status</h1> <br />
          <p><span>NOTE: *</span>Once the Supervisor, process and locks the scholarship of students for a month from Scholarship Entry Step,</p>
          <p>it is sent to the student for verification to ensure it is correct.</p>
          <p>Once student verifies it, it will show in this section. Supervisor, then finally approves it and it is sent to the HOD.</p>
        </div>
        <div className="admin-content status-content">
          <div className='status-content-1 admin-content-1'>
            <div className="status-session status-session-content">
              <label htmlFor="session"><span>*</span>Session</label>
              <select className='session-Drop-box drop-box'>
                <option value="SPRING 2024">SPRING 2024</option>
                <option value="AUTUMN 2024">AUTUMN 2024</option>
              </select>
            </div>
            <div className="status-year status-session-content">
              <label htmlFor="year"><span>*</span>Year</label>
              <select className='year-Drop-box drop-box'>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="status-month status-session-content">
              <label htmlFor="month"><span>*</span>Month</label>
              <select className='month-Drop-box drop-box'>
                <option value="May">May</option>
                <option value="April">April</option>
              </select>
            </div>
          </div>
        </div>
        <div className="admin-buttons">
          <button className='btn' onClick={handleShowButtonClick}>Show</button>
          <button className='btn'>Status Report</button>
        </div>
      </div>
    </>
  );
};

export default Status;
