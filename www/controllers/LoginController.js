app.controller('LoginController', function($scope,Usuario,$ionicPopup,$state,$http,$ionicLoading) {
    $scope.data = {};
    $scope.Login={};
 
    $scope.Entrar = function() {
        try{
			$ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Validando usuario'
			});
			
	        var acceso = Usuario.query({method:'Login',usuario:$scope.Login.Usuario,password: $scope.Login.Password}, function() {
				$ionicLoading.hide();
				  $state.go('main');
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