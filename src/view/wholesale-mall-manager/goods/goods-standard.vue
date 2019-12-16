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
        @on-discount="handleRegin"
        @on-delete="handleDelete"
        @custom-on-sale="handlePublish"
        @on-selection-change="handleSelectionChange"
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
          <!-- <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div> -->
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
          <Button v-waves class="search-btn ml5 mr5" type="success" @click="handleCreate">
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
              <i-col span="16">{{ productStandardDetail.goodsName }}</i-col>
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
        <Button type="primary" @click="modalView = false">关闭</Button>
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
            <i-col span="12">
              <FormItem v-if="productStandardDetail.goodsImage" label="商品主图:">
                <img :src="productStandardDetail.goodsImage" width="100" height="100" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品条码:">{{ productStandardDetail.barCode }}</FormItem>
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
              <FormItem label="商品条码:" prop="barCode">
                <Input v-model="productStandardDetail.barCode"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="上架商品主图:建议尺寸;400x400(单位:px):" prop="goodsImage">
                <Input
                  v-show="false"
                  v-model="productStandardDetail.goodsImage"
                  style="width: auto"
                ></Input>
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
            <i-col span="12">
              <FormItem label="规格描述:" prop="standardDesc">
                <Input
                  v-model="productStandardDetail.standardDesc"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 6}"
                  placeholder="请输入规格描述..."
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品状态:" prop="vaild" style="width:200px;">
                <Select v-model="productStandardDetail.vaild">
                  <Option
                    v-for="(item,index) in vaild"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Row>
                <i-col span="12">
                  <FormItem label="商品单位:" prop="unitCode" style="width:180px;">
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
                  <FormItem label="是否VIP:" prop="isVip" style="width:180px;">
                    <Select v-model="productStandardDetail.isVip">
                      <Option
                        v-for="(item,index) in vipEnum"
                        :value="item.value"
                        :key="index"
                        class="ptb2-5"
                        style="padding-left: 5px"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="数量/重量:" prop="weight">
                <InputNumber :min="0" v-model="productStandardDetail.weight"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品净重:" prop="netWeight">
                <InputNumber :min="0" v-model="productStandardDetail.netWeight"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品原价:" prop="price">
                <InputNumber :min="0" :value="priceComputed" @on-change="priceOnchange"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品进货价:" prop="purchasePrice">
                <InputNumber
                  :min="0"
                  :value="purchasePriceComputed"
                  @on-change="purchasePriceOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品规格:" prop="standard">
                <Input v-model="productStandardDetail.standard"></Input>
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem label="商品排序:" prop="rank">
                <InputNumber :min="0" v-model="productStandardDetail.rank"></InputNumber>
              </FormItem>
            </i-col> -->
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <!-- 关联商品弹窗-->
    <Modal v-model="modalProduct" :width="1000" title="关联商品">
      <Card>
        <tables
          ref="dataTables"
          v-model="productData"
          :columns="productColumns"
          :loading="loadingProduct"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="handleGoodsRelation"
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

    <!-- 价格区间弹窗-->
    <Modal v-model="modalRegion" title="区间价格管理" :width="1200">
      <Card>
        <tables
          ref="dataTables"
          v-model="priceRegionData"
          :columns="regionColumns"
          :loading="loadingRegion"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          highlight-row
          search-place="top"
          @on-edit="handleEditRegion"
          @on-delete="handleDeleteRegion"
        >
          <div slot="searchCondition">
            <i-col span="12">{{ productStandardDetail.goodsName }}--区间价格设置</i-col>
          </div>
          <div slot="operations">
            <Button v-waves class="search-btn ml5 mr5" type="success" @click="handleRegionAdd">
              <Icon type="md-add" />&nbsp;添加
            </Button>
            <Poptip
              confirm
              placement="bottom"
              style="width: 100px"
              title="您确认删除选中的内容吗?"
              @on-ok="handleBatchDel"
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
              :total="regionTotal"
              :current="priceRegionRowData.page"
              show-sizer
              show-total
              @on-change="changePriceRegionPage"
              @on-page-size-change="changePriceRegionPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>

    <!-- 价格区间的创建或修改-->
    <Modal v-model="modalEditRegion" :mask-closable="false">
      <p slot="header">
        <span>{{ goodsPriceRegion.id ===0 ? '创建商品区间价格':'编辑商品区间价格' }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editRegionForm"
          :model="goodsPriceRegion"
          :rules="ruleInlineRegion"
          :label-width="100"
        >
          <Row>
            <i-col span="12">
              <FormItem label="商品名称:">{{ productStandardDetail.goodsName }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品价格:" prop="price">
                <InputNumber :min="0" :value="reginPriceComputed" @on-change="reginPriceOnchange"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="最低购买:" prop="minQuantity" style="width:200px">
                <Input v-model="goodsPriceRegion.minQuantity"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="最高购买:" prop="maxQuantity" style="width:200px">
                <Input v-model="goodsPriceRegion.maxQuantity"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="规格数量描述:" prop="standardDes">
                <Input v-model="goodsPriceRegion.standardDes"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="商品排序:" prop="reorder">
                <InputNumber :min="0" v-model="goodsPriceRegion.reorder"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modalEditRegion = false">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmitRegin">确定</Button>
      </div>
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
  getProductPages,
  getProductStandardsPages,
  getGoodsPriceRegionPages,
  getProStandardExpand,
  getProductUnits,
  createProductStandard,
  createGoodsPriceRegion,
  deleteProductStandard,
  deleteGoodsPriceRegion,
  editProductStandard,
  editGoodsPriceRegion,
  modifyProStandardExpand
} from "@/api/wholesale";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  getWholesaleGoods,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";
import { customPlanStatusConvert } from "@/libs/converStatus";

const productStandardDetail = {
  barCode: "",
  baseUnitName: "",
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
  otherImage: "",
  goodsImages: "",
  goodsDes: "",
  unitCode: 0,
  categoryId: 0,
  stockLimit: 0,
  baseBar: "",
  baseUnit: "",
  unitName: "",
  categoryName: ""
};

const productRowData = {
  categoryId: null,
  goodsCode: null,
  goodsName: null,
  baseBar: null,
  page: 1,
  rows: 10
};

const priceRegionRowData = {
  goodsStandardId: 0,
  page: 1,
  rows: 10
};

const goodsPriceRegion = {
  id: 0,
  goodsStandardId: 0,
  minQuantity: 0,
  maxQuantity: 0,
  price: 0,
  reorder: 0, // 排序
  standardDes: "" //价格区间描述
};

const standardColumns = [
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
            <tag color="warning">VIP</tag>
          </div>
        );
      } else if (row.isVip === "no") {
        return (
          <div>
            <tag color="primary">普通</tag>
          </div>
        );
      }
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
];

const productColumns = [
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
];

const goodsPriceRegionColumns = [
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
    key: "goodsStandardId",
    minWidth: 50
  },
  {
    title: "商品价格",
    key: "price",
    align: "center",
    minWidth: 100,
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    }
  },
  {
    title: "最低购买数量",
    align: "center",
    key: "minQuantity",
    minWidth: 120
  },
  {
    title: "最低购买数量",
    align: "center",
    key: "maxQuantity",
    minWidth: 120
  },
  {
    title: "排序",
    align: "center",
    key: "reorder",
    minWidth: 80
  },
  {
    title: "规格数量描述",
    align: "center",
    key: "standardDes",
    minWidth: 150
  },
  {
    title: "操作",
    align: "center",
    minWidth: 180,
    key: "handle",
    options: ["edit", "delete"]
  }
];

export default {
  components: {
    Tables,
    IViewUpload,
    DragList
  },
  mixins: [uploadMixin, deleteMixin, searchMixin, tableMixin],
  data() {
    return {
      productTotal: 0,
      regionTotal: 0,
      unitsList: [],
      descriptionList: [],
      defaultListMain: [],
      uploadListMain: [],
      productData: [],
      priceRegionData: [],
      tableDataSelected: [],
      regionTableDataSelected: [],
      modalEditLoading: false,
      modalDiscount: false,
      modalProduct: false,
      modalSort: false,
      modalRegion: false,
      modalEditRegion: false,
      loadingProduct: false,
      loadingRegion: false,
      showBack: false,
      searchRowData: _.cloneDeep(roleRowData),
      priceRegionRowData: _.cloneDeep(priceRegionRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productStandardDetail: _.cloneDeep(productStandardDetail),
      productDetail: _.cloneDeep(productDetail),
      goodsPriceRegion: _.cloneDeep(goodsPriceRegion),
      columns: standardColumns,
      productColumns: productColumns,
      regionColumns: goodsPriceRegionColumns,
      searchMinPrice: null,
      searchMaxPrice: null,
      currentTableRowSelected: null,
      dropConClass: {
        left: ["drop-box", "left-drop-box"],
        right: ["drop-box", "right-drop-box"]
      },
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
      ruleInlineRegion: {
        goodsStandardId: [
          { required: true, message: "请先选择规格商品" },
          {
            message: "请先选择规格商品",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        price: [
          { required: true, message: "请输入商品价格" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        reorder: [
          { required: false, message: "请输入商品排序" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ],
        minQuantity: [
          { required: true, message: "请输入最低购买数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
        ],
        maxQuantity: [
          { required: true, message: "请输入最高购买数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            }
          }
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
        goodsName: [{ required: true, message: "请输入上架商品名称" }],
        goodsImage: [{ required: true, message: "请上传上架商品主图" }],
        unitCode: [{ required: true, message: "请选择商品单位" }],
        vaild: [{ required: true, message: "请选择商品状态" }],
        standardDesc: [{ required: true, message: "请输入规格描述" }],
        price: [
          { required: true, message: "请输入商品价格" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        purchasePrice: [
          { required: true, message: "请输入商品进货价" },
          {
            message: "必须为大于0的数字",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        barCode: [{ required: true, message: "请输入商品条码" }],
        // rank: [
        //   { required: false, message: "请输入商品排序" },
        //   {
        //     validator(rule, value, callback, source, options) {
        //       const errors = [];
        //       if (!/^[-1-9]\d*$/.test(value)) {
        //         errors.push(new Error("必须为非零整数"));
        //       }
        //       callback(errors);
        //     }
        //   }
        // ],
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
        ],
        netWeight: [
          { required: false, message: "请输入商品净重" },
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
      }
    };
  },
  computed: {
    reginPriceComputed() {
      return fenToYuanDot2Number(this.goodsPriceRegion.price);
    },
    priceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.price);
    },
    purchasePriceComputed() {
      return fenToYuanDot2Number(this.productStandardDetail.purchasePrice);
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
    // 变化函数
    priceOnchange(value) {
      this.productStandardDetail.price = yuanToFenNumber(value);
    },
    reginPriceOnchange(value) {
      this.goodsPriceRegion.price = yuanToFenNumber(value);
    },
    purchasePriceOnchange(value) {
      this.productStandardDetail.purchasePrice = yuanToFenNumber(value);
    },
    searchMinPriceChange(value) {
      this.searchRowData.minPrice = yuanToFenNumber(this.searchMinPrice);
    },
    searchMaxPriceChange(value) {
      this.searchRowData.maxPrice = yuanToFenNumber(this.searchMaxPrice);
    },
    unitChange(value) {
      this.productStandardDetail.goodsUnit = value;
    },
    // 数据查询
    getTableData() {
      // 获取基础商品页面传过来的商品信息
      if (this.$route.name === "wholesale-goods-relation-standard") {
        const goods = getWholesaleGoods();
        if (goods) {
          // 给商品规格的商品和搜索条件赋值
          this.searchRowData.goodsId = goods.id;
          this.productDetail = _.cloneDeep(goods);
          this.productStandardDetail.goodsId = goods.id;
          this.productStandardDetail.baseUnitName = goods.unitName;
          this.productStandardDetail.barCode = goods.baseBar;
          this.productStandardDetail.baseProductName = goods.goodsName;
          this.productStandardDetail.goodsName = goods.goodsName; // 默认先读取以前的商品名称
          this.productStandardDetail.goodsImage = goods.goodsImage;
          this.productStandardDetail.categoryName = goods.categoryName;
        }
      } else {
        // 清楚上次的查询条件
        this.searchRowData.goodsId = 0;
      }
      getProductStandardsPages(this.searchRowData)
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
      getProductPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.productTotal = res.total;
        })
        .finally(() => {
          this.loadingProduct = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getPriceRegionTableData() {
      getGoodsPriceRegionPages(this.priceRegionRowData)
        .then(res => {
          this.priceRegionData = res.rows;
          this.regionTotal = res.total;
        })
        .finally(error => {
          this.loadingRegion = false;
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
    // 创建或修改相关函数
    createPriceRegion() {
      this.modalEditLoading = true;
      createGoodsPriceRegion({
        ...this.goodsPriceRegion
      })
        .then(res => {
          this.$Message.success("创建成功!");
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
          this.modalEditRegion = false;
        });
    },
    editPriceRegion() {
      this.modalEditLoading = true;
      editGoodsPriceRegion({
        ...this.goodsPriceRegion
      })
        .then(res => {
          this.$Message.success("修改成功");
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.modalEditRegion = false;
          this.modalEditLoading = false;
        });
    },
    createProductStandard() {
      this.modalEditLoading = true;
      createProductStandard({
        ...this.productStandardDetail
      })
        .then(res => {
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    editProductStandard() {
      this.modalEditLoading = true;
      editProductStandard({
        ...this.productStandardDetail
      })
        .then(res => {
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalEditLoading = false;
        });
    },
    // 数据删除
    deleteRegionTable(ids) {
      this.loadingRegion = true;
      deleteGoodsPriceRegion({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(
            this.regionTotal / this.priceRegionRowData.rows
          );
          if (
            this.priceRegionData.length ==
              this.regionTableDataSelected.length &&
            this.priceRegionRowData.page === totalPage &&
            this.priceRegionRowData.page !== 1
          ) {
            this.priceRegionRowData.page -= 1;
          }
          this.regionTableDataSelected = [];
          this.getPriceRegionTableData();
        })
        .finally(() => {
          this.loadingRegion = false;
        });
    },
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
    // 表格中操作按钮相关函数
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.$refs.editForm.resetFields();
      this.modalEdit = true;
    },
    handleEditRegion(params) {
      this.goodsPriceRegion = _.cloneDeep(params.row);
      this.$refs.editRegionForm.resetFields();
      this.modalEditRegion = true;
    },
    handleDeleteRegion(params) {
      this.regionTableDataSelected = [];
      this.regionTableDataSelected.push(params.row);
      this.deleteRegionTable(params.row.id);
    },
    handleCreate() {
      if (this.tempModalType !== this.modalType.create) {
        this.uploadListMain= [];
        this.$refs.editForm.resetFields();
        this.productStandardDetail = _.cloneDeep(productStandardDetail);
      }
      // 复制选中的数据
      if (this.currentTableRowSelected) {
        this.productStandardDetail = _.cloneDeep(this.currentTableRowSelected);
      }
      this.tempModalType = this.modalType.create;
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            this.createProductStandard();
          } else if (this.tempModalType === this.modalType.edit) {
            this.editProductStandard();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleSubmitRegin() {
      // 把规格ID赋值给goodsPriceRegion
      this.goodsPriceRegion.goodsStandardId = this.productStandardDetail.id;
      this.$refs.editRegionForm.validate(valid => {
        if (valid) {
          if (this.goodsPriceRegion.id === 0) {
            this.createPriceRegion();
          } else {
            this.editPriceRegion();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handlePublish(params) {
      const rowData = _.cloneDeep(params.row);
      rowData.vaild = rowData.vaild === "yes"?"no":"yes";
      this.loading = true;
      editProductStandard(rowData)
        .then(res => {
          this.$Message.success("操作成功!");
          this.getTableData();
        })
        .finally(res => {
          this.loading = false;
        });
    },
    handleBatchDel() {
      if (this.regionTableDataSelected.length < 1) {
        this.$Message.warning("请选中要删除的行");
        return;
      }
      const tempDeleteList = [];
      this.regionTableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(",");
      this.deleteRegionTable(strTempDelete);
    },
    handleRegin(params) {
      // 展示区间价格维护弹窗
      this.productStandardDetail = _.cloneDeep(params.row);
      this.priceRegionRowData.goodsStandardId = this.productStandardDetail.id;
      this.getPriceRegionTableData();
      this.modalRegion = true;
    },
    handleSelectionChange(selection) {
      this.tableDataSelected = selection;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleRegionAdd() {
      // 因为新增或修改由id是否为0判断
      this.goodsPriceRegion.id = 0;
      this.$refs.editRegionForm.resetFields();
      this.modalEditRegion = true;
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
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
    changePriceRegionPage(page) {
      this.priceRegionRowData.page = page;
      this.getPriceRegionTableData();
    },
    changePriceRegionPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getPriceRegionTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    handleGoodsRelation(row, index) {
      // 给基础商品信息赋值
      this.productStandardDetail.goodsId = row.id;
      this.productStandardDetail.baseProductName = row.goodsName;
      this.productStandardDetail.categoryName = row.categoryName;
      this.productStandardDetail.baseUnitName = row.unitName;
      this.productStandardDetail.barCode = row.baseBar; // 商品对象的条码和规格对象里条码不一致
      // 给要关联的规格信息设置默认值，用户可以选择修改
      this.productStandardDetail.goodsName = row.goodsName;
      this.productStandardDetail.goodsImage = row.goodsImage;
      this.productStandardDetail.vaild = "no"; //默认是未上架的
      this.setDefaultUploadList(this.productStandardDetail);
      this.modalProduct = false;
    },
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
          item["vaild"] = customPlanStatusConvert(item["vaild"]).label;
        });
        this.$refs.tables.handleDownload({
          filename: `商品规格-${new Date().valueOf()}`,
          data: tableData
        });
      });
    },
     // 图片上传相关函数
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.productStandardDetail.goodsImage = null;
      this.productStandardDetail.goodsImage = fileList[0].url;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.productStandardDetail.goodsImage = null;
    },
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
    // 其他函数
    goBack() {
      this.turnToPage("wholesale-goods-info");
    },
    findUnit(unitCode) {
      if (this.unitsList != null) {
        const obj = this.unitsList.find(item => item.value === unitCode);
        if (obj) {
          return obj.label;
        }
      }
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
