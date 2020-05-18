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
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userName"
              placeholder="用户名"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 105px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.refundType"
              class="search-col mr5"
              placeholder="退款方式"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in wholesaleRefundTypeEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.refundReason"
              class="search-col mr5"
              placeholder="退款原因"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in wholesaleRefundReasonEnum"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.refundTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="退款时间起"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.refundTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="退款时间止"
              class="mr5"
              style="width: 150px"
              @on-change="endTimeChange"
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
          <Button
            :loading="downloadLoading"
            class="search-btn mr2"
            type="primary"
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import { getrefundLogPages } from "@/api/wholesale";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import { paymentFromEnum, wholesalePayTypeEnum } from "@/libs/enumerate";
import {
  wholesalePayTypeConvert,
  paymentFromConvert
} from "@/libs/converStatus";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";

const refundLog = {
  id: 0,
  orderCode: "",
  paymentLogId: 0,
  phone: "",
  refundFee: 0,
  refundReason: "",
  refundTime: "",
  refundTimeBegin: "",
  refundTimeEnd: "",
  refundType: "",
  shopName: "",
  transactionId: "",
  userId: 0,
  userName: ""
};

const rowData = {
  orderCode: "",
  userName: "",
  refundReason: "",
  phone: "",
  sidx: "id",
  sort: "desc",
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      paymentFromEnum,
      wholesalePayTypeEnum,
      downloadLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(rowData),
      refundLog: _.cloneDeep(refundLog),
      wholesaleRefundTypeEnum: [
        {
          label: "微信",
          value: "wechatRefund"
        },
        {
          label: "余额",
          value: "balanceRefund"
        },
        {
          label: "鼎付通",
          value: "haidingRefund"
        }
      ],
      wholesaleRefundReasonEnum: [
        {
          label: "当天退款",
          value: "当天退款"
        },
        {
          label: "售后退款",
          value: "售后退款"
        }
      ],
      columns: [
        {
          title: "编号",
          key: "id",
          align: "center",
          minWidth: 40
        },
        {
          title: "订单编码",
          key: "orderCode",
          align: "center",
          minWidth: 150
        },
        {
          title: "微信交易流水号",
          key: "transactionId",
          align: "center",
          minWidth: 200
        },
        {
          title: "门店名称",
          align: "center",
          key: "shopName",
          minWidth: 80
        },
        {
          title: "用户名",
          align: "center",
          key: "userName",
          minWidth: 80
        },
        {
          title: "手机号",
          align: "center",
          key: "phone",
          minWidth: 120
        },
        {
          title: "退款方式",
          align: "center",
          key: "refundType",
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.refundType === "balanceRefund") {
              return <div>余额</div>;
            } else if (row.refundType === "wechatRefund") {
              return <div>微信</div>;
            } else if (row.refundType === "haidingRefund") {
              return <div>鼎付通</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "退款金额",
          align: "center",
          key: "refundFee",
          minWidth: 150,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.refundFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "退款原因",
          align: "center",
          minWidth: 130,
          key: "refundReason"
        },
        {
          title: "退款时间",
          align: "center",
          minWidth: 130,
          key: "refundTime"
        }
      ]
    };
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
      getrefundLogPages(this.searchRowData)
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
      console.log("beginTime:", value);
      this.searchRowData.refundTimeBegin = value;
    },
    endTimeChange(value, data) {
      console.log("endTime:", value);
      this.searchRowData.refundTimeEnd = value;
    },
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getrefundLogPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item["orderCode"] = item["orderCode"] + "";
          item["transactionId"] = item["transactionId"] + "";
          item["refundFee"] = (item["refundFee"] / 100.0).toFixed(2);
          if (item["refundType"] === "balanceRefund") {
            item["refundType"] = "余额";
          } else if (item["refundType"] === "wechatRefund") {
            item["refundType"] = "微信";
          } else if (item["refundType"] === "haidingRefund") {
            item["refundType"] = "鼎付通";
          } else {
            item["refundType"] = "N/A";
          }
        });
        const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
        this.$refs.tables.handleDownload({
          filename: `退款流水-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
