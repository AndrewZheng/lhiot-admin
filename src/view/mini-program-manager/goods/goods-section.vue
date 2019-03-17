<template>
  <div class="m-role">
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
                  v-model="searchRowData.sectionName"
                  placeholder="板块名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                >
                </Input>
                <Input
                  v-model="searchRowData.productName"
                  placeholder="商品名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                >
                </Input>
                <Input
                  v-model="searchRowData.applyType"
                  placeholder="应用类型"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                >
                </Input>
                <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
                <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
                  <Icon type="md-refresh"/>&nbsp;清除条件
                </Button>
              </Row>
            </div>
            <div slot="operations">
              <Button v-waves type="success" class="mr5" @click="createTableRow">
                <Icon type="md-add"/>
                添加
              </Button>
              <Button v-waves type="primary" class="mr5" @click="createTableRow">
                <Icon type="md-repeat" />
                更换板块
              </Button>
              <Poptip
                confirm
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
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="total"
                :current="page"
                show-sizer
                show-total
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
            </Row>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  createProductStandard,
  deleteProductStandard,
  getProductStandardsPages,
  editProductStandard,
  getProductSectionTree
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import { fenToYuanDot2 } from '@/libs/util';
import { customPlanStatusConvert } from '@/libs/converStatus';

const productSectionDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  specification: '',
  standardQty: 0,
  unitId: 0,
  productUnit: '',
  price: 0,
  salePrice: 0,
  rank: 0,
  description: '',
  shelvesStatus: '',
  applyType: '',
  productName: '',
  createUser: null,
  image: '',
  productDescription: '',
  productCode: '',
  baseProductName: '',
  baseProductDescription: '',
  groupId: 0,
  groupName: '',
  sourceCode: '',
  baseImage: '',
  smallImage: '',
  largeImage: '',
  status: '',
  baseUnitId: 0,
  baseUnit: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null
};

const roleRowData = {
  applyType: null,
  sectionName: '',
  productName: '',
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
          title: '商品条码',
          key: 'barcode',
          sortable: true,
          align: 'center'
        },
        {
          title: '商品编号',
          key: 'productCode',
          sortable: true,
          align: 'center',
          width: 150
        },
        {
          title: '商品名称',
          key: 'productName',
          sortable: true,
          align: 'center'
        },
        {
          title: '商品规格',
          key: 'specification',
          sortable: true,
          align: 'center'
        },
        {
          title: '商品单位',
          key: 'productUnit',
          sortable: true,
          align: 'center'
        },
        {
          title: '商品价格',
          key: 'price',
          sortable: true,
          align: 'center',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品状态',
          key: 'shelvesStatus',
          sortable: true,
          align: 'center',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return <div><tag color='success'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            } else if (row.shelvesStatus === 'INVALID') {
              return <div><tag color='error'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
            }
            return <div><tag color='primary'>{customPlanStatusConvert(row.shelvesStatus).label}</tag></div>;
          }
        },
        {
          title: '排序',
          key: 'rank',
          sortable: true,
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          options: ['delete']
        }
      ],
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentParentId: 0,
      currentCategory: this._.cloneDeep(productSectionDetail),
      parentCategory: this._.cloneDeep(productSectionDetail),
      searchRowData: this._.cloneDeep(roleRowData),
      treeData: this._.cloneDeep(productSectionDetail)
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
        this.currentCategory = this._.cloneDeep(productSectionDetail);
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
      this.modalEditLoading = true;
      this.modalViewLoading = true;
      if (!this.parentCategory.id) {
        this.currentCategory.parentId = 0;
      } else {
        this.currentCategory.parentId = this.parentCategory.id;
      }
      if (this.tempModalType === this.modalType.create) {
        createProductStandard(this.currentCategory
        ).then(res => {

        }).finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
      } else if (this.tempModalType === this.modalType.edit) {
        editProductStandard(this.currentCategory).then(res => {
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
      deleteProductStandard({
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
      getProductStandardsPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree(this.treeData).then(res => {
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
      this.parentCategory.groupName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
      // 获取新数据
      this.getTableData();
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
