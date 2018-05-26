app.controller('ListaPreciosController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
	$scope.Articulo={};
	
	$scope.$on('modal.shown', function() {
		console.log('Modal is shown!');
		$scope.Inicio();
	});
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;

		articulo.query({method:'getPrecios',itemCode: $scope.Articulo.ItemCode},function(respuesta){
			$scope.listaPrecios=[];
			respuesta.data.forEach(function(precio){
				$scope.listaPrecios.push(precio);
			});

			console.log("Lista de precios");
			console.log($scope.listaPrecios);
		},function(error){
			 console.log(error);
		});
	 }

	 
});