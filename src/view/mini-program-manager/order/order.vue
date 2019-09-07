<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="19"
        :operate-area-column="5"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-hand="handleReimburse"
        @on-receive="handSureReceive"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 100px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.apply"
              :clearable="true"
              style="padding-right: 5px;width: 100px"
              placeholder="应用类型"
            >
              <Option
                v-for="item in appTypeEnum"
                :value="item.value"
                :key="`appTypeEnum-col-${item.value}`"
                class="ml15 mt10"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.orderType"
              class="search-col mr5"
              placeholder="订单类型"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in orderType"
                :value="item.value"
                :key="`orderType-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.receivingWay"
              class="search-col mr5"
              placeholder="提货方式"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in receivingWayEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.status"
              class="search-col mr5"
              placeholder="订单状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in miniOrderStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.hdStatus"
              class="search-col mr5"
              placeholder="海鼎状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in miniHdStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              class="mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn ml5"
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
        <div slot="operations" style="margin-left:-50px">
          <Button
            v-waves
            :loading="deliverOrderLoading"
            class="search-btn mr2"
            type="warning"
            @click="deliverOrder"
          >门店调货</Button>
          <Button v-waves class="search-btn ml2 mr2" type="primary" @click="resendToHd">海鼎重发</Button>
          <!-- 多类型导出 -->
          <!-- <BookTypeOption v-model="exportType" class="mr5"/> -->
          <Button
            :loading="downloadLoading"
            class="search-btn mr2"
            type="primary"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>
          <Button
            :loading="downloadLoading"
            class="search-btn"
            type="primary"
            @click="couponDetails"
          >
            <Icon type="md-search" />&nbsp;用券数据
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="请核实下结束时间，再确认手动退款(一次最多退20条)"
            @on-ok="handleRefund"
          >
            <Button type="error" class="mr5">
              <Icon type="md-money"/>手动退款
            </Button>
          </Poptip>-->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
    <!--查看订单详情-->
    <Modal v-model="modalView" :width="800" :mask-closable="false">
      <p slot="header">
        <span>查看订单详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单code:</i-col>
              <i-col span="16">{{ orderDetail.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">应用类型:</i-col>
              <i-col span="16">{{ orderDetail.apply | appTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎编码:</i-col>
              <i-col span="16">{{ orderDetail.hdOrderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎备货时间:</i-col>
              <i-col span="16">{{ orderDetail.hdStockAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">下单用户:</i-col>
              <i-col span="16">{{ orderDetail.receiveUser }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">下单门店:</i-col>
              <i-col span="16">{{ orderDetail.storeName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">门店编码:</i-col>
              <i-col span="16">{{ orderDetail.storeCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">优惠券id:</i-col>
              <i-col span="16">{{ orderDetail.couponId? orderDetail.couponId: '未使用' }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">下单时间:</i-col>
              <i-col span="16">{{ orderDetail.createAt }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">提货截止时间:</i-col>
              <i-col span="16">{{ orderDetail.deliveryEndTime?orderDetail.deliveryEndTime: 'N/A' }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单类型:</i-col>
              <i-col span="16">{{ orderDetail.orderType| miniOrderTypeFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">收货方式:</i-col>
              <i-col span="16">{{ orderDetail.receivingWay| receivingWayFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单状态:</i-col>
              <i-col span="16">{{ orderDetail.orderStatus| miniOrderStatusFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎状态:</i-col>
              <i-col span="16">{{ orderDetail.hdStatus | miniHdStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单总额:</i-col>
              <i-col span="16">{{ orderDetail.totalAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">优惠金额:</i-col>
              <i-col span="16">{{ orderDetail.couponAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col v-if="orderDetail.receivingWay === 'TO_THE_HOME'" span="12">
            <Row class-name="mb10">
              <i-col span="8">运费:</i-col>
              <i-col span="16">{{ orderDetail.deliveryAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">应付金额:</i-col>
              <i-col span="16">{{ orderDetail.amountPayable|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">是否允许退货:</i-col>
              <i-col span="16">{{ orderDetail.allowRefund | yesNoFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">退货原因:</i-col>
              <i-col span="16">{{ orderDetail.reason }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">收货人:</i-col>
              <i-col span="16">{{ orderDetail.receiveUser }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">联系方式:</i-col>
              <i-col span="16">{{ orderDetail.contactPhone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row
          v-if="orderDetail.receivingWay === 'TO_THE_HOME'"
          style="background: lightgray;margin-bottom: 10px"
        >
          <Row>
            <i-col span="16">
              <Row class="mb10 pt5">
                <i-col span="6">收货地址:</i-col>
                <i-col span="18">{{ shippingAddress }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="16">
              <Row class-name="mb10">
                <i-col span="6">配送时间段:</i-col>
                <i-col
                  span="18"
                >{{ orderDetail.deliverTime.startTime + ' - ' + orderDetail.deliverTime.endTime }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="16">
              <Row class-name="mb10">
                <i-col span="6">配送状态:</i-col>
                <i-col
                  span="18"
                  v-if="orderDetail.deliverNote != null && deliveryStatus === 'TRANSFERING'"
                >{{ "配送中" }}</i-col>
                <i-col
                  span="18"
                  v-else-if="orderDetail.deliverNote != null && deliveryStatus === 'DONE'"
                >{{ "配送完成" }}</i-col>
                <i-col
                  span="18"
                  v-else-if="orderDetail.deliverNote != null && deliveryStatus === 'FAILURE'"
                >{{ "配送失败" }}</i-col>
                <i-col
                  span="18"
                  v-else-if="orderDetail.deliverNote != null && deliveryStatus === 'UNRECEIVE'"
                >{{ "未接单" }}</i-col>
                <i-col
                  span="18"
                  v-else-if="orderDetail.deliverNote != null && deliveryStatus === 'WAIT_GET'"
                >{{ "待取货" }}</i-col>
                <i-col span="8" v-else>{{ "N/A" }}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row span="16" class-name="mb10">
            <i-col span="4">配送距离(km):</i-col>
            <i-col
              span="8"
              v-if="orderDetail.deliverNote != null && distance != null"
            >{{ distance }}</i-col>
            <i-col span="8" v-else>{{ "N/A" }}</i-col>
            <i-col span="4">配送重量(kg):</i-col>
            <i-col span="8" v-if="orderDetail.deliverNote != null && weight != null">{{ weight }}</i-col>
            <i-col span="8" v-else>{{ "N/A" }}</i-col>
          </Row>
          <Row span="16" class-name="mb10">
            <i-col span="4">配送员姓名:</i-col>
            <i-col
              span="8"
              v-if="orderDetail.deliverNote != null && deliverName != null"
            >{{ deliverName }}</i-col>
            <i-col span="8" v-else>{{ "N/A" }}</i-col>
            <i-col span="4">配送员电话:</i-col>
            <i-col
              span="8"
              v-if="orderDetail.deliverNote != null && deliverPhone != null"
            >{{ deliverPhone }}</i-col>
            <i-col span="8" v-else>{{ "N/A" }}</i-col>
          </Row>
        </Row>

        <Row>
          <tables :columns="orderViewRelationsColumn" v-model="orderDetail.orderProducts" border></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 订单调货 -->
    <Modal v-model="transferModalView">
      <p slot="header">
        <span>订单调货</span>
      </p>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">订单编号:</i-col>
            <i-col span="16">{{ currentTableRowSelected.code }}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">送货方式:</i-col>
            <i-col span="16">{{ currentTableRowSelected.receivingWay|receivingWayFilters }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">当前门店:</i-col>
            <i-col
              span="16"
            >{{ storeList.find(item => currentTableRowSelected.storeId === item.storeId).storeName }}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">订单状态:</i-col>
            <i-col span="16">{{ currentTableRowSelected.orderStatus| miniOrderStatusFilter }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">海鼎状态:</i-col>
            <i-col span="16">{{ currentTableRowSelected.hdStatus| miniHdStatusFilter }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="15">
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="8">调货门店:</i-col>
            <Select
              v-model="currentTableRowSelected.newStoreId"
              class="search-col mr5"
              placeholder="调货门店"
              style="width: 200px"
              clearable
            >
              <Option
                v-for="item in storeList"
                :value="item.storeId"
                :key="`storeList-col-${item.storeId}`"
                class="ptb2-5"
              >{{ item.storeName }}</Option>
            </Select>
          </Row>
        </i-col>
      </Row>
      <Row style="background: lightgray">
        <i-col span="24" style="padding-left: 15px">
          满足以下几个条件的订单才允许调货：
          <br />1.仅门店自提订单；
          <br />2.订单状态为待发货；
          <br />3.海鼎状态为发送成功
          <br />
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="handleEditCloseTransferModalView">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">调货</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import {
  getOrderCouponDetails,
  getOrderPages,
  getOrder,
  getStorePages,
  modifyStoreInOrder,
  resendToHd,
  ordersRefund,
  refundWx,
  refundPt,
  sureReceive
} from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import {
  receivingWayEnum,
  receivingWay,
  orderStatusEnum,
  miniOrderTypeEnum,
  appTypeEnum,
  payTypeEnum,
  miniOrderStatusEnum,
  miniOrderStatus,
  miniHdStatusEnum,
  miniHdStatus,
  isAllRefundEnum
} from "@/libs/enumerate";
import {
  orderTypeConvert,
  thirdDeliverStatusConvert,
  miniOrderStatusConvert,
  miniHdStatusConvert,
  receivingWayConvert,
  appTypeConvert,
  payTypeConvert,
  isAllRefundConvert
} from "@/libs/converStatus";
import BookTypeOption from "_c/book-type-option";

const orderDetail = {
  id: 0,
  code: "",
  userId: 0,
  apply: null,
  orderType: null,
  storeId: 0,
  storeCode: "",
  storeName: "",
  receivingWay: null,
  totalAmount: 0,
  amountPayable: 0,
  deliveryAmount: 0,
  couponAmount: 0,
  hdStatus: null,
  orderStatus: null,
  address: "",
  reason: "",
  isAllRefund: "",
  createAt: null,
  receiveUser: "",
  contactPhone: "",
  remark: "",
  deliveryEndTime: null,
  payType: "",
  payAt: null,
  activityTeambuyContent: "",
  hdOrderCode: "",
  orderProducts: [],
  orderFlows: [],
  allowRefund: null,
  deliverTime: {
    display: "",
    startTime: null,
    endTime: null,
    status: null
  }
};

const roleRowData = {
  phone: "",
  orderType: "",
  orderCode: "",
  apply: "",
  startTime: null,
  endTime: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      deliverNoteList: [],
      haiDingStatus: [],
      storeList: [],
      transferModalView: false,
      modalViewLoading: false,
      deliverOrderLoading: false,
      orderType: miniOrderTypeEnum,
      orderStatus: orderStatusEnum,
      receivingWayEnum,
      receivingWay,
      isAllRefundEnum,
      appTypeEnum,
      payTypeEnum,
      miniOrderStatusEnum,
      miniOrderStatus,
      miniHdStatusEnum,
      miniHdStatus,
      shippingAddress: "",
      deliveryStatus: "",
      weight: "",
      distance: "",
      deliverName: "",
      deliverPhone: "",
      tempColumnsView: [
        {
          title: "配送方",
          minWidth: 100,
          key: "deliverType"
        },
        {
          title: "配送距离",
          minWidth: 100,
          key: "distance"
        },
        {
          title: "配送费",
          minWidth: 100,
          key: "fee",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.fee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "配送状态",
          minWidth: 100,
          key: "deliverStatus",
          render: (h, params, vm) => {
            const { row } = params;
            return (
              <div>{thirdDeliverStatusConvert(row.deliverStatus).label}</div>
            );
          }
        },
        {
          title: "接单时间",
          minWidth: 100,
          key: "receiveTime"
        },
        {
          title: "配送员手机号",
          minWidth: 110,
          key: "deliverPhone"
        }
      ],
      orderViewRelationsColumn: [
        {
          title: "商品编码",
          key: "barcode"
        },
        {
          title: "商品名称",
          key: "productName"
        },
        {
          title: "商品规格",
          render(h, params, vm) {
            const { row } = params;
            return <div>{row.productQty + "*" + row.standardQty}</div>;
          }
        },
        {
          title: "商品数量",
          key: "productQty"
        },
        {
          title: "计量单位",
          key: "productUnit"
        },
        {
          title: "原价",
          key: "price",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: "折后价",
          key: "discountPrice",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.discountPrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: "总价",
          key: "discountPrice",
          render(h, params, vm) {
            const amount = params.row.discountPrice / 100;
            const price = amount * params.row.productQty;
            return <div>{"￥" + price.toFixed(2)}</div>;
          }
        },
        {
          title: "是否退款",
          width: 120,
          key: "refundStatus",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.refundStatus === "REFUND") {
              return <div>已退款</div>;
            } else if (row.refundStatus === "NOT_REFUND") {
              return <div>未退款</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        }
        // {
        //   title: "退款金额",
        //   width: 100,
        //   key: "refundFee",
        //   render(h, params, vm) {
        //     const refund = fenToYuanDot2(params.row.refundFee);
        //     return <div>{refund}</div>;
        //   }
        // }
      ],
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "订单编号",
          key: "code",
          sortable: true,
          width: 170,
          fixed: "left"
        },
        {
          title: "应用类型",
          key: "apply",
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.apply === "WXSMALL_SHOP") {
              return (
                <div>
                  <tag color="green">{appTypeConvert(row.apply).label}</tag>
                </div>
              );
            } else if (row.apply === "S_MALL") {
              return (
                <div>
                  <tag color="gold">{appTypeConvert(row.apply).label}</tag>
                </div>
              );
            } else {
              return <div>{row.apply}</div>;
            }
          }
        },
        {
          title: "支付类型",
          width: 120,
          key: "payType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.payType === "weixin") {
              return (
                <div>
                  <tag color="success">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === "balance") {
              return (
                <div>
                  <tag color="pink">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "创建时间",
          width: 160,
          key: "createAt"
        },
        {
          title: "订单用户",
          width: 120,
          key: "receiveUser"
        },
        {
          title: "手机号码",
          width: 120,
          key: "contactPhone"
        },
        {
          title: "下单门店",
          width: 120,
          key: "storeId",
          render: (h, params) => {
            const { row } = params;
            const obj = this.storeList.find(
              item => row.storeId === item.storeId
            );
            if (obj) {
              return h("span", obj.storeName);
            }
            return h("span", row.storeId);
          }
        },
        {
          title: "订单总价",
          width: 120,
          key: "totalAmount",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: "优惠金额",
          width: 120,
          key: "couponAmount",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: "运费",
          width: 120,
          key: "deliveryAmount",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.deliveryAmount);
            return <div>{amount ? amount : "N/A"}</div>;
          }
        },
        {
          title: "应付金额",
          width: 120,
          key: "amountPayable",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        // {
        //   title: "商品名称",
        //   width: 150,
        //   key: "productNames"
        // },
        // {
        //   title: "活动名称",
        //   width: 120,
        //   key: "activityTeambuyContent"
        // },
        // {
        //   title: "券名称",
        //   width: 120,
        //   key: "couponName"
        // },
        {
          title: "提货类型",
          width: 120,
          key: "receivingWay",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.receivingWay === "TO_THE_HOME") {
              return (
                <div>
                  <tag color="green">
                    {receivingWayConvert(row.receivingWay).label}
                  </tag>
                </div>
              );
            } else if (row.receivingWay === "TO_THE_STORE") {
              return (
                <div>
                  <tag color="gold">
                    {receivingWayConvert(row.receivingWay).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.receivingWay}</div>;
            }
          }
        },
        {
          title: "是否退款",
          width: 120,
          key: "isAllRefund",
          render: (h, params, vm) => {
            const { row } = params;
            if (
              row.isAllRefund === "NO" &&
              row.orderStatus === "ALREADY_RETURN"
            ) {
              return (
                <div>
                  <tag color="cyan">
                    {isAllRefundConvert(row.isAllRefund).label}
                  </tag>
                </div>
              );
            } else if (
              row.orderStatus === "ALREADY_RETURN"
            ) {
              return (
                <div>
                  <tag color="blue">全部退款</tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: "退款金额",
          width: 100,
          key: "refundFee",
          render(h, params, vm) {
            const refund = fenToYuanDot2(params.row.refundFee);
            return <div>{refund}</div>;
          }
        },
        {
          title: "订单状态",
          width: 120,
          key: "orderStatus",
          render: (h, params, vm) => {
            const { row } = params;
            // WAIT_PAYMENT("待支付"),PAYMENTING("支付中"),WAIT_SEND_OUT("待发货"),
            // SEND_OUT("已发货"),DISPATCHING("配送中"),RECEIVED("已收货"),RETURNING("退货中"),
            // ALREADY_RETURN("退货完成"),FAILURE("已失效")
            // FINISHED("已完成")
            if (
              row.orderStatus === "WAIT_PAYMENT" ||
              row.orderStatus === "PAYMENTING" ||
              row.orderStatus === "WAIT_SEND_OUT"
            ) {
              return (
                <div>
                  <tag color="default">
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (
              row.orderStatus === "SEND_OUT" ||
              row.orderStatus === "DISPATCHING" ||
              row.orderStatus === "RECEIVED" ||
              row.orderStatus === "RETURNING"
            ) {
              return (
                <div>
                  <tag color="primary">
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (row.orderStatus === "FAILURE") {
              return (
                <div>
                  <tag color="error">
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else if (
              row.orderStatus === "ALREADY_RETURN" ||
              row.orderStatus === "FINISHED"
            ) {
              return (
                <div>
                  <tag color="success">
                    {miniOrderStatusConvert(row.orderStatus).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.orderStatus}</div>;
            }
          }
        },
        {
          title: "海鼎状态",
          width: 120,
          key: "hdStatus",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.hdStatus === "NOT_SEND") {
              return (
                <div>
                  <tag color="warning">
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === "SEND_OUT") {
              return (
                <div>
                  <tag color="success">
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === "SEND_FAILURE") {
              return (
                <div>
                  <tag color="error">
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.hdStatus}</div>;
            }
          }
        },
        // {
        //   title: '海鼎备货时间',
        //   width: 160,
        //   key: 'hdStockAt',
        //   sortable: true
        // },
        // {
        //   title: '配送状态',
        //   width: 160,
        //   key: 'deliverStatus',
        //   sortable: true
        // },
        // {
        //   title: '配送距离(km)',
        //   width: 160,
        //   key: 'distance',
        //   sortable: true
        // },
        // {
        //   title: '配送重量(kg)',
        //   width: 160,
        //   key: 'weight',
        //   sortable: true
        // },
        {
          title: "操作",
          minWidth: 150,
          key: "handle",
          options: ["view", "onHand", "onReceive"]
        }
      ],
      currentTableRowSelected: null,
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      exportType: "xlsx",
      downloadLoading: false,
      tableDataSelected: []
    };
  },
  created() {
    this.getTableData();
    this.getStore();
  },
  methods: {
    orderStatusesOnChange(value) {
      console.log(value);
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.endTime = value;
    },
    handleEditCloseTransferModalView() {
      this.transferModalView = false;
    },
    handleEditClose() {
      this.modalViewLoading = false;
    },
    handleRefund() {
      if (!this.searchRowData.endTime) {
        this.$Message.error("请先选择结束时间，再手动退款");
        return false;
      }
      // 处理手动退款
      ordersRefund({ endTime: this.searchRowData.endTime }).then(res => {
        this.resetSearchRowData();
      });
    },
    handleReimburse(params) {
      if (params.row.orderStatus === "RETURNING") {
        this.$Message.error("退货中订单不能操作退款");
        return;
      }
      if (params.row.orderStatus === "ALREADY_RETURN") {
        this.$Message.error("退货完成订单不能操作退款");
        return;
      }
      if (params.row.orderStatus === "FAILURE") {
        this.$Message.error("已失效的订单不能操作退款");
        return;
      }
      if (params.row.orderType === "POINTS_BUYING") {
        this.$Message.error("积分兑换的订单不能操作退款");
        return;
      }
      if (params.row.apply === "S_MALL") {
        refundPt({ orderCode: params.row.code })
          .then(res => {
            this.loading = false;
            this.$Message.success("拼团小程序退款成功");
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (params.row.apply === "WXSMALL_SHOP") {
        refundWx({ orderCode: params.row.code })
          .then(res => {
            this.loading = false;
            this.$Message.success("微信小程序退款成功");
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    //确认收货
    handSureReceive(params) {
      if (
        params.row.orderStatus === "SEND_OUT" ||
        params.row.orderStatus === "DISPATCHING"
      ) {
        sureReceive({ orderId: params.row.id })
          .then(res => {
            this.loading = false;
            this.$Message.success("确认收货成功");
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$Message.error("只有已发货和配送中的订单才能操作收货");
      }
    },
    handleSubmit() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          "请用鼠标左键点击选择下方表格一行订单数据,才能进行调货处理"
        );
        return;
      }
      if (this.currentTableRowSelected.apply != "S_MALL") {
        this.$Message.error("该功能只适用于拼团小程序");
        return;
      }

      if (
        !this.currentTableRowSelected.storeId ||
        !this.currentTableRowSelected.newStoreId
      ) {
        this.$Message.error("该订单门店id为空");
        return;
      }
      if (
        this.currentTableRowSelected.receivingWay !== receivingWay.TO_THE_STORE
      ) {
        this.$Message.error("该订单提货方式不是门店自提！");
        return;
      }
      if (
        this.currentTableRowSelected.orderStatus !==
        miniOrderStatus.WAIT_SEND_OUT
      ) {
        this.$Message.error("该订单不为待发货！");
        return;
      }
      if (this.currentTableRowSelected.hdStatus !== miniHdStatus.SEND_OUT) {
        this.$Message.error("该订单海鼎发送没有成功！");
        return;
      }
      this.modifyStoreInOrder();
      this.currentTableRowSelected = null;
    },
    deliverOrder() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          "请用鼠标左键点击选择下方表格一行门店自提订单数据,才能进行调货处理"
        );
        return;
      }
      this.transferModalView = true;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
      // console.log(this.currentTableRowSelected);
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.loading = true;
      getOrder({ orderCode: params.row.code })
        .then(res => {
          this.orderDetail = res;
          let addresss = "";
          if (
            this.orderDetail.receivingWay === "TO_THE_HOME" &&
            this.orderDetail.receivingWay != null
          ) {
            if (this.orderDetail.address.substr(0, 1) === "{") {
              console.log(this.orderDetail.address.substr(0, 1) === "{");
              addresss = JSON.parse(this.orderDetail.address);
              this.shippingAddress =
                addresss.address + addresss.detailedAddress;
            } else {
              this.shippingAddress = this.orderDetail.address;
            }
          }
          if (
            this.orderDetail.receivingWay === "TO_THE_HOME" &&
            this.orderDetail.deliverNote != null
          ) {
            this.deliveryStatus = this.orderDetail.deliverNote.deliverStatus;
            this.distance = this.orderDetail.deliverNote.distance;
            this.weight = this.orderDetail.deliverNote.weight;
            this.deliverName = this.orderDetail.deliverNote.deliverName;
            this.deliverPhone = this.orderDetail.deliverNote.deliverPhone;
          }
          if (
            this.orderDetail != null &&
            this.orderDetail.deliverTime != "" &&
            this.orderDetail.deliverTime != null
          ) {
            this.orderDetail.deliverTime = JSON.parse(
              this.orderDetail.deliverTime
            );
          }
          this.loading = false;
          this.tempModalType = this.modalType.view;
          this.modalView = true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    couponDetails(params) {
      this.turnToPage({
        name: "small-order-coupon-details"
      });
    },
    getTableData() {
      this.loading = true;
      getOrderPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        });
    },
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getOrderPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        // 表格数据导出字段翻译
        let _this = this;
        tableData.forEach(item => {
          const obj = _this.storeList.find(x => item.storeId === x.storeId);
          item["code"] = item["code"] + "";
          item["apply"] = appTypeConvert(item["apply"]).label;
          item["storeId"] =
            obj && obj.storeName ? obj.storeName : item["storeId"]; // 如果找不到就显示门店Id
          item["totalAmount"] = (item["totalAmount"] / 100.0).toFixed(2);
          item["couponAmount"] = (item["couponAmount"] / 100.0).toFixed(2);
          item["amountPayable"] = (item["amountPayable"] / 100.0).toFixed(2);
          item["refundFee"] = (item["refundFee"] / 100.0).toFixed(2);
          item["orderType"] = orderTypeConvert(item["orderType"]).label;
          item["deliverStatus"] = thirdDeliverStatusConvert(
            item["deliverStatus"]
          ).label;
          item["orderStatus"] = miniOrderStatusConvert(
            item["orderStatus"]
          ).label;
          item["hdStatus"] = miniHdStatusConvert(item["hdStatus"]).label;
          item["receivingWay"] = receivingWayConvert(
            item["receivingWay"]
          ).label;
          item["status"] = miniOrderStatusConvert(item["status"]).label;
          item["payType"] = payTypeConvert(item["payType"]).label;
          item["isAllRefund"] = isAllRefundConvert(item["isAllRefund"]).label;
        });
        this.$refs.tables.handleDownload({
          filename: `普通订单信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    },
    getStore() {
      getStorePages({ page: 1, rows: -1 })
        .then(res => {
          this.storeList = res.rows;
        })
        .catch(error => {
          console.log(error);
        });
    },
    modifyStoreInOrder() {
      // TODO 未测试
      modifyStoreInOrder(this.currentTableRowSelected)
        .then(res => {
          this.$Message.info("调货成功！");
          this.transferModalView = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    resendToHd() {
      // console.log(`current apply:`, this.tableDataSelected);
      // TODO 未测试
      if (this.tableDataSelected.length > 0) {
        const tempDeleteList = [];
        this.tableDataSelected.filter(value => {
          tempDeleteList.push(value.id);
        });
        const ids = tempDeleteList.join(",");
        resendToHd({ ids: ids })
          .then(res => {
            let { disqualification, failure } = res;
            if (failure.length === 0) {
              this.$Message.info("海鼎重发成功");
            } else {
              let lst = failure.join(",");
              this.$Message.error({
                content: `海鼎重发失败订单：${lst}`,
                duration: 30,
                closable: true
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
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
