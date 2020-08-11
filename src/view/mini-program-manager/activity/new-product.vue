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
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="onRelevance"
      >
        <!--  @on-delete="handleDelete" -->
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.title"
              placeholder="活动标题"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.beginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              class="search-input mr5"
              style="width: 170px"
              placeholder="开始时间"
              @on-change="edBeginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              type="datetime"
              placeholder="结束时间"
              style="width: 170px"
              class="mr5"
              @on-change="edFinishTimeChange"
            />
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addFlashsale">
            <Icon type="md-add" />添加
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>-->
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>新品尝鲜活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ activitySeckillDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ activitySeckillDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ activitySeckillDetail.beginTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ activitySeckillDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18" v-if="activitySeckillDetail.status === 'ON'">
                <tag color="success">{{ "开启" | imageStatusFilter }}</tag>
              </i-col>
              <i-col span="18" v-else-if="activitySeckillDetail.status === 'OFF'">
                <tag color="error">{{ "关闭" | imageStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动每人限购份数:</i-col>
              <i-col span="18">{{ activitySeckillDetail.userActivityLimit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动个人剩余份数:</i-col>
              <i-col span="18">{{ activitySeckillDetail.userActivitySurplus }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">描述:</i-col>
              <i-col span="18">{{ activitySeckillDetail.remark }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="1200" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType==modalType.edit?'修改新品尝鲜活动':(tempModalType==modalType.create?'创建新品尝鲜活动': '添加新品尝鲜活动和商品关联') }}</i-col>
      </p>
      <div class="modal-content">
        <Row v-if="tempModalType == modalType.edit || tempModalType == modalType.create">
          <Form
            ref="editForm"
            :model="activitySeckillDetail"
            :rules="ruleInline"
            :label-width="100"
          >
            <Row>
              <i-col span="18">
                <FormItem label="活动标题:" prop="title">
                  <Input
                    v-model="activitySeckillDetail.title"
                    placeholder="活动标题"
                    style="width: 170px"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期起:" prop="beginTime">
                  <DatePicker
                    :value="activitySeckillDetail.beginTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    @on-change="activitySeckillDetail.beginTime=$event"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="有效期止:" prop="endTime">
                  <DatePicker
                    :value="activitySeckillDetail.endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期止"
                    class="search-input"
                    style="width: 170px"
                    @on-change="activitySeckillDetail.endTime=$event"
                  />
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="18">
                <FormItem label="活动状态:" prop="status">
                  <Select v-model="activitySeckillDetail.status" clearable style="width: 170px">
                    <Option
                      v-for="(item,index) in imageStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                      style="padding-left: 5px;width: 170px"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <Col span="18">
                <FormItem label="每人限购份数:" prop="userActivityLimit">
                  <Input v-model="activitySeckillDetail.userActivityLimit" style="width: 170px"></Input>
                </FormItem>
              </Col>
            </Row>
            <!-- <Row>
              <Col span="18">
                <FormItem label="个人剩余份数:" prop="userActivitySurplus">
                  <Input v-model="activitySeckillDetail.userActivitySurplus" style="width: 170px"></Input>
                </FormItem>
              </Col>
            </Row>-->
            <Row>
              <i-col span="12">
                <FormItem label="活动描述:" prop="remark">
                  <Input
                    v-model="activitySeckillDetail.remark"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入活动描述"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Row>

        <Row v-if="tempModalType == null">
          <Row>
            <Card>
              <tables
                ref="tables"
                v-model="products"
                :columns="productColumns"
                :loading="tempTableLoading"
                border
                searchable
                search-place="top"
                highlight-row
                @on-delete="modalHandleDelete"
                @on-inline-edit="modalHandleEdit"
                @on-inline-save="modalHandleSave"
                @on-selection-change="onProductSelectionChange"
                @on-current-change="handleTemplateChange"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchProductRowData.productCode"
                      placeholder="商品编码"
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
                    <Button class="search-btn mr5" type="primary" @click="handleProductSearch">
                      <Icon type="md-search" />&nbsp;搜索
                    </Button>
                    <Button v-waves class="search-btn" type="info" @click="handleProductClear">
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>

              <div style="margin: 10px 10px 20px 10px;overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    :page-size="searchProductRowData.rows"
                    :page-size-opts="templatePageOpts"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"
                  ></Page>
                </Row>
              </div>

              <Form
                ref="modalCreate"
                :model="addRelationDetail"
                :rules="relationRuleInline"
                :label-width="80"
              >
                <!-- <Row>
                  <i-col span="6">
                    <FormItem label="商品名称:" prop="productName" :label-width="100">
                      <Input
                        v-model="addRelationDetail.productName"
                        clearable
                        style="padding-right: 5px;width: 140px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="6">
                    <FormItem label="商品规格:" prop="specification" :label-width="100">
                      <Input
                        v-model="addRelationDetail.specification"
                        clearable
                        style="padding-right: 5px;width: 140px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="6">
                    <FormItem label="商品单位:" prop="productUnit" :label-width="100">
                      <Input
                        v-model="addRelationDetail.productUnit"
                        clearable
                        style="padding-right: 5px;width: 140px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="6">
                    <FormItem label="商品价格:" prop="discountPrice" :label-width="100">
                      <Input
                        v-model="addRelationDetail.discountPrice"
                        clearable
                        style="padding-right: 5px;width: 140px"
                      ></Input>
                    </FormItem>
                  </i-col>
                </Row>-->
                <Row>
                  <i-col span="5">
                    <FormItem label="商品库存总数:" prop="activityLimit">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.activityLimit"
                        class="ml20"
                        label="商品库存总数"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="每人限购:" prop="userLimit">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.userLimit"
                        class="ml20"
                        label="每人限购"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <i-col span="5">
                    <FormItem label="排序:" prop="rank">
                      <Input
                        :min="0"
                        v-model="addRelationDetail.rank"
                        class="ml20"
                        label="排序"
                        style="padding-right: 5px;width: 100px"
                      ></Input>
                    </FormItem>
                  </i-col>
                  <!-- <i-col span="4">
                    <FormItem label="商品状态:" prop="status">
                      <Select v-model="addRelationDetail.status" disabled>
                        <Option
                          v-for="(item,index) in onSaleStatusEnum"
                          :value="item.value"
                          :key="index"
                          class="ptb2-5"
                          style="padding-left: 5px;"
                        >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </i-col>-->
                  <i-col span="4">
                    <Button
                      v-waves
                      :loading="addTempDataLoading"
                      span="4"
                      class="search-btn"
                      type="primary"
                      style="margin-left: 50px;"
                      @click="addTempData('modalCreate')"
                      v-show="this.proFlag===true"
                    >
                      <Icon type="md-add" />&nbsp;关联尝鲜商品
                    </Button>
                  </i-col>
                </Row>
              </Form>*Tips：请先选择要关联的商品，然后输入关联配置信息，添加完成后可在下方表格修改.
            </Card>
          </Row>

          <Divider orientation="center">已关联新品尝鲜活动商品</Divider>
          <tables
            :columns="relationColumns"
            v-model="relationProducts"
            :loading="tempTableLoading"
            border
            @on-sale="switchStatus"
            @on-delete="modalHandleDelete"
            @on-inline-edit="modalHandleEdit"
            @on-inline-save="modalHandleSave"
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('editForm')"
          v-if="tempModalType == modalType.edit || tempModalType == modalType.create"
        >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  deleteFlashsale,
  getSeckillPages,
  editSeckill,
  createSeckill,
  getSeckillProductRelationPages,
  deleteSeckillProductRelation,
  createSeckillProductRelation,
  editSeckillProductRelation,
  getProductStandardsPages,
} from "@/api/mini-program";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  imageStatusConvert,
  expandTypeConvert,
  onSaleStatusConvert,
} from "@/libs/converStatus";
import { imageStatusEnum, onSaleStatusEnum } from "@/libs/enumerate";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareCouponData,
} from "@/libs/util";
import { customPlanStatusConvert, appTypeConvert } from "@/libs/converStatus";

const activitySeckillDetail = {
  beginTime: null,
  createTime: null,
  endTime: null,
  id: "",
  remark: "",
  status: "",
  title: "",
  updateTime: null,
  activityType: "NEW_TRY_ACTIVITY",
  userActivityLimit: "",
  userActivitySurplus: "",
};

const relationDetail = {
  // baseProductName: "123",
  // price: 0,
  // standardIds: "",
  id: 0,
  activityId: 0,
  standardId: 0,
  goodsLimit: "",
  userLimit: "",
  isEdit: false,
  status: "",
  createTime: "",
  updateTime: "",
  rank: "",
  activityLimit: "",
  productStandard: [],
};

const productDetail = {
  id: 0,
  productId: 0,
  barcode: "",
  specification: "",
  standardQty: 0,
  unitId: 0,
  productUnit: "",
  price: 0,
  salePrice: 0,
  rank: 0,
  description: "",
  shelvesStatus: null,
  applyType: null,
  productName: "",
  createUser: null,
  image: "",
  productDescription: "",
  productCode: "",
  baseProductName: "",
  baseProductDescription: "",
  groupId: 0,
  groupName: "",
  sourceCode: "",
  baseImage: "",
  smallImage: "",
  largeImage: "",
  status: "",
  baseUnitId: 0,
  baseUnit: "",
  baseBarcode: "",
  hdSkuid: "",
  videoUrl: "",
  videoImage: "",
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null,
};

const roleRowData = {
  beginTime: null,
  endTime: null,
  title: "",
  activityType: "NEW_TRY_ACTIVITY",
  page: 1,
  rows: 10,
  sidx: "create_time",
  sort: "desc",
};

const relationRowData = {
  id: null,
  activityId: null,
  page: 1,
  rows: 10,
};

const productRowData = {
  applyType: null,
  sectionName: null,
  productName: null,
  barcode: null,
  shelvesStatus: "VALID",
  expandType: "NEW_TRY_PRODUCT",
  page: 1,
  rows: 5,
};

const relationTempColumns = [
  {
    title: "商品规格ID",
    key: "standardId",
    align: "center",
    minWidth: 100,
  },
  {
    title: "商品名称",
    key: "baseProductName",
    minWidth: 100,
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productStandard != null) {
        return <div>{row.productStandard.baseProductName}</div>;
      }
    },
  },
  {
    title: "商品规格",
    key: "specification",
    minWidth: 100,
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productStandard != null) {
        return <div>{row.productStandard.specification}</div>;
      }
    },
  },
  {
    title: "商品单位",
    key: "productUnit",
    minWidth: 100,
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productStandard != null) {
        return <div>{row.productStandard.productUnit}</div>;
      }
    },
  },
  {
    title: "商品尝鲜价",
    key: "discountPrice",
    minWidth: 100,
    align: "center",
    render(h, params) {
      const { row } = params;
      return (
        <div>
          {fenToYuanDot2(
            row.productStandard.productStandardExpand.discountPrice
          )}
        </div>
      );
    },
  },
  // {
  //   title: "创建时间",
  //   key: "createTime",
  //   align: "center",
  //   minWidth: 100
  // },
  // {
  //   title: "修改时间",
  //   key: "updateTime",
  //   minWidth: 100
  // },
  {
    title: "排序",
    key: "rank",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.rank,
            },
            on: {
              input: function (event) {
                if (event > 0) {
                  params.row.rank = event;
                }
              },
            },
          }),
        ]);
      } else {
        return h("div", params.row.rank);
      }
    },
  },
  {
    title: "商品库存总数",
    key: "activityLimit",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.activityLimit,
            },
            on: {
              input: function (event) {
                if (event > 0) {
                  params.row.activityLimit = event;
                }
              },
            },
          }),
        ]);
      } else {
        return h("div", params.row.activityLimit);
      }
    },
  },
  {
    title: "每人限购",
    key: "userLimit",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h("div", [
          h("InputNumber", {
            domProps: {
              value: params.row.userLimit,
            },
            on: {
              input: function (event) {
                if (event > 0) {
                  params.row.userLimit = event;
                }
              },
            },
          }),
        ]);
      } else {
        return h("div", params.row.userLimit);
      }
    },
  },
  {
    title: "商品状态",
    align: "center",
    key: "status",
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === "ON") {
        return (
          <div>
            <tag color="success">{"上架"}</tag>
          </div>
        );
      } else if (row.status === "OFF") {
        return (
          <div>
            <tag color="error">{"下架"}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.status}</tag>
        </div>
      );
    },
  },
];

const productColumns = [
  {
    type: "index",
    width: 60,
    align: "center",
  },
  {
    title: "规格id",
    key: "id",
    minWidth: 60,
    align: "center",
  },
  {
    title: "商品条码",
    key: "barcode",
    minWidth: 70,
    align: "center",
  },
  {
    title: "商品编号",
    key: "productCode",
    align: "center",
    minWidth: 120,
  },
  {
    title: "商品名称",
    key: "productName",
    minWidth: 100,
    align: "center",
  },
  {
    title: "商品规格",
    key: "specification",
    minWidth: 80,
    align: "center",
  },
  {
    title: "商品单位",
    key: "productUnit",
    minWidth: 80,
    align: "center",
  },
  {
    title: "尝鲜价格",
    key: "price",
    minWidth: 80,
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(
        params.row.productStandardExpand.discountPrice
      );
      return <div>{amount}</div>;
    },
  },
  {
    title: "商品类型",
    minWidth: 120,
    key: "expandType",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productStandardExpand != null) {
        if (row.productStandardExpand.expandType == "DISCOUNT_PRODUCT") {
          return (
            <div>
              <tag color="magenta">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "PULL_NEW_PRODUCT") {
          return (
            <div>
              <tag color="orange">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "SECKILL_PRODUCT") {
          return (
            <div>
              <tag color="blue">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "NEW_TRY_PRODUCT") {
          return (
            <div>
              <tag color="blue">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        } else if (row.productStandardExpand.expandType == "ASSIST_PRODUCT") {
          return (
            <div>
              <tag color="green">
                {expandTypeConvert(row.productStandardExpand.expandType).label}
              </tag>
            </div>
          );
        }
      } else {
        return (
          <div>
            <tag color="cyan">{"普通商品"}</tag>
          </div>
        );
      }
    },
  },
  {
    title: "排序",
    key: "rank",
    minWidth: 60,
    align: "center",
  },
];

export default {
  components: {
    Tables,
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        beginTime: [{ required: true, message: "请选择活动开始时间" }],
        endTime: [{ required: true, message: "请选择活动结束时间" }],
        status: [{ required: true, message: "请选择活动状态" }],
        title: [{ required: true, message: "请输入活动标题" }],
        userActivityLimit: [
          { required: true, message: "请输入活动每人限购份数" },
        ],
      },
      relationRuleInline: {
        activityLimit: [
          { required: true, message: "请输入商品库存总数" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        rank: [
          { required: true, message: "请输入商品排序" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
        userLimit: [
          { required: true, message: "请输入限购数量" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error("必须为非零整数"));
              }
              callback(errors);
            },
          },
        ],
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      templatePageOpts: [5, 10],
      imageStatusEnum,
      onSaleStatusEnum,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "活动ID",
          align: "center",
          key: "id",
        },
        {
          title: "活动标题",
          align: "center",
          key: "title",
        },
        {
          title: "开始时间",
          align: "center",
          key: "beginTime",
        },
        {
          title: "结束时间",
          align: "center",
          key: "endTime",
          width: 200,
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style="color:red">{row.endTime + "已过期"}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          },
        },
        {
          title: "修改时间",
          align: "center",
          key: "updateTime",
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">
                    {imageStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{row.status ? row.status : "N/A"}</tag>
              </div>
            );
          },
        },
        {
          title: "活动每人限购份数",
          align: "center",
          key: "userActivityLimit",
        },
        // {
        //   title: "活动个人剩余份数",
        //   align: "center",
        //   key: "userActivitySurplus"
        // },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          //"delete",
          options: ["onSale", "view", "edit", "settings"],
        },
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: "操作",
          align: "center",
          minWidth: 140,
          key: "handle",
          options: ["onSale", "inlineEdit"],
        },
      ],
      productColumns: _.cloneDeep(productColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      activitySeckillDetail: _.cloneDeep(activitySeckillDetail),
      relationProducts: [],
      addRelationDetail: _.cloneDeep(relationDetail),
      productDetail: _.cloneDeep(productDetail),
      products: [],
      productTotal: 0,
      proFlag: true,
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      //   this.uploadListMain = [];
      //   this.activitySeckillDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (
            this.activitySeckillDetail.beginTime >
            this.activitySeckillDetail.endTime
          ) {
            this.$Message.error("开始时间不能大于结束时间!");
            return;
          }
          if (
            this.activitySeckillDetail.beginTime.toString().indexOf("T") > -1
          ) {
            this.activitySeckillDetail.beginTime = this.$moment(
              this.activitySeckillDetail.beginTime
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (this.activitySeckillDetail.endTime.toString().indexOf("T") > -1) {
            this.activitySeckillDetail.endTime = this.$moment(
              this.activitySeckillDetail.endTime
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createSeckill();
          } else if (this.tempModalType === this.modalType.edit) {
            this.editSeckill();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    createSeckill() {
      this.modalViewLoading = true;
      createSeckill(this.activitySeckillDetail)
        .then((res) => {
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
    editSeckill() {
      this.modalViewLoading = true;
      this.activitySeckillDetail.beginTime = this.$moment(
        this.activitySeckillDetail.beginTime
      ).format("YYYY-MM-DD HH:mm:ss");
      this.activitySeckillDetail.endTime = this.$moment(
        this.activitySeckillDetail.endTime
      ).format("YYYY-MM-DD HH:mm:ss");

      editSeckill(this.activitySeckillDetail)
        .then((res) => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addFlashsale() {
      // this.resetFields();
      this.tempModalType = this.modalType.create;
      this.activitySeckillDetail = _.cloneDeep(activitySeckillDetail);
      this.modalEdit = true;
    },
    // 删除
    // handleDelete(params) {
    //   this.tableDataSelected = [];
    //   this.tableDataSelected.push(params.row);
    //   this.deleteTable(params.row.id);
    // },
    deleteTable(ids) {
      this.loading = true;
      deleteFlashsale({
        ids,
      })
        .then((res) => {
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
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.activitySeckillDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activitySeckillDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getSeckillPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getRelationTableData() {
      getSeckillProductRelationPages(this.searchRelationRowData)
        .then((res) => {
          // 设置行是否可编辑
          // if (res && res.rows.length > 0) {
          res.rows.forEach((element) => {
            element.isEdit = false;
          });
          this.relationProducts = res.rows;
          // }
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onOff(params) {
      this.activitySeckillDetail = this._.cloneDeep(params.row);
      if (params.row.status === "ON") {
        this.activitySeckillDetail.status = "OFF";
      } else {
        this.activitySeckillDetail.status = "ON";
      }
      this.loading = true;
      this.editSeckill();
    },
    startTimeChange(value, date) {
      this.activitySeckillDetail.beginTime = value;
    },
    endTimeChange(value, date) {
      this.activitySeckillDetail.endTime = value;
    },
    // ====
    edBeginTimeChange(value) {
      this.searchRowData.beginTime = value;
    },
    edFinishTimeChange(value) {
      this.searchRowData.endTime = value;
    },
    onRelevance(params) {
      this.tempModalType = null;
      // FIXME 查询商品规格分页信息（后期按钮触发，或者先存储，需要时再调用接口）
      this.getProductTableData();
      // 查询限时抢购关联商品
      this.searchRelationRowData.activityId = params.row.id;
      this.addRelationDetail.activityId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;
    },
    addTempData(name) {
      if (this.addRelationDetail.standardId === 0) {
        this.$Message.error("请选择一个要关联的商品!");
        return;
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          const productStandardIds = this.addRelationDetail.standardId.split(
            ","
          );
          if (this.addRelationDetail.standardId === "") {
            this.$Message.error("请选择一个要关联的商品!");
            return;
          } else if (
            Number(this.addRelationDetail.userLimit) >
            Number(this.addRelationDetail.activityLimit)
          ) {
            this.$Message.error("每人限购数量不能大于商品库存总数");
            return;
          }

          this.createRelation();
        } else {
          this.$Message.error("请完善信息!");
        }
      });
      // this.createFlashsaleProductRelation(this.addRelationDetail)
    },
    modalHandleEdit(params) {
      this.$set(params.row, "isEdit", true);
    },
    modalHandleSave(params) {
      const row = params.row;
      if (
        row.id == null ||
        row.id == 0 ||
        row.salePrice <= 0 ||
        row.goodsLimit <= 0 ||
        row.userLimit <= 0
      ) {
        this.$Message.error("请输入非0数");
        return;
      } else if (Number(row.userLimit) > Number(row.activityLimit)) {
        this.$Message.error("每人限购数量不能大于商品库存总数");
        return;
      }
      this.tempTableLoading = true;
      // 如果前端没有剩余数量字段,则初始化剩余数量=商品数量
      // row.remainCount = row.goodsLimit;
      editSeckillProductRelation(row)
        .then((res) => {
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteSeckillProductRelation({ ids: params.row.id })
        .then((res) => {
          this.relationProducts = this.relationProducts.filter(
            (item, index) => index !== params.row.initRowIndex
          );
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
    },
    getProductTableData() {
      this.loading = true;
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        this.products = res.rows;
        this.productTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
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
      // this.searchLoading = true;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      // this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    onProductSelectionAll(selection) {
      this.addRelationDetail.standardId = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    onProductSelectionChange(selection) {
      this.addRelationDetail.standardId = selection
        .map((item) => item.id.toString())
        .join(",");
    },
    // 选中商品
    handleTemplateChange(currentRow, oldCurrentRow) {
      // console.log("活动商品列表", this.relationProducts);
      // console.log("选中商品列表", currentRow.productStandardExpand.standardId);
      let activityProducts = this.relationProducts;
      let standardIds = [];
      for (var item = 0; item < activityProducts.length; item++) {
        standardIds.push(activityProducts[item].standardId);
      }
      if (
        standardIds.indexOf(currentRow.productStandardExpand.standardId) != -1
      ) {
        this.proFlag = false;
        this.$Message.error("活动商品已存在");
      } else {
        this.proFlag = true;
      }

      const couponTemplate = currentRow;
      let mark = [];
      mark.push(currentRow);

      this.addRelationDetail.standardId = mark
        .map((item) => item.id.toString())
        .join(",");
      // this.addRelationDetail.status = mark;
      if (couponTemplate.shelvesStatus === "VALID") {
        this.addRelationDetail.status = "ON";
        this.addRelationDetail.productStandard = couponTemplate;
      }
    },
    priceInputNumberOnchange(value) {
      this.addRelationDetail.price = yuanToFenNumber(value);
    },
    salePriceInputNumberOnchange(value) {
      this.addRelationDetail.salePrice = yuanToFenNumber(value);
    },
    createRelation() {
      this.modalViewLoading = true;
      createSeckillProductRelation(this.addRelationDetail)
        .then((res) => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getRelationTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    //上下架
    switchStatus(params) {
      // this.relationProducts.status = this._.cloneDeep(params.row.status);
      if (params.row.status === "ON") {
        params.row.status = "OFF";
      } else {
        params.row.status = "ON";
      }
      this.loading = true;
      // console.log("上下架", params.row);
      editSeckillProductRelation(params.row)
        .then((res) => {
          this.getRelationTableData();
        })
        .finally((res) => {
          this.tempTableLoading = false;
        });
      this.tempTableLoading = false;
      this.$set(params.row, "isEdit", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
