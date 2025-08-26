<<<<<<< HEAD
// This controller manages the Employee List view, including search, filter, navigation, and export functionality.
sap.ui.define(
  [
    'sap/ui/core/mvc/Controller', // Base controller class
    'sap/ui/model/Filter', // Used for filtering table data
    'sap/ui/model/FilterOperator', // Operators for filter conditions
    'sap/m/MessageToast', // For showing toast messages
    'sap/m/MessageBox', // For showing confirmation dialogs
    'sap/ui/export/Spreadsheet', // For exporting table data to Excel
=======
sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/export/Spreadsheet',
>>>>>>> master
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
<<<<<<< HEAD
      /**
       * Controller initialization: loads the main model and updates employee count.
       */
      onInit: function () {
        var oModel = this.getOwnerComponent().getModel();
=======
      onInit: function () {
        var oModel = this.getOwnerComponent().getModel('employees');
>>>>>>> master
        if (oModel) {
          console.log('Model loaded successfully:', oModel.getData());
          this._updateEmployeeCount();
        } else {
<<<<<<< HEAD
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
=======
          console.error('Employees model not found!');
        }
      },

      onItemPress: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext('employees')
>>>>>>> master
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeDetail', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

<<<<<<< HEAD
      /**
       * Navigates to the Add New Employee page.
       */
=======
>>>>>>> master
      onAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo('EmployeeCreate');
      },

<<<<<<< HEAD
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
=======
      onLiveSearch: function (oEvent) {
        this._applyFilters({ search: oEvent.getParameter('newValue') });
      },

      onSearch: function (oEvent) {
        this._applyFilters({ search: oEvent.getParameter('query') });
      },

      onDepartmentFilter: function (oEvent) {
        this._applyFilters({ department: oEvent.getSource().getSelectedKey() });
      },

      onClearFilters: function () {
        this.byId('searchField').setValue('');
        this.byId('departmentFilter').setSelectedKey('');
        this.byId('employeeTable').getBinding('items').filter([]);
        this._toggleNoDataMessage(false);
        MessageToast.show('All filters cleared');
      },

      _applyFilters: function ({ search, department } = {}) {
>>>>>>> master
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

<<<<<<< HEAD
=======
        var sSearchQuery =
          search !== undefined ? search : this.byId('searchField').getValue();
        var sDepartment =
          department !== undefined
            ? department
            : this.byId('departmentFilter').getSelectedKey();

>>>>>>> master
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

<<<<<<< HEAD
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
=======
>>>>>>> master
      _toggleNoDataMessage: function (bShow) {
        this.byId('employeeTable').setVisible(!bShow);
        this.byId('noDataMessage').setVisible(bShow);
      },

<<<<<<< HEAD
      /**
       * Navigates to Quick Edit page for the selected employee.
       */
      onQuickEdit: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext()
=======
      onQuickEdit: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext('employees')
>>>>>>> master
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeEdit', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

<<<<<<< HEAD
      /**
       * Deletes an employee from the model with confirmation.
       */
      onQuickDelete: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
=======
      onQuickDelete: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext('employees');
>>>>>>> master
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

<<<<<<< HEAD
      /**
       * Removes an employee from the model and updates the view.
       */
      _deleteEmployeeFromList: function (sEmployeeId) {
        var oModel = this.getOwnerComponent().getModel();
=======
      _deleteEmployeeFromList: function (sEmployeeId) {
        var oModel = this.getOwnerComponent().getModel('employees');
>>>>>>> master
        var aEmployees = oModel.getProperty('/employees') || [];
        var iIndex = aEmployees.findIndex((emp) => emp.id === sEmployeeId);

        if (iIndex !== -1) {
          aEmployees.splice(iIndex, 1);
          oModel.setProperty('/employees', aEmployees);
<<<<<<< HEAD
          this._updateEmployeeCount();
          MessageToast.show('Employee deleted successfully!');
        }
      },

      /**
       * Refreshes the employee table data and clears filters.
       */
      onRefresh: function () {
        this.getOwnerComponent().getModel().refresh();
=======
          MessageToast.show('Employee deleted successfully!');
          this._updateEmployeeCount();
        } else {
          MessageToast.show('Employee not found!');
        }
      },

      onRefresh: function () {
        this.getOwnerComponent().getModel('employees').refresh();
>>>>>>> master
        this.onClearFilters();
        MessageToast.show('Data refreshed');
      },

<<<<<<< HEAD
      /**
       * Exports the employee table to Excel using fixed column mapping.
       */
      onExportExcel: function () {
        var oTable = this.byId('employeeTable');
        var oModel = oTable.getModel();
        var aData = oModel.getProperty('/employees');
        console.log('Excel Export Data:', aData);
=======
      onExportExcel: function () {
        var oModel = this.getOwnerComponent().getModel('employees');
        var aData = oModel.getProperty('/employees') || [];
>>>>>>> master

        var aCols = [
          { label: 'ID', property: 'id' },
          { label: 'Name', property: 'name' },
          { label: 'Department', property: 'department' },
          { label: 'Position', property: 'position' },
          { label: 'Email', property: 'email' },
        ];
<<<<<<< HEAD
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
=======

        var oSheet = new Spreadsheet({
          workbook: { columns: aCols },
          dataSource: aData,
          fileName: 'Employees.xlsx',
        });

        oSheet.build().finally(() => oSheet.destroy());
      },

>>>>>>> master
      onExportPDF: function () {
        var that = this;
        sap.ui.require(
          ['cic/cictrial/util/LibraryLoader'],
          function (LibraryLoader) {
            LibraryLoader.loadJsPDF().then(function () {
<<<<<<< HEAD
              var oTable = that.byId('employeeTable');
              var oModel = oTable.getModel();
              var aData = oModel.getProperty('/employees');
              console.log('PDF Export Data:', aData);
=======
              var oModel = that.getOwnerComponent().getModel('employees');
              var aData = oModel.getProperty('/employees') || [];
>>>>>>> master

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

<<<<<<< HEAD
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
=======
      _updateEmployeeCount: function () {
        var aEmployees =
          this.getOwnerComponent()
            .getModel('employees')
            .getProperty('/employees') || [];
        console.log(`Total employees: ${aEmployees.length}`);
      },

>>>>>>> master
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

<<<<<<< HEAD
      // ======================== BULK OPERATIONS FEATURE ======================== //

      /**
       * Deletes all selected employees from the table and updates the model.
       * Bulk Delete: Deletes all selected employees from the table and model.
       */
=======
>>>>>>> master
      onBulkDelete: function () {
        var oTable = this.byId('employeeTable');
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
          MessageToast.show('No employees selected');
          return;
        }

        MessageBox.confirm(
          `Are you sure you want to delete ${aSelected.length} employees?`,
          {
            onClose: (oAction) => {
              if (oAction === MessageBox.Action.OK) {
<<<<<<< HEAD
                var oModel = this.getOwnerComponent().getModel();
                var aEmployees = oModel.getProperty('/employees') || [];

                aSelected.forEach((row) => {
                  var sId = row.getBindingContext().getProperty('id');
=======
                var oModel = this.getOwnerComponent().getModel('employees');
                var aEmployees = oModel.getProperty('/employees') || [];

                aSelected.forEach((row) => {
                  var sId = row
                    .getBindingContext('employees')
                    .getProperty('id');
>>>>>>> master
                  var iIndex = aEmployees.findIndex((emp) => emp.id === sId);
                  if (iIndex !== -1) aEmployees.splice(iIndex, 1);
                });

                oModel.setProperty('/employees', aEmployees);
                MessageToast.show('Selected employees deleted');
                this._updateEmployeeCount();
              }
            },
          }
        );
      },

<<<<<<< HEAD
      /**
       * Exports selected employees to Excel using Spreadsheet library.
       * Bulk Export to Excel: Exports only selected employees to Excel file.
       */
=======
>>>>>>> master
      onBulkExportExcel: function () {
        var oTable = this.byId('employeeTable');
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
          MessageToast.show('No employees selected');
          return;
        }

        var aData = aSelected.map((item) =>
<<<<<<< HEAD
          item.getBindingContext().getObject()
=======
          item.getBindingContext('employees').getObject()
>>>>>>> master
        );

        var aCols = [
          { label: 'ID', property: 'id' },
          { label: 'Name', property: 'name' },
          { label: 'Department', property: 'department' },
          { label: 'Position', property: 'position' },
          { label: 'Email', property: 'email' },
        ];

        var oSheet = new Spreadsheet({
          workbook: { columns: aCols },
          dataSource: aData,
          fileName: 'SelectedEmployees.xlsx',
        });

        oSheet.build().finally(() => oSheet.destroy());
      },

<<<<<<< HEAD
      // ======================== END BULK OPERATIONS FEATURE ======================== //

      // ======================== BULK EXPORT TO PDF FEATURE ======================== //
      /**
       * Exports selected employees to PDF using jsPDF and autoTable.
       * Bulk Export to PDF: Exports only selected employees to PDF file.
       */
=======
>>>>>>> master
      onBulkExportPDF: function () {
        var oTable = this.byId('employeeTable');
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
          MessageToast.show('No employees selected');
          return;
        }

        var aData = aSelected.map((item) =>
<<<<<<< HEAD
          item.getBindingContext().getObject()
=======
          item.getBindingContext('employees').getObject()
>>>>>>> master
        );

        sap.ui.require(
          ['cic/cictrial/util/LibraryLoader'],
          function (LibraryLoader) {
            LibraryLoader.loadJsPDF().then(function () {
              const { jsPDF } = window.jspdf;
              var doc = new jsPDF();
              doc.text('Selected Employee List', 14, 20);
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
              doc.save('SelectedEmployees.pdf');
            });
          }
        );
      },
<<<<<<< HEAD
      // ======================== END BULK EXPORT TO PDF FEATURE ======================== //

      // ======================== TABLE SORTING FEATURE ======================== //
      /**
       * Handles sorting for employee table columns
       * @param {object} oEvent - sort event from column header
       */
=======

>>>>>>> master
      onSort: function (oEvent) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var sSortProperty = oEvent.getSource().getSortProperty();
<<<<<<< HEAD
        // Toggle sorting order (asc/desc)
=======
>>>>>>> master
        var bDescending = oEvent.getSource().getSortOrder() === 'Descending';
        var oSorter = new sap.ui.model.Sorter(sSortProperty, bDescending);
        oBinding.sort(oSorter);
      },
<<<<<<< HEAD
      // ======================== END TABLE SORTING FEATURE ======================== //
=======
>>>>>>> master
    });
  }
);
