<template>
  <div>
    <Row :gutter="20" class="topBox">
      <i-col
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        span="4"
        style="height: 120px; cursor: pointer"
        @click.native="handgoIng(i)"
      >
        <infor-card
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
          shadow
        >
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px">
      <Card shadow style="height: 180px; padding: 0 30px">
        <div class="orderBox">
          <div
            v-for="(item, i) in orderTotalData"
            :key="`item-${i}`"
            class="orderDel"
            :class="i >= 2 ? 'bg_169bd5' : 'bg_ff3861'"
          >
            <p style="margin-bottom: 30px">
              <Icon :type="item.icon" />
              {{ item.title }}
            </p>
            <div class="orderData">
              <b>{{ item.todayNum }}</b>
              <b>{{ item.yesterdayNum }}</b>
            </div>
            <div class="orderData" style="font-size: 14px">
              <span>{{ item.todayTitle }}</span>
              <span>{{ item.yesterdayTitle }}</span>
            </div>
          </div>
        </div>
      </Card>
    </Row>
    <!-- tab分类 -->
    <Row :gutter="20" style="margin-top: 20px">
      <div class="tabChange">
        <b
          data-index="productStanard"
          :class="topStatus == 'productStanard' ? 'hot' : ''"
          @click="assistDataChange"
        >商品规格销售排行</b>
        <b
          data-index="productSell"
          :class="topStatus == 'productSell' ? 'hot' : ''"
          @click="assistDataChange"
        >门店商品销售统计</b>
        <b
          data-index="productEvaluate"
          :class="topStatus == 'productEvaluate' ? 'hot' : ''"
          @click="assistDataChange"
        >商品点赞/点踩排行</b>
      </div>
      <Card v-show="topStatus == 'productStanard'" shadow>
        <tables
          ref="goodsTableData"
          v-model="goodsTableData"
          :columns="goodsColumns"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <RadioGroup v-model="button" type="button" @on-change="timeChange">
              <Radio label="今日"></Radio>
              <Radio label="昨日"></Radio>
              <Radio label="最近7天"></Radio>
              <Radio label="最近30天"></Radio>
              <Radio label="自定义时间"></Radio>
            </RadioGroup>
            <DatePicker
              v-show="mark === true"
              v-model="goodsSearchRowData.beginDate"
              format="yyyy-MM-dd"
              type="date"
              placeholder="开始时间"
              style="width: 120px"
              @on-change="startTimeChange"
            />
            <i v-show="mark === true">-</i>
            <DatePicker
              v-show="mark === true"
              v-model="goodsSearchRowData.endDate"
              format="yyyy-MM-dd"
              type="date"
              placeholder="结束时间"
              class="search-input"
              style="width: 120px"
              @on-change="endTimeChange"
            />
            <Input
              v-model="goodsSearchRowData.productName"
              placeholder="商品名称"
              class="search-input"
              style="width: 160px"
              clearable
            ></Input>
            <Select
              v-model="goodsSearchRowData.productType"
              class=""
              placeholder="规格类型"
              style="width: 130px"
              clearable
            >
              <Option
                v-for="item in expandTypeEnum"
                :key="item.value"
                :value="item.value"
                style="margin: -10px 0 0 -5px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="goodsSearchRowData.rankingType"
              class="search-col mr2"
              placeholder="排序字段"
              style="width: 120px"
            >
              <Option
                v-for="item in goodsRankingType"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Button
              class="search-btn"
              type="primary"
              @click="handleGoodsSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button class="search-btn" type="info" @click="handleGoodsClear">
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button
              class="search-btn"
              type="warning"
              @click="handleDownload('productStanard')"
            >
              <Icon type="md-download" />导出
            </Button>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="goodsTotal"
              :current="goodsSearchRowData.page"
              show-sizer
              show-total
              @on-change="goodsChangePage"
              @on-page-size-change="goodsChangePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
      <Card v-show="topStatus == 'productSell'" shadow>
        <tables
          ref="sellTableData"
          v-model="sellTableData"
          :columns="sellColumns"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Input
              v-model="sellSearchRowData.storeName"
              placeholder="门店名称"
              class="search-input"
              style="width: 160px"
              clearable
            ></Input>
            <Select
              v-model="sellSearchRowData.storeArea"
              class=""
              placeholder="所属区域"
              style="width: 130px"
              clearable
            >
              <Option
                v-for="item in storeArea"
                :key="item.value"
                :value="item.value"
                style="margin: -10px 0 0 -5px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="sellSearchRowData.sidx"
              class="search-col mr2"
              placeholder="排序字段"
              style="width: 120px"
            >
              <Option
                v-for="item in sellRankingType"
                :key="`orderType-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Button class="search-btn" type="primary" @click="handleSellSearch">
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button class="search-btn" type="info" @click="handleSellClear">
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button
              class="search-btn"
              type="warning"
              @click="handleDownload('productSell')"
            >
              <Icon type="md-download" />导出
            </Button>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="sellTotal"
              :current="sellSearchRowData.page"
              show-sizer
              show-total
              @on-change="sellChangePage"
              @on-page-size-change="sellChangePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
      <Card v-show="topStatus == 'productEvaluate'" shadow>
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
            <RadioGroup
              v-model="seniorityButton"
              type="button"
              @on-change="productDataChange"
            >
              <Radio label="按点赞排行排序"></Radio>
              <Radio label="按点踩排行排序"></Radio>
            </RadioGroup>
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
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card';
import CountTo from '_c/count-to';
import config from '@/config';
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getWaitOrder,
  getOrderTotal,
  productRanking,
  productStanardRanking,
  getStoreAreaPages,
  getStoreSaleTotalPages
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  setSmallGoodsStandard
} from '@/libs/util';

import { expandTypeEnum } from '@/libs/enumerate';
import { expandTypeConvert } from '@/libs/converStatus';
const roleRowData = {
  rankingType: 'PRAISE',
  page: 1,
  rows: 10
};

const goodsRoleRowData = {
  rankingType: 'SALE_COUNT',
  beginDate: '',
  endDate: '',
  productName: '',
  productType: '',
  page: 1,
  rows: 10
};

const sellRoleRowData = {
  storeName: '',
  storeArea: '',
  page: 1,
  rows: 10,
  sidx: 'sumAmount',
  sort: 'desc'
};

const storeRowData = {
  aera: '',
  areaName: '',
  sidx: 'id',
  sort: 'asc',
  page: 1,
  rows: 10
};

export default {
  name: 'Home',
  components: {
    InforCard,
    CountTo,
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      mark: false,
      topStatus: 'productStanard',
      button: '今日',
      seniorityButton: '按点赞排行排序',
      brandType: config.brandType,
      seniorityStatus: 'PRAISE',
      goodsTableData: [],
      sellTableData: [],
      storeArea: [],
      areaList: [],
      expandTypeEnum,
      goodsTotal: 0,
      sellTotal: 0,
      searchRowData: _.cloneDeep(roleRowData),
      goodsSearchRowData: _.cloneDeep(goodsRoleRowData),
      sellSearchRowData: _.cloneDeep(sellRoleRowData),
      storeSearchRowData: _.cloneDeep(storeRowData),

      goodsRankingType: [
        { label: '销售数排序', value: 'SALE_COUNT' },
        { label: '销售额排序', value: 'SALE_AMOUNT' }
      ],
      sellRankingType: [
        { label: '订单数', value: 'totalCount' },
        { label: '销售额', value: 'sumAmount' }
      ],
      inforCardData: [
        {
          title: '预售订单',
          typeCode: 'PRESAL_ORDER',
          queryDay: 0,
          icon: 'ios-copy',
          count: 0,
          color: '#ff3861'
        },
        {
          title: '提货过期',
          typeCode: 'DELIVERY_EXPIRES',
          queryDay: 0,
          icon: 'md-clock',
          count: 0,
          color: '#19be6b'
        },
        {
          title: '配送异常',
          typeCode: 'DELIVERY_FAILURE',
          queryDay: 0,
          icon: 'md-bus',
          count: 0,
          color: '#ff9900'
        },
        {
          title: '海鼎异常',
          typeCode: 'HD_FAILURE',
          queryDay: 0,
          icon: 'md-close-circle',
          count: 0,
          color: '#9A66E4'
        },
        {
          title: '退款订单',
          typeCode: 'REFUND_ORDER',
          queryDay: 0,
          icon: 'ios-cloud-download',
          count: 0,
          color: '#ed3f14'
        }
      ],
      orderTotalData: [
        {
          title: '销售额',
          todayTitle: '今日销售额',
          yesterdayTitle: '昨日销售额',
          icon: 'logo-yen',
          todayNum: 0,
          yesterdayNum: 0
        },
        {
          title: '订单量',
          todayTitle: '今日订单数',
          yesterdayTitle: '昨日订单数',
          icon: 'ios-stats',
          todayNum: 0,
          yesterdayNum: 0
        },
        {
          title: '退单额',
          todayTitle: '今日退单额',
          yesterdayTitle: '昨日退单额',
          icon: 'logo-yen',
          todayNum: 0,
          yesterdayNum: 0
        },
        {
          title: '退单数',
          todayTitle: '今日退单数',
          yesterdayTitle: '昨日退单数',
          icon: 'ios-stats',
          todayNum: 0,
          yesterdayNum: 0
        }
      ],
      columns: [
        {
          title: '排名',
          key: 'standardId',
          width: '70px',
          align: 'center',
          render(h, params, vm) {
            const { row } = params;
            return <div>{row._index + 1}</div>;
          }
        },
        {
          title: '规格ID',
          key: 'standardId',
          align: 'center',
          width: '200px'
        },
        {
          title: '商品名称',
          key: 'productName',
          align: 'center'
        },
        {
          title: '规格',
          key: 'specification',
          align: 'center',
          width: '180px'
        },
        {
          title: '点赞',
          align: 'center',
          key: 'praiseCount',
          width: '180px'
        },
        {
          title: '点踩',
          key: 'treadCount',
          align: 'center',
          width: '180px'
        }
      ],
      goodsColumns: [
        {
          title: '排名',
          key: 'ranking',
          align: 'center',
          width: '70px',
          render(h, params, vm) {
            const { row } = params;
            return <div>{row._index + 1}</div>;
          }
        },
        {
          title: '规格ID',
          key: 'standardId',
          align: 'center',
          width: '180px'
        },
        {
          title: '商品名称',
          key: 'productName',
          align: 'center'
        },
        {
          title: '规格',
          key: 'specification',
          align: 'center',
          width: '160px'
        },
        {
          title: '单位',
          align: 'center',
          key: 'unitName',
          width: '120px'
        },
        {
          title: '规格类型',
          key: 'productType',
          align: 'center',
          width: '120px',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.productType == 'DISCOUNT_PRODUCT') {
              return (
                <div>
                  <tag color='magenta'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'PULL_NEW_PRODUCT') {
              return (
                <div>
                  <tag color='orange'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'SECKILL_PRODUCT') {
              return (
                <div>
                  <tag color='blue'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'NEW_TRY_PRODUCT') {
              return (
                <div>
                  <tag color='blue'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'ASSIST_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'SHARE_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'ORDINARY_PRODUCT') {
              return (
                <div>
                  <tag color='cyan'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'TEAM_BUY_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            } else if (row.productType == 'PRE_SALE_PRODUCT') {
              return (
                <div>
                  <tag color='green'>
                    {expandTypeConvert(row.productType).label}
                  </tag>
                </div>
              );
            }
          }
        },
        {
          title: '价格',
          key: 'price',
          align: 'center',
          width: '110px'
        },
        {
          title: '销售份数',
          align: 'center',
          key: 'saleCount',
          width: '120px'
        },
        {
          title: '销售金额',
          key: 'saleAmount',
          align: 'center',
          width: '120px'
        },
        {
          title: '在售率',
          key: 'sellingRate',
          align: 'center',
          width: '100px',
          render(h, params) {
            const { row } = params;
            if (!row.sellingRate) {
              return h('div', 'N/A');
            } else {
              return h('div', row.sellingRate + '%');
            }
          }
        },
        {
          title: '动销率',
          align: 'center',
          key: 'turnoverRate',
          width: '100px',
          render(h, params) {
            const { row } = params;

            if (!row.turnoverRate) {
              return h('div', 'N/A');
            } else {
              return h('div', row.turnoverRate + '%');
            }
          }
        },
        {
          title: '售罄率',
          key: 'soldOutRate',
          align: 'center',
          width: '100px',
          render(h, params) {
            const { row } = params;

            if (!row.soldOutRate) {
              return h('div', 'N/A');
            } else {
              return h('div', row.soldOutRate + '%');
            }
          }
        }
      ],
      sellColumns: [
        {
          title: '排名',
          key: 'ranking',
          align: 'center',
          minWidth: 100,
          render(h, params, vm) {
            const { row } = params;
            return <div>{row._index + 1}</div>;
          }
        },
        {
          title: '门店名称',
          key: 'storeName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '所属区域',
          key: 'storeArea',
          align: 'center',
          minWidth: 160,
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.areaList.find((item) => {
              return item.area === row.storeArea;
            });
            if (obj) {
              return h('span', obj.areaName + '');
            } else {
              return h('span', row.storeArea + '');
            }
          }
        },
        {
          title: '在售商品数',
          align: 'center',
          key: 'sellingCount',
          minWidth: 100
        },
        {
          title: '可售商品数',
          key: 'canSaleCount',
          align: 'center',
          minWidth: 100
        },
        {
          title: '动销商品数',
          align: 'center',
          key: 'runSaleCount',
          minWidth: 100
        },
        {
          title: '售罄商品数',
          key: 'soldOutCount',
          align: 'center',
          minWidth: 100
        },
        {
          title: '订单数',
          key: 'totalCount',
          align: 'center',
          minWidth: 100
        },
        {
          title: '销售额',
          align: 'center',
          key: 'sumAmount',
          minWidth: 100
        }
      ]
    };
  },
  computed: {
    banner() {
      // 默认万翼果联品牌
      let str =
        'http://resource.shuiguoshule.com.cn/product_image/2019-07-31/sgv7qBdSKI7ZrH5JU2kB.jpg';
      if (this.brandType === 'qgg') {
        str =
          'http://resource.shuiguoshule.com.cn/v2/qgg/activity_image/activity/2020-04-24/e7qhDWpvwOrSGRCJqDHT.jpg';
      } else if (this.brandType === 'lv_hang') {
        str =
          'http://resource.shuiguoshule.com.cn/v2/lv_hang/activity_image/activity/2020-04-24/EenfAkUuSzvbxu0Jmz1G.jpg';
      }
      return str;
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.goodsSearchRowData = _.cloneDeep(goodsRoleRowData);
    this.getWaitOrder();
    this.getOrderTotal();
    this.getSellTableData();
    this.getTableData();
    this.getGoodsTableData();
    this.getStoreAreaPages();
  },
  methods: {
    // 头部数据
    getWaitOrder() {
      getWaitOrder()
        .then((res) => {
          const newData = _.cloneDeep(this.inforCardData);
          for (const value of res) {
            for (const val of newData) {
              if (value.typeCode === val.typeCode) {
                val.count = Number(value.typeCount);
                val.queryDay = Number(value.queryDay);
              }
            }
          }
          this.inforCardData = newData;
        })
    },
    // 销售数据
    getOrderTotal() {
      getOrderTotal()
        .then((res) => {
          this.orderTotalData[0].todayNum = res.nowSumAmount;
          this.orderTotalData[0].yesterdayNum = res.yesSumAmount;
          this.orderTotalData[1].todayNum = res.nowSumTotal;
          this.orderTotalData[1].yesterdayNum = res.yesSumTotal;
          this.orderTotalData[2].todayNum = res.nowReturnAmount;
          this.orderTotalData[2].yesterdayNum = res.yesReturnAmount;
          this.orderTotalData[3].todayNum = res.nowReturnTotal;
          this.orderTotalData[3].yesterdayNum = res.yesReturnTotal;
        })
    },
    getTableData() {
      productRanking(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getSellTableData(value) {
      getStoreSaleTotalPages(this.sellSearchRowData)
        .then((res) => {
          this.sellTableData = res.rows;
          this.sellTotal = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getGoodsTableData(value) {
      const date = new Date();
      date.setDate(date.getDate());
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var today = `${year}-${month}-${day}`;
      if (value === '昨日') {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var yesterday = `${year}-${month}-${day}`;
        this.goodsSearchRowData.beginDate = yesterday;
        this.goodsSearchRowData.endDate = yesterday;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.goodsSearchRowData.beginDate = today;
        this.goodsSearchRowData.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.goodsSearchRowData.beginDate = sevenDay;
        this.goodsSearchRowData.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.goodsSearchRowData.beginDate = toMonth;
        this.goodsSearchRowData.endDate = today;
      }
      const date1 = new Date();
      date1.setDate(date.getDate() - 1);
      var year1 = date.getFullYear();
      var month1 = date.getMonth() + 1;
      var day1 = date.getDate();
      var yesterday1 = `${year1}-${month1}-${day1}`;
      if (this.button === '今日') {
        this.goodsSearchRowData.beginDate = yesterday1;
        this.goodsSearchRowData.endDate = yesterday1;
      }
      this.goodsSearchRowData.beginDate = this.$moment(
        this.goodsSearchRowData.beginDate
      ).format('YYYY-MM-DD');
      this.goodsSearchRowData.endDate = this.$moment(
        this.goodsSearchRowData.endDate
      ).format('YYYY-MM-DD');
      productStanardRanking(this.goodsSearchRowData)
        .then((res) => {
          this.goodsTableData = res.rows;
          this.goodsTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getStoreAreaPages() {
      getStoreAreaPages(this.storeSearchRowData)
        .then((res) => {
          this.areaList = res.rows;
          res.rows.forEach((value) => {
            const map = { label: 'label', value: 'value' };
            map.value = value.area;
            map.label = value.areaName;
            this.storeArea.push(map);
          });
        })
    },
    goodsChangePage(page) {
      this.goodsSearchRowData.page = page;
      this.getGoodsTableData();
    },
    goodsChangePageSize(pageSize) {
      this.goodsSearchRowData.page = 1;
      this.goodsSearchRowData.rows = pageSize;
      this.getGoodsTableData();
    },
    sellChangePage(page) {
      this.sellSearchRowData.page = page;
      this.getSellTableData();
    },
    sellChangePageSize(pageSize) {
      this.sellSearchRowData.page = 1;
      this.sellSearchRowData.rows = pageSize;
      this.getSellTableData();
    },
    // 跳转
    handgoIng(i) {
      const orderDel = this.inforCardData;
      setSmallGoodsStandard(orderDel[i]);
      this.turnToPage({
        name: 'small-skip-order',
        params: {
          typeCode: orderDel[i].typeCode,
          queryDay: orderDel[i].queryDay
        }
      });
    },
    productDataChange(value) {
      if (value === '按点赞排行排序') {
        this.searchRowData.rankingType = 'PRAISE';
        this.getTableData();
      } else {
        this.searchRowData.rankingType = 'TREAD';
        this.getTableData();
      }
    },
    timeChange(value) {
      if (value === '今日') {
        this.getGoodsTableData(value);
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.getGoodsTableData(value);
      } else if (value === '最近7天') {
        this.mark = false;
        this.getGoodsTableData(value);
      } else if (value === '最近30天') {
        this.mark = false;
        this.getGoodsTableData(value);
      } else if (value === '自定义时间') {
        this.mark = true;
        this.goodsSearchRowData.beginDate = '';
        this.goodsSearchRowData.endDate = '';
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.goodsSearchRowData.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.goodsSearchRowData.endDate = value;
    },
    handleGoodsSearch() {
      if (
        this.goodsSearchRowData.beginDate &&
        this.goodsSearchRowData.endDate
      ) {
        this.searchRowData.page = 1;
        this.searchLoading = true;
        this.getGoodsTableData();
      } else {
        this.$Message.info('请先选择搜索时间!');
      }
    },
    handleGoodsClear() {
      this.goodsSearchRowData = _.cloneDeep(goodsRoleRowData);
      this.button = '今日';
      this.getGoodsTableData('今日');
      this.mark = false;
    },
    handleSellSearch() {
      this.sellSearchRowData.page = 1;
      this.searchLoading = true;
      this.getSellTableData();
    },
    handleSellClear() {
      this.sellSearchRowData = _.cloneDeep(sellRoleRowData);
      this.getSellTableData();
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      this.topStatus = index;
    },
    // 导出数据
    handleDownload(value) {
      if (value === 'productStanard') {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        this.goodsSearchRowData.rows =
          this.goodsTotal > 5000 ? 5000 : this.goodsTotal;
        const pageSize = this.goodsSearchRowData.page;
        this.goodsSearchRowData.page = 1;
        this.goodsSearchRowData.beginDate = this.$moment(
          this.goodsSearchRowData.beginDate
        ).format('YYYY-MM-DD');
        this.goodsSearchRowData.endDate = this.$moment(
          this.goodsSearchRowData.endDate
        ).format('YYYY-MM-DD');
        productStanardRanking(this.goodsSearchRowData).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.goodsSearchRowData.rows = 10;
          this.goodsSearchRowData.page = pageSize;
          // 表格数据导出字段翻译
          const _this = this;
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.goodsTableData.handleDownload({
            filename: `商品规格销售排行统计-${date}`,
            data: tableData
          });
        });
      } else {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        this.sellSearchRowData.rows =
          this.sellTotal > 5000 ? 5000 : this.sellTotal;
        const pageSize = this.sellSearchRowData.page;
        this.sellSearchRowData.page = 1;
        getStoreSaleTotalPages(this.sellSearchRowData).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.sellSearchRowData.rows = 10;
          this.sellSearchRowData.page = pageSize;
          // 表格数据导出字段翻译
          const _this = this;
          tableData.forEach((item, index) => {
            item['productType'] = expandTypeConvert(item['productType']).label;
            item['ranking'] = Number(index) + 1;
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.sellTableData.handleDownload({
            filename: `门店商品销售排行统计-${date}`,
            data: tableData
          });
        });
      }
    }
  }
};
</script>

<style lang="less">
.topBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderDel {
  box-sizing: border-box;
  width: 240px;
  height: 150px;
  border-radius: 5px;
  padding: 20px 20px 0;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.bg_ff3861 {
  background: #ff3861;
}
.bg_169bd5 {
  background: #169bd5;
}
.orderData {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-size: 16px;
  b {
    display: inline-block;
    text-align: center;
    width: 300px;
  }
  span {
    display: inline-block;
    text-align: center;
    width: 300px;
    font-weight: normal;
  }
}
.topStore {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 10px 0;
}
.tabStore {
  width: 180px;
  height: 36px;
  background: #ccc;
  border-radius: 50px;
  line-height: 36px;
  display: flex;
  cursor: pointer;
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
.checked {
  background: #169bd5;
  border-radius: 50px;
  color: #fff;
}
.storeRanking {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  b {
    display: inline-block;
    width: 30px;
  }
  div {
    margin-bottom: 30px;
  }
  p {
    margin-bottom: 30px;
    font-weight: bold;
  }
}
.seniority {
  width: 180px;
  height: 36px;
  background: #ccc;
  border-radius: 50px;
  line-height: 36px;
  cursor: pointer;
  margin-left: 20px;
  display: flex;

  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
.mark {
  display: inline-block;
}
.tabChange {
  height: 50px;
  width: 600px;
  font-size: 16px;
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
    width: 200px;
    height: 48px;
    cursor: pointer;
    line-height: 43px;
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
