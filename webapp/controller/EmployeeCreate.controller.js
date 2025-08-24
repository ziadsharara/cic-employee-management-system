sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
  ],
  function (Controller, JSONModel, MessageToast, MessageBox) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeCreate', {
      onInit: function () {
        // Initialize empty form model
        this._initializeFormModel();
        var oModel = this.getView().getModel();
        if (!oModel) {
          sap.m.MessageToast.show('Form model not initialized!');
        } else {
          sap.m.MessageToast.show('EmployeeCreate controller loaded.');
        }
        console.log('EmployeeCreate controller initialized');
      },

      /**
       * Initialize form model with empty values
       */
      _initializeFormModel: function () {
        var oFormData = {
          id: '',
          name: '',
          department: '',
          position: '',
          email: '',

          // Validation States
          idState: 'None',
          idStateText: '',
          nameState: 'None',
          nameStateText: '',
          departmentState: 'None',
          departmentStateText: '',

          // General validation messages
          hasValidationErrors: false,
          validationMessage: '',
        };

        var oModel = new JSONModel(oFormData);
        this.getView().setModel(oModel);
      },

      /**
       * Validate form data on input change
       */
      onInputChange: function () {
        this._validateForm();
      },

      /**
       * Validate all required fields
       * @returns {boolean} true if data is valid
       */
      _validateForm: function () {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();
        var bIsValid = true;
        var aErrors = [];

        // Reset validation states
        oData.idState = 'None';
        oData.idStateText = '';
        oData.nameState = 'None';
        oData.nameStateText = '';
        oData.departmentState = 'None';
        oData.departmentStateText = '';

        // Validate Employee ID
        if (!oData.id || oData.id.trim() === '') {
          oData.idState = 'Error';
          oData.idStateText = 'Employee ID is required';
          aErrors.push('Employee ID is required');
          bIsValid = false;
        } else if (this._isEmployeeIdExists(oData.id)) {
          oData.idState = 'Error';
          oData.idStateText = 'Employee ID already exists';
          aErrors.push('Employee ID already exists');
          bIsValid = false;
        }

        // Validate name
        if (!oData.name || oData.name.trim() === '') {
          oData.nameState = 'Error';
          oData.nameStateText = 'Full Name is required';
          aErrors.push('Full Name is required');
          bIsValid = false;
        }

        // Validate department
        if (!oData.department || oData.department === '') {
          oData.departmentState = 'Error';
          oData.departmentStateText = 'Please select a department';
          aErrors.push('Department selection is required');
          bIsValid = false;
        }

        // Update validation messages
        oData.hasValidationErrors = !bIsValid;
        oData.validationMessage = bIsValid
          ? ''
          : 'Please fix the following errors: ' + aErrors.join(', ');

        oModel.setData(oData);
        return bIsValid;
      },

      /**
       * Check if Employee ID already exists
       * @param {string} sEmployeeId - Employee ID to check
       * @returns {boolean} true if ID exists
       */
      _isEmployeeIdExists: function (sEmployeeId) {
        var oMainModel = this.getOwnerComponent().getModel();
        if (!oMainModel) return false;

        var aEmployees = oMainModel.getProperty('/employees') || [];

        return aEmployees.some(function (emp) {
          return emp.id === sEmployeeId;
        });
      },

      /**
       * Save new employee
       */
      onSave: function () {
        if (!this._validateForm()) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        var oModel = this.getView().getModel();
        var oFormData = oModel.getData();

        // Create new employee object
        var oNewEmployee = {
          id: oFormData.id.trim(),
          name: oFormData.name.trim(),
          department: oFormData.department,
          position: oFormData.position ? oFormData.position.trim() : '',
          email: oFormData.email ? oFormData.email.trim() : '',
        };

        // Add employee to main list
        this._addEmployeeToList(oNewEmployee);
      },

      /**
       * Add new employee to main list
       * @param {object} oNewEmployee - New employee data
       */
      _addEmployeeToList: function (oNewEmployee) {
        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees') || [];

        // Add new employee
        aEmployees.push(oNewEmployee);
        oMainModel.setProperty('/employees', aEmployees);

        // Success message
        MessageToast.show(
          "Employee '" + oNewEmployee.name + "' created successfully!"
        );

        // Reset form after successful add
        this._initializeFormModel();

        // Go back to employee list
        this.onNavBack();
      },

      /**
       * Cancel and go back to previous page
       */
      onNavBack: function () {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        // Check for unsaved data
        var bHasUnsavedData =
          oData.id ||
          oData.name ||
          oData.department ||
          oData.position ||
          oData.email;

        if (bHasUnsavedData) {
          var that = this;
          MessageBox.confirm(
            'You have unsaved changes. Are you sure you want to leave?',
            {
              title: 'Unsaved Changes',
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                  that._navigateBack();
                }
              },
            }
          );
        } else {
          this._navigateBack();
        }
      },

      /**
       * Perform navigation back
       */
      _navigateBack: function () {
        var oHistory = sap.ui.core.routing.History.getInstance();
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
