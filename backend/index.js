const db = require('./conf/autenticacao.js');
const express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let methodOverride = require('method-override');

const app = express();
const port = 3000;

// Configuração completa do CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://192.168.1.100:8081', 'exp://192.168.1.100:8081'], // URLs do Expo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para aceitar requisições de diferentes origens
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//ROTEAMENTO RAIZ
app.get('/', async (req, res) => {
  const results =  await db.selectFull();
  console.log(results);
  res.json(results);
});


// ROTEAMENTO PARA BUSCAR PELO ID
app.get('/clientes/:id', async (req, res) => {  
  const id = req.params.id;
  const results = await db.selectById(id);
  console.log(results);
  res.json(results);
});


// ROTEAMENTO PARA INSERIR
app.post('/clientes/', async (req, res) => { 
  const Nome = req.body.Nome;
  const Idade = req.body.Idade;
  const UF = req.body.UF;
  //const { Nome, Idade, UF } = req.body;
  const results = await db.insertCliente(Nome, Idade, UF);
  console.log(results);
  res.json(results);  
}); 

// ROTEAMENTO PARA ATUALIZAR
app.put('/clientes/:id', async (req, res) => {    
  const id = req.params.id;
  const Nome = req.body.Nome;
  const Idade = req.body.Idade;
  const UF = req.body.UF;
  //const { Nome, Idade, UF } = req.body;
  const results = await db.updateCliente( Nome, Idade, UF,id);
  console.log(results);
  res.json(results);  
}); 


//DELETAR PELO ID
app.delete('/clientes/:id', async (req, res) => { 
  const id = req.params.id;
  console.log('Recebida requisição para deletar ID:', id);
  
  try {
    const results = await db.deleteById(id);
    console.log('Resultado do delete no DB:', results);
    
    if (results) {
      res.json({ success: true, message: 'Cliente deletado com sucesso' });
    } else {
      res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar cliente' });
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando em http://0.0.0.0:${port}`);
  console.log(`Acessível via: http://localhost:${port}`);
  console.log(`Acessível via seu IP local: http://192.168.1.100:${port}`); 
});
