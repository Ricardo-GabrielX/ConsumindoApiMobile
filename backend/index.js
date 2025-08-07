const express = require('express');
const app = express();
const port = 3000;

// rota:

// raiz:
app.get('/', (req, res) =>{
    res.json('Hello word!');
});


app.listen(port, () => {
    console.log(`example app listening: http://localhost:${port}`)
}); 
