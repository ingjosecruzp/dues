app.controller('InventarioController', function($scope,$ionicLoading,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,$ionicModal,articulo,inventario,$cordovaBarcodeScanner, $ionicPlatform) {
    
        //Función que muestra un popup para eliminar o modificar un articulo
        $scope.OpcionProducto = function(){
            console.log("Entre");
            var articuloPopup = $ionicPopup.confirm({
                cancelText: 'Modificar',
                okText: 'Eliminar',
                okType: 'button-assertive',
                cancelType: 'button-balanced'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Entre a Eliminar");
                    $scope.OpcionEliminarProducto();
                }else{
                    //Líneas de código Modificar artículo
                    $scope.ModalAgregarProducto.show();
                    console.log("Entre a Modificar");
                }
            });
        }


        //Función que muestre un popup para saber el tipo de captura de producto
        $scope.OpcionAgregar = function(){
            console.log("Entre a Captura");
            var articuloPopup = $ionicPopup.confirm({
                title: '¿Cómo desea realizar la captura?',
                cancelText: 'Escanear código',
                okText: 'Escribir código',
                okType: 'button-capturar',
                cancelType: 'button-dark'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Entre a Escribir");
                    $scope.OpcionEscribirCodigo();
                }else{
                    //Líneas de código Modificar artículo
                    $scope.ModalAgregarProducto.show();
                    console.log("Entre a escanear");
                    //PRUEBA----------------------------------
                    /*var member = {
                        idInventario:null,
                        FechaInicio:"1997-07-27",
                        UsuarioId:1,
                        UUID:"1234567890",
                        Modelo:"iPhone 5,1"
                    };

                    inventario.add(member).then(function(){
                        console.log("Guardé");
                        $scope.prueba=inventario.all();
                        console.log("Obtuve resultado");
                    });
                    inventario.all().then(function(productos){
                        console.log("retorno");
                        productos.forEach(function(producto) {
                            console.log(producto);
                        });
                    });*/
                    //PRUEBA----------------------------------
                    $scope.Escanear();
                }
            });
        }
        
        //Función que muestra un popup con input para agregar código por tecleo
        $scope.OpcionEscribirCodigo = function(){
            console.log("Entre a Escribir código");
            var articuloPopup = $ionicPopup.confirm({
                title:'Escriba el código de barra', 
                template: '<input type="text" ng-model="codigo">',
                cancelText: 'Cancelar',
                okText: 'Capturar',
                okType: 'button-balanced',
                cancelType: 'button-assertive'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Capturar");
                    $scope.ModalAgregarProducto.show();
                    
                }else{
                    //Líneas de código Modificar artículo
                    console.log("Cancelar");
                    return;
                    
                }
            });
        }

        //Función que muestra un popup de confirmación de presionar eliminar producto
        $scope.OpcionEliminarProducto = function(){
            console.log("Entre a Eliminar producto");
            var articuloPopup = $ionicPopup.confirm({
                title:'¿Desea eliminar el producto de la lista de inventario?', 
                template: '<p style="text-align: center;">Una vez eliminado no se podrá recuperar</p>',
                cancelText: 'Cancelar',
                okText: 'Confirmar',
                okType: 'button-confirmar',
                cancelType: 'button-cancelar'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Confirmar");
                    
                }else{
                    //Líneas de código Modificar artículo
                    console.log("Cancelar");
                    return;
                    
                }
            });
        }

        //Función que muestra un popup cuando se presiona el botónn de guardar
        $scope.OpcionGuardar = function(){
            console.log("Entre a Guardar productos");
            var articuloPopup = $ionicPopup.confirm({
                title:'Se guardará el conteo físico en el sistema, ¿Desea continuar?', 
                template: '<p style="text-align: center;">Si confirma, se almacenará la información en el servidor y se reinicializará el conteo físico para una nueva captura en el sistema.</p>',
                cancelText: 'Cancelar',
                okText: 'Confirmar',
                okType: 'button-confirmar',
                cancelType: 'button-cancelar'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Capturar");
                    $scope.ModalAgregarProducto.show();
                    
                }else{
                    //Líneas de código Modificar artículo
                    console.log("Cancelar");
                    return;
                    
                }
            });
        }

        // Manda llamar el modal de agregar producto
        $ionicModal.fromTemplateUrl('views/ModalAgregarProducto.html', function(modal){
            $scope.ModalAgregarProducto = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        //Función para mostrar u ocultar la caja de búsqueda
        $scope.AbrirBusqueda = function(){
            var contenedor = angular.element( document.getElementById('cajaBusqueda') );
            
            //Condiciones para mostrar y ocultar la caja  de búsqueda
            if(contenedor.hasClass('mostrado')==true){
                contenedor.removeClass('mostrado');
                contenedor.addClass('oculto');
            }
            else if(contenedor.hasClass('oculto')==true){			
                contenedor.removeClass('oculto');
                contenedor.addClass('mostrado');
            }
        }

        $scope.Escanear = function() {
            try{
               $ionicPlatform.ready(function () {
                    $cordovaBarcodeScanner
                        .scan()
                        .then(function(barcodeData) {
                            // Success! Barcode data is here
                                console.log(barcodeData);
                                $ionicLoading.show({
                                    noBackdrop :false,
                                    template: '<ion-spinner icon="spiral"></ion-spinner><br>Buscando producto'
                                });
                                var vari=articulo.query({codigo:barcodeData.text},function(respuesta){
                                    $ionicLoading.hide();
                                    $scope.Articulo=respuesta[0];
                       
                                    $rootScope.articulo=$scope.Articulo
                                    console.log(scope.articulo);
                                    
                               },function(error){
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.headers("Error")
                                    });
                               });
                        }, function(error) {
                            // An error occurred
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Errorrr',
                                    template: error
                                });
                        });
                });
            }
            catch(err){
                console.log(err);
            }
        }

        /*$scope.AgregarProducto = function(){
            //Lineas de código para agregar un producto

        }*/
	}
);