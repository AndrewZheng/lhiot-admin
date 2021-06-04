<template>
  <div class="m-report">
    <div style="margin-bottom: 30px; position: relative">
      <div class="tabChange">
        <b data-index="pro_detail" :class="topStatus=='pro_detail'? 'hot' : '' " @click="handleTabChange">明细统计</b>
        <b data-index="pro" :class="topStatus=='pro'? 'hot' : '' " @click="handleTabChange">商品统计</b>
      </div>

      <Card v-show="topStatus==='pro_detail'">
        <tables
          ref="detailTables"
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
              <RadioGroup
                v-model="searchRowDetailData.queryDays"
                type="button"
                class="mr5"
                @on-change="handleChange1"
              >
                <Radio label="0">
                  <span>今日</span>
                </Radio>
                <Radio label="1">
                  <span>昨日</span>
                </Radio>
                <Radio label="7">
                  <span>最近7天</span>
                </Radio>
                <Radio label="30">
                  <span>最近30天</span>
                </Radio>
                <Radio label="-1">
                  <span>自定义</span>
                </Radio>
              </RadioGroup>
              <div v-show="mark1 === true" class="mark">
                <DatePicker
                  :value="searchRowDetailData.startTime "
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="searchRowDetailData.startTime = $event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowDetailData.endTime "
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="searchRowDetailData.endTime = $event"
                />
              </div>
              <Input
                v-model="searchRowDetailData.goodsCode"
                placeholder="商品条码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowDetailData.goodsName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Row style="margin-top: 10px">
                <div class="ml15 mt10" style="float:left">
                  <span class="mr10">
                    该时间段内, 实际销售金额汇总:<i class="brand-red font-md ml5 mr5">{{ totalSales }}</i>元
                  </span>
                  <span>商品实际销售成本汇总:<i class="brand-red font-md ml5 mr5">{{ totalCost }}</i>元</span>
                  <span>毛利汇总:<i class="brand-red font-md ml5 mr5">{{ totalProfit }}</i>元</span>
                  <span>毛利率:<i class="brand-red font-md ml5 mr5">{{ profitRatio + '%' }}</i></span>
                </div>
                <div style="float: right">
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
                  <Button
                    class="search-btn mr2"
                    type="warning"
                    @click="handleDownload1"
                  >
                    <Icon type="md-download" />导出数据
                  </Button>
                </div>
              </Row>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="detailTotal"
              :current="searchRowDetailData.page"
              :page-size="searchRowDetailData.rows"
              show-sizer
              show-total
              @on-change="changePage1"
              @on-page-size-change="changePageSize1"
            ></Page>
          </Row>
        </div>
      </Card>

      <Card v-show="topStatus==='pro'">
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
              <RadioGroup
                v-model="searchRowData.queryDays"
                type="button"
                class="mr5"
                @on-change="handleChange"
              >
                <Radio label="0">
                  <span>今日</span>
                </Radio>
                <Radio label="1">
                  <span>昨日</span>
                </Radio>
                <Radio label="7">
                  <span>最近7天</span>
                </Radio>
                <Radio label="30">
                  <span>最近30天</span>
                </Radio>
                <Radio label="-1">
                  <span>自定义</span>
                </Radio>
              </RadioGroup>
              <div v-show="mark === true" class="mark">
                <DatePicker
                  :value="searchRowData.startTime "
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="searchRowData.startTime = $event"
                />
                <i>-</i>
                <DatePicker
                  :value="searchRowData.endTime "
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="searchRowData.endTime = $event"
                />
              </div>
              <Input
                v-model="searchRowData.goodsCode"
                placeholder="商品条码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowData.goodsName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Row style="margin-top: 10px">
                <!-- <div class="ml15 mt10" style="float: left">
                  <span
                    class="mr10"
                  >该时间段内, PV:<i style="color: red">{{ pv }}次</i></span>
                  <span>UV:<i style="color: red">{{ uv }}人</i></span>
                </div> -->
                <div style="float: right">
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
                </div>
              </Row>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="total"
              :current="searchRowData.page"
              :page-size="searchRowData.rows"
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

<script>
import Tables from '_c/tables';
import {
  getProDetailAnalysisDatas,
  getProAnalysisDatas
} from '@/api/wholesale';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { couponTypeConvert, lotteryStatusConvert } from '@/libs/converStatus';
import {
  couponTypeEnum,
  lotteryStatusEnum,
  prizeTypeEnum
} from '@/libs/enumerate';
import { prizeTypeConvert } from '../../../libs/converStatus';

const report = {
  code: '',
  name: '',
  profitRatio: 0,
  qty: 0,
  totalCost: 0,
  totalProfit: 0,
  totalSales: 0
};

const reportDetail = {
  cls: '',
  code: '',
  cost: '',
  name: '',
  note: '',
  num: 0,
  ocrDate: '',
  price: '',
  qty: 0,
  status: '',
  total: 0
};

const rowData = {
  goodsCode: null,
  goodsName: null,
  page: 1,
  rows: 20,
  queryDays: '0', // 1(昨日) 7(最近7天) 30(最近30天) -1(自定义)
  startTime: null,
  endTime: null
};

const rowDetailData = {
  goodsCode: null,
  goodsName: null,
  page: 1,
  rows: 20,
  queryDays: '0', // 1(昨日) 7(最近7天) 30(最近30天) -1(自定义)
  startTime: null,
  endTime: null
};

export default {
  name: 'Report',
  components: {
    Tables
  },
  mixins: [uploadMixin, tableMixin],
  props: {},
  data() {
    return {
      tableData1: [],
      mark: false,
      mark1: false,
      detailTotal: 0,
      topStatus: 'pro_detail',
      profitRatio: 0,
      totalCost: 0,
      totalProfit: 0,
      totalSales: 0,
      columns1: [
        {
          title: '商品条码',
          align: 'center',
          key: 'code',
          minWidth: 100
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'name',
          minWidth: 120
        },
        {
          title: '实际销售成本（含税）',
          align: 'center',
          key: 'cost',
          minWidth: 150
        },
        {
          title: '毛利',
          align: 'center',
          key: 'profit',
          minWidth: 100
        },
        {
          title: '毛利率（%）',
          align: 'center',
          key: 'profitRatio',
          minWidth: 100
        },
        {
          title: '实际销售金额（含税）',
          align: 'center',
          key: 'total',
          minWidth: 150
        },
        {
          title: '单据类型',
          align: 'center',
          key: 'cls',
          minWidth: 120
        },
        {
          title: '海鼎单号',
          align: 'center',
          key: 'num',
          minWidth: 140
        },
        {
          title: '单据状态',
          align: 'center',
          key: 'status',
          minWidth: 120
        },
        {
          title: '发生日期',
          align: 'center',
          key: 'ocrDate',
          width: 200
        }
      ],
      columns: [
        {
          title: '商品条码',
          align: 'center',
          key: 'code',
          minWidth: 100
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'name',
          minWidth: 120
        },
        {
          title: '实际销售成本',
          align: 'center',
          key: 'totalCost',
          minWidth: 120
        },
        {
          title: '毛利',
          align: 'center',
          key: 'totalProfit',
          minWidth: 120
        },
        {
          title: '毛利率（%）',
          align: 'center',
          key: 'profitRatio',
          minWidth: 120
        },
        {
          title: '实际销售金额',
          align: 'center',
          key: 'totalSales',
          minWidth: 120
        }
      ],
      report: _.cloneDeep(report),
      searchRowData: _.cloneDeep(rowData),
      searchRowDetailData: _.cloneDeep(rowDetailData),
      reportDetail: _.cloneDeep(reportDetail)
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getDetailTableData();
  },
  updated() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(rowData);
      this.getTableData();
    },
    resetSearchRowData1() {
      this.searchRowDetailData = _.cloneDeep(rowDetailData);
      this.getDetailTableData();
    },
    getTableData() {
      this.loading = true;
      getProAnalysisDatas(this.searchRowData)
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
    getDetailTableData() {
      this.loading = true;
      getProDetailAnalysisDatas(this.searchRowDetailData)
        .then((res) => {
          this.tableData1 = res.detailModelResult.rows;
          this.detailTotal = res.detailModelResult.total;
          this.profitRatio = res.profitRatio;
          this.totalCost = res.totalCost;
          this.totalProfit = res.totalProfit;
          this.totalSales = res.totalSales;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleChange(item) {
      this.mark = false;
      this.searchRowData.startTime = null;
      this.searchRowData.endTime = null;
      this.searchRowData.queryDays = item;
      if (item === '-1') {
        this.mark = true;
        return;
      }
      this.getTableData();
    },
    handleChange1(item) {
      this.mark1 = false;
      this.searchRowDetailData.startTime = null;
      this.searchRowDetailData.endTime = null;
      this.searchRowDetailData.queryDays = item;
      if (item === '-1') {
        this.mark1 = true;
        return;
      }
      this.getDetailTableData();
    },
    handleClear() {
      this.mark = false;
      this.resetSearchRowData();
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    handleClear1() {
      this.mark = false;
      this.resetSearchRowData1();
      this.clearSearchLoading = true;
      this.handleSearch1();
    },
    handleTabChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) return;
      if (index === 'pro') {
        this.handleSearch();
      } else {
        this.handleSearch1();
      }
      this.topStatus = index;
    },
    handleSearch1() {
      this.searchRowDetailData.page = 1;
      this.searchLoading = true;
      this.getDetailTableData();
    },
    changePage1(page) {
      this.searchRowDetailData.page = page;
      this.getDetailTableData();
    },
    changePageSize1(pageSize) {
      this.searchRowDetailData.page = 1;
      this.searchRowDetailData.rows = pageSize;
      this.getDetailTableData();
    },
    // 导出数据
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getProAnalysisDatas(this.searchRowData).then((res) => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        // tableData.forEach((item) => {
        // });
        const { startTime, endTime } = tableData[0];
        const date = this.$moment(new Date()).format('YYYYMMDD');
        let dateStr = '';
        // 导出今日的数据使用当前时间戳
        if (this.searchRowData.queryDays === '0') {
          dateStr = date;
        } else {
          dateStr = startTime + 'T' + endTime;
        }
        this.$refs.tables.handleDownload({
          filename: `商品数据统计-${dateStr}`,
          data: tableData
        });
      });
    },
    handleDownload1() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowDetailData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowDetailData.page;
      this.searchRowDetailData.page = 1;
      getProDetailAnalysisDatas(this.searchRowDetailData).then((res) => {
        const tableData = res.detailModelResult.rows;
        // 恢复正常页数
        this.searchRowDetailData.rows = 20;
        this.searchRowDetailData.page = pageSize;
        // tableData.forEach((item) => {
        // });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `商品明细数据统计-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang='scss'>
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
