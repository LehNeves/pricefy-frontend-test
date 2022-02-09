# pricefy-frontend-test

Teste de código para Engenharia de Front-end na Pricefy.

Dê uma olhada em [WHAT.md](WHAT.md) e nos falamos logo menos.

Para rodar este projeto utilizando o docker rode o comando docker-compose -f docker-compose.yml up -d --build.

Para rodar este projeto sem o Docker, terá que ter instalado na sua máquina o node.js e o npm, e também deverá ter o json-server e o angular-cli.
Caso não tenha o json-server instalado, rode o comando "npm install -g json-server" no terminal da sua máquina, entre na pasta dados e rode o comando "json-server -p "PORTA" config/db.json --routes config/routes.json", no lugar de "PORTA", escolha a porta que deseja, o padrão é "3000", não utilize aspas.
Caso não tenha o angular-cli instalado, rode o comando "npm install -g @angular/cli", agora entre na pasta precify-test e rode o comando "npm install", quando terminar rode o commando "ng serve", caso não tenha trocado a porta do json-server, caso tenha trocado acesse o arquivo de src/environments/environment.prod.ts e troque a porta na url.