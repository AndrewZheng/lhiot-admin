<template>
  <div class="m-role">
    <div style="margin-bottom:30px;position: relative;">
      <div class="tabChange">
        <b data-index="commission" :class=" topStatus=='commission' ? 'hot' : '' " @click="assistDataChange">佣金数据</b>
        <b data-index="accounts" :class=" topStatus=='accounts' ? 'hot' : '' " @click="assistDataChange">结算数据</b>
        <b data-index="olaceOrder" :class=" topStatus=='olaceOrder' ? 'hot' : '' " @click="assistDataChange">下单数据</b>
        <b data-index="pro" :class=" topStatus=='pro' ? 'hot' : '' " @click="assistDataChange">商品数据</b>
        <b data-index="use" :class=" topStatus=='use' ? 'hot' : '' " @click="assistDataChange">员工数据</b>
        <b data-index="brokerage" :class=" topStatus=='brokerage' ? 'hot' : '' " @click="assistDataChange">佣金明细</b>
      </div>
      <Card v-show="topStatus==='pro'">
        <tables
          ref="tableDatas"
          v-model="tableData"
          :columns="columns"
          :loading="loading"
          :search-area-column="24"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-sort-change="onSortChange"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="button" type="button" @on-change="timeChange">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="mark===true" class="mark">
                <DatePicker
                  v-model="searchRowData.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="startTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="endTimeChange"
                />
              </div>
              <Input
                v-model="searchRowData.productName"
                placeholder="商品名称"
                class="search-input mr2"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
                class="search-btn mr2"
                type="primary"
                @click="handleSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn mr2"
                type="info"
                @click="handleClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
              <Button class="search-btn" type="warning" @click="handleDownload('prod')">
                <Icon type="md-download" />导出
              </Button>
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
          ref="tableDataUse"
          v-model="tableDataUse"
          :columns="columnsUse"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-sort-change="onSortChangeUse"
        >
          <div slot="searchCondition">
            <Row>
              </Select>
              <Input
                v-model="searchRowDataUse.nickName"
                placeholder="用户名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowDataUse.phone"
                placeholder="手机号码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRowDataUse.deptName"
                placeholder="所在部门"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <DatePicker
                :value="searchRowDataUse.beginDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="开始时间"
                class="search-input"
                style="width: 130px"
                @on-change="searchRowDataUse.beginDate = $event"
              />
              <i>-</i>
              <DatePicker
                :value="searchRowDataUse.endDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="结束时间"
                class="search-input mr5"
                style="width: 130px"
                @on-change="searchRowDataUse.endDate = $event"
              />
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleSearchUse"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn mr5"
                type="info"
                @click="handleClearUse"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
              <Button class="search-btn mr2" type="warning" @click="handleDownload('user')">
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalPageUse"
              :current="searchRowDataUse.page"
              show-sizer
              show-total
              @on-change="changePageUse"
              @on-page-size-change="changePageSizeUse"
            ></Page>
          </Row>
        </div>
      </Card>
      <Card v-show="topStatus==='commission'">
        <tables
          ref="tablesCommission"
          v-model="tableDataCommission"
          :columns="columnsCommission"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="buttonCommission" type="button" @on-change="timeChangeCommission">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="markCommission===true" class="mark">
                <DatePicker
                  v-model="searchRowDataCommission.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  placeholder="请先选择开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChangeCommission"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowDataCommission.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  :readonly="!commissionStatus"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChangeCommission"
                />
              </div>
            </Row>
          </div>
        </tables>
        <div style="height:60px"></div>
        <h3 class="mb10">
          佣金数据趋势图
        </h3>
        <div>
          <RadioGroup v-model="buttonCommissionTrend" type="button" @on-change="timeChangeCommissionTrend">
            <Radio label="上月"></Radio>
            <Radio label="本月"></Radio>
            <Radio label="自定义月份"></Radio>
          </RadioGroup>
          <div v-show="markCommissionTrend===true" class="mark">
            <DatePicker
              type="month"
              :value="queryMonth"
              placeholder="请先选择月份"
              class="search-input ml5"
              style="width: 150px"
              :clearable="false"
              @on-change="queryMonthChangeCommission"
            />
          </div>
          <RadioGroup
            v-model="charTitleCommissionStatus"
            type="button"
            class="ml30"
            @on-change="changeCommissionCharts"
          >
            <Radio label="leijiCommission">
              累计佣金
            </Radio>
            <Radio label="daitixianCommission">
              待提现佣金
            </Radio>
            <Radio label="yitixianCommission">
              已提现佣金
            </Radio>
            <Radio label="dairuzhangCommission">
              待入账佣金
            </Radio>
          </RadioGroup>
          <ve-line class="charts mt10" :data="chartData"></ve-line>
        </div>
      </Card>
      <Card v-if="topStatus==='accounts'">
        <tables
          ref="tablesAccounts"
          v-model="tableDataAccounts"
          :columns="columnsAccounts"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="buttonCommission" type="button" @on-change="timeChangeAccounts">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="markAccounts===true" class="mark">
                <DatePicker
                  v-model="searchRowDataAccounts.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  placeholder="请先选择开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChangeAccounts"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowDataAccounts.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  :readonly="!accountsStatus"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChangeAccounts"
                />
              </div>
            </Row>
          </div>
        </tables>
        <div style="height:60px"></div>
        <h3 class="mb10">
          结算数据趋势图
        </h3>
        <div>
          <RadioGroup v-model="buttonAccountsTrend" type="button" @on-change="timeChangeAccountsTrend">
            <Radio label="上月"></Radio>
            <Radio label="本月"></Radio>
            <Radio label="自定义月份"></Radio>
          </RadioGroup>
          <div v-show="markAccountsTrend===true" class="mark">
            <DatePicker
              type="month"
              :value="this.queryMonth"
              placeholder="请先选择开始时间"
              class="search-input ml5"
              style="width: 150px"
              :clearable="false"
              @on-change="queryMonthChangeAccounts"
            />
          </div>
          <RadioGroup
            v-model="charTitleAccountsStatus"
            type="button"
            class="ml30"
            @on-change="changeAccountsCharts"
          >
            <Radio label="settleOrderNum">
              结算订单数
            </Radio>
            <Radio label="settleOrderSum">
              结算订单额
            </Radio>
            <Radio label="settleTotalSum">
              结算总佣金
            </Radio>
            <Radio label="perCapitaIncome">
              人均收益
            </Radio>
          </RadioGroup>
          <ve-line class="charts mt10" :data="chartData"></ve-line>
        </div>
      </Card>
      <Card v-if="topStatus==='olaceOrder'">
        <tables
          ref="tablesOlaceOrder"
          v-model="tableDataOlaceOrder"
          :columns="columnsOlaceOrder"
          :loading="loading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <RadioGroup v-model="buttonOlaceOrder" type="button" @on-change="timeChangeOlaceOrder">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="markOlaceOrder===true" class="mark">
                <DatePicker
                  v-model="searchRowDataOlaceOrder.beginDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  placeholder="请先选择开始时间"
                  class="search-input"
                  style="width: 150px"
                  @on-change="startTimeChangeOlaceOrder"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowDataOlaceOrder.endDate"
                  format="yyyy-MM-dd"
                  type="date"
                  :clearable="false"
                  :readonly="!olaceOrderStatus"
                  placeholder="自定义结束时间"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChangeOlaceOrder"
                />
              </div>
            </Row>
          </div>
        </tables>
        <div style="height:60px"></div>
        <h3 class="mb10">
          下单数据趋势图
        </h3>
        <div>
          <RadioGroup v-model="buttonOlaceOrderTrend" type="button" @on-change="timeChangeOlaceOrderTrend">
            <Radio label="上月"></Radio>
            <Radio label="本月"></Radio>
            <Radio label="自定义月份"></Radio>
          </RadioGroup>
          <div v-show="markOlaceOrderTrend===true" class="mark">
            <DatePicker
              type="month"
              :value="queryMonth"
              placeholder="请先选择开始时间"
              class="search-input ml5"
              style="width: 150px"
              :clearable="false"
              @on-change="queryMonthChangeOlaceOrder"
            />
          </div>
          <RadioGroup
            v-model="charTitleOlaceOrderStatus"
            type="button"
            class="ml30"
            @on-change="changeOlaceOrderCharts"
          >
            <Radio label="olaceOrderNum">
              下单数
            </Radio>
            <Radio label="olaceOrderSum">
              下单额
            </Radio>
            <Radio label="chargebackNum">
              退单数
            </Radio>
            <Radio label="chargebackSum">
              退单额
            </Radio>
          </RadioGroup>
          <ve-line class="charts mt10" :data="chartData"></ve-line>
        </div>
      </Card>
      <Card v-show="topStatus==='brokerage'">
        <tables
          ref="tablesBrokerage"
          v-model="tableDataBrokerage"
          :columns="columnsBrokerage"
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
              <RadioGroup v-model="buttonBrokerage" type="button" @on-change="timeChangeBrokerage">
                <Radio label="汇总"></Radio>
                <Radio label="今日"></Radio>
                <Radio label="昨日"></Radio>
                <Radio label="最近7天"></Radio>
                <Radio label="最近30天"></Radio>
                <Radio label="自定义时间"></Radio>
              </RadioGroup>
              <div v-show="markBrokerage===true" class="mark">
                <DatePicker
                  v-model="searchRowDataBrokerage.createTimeBegin"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="开始时间"
                  class="search-input"
                  style="width: 120px"
                  @on-change="startTimeChangeBrokerage"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowDataBrokerage.createTimeEnd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="结束时间"
                  class="search-input mr2"
                  style="width: 120px"
                  @on-change="endTimeChangeBrokerage"
                />
              </div>
              <Select
                v-model="searchRowDataBrokerage.status"
                placeholder="佣金状态"
                :clearable="true"
                style="width: 90px"
                @on-change="handRankType"
              >
                <Option
                  v-for="(item,index) in rankType"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="width: 90px"
                >
                  {{ item.label }}
                </Option>
              </Select>
              <Input
                v-model="searchRowDataBrokerage.standardName"
                placeholder="商品名称"
                class="search-input mr2"
                style="width: 140px"
                clearable
              ></Input>
              <Input
                v-model="searchRowDataBrokerage.orderUserName"
                placeholder="下单用户"
                class="search-input mr2"
                style="width: 100px"
                clearable
              ></Input>
              <Input
                v-model="searchRowDataBrokerage.staffName"
                placeholder="所属员工"
                class="search-input"
                style="width: 100px"
                clearable
              ></Input>
            </Row>
            <Row style="float:right;margin-top:15px">
              <Button
                :loading="searchLoading"
                class="search-btn mr2"
                type="primary"
                @click="handleSearchBrokerage"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn mr2"
                type="info"
                @click="handleClearBrokerage"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
              <Button class="search-btn" type="warning" @click="handleDownload('Brokerage')">
                <Icon type="md-download" />导出数据
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="totalBrokerage"
              :current="searchRowDataBrokerage.page"
              show-sizer
              show-total
              @on-change="changePageBrokerage"
              @on-page-size-change="changePageSizeBrokerage"
            ></Page>
          </Row>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  shareProdStatistics,
  shareUserStatistics,
  commissionStatistics,
  commissionSettleData,
  commissionOrderData,
  shareawardAmountDetailTotal,
  commissionDataTotalTrend,
  orderDataTotalTrend,
  settleDataTotalTrend
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import { couponTypeConvert } from '@/libs/converStatus';
import { couponTypeEnum } from '@/libs/enumerate';
import searchMixin from '@/mixins/searchMixin.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';

const couponTemplateDetail = {};

const roleRowData = {
  page: 1,
  rows: 10,
  productName: '',
  beginDate: null,
  endDate: null,
  sidx: 'awardAmount',
  sort: 'desc'
};

const roleRowDataUse = {
  page: 1,
  rows: 10,
  nickName: '',
  phone: '',
  deptName: '',
  beginDate: '',
  endDate: '',
  sidx: 'countAwardAmount',
  sort: 'desc'
};

const roleRowDataBrokerage = {
  page: 1,
  rows: 10,
  createTimeBegin: null,
  createTimeEnd: null,
  staffName: '',
  standardName: '',
  orderUserName: '',
  status: '',
  sidx: 'createTime',
  sort: 'desc'
};

const roleRowDataCommission = {
  beginDate: null,
  endDate: null
};

const roleRowDataAccounts = {
  beginDate: null,
  endDate: null
};

const roleRowDataOlaceOrder = {
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
      topStatus: 'commission',
      mark: false,
      markBrokerage: false,
      markCommission: false,
      markAccounts: false,
      markOlaceOrder: false,
      commissionStatus: false,
      accountsStatus: false,
      olaceOrderStatus: false,
      markCommissionTrend: false,
      markAccountsTrend: false,
      markOlaceOrderTrend: false,
      num: 0,
      num1: 0,
      button: '汇总',
      buttonBrokerage: '汇总',
      buttonCommission: '汇总',
      buttonAccounts: '汇总',
      buttonOlaceOrder: '汇总',
      buttonCommissionTrend: '本月',
      buttonAccountsTrend: '本月',
      buttonOlaceOrderTrend: '本月',
      charTitleCommissionStatus: 'leijiCommission',
      charTitleAccountsStatus: 'settleOrderNum',
      charTitleOlaceOrderStatus: 'olaceOrderNum',
      queryMonth: '',
      couponTypeEnum,
      totalPageUse: 0,
      totalPage: 0,
      totalBrokerage: 0,
      hisAmount: '',
      columns: [
        {
          title: '商品名称',
          align: 'center',
          key: 'productName',
          minWidth: 200
        },
        {
          title: '商品类型',
          align: 'center',
          key: 'shareType',
          render(h, params) {
            const { row } = params;
            if (row.shareType === '普通商品') {
              return (
                <div>
                  <tag color='cyan'>{'普通商品'}</tag>
                </div>
              );
            } else if (row.shareType === '拼团商品') {
              return (
                <div>
                  <tag color='orange'>{'拼团商品'}</tag>
                </div>
              );
            } else if (row.shareType === '预售商品') {
              return (
                <div>
                  <tag color='magenta'>{'预售商品'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'N/A'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '分享次数',
          align: 'center',
          key: 'shareCount',
          sortable: 'custom'
        },
        {
          title: '购买次数',
          align: 'center',
          key: 'buyCount',
          sortable: 'custom'
        },
        {
          title: '购买份数',
          align: 'center',
          key: 'buyCopies',
          sortable: 'custom'
        },
        {
          title: '产生佣金',
          align: 'center',
          key: 'awardAmount',
          sortable: 'custom',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.awardAmount)}</div>;
          }
        }
      ],
      columnsUse: [
        {
          title: '用户昵称',
          align: 'center',
          key: 'nickName',
          tooltip: true,
          minWidth: 160
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'phone',
          minWidth: 130
        },
        {
          title: '所在部门',
          align: 'center',
          key: 'deptName',
          minWidth: 130
        },
        {
          title: '分享次数',
          align: 'center',
          sortable: 'custom',
          key: 'shareCount',
          minWidth: 120
        },
        {
          title: '分享人数',
          align: 'center',
          key: 'shareUserCount',
          minWidth: 100
        },
        {
          title: '分享订单数',
          align: 'center',
          sortable: 'custom',
          minWidth: 130,
          key: 'countOrder'
        },
        {
          title: '分享订单额',
          align: 'center',
          sortable: 'custom',
          minWidth: 130,
          key: 'countAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countAmount)}</div>;
          }
        },
        {
          title: '获得总佣金',
          align: 'center',
          sortable: 'custom',
          key: 'countAwardAmount',
          minWidth: 130,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countAwardAmount)}</div>;
          }
        },
        {
          title: '待入账佣金',
          align: 'center',
          minWidth: 110,
          key: 'waitAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.waitAmount)}</div>;
          }
        },
        {
          title: '已提现佣金',
          align: 'center',
          minWidth: 110,
          key: 'allOutAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allOutAmount)}</div>;
          }
        }
      ],
      columnsCommission: [
        {
          title: '累计佣金',
          align: 'center',
          key: 'addUpAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.addUpAmount)}</div>;
          }
        },
        {
          title: '待提现佣金',
          align: 'center',
          key: 'canOutAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.canOutAmount)}</div>;
          }
        },
        {
          title: '待入账佣金',
          align: 'center',
          key: 'waitAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.waitAmount)}</div>;
          }
        },
        {
          title: '已提现佣金',
          align: 'center',
          key: 'allOutAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.allOutAmount)}</div>;
          }
        }
      ],
      columnsAccounts: [
        {
          title: '结算订单数',
          align: 'center',
          key: 'countOrder'
        },
        {
          title: '结算总人数',
          align: 'center',
          key: 'countUser'
        },
        {
          title: '结算订单额',
          align: 'center',
          key: 'countOrderAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countOrderAmount)}</div>;
          }
        },
        {
          title: '结算总佣金',
          align: 'center',
          key: 'countAwardAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countAwardAmount)}</div>;
          }
        },
        {
          title: '佣金比例',
          align: 'center',
          key: 'awardBillie',
          render(h, params) {
            return <div>{params.row.awardBillie}</div>;
          }
        },
        {
          title: '人均收益',
          align: 'center',
          key: 'countAwardAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.awardAverage)}</div>;
          }
        }
      ],
      columnsOlaceOrder: [
        {
          title: '下单人数',
          align: 'center',
          key: 'countUser'
        },
        {
          title: '下单数',
          align: 'center',
          key: 'countOrder'
        },
        {
          title: '下单额',
          align: 'center',
          key: 'countAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countAmount)}</div>;
          }
        },
        {
          title: '退单人数',
          align: 'center',
          key: 'countReturnUser'
        },
        {
          title: '退单数',
          align: 'center',
          key: 'countReturnOrder'
        },
        {
          title: '退单额',
          align: 'center',
          key: 'countReturnAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.countReturnAmount)}</div>;
          }
        }
      ],
      columnsBrokerage: [
        {
          title: '订单号',
          align: 'center',
          key: 'orderCode',
          width: 190
        },
        {
          title: '下单时间',
          align: 'center',
          key: 'createTime',
          width: 120
        },
        {
          title: '结算时间',
          align: 'center',
          key: 'settleTime',
          width: 120
        },
        {
          title: '订单金额',
          align: 'center',
          key: 'orderAmount',
          width: 100,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.orderAmount)}</div>;
          }
        },
        {
          title: '佣金金额',
          align: 'center',
          width: 100,
          key: 'awardAmount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.awardAmount)}</div>;
          }
        },
        {
          title: '佣金状态',
          align: 'center',
          width: 110,
          key: 'status',
          render(h, params) {
            const { row } = params;
            if (row.status === 'WAIT') {
              return (
                <div>
                  <tag color='warning'>{'待入账'}</tag>
                </div>
              );
            } else if (row.status === 'SUCCESS') {
              return (
                <div>
                  <tag color='success'>{'已入账'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='error'>{'入账失败'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '佣金商品',
          align: 'center',
          key: 'standardName'
        },
        {
          title: '下单门店',
          align: 'center',
          key: 'storeName',
          width: 200
        },
        {
          title: '下单用户',
          align: 'center',
          key: 'orderUserName',
          width: 110
        },
        {
          title: '所属员工',
          align: 'center',
          key: 'staffName',
          width: 110
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchRowDataUse: _.cloneDeep(roleRowDataUse),
      searchRowDataBrokerage: _.cloneDeep(roleRowDataBrokerage),
      searchRowDataCommission: _.cloneDeep(roleRowDataCommission),
      searchRowDataAccounts: _.cloneDeep(roleRowDataAccounts),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      searchRowDataOlaceOrder: _.cloneDeep(roleRowDataOlaceOrder),
      tableDataUse: [],
      tableDataCommission: [],
      tableDataAccounts: [],
      tableDataOlaceOrder: [],
      tableDataBrokerage: [],
      chartData: {
        columns: ['日期', '访问用户']
      },
      rankType: [
        {
          label: '待入账',
          value: 'WAIT'
        },
        {
          label: '已入账',
          value: 'SUCCESS'
        },
        {
          label: '入账失败',
          value: 'FAIL'
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.searchRowDataUse = _.cloneDeep(roleRowDataUse);
    this.searchRowDataBrokerage = _.cloneDeep(roleRowDataBrokerage);
    (this.searchRowDataCommission = _.cloneDeep(roleRowDataCommission)),
    (this.searchRowDataAccounts = _.cloneDeep(roleRowDataAccounts)),
    (this.searchRowDataOlaceOrder = _.cloneDeep(roleRowDataOlaceOrder)),
    this.getTableDataCommission();
    this.commissionDataTotalTrend();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetSearchRowDataUse() {
      this.searchRowDataUse = _.cloneDeep(roleRowDataUse);
      this.getTableDataUse();
    },
    resetSearchRowDataBrokerage() {
      this.searchRowDataBrokerage = _.cloneDeep(roleRowDataBrokerage);
      this.getTableDataBrokerage();
    },
    getTableData(value) {
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
        this.searchRowData.beginDate = yesterday;
        this.searchRowData.endDate = yesterday;
      }
      if (this.button === '汇总' || value === '汇总') {
        const date = new Date();
        date.setDate(date.getDate() - 365);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var allDay = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = allDay;
        this.searchRowData.endDate = today;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = today;
        this.searchRowData.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = sevenDay;
        this.searchRowData.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowData.beginDate = toMonth;
        this.searchRowData.endDate = today;
      }
      this.searchRowData.beginDate = this.$moment(
        this.searchRowData.beginDate
      ).format('YYYY-MM-DD');
      this.searchRowData.endDate = this.$moment(
        this.searchRowData.endDate
      ).format('YYYY-MM-DD');
      shareProdStatistics(this.searchRowData)
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
    getTableDataUse(value) {
      shareUserStatistics(this.searchRowDataUse)
        .then((res) => {
          this.tableDataUse = res.rows;
          this.totalPageUse = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableDataCommission(value) {
      this.tableDataCommission = [];
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
        this.searchRowDataCommission.beginDate = yesterday;
        this.searchRowDataCommission.endDate = yesterday;
      }
      if (this.buttonCommission === '汇总' || value === '汇总') {
        this.searchRowDataCommission.beginDate = null;
        this.searchRowDataCommission.endDate = null;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowDataCommission.beginDate = today;
        this.searchRowDataCommission.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowDataCommission.beginDate = sevenDay;
        this.searchRowDataCommission.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowDataCommission.beginDate = toMonth;
        this.searchRowDataCommission.endDate = today;
      }
      commissionStatistics(this.searchRowDataCommission)
        .then((res) => {
          this.tableDataCommission.push(res);
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableDataAccounts(value) {
      this.tableDataAccounts = [];
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
        this.searchRowDataAccounts.beginDate = yesterday;
        this.searchRowDataAccounts.endDate = yesterday;
      }
      if (this.buttonAccounts === '汇总' || value === '汇总') {
        this.searchRowDataAccounts.beginDate = null;
        this.searchRowDataAccounts.endDate = null;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowDataAccounts.beginDate = today;
        this.searchRowDataAccounts.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowDataAccounts.beginDate = sevenDay;
        this.searchRowDataAccounts.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowDataAccounts.beginDate = toMonth;
        this.searchRowDataAccounts.endDate = today;
      }
      commissionSettleData(this.searchRowDataAccounts)
        .then((res) => {
          this.tableDataAccounts.push(res);
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableDataOlaceOrder(value) {
      this.tableDataOlaceOrder = [];
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
        this.searchRowDataOlaceOrder.beginDate = yesterday;
        this.searchRowDataOlaceOrder.endDate = yesterday;
      }
      if (this.buttonOlaceOrder === '汇总' || value === '汇总') {
        this.searchRowDataOlaceOrder.beginDate = null;
        this.searchRowDataOlaceOrder.endDate = null;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowDataOlaceOrder.beginDate = today;
        this.searchRowDataOlaceOrder.endDate = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowDataOlaceOrder.beginDate = sevenDay;
        this.searchRowDataOlaceOrder.endDate = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowDataOlaceOrder.beginDate = toMonth;
        this.searchRowDataOlaceOrder.endDate = today;
      }
      commissionOrderData(this.searchRowDataOlaceOrder)
        .then((res) => {
          this.tableDataOlaceOrder.push(res);
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableDataBrokerage(value) {
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
        this.searchRowDataBrokerage.createTimeBegin = yesterday;
        this.searchRowDataBrokerage.createTimeEnd = yesterday;
      }
      if (this.buttonBrokerage === '汇总' || value === '汇总') {
        const date = new Date();
        date.setDate(date.getDate() - 365);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var allDay = `${year}-${month}-${day}`;
        this.searchRowDataBrokerage.createTimeBegin = allDay;
        this.searchRowDataBrokerage.createTimeEnd = today;
      }
      if (value === '今日') {
        const date = new Date();
        date.setDate(date.getDate());
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var today = `${year}-${month}-${day}`;
        this.searchRowDataBrokerage.createTimeBegin = today;
        this.searchRowDataBrokerage.createTimeEnd = today;
      }
      if (value === '最近7天') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sevenDay = `${year}-${month}-${day}`;
        this.searchRowDataBrokerage.createTimeBegin = sevenDay;
        this.searchRowDataBrokerage.createTimeEnd = today;
      }
      if (value === '最近30天') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var toMonth = `${year}-${month}-${day}`;
        this.searchRowDataBrokerage.createTimeBegin = toMonth;
        this.searchRowDataBrokerage.createTimeEnd = today;
      }
      this.searchRowDataBrokerage.createTimeBegin = this.$moment(
        this.searchRowDataBrokerage.createTimeBegin
      ).format('YYYY-MM-DD');
      this.searchRowDataBrokerage.createTimeEnd = this.$moment(
        this.searchRowDataBrokerage.createTimeEnd
      ).format('YYYY-MM-DD');
      shareawardAmountDetailTotal(this.searchRowDataBrokerage)
        .then((res) => {
          this.tableDataBrokerage = res.rows;
          this.totalBrokerage = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    // 佣金趋势数据
    commissionDataTotalTrend(value) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      if (value === '上月') {
        const month = date.getMonth();
        this.queryMonth = `${year}-${month}`;
      } else if (value === '本月' || this.buttonCommissionTrend === '本月') {
        const month = date.getMonth() + 1;
        this.queryMonth = `${year}-${month}`;
      }
      commissionDataTotalTrend(this.queryMonth)
        .then((res) => {
          let chartsName = '';
          if (this.charTitleCommissionStatus === 'leijiCommission') {
            chartsName = '累计佣金';
          } else if (this.charTitleCommissionStatus === 'daitixianCommission') {
            chartsName = '待提现佣金';
          } else if (this.charTitleCommissionStatus === 'yitixianCommission') {
            chartsName = '已提现佣金';
          } else {
            chartsName = '待入账佣金';
          }
          for (const value of res) {
            value.累计佣金 = value.addUpAmount / 100;
            value.待提现佣金 = value.canOutAmount / 100;
            value.已提现佣金 = value.allOutAmount / 100;
            value.待入账佣金 = value.waitAmount / 100;
          }
          const nowChartData = {
            columns: ['dateValue', chartsName],
            rows: res
          };
          this.chartData = nowChartData;
        })
        .finally((res) => {});
    },
    changeCommissionCharts(value) {
      this.charTitleCommissionStatus = value;
      let chartsName = '';
      const nowChartData = _.cloneDeep(this.chartData);
      if (value === 'leijiCommission') {
        chartsName = '累计佣金';
      } else if (value === 'daitixianCommission') {
        chartsName = '待提现佣金';
      } else if (value === 'yitixianCommission') {
        chartsName = '已提现佣金';
      } else {
        chartsName = '待入账佣金';
      }
      nowChartData.columns[1] = chartsName;
      this.chartData = nowChartData;
    },
    // 结算趋势数据
    settleDataTotalTrend(value) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      if (value === '上月') {
        const month = date.getMonth();
        this.queryMonth = `${year}-${month}`;
      } else if (value === '本月' || this.buttonAccountsTrend === '本月') {
        const month = date.getMonth() + 1;
        this.queryMonth = `${year}-${month}`;
      }
      settleDataTotalTrend(this.queryMonth)
        .then((res) => {
          let chartsName = '';
          if (this.charTitleAccountsStatus === 'settleOrderNum') {
            chartsName = '结算订单数';
          } else if (this.charTitleAccountsStatus === 'settleOrderSum') {
            chartsName = '结算订单额';
          } else if (this.charTitleAccountsStatus === 'settleTotalSum') {
            chartsName = '结算总佣金';
          } else {
            chartsName = '人均收益';
          }
          for (const value of res) {
            value.结算订单数 = value.countOrder;
            value.结算订单额 = value.countOrderAmount / 100;
            value.结算总佣金 = value.countAwardAmount / 100;
            value.人均收益 = value.awardAverage / 100;
          }
          const nowChartData = {
            columns: ['dateValue', chartsName],
            rows: res
          };
          this.chartData = nowChartData;
        })
        .finally((res) => {});
    },
    changeAccountsCharts(value) {
      this.charTitleAccountsStatus = value;
      let chartsName = '';
      const nowChartData = _.cloneDeep(this.chartData);
      if (value === 'settleOrderNum') {
        chartsName = '结算订单数';
      } else if (value === 'settleOrderSum') {
        chartsName = '结算订单额';
      } else if (value === 'settleTotalSum') {
        chartsName = '结算总佣金';
      } else {
        chartsName = '人均收益';
      }
      nowChartData.columns[1] = chartsName;
      this.chartData = nowChartData;
    },
    // 下单趋势图数据
    orderDataTotalTrend(value) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      if (value === '上月') {
        const month = date.getMonth();
        this.queryMonth = `${year}-${month}`;
      } else if (value === '本月' || this.buttonOlaceOrderTrend === '本月') {
        const month = date.getMonth() + 1;
        this.queryMonth = `${year}-${month}`;
      }
      orderDataTotalTrend(this.queryMonth)
        .then((res) => {
          let chartsName = '';
          if (this.charTitleOlaceOrderStatus === 'olaceOrderNum') {
            chartsName = '下单数';
          } else if (this.charTitleOlaceOrderStatus === 'olaceOrderSum') {
            chartsName = '下单额';
          } else if (this.charTitleOlaceOrderStatus === 'chargebackNum') {
            chartsName = '退单数';
          } else {
            chartsName = '退单额';
          }
          for (const value of res) {
            value.下单数 = value.countOrder;
            value.下单额 = value.countAmount / 100;
            value.退单数 = value.countReturnOrder;
            value.退单额 = value.countReturnAmount / 100;
          }
          const nowChartData = {
            columns: ['dateValue', chartsName],
            rows: res
          };
          this.chartData = nowChartData;
        })
        .finally((res) => {});
    },
    changeOlaceOrderCharts(value) {
      this.charTitleOlaceOrderStatus = value;
      let chartsName = '';
      const nowChartData = _.cloneDeep(this.chartData);
      if (value === 'olaceOrderNum') {
        chartsName = '下单数';
      } else if (value === 'olaceOrderSum') {
        chartsName = '下单额';
      } else if (value === 'chargebackNum') {
        chartsName = '退单数';
      } else {
        chartsName = '退单额';
      }
      nowChartData.columns[1] = chartsName;
      this.chartData = nowChartData;
    },
    handleSearch() {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.getTableData();
    },
    handleSearchUse() {
      this.num1++;
      this.searchRowDataUse.page = 1;
      this.getTableDataUse();
    },
    handleClearUse() {
      // 重置数据
      this.resetSearchRowDataUse();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearchUse();
    },
    handleSearchBrokerage() {
      this.searchRowDataBrokerage.page = 1;
      this.getTableDataBrokerage();
    },
    handleClearBrokerage() {
      // 重置数据
      this.resetSearchRowDataBrokerage();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearchBrokerage();
    },
    assistDataChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) {
        return;
      }
      if (index === 'pro') {
        this.button = '汇总';
        this.getTableData();
      }
      if (index === 'use') {
        this.getTableDataUse();
      }
      if (index === 'commission') {
        this.buttonCommission = '汇总';
        this.buttonCommissionTrend = '本月';
        this.getTableDataCommission();
        this.commissionDataTotalTrend();
      }
      if (index === 'accounts') {
        this.buttonAccounts = '汇总';
        this.buttonAccountsTrend = '本月';
        this.getTableDataAccounts();
        this.settleDataTotalTrend();
      }
      if (index === 'olaceOrder') {
        this.buttonOlaceOrder = '汇总';
        this.buttonOlaceOrderTrend = '本月';

        this.getTableDataOlaceOrder();
        this.orderDataTotalTrend();
      }
      if (index === 'brokerage') {
        this.buttonBrokerage = '汇总';
        this.getTableDataBrokerage();
      }
      this.topStatus = index;
    },
    changePageBrokerage(page) {
      this.searchRowDataBrokerage.page = page;
      this.getTableDataBrokerage();
    },
    changePageSizeBrokerage(pageSize) {
      this.searchRowDataBrokerage.page = 1;
      this.searchRowDataBrokerage.rows = pageSize;
      this.getTableDataBrokerage();
    },
    changePageUse(page) {
      this.searchRowDataUse.page = page;
      this.getTableDataUse();
    },
    changePageSizeUse(pageSize) {
      this.searchRowDataUse.page = 1;
      this.searchRowDataUse.rows = pageSize;
      this.getTableDataUse();
    },
    handRankType(value) {
      this.searchRowDataBrokerage.status = value;
    },
    timeChange(value) {
      this.searchRowData.page = 1;
      if (value === '今日') {
        this.getTableData(value);
        this.mark = false;
      } else if (value === '昨日') {
        this.mark = false;
        this.getTableData(value);
      } else if (value === '汇总') {
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
        this.searchRowData.beginDate = '';
        this.searchRowData.endDate = '';
      }
    },
    timeChangeCommission(value) {
      if (value === '今日') {
        this.getTableDataCommission(value);
        this.markCommission = false;
        this.commissionStatus = false;
      } else if (value === '昨日') {
        this.markCommission = false;
        this.commissionStatus = false;
        this.getTableDataCommission(value);
      } else if (value === '汇总') {
        this.markCommission = false;
        this.commissionStatus = false;
        this.getTableDataCommission(value);
      } else if (value === '最近7天') {
        this.markCommission = false;
        this.commissionStatus = false;
        this.getTableDataCommission(value);
      } else if (value === '最近30天') {
        this.markCommission = false;
        this.commissionStatus = false;
        this.getTableDataCommission(value);
      } else if (value === '自定义时间') {
        this.markCommission = true;
        this.searchRowDataCommission.beginDate = '';
        this.searchRowDataCommission.endDate = '';
      }
    },
    timeChangeAccounts(value) {
      if (value === '今日') {
        this.getTableDataAccounts(value);
        this.markAccounts = false;
        this.accountsStatus = false;
      } else if (value === '昨日') {
        this.markAccounts = false;
        this.accountsStatus = false;
        this.getTableDataAccounts(value);
      } else if (value === '汇总') {
        this.markAccounts = false;
        this.accountsStatus = false;
        this.getTableDataAccounts(value);
      } else if (value === '最近7天') {
        this.markAccounts = false;
        this.accountsStatus = false;
        this.getTableDataAccounts(value);
      } else if (value === '最近30天') {
        this.markAccounts = false;
        this.accountsStatus = false;
        this.getTableDataAccounts(value);
      } else if (value === '自定义时间') {
        this.markAccounts = true;
        this.searchRowDataAccounts.beginDate = '';
        this.searchRowDataAccounts.endDate = '';
      }
    },
    timeChangeOlaceOrder(value) {
      if (value === '今日') {
        this.getTableDataOlaceOrder(value);
        this.markOlaceOrder = false;
        this.olaceOrderStatus = false;
      } else if (value === '昨日') {
        this.markOlaceOrder = false;
        this.olaceOrderStatus = false;
        this.getTableDataOlaceOrder(value);
      } else if (value === '汇总') {
        this.markOlaceOrder = false;
        this.olaceOrderStatus = false;
        this.getTableDataOlaceOrder(value);
      } else if (value === '最近7天') {
        this.markOlaceOrder = false;
        this.olaceOrderStatus = false;
        this.getTableDataOlaceOrder(value);
      } else if (value === '最近30天') {
        this.markOlaceOrder = false;
        this.olaceOrderStatus = false;
        this.getTableDataOlaceOrder(value);
      } else if (value === '自定义时间') {
        this.markOlaceOrder = true;
        this.searchRowDataOlaceOrder.beginDate = '';
        this.searchRowDataOlaceOrder.endDate = '';
      }
    },
    timeChangeBrokerage(value) {
      this.searchRowDataBrokerage.page = 1;
      if (value === '今日') {
        this.getTableDataBrokerage(value);
        this.markBrokerage = false;
      } else if (value === '昨日') {
        this.markBrokerage = false;
        this.getTableDataBrokerage(value);
      } else if (value === '汇总') {
        this.markBrokerage = false;
        this.getTableDataBrokerage(value);
      } else if (value === '最近7天') {
        this.markBrokerage = false;
        this.getTableDataBrokerage(value);
      } else if (value === '最近30天') {
        this.markBrokerage = false;
        this.getTableDataBrokerage(value);
      } else if (value === '自定义时间') {
        this.markBrokerage = true;
        this.searchRowDataBrokerage.createTimeBegin = '';
        this.searchRowDataBrokerage.createTimeEnd = '';
      }
    },
    timeChangeCommissionTrend(value) {
      if (value === '上月') {
        this.commissionDataTotalTrend(value);
        this.markCommissionTrend = false;
      } else if (value === '本月') {
        this.markCommissionTrend = false;
        this.commissionDataTotalTrend(value);
      } else if (value === '自定义月份') {
        this.queryMonth = '';
        this.markCommissionTrend = true;
      }
    },
    timeChangeAccountsTrend(value) {
      if (value === '上月') {
        this.settleDataTotalTrend(value);
        this.markAccountsTrend = false;
      } else if (value === '本月') {
        this.markAccountsTrend = false;
        this.settleDataTotalTrend(value);
      } else if (value === '自定义月份') {
        this.queryMonth = '';
        this.markAccountsTrend = true;
      }
    },
    timeChangeOlaceOrderTrend(value) {
      if (value === '上月') {
        this.orderDataTotalTrend(value);
        this.markOlaceOrderTrend = false;
      } else if (value === '本月') {
        this.markOlaceOrderTrend = false;
        this.orderDataTotalTrend(value);
      } else if (value === '自定义月份') {
        this.queryMonth = '';
        this.markOlaceOrderTrend = true;
      }
    },
    startTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.beginDate = value;
    },
    endTimeChange(value, date) {
      this.button = '自定义时间';
      this.searchRowData.endDate = value;
    },
    startTimeChangeBrokerage(value, date) {
      this.buttonBrokerage = '自定义时间';
      this.searchRowDataBrokerage.createTimeBegin = value;
    },
    endTimeChangeBrokerage(value, date) {
      this.buttonBrokerage = '自定义时间';
      this.searchRowDataBrokerage.createTimeEnd = value;
    },
    startTimeChangeCommission(value, date) {
      this.buttonCommission = '自定义时间';
      this.searchRowDataCommission.beginDate = value;
      this.commissionStatus = true;
      if (this.searchRowDataCommission.endDate) {
        this.getTableDataCommission();
      }
    },
    endTimeChangeCommission(value, date) {
      this.buttonCommission = '自定义时间';
      this.searchRowDataCommission.endDate = value;
      this.getTableDataCommission();
    },
    startTimeChangeAccounts(value, date) {
      this.buttonAccounts = '自定义时间';
      this.searchRowDataAccounts.beginDate = value;
      this.accountsStatus = true;
      if (this.searchRowDataAccounts.endDate) {
        this.getTableDataAccounts();
      }
    },
    endTimeChangeAccounts(value, date) {
      this.buttonAccounts = '自定义时间';
      this.searchRowDataAccounts.endDate = value;
      this.getTableDataAccounts();
    },
    startTimeChangeOlaceOrder(value, date) {
      this.buttonOlaceOrder = '自定义时间';
      this.searchRowDataOlaceOrder.beginDate = value;
      this.olaceOrderStatus = true;
      if (this.searchRowDataOlaceOrder.endDate) {
        this.getTableDataOlaceOrder();
      }
    },
    endTimeChangeOlaceOrder(value, date) {
      this.buttonOlaceOrder = '自定义时间';
      this.searchRowDataOlaceOrder.endDate = value;
      this.getTableDataOlaceOrder();
    },
    queryMonthChangeCommission(value) {
      this.queryMonth = value;
      this.commissionDataTotalTrend();
    },
    queryMonthChangeAccounts(value) {
      this.queryMonth = value;
      this.settleDataTotalTrend();
    },
    queryMonthChangeOlaceOrder(value) {
      this.queryMonth = value;
      this.orderDataTotalTrend();
    },
    handleClear() {
      this.button = '汇总';
      this.mark = false;
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch();
    },
    onSortChange(type) {
      this.searchRowData.sidx = type.key;
      this.searchRowData.sort = type.order;
      shareProdStatistics(this.searchRowData)
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
    onSortChangeUse(type) {
      this.searchRowDataUse.sidx = type.key;
      this.searchRowDataUse.sort = type.order;
      shareUserStatistics(this.searchRowDataUse)
        .then((res) => {
          this.tableDataUse = res.rows;
          this.totalPage = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    // 导出数据
    handleDownload(name) {
      if (name === 'prod') {
        // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
        this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
        const pageSize = this.searchRowData.page;
        this.searchRowData.page = 1;
        shareProdStatistics(this.searchRowData).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item['awardAmount'] = (item['awardAmount'] / 100.0).toFixed(2);
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tableDatas.handleDownload({
            filename: `分享赚商品数据统计-${date}`,
            data: tableData
          });
        });
      } else if (name === 'user') {
        this.searchRowDataUse.rows =
          this.totalPageUse > 5000 ? 5000 : this.totalPageUse;
        const pageSize = this.searchRowDataUse.page;
        this.searchRowDataUse.page = 1;
        shareUserStatistics(this.searchRowDataUse).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowDataUse.rows = 10;
          this.searchRowDataUse.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item['allOutAmount'] = (item['allOutAmount'] / 100.0).toFixed(2);
            item['countAmount'] = (item['countAmount'] / 100.0).toFixed(2);
            item['countAwardAmount'] = (
              item['countAwardAmount'] / 100.0
            ).toFixed(2);
            item['waitAmount'] = (item['waitAmount'] / 100.0).toFixed(2);
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tableDataUse.handleDownload({
            filename: `分享赚员工数据统计-${date}`,
            data: tableData
          });
        });
      } else {
        this.searchRowDataBrokerage.rows =
          this.totalBrokerage > 5000 ? 5000 : this.totalBrokerage;
        const pageSize = this.searchRowDataBrokerage.page;
        this.searchRowDataBrokerage.page = 1;
        shareawardAmountDetailTotal(this.searchRowDataBrokerage).then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowDataBrokerage.rows = 10;
          this.searchRowDataBrokerage.page = pageSize;
          // 表格数据导出字段翻译status
          tableData.forEach((item) => {
            item['awardAmount'] = (item['awardAmount'] / 100.0).toFixed(2);
            item['orderAmount'] = (item['orderAmount'] / 100.0).toFixed(2);
            if (item['status'] === 'WAIT') {
              item['status'] = '待入账';
            } else if (item['status'] === 'SUCCESS') {
              item['status'] = '已入账';
            } else {
              item['status'] = '入账失败';
            }
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tablesBrokerage.handleDownload({
            filename: `分享赚佣金明细数据统计-${date}`,
            data: tableData
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
  width: 600px;
  font-size: 14px;
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
  padding: 0 10px;
}
</style>
