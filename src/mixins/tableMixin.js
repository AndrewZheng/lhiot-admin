const mixin = {
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      tableDataSelected: [],
      loading: true,
      searchLoading: false,
      clearSearchLoading: false,
      modalEditLoading: false,
      modalAdd: false,
      modalView: false,
      modalEdit: false,
      tempModalType: 'create',
      modalType: {
        view: 'view',
        edit: 'edit',
        create: 'create'
      }
    };
  },
  computed: {
    isCreate() {
      return this.tempModalType === this.modalType.create;
    },
    isEdit() {
      return this.tempModalType === this.modalType.edit;
    }
  },
  methods: {
    changePage(page) {
      this.searchRowData.page = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    handleViewClose() {
      this.modalView = false;
    },
    handleEditClose() {
      this.modalEdit = false;
    },
    handleClose() {
      this.loading = false;
      this.modalView = false;
    },
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    handleClear() {
      // 重置数据
      this.searchRowData.expandType = null;
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
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    handleBatchDel() {
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
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
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
