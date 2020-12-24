const { hash } = require('bcryptjs');
const knex = require('../database');
const Yup = require('yup');
const AppError = require('../utils/AppError');
const PasswordToken = require('../models/PasswordToken');


class User {
  async findAll(){
    try{
      const users = await knex.select(['id','name','email','role']).table('users');
      return users;
    }catch(error){
      throw new AppError(error.message, 400);
    }
  }

  async findById(id){
    try{
      const users = await knex.select(['id','name','email','role']).where({id: id}).table('users');
      if(users.length > 0){
        return users[0];
      }else{
        return false;
      }
    }catch(error){
      throw new AppError(error.message, 400);
    }
  }

  async findByEmail(email){
    try{
      const users = await knex.select(['id','name','password','email','role']).where({email: email}).table('users');
      if(users.length > 0){
        return users[0];
      }else{
        return false;
      }
      
    }catch(error){
      throw new AppError(error.message, 400);
    }
  }

  async createUser(user){
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      role: Yup.number(),
    });

    if(!(await schema.isValid(user))){
      throw new AppError('Verifique os campos de cadastro', 400)
    }

    const hashPassword = await hash(user.password, 8);

    try {
      await knex.insert({
        name: user.name,
        email: user.email,
        password: hashPassword,
        role: user.role
      }).table('users');
      return;
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async findMail(email){

    try {
    
      const user = await knex.select('*').from('users').where({email: email});

      if(user.length > 0){
        return true;
      }else{
        return false;
      }

    } catch (error) {
      throw new AppError(error.message, 400);
    }

  }

  async updateUser(user, id){
    const userData = await this.findById(id);
    if(userData){
      const newData = {};
      if(user.email != undefined && user.email === userData.email){
        const email = await this.findMail(userData.email);
        if(!email){
          newData.email = user.email;
        }else{
          throw new AppError('E-mail já está em uso', 400);
        }
      }

      if(user.name != undefined) newData.name = user.name;
      if(user.role != undefined) newData.role = user.role;

      try {
       return await knex.update(newData).where({ id: id }).table('users');
      } catch (error) {
        throw new AppError('Erro ao atualizar informações, tente novamente', 400)
      }  
    }else{
      throw new AppError('Usuário não existe', 400);
    }
  }

  async delete(id){
    const user = await this.findById(id);
    if(user){
      try {
        return await knex.delete().where({id: id}).table('users');
      } catch (error) {
        throw new AppError(error.message, 400)
      }
    }else{
      throw new AppError('Usuário não existe', 400);
    }
  }

  async changePassword(data, id){
    const hashedPassword = await hash(data.password, 8);

    try {
      await knex.update({ 
      password: hashedPassword
    }).where({ id: id }).table('users');
    await PasswordToken.setUsed(data.token);

    } catch (error) {
      throw new AppError(error.message, 400)
    }
  }
}

module.exports = new User();