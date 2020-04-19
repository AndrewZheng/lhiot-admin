<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="2">
        <Card>
          <h6>
            当前选中：
            <span
              class="brand-red font-sm"
            >{{ parentCategory.groupName? parentCategory.groupName: '全部父级分类' }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="14"
            :operate-area-column="10"
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
              <Row>
                <Input
                  v-model="searchRowData.groupName"
                  placeholder="分类名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Button
                  :searchLoading="searchLoading"
                  class="search-btn mr5"
                  type="primary"
                  @click="handleSearch"
                >
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button
                  v-waves
                  :loading="clearSearchLoading"
                  class="search-btn"
                  type="info"
                  @click="handleClear"
                >
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
            <div slot="operations">
              <Button
                v-waves
                :loading="clearSearchLoading"
                type="warning"
                class="mr5"
                @click="handleBack"
              >
                <Icon type="ios-arrow-back" />&nbsp;返回父级分类
              </Button>
              <Button v-waves type="success" class="mr5" @click="handleCreateParent">
                <Icon type="md-add" />添加父分类
              </Button>
              <Button v-waves type="success" class="mr5" @click="handleCreateSon">
                <Icon type="md-add" />添加子分类
              </Button>
              <Poptip
                confirm
                placement="bottom"
                style="width: 100px"
                title="您确认删除选中的内容吗?"
                @on-ok="handleBatchDel"
              >
                <Button type="error" class="mr5">
                  <Icon type="md-trash" />批量删除
                </Button>
              </Poptip>
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
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <i-col>{{ isCreate?'创建商品分类':'修改商品分类' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :label-width="100" :model="currentCategory" :rules="ruleInline">
          <FormItem v-show="addSon" label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem v-show="addSon" label="父级分类:">
            <i-col>{{ parentCategory.groupName }}</i-col>
          </FormItem>
          <FormItem label="分类名称:" prop="groupName">
            <Input v-model="currentCategory.groupName" placeholder="分类名称"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  createProductCategories,
  delProductCategories,
  getProductCategoriesPages,
  getProductCategoriesTree,
  editProductCategories
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';

const currentCategory = {
  id: 0,
  parentId: 0,
  groupName: ''
};

const searchRowData = {
  parentId: 0,
  groupName: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin],
  data() {
    return {
      menuData: [],
      addSon: false,
      currentCategory: _.cloneDeep(currentCategory),
      parentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(searchRowData),
      currentParentName: '',
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '商品分类ID',
          key: 'id',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '分类名',
          key: 'groupName',
          sortable: true,
          align: 'center',

          minWidth: 150
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 150,
          options: ['edit', 'delete']
        }
      ],
      ruleInline: {
        groupName: { required: true, message: '请填写分类名称' }
      }
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductCategoriesPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleCreateSon() {
      if (!this.parentCategory.id) {
        this.$Message.warning('请先从左侧选择一个父分类');
        return;
      }
      this.addSon = true;
      this.resetFields();
      this.currentCategory = _.cloneDeep(currentCategory);
      this.currentCategory.parentId = this.parentCategory.id;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleCreateParent() {
      this.addSon = false;
      this.resetFields();
      this.currentCategory = _.cloneDeep(currentCategory);
      this.currentCategory.parentId = 0;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    // 编辑分类
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善商品分类信息!');
        }
      });
    },
    createTableRow() {
      this.modalEditLoading = true;
      createProductCategories(this.currentCategory)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('创建成功！');
          this.initMenuList();
          this.getTableData();
        })
        .finally(res => {
          this.modalEditLoading = false;
        });
    },
    editTableRow() {
      this.modalEditLoading = true;
      editProductCategories(this.currentCategory)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('修改成功！');
          this.initMenuList();
          this.getTableData();
        })
        .finally(res => {
          this.modalEditLoading = false;
        });
    },
    handleBack() {
      this.parentCategory.id = 0;
      this.parentCategory.groupName = '全部父级分类';
      this.searchRowData = _.cloneDeep(searchRowData);
      this.getTableData();
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      delProductCategories({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.initMenuList();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductCategoriesTree().then(res => {
        const menuList = buildMenu(res.array);
        const map = {
          title: 'title',
          children: 'children'
        };
        this.menuData = convertTree(menuList, map, true);
        this.getTableData();
      });
    },
    renderContent(h, { root, node, data }) {
      if (data.type === 'PARENT') {
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
              <CommonIcon type='ios-folder' class='mr10' />
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
              <CommonIcon type='ios-paper' class='mr10' />
            </span>
            <span>{data.title}</span>
          </div>
        );
      }
    },
    handleClick({ root, node, data }) {
      this.loading = true;
      // 递归展开当前节点
      if (typeof data.expand === 'undefined') {
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      }
      if (typeof data.selected === 'undefined') {
        this.$set(data, 'selected', true);
      } else {
        this.$set(data, 'selected', !data.selected);
      }
      this.parentCategory.id = data.id;
      this.parentCategory.groupName = data.title;
      this.searchRowData.parentId = data.id;
      this.getTableData();
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(searchRowData);
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
