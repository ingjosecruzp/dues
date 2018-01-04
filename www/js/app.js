// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;  //Variable para la base de datos

var app=angular.module('starter', ['ionic','ngResource','ngCordova'])

app.run(function($ionicPlatform,$rootScope,$cordovaSQLite) {
  $rootScope.articulo = {};

  $ionicPlatform.ready(function(){
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
  // for form inputs)
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
  }
  if (window.StatusBar) {
    // org.apache.cordova.statusbar required
    StatusBar.styleDefault();
  }

  //Condición para crear la base de datos cuando la app comienza a correr
  if(window.cordova) {
    db = $cordovaSQLite.openDB({ name: "duesinventario.db", iosDatabaseLocation:'default'}); 
  }

  //Queries para crear las tablas de la base de datos
  $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS inventario (idInventario INTEGER PRIMARY KEY AUTOINCREMENT,FechaInicio DATETIME,UsuarioId INTEGER,UUID VARCHAR (40),Modelo VARCHAR (20));');
  $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS detalle_inventario (idDetalle_Inventario INTEGER PRIMARY KEY AUTOINCREMENT,ItemCode VARCHAR (45),ItemName VARCHAR (45),Codebars VARCHAR (45),Cantidad VARCHAR (45),NombreLote VARCHAR (45),PicturName VARCHAR (45),FechaHora DATETIME,InventarioId INTEGER);');

  });
});

app.config(function($stateProvider, $urlRouterProvider,$httpProvider){

    //Intercepta las petciones realizadas por $resource
    $httpProvider.interceptors.push(function($q) {
      return {
        'responseError': function(response) {
          if (response.status == 400) {
           
          }
          if (response.status == 500) {
            //console.log(response.headers("Error")); 
          }
          // Always reject (or resolve) the deferred you're given
          return $q.reject(response);
        },
        // optional method
        'request': function(config) {
          // do something on success
          //console.log(config);
          return config;
        }
      };
    });

    $stateProvider
      .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
      .state('articulo', {
          //url: '/articulo/:barcode',
          url: '/articulo',
          templateUrl: 'views/articulo.html',
          controller:'ArticuloController'
      })
      .state('articulo.menuarticulo', {
        url: '/menuarticulos',
        views:{
          'submenu': {
            templateUrl: 'views/menuarticulos.html',
            controller: 'ArticuloMenuController',
          }
        }
      })
      .state('articulo.datosventa', {
        url: '/datosventa',
        views:{
          'submenu': {
            templateUrl: 'views/datosventa.html',
            controller: 'DatosVentaController'
          }
        }
      })
      .state('articulo.datoscompra', {
        url: '/datoscompra',
        views:{
          'submenu': {
            templateUrl: 'views/datoscompra.html',
            controller: 'DatosCompraController'
          }
        }
      })
      .state('articulo.datosgenerales', {
        url: '/datosgenerales',
        views:{
          'submenu': {
            templateUrl: 'views/datosgenerales.html',
            controller: 'DatosGeneralesController'
          }
        }
      })
      .state('main', {
            url: '/main',
            templateUrl: 'views/main.html',
            controller: 'MainController'
      })
      .state('buscararticulo', {
        url: '/buscararticulo',
        templateUrl: 'views/buscararticulo.html',
        controller: 'BuscarArticuloController'
      })
      .state('inventario', {
        url: '/inventario',
        templateUrl: 'views/inventario.html',
        controller: 'InventarioController'
      })
      ;


    $urlRouterProvider.otherwise('/login');
});
        
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

//Variables Globales
app.value('Variables',{
  IpServidor: '192.168.0.108:8080'
  //IpServidor: 'localhost:8080'
  //IpServidor: 'duestextil.fortiddns.com:8020/WcfDues'
});

//Directiva para usar el boto serar y go del celular
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
          if(event.which === 13) {
                  scope.$apply(function(){
                          scope.$eval(attrs.ngEnter);
                  });
                  
                  event.preventDefault();
          }
      });
  };
});

//Modifica la referencia cirulares de las peticiones entrantes
app.factory('resourceInterceptor', function(Servicios) {
  return {
    response: function(response) {
      response.data=Servicios.parseAndResolve(JSON.stringify(response.data));
      return response;
    }
  }
});
app.service('Servicios', function() {
  this.parseAndResolve=function(json) {
        var refMap = {};
            return JSON.parse(json, function (key, value) {
                if (key === '$id') { 
                    refMap[value] = this;
                    // return undefined so that the property is deleted
                    return void(0);
                }

                if (value && value.$ref) { return refMap[value.$ref]; }

                return value; 
            });
    };
});