<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuData" ></Tree>
      </i-col>
      <i-col span="20"order="3">

    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-delete="handleDelete"
              @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <div slot="operations">
            <Button v-waves type="success" class="mr5" @click="addChildren">
              <Icon type="md-add"/>
              子菜单
            </Button>
            <Button v-waves type="error" class="mr5" @click="deleteChildren">
              <Icon type="md-close" />
              删除
            </Button>
          </div>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>
      </i-col>
    </Row>
    <!--查看菜单 -->
    <Modal
      v-model="modalView"
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">

      </div>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getFruitMastGoodsCategoryData} from "@/api/fruitermaster";

  const userDetail = {
    id: '',
    name: 0,
    phoneNumber: '',
    inviteCode: '',
    level: '',
    status: '',
    headStatus: '',
    cash: ''
  };
  const roleRowData = {
    name: '',
    phoneNumber: '',
    idCard: '',
    timeStart: '',
    timeEnd: '',
    status: ''
  };
  export default {
    components: {
      Tables
    },
    data() {
      return {
        menuData:
             [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          ,
        columns: [
          {
            title: '分类名',
            key: 'name',
            sortable: true,
            align:'center',
            fixed: 'left',
            minWidth:150
          },
          {
            title: '序号',
            align:'center',
            key: 'code',
            minWidth:150
          },
          {
            title: '操作',
            key: 'handle',
            align:'center',
            minWidth:150,
            options: ['edit','delete'],
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        image: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        userDetail: userDetail,
        searchRowData: roleRowData,
      };
    },
    created() {
      this.getTableData();
    },
    methods: {
      append () {

      },
      addChildren(){
        console.log('addChildren');
        // const children = this.menuData.children || [];
        // children.push({
        //   title: 'appended node',
        //   expand: true
        // });
        // this.$set(this.menuData, 'children', children);
      },
      deleteChildren(){

      },
      renderContent(){

      },
      handleClose() {
        this.modalView = false;
      },
      handleDelete(params){

      },
      handleEdit(params) {
        this.modalView = false;
      },
      handleSearch() {
      },
      changePage(page) {
        this.page = page;
        this.getTableData();
      },
      changePageSize(pageSize) {
        console.log(pageSize);
        this.page = 1;
        this.pageSize = pageSize;
        this.getTableData();
      },
      getTableData() {
        getFruitMastGoodsCategoryData({
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .img {
    width: 150px;
    height: auto !important
  }

  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
