import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc    auth user and get a token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const user = await User.findOne({ email });
  console.log(user);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc   register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const newUser = await User.create({ name, email, password });
    if (newUser) {
      res.status(201);
      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid user data');
    }
  } else {
    res.status(401);
    throw new Error('User already exists');
  }
});

// @desc   gets the user profile based on a valid token
// @route   GET /api/users/profile
// @access  Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

// @desc   gets the user
// @route   GET /api/user/:id
// @access  Private && Admin

export const getUser = asyncHandler(async (req, res) => {
  const users = await User.findById(req.params.id).select('-password');
  if (users) {
    res.json(users);
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});
// @desc   edits the  users
// @route   GET /api/user/:id
// @access  Private && Admin

export const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const newUser = await user.save();

    res.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

// @desc   gets the all users
// @route   GET /api/users/
// @access  Private && Admin

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  if (users) {
    res.json(users);
  } else {
    res.status(401);
    throw new Error('Users not found');
  }
});

// @desc   Deletes a user
// @route   DELETE /api/users/
// @access  Private && Admin

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json('User removed');
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

// @desc   edit the user profile based on a valid token
// @route   PUT /api/users/profile
// @access  Private

export const editUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const newUser = await user.save();

    res.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});
