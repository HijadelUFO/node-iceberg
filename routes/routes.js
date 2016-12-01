
var mongoose        = require('mongoose');
var Nodo            = require('../private/models/model.js');
var path = require('path');

var express = require('express');

var router = express.Router();
var Crawler = require('../private/clases/crawler');
/**
 * Funcion que devuelve si un JSON está vacío
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

/**
 * Renderiza la vista principal con cabeceras,footer,etc
 */
router.get('/', function(req, res, next) {
    res.render('layout');
});

/**
 * Renderiza la vista principal con cabeceras,footer,etc
 */
// router.get('/docs', function(req, res, next) {
//     console.log("docs");
//     res.sendFile('Gruntfile.html');
// });

/**
 * Ruta que comienza a procesar una cadena
 */
router.get('/model/:cadena', function(req, res){
    var cadena = req.body.cadena;
    var string = req.params.cadena;
    if(string.indexOf("/") > -1) {
        var url = 'http://'+string;
    }
    else
        var url = 'http://'+string+"/";

    //console.log("buscando: "+url);
    // console.log(url);
    var query = Nodo.find({ datos: url});
    query.exec(function(err, model){
        if(err){
            req.json(err);
        }
        else{
            if(!isEmptyObject(model)){
                // console.log("NO VACIO");
                res.json(model);
            }
            else{
                // console.log("NO HAY DATOS, BUSCANDO...");

                var arania = new Crawler(url);

                function iniciar(callback){
                    arania.arrancar(arania.getPrimeraUrl(),arania.getArbol(),-1,2)
                        .then(function(){
                            //  console.log("Saliendo del proceso");
                            arania.recorrerArbol(function(){
                                // console.log("Terminado de guardar MongoDB");
                                return callback();
                            });

                        })
                }
                iniciar(function(){
                    query.exec(function(err, model){
                        if(!err)
                            res.json(model);
                    });
                });
            }
        }
    });
});


module.exports = router;