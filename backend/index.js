const db = require('./conf/autenticacao.js');
const express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

const app = express();
const port = 3000;

// LIBERA GERAL: Permite que o celular acesse o backend sem bloquear
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- ROTAS (Mantidas as suas originais) ---

app.get('/', async (req, res) => {
  try {
    const results = await db.selectFull();
    console.log('GET / - Sucesso');
    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  }
});

app.get('/clientes/:id', async (req, res) => {  
  try {
    const id = req.params.id;
    const results = await db.selectById(id);
    res.json(results);
  } catch (e) { res.status(500).json({error: e}) }
});

app.post('/clientes/', async (req, res) => { 
  try {
    const { Nome, Idade, UF } = req.body;
    const results = await db.insertCliente(Nome, Idade, UF);
    res.json(results);  
  } catch (e) { res.status(500).json({error: e}) }
}); 

app.put('/clientes/:id', async (req, res) => {    
  try {
    const id = req.params.id;
    const { Nome, Idade, UF } = req.body;
    const results = await db.updateCliente(Nome, Idade, UF, id);
    res.json(results);  
  } catch (e) { res.status(500).json({error: e}) }
}); 

app.delete('/clientes/:id', async (req, res) => { 
  const id = req.params.id;
  console.log('Tentando deletar ID:', id);
  try {
    const success = await db.deleteById(id);
    if (success) {
      res.json({ success: true, message: 'Deletado com sucesso' });
    } else {
      res.status(404).json({ success: false, message: 'Não encontrado' });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(port, '0.0.0.0', () => {
  // Pega o IP da máquina para você saber qual colocar no app
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let myIp = 'localhost';

  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
              myIp = net.address;
          }
      }
  }
  
  console.log('================================================');
  console.log(`✅ Backend rodando!`);
  console.log(`💻 Local: http://localhost:${port}`);
  console.log(`📱 IP PARA O APP: http://${myIp}:${port}`);
  console.log('================================================');
});