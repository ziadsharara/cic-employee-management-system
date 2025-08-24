// This controller manages the Employee List view, including search, filter, navigation, and export functionality.
sap.ui.define(
  [
    'sap/ui/core/mvc/Controller', // Base controller class
    'sap/ui/model/Filter', // Used for filtering table data
    'sap/ui/model/FilterOperator', // Operators for filter conditions
    'sap/m/MessageToast', // For showing toast messages
    'sap/m/MessageBox', // For showing confirmation dialogs
    'sap/ui/export/Spreadsheet', // For exporting table data to Excel
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
       * Controller initialization: loads the main model and updates employee count.
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
       * Handles row press event and navigates to employee details view.
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

      /**
       * Navigates to the Add New Employee page.
       */
      onAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo('EmployeeCreate');
      },

      /**
       * Handles live search input for filtering employees.
       */
      onLiveSearch: function (oEvent) {
        this._applySearchFilter(oEvent.getParameter('newValue'));
      },

      /**
       * Handles search event for filtering employees.
       */
      onSearch: function (oEvent) {
        this._applySearchFilter(oEvent.getParameter('query'));
      },

      /**
       * Applies search filter across multiple fields in the employee table.
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
       * Handles department filter change event.
       */
      onDepartmentFilter: function (oEvent) {
        this._applyFilters(
          this.byId('searchField').getValue(),
          oEvent.getSource().getSelectedKey()
        );
      },

      /**
       * Combines search and department filters for the employee table.
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

      /**
       * Clears all filters from the employee table.
       */
      onClearFilters: function () {
        this.byId('searchField').setValue('');
        this.byId('departmentFilter').setSelectedKey('');
        this.byId('employeeTable').getBinding('items').filter([]);
        this._toggleNoDataMessage(false);
        MessageToast.show('All filters cleared');
      },

      /**
       * Shows or hides the no data message based on table content.
       */
      _toggleNoDataMessage: function (bShow) {
        this.byId('employeeTable').setVisible(!bShow);
        this.byId('noDataMessage').setVisible(bShow);
      },

      /**
       * Navigates to Quick Edit page for the selected employee.
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
       * Deletes an employee from the model with confirmation.
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
       * Removes an employee from the model and updates the view.
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

      /**
       * Refreshes the employee table data and clears filters.
       */
      onRefresh: function () {
        this.getOwnerComponent().getModel().refresh();
        this.onClearFilters();
        MessageToast.show('Data refreshed');
      },

      /**
       * Exports the employee table to Excel using fixed column mapping.
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

      /**
       * Exports the employee table to PDF using fixed column mapping.
       */
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

      /**
       * Logs the total employee count to the console.
       */
      _updateEmployeeCount: function () {
        var aEmployees =
          this.getOwnerComponent().getModel().getProperty('/employees') || [];
        console.log(`Total employees: ${aEmployees.length}`);
      },

      /**
       * Formats the department state for UI indicator.
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
