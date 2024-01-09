import nodemailer from 'nodemailer';

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'workspace.kavita@gmail.com',
    pass: 'gfsf gjjw tjmt momw', 
  },
});

// Function to send an email
export const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${mailOptions.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

