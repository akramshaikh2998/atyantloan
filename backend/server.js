const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another email service
    auth: {
        user: 'akrams2998@gmail.com',
        pass: '7302135360786',
    },
});

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Handle form submission
app.post('/submit-application', upload.array('documents'), (req, res) => {
    const { fullName, email, phoneNumber, loanAmount } = req.body;
    const documents = req.files;

    // Compose email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'akrams2998', // Your email address
        subject: 'New Loan Application',
        text: `Full Name: ${fullName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nLoan Amount: ${loanAmount}`,
        attachments: documents.map((file) => ({
            filename: file.originalname,
            path: file.path,
        })),
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Application submitted successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
