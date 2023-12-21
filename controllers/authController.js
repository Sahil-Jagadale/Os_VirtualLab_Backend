import admin from "../model/admin.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { sendEmail } from "../controllers/emailService.js";//me

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    //check user
    const exisitingUser = await admin.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //me
    const verificationToken = JWT.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set an expiration time for the token
    });

    // Send a verification email
    const verificationLink = `${process.env.APP_URL}/verify/${verificationToken}`;
    const mailOptions = {
      to: email,
      subject: "Your Email is registered successfully Please Verify Your Email",
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    };
    await sendEmail(mailOptions);  // me

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new admin({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      isVerfied: false, //set intial status to false
      isApproved: false,
      verificationToken, //store varification token in user record
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully. Please check your email for verification",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//approve user controller
export const approveUserController = async (req, res) => {
  console.log('approve user called');
  try {
    const { token } = req.params;
    console.log('received tokem: ',token);

    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Approval token is required.",
      });
    }

    // Verify the approval token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token: ',decoded);
    // Find the user by email in the database
    const user = await admin.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Invalid approval token.",
      });
    }

    // Check if the user is already approved
    if (user.isApproved) {
      return res.status(200).send({
        success: false,
        message: "User has already been approved.",
      });
    }

    // Update the user's approval status to true
    await admin.findByIdAndUpdate(user._id, { isApproved: true });

    // Define the content of the approval email
    const approvalEmailContent = `
      Dear ${user.name},

      We are pleased to inform you that your login request has been approved by the super admin. You can now access your account and start using our services.

      Here are the details of your account:
      - Name: ${user.name}
      - Email: ${user.email}
      - Phone: ${user.phone}
      - Address: ${user.address}

      Thank you for choosing our service. If you have any questions or need assistance, please feel free to contact our support team.
      Do not reply to this email; it is not monitored.
      Best regards,
      [OSL-WEB Team]
    `;

    // Send an email to notify the user they are approved
    const approvalMailOptions = {
      to: user.email,
      subject: "User Approved",
      text: "Your request for approval has been approved. You can now log in.",
      html: approvalEmailContent,
    };
    await sendEmail(approvalMailOptions);

    res.status(200).send({
      success: true,
      message: "User approved successfully. An email notification has been sent.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error approving user",
      error,
    });
  }
};


//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await admin.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd!! Please sign up",
      });
    }

    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(200).send({
        success: false,
        message: "Email is not verified. Please check your email for verification instructions.",
      });
    }
    
    if (!user.isApproved) {
      const approvalToken = JWT.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const approvalLink = `${process.env.APP_URL}/approve/${approvalToken}`;

      const requestEmail = process.env.SUPER_ADMIN_EMAIL;
      const requestMessage = `User with the following details has requested approval to log in:\n
        - Name: ${user.name}\n
        - Email: ${user.email}\n
        - Phone: ${user.phone}\n
        - Address: ${user.address}\n\n
        Please review the user's request and take appropriate action to approve or deny their request by clicking the following link:
    
        [Approval Link](${approvalLink})\n\n
        Thank you for managing user approvals.`;
    
      const mailOptions = {
        to: requestEmail,
        subject: "Login Request Approval",
        text: requestMessage,
      };
      await sendEmail(mailOptions);
    
      return res.status(200).send({
        success: false,
        message: "User is not approved. Please wait for approval from the super admin.",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password please enter correct password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgot Password Controller

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    //check
    const user = await admin.findOne({ email });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email",
      });
    }

    //me
    const resetPasswordToken = JWT.sign({email}, process.env.JWT_SECRET,{
    expiresIn: "1h",
    });

    const resetPasswordLink = `${process.env.APP_URL}/reset-password/${resetPasswordToken}`;

    const mailOptions = {
    to:email,
    subject: "Password reset Link",
    html: `click <a href= ${resetPasswordLink} >here</a> to reset your password`,
    };

    await sendEmail(mailOptions);

    res.status(200).send({
      success: true,
      message: "Password reset link has been sent to your email address.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};


//reset password controller
export const resetPasswordController = async (req, res) =>{
  console.log("resetPasswordController called");
  try{
    const {email, newPassword} = req.body;

    if(!email || !newPassword){
      return res.status(400).send({ message: "Email and New password is required"})
    }

    const user = await admin.findOne({ email });
    if(!user){
      return res.status(400).send({
        success: false,
        message: "User not found."
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    console.log(hashedPassword);

    await admin.findByIdAndUpdate(user._id, {password: hashedPassword});

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });

  }

  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in resetting password",
      error,
    });
  }
  
};

// Verification Controller
export const verificationController = async (req, res) => {
  console.log('Verification route called');
  try {
    const { token } = req.params;
    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    console.log('Decoded Token Payload:', decoded);//1

    // Find the user by email in the database
    const user = await admin.findOne({ email: decoded.email });

    console.log('User Found:', user);//2

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Invalid verification token.",
      });
    }
    // Update the user's verification status to true
    await admin.findByIdAndUpdate(user._id, { isVerified: true });
    
    res.status(200).send({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error verifying email",
      error,
    });
  }
};