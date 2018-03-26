app.factory('inventarios', function ($resource,resourceInterceptor,Variables) {
	return $resource('http://'+ Variables.IpServidor+'/WSInventario.svc/inventarios/:item',{item: "@item"},
										{
											'get':    {method:'GET',interceptor: resourceInterceptor},
											'save':   {method:'POST',interceptor: resourceInterceptor},
											'query':  {method:'GET', isArray:true,interceptor: resourceInterceptor,url:'http://'+ Variables.IpServidor+'/WSInventario.svc/inventario?method=:method',param:{method:"@method"}},
											'remove': {method:'DELETE',interceptor: resourceInterceptor},
											'delete': {method:'DELETE',interceptor: resourceInterceptor}
										}
									);
});