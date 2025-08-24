sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/m/UploadCollectionParameter',
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    MessageBox,
    UploadCollectionParameter
  ) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeDetail', {
      onInit: function () {
        // Get router and attach route matching
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute('EmployeeDetail')
          .attachPatternMatched(this._onObjectMatched, this);

        // Initialize view model for edit mode management
        this._initializeViewModel();
      },

      /**
       * Initialize view model for managing edit state and validation
       */
      _initializeViewModel: function () {
        var oViewModel = new JSONModel({
          editMode: false,
          hasValidationErrors: false,
          validationMessage: '',
          nameState: 'None',
          nameStateText: '',
          departmentState: 'None',
          departmentStateText: '',
          emailState: 'None',
          emailStateText: '',
        });

        this.getView().setModel(oViewModel, 'viewModel');
      },

      /**
       * Called when navigating to this page - loads employee data
       * @param {object} oEvent - Route matching event
       */
      _onObjectMatched: function (oEvent) {
        var sEmployeeID = oEvent.getParameter('arguments').EmployeeID;
        console.log('Loading Employee ID:', sEmployeeID);

        // Get employee data from main model
        var oModel = this.getOwnerComponent().getModel();

        if (!oModel) {
          console.error('No model found in component!');
          MessageToast.show('Data model not available!');
          return;
        }

        var aEmployees = oModel.getProperty('/employees');
        console.log('Available employees:', aEmployees);

        // Find employee by ID
        var oEmployee = aEmployees.find(function (emp) {
          return emp.id === sEmployeeID;
        });

        console.log('Found employee:', oEmployee);

        if (oEmployee) {
          // Create enhanced employee object with default values
          var oEnhancedEmployee = this._enhanceEmployeeData(oEmployee);

          // Create employee model and bind to view
          var oEmployeeModel = new JSONModel(oEnhancedEmployee);
          this.getView().setModel(oEmployeeModel, 'employee');

          // Store original data for cancel functionality
          this._oOriginalData = JSON.parse(JSON.stringify(oEnhancedEmployee));

          console.log('Employee data bound successfully');
        } else {
          console.error('Employee not found with ID:', sEmployeeID);
          MessageToast.show('Employee not found!');
          this.onNavBack();
        }
      },

      /**
       * Enhance employee data with additional fields and default values
       * @param {object} oEmployee - Original employee data
       * @returns {object} Enhanced employee object
       */
      _enhanceEmployeeData: function (oEmployee) {
        return {
          id: oEmployee.id || '',
          name: oEmployee.name || '',
          department: oEmployee.department || '',
          position: oEmployee.position || '',
          email: oEmployee.email || '',
          phone: oEmployee.phone || '',
          hireDate:
            oEmployee.hireDate || new Date().toISOString().split('T')[0],
          salary: oEmployee.salary || 0,
          rating: oEmployee.rating || 3,
          status: oEmployee.status || 'Active',
          photo: oEmployee.photo || '', // Will use initials if no photo
        };
      },

      /**
       * Switch to edit mode
       */
      onEdit: function () {
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', true);

        // Store original data for cancel functionality
        var oEmployeeData = this.getView().getModel('employee').getData();
        this._oOriginalData = JSON.parse(JSON.stringify(oEmployeeData));

        MessageToast.show('Edit mode enabled');
      },

      /**
       * Cancel edit mode and restore original data
       */
      onCancelEdit: function () {
        var that = this;

        MessageBox.confirm('Discard all changes?', {
          title: 'Cancel Edit',
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
              // Restore original data
              var oEmployeeModel = that.getView().getModel('employee');
              oEmployeeModel.setData(that._oOriginalData);

              // Exit edit mode
              var oViewModel = that.getView().getModel('viewModel');
              oViewModel.setProperty('/editMode', false);
              that._clearValidationStates();

              MessageToast.show('Changes discarded');
            }
          },
        });
      },

      /**
       * Save changes and exit edit mode
       */
      onSave: function () {
        if (!this._validateEmployeeData()) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        var oEmployeeData = this.getView().getModel('employee').getData();

        // Update main model
        this._updateEmployeeInMainModel(oEmployeeData);

        // Exit edit mode
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', false);
        this._clearValidationStates();

        MessageToast.show('Employee updated successfully!');
      },

      /**
       * Update employee in the main component model
       * @param {object} oEmployeeData - Updated employee data
       */
      _updateEmployeeInMainModel: function (oEmployeeData) {
        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees');

        // Find and update the employee
        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === oEmployeeData.id;
        });

        if (iIndex !== -1) {
          aEmployees[iIndex] = oEmployeeData;
          oMainModel.setProperty('/employees', aEmployees);
          console.log('Employee updated in main model');
        }
      },

      /**
       * Validate employee data
       * @returns {boolean} True if all data is valid
       */
      _validateEmployeeData: function () {
        var oEmployeeModel = this.getView().getModel('employee');
        var oViewModel = this.getView().getModel('viewModel');
        var oData = oEmployeeModel.getData();
        var bIsValid = true;
        var aErrors = [];

        // Reset validation states
        this._clearValidationStates();

        // Validate name
        if (!oData.name || oData.name.trim() === '') {
          oViewModel.setProperty('/nameState', 'Error');
          oViewModel.setProperty('/nameStateText', 'Full Name is required');
          aErrors.push('Full Name is required');
          bIsValid = false;
        }

        // Validate department
        if (!oData.department) {
          oViewModel.setProperty('/departmentState', 'Error');
          oViewModel.setProperty(
            '/departmentStateText',
            'Please select a department'
          );
          aErrors.push('Department selection is required');
          bIsValid = false;
        }

        // Validate email format
        if (oData.email && !this._isValidEmail(oData.email)) {
          oViewModel.setProperty('/emailState', 'Error');
          oViewModel.setProperty(
            '/emailStateText',
            'Please enter a valid email address'
          );
          aErrors.push('Valid email address is required');
          bIsValid = false;
        }

        // Update validation message
        oViewModel.setProperty('/hasValidationErrors', !bIsValid);
        oViewModel.setProperty(
          '/validationMessage',
          bIsValid
            ? ''
            : 'Please fix the following errors: ' + aErrors.join(', ')
        );

        return bIsValid;
      },

      /**
       * Clear all validation states
       */
      _clearValidationStates: function () {
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/nameState', 'None');
        oViewModel.setProperty('/nameStateText', '');
        oViewModel.setProperty('/departmentState', 'None');
        oViewModel.setProperty('/departmentStateText', '');
        oViewModel.setProperty('/emailState', 'None');
        oViewModel.setProperty('/emailStateText', '');
        oViewModel.setProperty('/hasValidationErrors', false);
        oViewModel.setProperty('/validationMessage', '');
      },

      /**
       * Validate email format
       * @param {string} sEmail - Email to validate
       * @returns {boolean} True if valid email
       */
      _isValidEmail: function (sEmail) {
        var oRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return oRegExp.test(sEmail);
      },

      /**
       * Field change handler for real-time validation
       */
      onFieldChange: function () {
        // Only validate in edit mode
        var oViewModel = this.getView().getModel('viewModel');
        if (oViewModel.getProperty('/editMode')) {
          this._validateEmployeeData();
        }
      },

      /**
       * Rating change handler
       * @param {object} oEvent - Rating change event
       */
      onRatingChange: function (oEvent) {
        var fValue = oEvent.getParameter('value');
        console.log('Rating changed to:', fValue);
      },

      /**
       * Photo change handler (placeholder for file upload)
       */
      onChangePhoto: function () {
        MessageToast.show('Photo upload functionality - Coming soon!');
      },

      /**
       * Delete employee with confirmation
       */
      onDelete: function () {
        var that = this;
        var oEmployeeModel = this.getView().getModel('employee');
        var sEmployeeName = oEmployeeModel.getProperty('/name');
        var sEmployeeID = oEmployeeModel.getProperty('/id');

        MessageBox.confirm(
          "Are you sure you want to delete employee '" + sEmployeeName + "'?",
          {
            title: 'Delete Employee',
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                that._deleteEmployee(sEmployeeID);
              }
            },
          }
        );
      },

      /**
       * Execute employee deletion
       * @param {string} sEmployeeID - Employee ID to delete
       */
      _deleteEmployee: function (sEmployeeID) {
        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees');

        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === sEmployeeID;
        });

        if (iIndex !== -1) {
          aEmployees.splice(iIndex, 1);
          oMainModel.setProperty('/employees', aEmployees);

          MessageToast.show('Employee deleted successfully!');
          this.onNavBack();
        } else {
          MessageToast.show('Error: Employee not found!');
        }
      },

      /**
       * Navigate back to previous page
       */
      onNavBack: function () {
        var oHistory = sap.ui.core.routing.History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('EmployeeList', {}, true);
        }
      },

      /**
       * Format employee initials for avatar
       * @param {string} sName - Full name
       * @returns {string} Initials (e.g., "John Doe" -> "JD")
       */
      formatInitials: function (sName) {
        if (!sName) return '??';

        var aNames = sName.split(' ');
        if (aNames.length >= 2) {
          return (aNames[0].charAt(0) + aNames[1].charAt(0)).toUpperCase();
        }
        return sName.charAt(0).toUpperCase();
      },

      /**
       * Calculate years of service from hire date
       * @param {string} sHireDate - Hire date in YYYY-MM-DD format
       * @returns {number} Years of service
       */
      formatYearsOfService: function (sHireDate) {
        if (!sHireDate) return 0;

        var oHireDate = new Date(sHireDate);
        var oNow = new Date();
        var iYears = oNow.getFullYear() - oHireDate.getFullYear();

        return iYears;
      },

      /**
       * Format status state for ObjectStatus
       * @param {string} sStatus - Employee status
       * @returns {string} State value
       */
      formatStatusState: function (sStatus) {
        switch (sStatus) {
          case 'Active':
            return 'Success';
          case 'On Leave':
            return 'Warning';
          case 'Inactive':
            return 'Error';
          default:
            return 'None';
        }
      },
    });
  }
);
