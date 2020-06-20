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
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
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
          <Button v-waves class="search-btn ml5 mr5" type="primary" @click="goBack">
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button
            :loading="downloadLoading"
            class="search-btn mr2"
            type="warning"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出数据
          </Button>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import { getOrderCouponDetails } from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { fenToYuanDot2 } from "@/libs/util";
import {
  receivingWayEnum,
  receivingWay,
  orderStatusEnum,
  miniOrderTypeEnum,
  appTypeEnum,
  miniOrderStatusEnum,
  miniOrderStatus,
  miniHdStatusEnum,
  miniHdStatus
} from "@/libs/enumerate";
import {
  orderTypeConvert,
  thirdDeliverStatusConvert,
  miniOrderStatusConvert,
  miniHdStatusConvert,
  receivingWayConvert,
  appTypeConvert
} from "@/libs/converStatus";
import BookTypeOption from "_c/book-type-option";
const orderDetail = {
  id: 0,
  amountPayable: "", //应付金额
  code: "", //订单编号
  couponAmount: "", //优惠金额
  couponEntityStatus: "", //优惠券实体状态
  couponFee: "", //优惠金额
  couponName: "", //优惠券名称
  couponType: null, //优惠券类型
  createAt: "", //创建时间
  minBuyFee: "", //
  nickname: "", //用户昵称
  receiveTime: "", //用户领取时间
  source: "",
  storeCode: "", //门店编码
  storeName: "", //门店名称
  totalAmount: "", //订单总价
  useTime: "", //使用时间
  userId: "", //订单用户
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  createTimeBegin: null,
  createTimeEnd: null,
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
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center"
        },
        {
          title: "订单编号",
          key: "code",
          minWidth: 80,
          align: "center",
          sortable: true
        },
        {
          title: "门店名称",
          align: "center",
          key: "storeName"
        },
        {
          title: "用户名称",
          align: "center",
          key: "nickname"
        },
        {
          title: "券名称",
          align: "center",
          key: "couponName"
        },
        {
          title: "用券时间",
          align: "center",
          key: "useTime",
          minWidth: 80
        },
        {
          title: "订单金额",
          align: "center",
          key: "totalAmount",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: "优惠金额",
          align: "center",
          key: "couponAmount",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: "应付金额",
          align: "center",
          key: "amountPayable",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        {
          title: "来源",
          align: "center",
          key: "source",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.source === "SMALL") {
              return <div>小程序</div>;
            } else if (row.source === "HD") {
              return <div>海鼎</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        }
        // {
        //   title: "操作",
        //   minWidth: 150,
        //   key: "handle",
        //   options: ["view"]
        // }
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
  },
  methods: {
    orderStatusesOnChange(value) {
      console.log(value);
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.createTimeBegin = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.createTimeEnd = value;
    },
    handleEditCloseTransferModalView() {
      this.transferModalView = false;
    },
    handleEditClose() {
      this.modalViewLoading = false;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    goBack() {
      this.turnToPage("small-order");
    },
    getTableData() {
      this.loading = true;
      getOrderCouponDetails(this.searchRowData)
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
      let pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getOrderCouponDetails(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
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
        });
        this.$refs.tables.handleDownload({
          filename: `用券数据信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
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
</style>
