<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="3" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="21" order="3">
        <Card>
          <h6>当前选中：<span class="brand-red font-sm">{{ parentCategory.groupName!=''? parentCategory.groupName : '全部板块' }}</span></h6>
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
            @on-select-all="onSelectionAll"
            @on-selection-change="onRelationSelectionChange"
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
              <Button v-waves type="primary" class="mr5" @click="handleEdit">
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

    <!--编辑菜单 -->
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :width="1000"
    >
      <p slot="header">
        <span>{{ tempModalType==modalType.create?'添加板块商品':'更换板块' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productStandardRelation" :rules="ruleInline">
          <Row v-if="tempModalType == modalType.edit">
            <FormItem label="请选择要更换的商品板块:">
              <Cascader
                :data="goodsSectionData"
                v-model="defaultGoodsSectionData"
                span="21"
                style="width: 70%"
                @on-change="goodsSectionChange"
              ></Cascader>
            </FormItem>
          </Row>
          <Row v-if="tempModalType == modalType.create">
            <FormItem>
              <tables
                ref="tables"
                :columns="productColumns"
                v-model="productData"
                search-place="top"
                searchable
                highlight-row
                border
                @on-select-all="onSelectionAll"
                @on-selection-change="onSelectionChange"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchProductRowData.barcode"
                      placeholder="商品条码"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    >
                    </Input>
                    <Input
                      v-model="searchProductRowData.productName"
                      placeholder="商品名称"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    >
                    </Input>
                    <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleProductSearch">
                      <Icon type="md-search"/>&nbsp;搜索
                    </Button>
                    <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="resetSearchProductRowData">
                      <Icon type="md-refresh"/>&nbsp;清除条件
                    </Button>
                  </Row>
                </div>
              </tables>
              <div style="margin: 10px;overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"></Page>
                </Row>
              </div>
            </FormItem>
            <FormItem label="排序排序:" prop="rank">
              <InputNumber :min="0" v-model="productStandardRelation.rank"></InputNumber>
            </FormItem>
          </Ro>
        </row></Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="asyncEditOK('modalEdit')">添加
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getProductSectionRelationPages,
  createProductSectionRelation,
  deleteProductSectionRelation,
  getProductStandardsPages,
  editProductSectionRelation,
  getProductSectionTree
} from '@/api/mini-program';
import { buildMenu, convertTree, convertTreeCategory } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import { fenToYuanDot2 } from '@/libs/util';
import { customPlanStatusConvert, appTypeConvert } from '@/libs/converStatus';
import { appTypeEnum } from '@/libs/enumerate';

const productStandardDetail = {
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
  shelvesStatus: null,
  applyType: null,
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
  sectionName: null,
  productName: null,
  barcode: null,
  shelvesStatus: null,
  page: 1,
  rows: 10
};

const relationData = {
  id: 0,
  productStandardIds: 0,
  productSectionId: 0,
  rank: 0
};

const productRowData = {
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10
};

const dataColunms=[
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
      }else{
        return <div><tag color='primary'>N/A</tag></div>;
      }
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
]

const productColumns=[
  {
    type: 'selection',
    key: '',
    width: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 70,
    align: 'center'
  },
  {
    title: '商品编号',
    key: 'productCode',
    align: 'center',
    minWidth: 120
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '商品规格',
    key: 'specification',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '商品单位',
    key: 'productUnit',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '商品价格',
    key: 'price',
    minWidth: 80,
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品状态',
    minWidth: 100,
    key: 'shelvesStatus',
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
    minWidth: 60,
    align: 'center'
  }
]

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ruleInline: {
        productId: [{ required: true, message: '请选择关联商品' }, { message: '请选择要关联的商品', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/ }],
        specificationQty: [
          { required: true, message: '请输入安全库存' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        rank: [
          { required: true, message: '请输入商品排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      appTypeEnum,
      menuData: [],
      columns: dataColunms,
      productColumns: productColumns,
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentSectionId: 0,
      currentStandard: this._.cloneDeep(productStandardDetail),
      parentCategory: this._.cloneDeep(productStandardDetail),
      productStandard: this._.cloneDeep(productStandardDetail),
      searchRowData: this._.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productStandardRelation: this._.cloneDeep(relationData),
      treeData: this._.cloneDeep(productStandardDetail),
      goodsSectionData: [],
      defaultGoodsSectionData: [41],
      productData: [],
      productTotal: 0
    };
  },
  computed: {

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
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      }
    },
    createTableRow() {
      if (!this.currentSectionId || this.currentSectionId == 0) {
        this.$Message.warning('请从左侧选择一个板块');
        return;
      }

      if (this.tempModalType !== this.modalType.create) {
        this.productStandard = this._.cloneDeep(productStandardDetail);
      }
      this.$refs.modalEdit.resetFields();
      this.searchRowData.shelvesStatus = 'VALID';
      this.getProductTableData();
      this.currentStandard.currentSectionId = this.currentSectionId;
      this.productStandardRelation.productSectionId = this.currentSectionId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    // 编辑分类
    handleEdit(params) {
      if (!this.productStandardRelation.productStandardIds || this.productStandardRelation.productStandardIds == 0) {
        this.$Message.warning('请选择要更换板块的商品');
        return;
      }
      this.$refs.modalEdit.resetFields();
      this.searchRowData.shelvesStatus = 'VALID';
      this.getProductTableData();
      this.tempModalType = this.modalType.edit;
      this.modalEdit = true;
    },
    asyncEditOK(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.productStandardRelation.productSectionId == 0 || this.productStandardRelation.productSectionId == '') {
            this.$Message.warning('商品规格id不能为空');
            return;
          }
          if (!this.productStandardRelation.productStandardIds || this.productStandardRelation.productStandardIds == 0 || this.productStandardRelation.productStandardIds === '') {
            this.$Message.warning('请选择一条商品信息');
            return;
          }
          // this.modalEditLoading = true;
          // this.modalViewLoading = true;
          if (this.tempModalType === this.modalType.create) {
            createProductSectionRelation(this.productStandardRelation
            ).then(res => {

            }).finally(res => {
              this.initMenuList();
              this.modalEditLoading = false;
              this.modalEdit = false;
            });
          } else if (this.tempModalType === this.modalType.edit) {
            editProductSectionRelation(this.productStandardRelation).then(res => {
            }).finally(res => {
              this.initMenuList();
              this.modalEditLoading = false;
              this.modalEdit = false;
            });
          }
        }
      });
    },
    handleEditClose() {
      this.modalEdit = false;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductSectionRelation({
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
    getTableData() {
      this.loading = true;
      getProductSectionRelationPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
        }
      });
    },
    getProductTableData() {
      // this.loading = true;
      getProductStandardsPages(this.searchProductRowData).then(res => {
        if (this.menuData.length > 0) {
          // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
          this.productData = res.rows;
          this.productTotal = res.total;
          // this.loading = false;
          // this.searchLoading = false;
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
          this.goodsSectionData = convertTreeCategory(menuList, map, true);
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
      this.currentSectionId = data.id;
      this.searchRowData.productSectionId = data.id;
      this.searchRowData.page = 1;
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
    },
    handleProductSearch() {
      this.getProductTableData();
    },
    onSelectionChange(selection) {
      this.productStandardRelation.productStandardIds = selection.map(item => item.id.toString()).join(',');
      console.log('商品选择变化,当前页选择productStandardIds:' + this.productStandardRelation.productStandardIds);
    },
    onRelationSelectionChange(selection) {
      if (selection.length > 1) {
        this.$Message.warning('最多选择一条商品记录');
        return;
      }
      this.productStandardRelation.productStandardIds = selection.map(item => item.productStandardId.toString()).join(',');
      console.log('商品关联选择变化,当前页选择productStandardIds:' + this.productStandardRelation.productStandardIds);
      this.productStandardRelation.id = selection.map(item => item.id.toString()).join(',');
      console.log('商品关联选择变化,当前页选择id:' + this.productStandardRelation.productStandardIds);
    },
    // 选择分类
    goodsSectionChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.productStandardRelation.productSectionId = selectedData[selectedData.length - 1].id;
      } else {
        this.productStandardRelation.productSectionId = null;
      }
      this.defaultGoodsSectionData = selectedData;
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
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
