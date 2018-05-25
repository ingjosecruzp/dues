app.controller('DetalleAlmacenController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
    $scope.Articulo={};
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;

		articulo.query({method:'getDetalleAlmacen',itemCode: $scope.Articulo.ItemCode, whsCode: $scope.Articulo.whsCode},function(respuesta){
			$scope.datosInventario=respuesta.data[0];
			
		},function(error){
				console.log(error);
		});
		
	 }
	 
});