app.controller('BuscarArticuloController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,articulo,$ionicLoading,$ionicScrollDelegate) {
    $scope.data = {};
	$scope.Articulos=[];
	$scope.InfiniteScroll=false;
	//Variables temporal para guardar la busqueda acutal y poder comparar
	$scope.$searchQueryTemp; 
	//$scope.searchQuery="dsadsa";
 
	$scope.IniciarBusqueda=function(searchQuery){
		//Verficio si se inicio una busqueda nueva
		$scope.InfiniteScroll=true;
		$scope.searchQueryTemp=searchQuery;
		$scope.Articulos=[];
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
	$scope.Buscar=function(searchQuery){
		if(searchQuery.length < 3)
				return;

		articulo.query({method:'getArticulos',Nombre: searchQuery,Index: $scope.Articulos.length},function(respuesta){
				if(respuesta.data.length==0)
					$scope.InfiniteScroll=false;

				respuesta.data.forEach(function(articulo) {
					$scope.Articulos.push(articulo);
				});
				$ionicScrollDelegate.resize() 
				$scope.$broadcast('scroll.infiniteScrollComplete');
			},function(error){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: error.headers("Error")
				});
   		});
	 }
	 $scope.moreDataCanBeLoaded=function(){
		 return $scope.InfiniteScroll;
	 }
	 $scope.select_item = function (articulo) {
		console.log(articulo);
		$rootScope.articulo=articulo
		$state.go('articulo.menuarticulo');
	  }
});