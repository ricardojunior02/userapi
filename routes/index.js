const { Router } = require('express');
const userController = require('../controllers/UserController');
const sessionController = require('../controllers/SessionController');
const passwordResetController = require('../controllers/PasswordResetController');
const authenticate = require('../middleware/authenticate');

const routes = Router();

routes.post('/session', sessionController.create);

routes.post('/user', authenticate, userController.create);
routes.get('/users', authenticate, userController.index);
routes.get('/user/:id',authenticate, userController.show);
routes.put('/user/:id',authenticate, userController.update);
routes.delete('/user/:id',authenticate, userController.destroy);

routes.post('/reset_password', passwordResetController.create);
routes.put('/reset_password', passwordResetController.update);




module.exports = routes;