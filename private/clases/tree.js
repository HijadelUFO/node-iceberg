var Nodo = require('./node');
var modeloMongo = require('../models/model.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://manuasir:mongodb@ds147497.mlab.com:47497/heroku_hbc36tp7');

/**
 * Clase Arbol: Estructura de datos con la información y las relaciones entre los nodos
 * @param datos
 * @constructor
 */
function Arbol(datos) {
    // always initialize all instance properties
    this.raiz = new Nodo(datos);
    this.profundidad = 0;
}


/**
 * Crear un nuevo nodo con información pasada por parámetro
 * @param info
 * @returns {Node}
 */
Arbol.prototype.crearNodo = function(info) {
    var nuevonodo = new Nodo(info);
    return nuevonodo;
};

/**
 * Obtiene la raíz del árbol
 * @returns {Nodo|Node}
 */
Arbol.prototype.getRaiz = function() {
    return this.raiz;
};

/**
 * Obtiene la cola de hijos de un nodo
 * @param nodo
 * @returns {*}
 */
Arbol.prototype.getColaNodo = function(nodo) {
    return nodo.getCola();
};

/**
 * Obtiene la información de un nodo
 * @param nodo
 */
Arbol.prototype.getDatosNodo = function(nodo) {
    return nodo.getDatos();
};

/**
 * Obtiene el número de hijos del árbol
 * @param nodo
 */
Arbol.prototype.getNumHijos = function(nodo) {
    return nodo.getNumHijos();
};

/**
 * Obtiene el nivel de profundidad del árbol
 * @param nodo
 * @returns {number}
 */
Arbol.prototype.getProfundidad = function(nodo) {
    return this.profundidad;
};

/**
 * Devuelve un nodo a partir de un índice
 * @param nodo
 * @param i
 */
Arbol.prototype.getNodo = function(nodo,i) {
    return nodo.getNodo().getHijo(i);
};

/**
 * Devuelve el árbol
 * @returns {Arbol}
 */
Arbol.prototype.getArbol = function() {
    return this;
};

/**
 * Añade un nuevo hijo o conjunto de hijos a un nodo
 * @param nodo
 * @param vec
 * @returns {Promise}
 */
Arbol.prototype.addHijosToNodo = function(nodo,vec) {

    return new Promise(function (resolve, reject) {
        this.profundidad=this.profundidad+1;
        // console.log("añadiendo "+vec.length+" elementos al nodo seleccionado "+nodo.getDatos());
        // console.log(vec);
        var arraynodos = [];
        if(vec.length>0){
            vec.forEach(function(item,index){
                if(item instanceof Nodo == false){
                    // console.log("array de tipo de datos que no es nodo");
                    var temp = new Nodo(item);
                    arraynodos.push(temp);
                }
                else{
                    // console.log("vector de nodo");
                    // console.log(item instanceof Nodo);
                    arraynodos.push(item);
                }
            });
        }
        else{
            if(vec instanceof Nodo == false){
                // console.log("un solo elemento tipo de datos que no es nodo");
                var temp = new Nodo(vec);
                arraynodos.push(temp);
            }
            else{
                // console.log("un solo nodo");
                arraynodos.push(vec);
            }
        }
        nodo.addHijos(arraynodos);
        // console.log("añadidos "+arraynodos.length+ " hijos al nodo "+nodo.getDatos());
        resolve();
    });
};

// var aux = [];
/**
 * Obtiene los datos a partir de un nodo
 * @param nodo
 */
Arbol.prototype.getDatosFromMongo = function(nodo) {

    this.nuevoModelo.find({datos:nodo.getDatos()}, function(err, datos) {
        if (err) throw err;

        // object of all the users
        // console.log(datos);
    });
};

/**
 * Inserta en MongoDB
 * @param nuevoModelo
 * @returns {Promise}
 */
Arbol.prototype.insertIntoMongo = function(nuevoModelo) {
    return new Promise(function (resolve, reject) {
        //console.log("en mongo...");
        nuevoModelo.save(function(err) {
            if (err) throw err;
            resolve();
        });
    });
};

/**
 * Recorrer el árbol
 * @param nodo
 * @returns {Promise}
 */
Arbol.prototype.recorrerArbol = function(nodo){
    return new Promise(function (resolve, reject) {
        //console.log("Entrando en recorrerArbol");
        var temp = nodo.getDatos();

        var nuevoModelo = modeloMongo({
            datos: nodo.getDatos(),
            //padre: nodo.getPadre().getDatos(),
            hijos: nodo.getAllHijos()
        });

        //console.log("salvando........");

        Arbol.prototype.insertIntoMongo(nuevoModelo)
            .then(function(){
                resolve();

            })
    });
};

module.exports = Arbol;