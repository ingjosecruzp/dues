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
			console.log("DATOS DE COMPRA---------------------------");
			console.log($scope.Articulo);

			//Petición para obtener el nombre de la lista del artículo
			articulo.get({method:'getListName',CardCode: $scope.Articulo.CardCode},function(respuesta){
				$scope.Articulo.ListName=respuesta.data;
				console.log("Este es el ListName: ");
				console.log($scope.Articulo.ListName);
	
			},function(error){
				 console.log(error);
			});

		},function(error){
			 console.log(error);
		});
	 }
});