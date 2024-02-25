import nodemailer from 'nodemailer';
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    const info = await transporter.sendMail({
        from: '"Thắng Học Làm Web 👻" <hoangvanthang6701@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh:", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Thắng Học Làm Web!</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div>
        <b>Thời gian:${dataSend.time}</b>
    </div>
    <div>
        <b>Bác sĩ:${dataSend.doctorName}</b>
    </div>
    <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác nhận và 
    hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Xin chân thành cảm ơn!!</div>
    `
    }
    if (dataSend.language === 'en') {
        result =
            `
    <h3>Dear ${dataSend.patientName}</h3>
    <p>You received this email because you scheduled an online medical examination on Thang Hoc Lam Web!</p>
    <p>Information for scheduling medical examination:</p>
    <div>
        <b>Time:${dataSend.time}</b>
    </div>
    <div>
        <b>Doctor:${dataSend.doctorName}</b>
    </div>
    <p>If the above information is correct, please click on the link below to confirm and
    Complete the medical examination scheduling procedure.</p>
    <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Sincerely thank!!</div>
    `
    }
    return result;
}
let getBodyEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Thắng Học Làm Web!</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
    <div>Xin chân thành cảm ơn!!</div>
    `
    }
    if (dataSend.language === 'en') {
        result =
            `
    <h3>Dear ${dataSend.patientName}</h3>
    <p>You received this email because you scheduled an online medical examination on Thang Hoc Lam Web!</p>
    <p>Medicine/invoice information is sent in the attached file.</p>
    <div>Sincerely thank!!</div>
    `
    }
    return result;
}
let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    const info = await transporter.sendMail({
        from: '"Thắng Học Làm Web 👻" <hoangvanthang6701@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kêt quả đặt lịch khám bệnh:", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyEmailRemedy(dataSend), // html body
        attachments: [
            {   // encoded string as an attachment
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ],
    });
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}