const UserControler = require('./controllers/UserController');

module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    //handler é um método genérico que irá executar uma ação para cada rota registrada
    handler: UserControler.listUsers,
  },
  {
    endpoint: '/users/:id',
    method: 'GET',
    handler: UserControler.getUserById,
  },
  {
    endpoint: '/users',
    method: 'POST',
    handler: UserControler.createUser,
  },
  {
    endpoint: '/users/:id',
    method: 'PUT',
    handler: UserControler.updateUser,
  },
  {
    endpoint: '/users/:id',
    method: 'DELETE',
    handler: UserControler.deleteUser,
  }
]