<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>当前选中：{{ parentCategory.categoryName }}</h6>
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
                  v-model="searchRowData.categoryName"
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
              <Button v-waves type="success" class="mr5" @click="handleCreate">
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
        <Form ref="editForm" :label-width="100" :model="faqCategory" :rules="ruleInline">
          <FormItem label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem label="父级分类:">
            <i-col>{{ parentCategory.categoryName }}</i-col>
          </FormItem>
          <FormItem label="子分类名:" prop="categoryName">
            <Input v-model="faqCategory.categoryName" placeholder="子分类名"></Input>
          </FormItem>
          <FormItem label="子分类英文名:" prop="categoryEnName">
            <Input v-model="faqCategory.categoryEnName" placeholder="子分类英文名"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  createFaqCategories,
  deleteFaqCategories,
  getFaqCategoriesPages,
  getFaqCategoriesTree,
  editFaqCategories
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';

const faqCategory = {
  id: 0,
  parentId: 0,
  categoryName: '',
  categoryEnName: '',
  faqs: null
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
  mixins: [tableMixin],
  data() {
    return {
      menuData: [],
      currentParentId: 0,
      currentParentName: '',
      ruleInline: {
        categoryName: { required: true, message: '请填写FAQ分类中文名称' },
        categoryEnName: { required: true, message: '请填写FAQ分类英文名称' }
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
          title: '父级ID',
          key: 'parentId',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '分类名称',
          key: 'categoryName',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '分类英文名称',
          key: 'categoryEnName',
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
      faqCategory: _.cloneDeep(faqCategory),
      parentCategory: _.cloneDeep(faqCategory),
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      getFaqCategoriesPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
          this.clearSearchLoading = false;
        });
    },
    handleCreate() {
      this.faqCategory = _.cloneDeep(faqCategory);
      this.faqCategory.currentParentId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.faqCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.faqCategory.parentId = !this.parentCategory.id ? 0 : this.parentCategory.id;
          if (this.isCreate) {
            this.createRowData();
          } else if (this.isEdit) {
            this.editRowData();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRowData() {
      this.modalEditLoading = true;
      createFaqCategories(this.faqCategory)
        .then(res => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    editRowData() {
      this.modalEditLoading = true;
      editFaqCategories(this.faqCategory)
        .then(res => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
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
        });
    },
    initMenuList() {
      getFaqCategoriesTree().then(res => {
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
      // 展开当前节点
      if (typeof data.expand === 'undefined') {
        // this.$set(data, 'expend', true);
        this.$set(data, 'expend', false);
        // if (data.children) {
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.parentCategory.id = data.id;
      this.parentCategory.categoryName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
