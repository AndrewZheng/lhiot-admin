const mixin = {
  data() {
    return {
      tableData: [],
      tableDataSelected: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: true,
      searchLoading: false,
      clearSearchLoading: false,
      createLoading: false,
      modalViewLoading: false,
      modalEditLoading: false,
      exportExcelLoading: false,
      modalAdd: false,
      modalView: false,
      modalEdit: false,
      modalType: {
        view: 'view',
        edit: 'edit',
        create: 'create'
      },
      tempModalType: 'create'
    };
  },
  computed: {
    isCreate() {
      return this.tempModalType === this.modalType.create;
    },
    isEdit() {
      return this.tempModalType === this.modalType.edit;
    },
    isView() {
      return this.tempModalType === this.modalType.view;
    }
  },
  methods: {
    changePage(page) {
      this.searchRowData.page = page;
      this.getTableData();
      this.openStatus = false;
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
      this.openStatus = false;
    },
    handleEditClose() {
      this.modalEdit = false;
      this.data = [];
      this.standardIdsArray = [];
    },
    handleClose() {
      this.loading = false;
      this.modalView = false;
    },
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.openStatus = false;
      this.getTableData();
    },
    handleClear() {
      this.searchRowData.expandType = null;
      this.searchRowData.productType = null;
      this.button = '今日';
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    handleExport(filename) {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
      this.$refs.tables.exportCsv({
        filename: filename + '-' + new Date().valueOf() + '.csv'
      });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteTable(strTempDelete);
    },
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === 'undefined') {
          this.$set(item, 'expend', false);
        } else {
          item.expand = !item.expand;
        }
        if (item.children) {
          this.expandChildren(item.children);
        }
      });
    }
  }
};
export default mixin;
