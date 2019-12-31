<template>
  <div class="m-role">
    <Row :gutter="20" class="mb10">
      <i-col
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        span="4"
        style="height: 120px;"
      >
        <infor-card :color="infor.color" :icon="infor.icon" :icon-size="36" shadow>
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>

    <Card>
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
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <RadioGroup v-model="searchRowData.queryDays" type="button" class="mr5" @on-change="handleChange">
            <Radio label="0"><span>今日</span></Radio>
            <Radio label="1"><span>昨日</span></Radio>
            <Radio label="7"><span>最近7天</span></Radio>
            <Radio label="30"><span>最近30天</span></Radio>
            <Radio label="-1"><span>自定义</span></Radio>
          </RadioGroup>
          <DatePicker
            v-model="searchRowData.startTime"
            :disabled="searchRowData.queryDays!='-1'"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="大于等于"
            class="mr5"
            style="width: 150px"
            @on-change="startTimeChange"
          />
          <i>-</i>
          <DatePicker
            v-model="searchRowData.endTime"
            :disabled="searchRowData.queryDays!='-1'"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="小于等于"
            class="mr5"
            style="width: 150px"
            @on-change="endTimeChange"
          />
          <Input
            v-model="searchRowData.goodsName"
            placeholder="商品名称"
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
          <!-- <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button> -->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
    <Row style="margin-top: 20px;">
      <Card shadow>
        <img
          src="http://resource.shuiguoshule.com.cn/product_image/2019-07-31/sgv7qBdSKI7ZrH5JU2kB.jpg"
          style="height: 300px;width:100%;"
        >
      </Card>
    </Row>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import InforCard from '_c/info-card';
import CountTo from '_c/count-to';

import { getAnalysisDatas } from '@/api/wholesale';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';

const orderGoodData = {
  goodsName: '',
  goodsStandardId: '',
  sumFee: '',
  sumQuanity: '',
  unitName: ''
};

const roleRowData = {
  goodsName: '',
  queryDays: '0', // 1(昨日) 7(最近7天) 30(最近30天) -1(自定义)
  startTime: null,
  endTime: null,
  page: 1,
  rows: 10
};

const orderData = {
  avgOrderPrice: '', // 订单均价
  sumDeliveryFee: '', // 订单配送费总金额
  sumOrderFee: '', // 订单总金额
  sumPayableFee: '', // 订单应付总金额
  totalCount: '' // 订单总数
}

const orderColumns = [
  {
    title: '订单总数',
    align: 'center',
    key: 'totalCount',
    minWidth: 100
  },
  {
    title: '配送费总额',
    align: 'center',
    key: 'sumDeliveryFee',
    sortable: true,
    minWidth: 80
  },
  {
    title: '订单总额',
    align: 'center',
    key: 'sumOrderFee',
    sortable: true,
    minWidth: 80
  },
  {
    title: '订单均价',
    align: 'center',
    key: 'avgOrderPrice',
    sortable: true,
    minWidth: 80
  }
]

export default {
  components: {
    Tables,
    InforCard,
    CountTo
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      inforCardData: [
        {
          title: '订单总数',
          icon: 'md-stats',
          count: 0,
          color: '#f95157'
        },
        {
          title: '配送费总额',
          icon: 'logo-yen',
          count: 0,
          color: '#19be6b'
        },
        {
          title: '订单总额',
          icon: 'logo-yen',
          count: 0,
          color: '#ff9900'
        },
        {
          title: '订单均价',
          icon: 'logo-yen',
          count: 0,
          color: '#9A66E4'
        }
      ],
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      orderData: _.cloneDeep(orderData),
      orderGoodData: _.cloneDeep(orderGoodData),
      orderColumns,
      columns: [
        {
          title: '商品名称',
          align: 'center',
          key: 'goodsName',
          minWidth: 100
        },
        {
          title: '销售数量',
          align: 'center',
          key: 'sumQuanity',
          sortable: true,
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{ row.sumQuanity + row.unitName }</div>;
          }
        },
        {
          title: '销售金额',
          align: 'center',
          key: 'sumFee',
          sortable: true,
          minWidth: 80
        }
      ]
    };
  },
  computed: {},
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.orderTableData = [];
      getAnalysisDatas(this.searchRowData)
        .then(res => {
          const { avgOrderPrice, sumDeliveryFee, sumOrderFee, sumPayableFee, totalCount, orderGoodDataPage } = res;
          this.tableData = orderGoodDataPage.rows;
          this.total = orderGoodDataPage.total;
          this.inforCardData[0].count = parseFloat(totalCount);
          this.inforCardData[1].count = parseFloat(sumDeliveryFee);
          this.inforCardData[2].count = parseFloat(sumOrderFee);
          this.inforCardData[3].count = parseFloat(avgOrderPrice);
        //   this.orderData.sumDeliveryFee = sumDeliveryFee;
        //   this.orderData.sumOrderFee = sumOrderFee;
        //   this.orderData.sumPayableFee = sumPayableFee;
        //   this.orderData.totalCount = totalCount;
        //   this.orderTableData.push(this.orderData);
        })
        .finally(res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    startTimeChange(value, date) {
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.endTime = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleChange(item) {
      this.searchRowData.startTime = null;
      this.searchRowData.endTime = null;
      this.searchRowData.queryDays = item;
      this.getTableData();
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getAnalysisDatas(this.searchRowData)
        .then(res => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          // 表格数据导出字段翻译
          //  tableData.forEach(item => {});
          this.$refs.tables.handleDownload({
            filename: `数据统计信息-${new Date().valueOf()}`,
            data: tableData
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.count-style {
  font-size: 40px;
}
</style>
