sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/export/Spreadsheet',
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox,
    Spreadsheet
  ) {
    'use strict';

    return Controller.extend('cic.cictrial.controller.EmployeeList', {
      /**
       * Initialize the controller
       * - Loads the main model from the Component
       * - Updates the employee count
       */
      onInit: function () {
        var oModel = this.getOwnerComponent().getModel();
        if (oModel) {
          console.log('Model loaded successfully:', oModel.getData());
          this._updateEmployeeCount();
        } else {
          console.error('Model not found in component!');
        }
      },

      /**
       * Handles row press event and navigates to employee details view
       * @param {sap.ui.base.Event} oEvent - Item press event
       */
      onItemPress: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeDetail', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

      /** Navigate to Add New Employee page */
      onAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo('EmployeeCreate');
      },

      /**
       * Live search event handler
       * @param {sap.ui.base.Event} oEvent - LiveChange event
       */
      onLiveSearch: function (oEvent) {
        this._applySearchFilter(oEvent.getParameter('newValue'));
      },

      /**
       * Search event handler
       * @param {sap.ui.base.Event} oEvent - Search event
       */
      onSearch: function (oEvent) {
        this._applySearchFilter(oEvent.getParameter('query'));
      },

      /**
       * Apply search filter across multiple fields
       * @param {string} sQuery - Search text
       */
      _applySearchFilter: function (sQuery) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

        if (sQuery) {
          aFilters.push(
            new Filter({
              filters: [
                new Filter('id', FilterOperator.Contains, sQuery),
                new Filter('name', FilterOperator.Contains, sQuery),
                new Filter('department', FilterOperator.Contains, sQuery),
                new Filter('position', FilterOperator.Contains, sQuery),
                new Filter('email', FilterOperator.Contains, sQuery),
              ],
              and: false,
            })
          );
        }

        // Department filter (if any)
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
       * Department filter change event
       * @param {sap.ui.base.Event} oEvent
       */
      onDepartmentFilter: function (oEvent) {
        this._applyFilters(
          this.byId('searchField').getValue(),
          oEvent.getSource().getSelectedKey()
        );
      },

      /**
       * Combine search + department filters
       * @param {string} sSearchQuery
       * @param {string} sDepartment
       */
      _applyFilters: function (sSearchQuery, sDepartment) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

        if (sSearchQuery) {
          aFilters.push(
            new Filter({
              filters: [
                new Filter('id', FilterOperator.Contains, sSearchQuery),
                new Filter('name', FilterOperator.Contains, sSearchQuery),
                new Filter('department', FilterOperator.Contains, sSearchQuery),
                new Filter('position', FilterOperator.Contains, sSearchQuery),
                new Filter('email', FilterOperator.Contains, sSearchQuery),
              ],
              and: false,
            })
          );
        }

        if (sDepartment) {
          aFilters.push(
            new Filter('department', FilterOperator.EQ, sDepartment)
          );
        }

        oBinding.filter(aFilters);
        this._toggleNoDataMessage(oBinding.getLength() === 0);
      },

      /** Clear all filters */
      onClearFilters: function () {
        this.byId('searchField').setValue('');
        this.byId('departmentFilter').setSelectedKey('');
        this.byId('employeeTable').getBinding('items').filter([]);
        this._toggleNoDataMessage(false);
        MessageToast.show('All filters cleared');
      },

      /**
       * Show or hide no data message
       * @param {boolean} bShow
       */
      _toggleNoDataMessage: function (bShow) {
        this.byId('employeeTable').setVisible(!bShow);
        this.byId('noDataMessage').setVisible(bShow);
      },

      /**
       * Navigate to Quick Edit page for selected employee
       * @param {sap.ui.base.Event} oEvent
       */
      onQuickEdit: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeEdit', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

      /**
       * Delete employee from model with confirmation
       * @param {sap.ui.base.Event} oEvent
       */
      onQuickDelete: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var sEmployeeId = oContext.getProperty('id');
        var sEmployeeName = oContext.getProperty('name');

        MessageBox.confirm(
          `Are you sure you want to delete employee '${sEmployeeName}'?`,
          {
            title: 'Delete Employee',
            onClose: (oAction) => {
              if (oAction === MessageBox.Action.OK) {
                this._deleteEmployeeFromList(sEmployeeId);
              }
            },
          }
        );
      },

      /**
       * Remove employee from model and update view
       * @param {string} sEmployeeId
       */
      _deleteEmployeeFromList: function (sEmployeeId) {
        var oModel = this.getOwnerComponent().getModel();
        var aEmployees = oModel.getProperty('/employees') || [];
        var iIndex = aEmployees.findIndex((emp) => emp.id === sEmployeeId);

        if (iIndex !== -1) {
          aEmployees.splice(iIndex, 1);
          oModel.setProperty('/employees', aEmployees);
          this._updateEmployeeCount();
          MessageToast.show('Employee deleted successfully!');
        }
      },

      /** Refresh table data */
      onRefresh: function () {
        this.getOwnerComponent().getModel().refresh();
        this.onClearFilters();
        MessageToast.show('Data refreshed');
      },

      /**
       * Export employee table to Excel
       */
      onExportExcel: function () {
        var oTable = this.byId('employeeTable');
        var oModel = oTable.getModel();
        var aData = oModel.getProperty('/employees');
        console.log('Excel Export Data:', aData);

        var aCols = [
          { label: 'ID', property: 'id' },
          { label: 'Name', property: 'name' },
          { label: 'Department', property: 'department' },
          { label: 'Position', property: 'position' },
          { label: 'Email', property: 'email' },
        ];
        var aFields = ['id', 'name', 'department', 'position', 'email'];

        var aExportData = aData.map(function (item) {
          return {
            id: item.id,
            name: item.name,
            department: item.department,
            position: item.position,
            email: item.email,
          };
        });

        var oSheet = new Spreadsheet({
          workbook: { columns: aCols },
          dataSource: aExportData,
          fileName: 'Employees.xlsx',
        });

        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      onExportPDF: function () {
        var that = this;
        sap.ui.require(
          ['cic/cictrial/util/LibraryLoader'],
          function (LibraryLoader) {
            LibraryLoader.loadJsPDF().then(function () {
              var oTable = that.byId('employeeTable');
              var oModel = oTable.getModel();
              var aData = oModel.getProperty('/employees');
              console.log('PDF Export Data:', aData);

              const { jsPDF } = window.jspdf;
              var doc = new jsPDF();
              doc.text('Employee List', 14, 20);

              doc.autoTable({
                head: [['ID', 'Name', 'Department', 'Position', 'Email']],
                body: aData.map((emp) => [
                  emp.id,
                  emp.name,
                  emp.department,
                  emp.position,
                  emp.email,
                ]),
              });

              doc.save('Employees.pdf');
            });
          }
        );
      },

      /** Log total employee count */
      _updateEmployeeCount: function () {
        var aEmployees =
          this.getOwnerComponent().getModel().getProperty('/employees') || [];
        console.log(`Total employees: ${aEmployees.length}`);
      },

      /**
       * Format department state for UI indicator
       * @param {string} sDepartment
       * @returns {string} State (Success, Warning, Error, Information, None)
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
