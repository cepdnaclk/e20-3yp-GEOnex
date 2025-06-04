const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter=require('../config/nodemailer');
const { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL } =require('../config/emailTemplate');

// Register a new user
/*const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: 'User registered' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
*/

// Register a new user
const register = async(req,res)=>{
    console.log('Register request received');

    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success: false, message:'Missing Details'})
    }

    // optional strength check
      if (password.length < 6) {
        return res.json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }

    try {
        const existingUser =await User.findOne({email});

        if (existingUser) {
            return res.json({success: false, message:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({name,email,password:hashedPassword,role:"surveyor"});
        await user.save();

        const token= jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure:process.env.NODE_ENV==='production',
            // secure:false,
            sameSite: process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })

        
        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to GEOnex',
            //text:`Welcome to GEOnex. Your account has been created with email id: ${email}`
            html:WELCOME_EMAIL.replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);
        
        return res.json({success:true});

    } catch (error) {
        res.json({success:false, message:error.message})    
    }
}

const login = async(req,res)=>{

    console.log('Login request received');

    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success:false, message:'Email and password are required'})
    }

    try {
        const user = await User.findOne({email});
        
        if (!user) {
            return res.json({success:false, message:'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false, message:'Invalid password'})
        }

        if (!user.isAccountVerified) {
            return res.json({ success: false, message: 'Please verify your account first.' });
        }

        const token= jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            // secure:false,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })

        return res.json({success:true});

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}


const logout= async (req,res)=>{
    console.log('Logout request received');
    try {
        res.clearCookie('token',{
            httpOnly: true,
            // secure:false,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict'
        })
        
        return res.json({success:true, message:'Logged out'});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

//Send verification OTP to the User's Email
const sendVerifyOtp = async(req,res)=>{
    console.log('Send verification OTP request received');
    try {
    
        const userId = req.userId;

        const user = await User.findById(userId);

        if (user.isAccountVerified) {
            return res.json({success:false, message:"Account Already verified"})
        }

        const otp=String(Math.floor(100000+ Math.random()*900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000;

        await user.save();

        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            //text:`Your OTP is ${otp}.`
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        await transporter.sendMail(mailOptions);

        res.json({success:true, message:'Verification OTP sent to the email'}); 

    } catch (error) {
        return res.json({success:false, message:error.message}); 
    }
} 


//verify the email using otp
const verifyEmail = async (req,res) => {
    console.log('Verify email request received');

    const userId=req.userId;
    const {otp}=req.body;

    if(!userId || !otp){
        return res.json({success:false, message:'Missing Details'});
    }

    try {

        const user = await User.findById(userId);

        if(!user){
            return res.json({success:false, message:'User not found'});
        }

        if(user.verifyOtp ==='' || user.verifyOtp!==otp){
            return res.json({success:false, message:'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:'OTP Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();

        return res.json({success:true, message:'Email verified successfully'});

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}


const isAuthenticated=async (req,res) => {
    console.log('Authentication check request received');
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }
        
        if (!user.isAccountVerified) {
            return res.json({
              success: false,
              verified: false, 
              message: "Please verify your account first."
            });
          }
        
        return res.json({success:true, verified: true});

    } catch (error) {
        res.json({success:false, message:error.message});
    }    
}

//Send password reset Otp
const sendResetOtp = async (req,res) => {
    console.log('Send password reset OTP request received');
    const {email}=req.body;
    if(!email){
        return res.json({success:false, message:'Email is required'})
    }   
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'})
        }

        const otp=String(Math.floor(100000+ Math.random()*900000));
        user.resetOtp = otp;
        user.resetOtpExpiredAt=Date.now()+15*60*1000;

        await user.save();

        const mailOptions = { 
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text:`Your OTP for resting your password is ${otp}.
            //Use this OTP to proceed with resetting your password.`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };
        await transporter.sendMail(mailOptions);

        return res.json({success:true, message:'OTP send to your email'});

    } catch (error) {
        return res.json({success:false, message:error.message})
    } 
}

//Reset user password
const resetPassword = async (req,res) => {
    console.log('Reset password request received');
    const {email,otp,newPassword}=req.body;
    
    if(!email || !otp || !newPassword){
        return res.json({success:false, message:'Email,OTP and new password required'});
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'});
        }

        if(user.resetOtp==="" || user.resetOtp !== otp){
            return res.json({success:false, message:'Invalid OTP'});
        }

        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success:false, message:'OTP expired'});
        }

        const hashedPassword=await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp ='';
        user.resetOtpExpiredAt=0;

        await user.save();
        return res.json({success:true, message:'Password has been reset successfully'});

    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}



module.exports = {register,login,logout,sendVerifyOtp,verifyEmail,resetPassword,sendResetOtp,isAuthenticated};
