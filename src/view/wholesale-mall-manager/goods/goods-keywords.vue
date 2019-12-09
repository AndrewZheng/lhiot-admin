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
          <Button v-waves type="success" class="mr5" @click="handleAdd">
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

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ keywordsDetail.id == ''?'创建商品关键词':'编辑商品关键词' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="keywordsDetail" :rules="ruleInline">
          <Row>
            <FormItem label="关键词:" prop="keyword">
              <Input v-model="keywordsDetail.keyword" placeholder="请输入关键词" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="关联类型:" :label-width="100" prop="kwType" >
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
            <FormItem label="关联分类:" v-show="keywordsDetail.kwType ==='category'" style="width: 200px">
              <Cascader
                :data="goodsCategoryData"
                v-model="defaultGoodsCategoryData"
                style="width: 200px"
                @on-change="goodsCategoryChange"
              ></Cascader>
            </FormItem>
            <FormItem label="关联ID:" prop="mappingId">
              <Input v-model="keywordsDetail.mappingId" placeholder="请选择关联" style="width: 200px" readonly>
                <Button slot="append" icon="ios-search" @click="handleRelation"></Button>
              </Input>
            </FormItem>
            <FormItem label="关联名称:" prop="mappingName">
              <Input v-model="keywordsDetail.mappingName" placeholder="关联名称" style="width: 200px" readonly></Input>
            </FormItem>
            <FormItem label="是否热门:" :label-width="100" prop="hotSearch">
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
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modalProduct" :width="1000" title="关联商品">
      <Card>
        <tables
          ref="dataTables"
          v-model="productData"
          :columns="productColumns"
          :loading="loading"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
             <Input
                v-model="searchProductRowData.baseBar"
                placeholder="基础条码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchProductRowData.goodsCode"
                placeholder="商品编码"
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
                :searchLoading="searchLoading"
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
                @click="handleProductClear"
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
      </Card>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  editKeywords,
  deleteKeywords,
  createKeywords,
  getKeywordsPages,
  getProductPages,
  getProductCategoriesTree,
  getProductUnits
} from "@/api/wholesale";

import {
  buildMenu,
  convertTreeCategory,
  convertTree
} from "@/libs/util";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";

const keywordsDetail = {
    id: 0,
    hotSearch: "",// yes-是 no-否
    keyword: "",
    kwType: "", //goods-商品 category-分类
    mappingName:"", // 用于显示
    mappingId: 0
};

const productRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  baseBar: null,
  page: 1,
  rows: 10
};

const productDetail = {
  id: 0,
  goodsCode: "",
  goodsName: "",
  goodsImage: "",
  goodsDes: "",
  categoryId: 0,
  stockLimit: 0,
  unitName: "",
  groupName: "",
  baseBar: "",
  baseUnit: "", // 默认千克
  goodsDes: "",
  goodsImages: "",
  otherImage: ""
};

const roleRowData = {
  keyword: "",
  hotSearch: "",
  kwType: "",
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ids: [],
      unitsList: [],
      goodsCategoryData: [],
      defaultGoodsCategoryData: [],
      proCategoryTreeList: [],
      productData: [],
      productTotal: 0,
      createLoading: false,
      modalProduct: false,
      modalViewLoading: false,
      clearSearchLoading: false,
      searchProductRowData: productRowData,
      searchRowData: _.cloneDeep(roleRowData),
      keywordsDetail: _.cloneDeep(keywordsDetail),
      kwTypeEnum:[
        {
          label: "商品",
          value: "goods"
        },
        {
          label: "分类",
          value: "category"
        }
      ],
      hotSearchEnum:[
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
      columns: [
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
            if(row.kwType == 'goods'){
              str="商品";
            }else if(row.kwType =='category'){
              str="分类"
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
            if(row.hotSearch == 'yes'){
              str="是";
            }else if(row.hotSearch =='no'){
              str="否"
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
      ],
      productColumns:[
        {
          title: "ID",
          key: "id",
          minWidth: 80,
          align: "center",
          fixed: "left"
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
          title: "商品名称",
          align: "center",
          sortable: true,
          key: "goodsName",
          minWidth: 120
        },
        {
          title: "商品类别",
          align: "center",
          key: "categoryId",
          minWidth: 120,
          render: (h, params) => {
            const { row } = params;
            const obj = this.proCategoryTreeList.find(
              item => row.categoryId === item.id
            );
            if (obj) {
              return h("span", obj.title);
            }
            return h("span", row.categoryId);
          }
        },
        {
          title: "基础条码",
          align: "center",
          key: "baseBar",
          sortable: true,
          minWidth: 140
        },
        {
          title: "基础单位",
          align: "center",
          minWidth: 90,
          key: "unitName"
        },
        {
          title: "安全库存",
          align: "center",
          minWidth: 90,
          key: "stockLimit"
        }]
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {
    // 清空上次搜索的结果
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getProductUnits();
    this.getProductCategoriesTree();
  },
  methods: {
    getProductTableData() {
      getProductPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.productTotal = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
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
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleRelation() {
      if(keywordsDetail.kwType ==='category'){
        this.$Message.info("请直接选择关联的分类")
        return false;
      };
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
    onRowClick(row, index) {
      // 给关联的商品信息赋值
      this.keywordsDetail.mappingId = row.id;
      this.keywordsDetail.mappingName = row.goodsName;
      this.modalProduct = false;
    },
    // 切换分类时清除之前的选择
    kwTypeChange(selectedItem){
      this.keywordsDetail.mappingId = 0;
      this.keywordsDetail.mappingName = "";
      this.defaultGoodsCategoryData = [];
    },
    // 选择分类
    goodsCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.keywordsDetail.mappingId = selectedData[selectedData.length - 1].id;
        this.keywordsDetail.mappingName = this.findGroupName(this.keywordsDetail.mappingId);
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
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            this.createTableRow();
          } else if (this.tempModalType === this.modalType.edit) {
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
        this.resetFields();
      });
    },
    createTableRow() {
      createKeywords(this.keywordsDetail)
        .then(res => {})
        .finally(res => {
          this.modalEditLoading = false;
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.keywordsDetail = this._.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getKeywordsPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleAdd() {
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
          const totalPage = Math.ceil(this.total / this.pageSize);
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
