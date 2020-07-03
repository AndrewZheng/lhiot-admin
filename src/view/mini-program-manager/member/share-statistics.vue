<template>
  <div class="m-role">
    <div style="margin-bottom:30px;position: relative;">
      <div class="tabChange">
        <b
          data-index="pro"
          @click="assistDataChange"
          :class=" topStatus=='pro' ? 'hot' : '' "
        >商品数据统计</b>
        <b data-index="use" @click="assistDataChange" :class=" topStatus=='use' ? 'hot' : '' ">用户数据统计</b>
        <b data-index="commission" @click="assistDataChange" :class=" topStatus=='commission' ? 'hot' : '' ">佣金数据统计</b>
      </div>
      <Card v-show="topStatus==='pro'">
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
          @on-sort-change="onSortChange"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="button" type="button" @on-change="timeChange">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div class="mark" v-show="mark===true">
                <DatePicker
                  v-model="searchRowData.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChange"
                />
              </div>
              <Input
                v-model="searchRowData.productName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
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
              <Button class="search-btn mr2" type="warning" @click="handleDownload('prod')">
                <Icon type="md-download" />导出数据
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
      <Card v-show="topStatus==='use'">
        <tables
          ref="tables1"
          v-model="tableData1"
          :columns="columns1"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-sort-change="onSortChange1"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="button1" type="button" @on-change="timeChange1">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div class="mark" v-show="mark1===true">
                <DatePicker
                  v-model="searchRowData1.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChange1"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData1.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChange1"
                />
              </div>               
              </Select>
              <Input
                v-model="searchRowData1.nickName"
                placeholder="用户名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
                <Input
                v-model="searchRowData1.phone"
                placeholder="手机号码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
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
              <Button class="search-btn mr2" type="warning" @click="handleDownload('user')">
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage1"
              :current="searchRowData1.page"
              show-sizer
              show-total
              @on-change="changePage2"
              @on-page-size-change="changePageSize2"
            ></Page>
          </Row>
        </div>
      </Card>
      <Card v-show="topStatus==='commission'">
        <tables
          ref="tables2"
          v-model="tableData2"
          :columns="columns2"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <b>历史总佣金:</b>
              <b style="color:red">{{hisAmount | fenToYuanDot2Filters}}</b>
            </Row>
          </div>
        </tables>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  shareProdStatistics,
  shareUserStatistics,
  commissionStatistics
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import { couponTypeConvert } from "@/libs/converStatus";
import { couponTypeEnum } from "@/libs/enumerate";
import searchMixin from "@/mixins/searchMixin.js";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from "@/libs/util";

const couponTemplateDetail = {};

const roleRowData = {
  page: 1,
  rows: 10,
  productName:"",
  beginDate:null,
  endDate:null,
  sidx: 'awardAmount',
  sort: 'desc'
};

const roleRowData1 = {
  page: 1,
  rows: 10,
  beginDate:null,
  endDate:null,
  nickName:"",
  phone:"",
  sidx: 'awardAmount',
  sort: 'desc'
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      topStatus: "pro",
      mark: false,
      mark1: false,
      num: 0,
      num1:0,
      button: "汇总",
      button1: "汇总",
      couponTypeEnum,
      totalPage1:0,
      totalPage: 0,
      hisAmount:"",
      columns: [
        {
          title: "商品名称",
          align: "center",
          key: "productName"
        },
        {
          title: "分享人数",
          align: "center",
          key: "shareCount",
          sortable: 'custom',
        },
        {
          title: "购买次数",
          align: "center",
          key: "buyCount",
          sortable: 'custom',
        },
        {
          title: "购买份数",
          align: "center",
          key: "buyCopies",
          sortable: 'custom',
          minWidth: 60
        },
        {
          title: "产生佣金",
          align: "center",
          key: "awardAmount",
          sortable: 'custom',
          minWidth: 60,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.awardAmount)}</div>;
          }
        },
      ],
      columns1: [
        {
          title: "用户昵称",
          align: "center",
          key: "nickName"
        },
        {
          title: "手机号码",
          align: "center",
          key: "phone",
        },
        {
          title: "分享人数",
          align: "center",
          sortable: 'custom',
          key: "shareCount"
        },
        {
          title: "分享购买次数",
          align: "center",
          sortable: 'custom',
          key: "buyCount",
          minWidth: 60
        },
        {
          title: "获得佣金",
          align: "center",
          sortable: 'custom',
          key: "awardAmount",
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.awardAmount)}</div>;
          },
          minWidth: 60
        },
      ],
      columns2: [
        {
          title: "待提现佣金",
          align: "center",
          key: "canOutAmount",
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.canOutAmount)}</div>;
          },
        },
        {
          title: "待入账佣金",
          align: "center",
          key: "waitAmount",
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.waitAmount)}</div>;
          },
        },
        {
          title: "已提现佣金",
          align: "center",
          key: "allOutAmount",
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allOutAmount)}</div>;
          },
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowData1: _.cloneDeep(roleRowData1),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      tableData1: [],
      tableData2: []
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowData1 = _.cloneDeep(roleRowData1);
    this.getTableData();
    this.getTableData1();
    this.getTableData2();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetSearchRowData1() {
      this.searchRowData1 = _.cloneDeep(roleRowData1);
      this.getTableData1();
    },
    getTableData(value) {
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
        this.searchRowData.beginDate = yesterday;
        this.searchRowData.endDate = yesterday;
      }
      if (this.button === "汇总" || value === "汇总") {
        this.searchRowData.beginDate = null;
        this.searchRowData.endDate = null;
      }
      if (value === "今日") {
        let date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = today;
        this.searchRowData.endDate = today;
      }
      if (value === "最近7天") {
        let date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = sevenDay;
        this.searchRowData.endDate = today;
      }
      if (value === "最近30天") {
        let date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = toMonth;
        this.searchRowData.endDate = today;
      }
      shareProdStatistics(this.searchRowData)
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
      if (this.button1 === "汇总" || value === "汇总") {
        this.searchRowData.beginDate = null;
        this.searchRowData.endDate = null;
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
      shareUserStatistics(this.searchRowData1)
        .then(res => {
          this.tableData1 = res.rows;
          this.totalPage1 = res.total;
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
    getTableData2() {
      this.tableData2=[];
      commissionStatistics()
        .then(res => {
          this.tableData2.push(res);
          this.hisAmount=res.hisAmount;
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
    handleSearch() {
      this.num++;
      this.searchRowData1.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    handRankType() {
      this.searchRowData1.page = 1;
      this.searchLoading = true;
      this.getTableData1();
    },
    handleSearch1() {
      this.num1++;
      this.searchRowData.page = 1;
      this.getTableData1();
    },
    handleClear1() {
      // 重置数据
      this.resetSearchRowData1();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch1();
      
    },
    assistDataChange(e) {
      let index = e.currentTarget.dataset.index;
      console.log(index)
      if (this.topStatus === index) {
        return;
      }
      if (index === "commission") {
          this.getTableData2();
      }
      this.button="汇总",
      this.button1="汇总",
      this.topStatus = index;
    },
    changePage2(page) {
      this.searchRowData1.page = page;
      this.getTableData1();
    },
    changePageSize2(pageSize) {
      this.searchRowData1.page = 1;
      this.searchRowData1.rows = pageSize;
      this.getTableData1();
    },
    timeChange(value) {
      if (value === "今日") {
        this.getTableData(value);
        this.mark = false;
      } else if (value === "昨日") {
        this.mark = false;
        this.getTableData(value);
      } else if (value === "汇总") {
        this.mark = false;
        this.getTableData(value);
      } else if (value === "最近7天") {
        this.mark = false;
        this.getTableData(value);
      } else if (value === "最近30天") {
        this.mark = false;
        this.getTableData(value);
      } else if (value === "自定义时间") {
        this.mark = true;
        this.searchRowData.beginDate = "";
        this.searchRowData.endDate = "";
      }
    },
    timeChange1(value) {
      if (value === "今日") {
        this.getTableData1(value);
        this.mark1 = false;
      } else if (value === "昨日") {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === "汇总") {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === "最近7天") {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === "最近30天") {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === "自定义时间") {
        this.mark1 = true;
        this.searchRowData1.beginDate = "";
        this.searchRowData1.endDate = "";
      }
    },
    startTimeChange(value, date) {
      this.button = "自定义时间";
      this.searchRowData.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = "自定义时间";
      this.searchRowData.endDate = value;
    },
    startTimeChange1(value, date) {
      this.button1 = "自定义时间";
      this.searchRowData1.beginDate = value;
    },
    endTimeChange1(value, date) {
      this.button1 = "自定义时间";
      this.searchRowData1.endDate = value;
    },
    handleClear() {
      this.button = "汇总";
      this.mark = false;
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    onSortChange(type) {
      this.searchRowData.sidx = type.key;
      this.searchRowData.sort = type.order;
      shareProdStatistics(this.searchRowData)
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
    onSortChange1(type) {
      this.searchRowData1.sidx = type.key;
      this.searchRowData1.sort = type.order;
      shareUserStatistics(this.searchRowData1)
        .then(res => {
          this.tableData1 = res.rows;
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
    // 导出数据
    handleDownload(name) {
        if (name==="prod") {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
        let pageSize = this.searchRowData.page;
        this.searchRowData.page = 1;
        shareProdStatistics(this.searchRowData).then(res => {
            const tableData = res.rows;
            // 恢复正常页数
            this.searchRowData.rows = 10;
            this.searchRowData.page = pageSize;
            // 表格数据导出字段翻译
            let _this = this;
          tableData.forEach(item => {
          item["awardAmount"] = (item["awardAmount"] / 100.0).toFixed(2);
           });
            const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
            this.$refs.tables.handleDownload({
            filename: `分享赚商品数据统计-${date}`,
            data: tableData
            });
        });
        }else{
        this.searchRowData1.rows = this.total > 5000 ? 5000 : this.total;
        let pageSize = this.searchRowData1.page;
        this.searchRowData1.page = 1;
        shareUserStatistics(this.searchRowData1).then(res => {
            const tableData = res.rows;
            // 恢复正常页数
            this.searchRowData1.rows = 10;
            this.searchRowData1.page = pageSize;
            // 表格数据导出字段翻译
            let _this = this;
          tableData.forEach(item => {
          item["awardAmount"] = (item["awardAmount"] / 100.0).toFixed(2);
           });
            const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
            this.$refs.tables1.handleDownload({
            filename: `分享赚用户数据统计-${date}`,
            data: tableData
            });
        });
        }
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
  width: 320px;
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
  padding: 0 10px;
}
</style>
