<template>
  <div class="m-role">
    <div style="margin-bottom:30px;position: relative;">
      <div class="tabChange">
        <b
          data-index="issue"
          :class=" topStatus=='issue' ? 'hot' : '' "
          @click="assistDataChange"
        >发券统计</b>
        <b data-index="use" :class=" topStatus=='use' ? 'hot' : '' " @click="assistDataChange">用券统计</b>
      </div>
      <Card v-show="topStatus==='issue'">
        <tables
          ref="tables"
          v-model="tableData"
          :columns="columns"
          :loading="loading"
          :search-area-column="24"
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
                  :value="searchRowData.startDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="searchRowData.startDate=$event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowData.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="searchRowData.endDate=$event"
                />
              </div>
              <Select
                v-model="searchRowData.source"
                placeholder="发券平台"
                style="width: 90px"
              >
                <Option
                  v-for="(item,index) in sourceType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchRowData.couponWay"
                placeholder="发券途径"
                style="width: 150px"
              >
                <Option
                  v-for="(item,index) in couponWayList"
                  :key="index"
                  :value="item.key"
                  class="ptb2-5"
                >{{ item.value }}</Option>
              </Select>
              <Select
                v-model="searchRowData.couponType"
                placeholder="券类型"
                style="padding-right: 5px;width: 100px"
                clearable
              >
                <Option
                  v-for="(item,index) in couponTypeList"
                  :key="index"
                  :value="item.key"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100px"
                >{{ item.value }}</Option>
              </Select>
              <Input
                v-model="searchRowData.couponName"
                placeholder="优惠券名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
            </Row>
            <Row style="margin-top:10px;">
              <div class="ml15 mt10" style="float:left">
                发券总数<i style="color:red">{{ totalNum }}</i> 张
              </div>
              <div style="float:right">
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
                <Button class="search-btn mr2" type="warning" @click="handleDownload('issue')">
                  <Icon type="md-download" />导出数据
                </Button>
              </div>
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
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="button1" type="button" @on-change="timeChange1">
                <Radio label="今日" class="mt5"></Radio>
                <Radio label="昨日" class="mt5"></Radio>
                <Radio label="最近7天" class="mt5"></Radio>
                <Radio label="最近30天" class="mt5"></Radio>
                <Radio label="自定义时间" class="mt5"></Radio>
              </RadioGroup>
              <div v-show="mark1===true" class="mark">
                <DatePicker
                  :value="searchRowData1.startDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  style="width: 120px;"
                  @on-change="searchRowData1.startDate=$event"
                />
                <i class="">-</i>
                <DatePicker
                  :value="searchRowData1.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="mr2 "
                  style="width: 120px"
                  @on-change="searchRowData1.endDate=$event"
                />
              </div>
              <Select
                v-model="searchRowData1.source"
                placeholder="发券平台"
                style="width: 90px"
                class="mt5"
              >
                <Option
                  v-for="(item,index) in sourceType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchRowData1.storeId"
                placeholder="用券门店"
                style="width: 160px"
                class="mt5"
                :clearable="true"
                :filterable="true"
              >
                <Option
                  v-for="(item,index) in storeList"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              </Select>
              <Select
                v-model="searchRowData1.couponWay"
                placeholder="发券途径"
                style="width: 150px"
                class="mt5"
              >
                <Option
                  v-for="(item,index) in couponWayList"
                  :key="index"
                  :value="item.key"
                  class="ptb2-5"
                >{{ item.value }}</Option>
              </Select>
              <Select
                v-model="searchRowData1.couponType"
                placeholder="券类型"
                style="width: 90px"
                class="mt5"
                clearable
              >
                <Option
                  v-for="(item,index) in couponTypeList"
                  :key="index"
                  :value="item.key"
                  class="ptb2-5"
                  style="width: 100px;"
                >{{ item.value }}</Option>
              </Select>
              <Input
                v-model="searchRowData1.couponName"
                placeholder="优惠券名称"
                class="search-input mt5"
                style="width: 120px"
                clearable
              ></Input>
            </Row>
            <Row style="margin-top:10px">
              <div class="ml15 mt10" style="float:left">
                用券总数<i style="color:red">{{ totalNum1 }}</i> 张；总抵扣金额<i style="color:red">{{ totalCouponAmount }}</i> 元；实收总金额<i style="color:red">{{ totalAmountPayable }}</i> 元
              </div>
              <div style="float:right">
                <Button
                  :loading="searchLoading"
                  class="search-btn mr2"
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
                <Button class="search-btn mr2" type="warning" @click="handleDownload('use')">
                  <Icon type="md-download" />导出
                </Button>
              </div>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPage"
              :current="searchRowData1.page"
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
import Tables from '_c/tables';
import {
  getSendCouponPages,
  getComboBoxs,
  getUseCouponPages,
  getStorePages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { couponTypeConvert } from '@/libs/converStatus';
import { couponTypeEnum } from '@/libs/enumerate';

const couponTemplateDetail = {};

const roleRowData = {
  source: null,
  couponWay: null,
  page: 1,
  rows: 10,
  couponType: null,
  couponName: null,
  startDate: null,
  endDate: null
};

const roleRowData1 = {
  source: null,
  page: 1,
  rows: 10,
  couponWay: null,
  storeName: null,
  couponType: null,
  couponName: null,
  startDate: null,
  endDate: null
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      storeList: [],
      tableData1: [],
      couponTypeList: [],
      couponWayList: [],
      mark: false,
      mark1: false,
      num: 0,
      num1: 0,
      totalNum: 0,
      totalNum1: 0,
      totalPage: 0,
      topStatus: 'issue',
      button: '今日',
      button1: '今日',
      totalCouponAmount: '0.00',
      totalAmountPayable: '0.00',
      couponTypeEnum,
      sourceType: [
        { label: '海鼎券', value: 'HD' },
        { label: '系统券', value: 'SMALL' }
      ],
      columns: [
        {
          title: '发券日期',
          align: 'center',
          key: 'receiveTime',
          width: 130
        },
        {
          title: '发券平台',
          align: 'center',
          key: 'source',
          width: 120,
          render(h, params, vm) {
            const { row } = params;
            if (row.source === 'SMALL') {
              return <tag color='orange'>{'小程序'}</tag>;
            } else {
              return <tag color='cyan'>{'海鼎'}</tag>;
            }
          }
        },
        {
          title: '发券途径',
          align: 'center',
          key: 'couponWay',
          width: 180
        },
        {
          title: '券名称',
          align: 'center',
          key: 'couponName'
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName'
        },
        {
          title: '券类型',
          align: 'center',
          key: 'couponType',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return (
                <div>
                  <tag color='magenta'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return (
                <div>
                  <tag color='orange'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'CASH_COUPON') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'FREIGHT_COUPON') {
              return (
                <div>
                  <tag color='blue'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          }
        },
        {
          title: '发券数量',
          align: 'center',
          key: 'countNum',
          width: 120
        },
        {
          title: '发券人数',
          align: 'center',
          key: 'countUser',
          width: 120
        }
      ],
      columns1: [
        {
          title: '用券日期',
          align: 'center',
          key: 'useTime',
          width: 120
        },
        {
          title: '发券平台',
          align: 'center',
          key: 'source',
          width: 150,
          render(h, params, vm) {
            const { row } = params;
            if (row.source === 'SMALL') {
              return <tag color='orange'>{'小程序'}</tag>;
            } else {
              return <tag color='cyan'>{'海鼎'}</tag>;
            }
          }
        },
        {
          title: '发券途径',
          align: 'center',
          key: 'couponWay',
          width: 160
        },
        {
          title: '券名称',
          align: 'center',
          key: 'couponName'
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName'
        },
        {
          title: '券类型',
          align: 'center',
          key: 'couponType',
          width: 140,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return (
                <div>
                  <tag color='magenta'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return (
                <div>
                  <tag color='orange'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'CASH_COUPON') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'FREIGHT_COUPON') {
              return (
                <div>
                  <tag color='blue'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          }
        },
        {
          title: '用券门店',
          align: 'center',
          key: 'storeName',
          width: 180
        },
        {
          title: '抵扣金额',
          align: 'center',
          key: 'couponAmount',
          width: 120
        },
        {
          title: '实收金额',
          align: 'center',
          width: 120,
          key: 'amountPayable'
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
    this.getComboBoxs();
    this.getStore();
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
      const today = this.getDateByParam(0);
      if (value === '昨日') {
        const yesterday = this.getDateByParam(-1);
        this.searchRowData.startDate = yesterday;
        this.searchRowData.endDate = yesterday;
      } else if (value === '今日' || this.button === '今日') {
        this.searchRowData.startDate = today;
        this.searchRowData.endDate = today;
      } else if (value === '最近7天') {
        const sevenDay = this.getDateByParam(-7);
        this.searchRowData.startDate = sevenDay;
        this.searchRowData.endDate = today;
      } else if (value === '最近30天') {
        const toMonth = this.getDateByParam(-30);
        this.searchRowData.startDate = toMonth;
        this.searchRowData.endDate = today;
      }
      getSendCouponPages(this.searchRowData)
        .then((res) => {
          this.totalNum = res.totalNum;
          this.tableData = res.pagingResultDto.rows;
          this.total = res.pagingResultDto.total;
          if (this.num < 2) {
            this.handleSearch();
          }
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
        this.searchRowData1.startDate = yesterday;
        this.searchRowData1.endDate = yesterday;
      } else if (value === '今日' || this.button1 === '今日') {
        this.searchRowData1.startDate = today;
        this.searchRowData1.endDate = today;
      } else if (value === '最近7天') {
        const sevenDay = this.getDateByParam(-7);
        this.searchRowData1.startDate = sevenDay;
        this.searchRowData1.endDate = today;
      } else if (value === '最近30天') {
        const toMonth = this.getDateByParam(-30);
        this.searchRowData1.startDate = toMonth;
        this.searchRowData1.endDate = today;
      }
      getUseCouponPages(this.searchRowData1)
        .then((res) => {
          this.totalNum1 = res.totalNum;
          this.totalCouponAmount = res.totalCouponAmount;
          this.totalAmountPayable = res.totalAmountPayable;
          this.tableData1 = res.pagingResultDto.rows;
          this.totalPage = res.pagingResultDto.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getComboBoxs() {
      getComboBoxs()
        .then((res) => {
          this.couponTypeList = res.couponTypeList;
          this.couponWayList = res.couponWayList;
        })
    },
    getStore() {
      getStorePages({ page: 1, rows: -1 })
        .then((res) => {
          res.rows.forEach((value) => {
            const map = { label: 'label', value: 'value' };
            map.value = value.storeId;
            map.label = value.storeName;
            this.storeList.push(map);
          });
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
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      if (index === 'use') {
        this.handleSearch1();
      }
      (this.button = '今日'),
      (this.button1 = '今日'),
      (this.totalNum = 0),
      (this.totalNum1 = 0),
      (this.totalCouponAmount = '0.00'),
      (this.totalAmountPayable = '0.00'),
      (this.topStatus = index);
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
      if (value === '今日') {
        this.getTableData(value);
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.getTableData(value);
      } else if (value === '最近7天') {
        this.mark = false;
        this.getTableData(value);
      } else if (value === '最近30天') {
        this.mark = false;
        this.getTableData(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.searchRowData.startDate = '';
        this.searchRowData.endDate = '';
      }
    },
    timeChange1(value) {
      if (value === '今日') {
        this.getTableData1(value);
        this.mark1 = false;
      } else if (value === '昨日') {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === '最近7天') {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === '最近30天') {
        this.mark1 = false;
        this.getTableData1(value);
      } else if (value === '自定义时间') {
        this.mark1 = true;
        this.searchRowData1.startDate = '';
        this.searchRowData1.endDate = '';
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.startDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.endDate = value;
    },
    startTimeChange1(value, date) {
      this.button1 = '自定义时间';
      this.searchRowData1.startDate = value;
    },
    endTimeChange1(value, date) {
      this.button1 = '自定义时间';
      this.searchRowData1.endDate = value;
    },
    handleClear() {
      this.button = '今日';
      this.mark = false;
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    // 导出数据
    handleDownload(name) {
      if (name === 'issue') {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
        const pageSize = this.searchRowData.page;
        this.searchRowData.page = 1;
        getSendCouponPages(this.searchRowData).then((res) => {
          const tableData = res.pagingResultDto.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item['couponType'] = couponTypeConvert(item['couponType']).label;
            if (item['source'] === 'SMALL') {
              item['source'] = '小程序';
            } else {
              item['source'] = '海鼎';
            }
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tables.handleDownload({
            filename: `发券数据统计-${date}`,
            data: tableData
          });
        });
      } else {
        this.searchRowData1.rows =
          this.totalPage > 5000 ? 5000 : this.totalPage;
        const pageSize = this.searchRowData1.page;
        this.searchRowData1.page = 1;
        getUseCouponPages(this.searchRowData1).then((res) => {
          const tableData1 = res.pagingResultDto.rows;
          // 恢复正常页数
          this.searchRowData1.rows = 10;
          this.searchRowData1.page = pageSize;
          // 表格数据导出字段翻译
          tableData1.forEach((item) => {
            item['couponType'] = couponTypeConvert(item['couponType']).label;
            if (item['source'] === 'SMALL') {
              item['source'] = '小程序';
            } else {
              item['source'] = '海鼎';
            }
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tables1.handleDownload({
            filename: `用券数据统计-${date}`,
            data: tableData1
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
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
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
