<template>
  <div class="m-content">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>当前选中：{{ parentCategory.groupName }}</h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            editable
            searchable
            border
            search-place="top"
            @on-delete="handleDelete"
            @on-edit="handleEdit"
            @on-select-all="onSelectionAll"
            @on-selection-change="onSelectionChange"
          >
            <div slot="searchCondition">
              <div slot="operations">
                <Button v-waves type="success" class="mr5" @click="createTableRow">
                  <Icon type="md-add" />
                  子分类
                </Button>
                <Poptip
                  confirm
                  placement="bottom"
                  style="width: 100px"
                  title="您确认删除选中的内容吗?"
                  @on-ok="poptipOk"
                >
                  <Button type="error" class="mr5">
                    <Icon type="md-trash" />
                    删除
                  </Button>
                </Poptip>
              </div>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="total"
                :current="page"
                show-sizer
                show-total
                @on-change="changePage"
                @on-page-size-change="changePageSize"
              ></Page>
            </Row>
          </div>
        </Card>
      </i-col>
    </Row>

    <!--编辑菜单 -->
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
    >
      <p slot="header">
        <span>编辑商品分类</span>
      </p>
      <div class="modal-content">
        <Form :label-width="100">
          <FormItem label="父级分类:">
            <i-col>{{ parentCategory.groupName }}</i-col>
          </FormItem>
          <FormItem label="子分类名:">
            <Input v-model="currentCategory.groupName" placeholder="子分类名"></Input>
          </FormItem>
          <FormItem label="序号:">
            <InputNumber v-model="currentCategory.rank" :min="0" placeholder="序号"></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="asyncEditOK">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  addProductCategories,
  deleteProductCategories,
  getProductCategoriesPages,
  getProductCategoriesTree,
  putProductCategories
} from '@/api/fruitermaster';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';

const currentCategory = {
  parentId: 0,
  groupName: '',
  rank: null
};
const roleRowData = {
  parentId: 0,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
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
          options: ['edit', 'delete']
        }
      ],
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentParentId: 0,
      currentCategory: this._.cloneDeep(currentCategory),
      parentCategory: this._.cloneDeep(currentCategory),
      searchRowData: this._.cloneDeep(roleRowData)
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
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
              <CommonIcon type='ios-folder' class='mr10'/>
            </span>
            <span onClick={() => this.handleClick({ root, node, data })}>
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
              <CommonIcon type='ios-paper' class='mr10'/>
            </span>
            <span >
              {data.title}
            </span>
          </div>
        );
      }
    },
    createTableRow() {
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = this._.cloneDeep(currentCategory);
      }
      this.currentCategory.currentParentId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    asyncEditOK() {
      if (!this.currentCategory.groupName) {
        this.$Message.warning('请输入子分类');
        return;
      }
      if (!this.currentCategory.rank) {
        this.$Message.warning('请输入序号');
        return;
      }
      const reg = /^-?\d+$/;
      if (!reg.test(this.currentCategory.rank)) {
        this.$Message.warning('排序必须是整数');
        return;
      }
      this.modalEditLoading = true;
      this.modalViewLoading = true;
      if (!this.parentCategory.id) {
        this.currentCategory.parentId = 0;
      } else {
        this.currentCategory.parentId = this.parentCategory.id;
      }
      if (this.tempModalType === this.modalType.create) {
        addProductCategories(this.currentCategory
        ).then(res => {

        }).finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
      } else if (this.tempModalType === this.modalType.edit) {
        putProductCategories(this.currentCategory).then(res => {
        }).finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
      }
    },
    handleEditClose() {
      this.modalEdit = false;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductCategories({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.pageSize);
        if (this.tableData.length === this.tableDataSelected.length && this.page === totalPage && this.page !== 1) {
          this.page -= 1;
        }
        this.tableDataSelected = [];
        this.initMenuList();
      }
      ).catch(() => {
        this.loading = false;
      });
    },
    // 编辑分类
    handleEdit(params) {
      // this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      this.loading = true;
      getProductCategoriesPages(this.searchRowData).then(res => {
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
    // 初始化商品菜单列表
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

    handleClick({ root, node, data }) {
      this.loading = true;
      // 展开当前节点
      if (typeof data.expand === 'undefined') {
        this.$set(data, 'expend', true);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.parentCategory.id = data.id;
      this.parentCategory.groupName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
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
