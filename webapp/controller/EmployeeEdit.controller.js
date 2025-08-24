sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
  ],
  function (Controller, JSONModel, MessageToast, MessageBox) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeEdit', {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute('EmployeeEdit')
          .attachPatternMatched(this._onObjectMatched, this);
      },

      /**
       * Load employee data based on route parameter
       */
      _onObjectMatched: function (oEvent) {
        var sEmployeeId = oEvent.getParameter('arguments').EmployeeID;
        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees') || [];

        var oEmployee = aEmployees.find(function (emp) {
          return emp.id === sEmployeeId;
        });

        if (oEmployee) {
          var oEditModel = new JSONModel({
            id: oEmployee.id,
            name: oEmployee.name,
            department: oEmployee.department,
            position: oEmployee.position || '',
            email: oEmployee.email || '',
            hasValidationErrors: false,
            validationMessage: '',
          });
          this.getView().setModel(oEditModel, 'edit');
        } else {
          MessageToast.show('Employee not found');
          this.onNavBack();
        }
      },

      /**
       * Validate form
       */
      _validateForm: function () {
        var oModel = this.getView().getModel('edit');
        var oData = oModel.getData();
        var bIsValid = true;
        var aErrors = [];

        if (!oData.name || oData.name.trim() === '') {
          aErrors.push('Full Name is required');
          bIsValid = false;
        }
        if (!oData.department || oData.department === '') {
          aErrors.push('Department selection is required');
          bIsValid = false;
        }

        oData.hasValidationErrors = !bIsValid;
        oData.validationMessage = bIsValid
          ? ''
          : 'Please fix: ' + aErrors.join(', ');
        oModel.refresh();
        return bIsValid;
      },

      onInputChange: function () {
        this._validateForm();
      },

      /**
       * Save updated employee
       */
      onSave: function () {
        if (!this._validateForm()) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        var oEditModel = this.getView().getModel('edit');
        var oData = oEditModel.getData();

        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees') || [];

        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === oData.id;
        });

        if (iIndex !== -1) {
          aEmployees[iIndex] = {
            id: oData.id,
            name: oData.name.trim(),
            department: oData.department,
            position: oData.position ? oData.position.trim() : '',
            email: oData.email ? oData.email.trim() : '',
          };

          oMainModel.setProperty('/employees', aEmployees);
          MessageToast.show('Employee updated successfully!');
          this.onNavBack();
        } else {
          MessageBox.error('Employee not found in the list.');
        }
      },

      /**
       * Cancel and navigate back
       */
      onNavBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo('EmployeeList');
      },
    });
  }
);
