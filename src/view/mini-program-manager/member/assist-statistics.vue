<template>
  <div class="m-role">
    <Card>
      <h4>助力抢爆品活动数据埋点统计</h4>
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
            <RadioGroup
              v-model="button"
              type="button"
              style="float:left;margin-right:5px"
              @on-change="timeChange"
            >
              <Radio label="昨日"></Radio>
              <Radio label="自定义时间"></Radio>
            </RadioGroup>
            <div v-show="mark===true" style="float:left">
              <DatePicker
                v-model="searchRowData.beginDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择开始时间"
                class="search-input"
                style="width: 150px"
                @on-change="startTimeChange"
              />
              <i>-</i>
              <DatePicker
                v-model="searchRowData.endDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择结束时间"
                class="search-input mr5"
                style="width: 150px"
                @on-change="endTimeChange"
              />
            </div>
            <div class="dateGroup" style="float:left">
              是否按天展示数据
              <input ref="status" type="checkbox" @click="dateGroupChange">
            </div>
            <Button
              :loading="searchLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <!-- <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>-->
          </Row>
          <div class="ml15 mt10">
            <i style="color:red">*</i> 默认展示昨天的数据
          </div>
        </div>
      </tables>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { assistStatistics } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';

const dataStatisticsDetail = {
  beginDate: '',
  buyNum: '',
  endDate: '',
  id: '',
  pvNum: '',
  totalDate: '',
  uvNum: ''
};

const roleRowData = {
  beginDate: null,
  endDate: null,
  dateGroup: false,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      mark: false,
      button: '昨日',
      columns: [
        {
          title: '日期',
          key: 'totalDate',
          align: 'center',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.totalDate != null) {
              return <div>{row.totalDate}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '助力抢爆品活动页面访问量',
          key: 'pvNum',
          align: 'center'
        },
        {
          title: '助力抢爆品用户访问量',
          key: 'uvNum',
          align: 'center'
        },
        {
          title: '分享链接进入新用户数量',
          align: 'center',
          key: 'newUserNum'
        },
        {
          title: '没有触发我要抢按钮的数量',
          align: 'center',
          key: 'notButtonNum'
        },
        {
          title: '拉新用户购买用户数量',
          align: 'center',
          key: 'newUserNum'
        },
        {
          title: '开始日期',
          key: 'beginDate',
          width: 120,
          align: 'center'
        },
        {
          title: '结束日期',
          key: 'endDate',
          width: 120,
          align: 'center'
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      dataStatisticsDetail: _.cloneDeep(dataStatisticsDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getTableData(value) {
      const yesterday = this.getDateByParam(-1);
      if (this.button === '昨日') {
        this.searchRowData.beginDate = yesterday;
        this.searchRowData.endDate = yesterday;
      }
      assistStatistics(this.searchRowData)
        .then(res => {
          this.tableData = res;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    timeChange(value) {
      if (value === '昨日') {
        this.mark = false;
        this.inviteData = [];
        this.getTableData(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData.beginDate = '';
        this.searchRowData.endDate = '';
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.dataStatisticsDetail.beginDate = value;
      this.searchRowData.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.dataStatisticsDetail.endDate = value;
      this.searchRowData.endDate = value;
    },
    dateGroupChange() {
      this.searchRowData.dateGroup = !this.searchRowData.dateGroup;
    },
    handleClear() {
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.$refs.status.checked = false;
      this.clearSearchLoading = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.dateGroup {
  display: inline-block;
  width: 150px;
  height: 32px;
  border: 1px solid #dcdee2;
  line-height: 22px;
  padding: 4px 7px;
  font-size: 12px;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  position: relative;

  input {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 15px;
    bottom: 5px;
  }
}
</style>
