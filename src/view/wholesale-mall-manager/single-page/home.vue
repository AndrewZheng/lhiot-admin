<template>
  <div class="m-role">
    <Row :gutter="20" class="mb10 dataBox">
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
        :search-area-column="24"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-sort-change="onSortChange"
      >
        <div slot="searchCondition">
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
            :search-loading="searchLoading"
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
          </Button>-->
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

    <Card>
      <tables
        ref="proTables"
        v-model="proTableData"
        :columns="proColumns"
        :loading="proLoading"
        :search-area-column="24"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-sort-change="onSortChangePro"
      >
        <div slot="searchCondition">
          <RadioGroup
            v-model="searchProRowData.queryDays"
            type="button"
            class="mr5"
            @on-change="handleChangePro"
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
          <DatePicker
            v-model="searchProRowData.startTime"
            :disabled="searchProRowData.queryDays!='-1'"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="大于等于"
            class="mr5"
            style="width: 150px"
            @on-change="startTimeChangePro"
          />
          <i>-</i>
          <DatePicker
            v-model="searchProRowData.endTime"
            :disabled="searchProRowData.queryDays!='-1'"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="小于等于"
            class="mr5"
            style="width: 150px"
            @on-change="endTimeChangePro"
          />
          <Input
            v-model="searchProRowData.params.goodsName"
            placeholder="商品名称"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Button
            v-waves
            :search-loading="searchLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleSearchPro"
          >
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button
            v-waves
            :loading="clearSearchLoading"
            class="search-btn"
            type="info"
            @click="handleClearPro"
          >
            <Icon type="md-refresh" />&nbsp;清除
          </Button>
        </div>
        <div slot="operations">
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="proTotal"
            :current="searchProRowData.page"
            :page-size="searchProRowData.rows"
            show-sizer
            show-total
            @on-change="changePagePro"
            @on-page-size-change="changePageSizePro"
          ></Page>
        </Row>
      </div>
    </Card>

    <Row style="margin-top: 20px;">
      <Card shadow>
        <img
          :src="banner"
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
import config from '@/config';
import { getAnalysisDatas, getStandardAnalysisDatas } from '@/api/wholesale';
import tableMixin from '@/mixins/tableMixin.js';
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
  rows: 10,
  sidx: 'sumFee',
  sort: 'desc'
};

const proRowData = {
  params: {
    goodsName: ''
  },
  queryDays: '0', // 1(昨日) 7(最近7天) 30(最近30天) -1(自定义)
  startTime: null,
  endTime: null,
  page: 1,
  rows: 10,
  sidx: 'payNum',
  sort: 'desc'
};

const orderData = {
  avgOrderPrice: '', // 订单均价
  sumDeliveryFee: '', // 订单配送费总金额
  sumOrderFee: '', // 订单总金额
  sumPayableFee: '', // 订单应付总金额
  totalCount: '' // 订单总数
};

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
    minWidth: 80
  },
  {
    title: '订单总额',
    align: 'center',
    key: 'sumOrderFee',
    minWidth: 80
  },
  {
    title: '订单均价',
    align: 'center',
    key: 'avgOrderPrice',
    minWidth: 80
  }
];

export default {
  components: {
    Tables,
    InforCard,
    CountTo
  },
  mixins: [tableMixin],
  data() {
    return {
      proTableData: [],
      proTotal: 0,
      brandType: config.brandType,
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
      proLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchProRowData: _.cloneDeep(proRowData),
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
          sortable: 'custom',
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.sumQuanity + row.unitName}</div>;
            // return <div>{row.sumQuanity}</div>;
          }
        },
        {
          title: '销售金额',
          align: 'center',
          key: 'sumFee',
          sortable: 'custom',
          minWidth: 80
        }
      ],
      proColumns: [
        {
          title: '商品名称',
          align: 'center',
          key: 'goodsName',
          minWidth: 100
        },
        {
          title: '点击数',
          align: 'center',
          key: 'clickNum',
          sortable: 'custom',
          minWidth: 80
        },
        {
          title: '加购数',
          align: 'center',
          key: 'addCardNum',
          sortable: 'custom',
          minWidth: 80
        },
        {
          title: '下单数',
          align: 'center',
          key: 'payNum',
          sortable: 'custom',
          minWidth: 80
        },
        {
          title: '加购率',
          align: 'center',
          key: 'addCardRate',
          sortable: 'custom',
          minWidth: 80,
          render: (h, params) => {
            const { row } = params;
            return <div>{(row.addCardRate * 100) + '%'}</div>;
          }
        },
        {
          title: '下单率',
          align: 'center',
          key: 'payRate',
          sortable: 'custom',
          minWidth: 80,
          render: (h, params) => {
            const { row } = params;
            return <div>{(row.payRate * 100) + '%'}</div>;
          }
        }
      ]
    }
  },
  computed: {
    banner() {
      // 默认万翼果联品牌
      let str = 'http://resource.shuiguoshule.com.cn/product_image/2020-04-06/sPCU3eaHKq4OY7aYajNm.jpg';
      if (this.brandType === 'qgg') {
        str = 'http://resource.shuiguoshule.com.cn/v2/qgg/activity_image/activity/2020-04-24/e7qhDWpvwOrSGRCJqDHT.jpg';
      } else if (this.brandType === 'lv_hang') {
        str = 'http://resource.shuiguoshule.com.cn/v2/lv_hang/activity_image/activity/2020-04-24/EenfAkUuSzvbxu0Jmz1G.jpg';
      }
      return str;
    }
  },
  created() {
    this.getTableData();
    this.getProTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.orderTableData = [];
      this.loading = true;
      getAnalysisDatas(this.searchRowData)
        .then(res => {
          const {
            avgOrderPrice,
            sumDeliveryFee,
            sumOrderFee,
            sumPayableFee,
            totalCount,
            orderGoodDataPage
          } = res;
          this.tableData = orderGoodDataPage.rows;
          this.total = orderGoodDataPage.total;
          this.inforCardData[0].count = parseFloat(totalCount);
          this.inforCardData[1].count = parseFloat(sumDeliveryFee);
          this.inforCardData[2].count = parseFloat(sumOrderFee);
          this.inforCardData[3].count = parseFloat(avgOrderPrice);
        })
        .finally(res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getProTableData() {
      this.proLoading = true;
      getStandardAnalysisDatas(this.searchProRowData)
        .then(res => {
          this.proTableData = res.rows;
          this.proTotal = res.total;
        })
        .finally(res => {
          this.proLoading = false;
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
    startTimeChangePro(value, date) {
      this.searchProRowData.startTime = value;
    },
    endTimeChangePro(value, data) {
      this.searchProRowData.endTime = value;
    },
    changePagePro(page) {
      this.searchProRowData.page = page;
      this.getProTableData();
    },
    changePageSizePro(pageSize) {
      this.searchProRowData.page = 1;
      this.searchProRowData.rows = pageSize;
      this.getProTableData();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    resetSearchProRowData() {
      this.searchProRowData = _.cloneDeep(proRowData);
    },
    handleChange(item) {
      this.searchRowData.startTime = null;
      this.searchRowData.endTime = null;
      this.searchRowData.queryDays = item;
      if (item === '-1') return;
      this.getTableData();
    },
    handleChangePro(item) {
      this.searchProRowData.startTime = null;
      this.searchProRowData.endTime = null;
      this.searchProRowData.queryDays = item;
      if (item === '-1') return;
      this.getProTableData();
    },
    handleSearchPro() {
      this.searchProRowData.page = 1;
      this.searchLoading = true;
      this.getProTableData();
    },
    handleClearPro() {
      this.button = '今日';
      this.resetSearchProRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearchPro();
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
    },
    onSortChange(type) {
      this.searchRowData.sidx = type.key;
      this.searchRowData.sort = type.order;
      getAnalysisDatas(this.searchRowData)
        .then(res => {
          const { orderGoodDataPage } = res;
          this.tableData = orderGoodDataPage.rows;
          this.total = orderGoodDataPage.total;
        })
        .finally(res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    onSortChangePro(type) {
      this.searchProRowData.sidx = type.key;
      this.searchProRowData.sort = type.order;
      this.getProTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.count-style {
  font-size: 40px;
}
.dataBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
