app.controller('DatosInventarioController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,$ionicModal) {
    $scope.data = {};
	$scope.Articulo={};
	
	$scope.$on('modal.shown', function() {
		console.log('Modal is shown!');
		$scope.Inicio();
	});
 
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
			//document.getElementById("Carta").style.height="900px";
			$rootScope.ModalAlmacenes.show();
		}
	}

	// Manda llamar el modal de datos generales
	$ionicModal.fromTemplateUrl('views/almacenes.html', function(modal){
		$rootScope.ModalAlmacenes = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'AlmacenesController'
	});
});