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
import { getPaymentLogPages } from "@/api/wholesale";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import { paymentFromEnum, wholesalePayTypeEnum } from "@/libs/enumerate";
import {
  wholesalePayTypeConvert,
  paymentFromConvert
} from "@/libs/converStatus";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";

const paymentLog = {};

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
  status: null
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
          key: "serviceMode"
        },
        {
          title: "售后状态",
          align: "center",
          width: 120,
          key: "status"
        },
        {
          title: "操作",
          minWidth: 120,
          align: "center",
          key: "handle",
          options: ["view"]
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
      getPaymentLogPages(this.searchRowData)
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
