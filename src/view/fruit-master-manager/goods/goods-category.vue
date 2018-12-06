<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>当前选中：{{currentParentName}}</h6>
          <tables ref="tables" editable searchable
                  border
                  search-place="top"
                  v-model="tableData"
                  :columns="columns"
                  :loading="loading"
                  @on-delete="handleDelete"
                  @on-edit="handleEdit"
                  @on-select-all="onSelectionAll"
                  @on-selection-change="onSelectionChange"
          >
            <div slot="searchCondition">
              <div slot="operations">
                <Button v-waves type="success" class="mr5" @click="handleView">
                  <Icon type="md-add"/>
                  子分类
                </Button>
                <Poptip confirm
                        placement="bottom"
                        style="width: 100px"
                        title="您确认删除选中的内容吗?"
                        @on-ok="poptipOk"
                >
                  <Button type="error" class="mr5">
                    <Icon type="md-trash"/>
                    删除
                  </Button>
                </Poptip>
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
        <Form :label-width="100">
          <FormItem label="父级分类:">
            <i-col>{{currentParentName}}</i-col>
          </FormItem>
          <FormItem label="子分类名:">
            <Input placeholder="请输入子分类名" v-model="currentCategory.currentName"/>
          </FormItem>
          <FormItem label="序号:">
            <Input placeholder="请输入序号" :number="true" v-model="currentCategory.rank"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="asyncOK">确定</Button>
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
        <Form :label-width="100">
          <FormItem label="父级分类:">
            <i-col>{{currentParentName}}</i-col>
          </FormItem>
          <FormItem label="子分类名:">
            <Input placeholder="" v-model="editCategory.currentName"/>
          </FormItem>
          <FormItem label="序号:">
            <Input placeholder="" v-model="editCategory.rank"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalEditLoading" @click="asyncEditOK">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {
    addProductCategories,
    deleteProductCategories,
    getFruitMastGoodsCategoryData,
    getProductCategoriesPages,
    getProductCategoriesTree,
    putProductCategories
  } from "@/api/fruitermaster";
  import {buildMenu, changeObjKeyName, convertTree, getNewTagList} from '@/libs/util';
  import CommonIcon from '_c/common-icon';

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
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '分类名',
            key: 'groupName',
            sortable: true,
            align: 'center',

            minWidth: 150
          },
          {
            title: '序号',
            align: 'center',
            key: 'rank',
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
        modalViewLoading: false,
        modalEditLoading: false,
        currentParentName: '',
        currentParentId: 0,
        currentCategory: {
          currentId: 0,
          currentName: '',
          rank: null
        },
        editCategory: {
          currentId: 0,
          currentName: '',
          rank: null
        },
        //选中的行
        tableDataSelected: []
      };
    },
    created() {
      this.initMenuList();
    },
    methods: {
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
                cursor: 'pointer'
              }}
            >
            <span>
              <CommonIcon type="ios-paper" class="mr10"/>
            </span>
              <span onClick={() => this.handleClick({root, node, data})}>
              {data.title}
            </span>
            </div>
          );
        }
      },
      onSelectionAll(selection) {
        this.tableDataSelected = selection
      },
      onSelectionChange(selection) {
        this.tableDataSelected = selection
      },
      poptipOk() {
        if (this.tableDataSelected.length < 1) {
          this.$Message.warning('请选中要删除的行');
          return
        }
        let tempDeleteList = []
        console.log(this.tableDataSelected[0]);
        this.tableDataSelected.forEach(value => {
          tempDeleteList.push(value.id)
        })
        let strTempDelete = tempDeleteList.join(',')
        this.deleteTable(strTempDelete)
      },
      //添加子分类
      asyncOK() {
        if (!this.currentCategory.currentName) {
          this.$Message.warning('请输入子分类');
          return
        }
        if (!this.currentCategory.rank) {
          this.$Message.warning('亲输入序号');
          return
        }
        this.modalViewLoading = true
        addProductCategories(
          {
            groupName: this.currentCategory.currentName,
            parentId: this.currentParentId,
            rank: this.currentCategory.rank
          }
        ).then(res => {
          this.modalViewLoading = false
          this.modalView = false
          this.currentCategory.currentName = ''
          this.currentCategory.rank = null
          this.initMenuList()
        })
      },
      //编辑
      asyncEditOK() {
        if (!this.editCategory.currentName) {
          this.$Message.warning('请输入子分类');
          return
        }
        if (!this.editCategory.rank) {
          this.$Message.warning('亲输入序号');
          return
        }
        this.modalEditLoading = true
        putProductCategories({
          parentId: this.currentParentId,
          id: this.editCategory.currentId,
          groupName: this.editCategory.currentName,
          rank: this.editCategory.rank
        }).then(res => {
          this.modalEditLoading = false
          this.modalEditView = false
          this.editCategory.currentName = '';
          this.editCategory.rank = null;
          this.getTableData()
        })
      },
      handleView() {
        this.modalView = true;
      },
      handleClose() {
        this.modalView = false;
      },
      handleEditClose() {
        this.modalEditView = false
      },
      //删除单个行
      handleDelete(params) {
        this.tableDataSelected = []
        this.tableDataSelected.push(params.row)
        this.deleteTable(params.row.id)
      },
      //删除
      deleteTable(ids) {
        this.loading = true
        deleteProductCategories({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.pageSize)
            if (this.tableData.length === this.tableDataSelected.length && this.page === totalPage && this.page !== 1) {
              this.page -= 1
            }
            this.tableDataSelected = [];
            this.initMenuList();
          }
        ).catch(err=>{

        })
      },
      //编辑分类
      handleEdit(params) {
        this.editCategory.currentId = params.row.id;
        this.editCategory.currentName = params.row.groupName;
        this.editCategory.rank = params.row.rank;
        this.modalEditView = true;
      },
      //翻页
      changePage(page) {
        this.page = page;
        this.getTableData();
      },
      //改变一页的数据数量
      changePageSize(pageSize) {
        this.page = 1;
        this.pageSize = pageSize;
        this.getTableData();
      },
      getTableData() {
        this.loading = true;
        getProductCategoriesPages({
          page: this.page,
          rows: this.pageSize,
          parentId: this.currentParentId
        }).then(res => {
          if (this.menuData.length > 0) {
            this.tableData = res.array;
            this.total = res.total;
            this.loading = false;
          }
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      },
      //初始化商品菜单列表
      initMenuList() {
        getProductCategoriesTree().then(res => {
          if (res && res.array.length > 0) {
            const menuList = buildMenu(res.array);
            const map = {
              title: 'title',
              children: 'children'
            };
            this.menuData = convertTree(menuList, map, true);
            if (this.menuData.length > 0) {
              this.getTableData();
            }
          }
        });
      },

      handleClick({root, node, data}) {
        this.loading = true
        // 展开当前节点
        if (typeof data.expand === 'undefined') {
          this.$set(data, 'expend', true);
          if (data.children) {
            this.expandChildren(data.children);
          }
        } else {
          // data.expand = !data.expand;
        }
        this.currentParentName = data.title;
        this.currentParentId = data.id;
        this.page = 1;
        this.row = 10;
        // 获取新数据
        this.getTableData();
      },
      expandChildren(array) {
        array.forEach(item => {
          if (typeof item.expand === 'undefined') {
            this.$set(item, 'expend', true);
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