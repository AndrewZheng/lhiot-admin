<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-audit="hanldeFinanceAudit"
        @on-refuse="hanldeFinanceRefuse"
      >
        <div slot="searchCondition">
          <Row>
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
              placeholder="店长姓名"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input mr5"
              style="width: 120px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.serviceMode"
              class="search-col mr5"
              placeholder="售后方式"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in serviceModeEnum"
                :value="item.label"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.status"
              class="search-col mr5"
              placeholder="售后状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in serviceStatusEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
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
        <div slot="operations"></div>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import {
  getFinanceAuditPages,
  getFinanceAudit,
  getFinanceRefuse
} from "@/api/wholesale";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import { serviceModeEnum, serviceStatusEnum } from "@/libs/enumerate";
import { serviceModeConvert, serviceStatusConvert } from "@/libs/converStatus";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";

const orderDetail = {
  addressDetail: "",
  afterSaleTime: "",
  afterStatus: "",
  checkStatus: "",
  createTime: "",
  createTimeBegin: "",
  createTimeEnd: "",
  currentOrderStatus: "",
  deliveryAddress: "",
  deliveryFee: "",
  deliveryTime: "",
  discountFee: "",
  hdCode: "",
  hdStatus: "",
  id: "",
  invoiceStatus: "",
  needPay: "",
  notHdStatus: "",
  orderCode: "",
  orderCoupon: "",
  orderGoodsList: [],
  orderStatus: "",
  delivery: "",
  orderStatusIn: "",
  payStatus: "",
  payableFee: "",
  paymentTime: "",
  phone: "",
  receiveTime: "",
  refundFee: "",
  remarks: "",
  saleUserName: "",
  salesmanId: "",
  settlementType: "",
  shopCode: "",
  shopName: "",
  totalFee: "",
  userId: "",
  userName: ""
};
const rowData = {
  page: 1,
  rows: 20,
  startTime: null,
  endTime: null,
  orderCode: "",
  hdCode: "",
  userName: "",
  phone: "",
  serviceMode: null,
  status: null,
  sidx: "createTime",
  sort: "desc"
};
// 地址对象
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
export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      downloadLoading: false,
      createLoading: false,
      modalViewLoading: false,
      serviceModeEnum,
      serviceStatusEnum,
      afterImageList: [],
      uploadVisible: false,
      tempTableLoading: false,
      deliveryFlag: false,
      imgUploadViewItem: "",
      allMoney: 0,
      deliveryFee: 0,
      searchRowData: _.cloneDeep(rowData),
      orderDetail: _.cloneDeep(orderDetail),
      deliveryInfo: _.cloneDeep(deliveryInfo),
      serviceMode: [
        {
          label: "正常",
          value: "NORMAL"
        },
        {
          label: "补货",
          value: "REPLENISH"
        },
        {
          label: "补款",
          value: "SUPPLEMENT"
        },
        {
          label: "返仓",
          value: "REVERT"
        }
      ],
      //售后列表
      columns: [
        {
          title: "申请时间",
          key: "createTime",
          width: 170,
          align: "center"
        },
        {
          title: "订单编号",
          key: "orderCode",
          width: 170,
          align: "center"
        },
        {
          title: "海鼎单号",
          key: "hdCode",
          width: 150,
          align: "center"
        },
        {
          title: "门店名称",
          align: "center",
          width: 160,
          key: "shopName"
        },
        {
          title: "店长名称",
          align: "center",
          width: 160,
          key: "userName"
        },
        {
          title: "店长手机",
          align: "center",
          width: 160,
          key: "phone"
        },
        {
          title: "商品名称",
          align: "center",
          width: 160,
          key: "orderGoods"
        },
        {
          title: "实付金额",
          align: "center",
          width: 120,
          key: "payableFee",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.payableFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "收货区域",
          align: "center",
          width: 120,
          key: "receiptArea"
        },
        {
          title: "售后方式",
          align: "center",
          width: 120,
          key: "serviceMode",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.serviceMode) {
              return <div>{row.serviceMode}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "售后状态",
          align: "center",
          width: 120,
          key: "status",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "WAIT") {
              return (
                <div>
                  <tag color="magenta">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "AUDIT_REJECT") {
              return (
                <div>
                  <tag color="orange">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "CANCEL") {
              return (
                <div>
                  <tag color="cyan">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "WAIT_REVIEW") {
              return (
                <div>
                  <tag color="pink">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "REVIEW_REJECT") {
              return (
                <div>
                  <tag color="success">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "SERVICEING") {
              return (
                <div>
                  <tag color="gold">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === "FINISH") {
              return (
                <div>
                  <tag color="blue">
                    {serviceStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.status}</div>;
          }
        },
        {
          title: "操作",
          minWidth: 120,
          align: "center",
          key: "handle",
          options: ["financeAudit", "financeRefuse"]
        }
      ]
    };
  },
  computed: {
    address() {
      const addressArea = this.deliveryInfo.addressArea
        ? this.deliveryInfo.addressArea.replace(new RegExp("/", "gm"), "")
        : "";
      return addressArea + this.deliveryInfo.addressDetail;
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(rowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = this._.cloneDeep(rowData);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      this.searchLoading = true;
      this.clearSearchLoading = true;
      getFinanceAuditPages(this.searchRowData)
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

    startTimeChange(value, date) {
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.endTime = value;
    },
    // 财务审核通过
    hanldeFinanceAudit(params) {
      if (params.row.status != "WAIT_REVIEW") {
        this.$Message.info("不是财务待审核的订单");
        return;
      }
      getFinanceAudit(params.row)
        .then(res => {
          this.$Message.info("通过审核");
          this.getTableData();
        })
        .finally(() => {});
    },
    // 财务审核拒绝
    hanldeFinanceRefuse(params) {
      if (params.row.status != "WAIT_REVIEW") {
        this.$Message.info("不是财务待审核的订单");
        return;
      }
      getFinanceRefuse(params.row)
        .then(res => {
          this.$Message.info("拒绝审核");
          this.getTableData();
        })
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.check {
  display: flex;
  align-items: center;
}
</style>
