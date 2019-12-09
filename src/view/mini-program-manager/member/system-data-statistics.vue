<template>
  <div class="m-role">
    <div style="margin-bottom:30px">
      <Card>
        <h4>系统数据统计</h4>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import { systemDataStatistics } from "@/api/mini-program";
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

// 第一个tables
const roleRowData1 = {
  beginDate: null,
  endDate: null
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      mark: false,
      button: "今日",
      inviteData: [],
      dataColumns: [
        {
          title: "新用户数量",
          key: "newUser",
          align: "center"
        },
        {
          title: "新用户完成首单数量",
          key: "newUserOrderNum",
          align: "center"
        },
        {
          title: "新用户复购数量",
          align: "center",
          key: "newUserReOrderNum"
        },
        {
          title: "开始日期",
          key: "beginDate",
          align: "center"
        },
        {
          title: "结束日期",
          key: "endDate",
          align: "center"
        }
      ],
      searchRowData1: _.cloneDeep(roleRowData1),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData1 = _.cloneDeep(roleRowData1);
    this.getTableData1();
  },
  created() {},
  methods: {
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
      systemDataStatistics(this.searchRowData1)
        .then(res => {
          this.inviteData.push(res);
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
    handleSearch1() {
      //   this.searchLoading = true;
      this.inviteData = [];
      this.getTableData1();
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
      this.searchLoading = true;
      this.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
</style>
