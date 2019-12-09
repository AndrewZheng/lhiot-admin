<template>
  <div class="m-role">
    <Card>
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
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-discount="handleDiscount"
        @on-delete="handleDelete"
        @custom-on-sale="customOnSale"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row v-show="!showBack">
            <Input
              v-model="searchRowData.barCode"
              placeholder="商品条码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.goodsName"
              placeholder="商品名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.vaild"
              class="search-col"
              placeholder="上架状态"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in vaild"
                :value="item.value"
                :key="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.vipEnum"
              class="ml5"
              placeholder="是否VIP商品"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in vipEnum"
                :value="item.value"
                :key="item.value"
                class="ml15 mt10 mr15"
              >{{ item.label }}</Option>
            </Select>
            <InputNumber
              v-model="searchMinPrice"
              placeholder="最低价格"
              class="search-input mr5"
              style="width: auto"
              clearable
              @on-change="searchMinPriceChange"
            ></InputNumber>
            <InputNumber
              v-model="searchMaxPrice"
              placeholder="最高价格"
              class="search-input mr5"
              style="width: auto"
              clearable
              @on-change="searchMaxPriceChange"
            ></InputNumber>
            <Button
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
          </Row>
          <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>
        </div>
        <div slot="operations">
          <Button
            v-waves
            v-show="showBack"
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves class="search-btn ml5 mr5" type="success" @click="handleCreateView">
            <Icon type="md-add" />&nbsp;添加
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
          <Button class="search-btn mr2" type="warning" @click="handleDownload">
            <Icon type="md-download" />导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品ID:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.baseProductName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品分类:</i-col>
              <i-col span="16">{{ productStandardDetail.categoryName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">基础单位:</i-col>
              <i-col span="16">{{ productStandardDetail.baseUnitName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品编码:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品主图:</i-col>
              <i-col span="16">
                <img :src="productStandardDetail.goodsImage" width="100" height="100" />
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">商品规格</Divider>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品名称:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">上架商品主图:</i-col>
              <i-col v-if="productStandardDetail.goodsImage" span="16">
                <img :src="productStandardDetail.goodsImage" width="100" height="100" />
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品规格描述:</i-col>
              <i-col span="16">{{ productStandardDetail.standardDesc }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">数量/重量:</i-col>
              <i-col span="16">{{ productStandardDetail.weight }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品原价:</i-col>
              <i-col span="16">{{ productStandardDetail.price| fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">进货价:</i-col>
              <i-col span="16">{{ productStandardDetail.purchasePrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品单位:</i-col>
              <i-col span="16">{{ productStandardDetail.goodsUnit }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{ productStandardDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!-- 添加 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="900">
      <p slot="header">
        <span>{{ productStandardDetail.id ===0 ? '创建商品规格':'编辑商品规格' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="productStandardDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="12">
              <FormItem label="商品ID:" prop="goodsId">
                <Input v-model="productStandardDetail.goodsId" readonly="readonly">
                  <Button slot="append" icon="ios-search" @click="handleRelation"></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品名称:">{{ productStandardDetail.baseProductName }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品分类:">{{ productStandardDetail.categoryName }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="基础单位:">{{ productStandardDetail.baseUnitName }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <!-- <i-col span="12">
              <FormItem label="商品编码:">{{ productStandardDetail.goodsCode }}</FormItem>
            </i-col> -->
            <i-col span="12">
              <FormItem label="商品条码:">{{ productStandardDetail.barCode }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem v-if="productStandardDetail.goodsImage" label="商品主图:">
                <img :src="productStandardDetail.goodsImage" width="100" height="100" />
              </FormItem>
            </i-col>
          </Row>
          <Divider orientation="center">规格信息</Divider>
          <Row>
            <i-col span="12">
              <FormItem label="上架商品名称:" prop="goodsName">
                <Input v-model="productStandardDetail.goodsName"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="上架商品主图:建议尺寸;400x400(单位:px):" prop="goodsImage">
                <Input v-show="false" v-model="productStandardDetail.goodsImage" style="width: auto"></Input>
                <div
                  v-for="item in uploadListMain"
                  :key="item.url"
                  :v-show="productStandardDetail.goodsImage"
                  class="demo-upload-list"
                >
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
                  :max-num="1"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品条码:" prop="barCode">
                <Input v-model="productStandardDetail.barCode"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品状态:" prop="vaild">
                <Select v-model="productStandardDetail.vaild">
                  <Option
                    v-for="(item,index) in vaild"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品规格:" prop="standardDesc">
                <Input v-model="productStandardDetail.standardDesc"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="数量/重量:" prop="weight">
                <InputNumber :min="0" v-model="productStandardDetail.weight"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品单位:" prop="unitCode">
                <Select v-model="productStandardDetail.unitCode" @on-change="unitChange">
                  <Option
                    v-for="(item,index) in unitsList"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品排序:" prop="rank">
                <InputNumber :min="0" v-model="productStandardDetail.rank"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品原价:" prop="price">
                <InputNumber :min="0" :value="priceComputed" @on-change="priceInputNumberOnchange"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品进货价:" prop="purchasePrice">
                <InputNumber :min="0" :value="purchasePriceComputed" @on-change="purchasePriceOnchange"></InputNumber>
              </FormItem>
            </i-col>
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

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" />
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import DragList from "_c/drag-list";
import IViewUpload from "_c/iview-upload";
import {
  createProductStandard,
  deleteProductStandard,
  getProStandardExpand,
  getProductStandardsPages,
  modifyProStandardExpand,
  editProductStandard,
  getProductUnits,
  getProductPages,
  getHdProductInfo
} from "@/api/wholesale";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  getSmallGoodsStandard,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";
import {
  customPlanStatusConvert,
} from "@/libs/converStatus";

const productStandardDetail = {
  barCode: "", 
  baseUnitName: "", 
  categoryName: "", 
  goodsCode: "",
  goodsId: 0,
  goodsImage: "",
  goodsName: "",
  goodsPriceRegionList: [
    {
      goodsStandardId: 0,
      id: 0,
      maxQuantity: 0,
      minQuantity: 0,
      price: 0,
      reorder: 0,
      standardDes: ""
    }
  ], // 商品价格区间
  goodsUnit: "",
  hdSkuId: "",
  id: 0,
  isVip: "",
  netWeight: 0,// 商品净重
  price: 0,
  purchasePrice: 0,
  standard: "",
  standardDesc: "",
  unitCode: "",
  vaild: "",
  weight: 0,
  rank: 0,// 先保留后续扩展
  baseProductName: "",// 先保留可扩展
};

const roleRowData = {
  goodsId: "",
  barCode: "",
  goodsCode: "",
  goodsName: "",
  vaild: "",
  minPrice: "",
  maxPrice: "",
  page: 1,
  rows: 10
};

const productDetail = {
  id: 0,
  goodsCode: "",
  goodsName: "",
  goodsImage: "",
  unitCode: 0,
  baseBar: "",
  hdSkuId: "",
  unitName: "",
  categoryName: "",
};

const productRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  baseBar: null,
  page: 1,
  rows: 10
};

const proStandardExpand = {
  id: null,
  discountPrice: 0,
  discountRate: 0,
  limitNum: 0,
  standardId: 0,
  startNum: 0
};

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      unitsList: [],
      descriptionList: [],
      defaultListMain: [],
      defaultListMultiple: [],
      defaultListDetail: [],
      uploadListMain: [],
      uploadListDetail: [],
      uploadListMultiple: [],
      vipEnum:[
        {
          label: "是",
          value: "yes"
        },
        {
          label: "否",
          value: "no"
        }
      ],
      ruleValidate: {
        limitNum: [
          { required: false, message: "请输入限购份数", trigger: "blur" }
        ],
        startNum: [
          { required: false, message: "请输入起购份数", trigger: "blur" }
        ],
        discountPrice: [
          { required: true, message: "请输入折扣价格", trigger: "change" }
        ],
        discountRate: [
          { required: false, message: "请计算折扣率", trigger: "change" }
        ]
      },
      ruleInline: {
        goodsId: [
          { required: true, message: "请选择关联商品" },
          {
            message: "请选择要关联的商品",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        goodsName: [{ required: true, message: "请选择上架商品名称" }],
        goodsImage: [{ required: true, message: "请上传上架商品主图" }],
        availableStatus: [{ required: true, message: "请选择商品分类" }],
        unitCode: [{ required: true, message: "请选择商品单位" }],
        vaild: [{ required: true, message: "请选择商品状态" }],
        standardDesc: [{ required: true, message: "请输入商品规格" }],
        price: [
          { required: true, message: "请输入商品价格" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        barCode: [{ required: true, message: "请输入商品条码" }],
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
        rank: [
          { required: false, message: "请输入商品排序" },
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
        weight: [
          { required: true, message: "请输入重量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
                errors.push(new Error("必须为大于0的数字"));
              }
              callback(errors);
            }
          }
        ]
      },
      columns: [
        {
          type: "selection",
          key: "",
          minWidth: 50,
          align: "center",
          fixed: "left"
        },
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
          title: "是否VIP",
          minWidth: 80,
          key: "isVip",
          align: "center",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.isVip === "yes") {
              return (
                <div>
                  <tag color="warning">
                    VIP
                  </tag>
                </div>
              );
            } else if (row.isVip === "no") {
              return (
                <div>
                  <tag color="primary">
                    普通
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">
                  N/A
                </tag>
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
                  <tag color="success">
                    上架
                  </tag>
                </div>
              );
            } else if (row.vaild === "no") {
              return (
                <div>
                  <tag color="error">
                    下架
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">
                  N/A
                </tag>
              </div>
            );
          }
        },
        // {
        //   title: "商品排序",
        //   align: "center",
        //   minWidth: 60,
        //   key: "rank"
        // },
        {
          title: "操作",
          align: "center",
          minWidth: 180,
          key: "handle",
          options: ["customOnSale", "view", "edit", "discount", "delete"]
        }
      ],
      productColumns: [
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
          title: "基础条码",
          align: "center",
          sortable: true,
          key: "baseBar",
          minWidth: 80
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
          key: "categoryName",
          minWidth: 120
        },
        {
          title: "基础单位",
          align: "center",
          minWidth: 90,
          key: "unitName"
        }
      ],
      modalType: {
        view: "view",
        edit: "edit",
        create: "create"
      },
      dropConClass: {
        left: ["drop-box", "left-drop-box"],
        right: ["drop-box", "right-drop-box"]
      },
      tempModalType: "create",
      tableData: [],
      total: 0,
      productData: [],
      productTotal: 0,
      loading: true,
      modalViewLoading: false,
      modalView: false,
      modalEdit: false,
      modalDiscount: false,
      modalHdSvip: false,
      modalProduct: false,
      modalSort: false,
      searchRowData: roleRowData,
      searchProductRowData: productRowData,
      productStandardDetail: productStandardDetail,
      proStandardExpand: proStandardExpand,
      productDetail: productDetail,
      // 选中的行
      tableDataSelected: [],
      showBack: false,
      HdSvipInfo: "",
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
      searchMinPrice: null,
      searchMaxPrice: null
    };
  },
  computed: {
    priceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.price);
    },
    purchasePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.purchasePrice);
    },
    salePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.salePrice);
    },
    svipPriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.svipPrice);
    },
    discountPriceComputed() {
      return fenToYuanDot2Number(this.proStandardExpand.discountPrice);
    }
  },
  created() {
    this.showBack = this.$route.name === "wholesale-goods-relation-standard";
    this.getTableData();
  },
  mounted() {
    this.getProductUnits();
  },
  methods: {
    priceInputNumberOnchange(value) {
      this.productStandardDetail.price = yuanToFenNumber(value);
    },
    purchasePriceOnchange(value) {
      this.productStandardDetail.purchasePrice= yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.productStandardDetail.salePrice = yuanToFenNumber(value);
    },
    svipPriceInputNumberOnchange(value) {
      this.productStandardDetail.svipPrice = yuanToFenNumber(value);
    },
    searchMinPriceChange(value) {
      this.searchRowData.minPrice = yuanToFenNumber(this.searchMinPrice);
    },
    searchMaxPriceChange(value) {
      this.searchRowData.maxPrice = yuanToFenNumber(this.searchMaxPrice);
    },
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning("请选中要删除的行");
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(",");
      this.deleteTable(strTempDelete);
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductStandard({
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
        .catch(() => {
          this.loading = false;
        });
    },
    unitChange(value) {
      this.productStandardDetail.goodsUnit = value;
    },
    handleDiscountClose() {
      this.modalDiscount = false;
      // 清楚掉表单数据
      this.$refs.modalDiscount.resetFields();
    },
    handleClose() {
      this.modalView = false;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = this._.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = this._.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.$refs.editForm.resetFields();
      this.modalEdit = true;
    },
    handleDiscount(params) {
      // 展示折扣配置弹窗
      this.productStandardDetail = this._.cloneDeep(params.row);
      // 先清除上次请求的数据
      this.proStandardExpand = proStandardExpand;
      // 请求数据展示
      getProStandardExpand({
        id: this.productStandardDetail.id
      })
        .then(res => {
          if (res && res.id > 0) {
            this.proStandardExpand = res;
          }
          this.modalDiscount = true;
        })
        .catch(() => {
          this.modalDiscount = false;
        });
    },
    // 海鼎会员价查询
    handleHdSvipPrice() {
      // this.modalHdSvip = true;
      //console.log(this.productStandardDetail.barCode)
      if (!this.productStandardDetail.barCode) {
        this.$Message.error("请先选择关联商品");
        return;
      }
      this.loading = true;
      let code = this.productStandardDetail.barCode;
      getHdProductInfo({ code: code })
        .then(res => {
          this.HdSvipInfo = res;
          this.loading = false;
          this.modalHdSvip = true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleHdSvipClose() {
      this.modalHdSvip = false;
    },
    // 选中当前数据
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    handleCreateView() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.productStandardDetail = _.cloneDeep(productStandardDetail);
      }
      // 复制数据
      if (this.currentTableRowSelected) {
        // console.log("当前选中数据", this.currentTableRowSelected);
        this.currentTableRowSelected.goodsId = null;
        // this.currentTableRowSelected.baseProductName = null;
        // this.currentTableRowSelected.categoryName = null;
        // this.currentTableRowSelected.baseUnitName = null;
        // this.currentTableRowSelected.goodsCode = null;
        // this.currentTableRowSelected.barCode = null;
        // this.currentTableRowSelected.goodsImage = null;
        this.currentTableRowSelected.goodsImage = null;
        this.currentTableRowSelected.barCode = null;
        this.currentTableRowSelected.price = null;
        this.currentTableRowSelected.salePrice = null;
        this.currentTableRowSelected.productStandardExpand = null;
        // console.log("当前选中数据", this.currentTableRowSelected);
        this.productStandardDetail = _.cloneDeep(this.currentTableRowSelected);
      }
      this.tempModalType = this.modalType.create;
     
      // this.productStandardDetail.weight = 0;
      // this.productStandardDetail.rank = 0;
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalEdit = true;
    },
    resetFields() {
      // 表单重置
      this.$refs.editForm.resetFields();
      // 图片上传列表清除
      this.uploadListMain = [];
      this.uploadListDetail = [];
      this.uploadListMultiple = [];
    },
    createStandard() {
      this.modalViewLoading = true;
      createProductStandard({
        goodsId: this.$route.params.id,
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    // 下载
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getProductStandardsPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        // 表格数据导出字段翻译
        let _this = this;
        tableData.forEach(item => {
          item["price"] = (item["price"] / 100.0).toFixed(2);
          item["salePrice"] = (item["salePrice"] / 100.0).toFixed(2);
          item["svipPrice"] = (item["svipPrice"] / 100.0).toFixed(2);
          item["vaild"] = customPlanStatusConvert(
            item["vaild"]
          ).label;
        });
        this.$refs.tables.handleDownload({
          filename: `商品规格-${new Date().valueOf()}`,
          data: tableData
        });
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.productStandardDetail.salePrice) {
            this.$Message.error("请输入售卖价格");
            return;
          }
          if (this.productStandardDetail.salePrice < 0) {
            this.$Message.error("售卖价格不能小于0");
            return;
          }
          if (this.productStandardDetail.svipPrice < 0) {
            this.$Message.error("SVIP价格不能小于0");
            return;
          }
          if (
            this.productStandardDetail.salePrice >
            this.productStandardDetail.price
          ) {
            this.$Message.error("售卖价格不能大于原价");
            return;
          }
          if (
            this.productStandardDetail.svipPrice >
            this.productStandardDetail.salePrice
          ) {
            this.$Message.error("SVIP价格不能大于售卖价格");
            return;
          }
          if (this.tempModalType === this.modalType.create) {
            this.createStandard();
          } else if (this.tempModalType === this.modalType.edit) {
            this.editProductStandard();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleSubmitDiscount() {
      // 校验某些字段
      this.$refs.modalDiscount.validate(valid => {
        if (valid) {
          if (this.proStandardExpand.limitNum <= 0) {
            this.$Message.warning("请输入合法的数字");
            return false;
          }
          this.updateProStandardExpand();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    updateProStandardExpand() {
      this.proStandardExpand.standardId = this.productStandardDetail.id;
      this.modalViewLoading = true;
      // 新增或修改
      modifyProStandardExpand({
        ...this.proStandardExpand
      })
        .then(res => {
          const msg = this.proStandardExpand.id ? "修改成功!" : "创建成功";
          this.modalDiscount = false;
          this.modalViewLoading = false;
          this.$Message.success(msg);
          this.getTableData();
        })
        .catch(() => {
          this.modalDiscount = false;
          this.modalViewLoading = false;
        });
    },
    editProductStandard() {
      this.modalViewLoading = true;
      editProductStandard({
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          // this.productStandardDetail = productStandardDetail;
          // this.productStandardDetail.goodsId = this.$route.params.id;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    changePage(page) {
      this.searchRowData.page = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.searchRowData.page = 1;
      this.searchRowData.rows = pageSize;
      this.getTableData();
    },
    getProductUnits(){
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
    getTableData() {
      // 获取商品页面传过来的商品信息
      // console.log("this.$route.name:", this.$route.name);
      if (this.$route.name === "wholesale-goods-relation-standard") {
        const goodsStandard = getSmallGoodsStandard();
        console.log("standard from cookie:", goodsStandard);
        if (goodsStandard != null && goodsStandard !== "") {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.goodsId = goodsStandard.id;
          this.productStandardDetail = this._.cloneDeep(goodsStandard);
          this.productStandardDetail.goodsId = goodsStandard.id;
          this.productStandardDetail.baseUnitName = goodsStandard.unitName;
          this.productStandardDetail.baseProductName =
            goodsStandard.goodsName;
          this.productStandardDetail.goodsImage = goodsStandard.goodsImage;
        }
      } else {
        // 清楚上次的查询条件
        this.searchRowData.goodsId = "";
      }

      getProductStandardsPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    statusChange(value) {
      this.productStandardDetail.vaild = value;
    },
    // 上架商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productStandardDetail.goodsImage = null;
      this.productStandardDetail.goodsImage = fileList[0].url;
    },
    // 设置编辑图片列表
    setDefaultUploadList(res) {
      if (res.goodsImage != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.goodsImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },

    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.productStandardDetail.goodsImage = null;
    },
    customOnSale(params) {
      const rowData = this._.cloneDeep(params.row);
      if (params.row.vaild === "yes") {
        rowData.vaild = "no";
      } else {
        rowData.vaild = "yes";
      }
      this.loading = true;
      editProductStandard(rowData)
        .then(res => {
          this.$Message.success("修改成功!");
        })
        .finally(res => {
          this.loading = false;
          this.modalViewLoading = false;
          this.getTableData();
          this.modalEdit = false;
        });
    },
    goBack() {
      this.turnToPage("small-goods-info");
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    findUnit(unitCode) {
      if (this.unitsList != null) {
        const obj = this.unitsList.find(item => item.value === unitCode);
        if (obj) {
          return obj.label;
        }
      }
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
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
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    onRowClick(row, index) {
      // 给基础商品信息赋值
      this.productStandardDetail.goodsId = row.id;
      this.productStandardDetail.baseProductName = row.goodsName;
      this.productStandardDetail.categoryName = row.categoryName;
      this.productStandardDetail.baseUnitName = row.unitName;
      this.productStandardDetail.barCode = row.baseBar;// 商品对象的条码和规格对象里条码不一致
      // 给要关联的规格信息设置默认值，用户可以选择修改
      this.productStandardDetail.goodsName = row.goodsName;
      this.productStandardDetail.goodsImage = row.goodsImage;
      this.productStandardDetail.vaild = "no"; //默认是未上架的
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalProduct = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
