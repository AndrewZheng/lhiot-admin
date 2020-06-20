<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="19"
        :operate-area-column="5"
        editable
        searchable
        border
        highlight-row
        search-place="top"
      >
        <div slot="searchCondition">
          <Row>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              class="mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn ml5"
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
          </Row>
          <div class="ml15 mt10">
            <i style="color:red">*</i> 默认展示上月退款数据
          </div>
        </div>
        <div slot="operations" style="margin-left:-50px">
          <Button v-waves class="search-btn ml5 mr5" type="primary" @click="goBack">
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button
            :loading="downloadLoading"
            class="search-btn mr2"
            type="warning"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出数据
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { monthOrderPages } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { fenToYuanDot2, gitTime } from '@/libs/util';
import {
  receivingWayEnum,
  receivingWay,
  orderStatusEnum,
  miniOrderTypeEnum,
  appTypeEnum,
  miniOrderStatusEnum,
  miniOrderStatus,
  miniHdStatusEnum,
  miniHdStatus
} from '@/libs/enumerate';
import {
  orderTypeConvert,
  thirdDeliverStatusConvert,
  miniOrderStatusConvert,
  miniHdStatusConvert,
  receivingWayConvert,
  appTypeConvert,
  payTypeConvert,
  isAllRefundConvert
} from '@/libs/converStatus';
import BookTypeOption from '_c/book-type-option';
const orderDetail = {
  id: 0,
  amountPayable: '', // 应付金额
  code: '', // 订单编号
  couponAmount: '', // 优惠金额
  couponEntityStatus: '', // 优惠券实体状态
  couponFee: '', // 优惠金额
  couponName: '', // 优惠券名称
  couponType: null, // 优惠券类型
  createAt: '', // 创建时间
  minBuyFee: '', //
  nickname: '', // 用户昵称
  receiveTime: '', // 用户领取时间
  source: '',
  storeCode: '', // 门店编码
  storeName: '', // 门店名称
  totalAmount: '', // 订单总价
  useTime: '', // 使用时间
  userId: '', // 订单用户
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  startTime: '',
  endTime: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      deliverNoteList: [],
      haiDingStatus: [],
      storeList: [],
      transferModalView: false,
      modalViewLoading: false,
      deliverOrderLoading: false,
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '订单编号',
          key: 'code',
          minWidth: 170,
          sortable: true,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '门店名称',
          minWidth: 90,
          align: 'center',
          key: 'storeName'
        },
        {
          title: '用户名称',
          align: 'center',
          minWidth: 90,
          key: 'receiveUser'
        },
        {
          title: '联系方式',
          align: 'center',
          minWidth: 120,
          key: 'contactPhone'
        },
        {
          title: '订单金额',
          minWidth: 90,
          align: 'center',
          key: 'totalAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '券金额',
          align: 'center',
          minWidth: 80,
          key: 'couponAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '支付金额',
          align: 'center',
          minWidth: 90,
          key: 'amountPayable',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        {
          title: '是否退款',
          align: 'center',
          width: 120,
          key: 'isAllRefund',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.isAllRefund === 'NO' && row.status === 'ALREADY_RETURN') {
              return (
                <div>
                  <tag color='cyan'>
                    {isAllRefundConvert(row.isAllRefund)}
                  </tag>
                </div>
              );
            } else if (row.status === 'ALREADY_RETURN') {
              return (
                <div>
                  <tag color='blue'>全部退款</tag>
                </div>
              );
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '退款金额',
          align: 'center',
          minWidth: 90,
          key: 'refundFee',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.refundFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '配送费',
          minWidth: 80,
          align: 'center',
          key: 'deliveryAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.deliveryAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '应用类型',
          key: 'applyType',
          align: 'center',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.applyType === 'WXSMALL_SHOP') {
              return (
                <div>
                  <tag color='green'>{appTypeConvert(row.applyType).label}</tag>
                </div>
              );
            } else if (row.applyType === 'S_MALL') {
              return (
                <div>
                  <tag color='gold'>{appTypeConvert(row.applyType).label}</tag>
                </div>
              );
            } else {
              return <div>{row.applyType}</div>;
            }
          }
        },
        {
          title: '订单状态',
          align: 'center',
          width: 120,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (
              row.status === 'WAIT_PAYMENT' ||
              row.status === 'PAYMENTING' ||
              row.status === 'WAIT_SEND_OUT'
            ) {
              return (
                <div>
                  <tag color='default'>
                    {miniOrderStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (
              row.status === 'SEND_OUT' ||
              row.status === 'DISPATCHING' ||
              row.status === 'RECEIVED' ||
              row.status === 'RETURNING'
            ) {
              return (
                <div>
                  <tag color='primary'>
                    {miniOrderStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === 'FAILURE') {
              return (
                <div>
                  <tag color='error'>
                    {miniOrderStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (
              row.status === 'ALREADY_RETURN' ||
              row.status === 'FINISHED'
            ) {
              return (
                <div>
                  <tag color='success'>
                    {miniOrderStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.status}</div>;
            }
          }
        },
        {
          title: '海鼎状态',
          align: 'center',
          width: 100,
          key: 'hdStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.hdStatus === 'NOT_SEND') {
              return (
                <div>
                  <tag color='warning'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === 'SEND_OUT') {
              return (
                <div>
                  <tag color='success'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else if (row.hdStatus === 'SEND_FAILURE') {
              return (
                <div>
                  <tag color='error'>
                    {miniHdStatusConvert(row.hdStatus).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.hdStatus}</div>;
            }
          }
        },
        {
          title: '提货类型',
          align: 'center',
          width: 120,
          key: 'receivingWay',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.receivingWay === 'TO_THE_HOME') {
              return (
                <div>
                  <tag color='green'>
                    {receivingWayConvert(row.receivingWay)}
                  </tag>
                </div>
              );
            } else if (row.receivingWay === 'TO_THE_STORE') {
              return (
                <div>
                  <tag color='gold'>
                    {receivingWayConvert(row.receivingWay)}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.receivingWay}</div>;
            }
          }
        },
        {
          title: '支付类型',
          width: 120,
          align: 'center',
          key: 'payType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.payType === 'weixin') {
              return (
                <div>
                  <tag color='success'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === 'balance') {
              return (
                <div>
                  <tag color='pink'>{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '创建时间',
          minWidth: 160,
          align: 'center',
          key: 'createAt',
          render(h, params, vm) {
            const createTime = gitTime(params.row.createAt);
            return <div>{createTime}</div>;
          }
        },
        {
          title: '退款时间',
          minWidth: 160,
          align: 'center',
          key: 'refundAt',
          render(h, params, vm) {
            const refundTime = gitTime(params.row.refundAt);
            return <div>{refundTime}</div>;
          }
        }
      ],
      currentTableRowSelected: null,
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      exportType: 'xlsx',
      downloadLoading: false,
      tableDataSelected: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    startTimeChange(value, date) {
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endTime = value;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    goBack() {
      this.turnToPage('small-order');
    },
    getTableData() {
      this.loading = true;
      monthOrderPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        });
    },
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      monthOrderPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach(item => {
          const obj = _this.storeList.find(x => item.storeId === x.storeId);
          item['code'] = item['code'] + '';
          item['apply'] = appTypeConvert(item['apply']).label;
          item['storeId'] =
            obj && obj.storeName ? obj.storeName : item['storeId']; // 如果找不到就显示门店Id
          item['totalAmount'] = (item['totalAmount'] / 100.0).toFixed(2);
          item['amountPayable'] = (item['amountPayable'] / 100.0).toFixed(2);
          item['couponAmount'] = (item['couponAmount'] / 100.0).toFixed(2);
          item['deliveryAmount'] = (item['deliveryAmount'] / 100.0).toFixed(2);
          item['refundFee'] = (item['refundFee'] / 100.0).toFixed(2);
          item['orderType'] = orderTypeConvert(item['orderType']);
          item['deliverStatus'] = thirdDeliverStatusConvert(
            item['deliverStatus']
          );
          item['orderStatus'] = miniOrderStatusConvert(
            item['orderStatus']
          ).label;
          item['payType'] = payTypeConvert(item['payType']).label;
          item['isAllRefund'] = isAllRefundConvert(item['isAllRefund']);
          item['applyType'] = appTypeConvert(item['applyType']).label;
          item['hdStatus'] = miniHdStatusConvert(item['hdStatus']).label;
          item['receivingWay'] = receivingWayConvert(
            item['receivingWay']
          );
          item['createAt'] = gitTime(item['createAt']);
          item['refundAt'] = gitTime(item['refundAt']);
          item['status'] = miniOrderStatusConvert(item['status']).label;
          // console.log("时间",item["refundAt"])
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `跨月退款订单数据-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
