<template>
  <div class="m-role">
    <div style="margin-bottom: 30px">
      <Card>
        <h4>邀请有礼活动基础数据分析</h4>
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
              <RadioGroup
                v-model="button"
                type="button"
                @on-change="timeChange"
              >
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="mark === true" class="mark">
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
                v-show="mark === true"
                class="search-btn mr5"
                type="primary"
                @click="handleSearch1"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
            </Row>
            <div class="ml15 mt10">
              <i style="color: red">*</i> 默认展示当天的数据
            </div>
          </div>
        </tables>
      </Card>
    </div>
    <div>
      <Card>
        <h4>邀请有礼活动用户数据统计</h4>
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
                style="padding-right: 5px; width: 120px"
                clearable
              >
                <Option
                  v-for="(item, index) in rankType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px; width: 120px"
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
              <Button
                class="search-btn mr2"
                type="warning"
                @click="handleDownload"
              >
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
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
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  userDataStatistics,
  basicsDataStatistics
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import {
  fenToYuanDot2
} from '@/libs/util';

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
  nickName: '',
  phone: '',
  page: 1,
  rows: 10,
  sidx: 'all_amount',
  sort: 'desc'
};

const roleRowData1 = {
  beginDate: null,
  endDate: null
  //   dateGroup: false
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      mark: false,
      button: '今日',
      inviteData: [],
      rankType: [
        {
          label: '奖励总金额',
          value: 'all_amount'
        },
        {
          label: '邀请人数',
          value: 'invite_count'
        },
        {
          label: '待入账金额',
          value: 'wait_amount'
        },
        {
          label: '可提现金额',
          value: 'can_out_amount'
        },
        {
          label: '已提现金额',
          value: 'all_out_amount'
        }
      ],
      columns: [
        {
          title: '用户昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '手机号',
          align: 'center',
          key: 'phone',
          width: 180
        },
        {
          title: '奖励总金额',
          align: 'center',
          key: 'allAmount',
          width: 150,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allAmount)}</div>;
          }
        },
        {
          title: '邀请人数',
          align: 'center',
          key: 'inviteCount',
          width: 150
        },
        {
          title: '待入账金额',
          align: 'center',
          width: 150,
          key: 'waitAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.waitAmount)}</div>;
          }
        },
        {
          title: '可提现金额',
          align: 'center',
          key: 'canOutAmount',
          width: 150,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.canOutAmount)}</div>;
          }
        },
        {
          title: '已提现金额',
          align: 'center',
          width: 150,
          key: 'allOutAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allOutAmount)}</div>;
          }
        }
      ],
      dataColumns: [
        {
          title: '奖励总金额',
          key: 'allAmount',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allAmount)}</div>;
          }
        },
        {
          title: '已提现总金额',
          key: 'outAmount',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.outAmount)}</div>;
          }
        },
        {
          title: '可提现总金额',
          key: 'canOutAmount',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.canOutAmount)}</div>;
          }
        },
        {
          title: '待入账总金额',
          align: 'center',
          key: 'waitAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.waitAmount)}</div>;
          }
        },
        {
          title: '参与总人数',
          align: 'center',
          key: 'joinUser'
        },
        {
          title: '邀请总人数',
          align: 'center',
          key: 'inviteUser'
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowData1: _.cloneDeep(roleRowData1),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail)
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowData1 = _.cloneDeep(roleRowData1);
    this.getTableData();
    this.getTableData1();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      userDataStatistics(this.searchRowData)
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
    getTableData1(value) {
      const today = this.getDateByParam(0);
      if (value === '昨日') {
        const yesterday = this.getDateByParam(-1);
        this.searchRowData1.beginDate = yesterday;
        this.searchRowData1.endDate = yesterday;
      } else if (value === '今日') {
        this.searchRowData1.beginDate = today;
        this.searchRowData1.endDate = today;
      } else if (value === '最近7天') {
        const sevenDay = this.getDateByParam(-7);
        this.searchRowData1.beginDate = sevenDay;
        this.searchRowData1.endDate = today;
      } else if (value === '最近30天') {
        const toMonth = this.getDateByParam(-30);
        this.searchRowData1.beginDate = toMonth;
        this.searchRowData1.endDate = today;
      }
      this.loading = true;
      basicsDataStatistics(this.searchRowData1)
        .then((res) => {
          this.inviteData.push(res);
        })
        .finally(() => {
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
      if (value === '今日') {
        this.getTableData1(value);
        this.inviteData = [];
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === '最近7天') {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === '最近30天') {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData1.beginDate = '';
        this.searchRowData1.endDate = '';
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData1.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData1.endDate = value;
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      userDataStatistics(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          // const obj = _this.storeList.find(x => item.storeId === x.storeId);
          item['nickName'] = item['nickName'] + '';
          item['phone'] = item['phone'] + '';
          item['allAmount'] = (item['allAmount'] / 100.0).toFixed(2);
          item['inviteCount'] = item['inviteCount'] + '';
          item['waitAmount'] = (item['waitAmount'] / 100.0).toFixed(2);
          item['canOutAmount'] = (item['canOutAmount'] / 100.0).toFixed(2);
          item['allOutAmount'] = (item['allOutAmount'] / 100.0).toFixed(2);
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `邀请有礼数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
</style>
