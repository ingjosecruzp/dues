app.controller('AlmacenesController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,$ionicLoading,$ionicModal) {
    $scope.data = {};
	$scope.Articulo={};
	
	$scope.$on('modal.shown', function() {
		console.log('Modal is shown!');
		$scope.Inicio();
	});
 
	$scope.Inicio=function(){
		$scope.listaAlmacenes=[];
		$scope.Articulo=$rootScope.articulo;

		$ionicLoading.show();

		articulo.query({method:'getListaAlmacenes'},function(respuesta){
			respuesta.data.forEach(function(almacen){
				$scope.listaAlmacenes.push(almacen);
			});

			$ionicLoading.hide();
			
		},function(error){
				console.log(error);
		});
	}
	 
	$scope.LargoCarta=function(tipo, whsCode){
		if(tipo=='detallealmacen'){
			$rootScope.articulo.whsCode=whsCode;
			//document.getElementById("Carta").style.height="1000px";
			$rootScope.ModalDetalleAlmacen.show();
		}
	}

	// Manda llamar el modal de datos generales
	$ionicModal.fromTemplateUrl('views/detallealmacen.html', function(modal){
		$rootScope.ModalDetalleAlmacen = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'DetalleAlmacenController'
	});
});