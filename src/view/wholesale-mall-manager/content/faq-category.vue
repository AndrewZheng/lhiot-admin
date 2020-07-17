<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>当前选中：<span class="brand-red font-sm">{{ parentCategory.faqCategoryName?parentCategory.faqCategoryName:'全部分类' }}</span></h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="16"
            :operate-area-column="8"
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
                  v-model="searchRowData.faqCategoryName"
                  placeholder="分类名称"
                  class="search-input mr5"
                  style="width: auto"
                ></Input>
                <Button
                  :loading="loading"
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
              <Button v-waves type="success" class="mr5" @click="createTableRow">
                <Icon type="md-add" />添加
              </Button>
              <Poptip
                confirm
                placement="bottom"
                style="width: 100px"
                title="您确认删除选中的内容吗?"
                @on-ok="poptipOk"
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
        <span>编辑商品分类</span>
      </p>
      <div class="modal-content">
        <Form ref="editFrom" :label-width="100" :model="faqCategory" :rules="ruleInline">
          <FormItem label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem label="父级分类:">
            <i-col>{{ parentCategory.faqCategoryName?parentCategory.faqCategoryName:'全部分类' }}</i-col>
          </FormItem>
          <FormItem label="子分类名:" prop="faqCategoryName">
            <Input v-model="faqCategory.faqCategoryName" placeholder="子分类名"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSumbit('editFrom')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';

import {
  createFaqCategories,
  deleteFaqCategories,
  getFaqCategoriesPages,
  getFaqCategoriesTree,
  editFaqCategories
} from '@/api/lhfarm-small';
import { buildMenu, convertTree } from '@/libs/util';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';

const faqCategory = {
  id: 0,
  parentId: 0,
  faqCategoryName: '',
  faqs: null,
  createPerson: '',
  createTime: ''
};

const roleRowData = {
  parentId: 0,
  faqCategoryName: '',
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
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      faqCategory: this._.cloneDeep(faqCategory),
      parentCategory: this._.cloneDeep(faqCategory),
      searchRowData: this._.cloneDeep(roleRowData),
      ruleInline: {
        faqCategoryName: { required: true, message: '请输入分类名称' }
      },
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '分类ID',
          key: 'id',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '分类名称',
          key: 'faqCategoryName',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
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
      ]
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getFaqCategoriesPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getFaqCategoriesTree().then(res => {
        if (res && res.length > 0) {
          const menuList = buildMenu(res);
          const map = {
            title: 'faqCategoryName',
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
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.searchRowData.parentId = data.id;
      this.parentCategory.id = data.id;
      this.parentCategory.faqCategoryName = data.title;
      // 获取新数据
      this.getTableData();
    },
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
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === 'undefined') {
          // this.$set(item, 'expend', true);
          this.$set(item, 'expend', false);
          // } else {
        } else {
          item.expand = !item.expand;
        }
        if (item.children) {
          this.expandChildren(item.children);
        }
      });
    },
    // 编辑分类
    handleEdit(params) {
      this.$refs.editFrom.resetFields();
      this.tempModalType = this.modalType.edit;
      this.faqCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    createTableRow() {
      if (this.tempModalType !== this.modalType.create) {
        this.faqCategory = this._.cloneDeep(faqCategory);
      }
      this.faqCategory.parentId = this.parentCategory.id;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleSumbit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalEditLoading = true;
          this.modalViewLoading = true;
          if (!this.parentCategory.id) {
            this.faqCategory.parentId = 0;
          } else {
            this.faqCategory.parentId = this.parentCategory.id;
          }
          if (this.isCreate) {
            createFaqCategories(this.faqCategory)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              });
          } else if (this.isEdit) {
            editFaqCategories(this.faqCategory)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              });
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteFaqCategories({
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
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}

.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
