app.controller('DatosCompraController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
	$scope.Articulo={};
	
	$scope.$on('modal.shown', function() {
		console.log('Modal datosCompra');
		$scope.Inicio();
	});
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;
		console.log("Entre");
		articulo.query({method:'getNombreProveedor',codigoProveedor: $scope.Articulo.CardCode},function(respuesta){
			$scope.Articulo.CardName=respuesta.data[0].CardName;
			console.log(respuesta);

		},function(error){
			 console.log(error);
		});
	 }
});