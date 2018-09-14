<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :loading="loading" :columns="columns" @on-delete="handleDelete"/>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
            <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </Row>
      </div>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables';
import { getTableData } from '@/api/data';
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        { title: '姓名', key: 'name', sortable: true },
        { title: '邮箱', key: 'email', editable: true },
        { title: '创建时间', key: 'createTime', sortable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['delete', 'edit'],
          button: [
            (h, params, vm) => {
              return h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      vm.$emit('on-delete', params);
                      vm.$emit(
                        'input',
                        params.tableData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      );
                    }
                  }
                }
                // [h("Button", {
                //    props: {
                //      type: "warning",
                //      icon: "md-create",
                //      size: "small"
                //   },
                //   on:{
                    
                //   }
                // })]
              );
            }
          ]
        }
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true
    };
  },
  computed: {},
  methods: {
    handleDelete(params) {
      console.log(params);
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    changePage(currentPage) {
      // console.log(currentPage);
      this.page = currentPage;
      this.getTableData();
    },
    changePageSize(pageSize) {
      // console.log(pageSize);
      // 如果切换页数需要变为页码1
      this.page= 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      getTableData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style>
</style>
