app.controller('MainController', function($scope,Usuario,$ionicPopup,$state,$ionicPlatform,$cordovaBarcodeScanner,$ionicPopup,articulo,$rootScope,$ionicLoading) {
    $scope.data = {};
    $scope.Login={};
 
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
				   
								$state.go('articulo.menuarticulo');
								
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
	$scope.BtnBuscarArticulo=function(){
		$state.go('buscararticulo');
	}
});