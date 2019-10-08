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
      this.getTableData();
    },
    handleClear() {
      // 重置数据
      this.searchRowData.expandType=null;
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
        // filename: `table-${new Date().valueOf()}.csv`
        filename: filename + '-' + new Date().valueOf() + '.csv'
      });
    }
  }
};
export default minxin;
