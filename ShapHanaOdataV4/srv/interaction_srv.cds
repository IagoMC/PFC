using { ShaHanaOdataV4 as db } from '../db/interactions';

service CatalogService@(path:'/CatalogService') {

    entity Conductor as projection on db.Conductor
    entity Vehiculo as projection on db.Vehiculo
    entity Envios as projection on db.Envios;
    entity Muebles as projection on db.Muebles
    entity PaquetesMuebles as projection on db.PaquetesMuebles;    
}