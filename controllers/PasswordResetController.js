const PasswordToken = require('../models/PasswordToken');
const User = require('../models/User');

class PasswordResetController {
  async create(req, res){
    const { email } = req.body;

    try {
      const token = await PasswordToken.create(email);

      return res.status(200).json({ token: token})
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async update(req, res){
    const data = req.body;

    const tokenIsValid = await PasswordToken.validate(data.token);
    
    if(tokenIsValid){
      await User.changePassword(data, tokenIsValid.user_id);
      return res.status(200).json({ message: 'Senha Atualizada'})
    }else{
      return res.status(400).json({ message: 'Token inválido'});
    }

  }
}


module.exports = new PasswordResetController();