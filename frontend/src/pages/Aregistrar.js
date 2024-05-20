import React, { toast, useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import month from 'months';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'; // Import the xlsx library

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

    const handleDownloadPDF = () => {
        const input = document.getElementById('pdf-table');

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
            detail.verification_AssistantRegistrar? 'Verified' : 'Not Verified',
            detail.verification_AssistantRegistrar? 'Verified' : 'Not Verified'
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
                    detail._id === id ? { ...detail, verification_AssistantRegistrar: true } : detail
                )
            );
            console.log('Toggling verification for student ID:', id);
            toast.success("Verification Successful");
        } catch (error) {
            console.error('Error updating verification status:', error);
            toast.error("Internal Error");
        }
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
                                    {/* {detail.verification_sectionHead && (
                                        <button onClick={() => handleVerificationToggle(detail._id)} disabled={detail.verification_AssistantRegistrar}>
                                            Verify
                                        </button>
                                    )} */}
                                    {
                                    detail.verification_sectionHead? (
                                        detail.verification_AssistantRegistrar?
                                        (<button className='btn' style={{backgroundColor:'transparent', color: '#4285f4', cursor:'not-allowed' }}>
                                            Verified
                                        </button>):
                                        (<button onClick={() => handleVerificationToggle(detail._id)} disabled={detail.verification_AssistantRegistrar} className='btn'>
                                        Verify
                                        </button>)
                                    ):""}
                                </td>
                                {/* <td>{detail.verification_AssistantRegistrar ? 'Verified' : 'Not Verified'}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Admin;
