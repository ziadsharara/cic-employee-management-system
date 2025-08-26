sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/routing/History',
  ],
  function (Controller, JSONModel, MessageToast, MessageBox, History) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeCreate', {
      onInit: function () {
        // Initialize empty form model
        this._initializeFormModel();
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
          emailState: 'None',
          emailStateText: '',

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
      onInputChange: function (oEvent) {
        var sControlId = oEvent.getSource().getId();
        this._validateField(sControlId);
      },

      /**
       * Validate specific field
       */
      _validateField: function (sControlId) {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        if (sControlId.includes('employeeIdInput')) {
          this._validateEmployeeId(oData.id);
        } else if (sControlId.includes('employeeNameInput')) {
          this._validateName(oData.name);
        } else if (sControlId.includes('departmentSelect')) {
          this._validateDepartment(oData.department);
        } else if (sControlId.includes('emailInput')) {
          this._validateEmail(oData.email);
        }

        this._updateValidationStatus();
      },

      /**
       * Validate Employee ID
       */
      _validateEmployeeId: function (sId) {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        if (!sId || sId.trim() === '') {
          oData.idState = 'Error';
          oData.idStateText = 'Employee ID is required';
        } else if (this._isEmployeeIdExists(sId)) {
          oData.idState = 'Error';
          oData.idStateText = 'Employee ID already exists';
        } else {
          oData.idState = 'Success';
          oData.idStateText = '';
        }

        oModel.setData(oData);
      },

      /**
       * Validate Name
       */
      _validateName: function (sName) {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        if (!sName || sName.trim() === '') {
          oData.nameState = 'Error';
          oData.nameStateText = 'Full Name is required';
        } else {
          oData.nameState = 'Success';
          oData.nameStateText = '';
        }

        oModel.setData(oData);
      },

      /**
       * Validate Department
       */
      _validateDepartment: function (sDepartment) {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        if (!sDepartment || sDepartment === '') {
          oData.departmentState = 'Error';
          oData.departmentStateText = 'Please select a department';
        } else {
          oData.departmentState = 'Success';
          oData.departmentStateText = '';
        }

        oModel.setData(oData);
      },

      /**
       * Validate Email
       */
      _validateEmail: function (sEmail) {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        if (!sEmail || sEmail.trim() === '') {
          oData.emailState = 'Error';
          oData.emailStateText = 'Email is required';
        } else if (!this._isValidEmail(sEmail)) {
          oData.emailState = 'Error';
          oData.emailStateText = 'Please enter a valid email address';
        } else {
          oData.emailState = 'Success';
          oData.emailStateText = '';
        }

        oModel.setData(oData);
      },

      /**
       * Check if email is valid
       */
      _isValidEmail: function (sEmail) {
        var oRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return oRegExp.test(sEmail);
      },

      /**
       * Update overall validation status
       */
      _updateValidationStatus: function () {
        var oModel = this.getView().getModel();
        var oData = oModel.getData();
        var bIsValid = true;
        var aErrors = [];

        if (oData.idState === 'Error') {
          aErrors.push(oData.idStateText);
          bIsValid = false;
        }
        if (oData.nameState === 'Error') {
          aErrors.push(oData.nameStateText);
          bIsValid = false;
        }
        if (oData.departmentState === 'Error') {
          aErrors.push(oData.departmentStateText);
          bIsValid = false;
        }
        if (oData.emailState === 'Error') {
          aErrors.push(oData.emailStateText);
          bIsValid = false;
        }

        oData.hasValidationErrors = !bIsValid;
        oData.validationMessage = bIsValid
          ? ''
          : 'Please fix the following errors: ' + aErrors.join(', ');

        oModel.setData(oData);
      },

      /**
       * Check if Employee ID already exists
       */
      _isEmployeeIdExists: function (sEmployeeId) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
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
        // Validate all fields before saving
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        this._validateEmployeeId(oData.id);
        this._validateName(oData.name);
        this._validateDepartment(oData.department);
        this._validateEmail(oData.email);
        this._updateValidationStatus();

        if (oData.hasValidationErrors) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        // Create new employee object
        var oNewEmployee = {
          id: oData.id.trim(),
          name: oData.name.trim(),
          department: oData.department,
          position: oData.position ? oData.position.trim() : '',
          email: oData.email ? oData.email.trim() : '',
        };

        // Add employee to main list
        this._addEmployeeToList(oNewEmployee);
      },

      /**
       * Add new employee to main list
       */
      _addEmployeeToList: function (oNewEmployee) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
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
        this._navigateBack();
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
