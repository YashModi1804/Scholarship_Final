import express from 'express';
import ScholarshipDetail from '../models/scholarshipDetails.js';
import Admin from '../models/admin.js'; // Assuming you have an Admin model

const router = express.Router();

// PUT endpoint to update student verification status
router.put('/verify/:studentId/:adminId', async (req, res) => {
    const { studentId, adminId } = req.params;

    try {
        // Find the admin by ID
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Determine the verification field based on the admin's position
        let verificationField = '';
        switch (admin.position) {
            case 'dean':
                verificationField = 'verification_dean';
                break;
            case 'adean':
                verificationField = 'verification_adean';
                break;
            case 'sectionhead':
                verificationField = 'verification_sectionHead';
                break;
            case 'aregistrar':
                verificationField = 'verification_AssistantRegistrar';
                break;
            case 'draccounts':
                verificationField = 'verification_DRAccountant';
                break;
            default:
                return res.status(400).json({ message: 'Invalid admin position' });
        }

        // Find the scholarship detail by student ID
        const detail = await ScholarshipDetail.findById(studentId);
        if (!detail) {
            return res.status(404).json({ message: 'Scholarship detail not found' });
        }

        // Update the relevant verification field
        detail[verificationField] = true;

        // Save the updated detail
        await detail.save();

        // Respond with success message
        res.json({ message: `${admin.position} verification status updated successfully` });
    } catch (error) {
        console.error('Error updating verification status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
