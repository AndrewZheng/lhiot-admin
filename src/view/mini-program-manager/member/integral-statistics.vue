<template>
  <div class="m-role">
    <div style="margin-bottom:30px">
      <Card>
        <h4>积分数据统计</h4>
        <tables
          v-model="tableData"
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
              <Button
                class="search-btn mr5"
                type="primary"
                @click="handleSearch"
                v-show="mark===true"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <!-- <Button class="search-btn mr2" type="warning" @click="handleDownload">
                <Icon type="md-download" />导出数据
              </Button>-->
            </Row>
            <div class="ml15 mt10">
              <i style="color:red">*</i> 默认展示当天的数据
            </div>
          </div>
        </tables>
      </Card>
      <Card>
        <tables
          v-model="tableData1"
          :columns="dataColumns1"
          :loading="loading"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        ></tables>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  userDataStatistics,
  dataStatistics,
  integralStatistics
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

// 第一个tables
const roleRowData = {
  beginDate: null,
  endDate: null
  //   dateGroup: false
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
      tableData: [],
      tableData1: [],
      dataColumns: [
        {
          title: "积分途径",
          key: "value",
          align: "center"
        },
        {
          title: "日常消费",
          key: "value1",
          align: "center",
          width: "150"
        },
        {
          title: "评价奖励",
          key: "value2",
          align: "center"
        },
        {
          title: "每日签到",
          align: "center",
          key: "value3"
        },
        {
          title: "月度消费",
          align: "center",
          key: "value4"
        },
        {
          title: "首次消费",
          align: "center",
          key: "value5"
        },
        {
          title: "月度充值",
          align: "center",
          key: "value6"
        },
        {
          title: "首充",
          align: "center",
          key: "value7"
        },
        {
          title: "完善资料",
          align: "center",
          key: "value8"
        },
        {
          title: "任务中心",
          align: "center",
          key: "value9"
        },
        {
          title: "汇总",
          align: "center",
          key: "value10"
        }
      ],
      dataColumns1: [
        {
          title: "消费途径",
          key: "value",
          align: "center"
        },
        {
          title: "实物兑换",
          key: "value1",
          align: "center",
          width: "150"
        },
        {
          title: "券兑换",
          key: "value2",
          align: "center"
        },
        {
          title: "汇总",
          align: "center",
          key: "value3"
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
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
      if (this.button === "今日") {
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
      integralStatistics(this.searchRowData)
        .then(res => {
          let data = res.getPointsList;
          let map = {
            value: "value",
            value1: "value",
            value2: "value",
            value3: "value",
            value4: "value",
            value5: "value",
            value6: "value",
            value7: "value",
            value8: "value",
            value9: "value",
            value10: "value"
          };
          let map1 = {
            value: "value",
            value1: "value",
            value2: "value",
            value3: "value",
            value4: "value",
            value5: "value",
            value6: "value",
            value7: "value",
            value8: "value",
            value9: "value",
            value10: "value"
          };
          map.value = "积分数量";
          map.value1 = data.countPoints[0];
          map.value2 = data.countPoints[1];
          map.value3 = data.countPoints[2];
          map.value4 = data.countPoints[3];
          map.value5 = data.countPoints[4];
          map.value6 = data.countPoints[5];
          map.value7 = data.countPoints[6];
          map.value8 = data.countPoints[7];
          map.value9 = data.countPoints[8];
          map.value10 = data.countPoints[9];
          map1.value = "参与人数";
          map1.value1 = data.countUser[0];
          map1.value2 = data.countUser[1];
          map1.value3 = data.countUser[2];
          map1.value4 = data.countUser[3];
          map1.value5 = data.countUser[4];
          map1.value6 = data.countUser[5];
          map1.value7 = data.countUser[6];
          map1.value8 = data.countUser[7];
          map1.value9 = data.countUser[8];
          map1.value10 = data.countUser[9];
          data.countPoints = map;
          data.countUser = map1;
          this.tableData.push(data.countPoints);
          this.tableData.push(data.countUser);
          let data1 = res.consumePointsList;
          let map2 = {
            value: "value",
            value1: "value",
            value2: "value",
            value3: "value"
          };
          let map3 = {
            value: "value",
            value1: "value",
            value2: "value",
            value3: "value"
          };
          map2.value = "消费数量";
          map2.value1 = data1.countPoints[0];
          map2.value2 = data1.countPoints[1];
          map2.value3 = data1.countPoints[2];
          map3.value = "消费人数";
          map3.value1 = data1.countUser[0];
          map3.value2 = data1.countUser[1];
          map3.value3 = data1.countUser[2];
          data1.countPoints = map2;
          data1.countUser = map3;
          this.tableData1.push(data1.countPoints);
          this.tableData1.push(data1.countUser);
          this.createLoading = false;
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
    timeChange(value) {
      if (value === "今日") {
        this.getTableData(value);
        this.tableData = [];
        this.tableData1 = [];
        this.mark = false;
      } else if (value === "昨日") {
        this.mark = false;
        this.tableData = [];
        this.tableData1 = [];
        this.getTableData(value);
      } else if (value === "最近7天") {
        this.mark = false;
        this.tableData = [];
        this.tableData1 = [];
        this.getTableData(value);
      } else if (value === "最近30天") {
        this.mark = false;
        this.tableData = [];
        this.tableData1 = [];
        this.getTableData(value);
      } else if (value === "自定义时间") {
        this.mark = true;
        this.searchRowData.beginDate = "";
        this.searchRowData.endDate = "";
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
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.tableData = [];
      this.tableData1 = [];
      this.getTableData();
    }
    // 导出数据
    // handleDownload() {
    //   const tableData = this.tableData;
    //   // 表格数据导出字段翻译
    //   let _this = this;
    //   const date = this.$moment(new Date()).format("YYYYMMDDHHmmss");
    //   handleDownload({
    //     filename: `积分数据统计-${date}`,
    //     data: tableData
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
</style>
