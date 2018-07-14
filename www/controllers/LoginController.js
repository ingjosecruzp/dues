app.controller('LoginController', function($scope,$rootScope,Usuario,$ionicPopup,$state,$http,$ionicLoading) {
    $scope.data = {};
    $scope.Login={};
 
    $scope.Entrar = function() {
        try{
			$ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Validando usuario'
			});
			
	        var acceso = Usuario.query({method:'Login',usuario:$scope.Login.Usuario,password: $scope.Login.Password}, function() {
				
				//Petición para obtener el id del usuario
				Usuario.get({method:'getId',usuario:$scope.Login.Usuario,password: $scope.Login.Password}, function(response) {
					$rootScope.idUsuario=response.data;
					console.log("El id es: "+$rootScope.idUsuario);
				}, function(error) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Error',
						template: error.headers("Error")
					});
				});

				//Petición para obtener el tipo del usuario
				Usuario.get({method:'getTipo',usuario:$scope.Login.Usuario,password: $scope.Login.Password}, function(response) {
					$rootScope.tipoUsuario=response.data;
					console.log("El tipo es es: "+$rootScope.tipoUsuario);

					if($rootScope.tipoUsuario==1) $rootScope.isAdmin=true;
					else  $rootScope.isAdmin=false;

					$ionicLoading.hide();
					$state.go('main');
				}, function(error) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Error',
						template: error.headers("Error")
					});
				});
			}, function(error) {
				$ionicLoading.hide();
    			var alertPopup = $ionicPopup.alert({
                	title: 'Error',
                	template: error.headers("Error")
            	});
			});
    	}
    	catch(err){
    		console.log(err);
    	}
	}
	
});