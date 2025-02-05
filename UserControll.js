import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';


//authenticates a user when they try to log in
const authUser = asyncHandler (async (req, res) =>{
const { email, password } = req.body;

const user = await User.findOne({ email });

if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);//generates a token and stores it in cookies.
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: user.token,
      success:true, 
      message :"Welcome" + " " + user.name});
} else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
}

});

//Register a new user
const registerUser = asyncHandler (async (req, res) =>{
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
    }
    
    //Creates a new user in the database.
    const user = await User.create({ name, email, password });
    
    if (user) {
        generateToken(res, user._id); //If user creation is successful generates a token.
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          success:true, 
          message :"welcome Registration successful." });



//Sending Welcome Email      
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS
      }
    });
    var mailOptions = {
      from : 'repairnow@gmail.com',
      to : user.email ,
      subject : 'Welcome to repairnow!',
      html : `
      <h3>Hello ${user.name}, you have successfully registered to repairnow!</h3>
      `
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

}   else {
    res.status(400);
    throw new Error('Invalid user data');
}

});

//Logout user
const logoutUser = asyncHandler (async (req, res) =>{

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({success: true, message: 'User logged out'});
    });


//Get User Profile
const getUserProfile = asyncHandler (async (req, res) =>{
    
const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
}
    res.status(200).json(user);
    });


//Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
       user.name = req.body.name || user.name;
       user.email = req.body.email || user.email;

       if (req.body.password) {
        user.password = req.body.password;
       }

       const updatedUser = await user.save();

       res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        success: true,
        message: 'Profile updated successfully',
    });
}   else {
    res.status(404).json({ success: false, message: 'User not found' });
}
});

   //Get all users

  const getallUser = asyncHandler(async (req, res) => {
    try {
      const getUsers = await User.find();
      res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
  });

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const getaUser = await User.findById(id);
      res.json({
        getaUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });


  // Enable or disable User Account
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive; // Toggle Active status

    await user.save();

    res.status(200).json({ success: true, message: user.isActive ? 'User enabled' : 'User disabled', data: user });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



    export{
        authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile,
        getallUser,
        getaUser,
        toggleUserStatus
    };