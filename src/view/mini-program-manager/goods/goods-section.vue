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
            <span
              class="brand-red font-sm"
            >{{ currentCategory.sectionName!=''? currentCategory.sectionName : '所有板块' }}</span>
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
            @on-delete="handleDelete"
            @on-select-all="onSelectionAll"
            @on-selection-change="onRelationSelectionChange"
          >
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
            </div>
            <div slot="operations">
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
    <!-- 添加和修改 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="1000">
      <p slot="header">
        <span>{{ tempModalType == modalType.create? '添加板块商品':'编辑板块' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="productStandardRelation" :rules="ruleInline">
          <!-- 编辑 -->
          <Row v-if="tempModalType == modalType.edit">
            <FormItem label="请选择要更换的商品板块:">
              <Cascader
                :clearable="false"
                :data="goodsSectionData"
                v-model="defaultGoodsSectionData"
                span="21"
                style="width: 70%"
                @on-change="goodsSectionChange"
              ></Cascader>
            </FormItem>
          </Row>
          <!-- 添加 -->
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
              <div style="margin: 10px;overflow: hidden">
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
          <FormItem label="排序:" prop="productSectionRank">
            <InputNumber v-model="productStandardRelation.productSectionRank"></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  getProductSectionRelationPages,
  createProductSectionRelation,
  deleteProductSectionRelation,
  getProductStandardsPages,
  editProductSectionRelation,
  getProductSectionTree
} from "@/api/mini-program";
import { buildMenu, convertTree, convertTreeCategory } from "@/libs/util";
import CommonIcon from "_c/common-icon";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import { fenToYuanDot2 } from "@/libs/util";
import { customPlanStatusConvert, appTypeConvert } from "@/libs/converStatus";
import { appTypeEnum } from "@/libs/enumerate";

const productStandardDetail = {
  applyType: "",
  barcode: "",
  baseBarcode: "",
  baseImage: "",
  baseQty: 0,
  baseUnit: null,
  baseUnitId: 0,
  description: "",
  groupId: 0,
  groupName: null,
  hdSkuid: "",
  id: 0,
  image: "",
  largeImage: null,
  limitQty: null,
  price: 0,
  productCode: "",
  productDescription: "",
  productId: 0,
  productName: "",
  productSectionId: 0,
  productSectionRank: 0,
  productStandardId: 0,
  productStandardIds: null,
  productUnit: "",
  rank: null,
  salePrice: 0,
  shelvesStatus: "",
  smallImage: null,
  sourceCode: "",
  specification: "",
  standardQty: 0.5,
  status: "",
  unitId: 0,
  videoImage: "",
  videoUrl: ""
};

const currentCategory = {
  applyType: "S_MALL",
  id: 0,
  parentId: 0,
  sectionProductId: 0,
  sectionName: "",
  sectionImg: "",
  rankNo: 0,
  productStandardList: [],
  positionName: ""
};

const roleRowData = {
  productName: null,
  page: 1,
  rows: 10
};

const relationData = {
  id: 0,
  productStandardIds: 0,
  productSectionId: 0,
  productSectionRank: 0
};

const productRowData = {
  productId: "",
  barcode: "",
  productCode: "",
  productName: "",
  shelvesStatus: "VALID",
  minPrice: "",
  maxPrice: "",
  page: 1,
  rows: 10
};

const dataColunms = [
  {
    type: "selection",
    width: 60,
    align: "center",
    fixed: "left"
  },
  {
    title: "商品条码",
    key: "barcode",
    sortable: true,
    align: "center"
  },
  {
    title: "商品编号",
    key: "productCode",
    sortable: true,
    align: "center",
    width: 150
  },
  {
    title: "商品名称",
    key: "productName",
    sortable: true,
    align: "center"
  },
  {
    title: "商品规格",
    key: "specification",
    sortable: true,
    align: "center"
  },
  {
    title: "商品单位",
    key: "productUnit",
    sortable: true,
    align: "center"
  },
  {
    title: "商品价格",
    key: "price",
    sortable: true,
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "商品状态",
    key: "shelvesStatus",
    sortable: true,
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.shelvesStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      } else if (row.shelvesStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color="primary">N/A</tag>
          </div>
        );
      }
    }
  },
  {
    title: "排序",
    key: "productSectionRank",
    sortable: true,
    align: "center"
  },
  {
    title: "操作",
    key: "handle",
    options: ["exchange", "edit", "delete"]
  }
];

const productColumns = [
  {
    type: "selection",
    key: "",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    title: "商品条码",
    key: "barcode",
    minWidth: 70,
    align: "center"
  },
  {
    title: "商品编号",
    key: "productCode",
    align: "center",
    minWidth: 120
  },
  {
    title: "商品名称",
    key: "productName",
    minWidth: 100,
    align: "center"
  },
  {
    title: "商品规格",
    key: "specification",
    minWidth: 80,
    align: "center"
  },
  {
    title: "商品单位",
    key: "productUnit",
    minWidth: 80,
    align: "center"
  },
  {
    title: "商品价格",
    key: "price",
    minWidth: 80,
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "商品状态",
    minWidth: 100,
    key: "shelvesStatus",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.shelvesStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      } else if (row.shelvesStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {customPlanStatusConvert(row.shelvesStatus).label}
            </tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">
            {customPlanStatusConvert(row.shelvesStatus).label}
          </tag>
        </div>
      );
    }
  },
  {
    title: "排序",
    key: "rank",
    minWidth: 60,
    align: "center"
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
        productId: [
          { required: true, message: "请选择关联商品" },
          {
            message: "请选择要关联的商品",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        specificationQty: [
          { required: true, message: "请输入安全库存" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ],
        rank: [{ required: true, message: "请输入商品排序" }]
      },
      appTypeEnum,
      menuData: [],
      columns: dataColunms,
      productColumns: productColumns,
      modalEdit: false,
      modalChange: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: "",
      currentSectionId: 0,
      currentStandard: _.cloneDeep(productStandardDetail),
      currentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productStandardRelation: _.cloneDeep(relationData),
      treeData: _.cloneDeep(productStandardDetail),
      goodsSectionData: [],
      defaultGoodsSectionData: [41],
      productData: [],
      productTotal: 0
    };
  },
  computed: {},
  created() {
    this.initMenuList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.type == "PARENT") {
        return (
          <div
            style={{
              display: "inline-block",
              width: "100%",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            <span>
              <CommonIcon type="ios-folder" class="mr10" />
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
              display: "inline-block",
              width: "100%",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            <span>
              <CommonIcon type="ios-paper" class="mr10" />
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
      this.getTableData();
    },
    addProSection() {
      if (!this.currentSectionId) {
        this.$Message.warning("请先从左侧选择一个板块");
        return;
      }
      this.$refs.editForm.resetFields();
      this.getProductTableData();
      this.currentStandard.currentSectionId = this.currentSectionId;
      this.productStandardRelation.productSectionId = this.currentSectionId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleEdit(params) {
      if (!this.currentSectionId || this.currentSectionId == 0) {
        this.$Message.warning("请从左侧选择一个板块");
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
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.productStandardRelation.productSectionId) {
            this.$Message.warning("商品板块id不能为空");
            return;
          }
          if (!this.productStandardRelation.productStandardIds) {
            this.$Message.warning("请选择一条商品信息");
            return;
          }
          if (this.tempModalType === this.modalType.create) {
            createProductSectionRelation(this.productStandardRelation).then(
              res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              }
            );
          } else if (this.tempModalType === this.modalType.edit) {
            editProductSectionRelation(this.productStandardRelation).then(
              res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
              }
            );
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
    },
    getTableData() {
      this.loading = true;
      getProductSectionRelationPages(this.searchRowData).then(res => {
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
      getProductStandardsPages(this.searchProductRowData).then(res => {
        if (this.menuData.length > 0) {
          this.productData = res.rows;
          this.productTotal = res.total;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree(this.treeData).then(res => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: "title",
            children: "children"
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
      if (typeof data.expand === "undefined") {
        // this.$set(data, 'expend', true);
        this.$set(data, "expend", false);
        // if (data.children) {
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.currentCategory.id = data.id;
      this.currentCategory.sectionName = data.title;
      this.currentSectionId = data.id;
      this.searchRowData.productSectionId = data.id;
      this.searchRowData.page = 1;
      // 获取新数据
      this.getTableData();
    },
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === "undefined") {
          // this.$set(item, 'expend', true);
          this.$set(item, "expend", false);
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
      this.productStandardRelation.productStandardIds = selection
        .map(item => item.id.toString())
        .join(",");
    },
    onRelationSelectionChange(selection) {
      if (selection.length > 1) {
        this.$Message.warning("最多选择一条商品记录");
        return;
      }
      this.productStandardRelation.productStandardIds = selection
        .map(item => item.productStandardId.toString())
        .join(",");
      this.productStandardRelation.id = selection
        .map(item => item.id.toString())
        .join(",");
    },
    // 选择分类
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
