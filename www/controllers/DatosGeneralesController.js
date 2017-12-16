app.controller('DatosGeneralesController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
	$scope.Articulo={};
	$scope.CheckSujetoImpuetos;
	$scope.CheckArtInventario;
	$scope.CheckArtVenta;
	$scope.CheckArtCompra;
	$scope.CheckArtLinea;
	$scope.EstadoActivo;
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;
		
		$scope.CheckSujetoImpuetos=$scope.Articulo.VATLiable=="Y" ? true : false;
		$scope.CheckArtInventario=$scope.Articulo.InvntItem=="Y" ? true : false;
		$scope.CheckArtVenta=$scope.Articulo.SellItem=="Y" ? true : false;
		$scope.CheckArtCompra=$scope.Articulo.PrchseItem=="Y" ? true : false;
		$scope.CheckArtLinea=$scope.Articulo.U_ItemDeLinea=="Y" ? true : false;
		$scope.EstadoActivo=$scope.Articulo.validFor=="Y" ? true : false;
	 }
});