app.controller('AlmacenesController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope) {
    $scope.data = {};
    $scope.Articulo={};
 
	$scope.Inicio=function(){
		$scope.listaAlmacenes=[];
		$scope.Articulo=$rootScope.articulo;

		articulo.query({method:'getListaAlmacenes'},function(respuesta){
			respuesta.data.forEach(function(almacen){
				$scope.listaAlmacenes.push(almacen);
			});
			
		},function(error){
				console.log(error);
		});
	 }
	 $scope.LargoCarta=function(tipo, whsCode){
		
				 if(tipo=='detallealmacen'){
					document.getElementById("Carta").style.height="1000px";
				console.log("Entre a lista almacenes");
				 }
				 console.log(whsCode);
				 $rootScope.articulo.whsCode=whsCode;
			 }
});