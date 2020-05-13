<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="17"
        :operate-area-column="7"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
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
              style="width: 150px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.hdCode"
              placeholder="海鼎编码"
              class="search-input mr5"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userName"
              placeholder="用户名"
              class="search-input mr5"
              style="width: 70px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.payStatus"
              class="search-col mr5"
              placeholder="支付状态"
              style="width: 85px"
              clearable
            >
              <Option
                v-for="item in payStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.orderStatus"
              class="search-col mr5"
              placeholder="订单状态"
              style="width: 85px"
              clearable
            >
              <Option
                v-for="item in wholesaleOrderStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.hdStatus"
              class="search-col mr5"
              placeholder="海鼎状态"
              style="width: 85px"
              clearable
            >
              <Option
                v-for="item in wholesaleHdStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.createTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.createTimeEnd"
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
              class="search-btn ml5 mr5 mt5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mt5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
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

    <!--查看订单详情-->
    <Modal v-model="modalView" :width="1000" :mask-closable="false">
      <p slot="header">
        <span>查看订单详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单编号:</i-col>
              <i-col span="18">{{ orderDetail.orderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单状态:</i-col>
              <i-col span="18">{{ orderDetail.orderStatus| wholesaleOrderStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">海鼎编号:</i-col>
              <i-col span="18">{{ orderDetail.hdCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">海鼎状态:</i-col>
              <i-col span="18">{{ orderDetail.hdStatus | wholesaleHdStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">下单时间:</i-col>
              <i-col span="18">{{ orderDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">支付信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付类型:</i-col>
              <i-col span="18">{{ orderDetail.settlementType | wholeslaePayTypeFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付状态:</i-col>
              <i-col span="18">{{ orderDetail.payStatus | payStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单金额:</i-col>
              <i-col span="18">{{ orderDetail.totalFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">优惠金额:</i-col>
              <i-col span="18">{{ orderDetail.discountFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">配送费:</i-col>
              <i-col span="18">{{ orderDetail.deliveryFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">应付金额:</i-col>
              <i-col span="18">{{ orderDetail.payableFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付时间:</i-col>
              <i-col span="18">{{ orderDetail.paymentTime? orderDetail.paymentTime: 'N/A' }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">用户信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ orderDetail.shopName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">店长名称:</i-col>
              <i-col span="18">{{ orderDetail.userName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">店长手机:</i-col>
              <i-col span="18">{{ orderDetail.phone }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">所属业务员:</i-col>
              <i-col span="18">{{ orderDetail.saleUserName }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">配送信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货人:</i-col>
              <i-col span="18">{{ deliveryInfo.contactsName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">联系方式:</i-col>
              <i-col span="18">{{ deliveryInfo.phone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货地址:</i-col>
              <i-col span="18">{{ }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货时间:</i-col>
              <i-col span="18">{{ orderDetail.receiveTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">商品信息</Divider>
        <Row>
          <tables :columns="goodsColumns" v-model="orderDetail.orderGoodsList" border></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import BookTypeOption from "_c/book-type-option";

import { getOrderPages, getOrder } from "@/api/wholesale";
import getLodop from "@/assets/lodop/lodopFuncs.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import {
  orderStatusEnum,
  payStatusEnum,
  payTypeEnum,
  wholesaleOrderStatusEnum,
  wholesaleHdStatusEnum
} from "@/libs/enumerate";
import {
  thirdDeliverStatusConvert,
  wholesalePayTypeConvert,
  wholesaleOrderStatusConvert
} from "@/libs/converStatus";

const orderDetail = {
  afterSaleTime: "",
  afterStatus: "",
  checkStatus: "",
  createTime: "",
  currentOrderStatus: "",
  deliveryAddress: "",
  deliveryFee: 0,
  deliveryTime: "",
  discountFee: 0,
  hdCode: "",
  hdStatus: "",
  id: 0,
  invoiceStatus: "",
  notHdStatus: "",
  orderCode: "",
  orderCoupon: 0,
  orderGoodsList: [],
  orderStatus: "",
  orderStatusIn: [],
  payStatus: "",
  payableFee: 0,
  receiveTime: "",
  remarks: "",
  salesmanId: 0,
  settlementType: "",
  supplements: [],
  totalFee: 0,
  userId: 0,
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  page: 1,
  rows: 20,
  startTime: null,
  endTime:null,
  orderCode:"",
  hdCode:"",
  userName:"",
  phone	:"",
};

const deliveryInfo = {
  id: 0,
  sex: null,
  phone: "",
  addressDetail: "",
  addressArea: "",
  isDefault: "",
  userId: 0,
  contactsName: ""
};
const orderColumns = [
  {
    type: "selection",
    key: "",
    width: 60,
    align: "center",
    fixed: "left"
  },
  {
    title: "订单编号",
    key: "orderCode",
    sortable: true,
    resizable: true,
    width: 170,
    fixed: "left",
    align: "center"
  },
  {
    title: "海鼎单号",
    key: "hdCode",
    sortable: true,
    resizable: true,
    width: 150,
    align: "center"
  },
  {
    title: "创建时间",
    align: "center",
    width: 160,
    key: "createTime"
  },
  {
    title: "订单总价",
    align: "center",
    width: 120,
    key: "totalFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.totalFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: "优惠金额",
    align: "center",
    width: 120,
    key: "discountFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: "应付金额",
    align: "center",
    width: 120,
    key: "payableFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.payableFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: "配送费",
    align: "center",
    width: 120,
    key: "deliveryFee",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.deliveryFee);
      return <div>{amount || "N/A"}</div>;
    }
  },
  {
    title: "实付金额",
    align: "center",
    width: 120,
    key: "payableFee1",
    render(h, params, vm) {
      const amount = fenToYuanDot2(
        params.row.payableFee + params.row.deliveryFee
      );
      return <div>{amount}</div>;
    }
  },
  {
    title: "支付类型",
    align: "center",
    width: 120,
    key: "settlementType",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.settlementType === "wechat") {
        return (
          <div>
            <tag color="success">
              {wholesalePayTypeConvert(row.settlementType).label}
            </tag>
          </div>
        );
      } else if (row.settlementType === "balance") {
        return (
          <div>
            <tag color="primary">
              {wholesalePayTypeConvert(row.settlementType).label}
            </tag>
          </div>
        );
      } else if (row.settlementType === "offline") {
        return (
          <div>
            <tag color="warning">
              {wholesalePayTypeConvert(row.settlementType).label}
            </tag>
          </div>
        );
      } else if (row.settlementType === "haiding") {
        return (
          <div>
            <tag color="warning">
              {wholesalePayTypeConvert(row.settlementType).label}
            </tag>
          </div>
        );
      } else {
        return <div>{"N/A"}</div>;
      }
    }
  },
  {
    title: "门店名称",
    align: "center",
    minWidth: 150,
    key: "shopName"
  },
  {
    title: "店长名称",
    align: "center",
    width: 120,
    key: "userName"
  },
  {
    title: "配送区域",
    align: "center",
    width: 120,
    key: "deliveryAddress",
    render(h, params, vm) {
      const { row } = params;
      const address = JSON.parse(row.deliveryAddress);
      return <div>{address.addressArea + address.addressDetail}</div>;
    }
  },
  {
    title: "店长手机",
    align: "center",
    width: 120,
    key: "phone"
  },
  {
    title: "订单状态",
    align: "center",
    width: 120,
    key: "orderStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (
        row.orderStatus === "unpaid" ||
        row.orderStatus === "paying" ||
        row.orderStatus === "undelivery"
      ) {
        return (
          <div>
            <tag color="default">
              {wholesaleOrderStatusConvert(row.orderStatus).label}
            </tag>
          </div>
        );
      } else if (
        row.orderStatus === "delivery" ||
        row.orderStatus === "unrefunded"
      ) {
        return (
          <div>
            <tag color="primary">
              {wholesaleOrderStatusConvert(row.orderStatus).label}
            </tag>
          </div>
        );
      } else if (row.orderStatus === "failed") {
        return (
          <div>
            <tag color="error">
              {wholesaleOrderStatusConvert(row.orderStatus).label}
            </tag>
          </div>
        );
      } else if (
        row.orderStatus === "received" ||
        row.orderStatus === "refunded"
      ) {
        return (
          <div>
            <tag color="success">
              {wholesaleOrderStatusConvert(row.orderStatus).label}
            </tag>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "海鼎状态",
    align: "center",
    width: 120,
    key: "hdStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.hdStatus === "success") {
        return (
          <div>
            <tag color="success">成功</tag>
          </div>
        );
      } else if (row.hdStatus === "failed") {
        return (
          <div>
            <tag color="error">失败</tag>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: "操作",
    minWidth: 120,
    resizable: true,
    align: "center",
    fixed: "right",
    key: "handle",
    options: ["view", "sendHd"]
  }
];

const goodsColumns = [
  {
    title: "商品编号",
    key: "goodsId"
  },
  {
    title: "商品名称",
    key: "goodsName"
  },
  {
    title: "商品图片",
    key: "goodsImage",
    align: "center",
    maxWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height="60" width="60" />;
      return <div>{str}</div>;
    }
  },
  {
    title: "商品规格",
    key: "standard"
  },
  {
    title: "购买数量",
    key: "quanity"
  },
  {
    title: "商品单位",
    key: "unitName"
  },
  {
    title: "商品单价",
    key: "goodsPrice",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.goodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: "折扣价",
    key: "discountGoodsPrice",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountGoodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: "是否限时抢购",
    key: "flash",
    render(h, params, vm) {
      if (params.row.flash === 0) {
        return (
          <div>
            <tag color="success">普通商品</tag>
          </div>
        );
      } else if (params.row.flash === 1) {
        return (
          <div>
            <tag color="error">限时抢购</tag>
          </div>
        );
      }
    }
  },
  {
    title: "退货状态",
    minWidth: 80,
    key: "refundStatus",
    align: "center",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.refundStatus === "yes") {
        return (
          <div>
            <tag color="error">已退货</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color="success">未退货</tag>
          </div>
        );
      }
    }
  }
];

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      amount: 0,
      printQuantity: 0,
      sum: 0,
      modalPrinting: false,
      templatePageOpts: [20, 50],
      payTypeEnum,
      payStatusEnum,
      orderStatusEnum,
      wholesaleOrderStatusEnum,
      wholesaleHdStatusEnum,
      goodsColumns,
      columns: orderColumns,
      salesmanName: "",
      currentTableRowSelected: null,
      deliveryInfo: _.cloneDeep(deliveryInfo),
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      downloadLoading: false,
      currentSaleUserId: 0,
      exportType: "", // ORDER_GOODS,DELIVERY_NOTE
      tableDataSelected: [],
      selectedOrderCodes: ""
    };
  },
  computed: {},
  created() {
    this.getTableData();
  },
  methods: {
    orderStatusesOnChange(value) {
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.createTimeBegin = value;
      this.orderDetail.createTimeBegin = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.createTimeEnd = value;
      this.orderDetail.createTimeEnd = value;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.loading = true;
      getOrder({ id: params.row.id })
        .then(res => {
          this.orderDetail = res;
          if (this.orderDetail.deliveryAddress) {
            const deliveryInfo = JSON.parse(this.orderDetail.deliveryAddress);
            this.deliveryInfo = _.cloneDeep(deliveryInfo);
          }
          this.tempModalType = this.modalType.view;
          this.modalView = true;
        })
        .finally(() => {
          this.loading = false;
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
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      this.selectedOrderCodes = selection
        .map(item => item.orderCode.toString())
        .join(",");
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      this.selectedOrderCodes = selection
        .map(item => item.orderCode.toString())
        .join(",");
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      const selection = [];
      selection.push(currentRow);
      this.tableDataSelected = selection;
      this.currentTableRowSelected = currentRow;
      this.selectedOrderCodes = this.currentTableRowSelected.orderCode;
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
.print {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
