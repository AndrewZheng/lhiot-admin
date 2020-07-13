<template>
  <div class="m-role">
    <Card>
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
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userName"
              placeholder="用户名"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 105px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.paymentType"
              class="search-col mr5"
              placeholder="支付方式"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in wholesalePayTypeEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.paymentFrom"
              class="search-col mr5"
              placeholder="支付来源"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in paymentFromEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.paymentTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="支付时间起"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.paymentTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="支付时间止"
              class="mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
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
          </Row>
        </div>
        <div slot="operations">
          <Button
            :loading="downloadLoading"
            class="search-btn mr2"
            type="primary"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="20"
            :page-size-opts="templatePageOpts"
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
import { getPaymentLogPages } from '@/api/wholesale';
import { fenToYuanDot2, fenToYuanDot2Number } from '@/libs/util';
import { paymentFromEnum, wholesalePayTypeEnum } from '@/libs/enumerate';
import {
  wholesalePayTypeConvert,
  paymentFromConvert
} from '@/libs/converStatus';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const paymentLog = {
  bankName: '',
  bankType: '',
  id: 0,
  orderCode: '',
  orderId: 0,
  paymentFrom: '', // order-订单 debt-账款 invoice-发票 recharge-充值
  paymentStep: 'paid', // sign-签名成功 paid-支付成功
  paymentTime: '',
  paymentTimeBegin: '',
  paymentTimeEnd: '',
  paymentType: '', // balance-余额支付 wechat-微信 offline-线下支付
  refundFee: 0,
  totalFee: 0,
  transactionId: '',
  userId: 0
};

const rowData = {
  orderCode: '',
  paymentFrom: 'recharge',
  paymentType: '',
  paymentStep: 'paid',
  paymentTimeBegin: null,
  paymentTimeEnd: null,
  sidx: 'id',
  sort: 'desc',
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      paymentFromEnum,
      wholesalePayTypeEnum,
      downloadLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(rowData),
      paymentLog: _.cloneDeep(paymentLog),
      columns: [
        {
          title: '编号',
          key: 'id',
          align: 'center',
          fixed: 'left',
          minWidth: 40
        },
        {
          title: '订单编码',
          key: 'orderCode',
          align: 'center',
          fixed: 'left',
          minWidth: 150
        },
        {
          title: '微信交易流水号',
          key: 'transactionId',
          align: 'center',
          fixed: 'left',
          minWidth: 200
        },
        {
          title: '用户名',
          align: 'center',
          key: 'userName',
          minWidth: 80
        },
        {
          title: '手机号',
          align: 'center',
          key: 'phone',
          minWidth: 120
        },
        {
          title: '支付来源',
          align: 'center',
          key: 'paymentFrom',
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.paymentFrom === 'order') {
              return <div>订单</div>;
            } else if (row.paymentFrom === 'debt') {
              return <div>账款</div>;
            } else if (row.paymentFrom === 'invoice') {
              return <div>发票</div>;
            } else if (row.paymentFrom === 'recharge') {
              return <div>充值</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '支付类型',
          align: 'center',
          key: 'paymentType',
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.paymentType === 'wechat') {
              return (
                <div>
                  <tag color='success'>
                    {wholesalePayTypeConvert(row.paymentType)}
                  </tag>
                </div>
              );
            } else if (row.paymentType === 'balance') {
              return (
                <div>
                  <tag color='primary'>
                    {wholesalePayTypeConvert(row.paymentType)}
                  </tag>
                </div>
              );
            } else if (row.paymentType === 'offline') {
              return (
                <div>
                  <tag color='warning'>
                    {wholesalePayTypeConvert(row.paymentType)}
                  </tag>
                </div>
              );
            } else if (row.paymentType === 'haiding') {
              return (
                <div>
                  <tag color='warning'>
                    {wholesalePayTypeConvert(row.paymentType)}
                  </tag>
                </div>
              );
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '支付金额',
          align: 'center',
          key: 'totalFee',
          minWidth: 150,
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '支付时间',
          align: 'center',
          minWidth: 130,
          key: 'paymentTime'
        }
      ]
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(rowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = this._.cloneDeep(rowData);
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      this.searchLoading = true;
      this.clearSearchLoading = true;
      getPaymentLogPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    startTimeChange(value, date) {
      console.log('beginTime:', value);
      this.searchRowData.paymentTimeBegin = value;
    },
    endTimeChange(value, data) {
      console.log('endTime:', value);
      this.searchRowData.paymentTimeEnd = value;
    },
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getPaymentLogPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['orderCode'] = item['orderCode'] + '';
          item['transactionId'] = item['transactionId'] + '';
          item['totalFee'] = (item['totalFee'] / 100.0).toFixed(2);
          item['paymentFrom'] = paymentFromConvert(item['paymentFrom']);
          item['paymentType'] = wholesalePayTypeConvert(
            item['paymentType']
          );
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleDownload({
          filename: `支付流水-${date}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
