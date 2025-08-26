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
<<<<<<< HEAD
        // Get router and attach route matching
=======
>>>>>>> master
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute('EmployeeDetail')
          .attachPatternMatched(this._onObjectMatched, this);

<<<<<<< HEAD
        // Initialize view model for edit mode management
        this._initializeViewModel();
      },

      /**
       * Initialize view model for managing edit state and validation
       */
=======
        this._initializeViewModel();
      },

>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Called when navigating to this page - loads employee data
       * @param {object} oEvent - Route matching event
       */
=======
>>>>>>> master
      _onObjectMatched: function (oEvent) {
        var sEmployeeID = oEvent.getParameter('arguments').EmployeeID;
        console.log('Loading Employee ID:', sEmployeeID);

<<<<<<< HEAD
        // Get employee data from main model
        var oModel = this.getOwnerComponent().getModel();
=======
        var oModel = this.getOwnerComponent().getModel('employees');
>>>>>>> master

        if (!oModel) {
          console.error('No model found in component!');
          MessageToast.show('Data model not available!');
          return;
        }

        var aEmployees = oModel.getProperty('/employees');
        console.log('Available employees:', aEmployees);

<<<<<<< HEAD
        // Find employee by ID
=======
>>>>>>> master
        var oEmployee = aEmployees.find(function (emp) {
          return emp.id === sEmployeeID;
        });

        console.log('Found employee:', oEmployee);

        if (oEmployee) {
<<<<<<< HEAD
          // Create enhanced employee object with default values
          var oEnhancedEmployee = this._enhanceEmployeeData(oEmployee);

          // Create employee model and bind to view
          var oEmployeeModel = new JSONModel(oEnhancedEmployee);
          this.getView().setModel(oEmployeeModel, 'employee');

          // Store original data for cancel functionality
          this._oOriginalData = JSON.parse(JSON.stringify(oEnhancedEmployee));

=======
          var oEnhancedEmployee = this._enhanceEmployeeData(oEmployee);
          var oEmployeeModel = new JSONModel(oEnhancedEmployee);
          this.getView().setModel(oEmployeeModel, 'employee');

          this._oOriginalData = JSON.parse(JSON.stringify(oEnhancedEmployee));
>>>>>>> master
          console.log('Employee data bound successfully');
        } else {
          console.error('Employee not found with ID:', sEmployeeID);
          MessageToast.show('Employee not found!');
          this.onNavBack();
        }
      },

<<<<<<< HEAD
      /**
       * Enhance employee data with additional fields and default values
       * @param {object} oEmployee - Original employee data
       * @returns {object} Enhanced employee object
       */
=======
>>>>>>> master
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
<<<<<<< HEAD
          photo: oEmployee.photo || '', // Will use initials if no photo
        };
      },

      /**
       * Switch to edit mode
       */
=======
          photo: oEmployee.photo || '',
        };
      },

>>>>>>> master
      onEdit: function () {
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', true);

<<<<<<< HEAD
        // Store original data for cancel functionality
=======
>>>>>>> master
        var oEmployeeData = this.getView().getModel('employee').getData();
        this._oOriginalData = JSON.parse(JSON.stringify(oEmployeeData));

        MessageToast.show('Edit mode enabled');
      },

<<<<<<< HEAD
      /**
       * Cancel edit mode and restore original data
       */
=======
>>>>>>> master
      onCancelEdit: function () {
        var that = this;

        MessageBox.confirm('Discard all changes?', {
          title: 'Cancel Edit',
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
<<<<<<< HEAD
              // Restore original data
              var oEmployeeModel = that.getView().getModel('employee');
              oEmployeeModel.setData(that._oOriginalData);

              // Exit edit mode
=======
              var oEmployeeModel = that.getView().getModel('employee');
              oEmployeeModel.setData(that._oOriginalData);

>>>>>>> master
              var oViewModel = that.getView().getModel('viewModel');
              oViewModel.setProperty('/editMode', false);
              that._clearValidationStates();

              MessageToast.show('Changes discarded');
            }
          },
        });
      },

<<<<<<< HEAD
      /**
       * Save changes and exit edit mode
       */
=======
>>>>>>> master
      onSave: function () {
        if (!this._validateEmployeeData()) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        var oEmployeeData = this.getView().getModel('employee').getData();

<<<<<<< HEAD
        // Update main model
        this._updateEmployeeInMainModel(oEmployeeData);

        // Exit edit mode
=======
        this._updateEmployeeInMainModel(oEmployeeData);

>>>>>>> master
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', false);
        this._clearValidationStates();

        MessageToast.show('Employee updated successfully!');
      },

<<<<<<< HEAD
      /**
       * Update employee in the main component model
       * @param {object} oEmployeeData - Updated employee data
       */
      _updateEmployeeInMainModel: function (oEmployeeData) {
        var oMainModel = this.getOwnerComponent().getModel();
        var aEmployees = oMainModel.getProperty('/employees');

        // Find and update the employee
=======
      _updateEmployeeInMainModel: function (oEmployeeData) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
        var aEmployees = oMainModel.getProperty('/employees');

>>>>>>> master
        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === oEmployeeData.id;
        });

        if (iIndex !== -1) {
          aEmployees[iIndex] = oEmployeeData;
          oMainModel.setProperty('/employees', aEmployees);
          console.log('Employee updated in main model');
        }
      },

<<<<<<< HEAD
      /**
       * Validate employee data
       * @returns {boolean} True if all data is valid
       */
=======
>>>>>>> master
      _validateEmployeeData: function () {
        var oEmployeeModel = this.getView().getModel('employee');
        var oViewModel = this.getView().getModel('viewModel');
        var oData = oEmployeeModel.getData();
        var bIsValid = true;
        var aErrors = [];

<<<<<<< HEAD
        // Reset validation states
        this._clearValidationStates();

        // Validate name
=======
        this._clearValidationStates();

>>>>>>> master
        if (!oData.name || oData.name.trim() === '') {
          oViewModel.setProperty('/nameState', 'Error');
          oViewModel.setProperty('/nameStateText', 'Full Name is required');
          aErrors.push('Full Name is required');
          bIsValid = false;
        }

<<<<<<< HEAD
        // Validate department
=======
>>>>>>> master
        if (!oData.department) {
          oViewModel.setProperty('/departmentState', 'Error');
          oViewModel.setProperty(
            '/departmentStateText',
            'Please select a department'
          );
          aErrors.push('Department selection is required');
          bIsValid = false;
        }

<<<<<<< HEAD
        // Validate email format
=======
>>>>>>> master
        if (oData.email && !this._isValidEmail(oData.email)) {
          oViewModel.setProperty('/emailState', 'Error');
          oViewModel.setProperty(
            '/emailStateText',
            'Please enter a valid email address'
          );
          aErrors.push('Valid email address is required');
          bIsValid = false;
        }

<<<<<<< HEAD
        // Update validation message
=======
>>>>>>> master
        oViewModel.setProperty('/hasValidationErrors', !bIsValid);
        oViewModel.setProperty(
          '/validationMessage',
          bIsValid
            ? ''
            : 'Please fix the following errors: ' + aErrors.join(', ')
        );

        return bIsValid;
      },

<<<<<<< HEAD
      /**
       * Clear all validation states
       */
=======
>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Validate email format
       * @param {string} sEmail - Email to validate
       * @returns {boolean} True if valid email
       */
=======
>>>>>>> master
      _isValidEmail: function (sEmail) {
        var oRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return oRegExp.test(sEmail);
      },

<<<<<<< HEAD
      /**
       * Field change handler for real-time validation
       */
      onFieldChange: function () {
        // Only validate in edit mode
=======
      onFieldChange: function () {
>>>>>>> master
        var oViewModel = this.getView().getModel('viewModel');
        if (oViewModel.getProperty('/editMode')) {
          this._validateEmployeeData();
        }
      },

<<<<<<< HEAD
      /**
       * Rating change handler
       * @param {object} oEvent - Rating change event
       */
=======
>>>>>>> master
      onRatingChange: function (oEvent) {
        var fValue = oEvent.getParameter('value');
        console.log('Rating changed to:', fValue);
      },

<<<<<<< HEAD
      /**
       * Photo change handler (placeholder for file upload)
       */
=======
>>>>>>> master
      onChangePhoto: function () {
        MessageToast.show('Photo upload functionality - Coming soon!');
      },

<<<<<<< HEAD
      /**
       * Delete employee with confirmation
       */
=======
>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Execute employee deletion
       * @param {string} sEmployeeID - Employee ID to delete
       */
      _deleteEmployee: function (sEmployeeID) {
        var oMainModel = this.getOwnerComponent().getModel();
=======
      _deleteEmployee: function (sEmployeeID) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Navigate back to previous page
       */
=======
>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Format employee initials for avatar
       * @param {string} sName - Full name
       * @returns {string} Initials (e.g., "John Doe" -> "JD")
       */
=======
>>>>>>> master
      formatInitials: function (sName) {
        if (!sName) return '??';

        var aNames = sName.split(' ');
        if (aNames.length >= 2) {
          return (aNames[0].charAt(0) + aNames[1].charAt(0)).toUpperCase();
        }
        return sName.charAt(0).toUpperCase();
      },

<<<<<<< HEAD
      /**
       * Calculate years of service from hire date
       * @param {string} sHireDate - Hire date in YYYY-MM-DD format
       * @returns {number} Years of service
       */
=======
>>>>>>> master
      formatYearsOfService: function (sHireDate) {
        if (!sHireDate) return 0;

        var oHireDate = new Date(sHireDate);
        var oNow = new Date();
        var iYears = oNow.getFullYear() - oHireDate.getFullYear();

        return iYears;
      },

<<<<<<< HEAD
      /**
       * Format status state for ObjectStatus
       * @param {string} sStatus - Employee status
       * @returns {string} State value
       */
=======
>>>>>>> master
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
