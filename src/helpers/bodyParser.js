function bodyParser(request, callback) {
  //Variável auxiliar que irá ficar recebendo os pacotes do body já que a informação não é enviada por completo
  let body = '';
  //Toda vez que mais um pouco do conteúdo do body for recebido, armazene na variável body
  request.on('data', (chunk) => {
    body += chunk;
  });

  //Quando terminar de receber todos os pacotes
  request.on('end', () => {
    //Body recebe o conteúdo completo transformado em JSON
    body = JSON.parse(body);
    request.body = body;
    //Executa esse callback somente depois que o body for montado completamente
    callback();
  })
}

module.exports = bodyParser;