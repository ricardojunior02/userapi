const User = require('./User');
const knex = require('../database');
const { v4 } = require('uuid');
const AppError = require('../utils/AppError');

class PasswordToken {
  async create(email){
    const user = await User.findByEmail(email);

    if(user){
      const token = v4();

      try {
        await knex.insert({
          user_id: user.id,
          token,
          used: 0,
        }).table('password_token');

        return token;
      } catch (error) {
        throw new AppError(error.message, 400)
      }
    }else{
      throw new AppError('Usuário não existe', 400);
    }
  }

  async validate(token){
    try {
      const result = await knex.select().where({ token: token }).table('password_token');

      if(result.length > 0){

        const tokenUsed = result[0];

        if(tokenUsed.used){
          throw new AppError('Token inválido', 400);
        }else{
          return tokenUsed;
        }
      }else{
        return false;
      }
    } catch (error) {
      throw new AppError('Erro ao buscar validação de token, tente novamente', 400);
    }

  }

  async setUsed(token){
    await knex.update({
      used: 1
    }).where({ token: token }).table('password_token');
  }
}


module.exports = new PasswordToken();