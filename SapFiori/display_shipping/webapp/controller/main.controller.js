sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

],

    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("displayshipping.controller.main", {

            onInit: function () {


            },

            onViewDeliveredShipmentsPress: function () {
                // Obtiene la referencia a la tabla de envíos de la vista actual
                var oTable = this.getView().byId("shipping_table");

                // Obtiene la referencia al enlace de datos de la tabla
                var oBinding = oTable.getBinding("items");

                // Aplica un filtro al enlace de datos para mostrar solo los envíos entregados
                oBinding.filter([new Filter("Entregado", FilterOperator.EQ, true)]);


            },

            onViewShipmentsNotDelivered: function () {
                // Obtiene la referencia a la tabla de envíos de la vista actual
                var oTable = this.getView().byId("shipping_table");
                // Obtiene la referencia al enlace de datos de la tabla
                var oBinding = oTable.getBinding("items");
                // Aplica un filtro al enlace de datos para mostrar solo los envíos no entregados
                oBinding.filter([new Filter("Entregado", FilterOperator.EQ, false)]);

            },



            onSearch: function () {

                // Obtiene la referencia a la vista actual

                var oView = this.getView();
                // Obtiene el valor del campo de búsqueda

                var sValue = oView.byId("searchField").getValue();
                // Crea un filtro basado en el valor del campo de búsqueda

                var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sValue);
                // Obtiene la referencia a la tabla de envíos de la vista actual

                var oTable = oView.byId("shipping_table");
                // Obtiene el enlace de datos de la tabla

                var oBinding = oTable.getBinding("items");
                // Aplica el filtro al enlace de datos utilizando el tipo de filtro de aplicación

                oBinding.filter([oFilter], sap.ui.model.FilterType.Application);
                // Adjunta un evento "dataReceived" al enlace de datos para manejar la respuesta una vez recibidos los datos

                oBinding.attachEventOnce("dataReceived", function () {
                    // Obtiene los elementos actuales del enlace de datos

                    var aItems = oBinding.getCurrentContexts();

                    // Si no se encontraron elementos, muestra un mensaje de que no se encontraron envíos

                    if (aItems.length === 0) {
                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                        var sMessage = oResourceBundle.getText("noShipmentsFound");
                        sap.m.MessageToast.show(sMessage);
                    }
                }.bind(this));
            },

            onInsertDialogClose: function () {
                // Restablece el valor del campo de entrada "inputId" a vacío

                this.byId("inputId").setValue("");
            },

            onOpenDialogPress: function () {
                // Obtiene la referencia al diálogo de inserción

                var oDialog = this.byId("insertDialog");
                // Abre el diálogo de inserción

                oDialog.open();
            },

            onInsertDialogCancel: function () {


                // Cierra el diálogo de inserción
                this.byId("insertDialog").close();
            },



            onInsertDialogConfirm: function () {
                var sId = this.byId("inputId").getValue();
                var oModel = this.getView().getModel();

                if (oModel && sId) {
                    var sPath = "/Envios('" + sId + "')";

                    oModel.read(sPath, {
                        success: function (oData) {
                            var oEnvio = oData;

                            if (oEnvio) {
                                if (oEnvio.Entregado === true) {
                                    sap.m.MessageToast.show("El envío ya está marcado como entregado.");
                                } else {
                                    oEnvio.Entregado = true;
                                    oModel.update(sPath, oEnvio, {
                                        success: function () {
                                            sap.m.MessageToast.show("El envío se ha marcado como entregado correctamente.");
                                            var sIdConductor = oEnvio.idConductor;

                                            if (sIdConductor) {
                                                var sConductorPath = "/Conductor('" + sIdConductor + "')";

                                                oModel.read(sConductorPath, {
                                                    success: function (oData) {
                                                        var oConductor = oData;

                                                        if (oConductor) {
                                                            oConductor.Ocupado = false;
                                                            oModel.update(sConductorPath, oConductor, {
                                                                success: function () {
                                                                    sap.m.MessageToast.show("El estado del conductor ha sido actualizado correctamente.");
                                                                },
                                                                error: function () {
                                                                    sap.m.MessageToast.show("Error al actualizar el estado del conductor.");
                                                                }
                                                            });
                                                        } else {
                                                            sap.m.MessageToast.show("No se ha encontrado un conductor con el ID especificado.");
                                                        }
                                                    },
                                                    error: function () {
                                                        sap.m.MessageToast.show("Error al leer el conductor.");
                                                    }
                                                });
                                            }

                                            var sMatricula = oEnvio.Matricula;

                                            if (sMatricula) {
                                                var sVehiculoPath = "/Vehiculos('" + sMatricula + "')";

                                                oModel.read(sVehiculoPath, {
                                                    success: function (oData) {
                                                        var oVehiculo = oData;

                                                        if (oVehiculo) {
                                                            oVehiculo.Ocupado = false;
                                                            oModel.update(sVehiculoPath, oVehiculo, {
                                                                success: function () {
                                                                    sap.m.MessageToast.show("El estado del vehículo ha sido actualizado correctamente.");
                                                                },
                                                                error: function () {
                                                                    sap.m.MessageToast.show("Error al actualizar el estado del vehículo.");
                                                                }
                                                            });
                                                        } else {
                                                            sap.m.MessageToast.show("No se ha encontrado un vehículo con la matrícula especificada.");
                                                        }
                                                    },
                                                    error: function () {
                                                        sap.m.MessageToast.show("Error al leer el vehículo.");
                                                    }
                                                });
                                            }
                                        },
                                        error: function () {
                                            sap.m.MessageToast.show("Error al actualizar el envío.");
                                        }
                                    });
                                }
                            } else {
                                sap.m.MessageToast.show("No se ha encontrado un envío con el ID especificado.");
                            }
                        },
                        error: function (error) {
                            sap.m.MessageToast.show("Error al leer el envío.");
                            console.error("Error al leer el envío:", error);
                        }
                    });
                }
            }

        });
    });
