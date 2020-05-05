<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
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
          <Input
            v-model="searchRowData.keyword"
            placeholder="关键词"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.hotSearch"
            class="search-col mr5"
            placeholder="是否热门"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in hotSearchEnum"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Select
            v-model="searchRowData.kwType"
            class="search-col mr5"
            placeholder="关键词类型"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in kwTypeEnum"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
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
            :page-size="searchRowData.rows"
            :page-size-opts="templatePageOpts1"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建商品关键词':'编辑商品关键词' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="keywordsDetail" :rules="ruleInline">
          <Row>
            <FormItem label="关键词:" prop="keyword">
              <Input v-model="keywordsDetail.keyword" placeholder="请输入关键词" style="width: 200px"></Input>
            </FormItem>
            <FormItem :label-width="100" label="关联类型:" prop="kwType">
              <Select
                v-model="keywordsDetail.kwType"
                placeholder="请选择关键词类型"
                style="padding-right: 5px; width:205px;"
                @on-change="kwTypeChange"
              >
                <Option
                  v-for="(item,index) in kwTypeEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem
              v-show="keywordsDetail.kwType ==='category'"
              label="关联分类:"
              style="width: 200px"
            >
              <Cascader
                :data="goodsCategoryData"
                v-model="defaultGoodsCategoryData"
                style="width: 200px"
                @on-change="goodsCategoryChange"
              ></Cascader>
            </FormItem>
            <FormItem label="关联ID:" prop="mappingId">
              <Input
                v-model="keywordsDetail.mappingId"
                placeholder="请选择关联"
                style="width: 200px"
                readonly
              >
                <Button slot="append" icon="ios-search" @click="handleRelation"></Button>
              </Input>
            </FormItem>
            <FormItem label="关联名称:" prop="mappingName">
              <Input
                v-model="keywordsDetail.mappingName"
                placeholder="关联名称"
                style="width: 200px"
                readonly
              ></Input>
            </FormItem>
            <FormItem :label-width="100" label="是否热门:" prop="hotSearch">
              <Select
                v-model="keywordsDetail.hotSearch"
                placeholder="请选择是否热门搜索"
                style="padding-right: 5px; width:205px;"
              >
                <Option
                  v-for="(item,index) in hotSearchEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modalProduct" :width="1200" title="关联商品规格">
      <Card v-show="isCreate">
        <tables
          ref="tables"
          v-model="productData"
          :columns="productColumns"
          :loading="loadingProduct"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="handleRowClick"
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
              <Select
                v-model="searchProductRowData.vaild"
                class="search-col"
                placeholder="上架状态"
                style="width:100px"
                clearable
              >
                <Option
                  v-for="item in vaild"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchProductRowData.goodsType"
                class="ml5 mr5"
                placeholder="商品类型"
                style="width:120px"
                clearable
              >
                <Option
                  v-for="item in pfExpandTypeEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ml15 mt10 mr15"
                >{{ item.label }}</Option>
              </Select>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleConfigSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleConfigClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="configTotal"
              :current="searchProductRowData.page"
              :page-size="searchProductRowData.rows"
              :page-size-opts="templatePageOpts"
              show-sizer
              show-total
              @on-change="changeConfigPage"
              @on-page-size-change="changeConfigPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";

import {
  editKeywords,
  deleteKeywords,
  createKeywords,
  getKeywordsPages,
  getProductStandardsPages,
  getProductCategoriesTree,
  getProductUnits
} from "@/api/wholesale";

import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import { pfExpandTypeConvert } from "@/libs/converStatus";
import { pfExpandTypeEnum } from "@/libs/enumerate";
import { buildMenu, convertTreeCategory, fenToYuanDot2 } from "@/libs/util";

const keywordsDetail = {
  id: 0,
  hotSearch: "", // yes-是 no-否
  keyword: "",
  kwType: "", // goods-商品 category-分类
  mappingName: "", // 用于显示
  mappingId: 0
};

const roleRowData = {
  keyword: "",
  hotSearch: "",
  kwType: "",
  page: 1,
  rows: 20
};

const productStandardDetail = {
  barCode: "",
  unitName: "",
  categoryName: "",
  goodsCode: "",
  goodsId: 0,
  goodsImage: null,
  goodsName: "",
  goodsPriceRegionList: [], // 商品价格区间
  goodsUnit: "",
  hdSkuId: "",
  id: 0,
  isVip: "",
  netWeight: 0, // 商品净重
  price: 0,
  purchasePrice: 0,
  standard: "",
  standardDesc: "",
  unitCode: "",
  vaild: "",
  weight: 0,
  rank: 0, // 先保留后续扩展
  baseProductName: "" // 先保留可扩展
};

const standardRoleRowData = {
  goodsId: "",
  barCode: "",
  goodsCode: "",
  goodsName: "",
  goodsType: "",
  page: 1,
  rows: 20,
  vaild: ""
};

const keywordsColumns = [
  {
    type: "selection",
    key: "",
    width: 60,
    align: "center"
  },
  {
    title: "编号",
    align: "center",
    key: "id",
    width: 80
  },
  {
    title: "关键词",
    align: "center",
    key: "keyword"
  },
  {
    title: "关键词类型",
    align: "center",
    key: "kwType",
    render: (h, params, vm) => {
      const { row } = params;
      let str = "N/A";
      if (row.kwType === "goods") {
        str = "商品";
      } else if (row.kwType === "category") {
        str = "分类";
      }
      return <div>{str}</div>;
    }
  },
  {
    title: "关联名称",
    align: "center",
    key: "mappingId"
  },
  {
    title: "是否热门搜索",
    align: "center",
    key: "hotSearch",
    render: (h, params, vm) => {
      const { row } = params;
      let str = "N/A";
      if (row.hotSearch === "yes") {
        str = "是";
      } else if (row.hotSearch === "no") {
        str = "否";
      }
      return <div>{str}</div>;
    }
  },
  {
    title: "操作",
    align: "center",
    key: "handle",
    options: ["edit", "delete"]
  }
];

const standardColumns = [
  {
    title: "规格ID",
    align: "center",
    key: "id",
    minWidth: 50
  },
  {
    title: "商品条码",
    align: "center",
    key: "barCode",
    minWidth: 70
  },
  {
    title: "商品名称",
    align: "center",
    key: "goodsName",
    minWidth: 100
  },
  {
    title: "商品图片",
    key: "goodsImage",
    align: "center",
    minWidth: 120,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height="60" width="60" />;
      return <div>{str}</div>;
    }
  },
  {
    title: "商品规格",
    align: "center",
    key: "standardDesc",
    minWidth: 80
  },
  {
    title: "商品单位",
    align: "center",
    minWidth: 80,
    key: "goodsUnit"
  },
  {
    title: "商品原价",
    align: "center",
    minWidth: 60,
    key: "price",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "进货价",
    align: "center",
    minWidth: 60,
    key: "purchasePrice",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.purchasePrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: "商品类型",
    minWidth: 80,
    key: "goodsType",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.goodsType == "NORMAL") {
        return (
          <div>
            <tag color="cyan">{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == "VIP") {
        return (
          <div>
            <tag color="orange">{pfExpandTypeConvert(row.goodsType).label}</tag>
          </div>
        );
      } else if (row.goodsType == "FLASHSALE") {
      }
      return (
        <div>
          <tag color="blue">{pfExpandTypeConvert(row.goodsType).label}</tag>
        </div>
      );
      return (
        <div>
          <tag color="primary">N/A</tag>
        </div>
      );
    }
  },
  {
    title: "商品状态",
    minWidth: 80,
    key: "vaild",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === "yes") {
        return (
          <div>
            <tag color="success">上架</tag>
          </div>
        );
      } else if (row.vaild === "no") {
        return (
          <div>
            <tag color="error">下架</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">N/A</tag>
        </div>
      );
    }
  }
];

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ids: [],
      unitsList: [],
      configTotal: "",
      goodsCategoryData: [],
      defaultGoodsCategoryData: [],
      proCategoryTreeList: [],
      productData: [],
      templatePageOpts: [20, 50],
      templatePageOpts1: [20, 50],
      productTotal: 0,
      createLoading: false,
      modalProduct: false,
      modalViewLoading: false,
      clearSearchLoading: false,
      loadingProduct: false,
      pfExpandTypeEnum,
      searchProductRowData: standardRoleRowData,
      searchRowData: _.cloneDeep(roleRowData),
      keywordsDetail: _.cloneDeep(keywordsDetail),
      productStandardDetail: _.cloneDeep(productStandardDetail),
      vipEnum: [
        {
          label: "是",
          value: "yes"
        },
        {
          label: "否",
          value: "no"
        }
      ],
      vaild: [
        {
          label: "上架",
          value: "yes"
        },
        {
          label: "下架",
          value: "no"
        }
      ],
      kwTypeEnum: [
        {
          label: "商品",
          value: "goods"
        },
        {
          label: "分类",
          value: "category"
        }
      ],
      hotSearchEnum: [
        {
          label: "是",
          value: "yes"
        },
        {
          label: "否",
          value: "no"
        }
      ],
      ruleInline: {
        keyword: { required: true, message: "请填写商品关键词" },
        kwType: { required: true, message: "请填写商品关键词类型" },
        mappingId: { required: true, message: "请选择关联的商品或分类" }
      },
      columns: keywordsColumns,
      productColumns: standardColumns
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {
    this.getProductUnits();
    this.getProductCategoriesTree();
  },
  methods: {
    getTableData() {
      getKeywordsPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.configTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProductUnits() {
      getProductUnits().then(res => {
        res.forEach(value => {
          const map = { label: "label", value: "value" };
          map.value = value.unitCode;
          map.label = value.unitName;
          this.unitsList.push(map);
          this.createLoading = false;
        });
      });
    },
    getProductCategoriesTree() {
      this.loading = true;
      this.createLoading = true;
      getProductCategoriesTree()
        .then(res => {
          this.proCategoryTreeList = [];
          if (res && res.length > 0) {
            this.proCategoryTreeList = res;
            const menuList = buildMenu(res);
            const map = {
              id: "id",
              title: "title",
              children: "children"
            };
            this.goodsCategoryData = convertTreeCategory(menuList, map, true);
            this.createLoading = false;
          }
        })
        .catch(() => {
          this.createLoading = false;
        });
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
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(standardRoleRowData);
      this.getProductTableData();
    },
    handleRelation() {
      if (keywordsDetail.kwType === "category") {
        this.$Message.info("请直接选择关联的分类");
        return false;
      }
      this.getProductTableData();
      this.modalProduct = true;
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    handleRowClick(row, index) {
      // 给关联的商品信息赋值
      this.keywordsDetail.mappingId = row.id;
      this.keywordsDetail.mappingName = row.goodsName;
      this.modalProduct = false;
    },
    // 切换分类时清除之前的选择
    kwTypeChange(selectedItem) {
      this.keywordsDetail.mappingId = 0;
      this.keywordsDetail.mappingName = "";
      this.defaultGoodsCategoryData = [];
    },
    // 选择分类
    goodsCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.keywordsDetail.mappingId =
          selectedData[selectedData.length - 1].id;
        this.keywordsDetail.mappingName = this.findGroupName(
          this.keywordsDetail.mappingId
        );
      } else {
        this.keywordsDetail.mappingId = null;
      }
      this.defaultGoodsCategoryData = selectedData;
    },
    findGroupId(id) {
      const obj = this.proCategoryTreeList.find(item => {
        return item.id === id;
      });
      this.defaultGoodsCategoryData.push(id);
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    },
    findGroupName(id) {
      if (this.proCategoryTreeList.length > 0) {
        const obj = this.proCategoryTreeList.find(item => item.id === id);
        if (obj) {
          return obj.title;
        }
      }
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
          this.$Message.error("请完善相关信息!");
        }
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editKeywords(this.keywordsDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.getTableData();
      });
    },
    createTableRow() {
      createKeywords(this.keywordsDetail)
        .then(res => {})
        .finally(res => {
          this.modalEditLoading = false;
          this.modalEdit = false;
          this.getTableData();
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.edit;
      this.keywordsDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleCreate() {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.create;
      this.keywordsDetail = keywordsDetail;
      this.modalEdit = true;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteKeywords({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(Number(this.total) / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleConfigSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    handleConfigClear() {
      this.clearSearchLoading = true;
      this.searchProductRowData = _.cloneDeep(standardRoleRowData);
      this.getProductTableData();
    },
    changeConfigPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeConfigPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
