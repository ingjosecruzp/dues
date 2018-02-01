app.controller('ArticuloMenuController', function($scope,Usuario,articulo,$ionicPopup,$state,$rootScope) {
    $scope.data = {};
    $scope.Articulo={};
 
    $scope.BtnVenta=function(){
      console.log($rootScope.articulo);
      alert("le di click");
	  }
});