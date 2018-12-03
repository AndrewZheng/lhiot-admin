let mixin = {
  data() {
    return {
      //选中的行
      tableDataSelected: [],
    }
  },
  methods: {
    onSelectionAll(selection) {
      this.tableDataSelected = selection
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection
    },
  }
}
export default mixin
