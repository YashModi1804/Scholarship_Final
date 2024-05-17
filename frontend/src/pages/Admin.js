import React, { useEffect, useState } from 'react';
import axios from "axios";
import jsPDF from 'jspdf';
import month from 'months';
import html2canvas from 'html2canvas';

const Admin = () => {
    const [details, setDetails] = useState([]); // Initialize details as an empty array
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const responseAdmin = await axios.get(`/api/get_supervisor/${userId}`);
                const { name, department } = responseAdmin.data; 
                const response = await axios.get(`/getScholarshipDetail`);
                const updatedDetails = await axios.get('/getScholarshipDetail');
                const filteredStudents = updatedDetails.data.filter(student => (student.branch === department));
                setDetails(filteredStudents);
                setLoading(false);
                console.log('Fetched scholarship details:', filteredStudents);
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

    const handleVerificationToggle = async (id) => {
        try {
            await axios.put(`/api/update_hod_verification/verify/${id}`);
            setDetails(prevDetails => 
                prevDetails.map(detail =>
                    detail._id === id ? { ...detail, verification_hod: true } : detail
                )
            );
            console.log('Toggling verification for student ID:', id);
        } catch (error) {
            console.error('Error updating verification status:', error);
        }
    };
     


    if (loading) {
        return <p>Loading scholarship details...</p>;
    }

    return (
        <>
            <div className="scholarship-details" id="pdf-table">
                <h2>Scholarship Details</h2>
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
                            <th>Check</th>
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
                                    {detail.validation_supervisor && (
                                        <button onClick={() => handleVerificationToggle(detail._id)} disabled={detail.verification_hod}>
                                            Verify
                                        </button>
                                    )}
                                </td>
                                <td>{detail.verification_hod ? 'Verified' : 'Not Verified'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleDownloadPDF}>Download PDF</button>
            </div>
        </>
    );
}

export default Admin;
