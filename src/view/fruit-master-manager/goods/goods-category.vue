<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
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
                <Button v-waves type="success" class="mr5" @click="handleView">
                  <Icon type="md-add"/>
                  子分类
                </Button>
                <Button v-waves type="error" class="mr5" @click="deleteChildren">
                  <Icon type="md-close"/>
                  删除
                </Button>
              </div>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize"
                    show-sizer
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
        <span>创建商品分类</span>
      </p>
      <div class="modal-content">
        <Form  :label-width="100">
          <FormItem label="父级分类:">
            <i-col></i-col>
          </FormItem>
          <FormItem label="子分类名:">
            <Input  placeholder="" ></Input>
          </FormItem>
          <FormItem label="序号:">
            <Input placeholder="" ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!--编辑菜单 -->
    <Modal
      v-model="modalEditView"
    >
      <p slot="header">
        <span>编辑商品分类</span>
      </p>
      <div class="modal-content">
        <Form  :label-width="100">
          <FormItem label="父级分类:">
            <i-col></i-col>
          </FormItem>
          <FormItem label="子分类名:">
            <Input  placeholder="" ></Input>
          </FormItem>
          <FormItem label="序号:">
            <Input placeholder="" ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getFruitMastGoodsCategoryData} from "@/api/fruitermaster";
  import {buildMenu, changeObjKeyName, convertTree, getNewTagList} from '@/libs/util';
  import CommonIcon from '_c/common-icon';
  import {getMenuList} from '@/api/system';

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
      Tables,
      CommonIcon
    },
    data() {
      return {
        menuData: [],
        columns: [
          {
            title: '分类名',
            key: 'name',
            sortable: true,
            align: 'center',
            fixed: 'left',
            minWidth: 150
          },
          {
            title: '序号',
            align: 'center',
            key: 'code',
            minWidth: 150
          },
          {
            title: '操作',
            key: 'handle',
            minWidth: 150,
            options: ['edit', 'delete'],
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        modalEditView: false,
        image: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        userDetail: userDetail,
        searchRowData: roleRowData,
      };
    },
    created() {
      this.initMenuList();
    },
    methods: {
      addChildren() {
      },
      deleteChildren() {

      },
      renderContent(h, {root, node, data}) {
        if (data.type == 'PARENT') {
          return (
            <div
              style={{
                display: 'inline-block',
                width: '100%',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
            <span>
              <CommonIcon type="ios-folder" class="mr10"/>
            </span>
              <span onClick={() => this.handleClick({root, node, data})}>
              {data.title}
            </span>
            </div>
          );
        } else {
          return (
            <div
              style={{
                display: 'inline-block',
                width: '100%',
                fontSize: '14px',
                cursor: 'auto'
              }}
            >
            <span>
              <CommonIcon type="ios-paper" class="mr10"/>
            </span>
              <span>{data.title}</span>
            </div>
          );
        }
      },
      handleView(){
        this.modalView = true;
      },
      handleClose() {
        this.modalView = false;
      },
      handleDelete(params) {

      },
      handleEdit(params) {
        this.modalEditView = true;
      },
      handleSearch() {
      },
      changePage(page) {
        this.page = page;
        this.getTableData();
      },
      changePageSize(pageSize) {
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
      },
      initMenuList() {
        getMenuList().then(res => {
          if (res && res.array.length > 0) {
            const menuList = buildMenu(res.array);
            const map = {
              title: 'title',
              children: 'children'
            };
            this.menuData = convertTree(menuList, map, true);
            this.getTableData();
          }
        });
      },
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
