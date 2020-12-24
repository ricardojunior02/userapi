const User = require('../models/User');

class UserController {
  async show(req, res){
    const { id } = req.params;

    const user = await User.findById(id);

    if(user){
      return res.status(200).json(user)
    }else{
      return res.status(404).json()
    }

  }

  async index(req, res){
    const users = await User.findAll(); 

    return res.status(200).json(users)
  }

  async create(req, res){

    const data = req.body;

    const user = await User.findMail(data.email);

    if(user){
      return res.status(400).json({ message: 'Email já esta em uso'})
    }

    await User.createUser(data);

    return res.status(201).json({message: 'Usuário criado'});
  }

  async update(req, res){
    const { id } = req.params;
    const user = req.body;

    await User.updateUser(user, id);

    return res.status(200).json({ message: 'Usuário atualizado com sucesso'});
  }

  async destroy(req, res){
    const { id } = req.params;

    await User.delete(id);

    return res.status(200).json({ message: 'Usuário deletado com sucesso'})
  }
}

module.exports = new UserController();