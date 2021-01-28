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
              <div v-show="mark===true" class="mark">
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
                v-show="mark===true"
                class="search-btn mr5"
                type="primary"
                @click="handleSearch1"
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
import Tables from '_c/tables';
import _ from 'lodash';
import { systemDataStatistics } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { percent } from '@/libs/util';

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
  mixins: [tableMixin],
  data() {
    return {
      mark: false,
      button: '今日',
      inviteData: [],
      dataColumns: [
        {
          title: '新用户数量',
          key: 'newUser',
          align: 'center'
        },
        {
          title: '新用户完成首单数量',
          key: 'newUserOrderNum',
          align: 'center'
        },
        {
          title: '新用户复购数量',
          align: 'center',
          key: 'newUserReOrderNum'
        },
        {
          title: '新用户转化率',
          key: 'newUserOrderNum',
          align: 'center',
          render(h, params) {
            if (isNaN(params.row.newUserOrderNum / params.row.newUser)) {
              return h('div', '0%');
            } else {
              return h(
                'div',
                percent(params.row.newUserOrderNum / params.row.newUser)
              );
            }
          }
        },
        {
          title: '新用复购率',
          align: 'center',
          key: 'newUserReOrderNum',
          render(h, params) {
            if (isNaN(params.row.newUserReOrderNum / params.row.newUser)) {
              return h('div', '0%');
            } else {
              return h(
                'div',
                percent(params.row.newUserReOrderNum / params.row.newUser)
              );
            }
          }
        },
        {
          title: '开始日期',
          key: 'beginDate',
          align: 'center'
        },
        {
          title: '结束日期',
          key: 'endDate',
          align: 'center'
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
      const yesterday1 = this.getDateByParam(-1);
      if (this.button === '今日') {
        this.searchRowData1.beginDate = yesterday1;
        this.searchRowData1.endDate = yesterday1;
      }
      systemDataStatistics(this.searchRowData1)
        .then(res => {
          this.inviteData.push(res);
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSearch1() {
      this.inviteData = [];
      this.getTableData1();
    },
    timeChange(value) {
      if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData1.beginDate = '';
        this.searchRowData1.endDate = '';
      } else {
        this.mark = false;
        this.inviteData = [];
        this.getTableData1(value);
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData1.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData1.endDate = value;
    }
  }
};
</script>
<style lang="scss" scoped>
.mark {
  display: inline-block;
}
</style>
