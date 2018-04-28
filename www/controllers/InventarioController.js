app.controller('InventarioController', function($scope,$ionicLoading,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,$ionicModal,articulo,inventario,detalleinventario,$cordovaBarcodeScanner,$ionicPlatform,inventarios,Servicios,$timeout) {
    
    $scope.codigoCapturado={};
    $scope.indicadorModificar=false;
    $scope.articulosGuardados=[];
    $rootScope.checkLote={};
    $rootScope.checkLote.check=false;
    $rootScope.activarEscaner=true;
    $rootScope.activarModificar=true;
    var x = 0;
    $rootScope.separadorBarra="50px";
    $rootScope.txtbtnModal;

    $scope.cajaBuscarInventario;
    $scope.eliminando=false;

        //Función que muestra un popup para eliminar o modificar un articulo
        $scope.OpcionProducto = function(articulo){
            var articuloPopup = $ionicPopup.confirm({
                title: 'Opciones',
                cancelText: 'Modificar',
                okText: 'Eliminar',
                okType: 'button-assertive',
                cancelType: 'button-balanced'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Entre a Eliminar");
                    $scope.OpcionEliminarProducto(articulo);
                }else{
                    //Líneas de código Modificar artículo
                    if($rootScope.activarModificar==false){
                        $rootScope.activarModificar=true;
                        return;
                    }

                    $scope.ModificarProducto(articulo);
                    console.log("Entre a Modificar");
                }
            });
        }

        $scope.ModificarProducto = function(articulo){
            if(articulo.NombreLote==null) $rootScope.checkLote.check=false;
            else $rootScope.checkLote.check=true;

            $scope.indicadorModificar=true;
            $rootScope.member={
                idDetalle_Inventario:articulo.idDetalle_Inventario,
                ItemCode:articulo.ItemCode,
                ItemName:articulo.ItemName,
                Codebars:articulo.Codebars,
                Cantidad:articulo.Cantidad,
                NombreLote:articulo.NombreLote,
                PicturName:articulo.PicturName,
                FechaHora:articulo.FechaHora,
                InventarioId:articulo.InventarioId,
                Numero:articulo.Numero,
                ImagenBase64:articulo.ImagenBase64
            };
            //Convertir los datos que deben ser int en la BD porque vienen como cadenas
            $rootScope.member.idDetalle_Inventario=parseInt($rootScope.member.idDetalle_Inventario);
            $rootScope.member.Cantidad=parseInt($rootScope.member.Cantidad);
            $rootScope.member.InventarioId=parseInt($rootScope.member.InventarioId);
            $rootScope.txtbtnModal="Modificar";
            $rootScope.ModalAgregarProducto.show();
        }


        //Función que muestre un popup para saber el tipo de captura de producto
        $scope.OpcionAgregar = function(){
            console.log("Entre a Captura");
            var articuloPopup = $ionicPopup.confirm({
                title: '¿Cómo desea realizar la captura?',
                cancelText: 'Escanear código',
                okText: 'Buscar producto',
                okType: 'button-capturar',
                cancelType: 'button-dark'
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para Escribir código
                    console.log("Entre a Escribir");
                    //$scope.OpcionEscribirCodigo();
                    $rootScope.txtbtnModal="Agregar";
                    $rootScope.ModalBuscarProducto.show();
                }else{
                    //Líneas de código para Escanear código
                    if($rootScope.activarEscaner==false){
                        $rootScope.activarEscaner=true;
                        return;
                    }
                    console.log("Entre a escanear");
                    $scope.Escanear();
                    $rootScope.txtbtnModal="Agregar";
                    $rootScope.ModalAgregarProducto.show();

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
                }
            });
        }
        
        //Función que muestra un popup con input para agregar código por tecleo
        $scope.OpcionEscribirCodigo = function(){
            console.log("Entre a Escribir código");
            
            var articuloPopup = $ionicPopup.confirm({
                title:'Escriba el código de barra', 
                template: '<input type="text" ng-model="codigoCapturado.code">',
                cancelText: 'Cancelar',
                okText: 'Capturar',
                okType: 'button-balanced',
                cancelType: 'button-assertive',
                scope: $scope
            });

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para capturar codigo
                    console.log("Capturar");
                    console.log("Capturado: "+$scope.codigoCapturado.code);

                    $ionicLoading.show({
                        noBackdrop :false,
                        template: '<ion-spinner icon="spiral"></ion-spinner><br>Buscando producto'
                    });

                    var vari=articulo.query({method:'getXCodigo',codigo:$scope.codigoCapturado.code},function(respuesta){
                        $ionicLoading.hide();
                        $scope.articulo=vari[0];
                        $scope.codigoCapturado.code=null;

                        //OBTENCIÓN DE FECHA Y HORA
                        var fecha = new Date();
                        var dd = fecha.getDate();
                        var mm = fecha.getMonth()+1;//January is 0, so always add + 1
                        var yyyy = fecha.getFullYear();
                        var hh =fecha.getHours();
                        var min = fecha.getMinutes();
                        if(dd<10){dd='0'+dd}
                        if(mm<10){mm='0'+mm}
                        if(hh<10){hh='0'+hh}
                        if(min<10){min='0'+min}
                        fecha = yyyy+'-'+mm+'-'+dd+' '+hh+':'+min;
                        //fecha = yyyy+'-'+mm+'-'+dd;
                        console.log("Fecha: "+fecha);

                        //ASIGNACIÓN DE VALORES PARA MEMBER
                        $rootScope.member={};
                        $rootScope.member.idDetalle_Inventario = null;
                        $rootScope.member.ItemCode = $scope.articulo.ItemCode;
                        $rootScope.member.ItemName = $scope.articulo.ItemName;
                        $rootScope.member.Codebars = $scope.articulo.CodeBars;
                        $rootScope.member.Cantidad = null;
                        $rootScope.member.NombreLote = null;
                        $rootScope.member.PicturName = $scope.articulo.PicturName;
                        $rootScope.member.FechaHora = fecha;
                        $rootScope.member.InventarioId = 1; 

                        console.log('Fecha en root: '+$rootScope.member.FechaHora);

                        //OBTENCIÓN DE LA IMÁGEN DEL ARTÍCULO
                        $rootScope.member.ImagenBase64="img/loading.gif";
                        
                        if($rootScope.member.PicturName==undefined)
                        {
                            $rootScope.member.ImagenBase64="img/camera.png";
                            return;
                        }
                
                        articulo.query({method:'getImagen',Imagen:$rootScope.member.PicturName},function(respuesta){
                                console.log(respuesta);
                                $rootScope.member.ImagenBase64="data:image/png;base64," + respuesta.data[0];
                            },function(error){
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: error.headers("Error")
                            });
                        });
                   },function(error){
                        $scope.codigoCapturado.code=null;
                        $ionicLoading.hide();
                        $rootScope.member={};
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error.headers("Error")
                        });
                        alertPopup.then(function(){$rootScope.ModalAgregarProducto.hide();});
                        $rootScope.member={};
                   });
                    $rootScope.txtbtnModal="Agregar";
                    $rootScope.ModalAgregarProducto.show();
                }else{ return; }
            });
        }

        //Función que muestra un popup de confirmación de presionar eliminar producto
        $scope.OpcionEliminarProducto = function(articulo){
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
                    detalleinventario.remove(articulo);
                    $scope.articulosGuardados.splice(articulo.Numero-1,1);
                    var x=1;
                    $scope.articulosGuardados.forEach(function(producto) {
                        producto.Numero=x;
                        x++;
                    });
                }else{ return; }
            });
        }

        //Función que muestra un popup cuando se presiona el botón de guardar
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
                    console.log($scope.articulosGuardados);
                    

                    //Ajusta la fecha para que pueda ser aceptada por el wcf
                    $scope.articulosGuardados.forEach(function(producto) {
                        producto.FechaHora=Servicios.convertToJSONDate(producto.FechaHora);
                    });

                    var newInventario = new inventarios({
                        idInventario:0,
                        FechaInicio :Servicios.convertToJSONDate(FechaInicio),
                        UsuarioId   :0,
                        UUID        :"0000000",
                        Modelo      :"Motorola",
                        detalle_inventario : $scope.articulosGuardados});
                    console.log(newInventario);
                    newInventario.$save();
                    //$rootScope.ModalAgregarProducto.show();
                    
                }else{
                    //Líneas de código Modificar artículo
                    console.log("Cancelar");
                    return;
                    
                }
            });
        }

        // Manda llamar el modal de agregar producto
        $ionicModal.fromTemplateUrl('views/ModalAgregarProducto.html', function(modal){
            $rootScope.ModalAgregarProducto = modal;
        }, {
            scope: $rootScope,
            animation: 'slide-in-up',
            controller: 'InventarioController'
        });

        // Manda llamar el modal de buscar producto
        $ionicModal.fromTemplateUrl('views/modalBuscarInventario.html', function(modal){
            $rootScope.ModalBuscarProducto = modal;
        }, {
            animation: 'slide-in-up',
            controller: 'BuscarArticuloController'
        });

        //Función para mostrar u ocultar la caja de búsqueda
        $scope.AbrirBusqueda = function(){
            var contenedor = angular.element( document.getElementById('cajaBusqueda') );
            
            //Condiciones para mostrar y ocultar la caja  de búsqueda
            if(contenedor.hasClass('mostrado')==true){
                contenedor.removeClass('mostrado');
                contenedor.addClass('oculto');
                $rootScope.separadorBarra="50px";
            }
            else if(contenedor.hasClass('oculto')==true){			
                contenedor.removeClass('oculto');
                contenedor.addClass('mostrado');
                $rootScope.separadorBarra="100px";
                $timeout(function() {
                    document.getElementById("inputBuscar").focus(); 
                },5);
            }
        }

        $scope.Escanear = function() {
            try{
               $ionicPlatform.ready(function () {
                    $cordovaBarcodeScanner
                        .scan({orientation : "portrait", showTorchButton: true})
                        .then(function(barcodeData) {
                            if(barcodeData.cancelled==true){
                                $rootScope.ModalAgregarProducto.hide();
                                return;
                            }else{
                            // Success! Barcode data is here
                                console.log(barcodeData);
                                $ionicLoading.show({
                                    noBackdrop :false,
                                    template: '<ion-spinner icon="spiral"></ion-spinner><br>Buscando producto'
                                });

                                var vari=articulo.query({method:'getXCodigo',codigo:barcodeData.text},function(respuesta){
                                    $ionicLoading.hide();
                                    $scope.articulo=vari[0];

                                    //OBTENCIÓN DE FECHA Y HORA
                                    var fecha = new Date();
                                    var dd = fecha.getDate();
                                    var mm = fecha.getMonth()+1;//January is 0, so always add + 1
                                    var yyyy = fecha.getFullYear();
                                    var hh =fecha.getHours();
                                    var min = fecha.getMinutes();
                                    if(dd<10){dd='0'+dd}
                                    if(mm<10){mm='0'+mm}
                                    if(hh<10){hh='0'+hh}
                                    if(min<10){min='0'+min}
                                    fecha = yyyy+'-'+mm+'-'+dd+' '+hh+':'+min;
                                    //fecha = yyyy+'-'+mm+'-'+dd;
                                    console.log("Fecha: "+fecha);

                                    //ASIGNACIÓN DE VALORES PARA MEMBER
                                    $rootScope.member={};
                                    $rootScope.member.idDetalle_Inventario = null;
                                    $rootScope.member.ItemCode = $scope.articulo.ItemCode;
                                    $rootScope.member.ItemName = $scope.articulo.ItemName;
                                    $rootScope.member.Codebars = $scope.articulo.CodeBars;
                                    $rootScope.member.Cantidad = null;
                                    $rootScope.member.NombreLote = null;
                                    $rootScope.member.PicturName = $scope.articulo.PicturName;
                                    $rootScope.member.FechaHora = fecha;
                                    $rootScope.member.InventarioId = 1; 

                                    console.log('Fecha en root: '+$rootScope.member.FechaHora);

                                    //OBTENCIÓN DE LA IMÁGEN DEL ARTÍCULO
                                    $rootScope.member.ImagenBase64="img/loading.gif";
                                    
                                    if($rootScope.member.PicturName==undefined)
                                    {
                                        $rootScope.member.ImagenBase64="img/camera.png";
                                        return;
                                    }
                            
                                    articulo.query({method:'getImagen',Imagen:$rootScope.member.PicturName},function(respuesta){
                                            console.log(respuesta);
                                            $rootScope.member.ImagenBase64="data:image/png;base64," + respuesta.data[0];
                                        },function(error){
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Error',
                                            template: error.headers("Error")
                                        });
                                    });}
                                    
                               ,function(error){
                                    console.log("Entre a error");
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.headers("Error")
                                    });
                                    alertPopup.then(function(){$rootScope.ModalAgregarProducto.hide();});
                               });}
                        }, function(error) {
                            // An error occurred
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Errorrr',
                                    template: error
                                });
                                alertPopup.then(function(){$rootScope.ModalAgregarProducto.hide();});
                        });
                    
                });
            }
            catch(err){
                console.log(err);
            }
        }

        //Función para el botón de agregar
        $rootScope.btnAgregar = function(){
            if($rootScope.member.Cantidad==null){   //Verificación de cantidad
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No se ha ingresado ninguna cantidad'
                });
                return;
            }
            else{   //Código para guardar un nuevo producto cuando la cantidad se agregó
                if($scope.indicadorModificar){  //Opción para guardar cambios de modificación
                    $scope.indicadorModificar=false;
                    
                    if($rootScope.member.NombreLote==null){$rootScope.member.TieneLote=false;}
                    else{$rootScope.member.TieneLote=true;}

                    detalleinventario.update($rootScope.member, $rootScope.member).then(function(){
                        detalleinventario.get($rootScope.member.idDetalle_Inventario);
                        
                        var posicion = $rootScope.member.Numero-1;
                        $scope.articulosGuardados[posicion]=$rootScope.member;
    
                        $rootScope.member={};
                        $rootScope.ModalAgregarProducto.hide();
                        return;
                    });
                }
                else{   //Opción para guardar datos de nueva captura
                    if($rootScope.member.NombreLote==null){$rootScope.member.TieneLote=false;}
                    else{$rootScope.member.TieneLote=true;}

                    detalleinventario.add($rootScope.member).then(function(){$rootScope.ModalAgregarProducto.hide();});
                    
                    detalleinventario.all().then(function(productos){
                        productos.forEach(function(producto) {
                            console.log(producto);
                        });
                    });
    
                    $rootScope.member.Numero=$scope.articulosGuardados.length+1;
                    $scope.articulosGuardados.push($rootScope.member);
                    $rootScope.member={};
                }
            }
        }

        $rootScope.btnCancelar = function(){
            $rootScope.member={};
            $rootScope.ModalAgregarProducto.hide();
        }


        //Función para inicar la lista de artículos inventariados

        $scope.IniciarInventario = function(){
            detalleinventario.all().then(function(productos){
                productos.forEach(function(producto) {
                    producto.fondo="white";
                    producto.seleccionado=false;
                    //$scope.articulosGuardados[x]=producto;
                    //$scope.articulosGuardados[x].Numero=x+1;
                    $scope.articulosGuardados.push(producto);
                    producto.Numero=x+1;
                    if(producto.NombreLote==null){producto.TieneLote=false;}
                    else{producto.TieneLote=true;}

                    //OBTENCIÓN DE LA IMÁGEN DEL ARTÍCULO
                    //$scope.articulosGuardados[x].ImagenBase64="img/loading.gif";
                    //producto.ImagenBase64="img/loading.gif";
                                 
                    if($scope.articulosGuardados[x].PicturName==undefined){
                        //$scope.articulosGuardados[x].ImagenBase64="img/camera.png";
                        producto.ImagenBase64="img/camera.png";
                    }
                    else{
                        $scope.posimagenes=x;
                        //articulo.query({method:'getImagen',Imagen:$scope.articulosGuardados[x].PicturName},function(respuesta){
                        producto.ImagenBase64="img/camera.png";
                        articulo.query({method:'getImagen',Imagen:producto.PicturName},function(respuesta){
                                console.log(respuesta);
                                //$scope.articulosGuardados[x].ImagenBase64="data:image/png;base64," + respuesta.data[0];
                                //$scope.imagenes.push(respuesta.data[0]);
                                producto.ImagenBase64="data:image/png;base64," + respuesta.data[0];
                            },function(error){
                                /*var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: error.headers("Error")
                                });*/
                                console.log("Error: "+error.headers("Error"));
                        });
                    }
                    x++;
                });
            });
        }

        //Función para iniciar selección multiple
        $scope.activarSeleccionar = function(){
            $scope.eliminando=true;

            document.getElementById("noEliminando").style.display = "none";
            document.getElementById("noEliminando2").style.display = "none";
            document.getElementById("siEliminando").style.display = "block";
            document.getElementById("siEliminando2").style.display = "block";
            document.getElementById("siEliminando3").style.display = "block";
            
            var contenedor = angular.element( document.getElementById('cajaBusqueda') );
            contenedor.removeClass('mostrado');
            contenedor.addClass('oculto');
            $rootScope.separadorBarra="50px";
        }

        //Función para cancelar selección multiple
        $scope.desactivarSeleccionar = function(){
            $scope.eliminando=false;
            document.getElementById("noEliminando").style.display = "block";
            document.getElementById("noEliminando2").style.display = "block";
            document.getElementById("siEliminando").style.display = "none";
            document.getElementById("siEliminando2").style.display = "none";
            document.getElementById("siEliminando3").style.display = "none";
        }

        
        /*$scope.AgregarProducto = function(){
            //Lineas de código para agregar un producto

        }*/
	}
);