let users = require('../mocks/users');
const bodyParser = require('../helpers/bodyParser');

module.exports = {

  //Método que irá retornar uma lista de usuários
  listUsers(request, response) {
    const { order } = request.query;

    //Método que ordena os usuários de acordo com o indice
    const sortedUsers = users.sort((a,b) => {
      if(order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    })
    
    //Lista os usuários
    response.send(200, sortedUsers);
  },

  //Método que irá retornar um usuário baseado em um id inserido
  getUserById(request, response) {
    //Desestrutura o id dos parametros
    const { id } = request.params;
    //User recebe o resultado da pesquisa de usuários por id em users
    const user = users.find((usr) => (usr.id === Number(id)));

    //Se user existir então exibe o usuário
    if(user) {
      return response.send(200, user);
    }

    response.send(400, { error: 'User not found'});
  },

  //Método que irá criar um usuário em requisições POST
  createUser(request, response) {
    //O body com a informação do usuário a ser criado é extraido do body da requisição fornecido pelo bodyParser
    const { body } = request;

    //Um novo usuário é criado
    const newUser = {
      id: users.length + 1,
      name: body.name,
    }

    //O novo usuário criado é então inserido no array de usuários
    users.push(newUser);
    response.send(200, newUser);
  },

  //Método que lida com a atualização de usuários
  updateUser(request, response) {
    //Id e name recuperados dos parametros e do body respectivamente
    let { id } = request.params;
    const { name } = request.body;

    //Id precisa ser convertido para number visto que ele é fornecido em formato de string
    id = Number(id);

    //User recebe a pesquisa dentro da lista de usuários se existe o usuário com o id fornecido
    const user = users.find(user => (user.id === id))

    if(!user) {
      return request.send(400, {error: 'User not found'})
    }

    //Se o usuário existir então o array de usuários recebe o novo valor fornecidos
    users = users.map((user) => {
      if(user.id === id) {
        return {
          ...user,
          name,
        }
      }
      return user;
    })

    response.send(200, { id, name });
  },

  //Método que lida com a exclusão de usuários por id
  deleteUser(request, response) {
    //Id e name recuperados dos parametros e do body respectivamente
    let { id } = request.params;
    //Id precisa ser convertido para number visto que ele é fornecido em formato de string
    id = Number(id);

    //É feita a filtragem de usuários que possuem o id diferente do fornecido pelo parametro da url
    users = users.filter((user) => (user.id !== id));

    response.send(200, { deleted: true });
  }
}