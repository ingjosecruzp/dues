app.factory('detalleinventario', function($cordovaSQLite, DBA) {
    var self = this;
  
    self.all = function() {
      return DBA.query("SELECT * FROM detalle_inventario")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT * FROM detalle_inventario WHERE idDetalle_Inventario = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }
  
    self.add = function(member) {
      var parameters = [member.id,member.nombre,member.ruta,member.width,member.height,member.codigo];
      return DBA.query("INSERT INTO detalle_inventario (idDetalle_Inventario,ItemCode,ItemName,Codebars,Cantidad,NombreLote,PicturName,FechaHora,InventarioId) VALUES (?,?,?,?,?,?,?,?,?)", parameters);
    }
  
    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM detalle_inventario WHERE idDetalle_Inventario = (?)", parameters);
    }
  
    self.update = function(origMember, editMember) {
      var parameters = [editMember.idDetalle_Inventario,editMember.ItemCode,editMember.ItemName,editMember.Codebars,editMember.Cantidad,editMember.NombreLote,editMember.PicturName,editMember.FechaHora,editMember.InventarioId, origMember.InventarioId];
      return DBA.query("UPDATE detalle_inventario SET idDetalle_Inventario = (?), ItemCode = (?), ItemName = (?), Codebars = (?), Cantidad = (?), NombreLote = (?), PicturName = (?), FechaHora = (?), InventarioId = (?) WHERE idDetalle_Inventario = (?)", parameters);
    }
  
    return self;
  });