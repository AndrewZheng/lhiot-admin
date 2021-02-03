<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="3" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="21" order="3">
        <Card>
          <h6>
            当前选中：
            <span class="brand-red font-sm">{{
              currentCategory.sectionName != ""
                ? currentCategory.sectionName
                : "所有板块"
            }}</span>
          </h6>
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
            @on-exchange="handleEdit"
            @on-edit="handleEdit"
            @on-view="handleView"
            @on-delete="handleDelete"
            @on-select-all="onSelectionAll"
            @on-selection-change="onSelectionChange"
          >
            <!-- @on-selection-change="onRelationSelectionChange" -->
            <div slot="searchCondition">
              <Row>
                <!-- <Input
                  v-model="searchRowData.sectionName"
                  placeholder="板块名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                >
                </Input>-->
                <Input
                  v-model="searchRowData.productName"
                  placeholder="商品名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Button
                  :loading="searchLoading"
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
              <div class="ml15 mt10">
                <i style="color: red">*</i>
                活动商品可点击查看按钮查看活动配置信息
              </div>
            </div>
            <div slot="operations">
              <Button
                v-waves
                :loading="clearSearchLoading"
                type="warning"
                class="mr5"
                @click="handleBack"
              >
                <Icon type="ios-arrow-back" />&nbsp;返回所有板块
              </Button>
              <Button v-waves type="success" class="mr5" @click="addProSection">
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
          <div style="margin: 10px; overflow: hidden">
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

    <!-- 添加 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{
          isCreate ? "添加板块商品" : "编辑板块"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="productStandardRelation"
          :rules="ruleInline"
        >
          <!-- 编辑 -->
          <Row v-if="isEdit">
            <FormItem label="请选择要更换的商品板块:">
              <Cascader
                v-model="defaultGoodsSectionData"
                :data="goodsSectionData"
                change-on-select
                size="large"
                span="21"
                style="width: 70%"
                @on-change="goodsSectionChange"
              ></Cascader>
            </FormItem>
          </Row>
          <!-- 添加 -->
          <Row v-if="isCreate">
            <FormItem>
              <tables
                ref="tables"
                v-model="productData"
                :columns="productColumns"
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
                    ></Input>
                    <Input
                      v-model="searchProductRowData.productName"
                      placeholder="商品名称"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Button
                      :loading="searchLoading"
                      class="search-btn mr5"
                      type="primary"
                      @click="handleProductSearch"
                    >
                      <Icon type="md-search" />&nbsp;搜索
                    </Button>
                    <Button
                      v-waves
                      :loading="clearSearchLoading"
                      class="search-btn"
                      type="info"
                      @click="hanldeProductClear"
                    >
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>
              <div style="margin: 10px; overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"
                  ></Page>
                </Row>
              </div>
            </FormItem>
          </Row>
          <FormItem
            v-if="isCreate"
            label="排序:"
            prop="rank"
          >
            <InputNumber v-model="productStandardRelation.rank"></InputNumber>
          </FormItem>
          <FormItem v-else label="排序:" prop="productSectionRank">
            <InputNumber
              v-model="productStandardRelation.productSectionRank"
            ></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalEditLoading"
          type="primary"
          @click="handleSubmit"
        >确认</Button>
      </div>
    </Modal>

    <!-- 查看 -->
    <Modal
      v-model="modalView"
      :width="800"
      draggable
      scrollable
      :mask-closable="false"
    >
      <p slot="header">
        <span>折扣商品价格展示</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ discount.productName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品类型:</i-col>
              <i-col
                v-if="discount.expandType === 'DISCOUNT_PRODUCT'"
                span="16"
              >
                <tag color="magenta">{{ "折扣商品" }}</tag>
              </i-col>
              <i-col
                v-else-if="discount.expandType === 'PULL_NEW_PRODUCT'"
                span="16"
              >
                <tag color="orange">{{ "老拉新商品" }}</tag>
              </i-col>
              <i-col
                v-else-if="discount.expandType === 'NEW_TRY_PRODUCT'"
                span="16"
              >
                <tag color="orange">{{ "新品尝鲜商品" }}</tag>
              </i-col>
              <i-col
                v-else-if="discount.expandType === 'SHARE_PRODUCT'"
                span="16"
              >
                <tag color="orange">{{ "分享赚商品" }}</tag>
              </i-col>
              <i-col
                v-else-if="discount.expandType === 'ASSIST_PRODUCT'"
                span="16"
              >
                <tag color="orange">{{ "助力商品" }}</tag>
              </i-col>
              <i-col
                v-else-if="discount.expandType === 'SECKILL_PRODUCT'"
                span="16"
              >
                <tag color="orange">{{ "限时秒杀商品" }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品原价:</i-col>
              <i-col span="16">{{ discount.price }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">售卖价格:</i-col>
              <i-col span="16">{{ discount.salePrice }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12" style="color: red">
            <Row>
              <i-col span="8">折扣价:</i-col>
              <i-col span="16">{{ discount.discountPrice }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">折扣率:</i-col>
              <i-col span="16">{{ discount.discountRate + "折" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">起购份数:</i-col>
              <i-col span="16">{{ discount.startNum }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">限购份数:</i-col>
              <i-col span="16">{{ discount.limitNum }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="modalView = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getProductSectionRelationPages,
  createProductSectionRelation,
  deleteProductSectionRelation,
  getProductStandardsPages,
  editProductSectionRelation,
  getProductSectionTree,
  getProStandardExpand
} from '@/api/mini-program';
import { buildMenu, convertTree, convertTreeCategory } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { fenToYuanDot2 } from '@/libs/util';
import {
  customPlanStatusConvert,
  expandTypeConvert
} from '@/libs/converStatus';
import { appTypeEnum, expandTypeEnum } from '@/libs/enumerate';

const productStandardDetail = {
  applyType: '',
  barcode: '',
  baseBarcode: '',
  baseImage: '',
  baseQty: 0,
  baseUnit: null,
  baseUnitId: 0,
  description: '',
  groupId: 0,
  groupName: null,
  hdSkuid: '',
  id: 0,
  image: '',
  largeImage: null,
  limitQty: null,
  price: 0,
  productCode: '',
  productDescription: '',
  productId: 0,
  productName: '',
  productSectionId: 0,
  productSectionRank: 0,
  productStandardId: 0,
  productStandardIds: null,
  productUnit: '',
  rank: null,
  salePrice: 0,
  shelvesStatus: '',
  smallImage: null,
  sourceCode: '',
  specification: '',
  standardQty: 0.5,
  status: '',
  unitId: 0,
  videoImage: '',
  videoUrl: ''
};

const currentCategory = {
  applyType: 'S_MALL',
  id: 0,
  parentId: 0,
  sectionProductId: 0,
  sectionName: '',
  sectionImg: '',
  rankNo: 0,
  productStandardList: [],
  positionName: ''
};

const roleRowData = {
  productName: null,
  page: 1,
  rows: 10,
  sidx: 'product_section_rank'
};

const relationData = {
  id: 0,
  productStandardIds: 0,
  productSectionId: 0,
  productSectionRank: 0
};

const productRowData = {
  productStandardId: '',
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
  page: 1,
  rows: 10,
  productType: ''
};

const productColumns = [
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
    minWidth: 150,
    align: 'center'
  },
  // {
  //   title: "商品编号",
  //   key: "productCode",
  //   align: "center",
  //   minWidth: 150,
  // },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 150,
    align: 'center'
  },
  {
    title: '规格',
    key: 'specification',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '单位',
    key: 'productUnit',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '售价',
    key: 'price',
    minWidth: 80,
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '折扣价',
    key: 'discountPrice',
    minWidth: 80,
    align: 'center',
    render(h, params, vm) {
      const { row } = params;
      if (row.productType === 'SHARE_PRODUCT') {
        const amount = fenToYuanDot2(params.row.salePrice);
        return <div>{amount}</div>;
      } else {
        if (params.row.productStandardExpand) {
          const amount = fenToYuanDot2(
            params.row.productStandardExpand.discountPrice
          );
          return <div>{amount}</div>;
        } else {
          return <div>N/A</div>;
        }
      }
    }
  },
  {
    title: '起购份数',
    key: 'startNum',
    minWidth: 100,
    align: 'center'
  },
  {
    title: '商品类型',
    minWidth: 110,
    key: 'productType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;

      if (row.productType === 'DISCOUNT_PRODUCT') {
        return (
          <div>
            <tag color='magenta'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'PULL_NEW_PRODUCT') {
        return (
          <div>
            <tag color='orange'>{expandTypeConvert(row.productType).label}</tag>
          </div>
        );
      } else if (row.productType === 'SECKILL_PRODUCT') {
        return (
          <div>
            <tag color='blue'>{expandTypeConvert(row.productType).label}</tag>
          </div>
        );
      } else if (row.productType === 'SHARE_PRODUCT') {
        return (
          <div>
            <tag color='blue'>{expandTypeConvert(row.productType).label}</tag>
          </div>
        );
      } else if (row.productType === 'ASSIST_PRODUCT') {
        return (
          <div>
            <tag color='green'>{expandTypeConvert(row.productType).label}</tag>
          </div>
        );
      } else if (row.productType === 'ORDINARY_PRODUCT') {
        return (
          <div>
            <tag color='green'>{expandTypeConvert(row.productType).label}</tag>
          </div>
        );
      }
    }
  },
  {
    title: '状态',
    minWidth: 90,
    key: 'shelvesStatus',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.shelvesStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      } else if (row.shelvesStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>
            {customPlanStatusConvert(row.shelvesStatus).label}
          </tag>
        </div>
      );
    }
  },
  {
    title: '排序',
    key: 'rank',
    minWidth: 70,
    align: 'center'
  }
];

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin],
  data() {
    return {
      appTypeEnum,
      expandTypeEnum,
      currentSectionId: 0,
      productTotal: 0,
      currentParentName: '',
      currentSectionCode: '',
      menuData: [],
      discount: [],
      productData: [],
      goodsSectionData: [],
      defaultGoodsSectionData: [],
      ruleInline: {
        productId: [
          { required: true, message: '请选择关联商品' },
          {
            message: '请选择要关联的商品',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
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
        ]
        // rank: [{ required: true, message: "请输入商品排序" }]
      },
      productColumns: productColumns,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '商品名称',
          key: 'productName',
          align: 'center',
          minWidth: 160,
          fixed: 'left'
        },
        {
          title: '商品条码',
          key: 'barcode',
          align: 'center',
          minWidth: 150
        },
        {
          title: '商品编号',
          key: 'productCode',
          align: 'center',
          minWidth: 150
        },
        {
          title: '规格',
          key: 'specification',
          align: 'center',
          minWidth: 90
        },
        {
          title: '单位',
          key: 'productUnit',
          align: 'center',
          minWidth: 80
        },
        {
          title: '商品原价',
          key: 'price',
          minWidth: 100,
          align: 'center',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '售卖价格',
          key: 'salePrice',
          align: 'center',
          minWidth: 100,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '所属板块',
          key: 'sectionName',
          align: 'center',
          minWidth: 140
        },
        {
          title: '商品状态',
          key: 'shelvesStatus',
          align: 'center',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            } else if (row.shelvesStatus === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='primary'>N/A</tag>
                </div>
              );
            }
          }
        },
        {
          title: '排序',
          minWidth: 90,
          key: 'productSectionRank',
          sortable: 'true',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          fixed: 'right',
          minWidth: 180,
          options: ['view', 'exchange', 'edit', 'delete']
        }
      ],
      currentStandard: _.cloneDeep(productStandardDetail),
      currentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productStandardRelation: _.cloneDeep(relationData),
      treeData: _.cloneDeep(productStandardDetail)
    };
  },
  computed: {},
  created() {
    this.initMenuList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductSectionRelationPages(this.searchRowData).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        if (this.menuData.length > 0) {
          this.productData = res.rows;
          this.productTotal = res.total;
        }
      });
    },
    handleExport(filename) {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
      this.$refs.tables.exportCsv({
        filename: filename + '-' + new Date().valueOf() + '.csv'
      });
    },
    handleBack() {
      this.currentCategory.sectionName = '所有板块';
      this.initMenuList();
      this.resetSearchRowData();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    // 添加商品
    addProSection() {
      if (!this.currentSectionId) {
        this.$Message.warning('请先从左侧选择一个板块');
        return;
      }
      this.searchProductRowData.page = 1;
      if (this.currentSectionCode === 'PULL_NEW') {
        this.searchProductRowData.productType = 'PULL_NEW_PRODUCT';
      } else if (this.currentSectionCode === 'ZKSP') {
        this.searchProductRowData.productType = 'DISCOUNT_PRODUCT';
      } else if (this.currentSectionCode === 'SECKILL') {
        this.searchProductRowData.productType = 'SECKILL_PRODUCT';
      } else if (this.currentSectionCode === 'ASSIST') {
        this.searchProductRowData.productType = 'ASSIST_PRODUCT';
      } else if (this.currentSectionCode === 'SHARE') {
        this.searchProductRowData.productType = 'SHARE_PRODUCT';
      } else if (this.currentSectionCode === 'SVIP') {
        this.searchProductRowData.productType = '';
      } else {
        this.searchProductRowData.productType = 'ORDINARY_PRODUCT';
      }
      this.$refs.editForm.resetFields();
      this.getProductTableData();
      this.productStandardRelation.rank = 0;
      this.currentStandard.currentSectionId = this.currentSectionId;
      this.productStandardRelation.productSectionId = this.currentSectionId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleView(params) {
      getProStandardExpand({
        id: params.row.productStandardId
      }).then((res) => {
        if (res) {
          this.discount = res;
          this.discount.discountPrice = fenToYuanDot2(
            this.discount.discountPrice
          );
          this.discount.productName = params.row.productName;
          this.discount.price = fenToYuanDot2(params.row.price);
          this.discount.salePrice = fenToYuanDot2(params.row.salePrice);
          this.modalView = true;
        } else {
          this.$Message.error('当前商品不是活动商品');
          return;
        }
      });
    },
    handleEdit(params) {
      if (!this.currentSectionId || this.currentSectionId === 0) {
        this.$Message.warning('请从左侧选择一个板块');
        return;
      }
      const { row } = params;
      this.productStandardRelation.id = row.id;
      this.productStandardRelation.productStandardIds = row.productStandardId;
      this.productStandardRelation.productSectionRank = row.productSectionRank;
      this.currentStandard.currentSectionId = this.currentSectionId;
      this.productStandardRelation.productSectionId = this.currentSectionId;
      this.tempModalType = this.modalType.edit;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (!this.productStandardRelation.productSectionId) {
            this.$Message.warning('商品板块id不能为空');
            return;
          }
          if (!this.productStandardRelation.productStandardIds) {
            this.$Message.warning('请选择一条商品信息');
            return;
          }
          if (this.isCreate) {
            this.createRowData();
          } else if (this.isEdit) {
            this.updateRowData();
          }
        }
      });
    },
    createRowData() {
      this.modalEditLoading = true;
      createProductSectionRelation(this.productStandardRelation)
        .then((res) => {
          this.initMenuList();
          this.modalEdit = false;
        }).finally(() => {
          this.modalEditLoading = false;
        });
    },
    updateRowData() {
      this.modalEditLoading = true;
      editProductSectionRelation(this.productStandardRelation)
        .then((res) => {
          this.initMenuList();
          this.modalEdit = false;
        }).finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      this.loading = true;
      deleteProductSectionRelation({
        ids
      })
        .then((res) => {
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
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree(this.treeData).then((res) => {
        const menuList = buildMenu(res.array);
        const map = {
          title: 'title',
          children: 'children'
        };
        this.menuData = convertTree(menuList, map, true);
        this.goodsSectionData = convertTreeCategory(menuList, map, true);
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
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      }
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
      this.currentCategory.id = data.id;
      this.currentCategory.sectionName = data.title;
      this.currentSectionId = data.id;
      this.currentSectionCode = data.code;
      this.searchRowData.productSectionId = data.id;
      this.searchRowData.page = 1;
      this.getTableData();
    },
    handleProductSearch() {
      this.getProductTableData();
    },
    onSelectionChange(selection) {
      this.productStandardRelation.productStandardIds = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    onRelationSelectionChange(selection) {
      this.productStandardRelation.productStandardIds = selection
        .map((item) => item.productStandardId.toString())
        .join(',');
      this.productStandardRelation.id = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    goodsSectionChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.productStandardRelation.productSectionId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.productStandardRelation.productSectionId = null;
      }
      this.defaultGoodsSectionData = selectedData;
    },
    hanldeProductClear() {
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
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
