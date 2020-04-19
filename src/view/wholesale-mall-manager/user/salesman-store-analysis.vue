<template>
  <div class="m-role">
    <Card>
      <Row v-show="isSalesmanAnalysis">
        <i-col span="24" class="brand-red font-sm">{{ salesmanName }}--旗下门店业绩分析</i-col>
      </Row>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-exchange="handleExchange"
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
        </div>
        <div slot="operations">
          <Button
            v-waves
            v-show="isSalesmanAnalysis"
            type="warning"
            class="mr5"
            @click="handleBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves type="primary" class="mr5" @click="handleExchangeBatch">
            <Icon type="md-repeat" />&nbsp;批量转让
          </Button>
          <!-- <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>-->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
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

    <Modal v-model="modalUser" :width="1000" title="业务员选择">
      <Card>
        <tables
          ref="dataTables"
          v-model="userData"
          :columns="userColumns"
          :loading="loadingUser"
          editable
          searchable
          border
          search-place="top"
          @on-select-all="onSelectionAllUser"
          @on-selection-change="onSelectionChangeUser"
        >
          <div slot="searchCondition">
            <Input
              v-model="searchUserRowData.phone"
              placeholder="用户电话"
              class="search-input mr5"
              style="width: 100px"
              clearable
            ></Input>
            <Input
              v-model="searchUserRowData.userName"
              placeholder="用户姓名"
              class="search-input mr5"
              style="width: 100px"
              clearable
            ></Input>
            <Select
              v-model="searchUserRowData.salesUserStatus"
              class="search-col mr5"
              placeholder="业务员状态"
              style="width:100px"
              clearable
            >
              <Option
                v-for="item in userStatusEnum"
                :value="item.value"
                :key="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Button
              v-waves
              :searchLoading="searchLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleSearch1"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear1"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="usersTotal"
              :current="searchUserRowData.page"
              show-sizer
              show-total
              @on-change="changeUserPage"
              @on-page-size-change="changeUserPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
      <div slot="footer">
        <Button @click="modalUser=false">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleAssgin">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  getPerformanceShopPages,
  getUserPages,
  getAllSalesman,
  storeAssign
} from "@/api/wholesale";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";
import { userStatusEnum, sexEnum, userTypeEnum } from "@/libs/enumerate";
import { userStatusConvert, sexConvert } from "@/libs/converStatus";

const userAnalysis = {
  address: "",
  balance: "",
  id: 0,
  lastOneOrdertime: "",
  nickname: "",
  openId: "",
  performanceTotal: "",
  performanceTotalFrequency: "",
  performanceTotalStr: "",
  phone: "",
  registerTime: "",
  shopName: "",
  unionId: "",
  userName: "",
  userStatus: ""
};

const roleRowData = {
  salesUserId: 0,
  userName: "",
  phone: "",
  page: 1,
  rows: 20
};

const userDetail = {
  addressDetail: "",
  balance: 0,
  city: "",
  id: 0,
  inviteCode: "",
  isVip: "",
  nickname: "",
  openId: "",
  phone: "",
  profilePhoto: "",
  registerTime: "",
  salesUserId: "",
  saleUserName: "",
  salesUserStatus: "",
  sex: "",
  shopName: "",
  unionId: "",
  userName: "",
  userStatus: "",
  userType: ""
};

const userRowData = {
  userName: "",
  phone: "",
  userType: "sale",
  page: 1,
  rows: 10
};

const userColumns = [
  {
    type: "selection",
    key: "",
    width: 60,
    fixed: "left",
    align: "center"
  },
  {
    title: "编号",
    align: "center",
    key: "id",
    fixed: "left",
    maxWidth: 80
  },

  {
    title: "店长姓名",
    align: "center",
    key: "userName"
  },
  {
    title: "手机号码",
    align: "center",
    key: "phone",
    minWidth: 60
  },
  {
    title: "注册时间",
    align: "center",
    key: "registerTime",
    minWidth: 80
  },
  {
    title: "业务员状态",
    align: "center",
    key: "salesUserStatus",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.salesUserStatus === "certified") {
        return (
          <div>
            <tag color="success">
              {userStatusConvert(row.salesUserStatus).label}
            </tag>
          </div>
        );
      } else if (row.salesUserStatus === "locking") {
        return (
          <div>
            <tag color="error">
              {userStatusConvert(row.salesUserStatus).label}
            </tag>
          </div>
        );
      } else if (row.salesUserStatus === "unaudited") {
        return (
          <div>
            <tag color="warning">
              {userStatusConvert(row.salesUserStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{userStatusConvert(row.salesUserStatus).label}</div>;
    }
  },
  {
    title: "邀请码",
    align: "center",
    key: "inviteCode",
    maxWidth: 100
  }
];

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      selectedUserIds: [],
      currentSalesId: null,
      assginSalesUserId: null,
      salesManList: [],
      userData: [],
      userStatusEnum,
      userTypeEnum,
      sexEnum,
      userColumns,
      salesmanName: "",
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      modalUser: false,
      loadingUser: false,
      usersTotal: 0,
      searchRowData: _.cloneDeep(roleRowData),
      searchUserRowData: _.cloneDeep(userRowData),
      userAnalysis: _.cloneDeep(userAnalysis),
      userDetail: _.cloneDeep(userDetail),
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center"
        },
        {
          title: "店铺名称",
          align: "center",
          key: "shopName",
          minWidth: 60
        },
        {
          title: "店长姓名",
          align: "center",
          key: "userName",
          minWidth: 80
        },
        {
          title: "店长手机",
          align: "center",
          key: "phone",
          minWidth: 80
        },
        {
          title: "区域",
          align: "center",
          key: "city",
          minWidth: 80
        },
        {
          title: "门店地址",
          align: "center",
          key: "address",
          minWidth: 80
        },
        {
          title: "累计业绩/频次",
          align: "center",
          key: "performanceTotalStr",
          minWidth: 80
          // render(h, params, vm) {
          //   const amount = fenToYuanDot2(
          //     params.row.performanceTotalStr
          //   );
          //   return <div>{amount}</div>;
          // }
        },
        {
          title: "注册时间",
          align: "center",
          key: "registerTime",
          minWidth: 80
        },
        {
          title: "最近下单时间",
          align: "center",
          key: "lastOneOrdertime",
          minWidth: 80
        },
        {
          title: "用户状态",
          align: "center",
          minWidth: 30,
          key: "userStatus",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.userStatus === "certified") {
              return (
                <div>
                  <tag color="success">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            } else if (row.userStatus === "locking") {
              return (
                <div>
                  <tag color="error">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            } else if (row.userStatus === "unaudited") {
              return (
                <div>
                  <tag color="warning">
                    {userStatusConvert(row.userStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">
                  {userStatusConvert(row.userStatus).label}
                </tag>
              </div>
            );
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 100,
          key: "handle",
          options: ["exchange"]
        }
      ]
    };
  },
  computed: {
    sexConvertName() {
      return sexConvert(this.userAnalysis.sex).label;
    },
    userBalance() {
      return fenToYuanDot2(this.userAnalysis.balance);
    },
    isSalesmanAnalysis() {
      return this.$route.query.id > 0;
    }
  },
  created() {
    this.salesmanName = this.$route.query.salesmanName
      ? this.$route.query.salesmanName
      : "N/A";
    this.currentSalesId = this.$route.query.id ? this.$route.query.id : null;
    this.getTableData();
    this.getAllSalesman();
  },
  mounted() {},
  methods: {
    getUserTableData() {
      getUserPages(this.searchUserRowData)
        .then(res => {
          this.userData = res.rows;
          this.usersTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableData() {
      this.searchRowData.salesUserId = this.$route.query.id
        ? this.$route.query.id
        : 0;
      getPerformanceShopPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getAllSalesman() {
      getAllSalesman().then(res => {
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
    resetSearchUserRowData() {
      this.searchUserRowData = _.cloneDeep(userRowData);
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.userAnalysis = _.cloneDeep(userAnalysis);
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleExchange(params) {
      // TODO: 转让业务员旗下门店
      this.assginSalesUserId = null;
      this.selectedUserIds = [];
      this.selectedUserIds.push(params.row.id);
      this.searchUserRowData = _.cloneDeep(userRowData);
      this.getUserTableData();
      this.modalUser = true;
    },
    handleExchangeBatch() {
      if (this.selectedUserIds.length === 0) {
        this.$Message.error("请先选择要转让的用户");
        return;
      }
      this.assginSalesUserId = null;
      this.searchUserRowData = _.cloneDeep(userRowData);
      this.getUserTableData();
      this.modalUser = true;
    },
    handleAssgin() {
      if (this.selectedUserIds.length === 0) {
        this.$Message.error("请先选择要转让的用户");
        return;
      }
      if (!this.assginSalesUserId) {
        this.$Message.error("请先选择要转让的业务员");
        return;
      }
      const userIds = this.selectedUserIds.join(",");
      storeAssign({
        userIds,
        assginSalesUserId: this.assginSalesUserId
      }).then(res => {
        this.$Message.info("门店转让成功");
        this.getTableData();
        this.modalUser = false;
      });
    },
    onSelectionAll(selection) {
      this.selectedUserIds = selection.map(item => item.id.toString());
    },
    onSelectionChange(selection) {
      this.selectedUserIds = selection.map(item => item.id.toString());
    },
    onSelectionAllUser(selection) {
      if (selection.length > 1) {
        this.$Message.warning("每次只能选择一个业务员");
        return;
      }
      this.assginSalesUserId = selection[0].id.toString();
    },
    onSelectionChangeUser(selection) {
      if (selection.length > 1) {
        this.$Message.warning("每次只能选择一个业务员");
        return;
      }
      this.assginSalesUserId = selection[0].id.toString();
    },
    changeUserPage(page) {
      this.searchUserRowData.page = page;
      this.getUserTableData();
    },
    changeUserPageSize(pageSize) {
      this.searchUserRowData.page = 1;
      this.searchUserRowData.rows = pageSize;
      this.getUserTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getUserTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(userRowData);
      this.getUserTableData();
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getPerformanceShopPages(this.searchRowData)
        .then(res => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          // 表格数据导出字段翻译
          tableData.forEach(item => {
            item["userType"] =
              item["userType"] === "sale" ? "业务员" : "普通用户";
            item["userStatus"] = userStatusConvert(item["userStatus"]).label;
            item["salesUserStatus"] = userStatusConvert(
              item["salesUserStatus"]
            ).label;
          });
          this.$refs.tables.handleDownload({
            filename: `会员分析信息-${new Date().valueOf()}`,
            data: tableData
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
    },
    handleBack() {
      this.turnToPage({
        name: "wholesale-salesman-analysis"
      });
    },
    handleSearch1() {
      this.searchUserRowData.page = 1;
      this.searchLoading = true;
      this.getUserTableData();
    },
    handleClear1() {
      // 重置数据
      this.resetSearchUserRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch1();
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
