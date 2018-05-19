app.controller('ArticuloController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,articulo) {
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
		 console.log("PRueba");

		 if(tipo=='datosGenerales'){
			document.getElementById("Carta").style.height="850px";
		 }
		 else if(tipo=='datosVenta'){
			document.getElementById("Carta").style.height="1100px";
		 }
		 else if(tipo=='datosCompra'){
			document.getElementById("Carta").style.height="700px";
		 }
		 else if(tipo=='datosInventario'){
			document.getElementById("Carta").style.height="500px";
		 }
		 else if(tipo=='listaPrecios'){
			document.getElementById("Carta").style.height="900px";
			console.log("1200px");
		 }

	 }
});