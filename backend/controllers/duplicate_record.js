import mongoose from 'mongoose';
import moment from 'moment';
import cron from 'node-cron';
import dotenv from 'dotenv';
import ScholarshipDetail from '../models/scholarshipDetails.js'; // Adjust the path as necessary

dotenv.config();

export const createNewScholarshipBlock = async () => {
    try {
        const students = await ScholarshipDetail.find();

        for (const student of students) {
            const currentMonth = moment().format('MMM').toLowerCase();

            const existingRecord = await ScholarshipDetail.findOne({
                enrollment: student.enrollment,
                month: currentMonth
            });

            

            const springMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul'];
            const session = springMonths.includes(currentMonth) ? "SPRING" : "AUTUMN";

            const newBlock = new ScholarshipDetail({
                name: student.name,
                enrollment: student.enrollment,
                programme: "PHD",
                semester: student.semester,
                branch: student.branch,
                supervisor: student.supervisor,
                bankName: student.bankName,
                accountNo: student.accountNo,
                ifsc: student.ifsc,
                dateOfJoining: student.dateOfJoining,
                checked: student.checked,
                totalDays: 0,
                entitlement: 37000,
                actualScholarship: 0,
                hra: 0,
                netAmount: 0,
                verification_supervisor: false,
                verification_student: false,
                validation_supervisor: false,
                verification_hod: false,
                verification_adean: false,
                verification_dean: false,
                verification_sectionHead: false,
                verification_AssistantRegistrar: false,
                verification_DRAccountant: false,
                month: currentMonth,
                session: session
            });

            await newBlock.save();
        }

        console.log('New scholarship block created for each student');
    } catch (err) {
        console.error('Error creating new scholarship block:', err);
    }
};


export const startCronJob = () => {
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running scheduled task: Create new scholarship block');
        await createNewScholarshipBlock();
    });
};
