app.controller('DetalleAlmacenController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
	$scope.Articulo={};
	
	$scope.$on('modal.shown', function() {
		console.log('Modal is shown!');
		$scope.Inicio();
	});
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;

		articulo.query({method:'getDetalleAlmacen',itemCode: $scope.Articulo.ItemCode, whsCode: $scope.Articulo.whsCode},function(respuesta){
			$scope.datosInventario=respuesta.data[0];
			
		},function(error){
				console.log(error);
		});
		
	 }
	 
});