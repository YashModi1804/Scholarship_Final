import React from 'react';
import { useState } from 'react';
import './Student.css'
import Scholarship from './scholarship'
import Previous from './Previous_Scholarship'
const StudentPortal = () => {
    const [activeTab, setActiveTab] = useState('Profile');
    // const navigate = useNavigate();

    if(setActiveTab){
        
    }
    // const handleTabChange = (tabName) => {
    //     setActiveTab(tabName);
    // };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile':
                return <div className='Student-Profile'><Scholarship/></div>;
            case 'ScholarshipStatus':
                return <div className='Student-Status'><Scholarship/></div>;
            case 'PreviousScholarships':
                return <div className='Student-Previous'><Previous/></div>;
            default:
                return null;
        }
    };
    // const handleStatusPage = () => {
    //     // navigate('/status');
    //   };
    
    return (
        <>
        <div className='admin-top'>National Institute of Technology Srinagar</div>
        <div className="admin-container-content" id="student-page">
            <div className="admin-container-content-1">
                {/* <div className="admin-sidebar">
                    <div className="admin-sidebar-content">
                    <div className="current-admin line"><FaRegUserCircle className='react-icon' /> #Student</div>
                        <div className="line" onClick={() => handleTabChange('ScholarshipStatus')}>
                        <TbCurrentLocation />Scholarship Status
                        </div>
                        <div className="line" onClick={() => handleTabChange('PreviousScholarships')}>
                        <MdPreview />Previous Scholarships
                        </div>
                        <div className="line" onClick={handleStatusPage}><SiStatuspage /> Status</div>

                    </div>
                </div> */}
            </div>
            <div className="main-content">
                {renderTabContent()}
            </div>
        </div>
        </>
    );
};

export default StudentPortal;
