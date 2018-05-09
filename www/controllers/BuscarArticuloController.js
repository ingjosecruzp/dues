app.controller('BuscarArticuloController', function($scope,Usuario,articulo,$ionicPopup,$state,$stateParams,$rootScope,articulo,$ionicLoading,$ionicScrollDelegate) {
	$scope.opcionBusqueda="codigo";
	$scope.data = {};
	$scope.Articulos=[];
	$scope.InfiniteScroll=false;
	//Variables temporal para guardar la busqueda acutal y poder comparar
	$scope.$searchQueryTemp; 
	//$scope.searchQuery="dsadsa";
 
	$scope.IniciarBusqueda=function(searchQuery){
		//Verficio si se inicio una busqueda nueva
		console.log("Buscando...");
		$scope.InfiniteScroll=true;
		$scope.searchQueryTemp=searchQuery;
		$scope.Articulos=[];
		$scope.$broadcast('scroll.infiniteScrollComplete');

		var divteclado = angular.element( document.getElementById('divteclado') );

		divteclado.removeClass('mostrar');
		divteclado.addClass('oculto');
	}
	$scope.Buscar=function(searchQuery){
		if(searchQuery.length < 3)
				return;

		var tipoBusqueda;
		if($scope.opcionBusqueda=="codigo")	tipoBusqueda=1;	//Tipo 1 busca por itemCode
		else if($scope.opcionBusqueda=="descripcion") tipoBusqueda=0;	//Tipo 0 busca por itemName

		console.log("Buscando por: "+tipoBusqueda);

		articulo.query({method:'getArticulos',Nombre: searchQuery,Index: $scope.Articulos.length, Tipo: tipoBusqueda},function(respuesta){
				if(respuesta.data.length==0){
					$scope.InfiniteScroll=false;
					console.log("No se encontraron articulos");
					var divnoencontrado = angular.element( document.getElementById('divnoencontrado') );
					divnoencontrado.removeClass('oculto');
					divnoencontrado.addClass('mostrar');
				} else{
					console.log("Si se encontraron");
					var divnoencontrado = angular.element( document.getElementById('divnoencontrado') );
					divnoencontrado.removeClass('mostrar');
					divnoencontrado.addClass('oculto');
				}

				respuesta.data.forEach(function(articulo) {
					$scope.Articulos.push(articulo);
				});
				$ionicScrollDelegate.resize() 
				$scope.$broadcast('scroll.infiniteScrollComplete');

				if($scope.Articulos.length>0){
					divnoencontrado.removeClass('mostrar');
					divnoencontrado.addClass('oculto');
				}
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


	  //Mi función para rellenar el modal de agregar producto
	  $scope.agregarModal = function(producto){
		//OBTENCIÓN DE FECHA Y HORA
		var fecha = new Date();
		var dd = fecha.getDate();
		var mm = fecha.getMonth()+1;//January is 0, so always add + 1
		var yyyy = fecha.getFullYear();
		var hh =fecha.getHours();
		var min = fecha.getMinutes();
		if(dd<10){dd='0'+dd}
		if(mm<10){mm='0'+mm}
		if(hh<10){hh='0'+hh}
		if(min<10){min='0'+min}
		fecha = yyyy+'-'+mm+'-'+dd+' '+hh+':'+min;
		
		console.log("Fecha: "+fecha);

		//ASIGNACIÓN DE VALORES PARA MEMBER
		$rootScope.member={};
		$rootScope.member.idDetalle_Inventario = null;
		$rootScope.member.ItemCode = producto.ItemCode;
		$rootScope.member.ItemName = producto.ItemName;
		$rootScope.member.Codebars = producto.CodeBars;
		$rootScope.member.Cantidad = null;
		$rootScope.member.NombreLote = null;
		$rootScope.member.PicturName = producto.PicturName;
		$rootScope.member.FechaHora = fecha;
		$rootScope.member.InventarioId = 1; 

		//OBTENCIÓN DE LA IMÁGEN DEL ARTÍCULO
		$rootScope.member.ImagenBase64="img/loading.gif";
		
		if($rootScope.member.PicturName==undefined){
			$rootScope.member.ImagenBase64="img/camera.png";
		}

		articulo.query({method:'getImagen',Imagen:$rootScope.member.PicturName},function(respuesta){
				console.log(respuesta);
				$rootScope.member.ImagenBase64="data:image/png;base64," + respuesta.data[0];
			},function(error){
				console.log(error);
				/*
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: error.headers("Error")
			});*/
		});

		console.log("Se agregó el articulo buscado por nombre");
		$scope.searchQuery=null;
		var divteclado = angular.element( document.getElementById('divteclado') );
		var divnoencontrado = angular.element( document.getElementById('divnoencontrado') );
		divteclado.removeClass('oculto');
		divteclado.addClass('mostrar');
		divnoencontrado.removeClass('mostrar');
		divnoencontrado.addClass('oculto');
		$scope.Articulos=[];

		$rootScope.ModalBuscarProducto.hide();
		$rootScope.ModalAgregarProducto.show();
	  }
});