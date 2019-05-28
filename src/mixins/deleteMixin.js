const mixin = {
  data() {
    return {
      tableDataSelected: []
    };
  },
  methods: {
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
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
    }
  }
};
export default mixin;
