let minxin = {
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
      this.resetSearchRowData();
      this.clearSearchLoading = true;
      this.handleSearch();
    }
  }
};
export default minxin;
