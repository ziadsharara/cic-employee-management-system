sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
  ],
  function (Controller, JSONModel, MessageToast, History) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeCreate', {
      onInit: function () {
        this._initializeFormModel();
      },

      _initializeFormModel: function () {
        var oFormData = {
          id: '',
          name: '',
          department: '',
          position: '',
          email: '',
        };

        this.getView().setModel(new JSONModel(oFormData), 'form');
      },

      /**
       * Handle live change / change for Inputs and Select
       */
      onInputChange: function (oEvent) {
        var oSource = oEvent.getSource();
        var sId = oSource.getId();
        var sValue;

        // For inputs and text-like controls
        if (
          typeof oEvent.getParameter === 'function' &&
          oEvent.getParameter('value') !== undefined
        ) {
          sValue = oEvent.getParameter('value');
        } else {
          // For Select, use selectedKey (safe fallback)
          if (typeof oSource.getSelectedKey === 'function') {
            sValue = oSource.getSelectedKey();
          } else {
            sValue = '';
          }
        }

        // Validation by control id
        if (sId.indexOf('employeeIdInput') !== -1) {
          if (!sValue) {
            oSource.setValueState('Error');
            oSource.setValueStateText('Employee ID is required');
          } else {
            oSource.setValueState('None');
          }
        } else if (sId.indexOf('employeeNameInput') !== -1) {
          if (!sValue) {
            oSource.setValueState('Error');
            oSource.setValueStateText('Employee name is required');
          } else {
            oSource.setValueState('None');
          }
        } else if (sId.indexOf('emailInput') !== -1) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(sValue)) {
            oSource.setValueState('Error');
            oSource.setValueStateText('Please enter a valid email');
          } else {
            oSource.setValueState('None');
          }
        } else if (sId.indexOf('departmentSelect') !== -1) {
          // For department select, mark None when a key selected, Error otherwise
          if (!sValue) {
            oSource.setValueState('Error');
            oSource.setValueStateText('Please select a department');
          } else {
            oSource.setValueState('None');
          }
        } else {
          // default
          if (typeof oSource.setValueState === 'function') {
            oSource.setValueState('None');
          }
        }
      },

      onSave: function () {
        console.log('Save button clicked!');

        var oFormModel = this.getView().getModel('form');
        if (!oFormModel) {
          console.error('Form model not found');
          MessageToast.show('Form model not found');
          return;
        }

        var oFormData = oFormModel.getData();
        console.log('Form data:', oFormData);

        var oEmployeesModel = this.getOwnerComponent().getModel('employees');
        if (!oEmployeesModel) {
          console.error('Employees model not found');
          MessageToast.show('Employees model not found. Check Component.js');
          return;
        }

        // Validate input data
        if (!oFormData.id || oFormData.id.trim() === '') {
          MessageToast.show('Employee ID is required');
          return;
        }
        if (!oFormData.name || oFormData.name.trim() === '') {
          MessageToast.show('Employee name is required');
          return;
        }
        if (!oFormData.department || oFormData.department.trim() === '') {
          MessageToast.show('Please select a department');
          return;
        }
        if (!oFormData.email || oFormData.email.trim() === '') {
          MessageToast.show('Email is required');
          return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(oFormData.email)) {
          MessageToast.show('Please enter a valid email address');
          return;
        }

        // Get current employees data - FIXED PATH
        var aEmployees = oEmployeesModel.getProperty('/employees') || [];

        // Check if employee ID already exists
        var bEmployeeExists = aEmployees.some(function (emp) {
          return emp && emp.id === oFormData.id.trim();
        });

        if (bEmployeeExists) {
          MessageToast.show(
            'Employee ID already exists. Please use a different ID.'
          );
          return;
        }

        // Create new employee object
        var oNewEmployee = {
          id: oFormData.id.trim(),
          name: oFormData.name.trim(),
          department: oFormData.department.trim(),
          position: oFormData.position ? oFormData.position.trim() : '',
          email: oFormData.email.trim(),
        };

        // Add new employee to array
        aEmployees.push(oNewEmployee);

        // Sort employees by ID
        aEmployees.sort(function (a, b) {
          return a.id.localeCompare(b.id);
        });

        // Update the model - FIXED PATH
        oEmployeesModel.setProperty('/employees', aEmployees);
        oEmployeesModel.refresh(true);

        console.log('Model updated successfully');

        // Show success message
        MessageToast.show('Employee added successfully!', {
          duration: 3000,
          width: '20em',
          my: 'center center',
          at: 'center center',
        });

        // Reset the form after save
        this._initializeFormModel();

        // Navigate back to list after a short delay
        var that = this;
        setTimeout(function () {
          console.log('Navigating back to list');
          that._navigateBack();
        }, 1000);
      },

      onNavBack: function () {
        this._navigateBack();
      },

      _navigateBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('EmployeeList', {}, true);
        }
      },
    });
  }
);
