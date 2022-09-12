'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const os = require("os");
const uuid = require('uuid');
const got = require('got');





// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const hostName = os.hostname();
const api = "/api/v1";
const resource = "coordenadas";

const urlGetCoordenada = "https://vrpntrp2rxxrnxukxoa6hcgaua0jaicy.lambda-url.us-east-1.on.aws/";
const urlAddCoordenada = "https://p4zftdbnm5d3aeudjewfqqbmle0diljo.lambda-url.us-east-1.on.aws/";

//metodos
const getCoordenadas = function (req, res) {

    //ini
    got.get(urlGetCoordenada, { responseType: 'json' })
        .then(result => {
            const headerDate = result.headers && result.headers.date ? result.headers.date : 'no response date';
            console.log('Status Code from Lambda:', result.statusCode);
            console.log('Date in Response header from Lambda:', headerDate);

        
            res.setHeader('content-type', 'application/json');
            res.send({
                estado: 200,
                mensaje: "success",
                data: result.body
            });

        })
        .catch(err => {
            console.log('Error: ', err.message);
            res.setHeader('content-type', 'application/json');
            res.send({
                estado: 401,
                mensaje: err.message,
                data: null
            });
        });
    //fin
}

const addCoordenada = function (req, res) {



    var params = req.body;
    params.vehiculo =  uuid.v1();



    got.post(urlAddCoordenada, { json:params,   responseType: 'json' })
    .then(result => {
        const headerDate = result.headers && result.headers.date ? result.headers.date : 'no response date';
        console.log('Status Code from Lambda:', result.statusCode);
        console.log('Date in Response header from Lambda:', headerDate);

    
        res.setHeader('content-type', 'application/json');
        res.send({
            estado: 200,
            mensaje: "success",
            data: { request:params, body:result.body}
        });

    })
    .catch(err => {
        console.log('Error: ', err.message);
        res.setHeader('content-type', 'application/json');
        res.send({
            estado: 401,
            mensaje: err.message,
            data: { request:params}
        });
    });

  
}


const status = (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.send({ "server_status": "OK", "serverName": hostName, "status_code": 200 });
};


// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', status);
app.get('/status', status);


app.get(api + '/' + resource, getCoordenadas);
app.post(api + '/' + resource, addCoordenada);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}/${api}`);
