const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hashedPassword => {
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });
    user.save()
    .then((result) => {
      res.status(201).json({message: 'User creation successful'});
    })
    .catch(error => {
      console.log(error.name);
      if (error.name === 'ValidationError') {
         return res.status(404).json({
          message: 'This email address is already taken!'
        });
      } else {
        return res.status(404).json({
          message: 'Some server error occured',
          error: error
        });
      }

    });
  })
  .catch(error => {
    res.status(404).json({
      message: 'Some error occured',
      error: error
    });
  });
};

exports.loginUser =  (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return res.status(401).json({message: 'Auth Failed, Invalid Credentials'});
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({message: 'Auth Failed, Invalid Credentials'});
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id,},
      'Super_Secret_Key',
      {expiresIn: '1h'}
    );
    res.status(200).json({
      message: 'Authentication Successful',
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(401).json({message: 'Auth Failed, Invalid Credentials'});
  });
};
