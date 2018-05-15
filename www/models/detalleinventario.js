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
      var parameters = [member.idDetalle_Inventario,member.ItemCode,member.ItemName,member.Codebars,member.Cantidad,member.NombreLote,member.PicturName,member.FechaHora,member.InventarioId];
      return DBA.query("INSERT INTO detalle_inventario (idDetalle_Inventario,ItemCode,ItemName,Codebars,Cantidad,NombreLote,PicturName,FechaHora,InventarioId) VALUES (?,?,?,?,?,?,?,?,?)", parameters);
    }
  
    self.remove = function(member) {
      console.log("Eliminando de db");
      console.log(member);
      var parameters = [member.idDetalle_Inventario];
      return DBA.query("DELETE FROM detalle_inventario WHERE idDetalle_Inventario = (?)", parameters);
    }

    self.removeMany = function(lista) {
      console.log("Eliminando de db");
      
     // var parameters = [lista];
      var parameters = ["4,5,6"];
      console.log(parameters);
      return DBA.query("DELETE FROM detalle_inventario WHERE idDetalle_Inventario IN (?)", parameters);
    }
  
    self.update = function(origMember, editMember) {
      var parameters = [editMember.ItemCode,editMember.ItemName,editMember.Codebars,editMember.Cantidad,editMember.NombreLote,editMember.PicturName,editMember.FechaHora,editMember.InventarioId, origMember.idDetalle_Inventario];
      return DBA.query("UPDATE detalle_inventario SET ItemCode = (?), ItemName = (?), Codebars = (?), Cantidad = (?), NombreLote = (?), PicturName = (?), FechaHora = (?), InventarioId = (?) WHERE idDetalle_Inventario = (?)", parameters);
    }
  
    return self;
  });