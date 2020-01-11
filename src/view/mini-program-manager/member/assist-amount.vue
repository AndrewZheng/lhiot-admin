<template>
  <div class="m-role">
    <div style="margin-bottom:30px">
      <Card>
        <h4>助力抢爆品活动基础数据分析</h4>
        <tables
          v-model="inviteData"
          :columns="dataColumns"
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
              <RadioGroup v-model="button" type="button" @on-change="timeChange">
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div class="mark" v-show="mark===true">
                <DatePicker
                  v-model="searchRowData1.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData1.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChange"
                />
              </div>
              <Button
                class="search-btn mr5"
                type="primary"
                @click="handleSearch1"
                v-show="mark===true"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
            </Row>
            <div class="ml15 mt10">
              <i style="color:red">*</i> 默认展示当天的数据
            </div>
          </div>
        </tables>
      </Card>
    </div>
    <div style="position: relative;">
      <div class="tabChange">
        <b
          data-index="user"
          @click="assistDataChange"
          :class=" topStatus=='user' ? 'hot' : '' "
        >用户数据分析</b>
        <b
          data-index="product"
          @click="assistDataChange"
          :class=" topStatus=='product' ? 'hot' : '' "
        >单品数据分析</b>
      </div>
      <Card v-show="topStatus==='user'">
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
                v-model="searchRowData.nickName"
                placeholder="用户昵称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.phone"
                placeholder="手机号码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Select
                v-model="searchRowData.sidx"
                placeholder="排序"
                style="padding-right: 5px;width: 120px"
                clearable
              >
                <Option
                  v-for="(item,index) in rankType"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100px"
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
      <Card v-show="topStatus==='product'">
        <tables
          ref="tables1"
          v-model="tableData2"
          :columns="columns2"
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
              <Select
                v-model="searchRowData2.sidx"
                placeholder="排序"
                style="padding-right: 5px;width: 130px"
                @on-change="handRankType"
              >
                <Option
                  v-for="(item,index) in rankType2"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100px"
                >{{ item.label }}</Option>
              </Select>
              <Button class="search-btn mr2" type="warning" @click="handleDownload">
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
          </div>
        </tables>
        <!-- 彭旭 -->
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage"
              :current="searchRowData2.page"
              show-sizer
              show-total
              @on-change="changePage2"
              @on-page-size-change="changePageSize2"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  userAssistStatistics,
  assistDataStatistics,
  singleAssistStatistics
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";

const couponTemplateDetail = {
  //   id: 0,
  //   couponName: "",
  //   couponType: null,
  //   couponFee: 0,
  //   minBuyFee: 0,
  //   couponStatus: null,
  //   couponImage: "",
  //   createUser: "",
  //   createTime: null,
  //   couponRules: "",
  //   couponScope: null
};

const roleRowData = {
  nickName: "",
  phone: "",
  page: 1,
  rows: 10,
  sidx: "invite_assist_user",
  sort: "desc"
};

// 第一个tables
const roleRowData1 = {
  beginDate: null,
  endDate: null
  //   dateGroup: false
};

const roleRowData2 = {
  standardId: "",
  page: 1,
  rows: 10,
  sidx: "buy_count",
  sort: "desc"
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      mark: false,
      topStatus: "user",
      button: "今日",
      inviteData: [],
      tableData2: [],
      totalPage: 0,
      rankType: [
        {
          label: "邀请助力人数",
          value: "invite_assist_user"
        },
        {
          label: "助力参与数量",
          value: "assist_join_count"
        },
        {
          label: "助力成功数量",
          value: "assist_success_count"
        },
        {
          label: "购买总数量",
          value: "buy_count"
        }
      ],
      rankType2: [
        {
          label: "助力总次数",
          value: "assist_count"
        },
        {
          label: "助力成功总次数",
          value: "assist_success_count"
        },
        {
          label: "购买总数量",
          value: "buy_count"
        }
      ],
      // 袁木
      columns: [
        {
          title: "用户昵称",
          align: "center",
          key: "nickName"
        },
        {
          title: "手机号",
          align: "center",
          key: "phone"
        },
        {
          title: "邀请助力人数",
          align: "center",
          key: "inviteAssistUser"
        },
        {
          title: "助力参与数量",
          align: "center",
          key: "assistJoinCount",
          minWidth: 60
        },
        {
          title: "助力成功数量",
          align: "center",
          key: "assistSuccessCount"
        },
        {
          title: "购买总数量",
          align: "center",
          key: "buyCount"
        }
      ],
      dataColumns: [
        {
          title: "助力商品总数",
          key: "assistProd",
          align: "center"
        },
        {
          title: "助力成功商品总数",
          key: "assistSuccessProd",
          align: "center"
        },
        {
          title: "助力成功率",
          key: "assistSuccessRate",
          align: "center",
          render(h, params) {
            return h("div", params.row.assistSuccessRate + "%");
          }
        },
        {
          title: "发起助力总人数",
          align: "center",
          key: "joinUser"
        },
        {
          title: "被邀请助力总人数",
          align: "center",
          key: "assistUser"
        },
        {
          title: "购买商品总数",
          align: "center",
          key: "buyProd"
        }
      ],
      //导出数据
      columns2: [
        {
          title: "类型",
          align: "center",
          key: "type",

          render(h, params) {
            const { row } = params;
            if (row.type === "COUPON") {
              return (
                <div>
                  <tag color="orange">{"优惠券"}</tag>
                </div>
              );
            } else if (row.type === "PROD") {
              return (
                <div>
                  <tag color="blue">{"商品"}</tag>
                </div>
              );
            }
          }
        },
        {
          title: "商品规格ID",
          align: "center",
          key: "standardId",
          render(h, params) {
            const { row } = params;
            if (row.standardId != null) {
              return <div>{row.standardId}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "商品条码",
          align: "center",
          key: "barcode",
          render(h, params) {
            const { row } = params;
            if (row.barcode != null) {
              return <div>{row.barcode}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "商品名称",
          align: "center",
          key: "productName",
          render(h, params) {
            const { row } = params;
            if (row.productName != null) {
              return <div>{row.productName}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "券配置ID",
          align: "center",
          key: "couponConfigId",
          render(h, params) {
            const { row } = params;
            if (row.couponConfigId != null) {
              return <div>{row.couponConfigId}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "优惠券名称",
          align: "center",
          key: "couponName",
          render(h, params) {
            const { row } = params;
            if (row.couponName != null) {
              return <div>{row.couponName}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "需助力人数",
          align: "center",
          key: "allPeopleNumber"
        },
        {
          title: "助力总次数",
          align: "center",
          key: "assistCount"
        },
        {
          title: "助力成功总次数",
          align: "center",
          key: "assistSuccessCount",
          minWidth: 60
        },
        {
          title: "助力成功率",
          align: "center",
          key: "assistSuccessRate",
          render(h, params) {
            return h("div", params.row.assistSuccessRate + "%");
          }
        },
        {
          title: "购买总数量",
          align: "center",
          key: "buyCount",
          minWidth: 60
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowData1: _.cloneDeep(roleRowData1),
      searchRowData2: _.cloneDeep(roleRowData2),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowData1 = _.cloneDeep(roleRowData1);
    this.searchRowData2 = _.cloneDeep(roleRowData2);
    this.getTableData();
    this.getTableData1();
    this.getTableData2();
    // this.handleSearch();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      userAssistStatistics(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableData1(value) {
      let date = new Date();
      date.setDate(date.getDate());
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var today = `${year}-${month}-${day}`;
      if (value === "昨日") {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var yesterday = `${year}-${month}-${day}`;
        this.searchRowData1.beginDate = yesterday;
        this.searchRowData1.endDate = yesterday;
      }
      if (value === "今日") {
        let date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowData1.beginDate = today;
        this.searchRowData1.endDate = today;
      }
      if (value === "最近7天") {
        let date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowData1.beginDate = sevenDay;
        this.searchRowData1.endDate = today;
      }
      if (value === "最近30天") {
        let date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowData1.beginDate = toMonth;
        this.searchRowData1.endDate = today;
      }
      let date1 = new Date();
      date1.setDate(date.getDate() - 1);
      var year1 = date.getFullYear();
      var month1 = date.getMonth() + 1;
      var day1 = date.getDate();
      var yesterday1 = `${year1}-${month1}-${day1}`;
      if (this.button === "今日") {
        this.searchRowData1.beginDate = yesterday1;
        this.searchRowData1.endDate = yesterday1;
      }
      assistDataStatistics(this.searchRowData1)
        .then(res => {
          //   console.log("接受数据", res);
          this.inviteData.push(res);
          // this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableData2() {
      singleAssistStatistics(this.searchRowData2)
        .then(res => {
          this.tableData2 = res.rows;
          this.totalPage = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSearch1() {
      //   this.searchLoading = true;
      this.inviteData = [];
      this.getTableData1();
    },
    handRankType() {
      this.searchRowData2.page = 1;
      this.searchLoading = true;
      this.getTableData2();
    },
    timeChange(value) {
      if (value === "今日") {
        this.getTableData1(value);
        this.inviteData = [];
        this.mark = false;
      } else if (value === "昨日") {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === "最近7天") {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === "最近30天") {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === "自定义时间") {
        this.mark = true;
        this.searchRowData1.beginDate = "";
        this.searchRowData1.endDate = "";
      }
    },
    startTimeChange(value, date) {
      this.button = "自定义时间";
      this.searchRowData1.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = "自定义时间";
      this.searchRowData1.endDate = value;
    },
    handleSearch() {
      this.searchRowData.page = 1;
      // this.searchLoading = true;
      this.getTableData();
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData2.rows = this.total > 5000 ? 5000 : this.total;
      singleAssistStatistics(this.searchRowData2).then(res => {
        const tableData2 = res.rows;
        // 恢复正常页数
        this.searchRowData2.rows = 10;
        // 表格数据导出字段翻译
        let _this = this;
        tableData2.forEach(item => {
          if (item["type"] == "COUPON") {
            item["type"] = "优惠券";
          } else if (item["type"] == "PROD") {
            item["type"] = "商品";
          }
          item["couponConfigId"] = Number(item["couponConfigId"]);
        });
        this.$refs.tables1.handleDownload({
          filename: `助力抢爆品单品数据统计-${new Date().valueOf()}`,
          data: tableData2
        });
      });
    },
    assistDataChange(e) {
      let index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
      // console.log("数据", this.topStatus);
    },
    changePage2(page) {
      this.searchRowData2.page = page;
      this.getTableData2();
    },
    changePageSize2(pageSize) {
      this.searchRowData2.page = 1;
      this.searchRowData2.rows = pageSize;
      this.getTableData2();
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
.tabChange {
  height: 50px;
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: -5px;
  left: 0;
  background: rgb(245, 247, 249);
  border: 1px solid rgb(232, 234, 236);
  border-radius: 10px 10px 0 0;
  b {
    display: block;
    width: 113px;
    height: 48px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
}
.hot {
  display: inline-block;
  // color: red;
  background-color: #fff;
}
</style>
