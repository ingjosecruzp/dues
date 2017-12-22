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
});