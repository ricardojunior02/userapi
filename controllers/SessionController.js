const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { compare } = require('bcryptjs');


class SessionController {
  async index(req, res){}

  async create(req, res){
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if(!user){
      return res.status(400).json({ message: 'E-mail ou senha iválidos, tente novamente'})
    }

    const comparePassword = await compare(password, user.password);

    if(!comparePassword){
      return res.status(400).json({ message: 'E-mail ou senha iválidos, tente novamente'})
    }

    const token = jwt.sign({ email: user.email, role: user.role}, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    delete user.password;

    return res.status(200).json({
      user,
      token: token,
    })
  }
}

module.exports = new SessionController();