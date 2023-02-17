const http = require('http'); //Import do módulo http do Node
const routes = require('./routes'); //Import do módulo de rotas
const { URL } = require('url'); //Import do módulo de url para separação do pathname da query
const bodyParser = require('./helpers/bodyParser'); //Import do módulo auxiliar para criação de body

//Função para a criação do server
const server = http.createServer((request, response) => {
  //parsedUrl armazena todas as informações da url
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);
  //variável que ira armazenar a endpoint da url
  let { pathname } = parsedUrl;
  //variável que armazena o id de um parametro na url
  let id = null;

  //esse código separa o pathname por barras, algo como /users/3 que se torna [ 'users', '3']
  //o filter é para remover um dos indices do split que seria uma string vazia
  const splitEndPoint = pathname.split("/").filter(Boolean);

  //se o endpoint tiver mais de um indice, ou seja, significa que existe um parametro de indice na url
  if( splitEndPoint.length > 1){
    //pathname recebe o primeiro indice ou seja '/users/:id'
    pathname = `/${splitEndPoint[0]}/:id`
    //id recebe o segundo indice que será o parametro da requisição
    id = splitEndPoint[1];
  }

  //Procura na lista de rotas se possui alguma rota em que o endpoint e o método sejam iguais ao da requisição
  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ))

  //Se foi encontrado uma rota correta então executa o handler dela
  if(route) {
    //É injetado na requisição as querys extraídas da url que precisam ser transformadas em um objeto
    request.query = Object.fromEntries(parsedUrl.searchParams);
    //É injetado então como parametro o id inserido
    request.params = { id };

    //Método que automatiza a criação de um head
    response.send = (statusCode, body) => {
      //Define o conteúdo do head com o status code e content type
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      //Retorna como resposta o JSON de usuários
      response.end(JSON.stringify(body));
    }

    //Se o método da requisição for do tipo POST ou PUT então é executado o body parser para extrair o contéudo do body
    if(['POST', 'PUT'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response))
    }
    else {
      route.handler(request, response);
    }
  }
  else {
    //Define o conteúdo do head com o status code e content type
    response.writeHead(404, { 'Content-Type': 'text/html' });
    //Retorna como resposta um texto de erro
    response.end(`Cannot ${request.method} ${pathname}`);
  }
})

//Função que executa o server em uma porta da máquina
server.listen(3000, () => {console.log('🔥 Server started at http://localhost:3000')});