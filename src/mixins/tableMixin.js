const mixin = {
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: true,
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
    handleEditClose() {
      this.modalEdit = false;
    },
    handleClose() {
      this.loading = false;
      this.modalView = false;
    }
  }
};
export default mixin;
