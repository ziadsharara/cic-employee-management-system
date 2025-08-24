sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
  ],
  function (Controller, Filter, FilterOperator, MessageToast, MessageBox) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeList', {
      onInit: function () {
        // Ensure model is available from component
        var oModel = this.getOwnerComponent().getModel();
        if (oModel) {
          console.log('Model loaded successfully:', oModel.getData());
          this._updateEmployeeCount();
        } else {
          console.error('Model not found in component!');
        }
      },

      /**
       * Navigate to employee details when row is pressed
       * @param {object} oEvent - Press event
       */
      onItemPress: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('id');

        if (sEmployeeId) {
          this.getOwnerComponent().getRouter().navTo('EmployeeDetail', {
            EmployeeID: sEmployeeId,
          });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

      /**
       * Navigate to add new employee page
       */
      onAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo('EmployeeCreate');
      },

      /**
       * Live search functionality - filters as user types
       * @param {object} oEvent - Live change event
       */
      onLiveSearch: function (oEvent) {
        var sQuery = oEvent.getParameter('newValue');
        this._applySearchFilter(sQuery);
      },

      /**
       * Search functionality - filters when user presses enter or search icon
       * @param {object} oEvent - Search event
       */
      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter('query');
        this._applySearchFilter(sQuery);
      },

      /**
       * Apply search filter to the table
       * @param {string} sQuery - Search query
       */
      _applySearchFilter: function (sQuery) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
          // Create filters for multiple fields
          var oFilter = new Filter({
            filters: [
              new Filter('id', FilterOperator.Contains, sQuery),
              new Filter('name', FilterOperator.Contains, sQuery),
              new Filter('department', FilterOperator.Contains, sQuery),
              new Filter('position', FilterOperator.Contains, sQuery),
              new Filter('email', FilterOperator.Contains, sQuery),
            ],
            and: false, // OR logic - search in any field
          });
          aFilters.push(oFilter);
        }

        // Add department filter if selected
        var sDepartment = this.byId('departmentFilter').getSelectedKey();
        if (sDepartment) {
          aFilters.push(
            new Filter('department', FilterOperator.EQ, sDepartment)
          );
        }

        oBinding.filter(aFilters);
        this._toggleNoDataMessage(oBinding.getLength() === 0);
      },

      /**
       * Department filter change handler
       * @param {object} oEvent - Selection change event
       */
      onDepartmentFilter: function (oEvent) {
        var sDepartment = oEvent.getSource().getSelectedKey();
        var sSearchQuery = this.byId('searchField').getValue();

        // Apply both search and department filters
        this._applyFilters(sSearchQuery, sDepartment);
      },

      /**
       * Apply multiple filters combination
       * @param {string} sSearchQuery - Search text
       * @param {string} sDepartment - Selected department
       */
      _applyFilters: function (sSearchQuery, sDepartment) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

        // Search filter
        if (sSearchQuery && sSearchQuery.length > 0) {
          var oSearchFilter = new Filter({
            filters: [
              new Filter('id', FilterOperator.Contains, sSearchQuery),
              new Filter('name', FilterOperator.Contains, sSearchQuery),
              new Filter('department', FilterOperator.Contains, sSearchQuery),
              new Filter('position', FilterOperator.Contains, sSearchQuery),
              new Filter('email', FilterOperator.Contains, sSearchQuery),
            ],
            and: false,
          });
          aFilters.push(oSearchFilter);
        }

        // Department filter
        if (sDepartment) {
          aFilters.push(
            new Filter('department', FilterOperator.EQ, sDepartment)
          );
        }

        oBinding.filter(aFilters);
        this._toggleNoDataMessage(oBinding.getLength() === 0);
      },

      /**
       * Clear all applied filters
       */
      onClearFilters: function () {
        this.byId('searchField').setValue('');
        this.byId('departmentFilter').setSelectedKey('');

        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        oBinding.filter([]);

        this._toggleNoDataMessage(false);
        MessageToast.show('All filters cleared');
      },

      /**
       * Toggle no data message visibility
       * @param {boolean} bShow - Whether to show no data message
       */
      _toggleNoDataMessage: function (bShow) {
        this.byId('employeeTable').setVisible(!bShow);
        this.byId('noDataMessage').setVisible(bShow);
      },

      /**
       * Quick edit functionality from table row
       * @param {object} oEvent - Press event
       */
      onQuickEdit: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var sEmployeeId = oContext.getProperty('id');

        // Navigate to edit mode (we'll implement this next)
        MessageToast.show('Quick Edit for ' + sEmployeeId + ' - Coming soon!');
      },

      /**
       * Quick delete functionality from table row
       * @param {object} oEvent - Press event
       */
      onQuickDelete: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var sEmployeeId = oContext.getProperty('id');
        var sEmployeeName = oContext.getProperty('name');
        var that = this;

        MessageBox.confirm(
          "Are you sure you want to delete employee '" + sEmployeeName + "'?",
          {
            title: 'Delete Employee',
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                that._deleteEmployeeFromList(sEmployeeId);
              }
            },
          }
        );
      },

      /**
       * Delete employee from the main model
       * @param {string} sEmployeeId - Employee ID to delete
       */
      _deleteEmployeeFromList: function (sEmployeeId) {
        var oModel = this.getOwnerComponent().getModel();
        var aEmployees = oModel.getProperty('/employees');

        var iIndex = aEmployees.findIndex(function (emp) {
          return emp.id === sEmployeeId;
        });

        if (iIndex !== -1) {
          aEmployees.splice(iIndex, 1);
          oModel.setProperty('/employees', aEmployees);
          this._updateEmployeeCount();
          MessageToast.show('Employee deleted successfully!');
        }
      },

      /**
       * Refresh data from model
       */
      onRefresh: function () {
        var oModel = this.getOwnerComponent().getModel();
        oModel.refresh();
        this.onClearFilters();
        MessageToast.show('Data refreshed');
      },

      /**
       * Export functionality (placeholder for now)
       */
      onExport: function () {
        MessageToast.show('Export functionality - Coming soon!');
      },

      /**
       * Update employee count in table title
       */
      _updateEmployeeCount: function () {
        var oModel = this.getOwnerComponent().getModel();
        if (oModel) {
          var aEmployees = oModel.getProperty('/employees') || [];
          console.log('Total employees: ' + aEmployees.length);
        }
      },

      /**
       * Format department state for ObjectStatus control
       * @param {string} sDepartment - Department name
       * @returns {string} State value for ObjectStatus
       */
      formatDepartmentState: function (sDepartment) {
        switch (sDepartment) {
          case 'IT':
          case 'Fiori':
            return 'Success';
          case 'HR':
            return 'Warning';
          case 'Sales':
            return 'Error';
          case 'Marketing':
            return 'Information';
          default:
            return 'None';
        }
      },
    });
  }
);
