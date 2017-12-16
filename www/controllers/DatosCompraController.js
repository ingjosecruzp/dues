app.controller('DatosCompraController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
    $scope.Articulo={};
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;
	 }
});