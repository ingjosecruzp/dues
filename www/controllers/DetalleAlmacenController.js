app.controller('DetalleAlmacenController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
    $scope.Articulo={};
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;

		articulo.query({method:'getDatosInventario',itemCode: $scope.Articulo.ItemCode},function(respuesta){
			$scope.datosInventario=respuesta.data[0];
			
		},function(error){
				console.log(error);
		});
	 }
	 
	 
	 $scope.LargoCarta=function(tipo){
		
				 if(tipo=='listaalmacenes'){
					document.getElementById("Carta").style.height="900px";
				console.log("Entre a lista almacenes");
				 }
			 }
});