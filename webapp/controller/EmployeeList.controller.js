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
      onInit: function () {
        var oModel = this.getOwnerComponent().getModel('employees');
        if (oModel) {
          console.log('Model loaded successfully:', oModel.getData());
          this._updateEmployeeCount();
        } else {
          console.error('Employees model not found!');
        }
      },

      onItemPress: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext('employees')
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeDetail', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

      onAddEmployee: function () {
        this.getOwnerComponent().getRouter().navTo('EmployeeCreate');
      },

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
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var aFilters = [];

        var sSearchQuery =
          search !== undefined ? search : this.byId('searchField').getValue();
        var sDepartment =
          department !== undefined
            ? department
            : this.byId('departmentFilter').getSelectedKey();

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

      _toggleNoDataMessage: function (bShow) {
        this.byId('employeeTable').setVisible(!bShow);
        this.byId('noDataMessage').setVisible(bShow);
      },

      onQuickEdit: function (oEvent) {
        var sEmployeeId = oEvent
          .getSource()
          .getBindingContext('employees')
          .getProperty('id');
        if (sEmployeeId) {
          this.getOwnerComponent()
            .getRouter()
            .navTo('EmployeeEdit', { EmployeeID: sEmployeeId });
        } else {
          MessageToast.show('Error: Employee ID not found');
        }
      },

      onQuickDelete: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext('employees');
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

      _deleteEmployeeFromList: function (sEmployeeId) {
        var oModel = this.getOwnerComponent().getModel('employees');
        var aEmployees = oModel.getProperty('/employees') || [];
        var iIndex = aEmployees.findIndex((emp) => emp.id === sEmployeeId);

        if (iIndex !== -1) {
          aEmployees.splice(iIndex, 1);
          oModel.setProperty('/employees', aEmployees);
          MessageToast.show('Employee deleted successfully!');
          this._updateEmployeeCount();
        } else {
          MessageToast.show('Employee not found!');
        }
      },

      onRefresh: function () {
        this.getOwnerComponent().getModel('employees').refresh();
        this.onClearFilters();
        MessageToast.show('Data refreshed');
      },

      onExportExcel: function () {
        var oModel = this.getOwnerComponent().getModel('employees');
        var aData = oModel.getProperty('/employees') || [];

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
          fileName: 'Employees.xlsx',
        });

        oSheet.build().finally(() => oSheet.destroy());
      },

      onExportPDF: function () {
        var that = this;
        sap.ui.require(
          ['cic/cictrial/util/LibraryLoader'],
          function (LibraryLoader) {
            LibraryLoader.loadJsPDF().then(function () {
              var oModel = that.getOwnerComponent().getModel('employees');
              var aData = oModel.getProperty('/employees') || [];

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

      _updateEmployeeCount: function () {
        var aEmployees =
          this.getOwnerComponent()
            .getModel('employees')
            .getProperty('/employees') || [];
        console.log(`Total employees: ${aEmployees.length}`);
      },

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
                var oModel = this.getOwnerComponent().getModel('employees');
                var aEmployees = oModel.getProperty('/employees') || [];

                aSelected.forEach((row) => {
                  var sId = row
                    .getBindingContext('employees')
                    .getProperty('id');
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

      onBulkExportExcel: function () {
        var oTable = this.byId('employeeTable');
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
          MessageToast.show('No employees selected');
          return;
        }

        var aData = aSelected.map((item) =>
          item.getBindingContext('employees').getObject()
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

      onBulkExportPDF: function () {
        var oTable = this.byId('employeeTable');
        var aSelected = oTable.getSelectedItems();
        if (!aSelected.length) {
          MessageToast.show('No employees selected');
          return;
        }

        var aData = aSelected.map((item) =>
          item.getBindingContext('employees').getObject()
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

      onSort: function (oEvent) {
        var oTable = this.byId('employeeTable');
        var oBinding = oTable.getBinding('items');
        var sSortProperty = oEvent.getSource().getSortProperty();
        var bDescending = oEvent.getSource().getSortOrder() === 'Descending';
        var oSorter = new sap.ui.model.Sorter(sSortProperty, bDescending);
        oBinding.sort(oSorter);
      },
    });
  }
);
