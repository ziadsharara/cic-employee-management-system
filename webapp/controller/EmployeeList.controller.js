sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("cic.cictrial.controller.EmployeeList", {
        onInit: function() {
            // Mock Data
            var oData = {
                employees: [
                    { id: "E001", name: "John Doe", department: "Sales" },
                    { id: "E002", name: "Jane Smith", department: "HR" },
                    { id: "E003", name: "Ali Hassan", department: "IT" },
                    { id: "E004", name: "Fady Akram", department: "Fiori" },
                ]
            };

            // Create Model
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        onItemPress: function(oEvent) {
            var sEmployeeId = oEvent.getSource().getBindingContext().getProperty("id");
            this.getOwnerComponent().getRouter().navTo("EmployeeDetail", {
                EmployeeID: sEmployeeId
            });
        },

        onAddEmployee: function() {
            this.getOwnerComponent().getRouter().navTo("EmployeeCreate");
        }
    });
});
