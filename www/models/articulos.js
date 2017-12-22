app.factory('articulo', function ($resource,resourceInterceptor,Variables) {
	return $resource('http://'+ Variables.IpServidor+'/WSArticulos.svc/articulos/:item',{item: "@item"},
										{
											'get':    {method:'GET',interceptor: resourceInterceptor},
											'save':   {method:'POST',interceptor: resourceInterceptor},
											'query':  {method:'GET', isArray:true,interceptor: resourceInterceptor,url:'http://'+ Variables.IpServidor+'/WSArticulos.svc/articulos?method=:method',param:{method:"@method"}},
											'remove': {method:'DELETE',interceptor: resourceInterceptor},
											'delete': {method:'DELETE',interceptor: resourceInterceptor}
										}
									);
});