"use strict";

const mysql = require('mysql');

const cn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'NODEMYSQL',
});


const connectToDatabase = () => {
    cn.connect(function(err) {
        if(err) {
            console.log('Erro ao conectar com o bando de dados:' + err)
        } else {
            console.log('Conectado com sucesso ao banco de dados')
            return cn;
        }
    })
}

connectToDatabase();

