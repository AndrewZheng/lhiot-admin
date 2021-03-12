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
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-analytics="handleAnalysis"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.phone"
            placeholder="业务员电话"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.userName"
            placeholder="业务员姓名"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Button
            v-waves
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
          <Button
            v-waves
            v-has="'export_salesman_analysis'"
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            :page-size="searchRowData.rows"
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
import _ from "lodash";
import { getPerformancePages, getAllSalesman } from "@/api/wholesale";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import {
  getWholesaleGoods,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
} from "@/libs/util";
import { userStatusEnum, sexEnum, userTypeEnum } from "@/libs/enumerate";
import { userStatusConvert, sexConvert } from "@/libs/converStatus";

const userAnalysis = {
  newShopNumTotal: 0,
  openId: "",
  perMonthNewShopNum: 0,
  perMonthPerformance: "",
  performanceTotal: "",
  salesUserId: 0,
  salesUserStatus: "",
  salesmanName: "",
  salesmanPhone: "",
  thisMonthNewShopNum: 0,
  thisMonthPerformance: "",
  unionId: "",
  userType: "",
};

const roleRowData = {
  userName: "",
  phone: "",
  page: 1,
  rows: 20,
};

export default {
  components: {
    Tables,
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ids: [],
      templatePageOpts: [20, 50],
      salesManList: [],
      userStatusEnum,
      userTypeEnum,
      sexEnum,
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      userAnalysis: _.cloneDeep(userAnalysis),
      columns: [
        {
          title: "业务员姓名",
          align: "center",
          key: "salesmanName",
          minWidth: 70,
        },
        {
          title: "手机号码",
          align: "center",
          key: "salesmanPhone",
          minWidth: 90,
        },
        {
          title: "上月业绩",
          align: "center",
          key: "perMonthPerformance",
          minWidth: 80,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.perMonthPerformance);
            return <div>{amount}</div>;
          },
        },
        {
          title: "本月业绩",
          align: "center",
          key: "thisMonthPerformance",
          minWidth: 80,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.thisMonthPerformance);
            return <div>{amount}</div>;
          },
        },
        {
          title: "累计业绩",
          align: "center",
          key: "performanceTotal",
          minWidth: 80,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.performanceTotal);
            return <div>{amount}</div>;
          },
        },
        {
          title: "上月招募数",
          align: "center",
          key: "perMonthNewShopNum",
          minWidth: 80,
        },
        {
          title: "本月招募数",
          align: "center",
          key: "thisMonthNewShopNum",
          minWidth: 80,
        },
        {
          title: "累计招募数",
          align: "center",
          key: "newShopNumTotal",
          minWidth: 80,
        },
        {
          title: "状态",
          align: "center",
          key: "salesUserStatus",
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.salesUserStatus === "certified") {
              return (
                <div>
                  <tag color="success">
                    {userStatusConvert(row.salesUserStatus)}
                  </tag>
                </div>
              );
            } else if (row.salesUserStatus === "locking") {
              return (
                <div>
                  <tag color="error">
                    {userStatusConvert(row.salesUserStatus)}
                  </tag>
                </div>
              );
            } else if (row.salesUserStatus === "unaudited") {
              return (
                <div>
                  <tag color="warning">
                    {userStatusConvert(row.salesUserStatus)}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">
                  {userStatusConvert(row.salesUserStatus)}
                </tag>
              </div>
            );
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 100,
          key: "handle",
          options: ["view", "analytics"],
        },
      ],
    };
  },
  computed: {
    sexConvertName() {
      return sexConvert(this.userAnalysis.sex);
    },
    userBalance() {
      return fenToYuanDot2(this.userAnalysis.balance);
    },
  },
  created() {
    this.getTableData();
    // this.getAllSalesman();
  }, 
  mounted() {},
  methods: {
    getTableData() {
      getPerformancePages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getAllSalesman() {
      getAllSalesman().then((res) => {
        this.salesManList = res;
      });
    },
    beginTimeChange(value, date) {
      this.userAnalysis.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.userAnalysis.regEndTime = value;
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.turnToPage({
        name: "wholesale-order",
        query: {
          id: params.row.salesUserId,
          salesmanName: params.row.salesmanName,
        },
      });
    },
    handleAnalysis(params) {
      this.turnToPage({
        name: "wholesale-salesman-store-analysis",
        query: {
          id: params.row.salesUserId,
          salesmanName: params.row.salesmanName,
        },
      });
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.userAnalysis = _.cloneDeep(userAnalysis);
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getPerformancePages(this.searchRowData)
        .then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 20;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item["userType"] =
              item["userType"] === "sale" ? "业务员" : "普通用户";
            item["userStatus"] = userStatusConvert(item["userStatus"]);
            item["salesUserStatus"] = userStatusConvert(
              item["salesUserStatus"]
            );
          });
          this.$refs.tables.handleDownload({
            filename: `会员分析信息-${new Date().valueOf()}`,
            data: tableData,
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
    },
  },
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
