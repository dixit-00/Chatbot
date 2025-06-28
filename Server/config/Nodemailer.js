import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
    pool: true, // Enable connection pooling for better performance
    socketTimeout: 60000, // Increase socket timeout to 60 seconds
    connectionTimeout: 60000, // Increase connection timeout to 60 seconds
});

export default transporter;
