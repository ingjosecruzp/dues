app.factory('inventario', function($cordovaSQLite, DBA) {
    var self = this;
  
    self.all = function() {
      return DBA.query("SELECT * FROM inventario")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT * FROM inventario WHERE idInventario = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }
  
    self.add = function(member) {
      var parameters = [member.idInventario,member.FechaInicio,member.UsuarioId,member.UUID,member.Modelo];
      return DBA.query("INSERT INTO inventario (idInventario,FechaInicio,UsuarioId,UUID,Modelo) VALUES (?,?,?,?,?)", parameters);
    }
  
    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM inventario WHERE idInventario = (?)", parameters);
    }
  
    self.update = function(origMember, editMember) {
      var parameters = [editMember.idInventario,editMember.FechaInicio,editMember.UsuarioId,editMember.UUID,editMember.Modelo, origMember.idInventario];
      return DBA.query("UPDATE inventario SET idInventario = (?), FechaInicio = (?), UsuarioId = (?), UUID = (?), Modelo = (?) WHERE idInventario = (?)", parameters);
    }
  
    return self;
  });