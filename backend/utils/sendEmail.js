const nodemailer = require('nodemailer')

const sendEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Kode OTP kamu',
        text: `Kode OTP kamu adalah: ${otp}`
    })
}

module.exports = sendEmail