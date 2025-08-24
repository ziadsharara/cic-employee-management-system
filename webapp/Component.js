sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'cic/cictrial/model/models',
    'sap/ui/model/json/JSONModel',
  ],
  (UIComponent, models, JSONModel) => {
    'use strict';

    return UIComponent.extend('cic.cictrial.Component', {
      metadata: {
        manifest: 'json',
        interfaces: ['sap.ui.core.IAsyncContentCreation'],
      },

      init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), 'device');

        // Create and set the main data model (shared across all views)
        this._createMainDataModel();

        // enable routing
        this.getRouter().initialize();
      },

      /**
       * Create main data model with enhanced employee data
       */
      _createMainDataModel: function () {
        // Enhanced mock data with more fields
        var oData = {
          employees: [
            {
              id: 'E001',
              name: 'John Doe',
              department: 'Sales',
              position: 'Sales Manager',
              email: 'john.doe@company.com',
              phone: '+20 100 123 4567',
              hireDate: '2020-03-15',
              salary: 75000,
              rating: 4.5,
              status: 'Active',
              photo: '',
            },
            {
              id: 'E002',
              name: 'Jane Smith',
              department: 'HR',
              position: 'HR Specialist',
              email: 'jane.smith@company.com',
              phone: '+20 100 234 5678',
              hireDate: '2019-08-22',
              salary: 68000,
              rating: 4.2,
              status: 'Active',
              photo: '',
            },
            {
              id: 'E003',
              name: 'Ali Hassan',
              department: 'IT',
              position: 'Software Developer',
              email: 'ali.hassan@company.com',
              phone: '+20 100 345 6789',
              hireDate: '2021-01-10',
              salary: 85000,
              rating: 4.8,
              status: 'Active',
              photo: '',
            },
            {
              id: 'E004',
              name: 'Fady Akram',
              department: 'Fiori',
              position: 'Fiori Developer',
              email: 'fady.akram@company.com',
              phone: '+20 100 456 7890',
              hireDate: '2022-05-30',
              salary: 90000,
              rating: 4.7,
              status: 'Active',
              photo: '',
            },
            {
              id: 'E005',
              name: 'Sarah Ahmed',
              department: 'Marketing',
              position: 'Marketing Coordinator',
              email: 'sarah.ahmed@company.com',
              phone: '+20 100 567 8901',
              hireDate: '2023-02-14',
              salary: 62000,
              rating: 4.1,
              status: 'On Leave',
              photo: '',
            },
          ],

          // Enhanced statistics
          statistics: {
            totalEmployees: 5,
            departmentCounts: {
              IT: 1,
              HR: 1,
              Sales: 1,
              Fiori: 1,
              Marketing: 1,
            },
            averageRating: 4.46,
            totalSalary: 380000,
            activeEmployees: 4,
            onLeaveEmployees: 1,
          },
        };

        // Create JSONModel and share with all Views
        var oMainModel = new JSONModel(oData);
        this.setModel(oMainModel); // Default model (no name)
      },
    });
  }
);
