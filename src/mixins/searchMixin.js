const minxin = {
  data() {
    return {
      searchLoading: false,
      clearSearchLoading: false
    };
  },
  methods: {
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.openStatus = false;
      this.getTableData();
    },
    handleClear() {
      this.searchRowData.expandType = null;
      this.searchRowData.productType = null;
      this.button = "今日";
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
    }
  }
};
export default minxin;
