app.controller('ArticuloController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,articulo) {
    $scope.data = {};
	$scope.Articulo={};
	$scope.Largo=490;
 
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
			 $scope.Largo= 850;
		 }
		 else if(tipo=='datosVenta'){
			 $scope.Largo= 1100;
		 }
		 else if(tipo=='datosCompra'){
			 $scope.Largo= 700;
		 }
		 else if(tipo=='listaPrecios'){
			 console.log('entre a lista de precios');
			$scope.Largo= 1100;
		 }
	 }
});