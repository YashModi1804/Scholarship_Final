import React, {useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import month from 'months';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { toast } from 'react-toastify';
import logo from '../image/logo.png';

let check_bulk=false;

const Admin = () => {
    const [details, setDetails] = useState([]); // Initialize details as an empty array
    const [loading, setLoading] = useState(true);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const response = await axios.get('/getScholarshipDetail');
                setDetails(response.data); // Set all student details without filtering
                setLoading(false);
                console.log('Fetched scholarship details:', response.data);
            } catch (error) {
                console.error('Error fetching scholarship details:', error);
                setLoading(false);
            }
        };

        fetchScholarshipDetails();
    }, []);

    const handleDownloadPDF = async () => {
        if (details.length === 0) return;
    
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
    
          details.map((student, index) => {
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
                <td id="status-td" style="color: ${student.verification_supervisor ? 'green' : 'red'};">${student.verification_supervisor? "Approved": "Pending"}</td>
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

        const worksheet = XLSX.utils.json_to_sheet([headers, ...details.map(detail => [
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
            detail.verification_sectionHead ? 'Verified' : 'Not Verified',
            detail.verification_sectionHead ? 'Verified' : 'Not Verified'
        ])]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Scholarship Details');
        XLSX.writeFile(workbook, 'ScholarshipDetails.xlsx');
    };

    const handleVerificationToggle = async (id) => {
        try {
            const userId = localStorage.getItem("userId");
            await axios.put(`/api/admin3/verify/${id}/${userId}`);
            setDetails(prevDetails => 
                prevDetails.map(detail =>
                    detail._id === id ? { ...detail, verification_sectionHead: true } : detail
                )
            );
            console.log('Toggling verification for student ID:', id);
            if(!check_bulk)
            toast.success("Verification Successful");
        } catch (error) {
            console.error('Error updating verification status:', error);
            toast.error("Internal Error");
        }
    };
    const handleVerifyAll = async () => {
        for (const student of details) {
            check_bulk=true;
            if (!student.verification_sectionHead) {
                await handleVerificationToggle(student._id);
            }
        }
        toast.success("All students verified successfully"); // Show single toast notification
    };
    if (loading) {
        return <p>Loading scholarship details...</p>;
    }

    return (
        <>
            <div className='admin-top'>Scholarship Entry Page</div>
            <div>
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
                        <div className='admin-content-2'>
                            <label htmlFor="degree"><span>*</span>Degree</label>
                            <select className='degree-Drop-box drop-box'>
                                <option value="student">PhD</option>
                            </select>
                            <label htmlFor="branch"><span>*</span>Branch</label>
                            <select className='branch-Drop-box drop-box'>
                                <option value="student">Computer Science Engineering</option>            
                                <option value="student">Information Technology Engineering</option>            
                                <option value="student">Electronics & Communication Engineering</option>            
                                <option value="student">Electrical Engineering</option>            
                                <option value="student">Mechancial Engineering</option>            
                                <option value="student">Civil Engineering</option>               
                            </select>
                        </div>
                    </div>
                    <div className="admin-buttons">
                        <button className='btn' onClick={() => setShowTable(true)}>Show</button>
                        <button className='btn' onClick={handleDownloadExcel}>Excel Report</button>
                        <button className='btn' onClick={handleDownloadPDF}>Pdf Report</button>
                        <button className='btn' onClick={handleVerifyAll}>Verify All</button>
                    </div>
                </div>
            </div>
            <div className="scholarship-details" id="pdf-table">
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Name</th>
                            <th>Reg No-Name</th>
                            <th>Branch</th>
                            <th>Semester</th>
                            <th>Bank A/C</th>
                            <th>Total Days</th>
                            <th>Entitlement</th>
                            <th>Actual Scholarship</th>
                            <th>HRA @18% of Scholarship</th>
                            <th>Net Amount</th>
                            <th>Supervisor</th>
                            <th>Student Verification</th>
                            {/* <th>Check</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail) => (
                            <tr key={detail._id}>
                                <td>{month[new Date().getMonth()]}</td>
                                <td>{detail.name}</td>
                                <td>{detail.enrollment}</td>
                                <td>{detail.branch}</td>
                                <td>{detail.semester}</td>
                                <td>{detail.bankAccount}</td>
                                <td>{detail.totalDays}</td>
                                <td>{detail.entitlement}</td>
                                <td>{detail.actualScholarship}</td>
                                <td>{detail.hra}</td>
                                <td>{detail.netAmount}</td>
                                <td>{detail.supervisor}</td>
                                <td>
                                    {/* {detail.verification_dean && (
                                        <button onClick={() => handleVerificationToggle(detail._id)} disabled={detail.verification_sectionHead}>
                                            Verify
                                        </button>
                                    )} */}
                                    {
                                    detail.verification_dean? (
                                        detail.verification_sectionHead?
                                        (<button className='btn' style={{backgroundColor:'transparent', color: 'green', cursor:'not-allowed', fontWeight:'500' }}>
                                            Verified
                                        </button>):
                                        (<button onClick={() => handleVerificationToggle(detail._id)} disabled={detail.verification_sectionHead} className='btn'>
                                        Verify
                                        </button>)
                                    ):""}
                                </td>
                                {/* <td>{detail.verification_sectionHead ? 'Verified' : 'Not Verified'}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Admin;
