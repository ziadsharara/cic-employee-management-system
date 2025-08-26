sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'cic/cictrial/model/models',
  ],
  function (UIComponent, JSONModel, models) {
    'use strict';

    return UIComponent.extend('cic.cictrial.Component', {
      metadata: {
        manifest: 'json',
        interfaces: ['sap.ui.core.IAsyncContentCreation'],
      },

      init: function () {
<<<<<<< HEAD
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), 'device');

        // Create and set the employees data model
        var oEmployees = new JSONModel();
        oEmployees.loadData(
          sap.ui.require.toUrl('cic/cictrial/model/employees.json')
        );
        this.setModel(oEmployees, 'employees');

        // Create and set an empty statistics model
        var oStatistics = new JSONModel({});
        this.setModel(oStatistics, 'statistics');

        // enable routing
=======
        UIComponent.prototype.init.apply(this, arguments);

        // device model
        this.setModel(models.createDeviceModel(), 'device');

        // employees model - FIXED STRUCTURE
        var oEmployeesModel = new JSONModel({
          employees: [], // Make sure the model has an "employees" array property
        });
        this.setModel(oEmployeesModel, 'employees');

        // Load employees data
        try {
          oEmployeesModel.loadData(
            sap.ui.require.toUrl('cic/cictrial/model/employees.json'),
            null,
            false
          );
        } catch (e) {
          console.log(
            'Could not load employees.json, starting with empty model',
            e
          );
        }

        // statistics model
        this.setModel(new JSONModel({}), 'statistics');

        // routing
>>>>>>> master
        this.getRouter().initialize();
      },
    });
  }
);
