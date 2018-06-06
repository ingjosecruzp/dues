app.controller('MainController', function($scope,Usuario,$ionicPopup,$state,$ionicPlatform,$ionicPopup,articulo,$rootScope,$ionicLoading) {
    $scope.data = {};
	$scope.Login={};
	$scope.Articulo={};
	$rootScope.activarEscaner=true;

	$scope.Opciones = function(){
		var articuloPopup = $ionicPopup.confirm({
			title: '¿Cómo desea realizar la consulta?',
			cancelText: 'Escanear código',
			okText: 'Buscar producto',
			okType: 'button-capturar',
			cancelType: 'button-dark'
		});

		articuloPopup.then(function(res){
			if(res){
				$scope.BtnBuscarArticulo();
			}else{
				//Líneas de código para Escanear código
				if($rootScope.activarEscaner==false){
					console.log("Si entre");
					$rootScope.activarEscaner=true;
					return;
				}
				$scope.Escanear();
			}});
	}
 
    $scope.Escanear = function() {
        try{
			//$state.go('articulo',{ barcode: 'DT-01-5315' });
			//articulo.query({codigo:$stateParams.barcode},function(respuesta){
			/*var vari=articulo.query({method:'getXCodigo',codigo:'DT-01-5315'},function(respuesta){
				$ionicLoading.hide();
				$scope.Articulo=respuesta.data[0];
				$rootScope.articulo=$scope.Articulo

				$state.go('articulo.menuarticulo');
				
		   },function(error){
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: error.headers("Error")
				});
		   });*/
	       $ionicPlatform.ready(function () {
			cordova.plugins.barcodeScanner
					.scan(function(barcodeData) {
						if(barcodeData.cancelled==true){
							$scope.ModalAgregarProducto.hide();
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
								$scope.Articulo=respuesta.data[0];
				   
								$rootScope.articulo=$scope.Articulo
								console.log($rootScope.articulo);
				   
								$state.go('articulo.menuarticulo');
								
						   },function(error){
								$ionicLoading.hide();
								var alertPopup = $ionicPopup.alert({
									title: 'Error',
									template: error.headers("Error")
								});
						   });}
					}, function(error) {
						// An error occurred
							var alertPopup = $ionicPopup.alert({
								title: 'Errorrr',
								template: error
							});
					},{orientation : "portrait", showTorchButton: true});
	        });
        }
        catch(err){
            console.log(err);
        }
	}

	$scope.BtnBuscarArticulo=function(){
		$state.go('buscararticulo');
	}

	$scope.BtnTomaInventario=function(){
		$state.go('inventario');
	}
});