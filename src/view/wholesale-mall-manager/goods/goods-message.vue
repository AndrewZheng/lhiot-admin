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
            <span class="brand-red font-sm">{{ currentName }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="18"
            :operate-area-column="6"
            editable
            searchable
            border
            search-place="top"
            @on-view="handleView"
            @on-edit="handleEdit"
            @on-relevance="handleSetting"
            @on-select-all="onSelectionAll"
            @on-selection-change="onSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model.trim="searchRowData.baseBar"
                  placeholder="基础条码"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <!-- <Input
                  v-model="searchRowData.goodsCode"
                  placeholder="商品编码"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>-->
                <Input
                  v-model="searchRowData.goodsName"
                  placeholder="商品名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Button
                  :search-loading="searchLoading"
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
              <Button v-waves type="warning" class="mr5" @click="handleBack">
                <Icon type="ios-arrow-back" />&nbsp;返回全部分类
              </Button>
              <Button
                v-waves
                :loading="createLoading"
                type="success"
                class="mr5"
                @click="handleCreate"
              >
                <Icon type="md-add" />添加
              </Button>
              <Button
                v-waves
                :loading="exportExcelLoading"
                type="primary"
                class="mr5"
                @click="handleDownload"
              >
                <Icon type="md-download" />导出
              </Button>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="total"
                :current="searchRowData.page"
                :page-size="20"
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>商品基础信息</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <!-- <i-col span="12">
            <Row>
              <i-col span="6">商品编码:</i-col>
              <i-col span="18">{{ productDetail.goodsCode }}</i-col>
            </Row>
          </i-col>-->
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productDetail.goodsName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">商品分类:</i-col>
              <i-col span="18">{{ findGroupName(productDetail.categoryId) }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">安全库存:</i-col>
              <i-col span="16">{{ productDetail.stockLimit }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">基础单位:</i-col>
              <i-col span="18">{{ productDetail.unitName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">基础条码:</i-col>
              <i-col span="16">{{ productDetail.baseBar }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">商品主图:</i-col>
              <i-col v-show="productDetail.goodsImage" span="16">
                <div class="demo-upload-list">
                  <img :src="productDetail.goodsImage" />
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleUploadView(productDetail.goodsImage)"
                    ></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
          <!-- <i-col span="12">
            <Row>
              <i-col span="8">服务保障图:</i-col>
              <i-col v-show="productDetail.otherImage" span="16">
                <div class="demo-upload-list">
                  <img :src="productDetail.otherImage" />
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleUploadView(productDetail.otherImage)"
                    ></Icon>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>-->
        </Row>
        <!-- <Row>
          <i-col span="4">商品详情图：</i-col>
          <i-col span="20">
            <div
              v-for="item in descriptionList"
              :key="item"
              :v-show="productDetail.goodsImages"
              class="demo-upload-list"
            >
              <div>
                <img :src="item" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                </div>
              </div>
            </div>
          </i-col>
        </Row>-->
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品特征:</i-col>
              <i-col span="21">{{ productDetail.goodsDes }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">售后标准:</i-col>
              <i-col span="21">{{ productDetail.afterDes }}</i-col>
            </Row>
          </i-col>
        </Row>-->
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建基础商品信息':'编辑基础商品信息' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="productDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <!-- <i-col span="12">
              <FormItem label="商品编码:" prop="goodsCode">
                <Input v-model="productDetail.goodsCode" placeholder="商品编码(不必填)"></Input>
              </FormItem>
            </i-col>-->
            <i-col span="12">
              <FormItem label="商品名称:" prop="goodsName">
                <Input v-model="productDetail.goodsName" placeholder="商品名称"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品分类:" prop="categoryId">
                <Cascader
                  v-model="defaultGoodsCategoryData"
                  :data="goodsCategoryData"
                  span="21"
                  style="width: 100%"
                  @on-change="goodsCategoryChange"
                ></Cascader>
              </FormItem>
            </i-col>
          </Row>
          <!-- <Row>
            <i-col span="12">
              <FormItem label="安全库存:" prop="stockLimit">
                <InputNumber v-model="productDetail.stockLimit" placeholder="安全库存"></InputNumber>
              </FormItem>
            </i-col>
          </Row>-->
          <Row>
            <i-col span="12">
              <FormItem label="基础单位:" prop="baseUnit">
                <Select :value="productDetail.baseUnit" @on-change="uniteChange">
                  <Option
                    v-for="(item,index) in unitsList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="基础条码:" prop="baseBar">
                <Input v-model.trim="productDetail.baseBar" placeholder="基础条码"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品主图:建议尺寸;690x690(单位:px):" prop="goodsImage">
                <Input v-show="false" v-model="productDetail.goodsImage" style="width: auto"></Input>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMain"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  group-type="base_image"
                  file-dir="product"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem label="服务保障图:建议尺寸;710x250(单位:px)" prop="otherImage">
                <Input v-show="false" v-model="productDetail.otherImage" style="width: auto"></Input>
                <div
                  v-for="item in uploadListDetail"
                  :key="item.url"
                  :v-show="productDetail.otherImage"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveDetail(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadDetail"
                  :default-list="defaultListDetail"
                  :image-size="imageSize"
                  :max-num="1"
                  @on-success="handleSuccessDetail"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>-->
          </Row>
          <!-- <Row>
            <i-col span="12">
              <FormItem label="商品详情图(推荐宽度为710px，高度自适应):" prop="goodsImages">
                <Input v-show="false" v-model="productDetail.goodsImages" style="width: auto"></Input>
                <div
                  v-for="item in uploadListMultiple"
                  :key="item.url"
                  :v-show="productDetail.goodsImages"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMultiple(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMultiple"
                  :default-list="defaultListMultiple"
                  :image-size="imageSize"
                  :max-num="10"
                  multiple
                  @on-success="handleSuccessMultiple"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Button v-waves type="info" @click="modalSort = true">规格描述排序</Button>
            </i-col>
          </Row>-->
          <!-- <Row>
            <i-col span="12">
              <FormItem label="区域:" prop="goodsArea">
                <Select :value="productDetail.goodsArea" @on-change="goodsAreaChange">
                  <Option
                    v-for="(item,index) in goodsAreaList"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="品牌:" prop="goodsBrand">
                <Input v-model="productDetail.goodsBrand" placeholder="品牌"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="产地:" prop="placeOfOrigin">
                <Input v-model="productDetail.placeOfOrigin" placeholder="产地"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="商品特征:" prop="goodsDes">
                <Input
                  v-model="productDetail.goodsDes"
                  :autosize="{minRows: 6,maxRows: 15}"
                  placeholder="请输入商品特征..."
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="售后标准:" prop="afterDes">
                <Input
                  v-model="productDetail.afterDes"
                  :autosize="{minRows: 6,maxRows: 15}"
                  placeholder="请输入售后标准..."
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>-->
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" />
    </Modal>

    <Modal v-model="modalSort" :mask-closable="false" title="图片排序">
      <p slot="header">
        <span>图片排序</span>
      </p>
      <div class="modal-content">
        <drag-list :list1.sync="uploadListMultiple" :drop-con-class="dropConClass" class="clearfix">
          <img
            slot="left"
            slot-scope="left"
            :src="left.itemLeft.url"
            class="drag-item"
            width="80"
            height="80"
          />
        </drag-list>
      </div>
      <div slot="footer">
        <Button @click="modalSort=false">关闭</Button>
        <Button type="primary" @click="handleImgSort">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import DragList from "_c/drag-list";
import CommonIcon from "_c/common-icon";

import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProductPages,
  getProductCategoriesTree,
  getProductUnits,
  deletePicture
} from "@/api/lhfarm-small";
import {
  buildMenu,
  convertTreeCategory,
  setWholesaleGoods,
  convertTree
} from "@/libs/util";

import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";

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
  goodsImages: "",
  otherImage: "",
  goodsArea: "",
  goodsBrand: "",
  placeOfOrigin: "",
  afterDes: ""
};

const roleRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  baseBar: null,
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      menuData: [],
      templatePageOpts: [20, 50],
      descriptionList: [],
      uploadListMain: [],
      uploadListDetail: [],
      uploadListMultiple: [],
      defaultListMultiple: [],
      defaultListMain: [],
      defaultListDetail: [],
      goodsCategoryData: [],
      defaultGoodsCategoryData: [],
      proCategoryTreeList: [],
      unitsList: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      modalSort: false,
      createLoading: false,
      modalViewLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      productDetail: _.cloneDeep(productDetail),
      currentGroupId: 0,
      currentName: "全部分类",
      dropConClass: {
        left: ["drop-box", "left-drop-box"],
        right: ["drop-box", "right-drop-box"]
      },
      goodsAreaList: [
        { label: "国产", value: "domestic" },
        { label: "进口", value: "imported" }
      ],
      ruleInline: {
        // goodsCode: [{ required: false, message: "请输入商品编码" }],
        goodsName: [{ required: true, message: "请输入商品名称" }],
        baseUnit: [{ required: true, message: "请选择商品单位" }],
        baseBar: [{ required: true, message: "请输入基础条码" }],
        // goodsDes: [{ required: true, message: "请输入商品特征" }],
        // afterDes: [{ required: true, message: "请输入售后标准" }],
        // goodsArea: [{ required: true, message: "请选择商品区域" }],
        // goodsBrand: [{ required: true, message: "请输入商品品牌" }],
        // placeOfOrigin: [{ required: true, message: "请输入商品产地" }],
        categoryId: [{ required: true, message: "请选择商品分类" }],
        goodsImage: [{ required: true, message: "请上传商品主图" }]
        // goodsImages: [{ required: true, message: "请上传商品详情图" }],
        // otherImage: [{ required: true, message: '请上传服务保障图' }],
        // stockLimit: [{ required: true, message: "请输入安全库存" }]
      },
      columns: [
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
          title: "商品描述",
          align: "center",
          sortable: true,
          key: "goodsDes",
          width: 120,
          tooltip: true
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
          title: "商品区域",
          align: "center",
          minWidth: 90,
          key: "goodsArea",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.goodsArea === "imported") {
              return <div>{"进口"}</div>;
            } else if (row.goodsArea === "domestic") {
              return <div>{"国产"}</div>;
            }
            return <div>{""}</div>;
          }
        },
        {
          title: "商品品牌",
          align: "center",
          minWidth: 90,
          key: "goodsBrand"
        },
        {
          title: "商品产地",
          align: "center",
          minWidth: 90,
          key: "placeOfOrigin"
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
        },
        {
          title: "操作",
          minWidth: 150,
          key: "handle",
          options: ["view", "edit", "settings"]
        }
      ]
    };
  },
  created() {
    this.initMenuList();
  },
  mounted() {
    // 清空上次搜索的结果
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getProductUnits();
    this.getProductCategoriesTree();
  },
  methods: {
    getTableData() {
      getProductPages(this.searchRowData)
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
          }
        })
        .finally(() => {
          this.loading = false;
        });
      this.getTableData();
    },
    resetRowData() {
      this.productDetail = _.cloneDeep(productDetail);
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.resetRowData();
      // 图片上传列表清除
      this.uploadListMain = [];
      this.uploadListDetail = [];
      this.uploadListMultiple = [];
    },
    handleBack() {
      this.currentName = "全部分类";
      this.handleClear();
    },
    handleCreate() {
      if (this.tempModalType !== this.modalType.create) {
        this.resetFields();
        this.defaultGoodsCategoryData = [];
        this.tempModalType = this.modalType.create;
      }
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setWholesaleGoods(rows);
      this.turnToPage({
        name: "wholesale-goods-relation-standard",
        params: { productId: params.row.id, unitsList: this.unitsList }
      });
    },
    handleImgSort() {
      this.descriptionList = [];
      this.uploadListMultiple.forEach(item => {
        if (item.url) {
          this.descriptionList.push(item.url);
        }
      });
      this.productDetail.goodsImages = "";
      this.productDetail.goodsImages = this.descriptionList.join(",");
      console.log("after sort:", this.productDetail.goodsImages);
      this.modalSort = false;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productDetail = _.cloneDeep(params.row);
      if (this.productDetail.goodsImages) {
        this.descriptionList = this.productDetail.goodsImages.split(",");
      }
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.goodsImage);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      getProduct({
        id: params.row.id
      }).then(res => {
        this.productDetail = res;
        this.setDefaultUploadList(res);
        this.defaultGoodsCategoryData = [];
        this.findGroupId(this.productDetail.categoryId);
        this.defaultGoodsCategoryData.reverse();
        this.modalEdit = true;
      });
    },
    createProduct() {
      this.modalViewLoading = true;
      this.productDetail.baseBar = this.productDetail.baseBar.trim();
      createProduct({
        ...this.productDetail
      })
        .then(res => {
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    editProduct() {
      this.modalViewLoading = true;
      this.productDetail.baseBar = this.productDetail.baseBar.trim();
      editProduct({
        ...this.productDetail
      })
        .then(res => {
          this.modalEdit = false;
          this.$Message.success("修改成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    handleSubmit() {
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createProduct();
          } else if (this.isEdit) {
            this.editProduct();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = {
      //     urls: this.newPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    // deletePicture(urls) {
    //   deletePicture({
    //     urls
    //   })
    //     .then(res => {})
    //     .catch(() => {});
    // },
    handleDownload() {
      this.exportExcelLoading = true;
      // TODO：测试导出不带分页搜索条件 目前默认导出10条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      let pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getProductPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item.categoryId = this.findGroupName(item.categoryId);
          item.goodsImage = "";
          if (item.goodsArea === "imported") {
            item.goodsArea = "进口";
          } else if (item.goodsArea === "domestic") {
            item.goodsArea = "国产";
          } else {
            item.goodsArea = "";
          }
        });
        const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
        this.$refs.tables.handleDownload({
          filename: `商品基础信息-${date}`,
          data: tableData
        });
        this.exportExcelLoading = false;
      });
    },
    // 选择分类
    goodsCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.productDetail.categoryId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.productDetail.categoryId = null;
      }
      this.defaultGoodsCategoryData = selectedData;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteProduct({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.goodsImage != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.goodsImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }

      // if (res.otherImage != null) {
      //   const map = { status: "finished", url: "url" };
      //   const detailImgArr = [];
      //   map.url = res.otherImage;
      //   detailImgArr.push(map);
      //   this.$refs.uploadDetail.setDefaultFileList(detailImgArr);
      //   this.uploadListDetail = detailImgArr;
      // }

      // if (res.goodsImages != null) {
      //   const descriptionImgArr = [];
      //   const descriptionArr = res.goodsImages.split(",");
      //   descriptionArr.forEach(value => {
      //     const innerMapDetailImg = { status: "finished", url: "url" };
      //     innerMapDetailImg.url = value;
      //     descriptionImgArr.push(innerMapDetailImg);
      //   });
      //   this.$refs.uploadMultiple.setDefaultFileList(descriptionImgArr);
      //   this.uploadListMultiple = descriptionImgArr;
      // }
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
    // 删除附图
    handleRemoveSecond(file) {
      this.$refs.uploadSecond.deleteFile(file);
      const index = this.productDetail.subImg.indexOf(file.url);
      if (index > -1) {
        this.productDetail.subImg.splice(index, 1);
      }
      if (this.productDetail.subImg.length === 0) {
        this.$refs.uploadSecond.clearFileList();
        this.productDetail.subImg = null;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      // this.uploadListMain = []
      this.productDetail.mainImg = null;
    },
    handleRemoveDetail(file) {
      this.$refs.uploadDetail.deleteFile(file);
      this.productDetail.otherImage = null;
    },
    handleRemoveMultiple(file) {
      this.$refs.uploadMultiple.deleteFile(file);
      const index = this.productDetail.goodsImages.indexOf(file.url);
      if (index > -1) {
        if (this.productDetail.goodsImages) {
          this.descriptionList = this.productDetail.goodsImages.split(",");
        }
        this.descriptionList = _.without(this.descriptionList, file.url);
        this.productDetail.goodsImages = this.descriptionList.join(",");
      }
      if (this.productDetail.goodsImages.length === 0) {
        this.$refs.uploadMultiple.clearFileList();
        this.descriptionList = [];
        this.productDetail.goodsImages = null;
      }
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productDetail.goodsImage = null;
      this.productDetail.goodsImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    // 上架服务保障图
    handleSuccessDetail(response, file, fileList) {
      this.uploadListDetail = fileList;
      this.productDetail.otherImage = null;
      this.productDetail.otherImage = fileList[0].url;
    },
    // 上架规格描述图
    handleSuccessMultiple(response, file, fileList) {
      this.uploadListMultiple = fileList;
      this.descriptionList = [];
      fileList.forEach(value => {
        if (value.url) {
          this.descriptionList.push(value.url);
        }
      });
      this.productDetail.goodsImages = "";
      this.productDetail.goodsImages = this.descriptionList.join(",");
      console.log(this.productDetail.goodsImages);
      console.log(JSON.stringify(this.productDetail.goodsImages));
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductCategoriesTree().then(res => {
        if (res && res.length > 0) {
          const menuList = buildMenu(res);
          const map = {
            title: "title",
            children: "children"
          };
          this.menuData = convertTree(menuList, map, true);
          if (this.menuData.length > 0) {
            this.getTableData();
          }
        }
      });
    },
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
    handleClick({ root, node, data }) {
      this.loading = true;
      // 展开当前节点
      if (typeof data.expand === "undefined") {
        // this.$set(data, 'expend', true);
        this.$set(data, "expend", false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.currentName = data.title;
      this.currentGroupId = data.id;
      this.searchRowData.categoryId = data.id;
      // 获取新数据
      this.getTableData();
    },
    uniteChange(value) {
      this.productDetail.baseUnit = value;
    },
    goodsAreaChange(value) {
      this.productDetail.goodsArea = value;
    },
    handleClear() {
      this.currentName = "全部分类";
      this.initMenuList();
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
