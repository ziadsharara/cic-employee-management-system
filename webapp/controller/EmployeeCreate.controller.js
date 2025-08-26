sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
<<<<<<< HEAD
    'sap/m/MessageBox',
  ],
  function (Controller, JSONModel, MessageToast, MessageBox) {
=======
    'sap/ui/core/routing/History',
  ],
  function (Controller, JSONModel, MessageToast, History) {
>>>>>>> master
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeCreate', {
      onInit: function () {
<<<<<<< HEAD
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
=======
        this._initializeFormModel();
      },

>>>>>>> master
      _initializeFormModel: function () {
        var oFormData = {
          id: '',
          name: '',
          department: '',
          position: '',
          email: '',
<<<<<<< HEAD

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
=======
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
>>>>>>> master

        // Create new employee object
        var oNewEmployee = {
          id: oFormData.id.trim(),
          name: oFormData.name.trim(),
<<<<<<< HEAD
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
=======
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
>>>>>>> master
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
