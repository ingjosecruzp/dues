app.controller('InventarioController', function($scope,$cordovaSQLite,$ionicLoading,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,$ionicModal,articulo,inventario,detalleinventario,$ionicPlatform,inventarios,Servicios,$timeout, $cordovaDevice,IonicClosePopupService) {
    
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
            IonicClosePopupService.register(articuloPopup);

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Entre a Eliminar");
                    $scope.OpcionEliminarProducto(articulo);
                }else if(res==false){
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

          //Popup para la imagen del articulo
          $rootScope.ImagenZoom = function(){
            console.log($rootScope.member.ImagenBase64);
            var pop = $ionicPopup.alert({
                scope: $rootScope,
                title: 'Imagen',
                templateUrl: 'ImagenZoom.html'
            });
            IonicClosePopupService.register(pop);
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
            IonicClosePopupService.register(articuloPopup);

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para Escribir código
                    console.log("Entre a Escribir");
                    //$scope.OpcionEscribirCodigo();
                    $rootScope.txtbtnModal="Agregar";
                    $rootScope.ModalBuscarProducto.show();
                }else if(res==false){
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
            IonicClosePopupService.register(articuloPopup);

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
                            IonicClosePopupService.register(alertPopup);
                        });
                   },function(error){
                        $scope.codigoCapturado.code=null;
                        $ionicLoading.hide();
                        $rootScope.member={};
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error.headers("Error")
                        });
                        IonicClosePopupService.register(alertPopup);
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
            IonicClosePopupService.register(articuloPopup);

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
            if($scope.articulosGuardados.length==0) return;
            console.log("Entre a Guardar productos");
            var articuloPopup = $ionicPopup.confirm({
                title:'Se guardará el conteo físico en el sistema, ¿Desea continuar?', 
                template: '<p style="text-align: center;">Si confirma, se almacenará la información en el servidor y se reinicializará el conteo físico para una nueva captura en el sistema.</p>',
                cancelText: 'Cancelar',
                okText: 'Confirmar',
                okType: 'button-confirmar',
                cancelType: 'button-cancelar'
            });
            IonicClosePopupService.register(articuloPopup);

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    console.log("Capturar");
                    console.log($scope.articulosGuardados);
                    

                    //Ajusta la fecha para que pueda ser aceptada por el wcf
                    var fechasOriginales=[];
                    $scope.articulosGuardados.forEach(function(producto) {
                        fechasOriginales.push(producto.FechaHora);
                        producto.FechaHora=Servicios.convertToJSONDate(producto.FechaHora);
                        producto.UsuarioId=$rootScope.idUsuario;
                    });

                    //Obtención de datos del dispositivo para guardar el inventario
                    $scope.uuid = $cordovaDevice.getUUID();
                    $scope.modelo = $cordovaDevice.getModel();

                    var newInventario = new inventarios({
                        idInventario:0,
                        //FechaInicio :Servicios.convertToJSONDate(FechaInicio),
                        UsuarioId   :$rootScope.idUsuario,
                        UUID        :$scope.uuid,
                        Modelo      :$scope.modelo,
                        detalle_inventario : $scope.articulosGuardados
                    });
                    
                    console.log(newInventario);
                    var promiseSaved = newInventario.$save();

                    promiseSaved.then(function(){
                        console.log("Inventario guardado");
                        $ionicPopup.alert({
                            title: "Éxito",
                            template: "Inventario guardado correctamente"
                        });

                    $scope.articulosGuardados=[];    
                    $cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS detalle_inventario');                
                    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS detalle_inventario (idDetalle_Inventario INTEGER PRIMARY KEY AUTOINCREMENT,ItemCode VARCHAR (45),ItemName VARCHAR (45),Codebars VARCHAR (45),Cantidad VARCHAR (45),NombreLote VARCHAR (45),PicturName VARCHAR (45),FechaHora DATETIME,InventarioId INTEGER);');
                    }, function(){
                        $scope.articulosGuardados.forEach(function(producto){
                            producto.FechaHora=fechasOriginales[$scope.articulosGuardados.indexOf(producto)];
                        });
                        console.log("Error al guardar el inventario");
                        $ionicPopup.alert({
                            title: "Error",
                            template: "Error al guardar el inventario"
                        });
                    });
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
            scope: $rootScope,
            animation: 'slide-in-up',
            controller: 'BuscarArticuloController'
        });

        //Función para mostrar u ocultar la caja de búsqueda
        /*$scope.Busqueda = function(){
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
        }*/

        $scope.Escanear = function() {
            try{
               $ionicPlatform.ready(function () {
                    cordova.plugins.barcodeScanner
                        .scan(function(barcodeData) {
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
                                        IonicClosePopupService.register(alertPopup);
                                    });}
                                    
                               ,function(error){
                                    console.log("Entre a error");
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.headers("Error")
                                    });
                                    IonicClosePopupService.register(alertPopup);
                                    alertPopup.then(function(){$rootScope.ModalAgregarProducto.hide();});
                               });}
                            $scope.$apply();
                        }, function(error) {
                            // An error occurred
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Errorrr',
                                    template: error
                                });
                                IonicClosePopupService.register(alertPopup);
                                alertPopup.then(function(){$rootScope.ModalAgregarProducto.hide();});
                        },{orientation : "portrait", showTorchButton: true});
                    
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
                IonicClosePopupService.register(alertPopup);
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
                        $rootScope.ModalBuscarProducto.hide();
                        return;
                    });
                }
                else{   //Opción para guardar datos de nueva captura
                    if($rootScope.member.NombreLote==null){$rootScope.member.TieneLote=false;}
                    else{$rootScope.member.TieneLote=true;}
                    
                    detalleinventario.add($rootScope.member).then(function(producto){
                        console.log(producto.insertId);
                        $rootScope.member.idDetalle_Inventario=producto.insertId;
        
                        $rootScope.member.Numero=$scope.articulosGuardados.length+1;
                        $scope.articulosGuardados.push($rootScope.member);
                        $rootScope.member={};

                        $rootScope.ModalBuscarProducto.hide();
                        $rootScope.ModalAgregarProducto.hide();
                    });

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

        $scope.seleccionarUno=function(index){
            if($scope.articulosGuardados[index].seleccionado==false){
                //$scope.articulosGuardados[index].fondo="#c9ddfc";
                $scope.articulosGuardados[index].fondo="#dbe8ff";
                $scope.articulosGuardados[index].seleccionado=true;
            } else{
                $scope.articulosGuardados[index].fondo="white";
                $scope.articulosGuardados[index].seleccionado=false;
            }
        }

        $scope.seleccionarTodo=function(){
            console.log("Seleccionando todo");
            var s=false;
            for(x=0; x<$scope.articulosGuardados.length; x++){
                if($scope.articulosGuardados[x].seleccionado==true){
                    s=true;
                    x=$scope.articulosGuardados.length;
                }
            }

            if(s==true){
                for(x=0; x<$scope.articulosGuardados.length; x++){
                    $scope.articulosGuardados[x].seleccionado=false;
                    $scope.articulosGuardados[x].fondo="white";
                }
            } else{
                for(x=0; x<$scope.articulosGuardados.length; x++){
                    $scope.articulosGuardados[x].seleccionado=true;
                    $scope.articulosGuardados[x].fondo="#dbe8ff";
                }
            }
        }

        $scope.eliminarSeleccionados = function(){
            
            var articuloPopup = $ionicPopup.confirm({
                title:'¿Desea eliminar los productos de la lista de inventario?', 
                template: '<p style="text-align: center;">Una vez eliminado no se podrá recuperar</p>',
                cancelText: 'Cancelar',
                okText: 'Confirmar',
                okType: 'button-confirmar',
                cancelType: 'button-cancelar'
            });
            IonicClosePopupService.register(articuloPopup);

            articuloPopup.then(function(res){
                if(res){
                    //Líneas de código para eliminar artículo
                    var lista="";
                    var respaldo=[];

                    var articulosSeleccionados=$scope.articulosGuardados.filter(x => x.seleccionado==true);
                    console.log(articulosSeleccionados);

                    articulosSeleccionados.forEach(function(articulo){
                        lista=lista + articulo.idDetalle_Inventario +",";
                        $scope.articulosGuardados.splice($scope.articulosGuardados.indexOf(articulo),1);
                    });

                    /*for(x=0; x<$scope.articulosGuardados.length;  x++){
                        if($scope.articulosGuardados[x].seleccionado==true)
                            lista=lista + $scope.articulosGuardados[x].idDetalle_Inventario +",";
                        else     
                            respaldo.push($scope.articulosGuardados[x]);
                    }

                    $scope.articulosGuardados=respaldo;*/

                    //Quita la última coma de la lista de articulos a eliminar
                    if(lista.length>0)  lista=lista.substr(0,lista.length-1);
                    console.log(lista);

                    //Ejecuta la query de eliminación de la bd
                    var querysql = 'DELETE FROM detalle_inventario WHERE idDetalle_Inventario IN ('+lista+')'
                    $cordovaSQLite.execute(db, querysql);

                    //Reasigna números a la lista de artículos
                    var x=1;
                    $scope.articulosGuardados.forEach(function(producto) {
                        producto.Numero=x;
                        x++;
                    });

                }else{ return; }
            });
        }

        $scope.mBarraBuscar=false;
        $scope.AbrirBusqueda=function(){
            console.log("Funcion de barra");
            if($scope.mBarraBuscar==false) {
                $scope.mBarraBuscar=true;
                $rootScope.separadorBarra="100px";
            } else{
                $scope.mBarraBuscar=false;
                $rootScope.separadorBarra="50px";
            } 
        }

        $scope.volverInicio=function(){
            $state.go('main');
        }

          

        /*$scope.AgregarProducto = function(){
            //Lineas de código para agregar un producto

        }*/
	}
);