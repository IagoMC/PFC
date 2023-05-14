namespace ShaHanaOdataV4;
entity Conductor {
    key id          : String(6);
    Nombre          : String(30);
    Apellidos       : String(30);
    FechaNacimiento : Date;
    Ocupado         : Boolean;
}

entity Vehiculo {
    Key Matricula        : String(7);
    Tipo                 : String(30);
    Modelo               : String(60);
    FechaRevisionITV     : Date;
    Ocupado              : Boolean;
}
entity Envios {
    key id               : String(6);
    FechaSalida          : Date;
    FechaLlegada         : Date;
    Origen               : String(30);
    Destino              : String(30);
    idConductor          : String(6);
    Matricula            : String(7);
    Entregado            : Boolean;
    conductor            : Association to Conductor on idConductor = $self.id;
    vehiculo             : Association to Vehiculo on Matricula = $self.Matricula;
}

entity Muebles {
    key id           : String(6);
    Nombre           : String(50);
    Tipo             : String(50);
    Material         : String(50);
    Dimensiones      : String(50);
    Peso             : String(7);
}


entity PaquetesMuebles {
    key id           : String(6);
    idMueble         : String(6);          
    Nombre           : String(50);
    Tipo             : String(50);
    Material         : String(50);
    Dimensiones      : String(50);
    Peso             : String(7);
    Cantidad         : Integer;
    idEnvio          : String(6);
    envio            : Association to Envios on id = $self.idEnvio;
}