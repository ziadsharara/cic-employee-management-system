sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/m/UploadCollectionParameter',
    'sap/ui/core/routing/History',
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    MessageBox,
    UploadCollectionParameter,
    History
  ) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeDetail', {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute('EmployeeDetail')
          .attachPatternMatched(this._onObjectMatched, this);

        this._initializeViewModel();
      },

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

      _onObjectMatched: function (oEvent) {
        var sEmployeeID = oEvent.getParameter('arguments').EmployeeID;
        console.log('Loading Employee ID:', sEmployeeID);

        var oModel = this.getOwnerComponent().getModel('employees');

        if (!oModel) {
          console.error('No model found in component!');
          MessageToast.show('Data model not available!');
          return;
        }

        var aEmployees = oModel.getProperty('/employees');
        console.log('Available employees:', aEmployees);

        var oEmployee = aEmployees.find(function (emp) {
          return emp.id === sEmployeeID;
        });

        console.log('Found employee:', oEmployee);

        if (oEmployee) {
          var oEnhancedEmployee = this._enhanceEmployeeData(oEmployee);
          var oEmployeeModel = new JSONModel(oEnhancedEmployee);
          this.getView().setModel(oEmployeeModel, 'employee');

          this._oOriginalData = JSON.parse(JSON.stringify(oEnhancedEmployee));
          console.log('Employee data bound successfully');
        } else {
          console.error('Employee not found with ID:', sEmployeeID);
          MessageToast.show('Employee not found!');
          this.onNavBack();
        }
      },

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
          photo: oEmployee.photo || '',
        };
      },

      onEdit: function () {
        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', true);

        var oEmployeeData = this.getView().getModel('employee').getData();
        this._oOriginalData = JSON.parse(JSON.stringify(oEmployeeData));

        MessageToast.show('Edit mode enabled');
      },

      onCancelEdit: function () {
        var that = this;

        MessageBox.confirm('Discard all changes?', {
          title: 'Cancel Edit',
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
              var oEmployeeModel = that.getView().getModel('employee');
              oEmployeeModel.setData(that._oOriginalData);

              var oViewModel = that.getView().getModel('viewModel');
              oViewModel.setProperty('/editMode', false);
              that._clearValidationStates();

              MessageToast.show('Changes discarded');
            }
          },
        });
      },

      onSave: function () {
        if (!this._validateEmployeeData()) {
          MessageToast.show('Please fix validation errors before saving');
          return;
        }

        var oEmployeeData = this.getView().getModel('employee').getData();

        this._updateEmployeeInMainModel(oEmployeeData);

        var oViewModel = this.getView().getModel('viewModel');
        oViewModel.setProperty('/editMode', false);
        this._clearValidationStates();

        MessageToast.show('Employee updated successfully!');
      },

      _updateEmployeeInMainModel: function (oEmployeeData) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
        var aEmployees = oMainModel.getProperty('/employees');

        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === oEmployeeData.id;
        });

        if (iIndex !== -1) {
          aEmployees[iIndex] = oEmployeeData;
          oMainModel.setProperty('/employees', aEmployees);
          console.log('Employee updated in main model');
        }
      },

      _validateEmployeeData: function () {
        var oEmployeeModel = this.getView().getModel('employee');
        var oViewModel = this.getView().getModel('viewModel');
        var oData = oEmployeeModel.getData();
        var bIsValid = true;
        var aErrors = [];

        this._clearValidationStates();

        if (!oData.name || oData.name.trim() === '') {
          oViewModel.setProperty('/nameState', 'Error');
          oViewModel.setProperty('/nameStateText', 'Full Name is required');
          aErrors.push('Full Name is required');
          bIsValid = false;
        }

        if (!oData.department) {
          oViewModel.setProperty('/departmentState', 'Error');
          oViewModel.setProperty(
            '/departmentStateText',
            'Please select a department'
          );
          aErrors.push('Department selection is required');
          bIsValid = false;
        }

        if (oData.email && !this._isValidEmail(oData.email)) {
          oViewModel.setProperty('/emailState', 'Error');
          oViewModel.setProperty(
            '/emailStateText',
            'Please enter a valid email address'
          );
          aErrors.push('Valid email address is required');
          bIsValid = false;
        }

        oViewModel.setProperty('/hasValidationErrors', !bIsValid);
        oViewModel.setProperty(
          '/validationMessage',
          bIsValid
            ? ''
            : 'Please fix the following errors: ' + aErrors.join(', ')
        );

        return bIsValid;
      },

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

      _isValidEmail: function (sEmail) {
        var oRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return oRegExp.test(sEmail);
      },

      onFieldChange: function () {
        var oViewModel = this.getView().getModel('viewModel');
        if (oViewModel.getProperty('/editMode')) {
          this._validateEmployeeData();
        }
      },

      onRatingChange: function (oEvent) {
        var fValue = oEvent.getParameter('value');
        console.log('Rating changed to:', fValue);
      },

      onChangePhoto: function () {
        MessageToast.show('Photo upload functionality - Coming soon!');
      },

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

      _deleteEmployee: function (sEmployeeID) {
        var oMainModel = this.getOwnerComponent().getModel('employees');
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

      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo('EmployeeList', {}, true);
        }
      },

      formatInitials: function (sName) {
        if (!sName) return '??';

        var aNames = sName.split(' ');
        if (aNames.length >= 2) {
          return (aNames[0].charAt(0) + aNames[1].charAt(0)).toUpperCase();
        }
        return sName.charAt(0).toUpperCase();
      },

      formatYearsOfService: function (sHireDate) {
        if (!sHireDate) return 0;

        var oHireDate = new Date(sHireDate);
        var oNow = new Date();
        var iYears = oNow.getFullYear() - oHireDate.getFullYear();

        return iYears;
      },

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
