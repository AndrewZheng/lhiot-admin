const mixin = {
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: true,
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
    handleEditClose() {
      this.modalEdit = false;
      this.data = [];
    },
    handleClose() {
      this.loading = false;
      this.modalView = false;

    },
    // 获取分类树展开函数
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
