const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authToken = req.headers.authorization;

  if(!authToken){
    return res.status(400).json({ message: 'Token inválido'});
  }

  const [, token] = authToken.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if(decoded.role == 1){
      return next();
    }else{
      return res.status(400).json({ message: 'Você não tem acesso a essa página'})
    }
    
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}