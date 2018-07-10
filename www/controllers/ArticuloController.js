app.controller('ArticuloController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,articulo,$ionicModal) {
    $scope.data = {};
	$scope.Articulo={};
 
	$scope.Inicio=function(){
		$scope.Articulo=$rootScope.articulo;
		$scope.Articulo.ImagenBase64="img/loading.gif";
		
	
		if($scope.Articulo.PicturName==undefined)
		{
			$scope.Articulo.ImagenBase64="img/camera.png";
			return;
		}

		articulo.query({method:'getImagen',Imagen:$scope.Articulo.PicturName},function(respuesta){
					console.log(respuesta);
					$scope.Articulo.ImagenBase64="data:image/png;base64," + respuesta.data[0];
				},function(error){
				var alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: error.headers("Error")
				});
	   	});
	 }
	 
	 $scope.LargoCarta=function(tipo){
		 if(tipo=='datosGenerales'){
			//document.getElementById("Carta").style.height="850px";
			$rootScope.ModalDatosGenerales.show();
		 }
		 else if(tipo=='datosVenta'){
			//document.getElementById("Carta").style.height="1100px";
			$rootScope.ModalDatosVenta.show();
		 }
		 else if(tipo=='datosCompra'){
			//document.getElementById("Carta").style.height="700px";
			$rootScope.ModalDatosCompra.show();
		 }
		 else if(tipo=='datosInventario'){
			//document.getElementById("Carta").style.height="500px";
			$rootScope.ModalDatosInventario.show();
		 }
		 else if(tipo=='listaPrecios'){
			//document.getElementById("Carta").style.height="900px";
			$rootScope.ModalListaPrecios.show();
		 }
	 }
	//Popup para la imagen del articulo
	 $scope.ImagenZoom = function(){
		console.log($scope.Articulo.ImagenBase64);
		var pop = $ionicPopup.alert({
			scope: $scope,
			title: 'Imagen',
			templateUrl: 'ImagenZoom.html'
		});
	}

	 // Manda llamar el modal de datos generales
	 $ionicModal.fromTemplateUrl('views/datosgenerales.html', function(modal){
		$rootScope.ModalDatosGenerales = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'DatosGeneralesController'
	});

	// Manda llamar el modal de datos de venta
	$ionicModal.fromTemplateUrl('views/datosventa.html', function(modal){
		$rootScope.ModalDatosVenta = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'DatosVentaController'
	});

	// Manda llamar el modal de datos de compra
	$ionicModal.fromTemplateUrl('views/datoscompra.html', function(modal){
		$rootScope.ModalDatosCompra = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'DatosCompraController'
	});

	// Manda llamar el modal de datos de inventario
	$ionicModal.fromTemplateUrl('views/datosinventario.html', function(modal){
		$rootScope.ModalDatosInventario = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'DatosInventarioController'
	});

	// Manda llamar el modal de lista de precios
	$ionicModal.fromTemplateUrl('views/listaprecios.html', function(modal){
		$rootScope.ModalListaPrecios = modal;
	}, {
		scope: $rootScope,
		animation: 'slide-in-up',
		controller: 'ListaPreciosController'
	});

	$scope.volverBusqueda = function(){
		$state.go('buscararticulo');
	}
});