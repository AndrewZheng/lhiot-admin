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
              currentCategory.plateName != ""
                ? currentCategory.plateName
                : "所有板块"
            }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="12"
            :operate-area-column="8"
            editable
            searchable
            border
            search-place="top"
            @on-exchange="handleEdit"
            @on-edit="handleEdit"
            @on-delete="handleDelete"
            @on-select-all="onRelationSelectionAll"
            @on-selection-change="onRelationSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchRowData.goodsName"
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
            </div>
            <div slot="operations" style="margin-left: -130px">
              <Button v-waves type="info" class="mr5" @click="handleBack">
                <Icon type="ios-arrow-back" />&nbsp;返回所有板块
              </Button>
              <Button v-waves type="success" class="mr5" @click="handleCreate">
                <Icon type="md-add" />添加
              </Button>
              <Button
                v-waves
                type="primary"
                class="mr5"
                @click="handleExchange"
              >
                <Icon type="md-repeat" />&nbsp;批量更换
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
                :page-size="searchRowData.rows"
                :page-size-opts="templatePageOpts"
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
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :width="isEdit ? 600 : 1200"
    >
      <p slot="header">
        <span>{{ isCreate ? "添加板块商品" : "更换板块商品" }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="goodsStandardRelation" :rules="ruleInline">
          <!-- 编辑 -->
          <Row v-if="isEdit && currentCategory.plateName.indexOf('vip') == -1">
            <FormItem label="请选择要更换的商品板块:" style="width: 400px">
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
                ref="dataTables"
                v-model="goodsStandardData"
                :columns="standardColumns"
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
                      v-model="searchProductRowData.barCode"
                      placeholder="商品条码"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Input
                      v-model="searchProductRowData.goodsName"
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
                    :page-size="searchProductRowData.rows"
                    :page-size-opts="templatePageOpts1"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"
                  ></Page>
                </Row>
              </div>
            </FormItem>
          </Row>
          <FormItem label="排序:" prop="rank">
            <InputNumber v-model="goodsStandardRelation.rank"></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modalEdit = false">关闭</Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import {
  getProductSectionRelationPages,
  createProductSectionRelation,
  deleteProductSectionRelation,
  getProductStandardsPages,
  editProductSectionRelation,
  getProductSectionTree
} from '@/api/wholesale';
import {
  buildMenu,
  convertTree,
  convertTreeCategory,
  fenToYuanDot2
} from '@/libs/util';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import { pfExpandTypeConvert } from '@/libs/converStatus';
import { pfExpandTypeEnum } from '@/libs/enumerate';

const goodsSectionRelation = {
  barCode: '',
  unitName: '',
  categoryName: '',
  goodsCode: '',
  goodsId: 0,
  goodsImage: null,
  goodsName: '',
  goodsPriceRegionList: [], // 商品价格区间
  goodsUnit: '',
  hdSkuId: '',
  id: 0,
  isVip: '',
  netWeight: 0, // 商品净重
  price: 0,
  purchasePrice: 0,
  standard: '',
  standardDesc: '',
  unitCode: '',
  vaild: '',
  weight: 0,
  rank: 0, // 先保留后续扩展
  baseProductName: '', // 先保留可扩展
  goodsUnit: '',
  standardId: 0
};

const currentCategory = {
  id: 0,
  rank: 0,
  levels: 0,
  parentId: 0,
  plateName: '',
  plateImage: '',
  layout: '', // tile-平铺布局 roll-滚动布局 list-列表-用于推荐商品
  parentPlateName: '',
  channelGoods: []
};

const roleRowData = {
  plateId: null,
  goodsStandardId: null,
  goodsName: '',
  page: 1,
  rows: 20,
  sidx: null,
  sort: 'rank'
};

const relationData = {
  id: 0,
  rank: 0,
  plateId: 0,
  relationIds: '',
  goodsStandardIds: ''
};

const productRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  barCode: null,
  goodsType: '',
  page: 1,
  rows: 5
};

const relationColumns = [
  {
    title: '关联ID',
    align: 'center',
    key: 'id',
    minWidth: 80
  },
  {
    title: '商品条码',
    align: 'center',
    key: 'barCode',
    minWidth: 100
  },
  {
    title: '商品名称',
    align: 'center',
    key: 'goodsName',
    minWidth: 130
  },
  {
    title: '商品图片',
    key: 'goodsImage',
    align: 'center',
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '规格',
    align: 'center',
    key: 'standard',
    minWidth: 120
  },
  {
    title: '单位',
    align: 'center',
    minWidth: 80,
    key: 'goodsUnit'
  },
  {
    title: '价格',
    align: 'center',
    minWidth: 110,
    key: 'price',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品类型',
    minWidth: 110,
    key: 'goodsType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.goodsType == 'NORMAL') {
        return (
          <div>
            <tag color='cyan'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'VIP') {
        return (
          <div>
            <tag color='orange'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'FLASHSALE') {
      }
      return (
        <div>
          <tag color='blue'>{pfExpandTypeConvert(row.goodsType).label}</tag>
        </div>
      );
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '状态',
    minWidth: 80,
    key: 'vaild',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === 'yes') {
        return (
          <div>
            <tag color='success'>上架</tag>
          </div>
        );
      } else if (row.vaild === 'no') {
        return (
          <div>
            <tag color='error'>下架</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '排序',
    align: 'center',
    sortable: true,
    minWidth: 90,
    key: 'rank'
  },
  {
    title: '操作',
    align: 'center',
    minWidth: 180,
    key: 'handle',
    options: ['exchange', 'edit', 'delete']
  }
];

const standardColumns = [
  {
    type: 'selection',
    key: '',
    minWidth: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '规格ID',
    align: 'center',
    key: 'id',
    minWidth: 50
  },
  {
    title: '商品条码',
    align: 'center',
    key: 'barCode',
    minWidth: 70
  },
  {
    title: '商品名称',
    align: 'center',
    key: 'standardGoodsName',
    minWidth: 120
  },
  {
    title: '商品图片',
    key: 'goodsImage',
    align: 'center',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '商品规格',
    align: 'center',
    key: 'standardDesc',
    minWidth: 80
  },
  {
    title: '商品单位',
    align: 'center',
    minWidth: 80,
    key: 'goodsUnit'
  },
  {
    title: '商品价格',
    align: 'center',
    minWidth: 60,
    key: 'price',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品类型',
    minWidth: 80,
    key: 'goodsType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.goodsType == 'NORMAL') {
        return (
          <div>
            <tag color='cyan'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'VIP') {
        return (
          <div>
            <tag color='orange'>{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == 'FLASHSALE') {
      }
      return (
        <div>
          <tag color='blue'>{pfExpandTypeConvert(row.goodsType).label}</tag>
        </div>
      );
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  },
  {
    title: '商品状态',
    minWidth: 80,
    key: 'vaild',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === 'yes') {
        return (
          <div>
            <tag color='success'>上架</tag>
          </div>
        );
      } else if (row.vaild === 'no') {
        return (
          <div>
            <tag color='error'>下架</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  }
];

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ruleInline: {
        rank: [{ required: false, message: '请输入板块商品排序' }]
      },
      menuData: [],
      discount: [],
      pfExpandTypeEnum,
      goodsStandardData: [],
      goodsSectionData: [],
      defaultGoodsSectionData: [],
      templatePageOpts: [20, 50],
      templatePageOpts1: [5, 20, 50],
      columns: relationColumns,
      standardColumns,
      modalEdit: false,
      modalChange: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentTreeTitleCode: '',
      productTotal: 0,
      goodsSectionRelation: _.cloneDeep(goodsSectionRelation),
      currentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      goodsStandardRelation: _.cloneDeep(relationData)
    };
  },
  computed: {},
  created() {
    this.initMenuList();
  },
  methods: {
    handleBack() {
      this.currentCategory.plateName = '所有板块';
      this.searchRowData = _.cloneDeep(roleRowData);
      this.initMenuList();
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
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      }
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      // 防止选择子分类，清除对象后未保留当前父分类查询
      this.searchRowData.plateId = this.currentCategory.id;
      this.getTableData();
    },
    handleCreate() {
      if (!this.currentCategory.id) {
        this.$Message.warning('请先从左侧选择一个板块');
        return;
      }
      this.$refs.editForm.resetFields();
      this.searchProductRowData = _.cloneDeep(productRowData);
      // VIP专区只能关联VIP商品，添加isVip过滤条件
      if (this.currentTreeTitleCode.indexOf('VIP') > -1) {
        console.log('选择', this.currentTreeTitleCode);
        this.searchProductRowData.goodsType = 'VIP';
      } else {
        this.searchProductRowData.goodsType = 'NORMAL';
      }

      this.getProductTableData();
      this.goodsStandardRelation.plateId = this.currentCategory.id;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleEdit(params) {
      if (!this.currentCategory.id || this.currentCategory.id == 0) {
        this.$Message.warning('请从左侧选择一个板块');
        return;
      }
      const { row } = params;
      this.goodsStandardRelation.goodsStandardIds = row.standardId;
      this.goodsStandardRelation.rank = row.rank;
      this.goodsStandardRelation.plateId = this.currentCategory.id;
      this.goodsStandardRelation.relationIds = row.id;
      this.tempModalType = this.modalType.edit;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (!this.goodsStandardRelation.plateId) {
            this.$Message.warning('商品板块id不能为空');
            return;
          }
          if (!this.goodsStandardRelation.goodsStandardIds) {
            this.$Message.warning('请选择一条商品信息');
            return;
          }
          if (this.isCreate) {
            createProductSectionRelation(this.goodsStandardRelation).then(
              (res) => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              }
            );
          } else if (this.isEdit) {
            // 更新传递的是 relationIds
            console.log('板块', this.goodsStandardRelation);
            editProductSectionRelation(this.goodsStandardRelation).then(
              (res) => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              }
            );
          }
        }
      });
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.goodsSectionRelation = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleExchange() {
      // 批量更换板块商品
      if (!this.currentCategory.id || this.currentCategory.id === 0) {
        this.$Message.warning('请从左侧选择一个板块');
        return;
      }
      if (!this.goodsStandardRelation.relationIds) {
        this.$Message.warning('请从至少选择一个板块商品更换');
        return;
      }
      this.defaultGoodsSectionData = [];
      this.goodsStandardRelation.rank = 0;
      this.goodsStandardRelation.plateId = this.currentCategory.id;
      this.tempModalType = this.modalType.edit;
      this.modalEdit = true;
    },
    // 删除
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
    getTableData() {
      this.loading = true;
      getProductSectionRelationPages(this.searchRowData).then((res) => {
        if (this.menuData.length > 0) {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        }
      });
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        if (this.menuData.length > 0) {
          this.goodsStandardData = res.rows;
          this.productTotal = res.total;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree().then((res) => {
        if (res && res.length > 0) {
          const menuList = buildMenu(res);
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
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.searchRowData.page = 1;
      this.searchRowData.plateId = data.id;
      this.currentCategory.id = data.id;
      this.currentCategory.plateName = data.title;
      this.goodsStandardRelation.plateId = data.id;
      this.currentTreeTitleCode = data.titleCode;
      console.log('titleCode: ', this.currentTreeTitleCode);
      // 获取新数据
      this.getTableData();
    },
    expandChildren(array) {
      array.forEach((item) => {
        if (typeof item.expand === 'undefined') {
          this.$set(item, 'expend', false);
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
    onSelectionAll(selection) {
      this.goodsStandardRelation.goodsStandardIds = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    onSelectionChange(selection) {
      this.goodsStandardRelation.goodsStandardIds = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    onRelationSelectionAll(selection) {
      console.log('selectDatas all:', selection);
      this.goodsStandardRelation.goodsStandardIds = selection
        .map((item) => item.standardId.toString())
        .join(',');
      this.goodsStandardRelation.relationIds = selection
        .map((item) => item.id.toString())
        .join(',');
      this.tableDataSelected = selection;
      console.log(
        'goodsStandardIds:',
        this.goodsStandardRelation.goodsStandardIds
      );
      console.log('relationIds:', this.goodsStandardRelation.relationIds);
    },
    onRelationSelectionChange(selection) {
      console.log('selectDatas:', selection);
      this.goodsStandardRelation.goodsStandardIds = selection
        .map((item) => item.standardId.toString())
        .join(',');
      this.goodsStandardRelation.relationIds = selection
        .map((item) => item.id.toString())
        .join(',');
      this.tableDataSelected = selection;
      console.log(
        'goodsStandardIds:',
        this.goodsStandardRelation.goodsStandardIds
      );
      console.log('relationIds:', this.goodsStandardRelation.relationIds);
    },
    // 选择分类
    goodsSectionChange(value, selectedData) {
      // console.log("数据", selectedData);
      // if (selectedData[0].titleCode == "BKGL322") {
      //   this.$Message.warning("普通商品不允许更换到VIP板块");
      //   // return;
      // } else {
      if (selectedData.length > 0) {
        this.goodsStandardRelation.plateId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.goodsStandardRelation.plateId = null;
      }
      this.defaultGoodsSectionData = selectedData;
      // }
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
