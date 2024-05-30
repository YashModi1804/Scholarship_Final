import mongoose from "mongoose";
import moment from "moment";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    enrollment: {
        type: String,
        required: true,
  
    },
    programme: {
        type: String,
        default: "",
    },
    semester: {
        type: String,
        default: "",
    },
    branch: {
        type: String,
        default: "",
    },
    supervisor: {
        type: String,
        default: "",
    },
    bankName: {
        type: String,
        default: "",
    },
    accountNo: {
        type: String,
        default: "",
    },
    ifsc: {
        type: String,
        default: "",
    },
    dateOfJoining: {
        type: Date,
        default: "",
    },
    checked: { 
        type: Boolean, 
        default: false
    },
    totalDays: {
        type: Number,
        default: "",
    },
    entitlement: {
        type: Number,
        default: 37000,
    },
    actualScholarship: {
        type: Number,
        default: 0,
    },
    hra: {
        type: Number,
        default: 0,
    },
    netAmount: {
        type: Number,
        default: 0,
    },
    verification_supervisor: {
        type: Boolean,
        default: false
    },
    verification_student: {
        type: Boolean,
        default: false
    },
    validation_supervisor: {
        type: Boolean,
        default: false
    },
    verification_hod: {
        type: Boolean,
        default: false
    },
    verification_adean: {
        type: Boolean,
        default: false
    },
    verification_dean: {
        type: Boolean,
        default: false
    },
    verification_sectionHead: {
        type: Boolean,
        default: false
    },
    verification_AssistantRegistrar: {
        type: Boolean,
        default: false
    },
    verification_DRAccountant: {
        type: Boolean,
        default: false
    },
    month: {
        type: String,
        default: ""
    },
    session: {
        type: String,
        default: ""
    },
});

// Pre-save middleware to set the session based on the month and handle monthly records
UserSchema.pre('save', async function(next) {
    const currentMonth = moment().format('MMM').toLowerCase();
    const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');

    if (moment().format('D') === '1') {
        // Find an existing record for the student for the current month
        const existingRecord = await this.constructor.findOne({
            enrollment: this.enrollment,
            month: currentMonth
        });

        // If a record exists, do not save a duplicate
        if (existingRecord) {
            return next(new Error('Record for this month already exists'));
        }
    }

    // Set the month and session fields
    this.month = currentMonth;

    const springMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul'];
    const autumnMonths = ['aug', 'sep', 'oct', 'nov', 'dec'];

    if (springMonths.includes(currentMonth)) {
        this.session = "SPRING";
    } else if (autumnMonths.includes(currentMonth)) {
        this.session = "AUTUMN";
    }

    // Ensure programme is always "PHD"
    this.programme = "PHD";

    next();
});

const ScholarshipDetail = mongoose.model("ScholarshipDetail", UserSchema);

export default ScholarshipDetail;
