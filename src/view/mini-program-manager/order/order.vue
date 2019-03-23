<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="20"
        :operate-area-column="4"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-current-change="onCurrentChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.code"
              placeholder="订单编码"
              class="search-input mr5"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userPhone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 100px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.orderType"
              class="search-col mr5"
              placeholder="订单类型"
              style="width: 100px"
              clearable
            >
              <Option
                v-for="item in orderType"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.orderStatuses"
              multiple
              class="search-col mr5"
              placeholder="订单状态"
              style="width: 150px"
              clearable
              @on-change="orderStatusesOnChange"
            >
              <Option
                v-for="item in orderStatus"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.startAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 160px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endAt"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              class="mr5"
              style="width: 160px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn ml5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="deliverOrderLoading"
            class="search-btn mr5"
            type="warning"
            @click="deliverOrder"
          >门店调货</Button>
          <!-- 多类型导出 -->
          <BookTypeOption v-model="exportType" class="mr5"/>
          <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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

    <!--查看订单详情-->
    <Modal v-model="modalView" :width="700">
      <p slot="header">
        <span>查看订单详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单编号:</i-col>
              <i-col span="16">{{ orderDetail.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户手机号:</i-col>
              <i-col span="16">{{ orderDetail.userPhone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户昵称:</i-col>
              <i-col span="16">{{ orderDetail.nickname }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单类型:</i-col>
              <i-col span="18">{{ orderDetail.orderType|orderTypeFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">收货方式:</i-col>
              <i-col span="16">{{ orderDetail.receivingWay|receivingWayFilters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单状态:</i-col>
              <i-col span="16">{{ orderDetail.status|orderStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row style="background: lightgray;margin-bottom: 10px">
          <Row>
            <i-col span="24">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货地址:</i-col>
                <i-col span="16">
                  {{ orderDetail.address +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+ orderDetail.nickname +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+
                  orderDetail.userPhone }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货时间:</i-col>
                <i-col span="16">{{ orderDetail.deliverAt }}</i-col>
              </Row>
            </i-col>
          </Row>
          <tables :columns="tempColumnsView" v-model="deliverNoteList" border></tables>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单总额:</i-col>
              <i-col span="16">{{ orderDetail.totalAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">优惠金额:</i-col>
              <i-col span="16">{{ orderDetail.couponAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">折后金额:</i-col>
              <i-col span="16">{{ orderDetail.amountPayable|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户配送费:</i-col>
              <i-col span="16">{{ orderDetail.deliveryAmount|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎编码:</i-col>
              <i-col span="16">{{ orderDetail.hdOrderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎备货时间:</i-col>
              <i-col span="16">{{ orderDetail.hdStockAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{ orderDetail.createAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单备注:</i-col>
              <i-col span="16">{{ orderDetail.remark }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <tables :columns="orderViewRelationsColumn" v-model="orderDetail.orderProductList" border></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="transferModalView">
      <p slot="header">
        <span>订单调货</span>
      </p>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">订单编号:</i-col>
            <i-col span="16">{{ currentTableRowSelected.code }}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">送货方式:</i-col>
            <i-col span="16">{{ currentTableRowSelected.receivingWay|receivingWayFilters }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">当前门店:</i-col>
            <i-col span="16">{{ currentTableRowSelected.orderStore }}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">订单状态:</i-col>
            <i-col span="16">{{ currentTableRowSelected.status|orderStatusFilters }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="15">
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="8">调货门店:</i-col>
            <Select
              v-model="currentTableRowSelected.orderStore"
              class="search-col mr5"
              placeholder="调货门店"
              style="width: 200px"
              clearable
            >
              <Option
                v-for="item in storeList"
                :value="item.id"
                :key="`search-col-${item.id}`"
                class="ptb2-5"
              >{{ item.name }}</Option>
            </Select>
          </Row>
        </i-col>
      </Row>
      <Row style="background: lightgray">
        <i-col span="24" style="padding-left: 15px">满足以下几个条件的订单才允许调货：
          <br>1.仅门店自提订单；
          <br>2.订单状态为待收货；
          <br>3.海鼎状态为发送成功
          <br>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="handleEditCloseTransferModalView">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">调货</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getOrderPages
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { fenToYuanDot2 } from '@/libs/util';
import {
  receivingWayEnum,
  orderStatusEnum,
  orderTypeEnum
} from '@/libs/enumerate';
import {
  orderTypeConvert,
  thirdDeliverStatusConvert
} from '@/libs/converStatus';
import {
  orderStatusConvert,
  receivingWayConvert
} from '../../../libs/converStatus';

import BookTypeOption from '_c/book-type-option';

const orderDetail = {
  id: 0,
  code: '',
  userId: 0,
  apply: null,
  orderType: null,
  storeId: 0,
  storeCode: '',
  storeName: '',
  receivingWay: null,
  totalAmount: 0,
  amountPayable: 0,
  deliveryAmount: 0,
  couponAmount: 0,
  hdStatus: null,
  orderStatus: null,
  address: '',
  reason: '',
  createAt: null,
  receiveUser: '',
  contactPhone: '',
  remark: '',
  deliveryEndTime: null,
  payType: '',
  payAt: null,
  activityTeambuyContent: ''
};
const roleRowData = {
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
      orderType: orderTypeEnum,
      orderStatus: orderStatusEnum,
      deliverNoteList: [],
      haiDingStatus: [],
      transferModalView: false,
      modalViewLoading: false,
      deliverOrderLoading: false,
      storeList: [],
      tempColumnsView: [
        {
          title: '配送方',
          minWidth: 100,
          key: 'deliverType'
        },
        {
          title: '配送距离',
          minWidth: 100,
          key: 'distance'
        },
        {
          title: '配送费',
          minWidth: 100,
          key: 'fee',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.fee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '配送状态',
          minWidth: 100,
          key: 'deliverStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return (
              <div>{thirdDeliverStatusConvert(row.deliverStatus).label}</div>
            );
          }
        },
        {
          title: '接单时间',
          minWidth: 100,
          key: 'receiveTime'
        },
        {
          title: '配送员手机号',
          minWidth: 110,
          key: 'deliverPhone'
        }
      ],
      orderViewRelationsColumn: [
        {
          title: '商品名称',
          minWidth: 100,
          key: 'productName'
        },
        {
          title: '商品条码',
          minWidth: 100,
          key: 'barcode'
        },
        {
          title: '规格',
          minWidth: 100,
          key: 'shelfSpecification'
        },
        {
          title: '购买份数',
          minWidth: 100,
          key: 'productQty'
        },
        {
          title: '商品总金额',
          minWidth: 100,
          key: 'totalPrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalPrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '折后总金额',
          minWidth: 100,
          key: 'discountPrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.discountPrice);
            return <div>{amount}</div>;
          }
        }
      ],
      columns: [
        {
          title: '订单编号',
          key: 'code',
          sortable: true,
          width: 170,
          fixed: 'left'
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createAt'
        },
        {
          title: '订单用户',
          width: 150,
          key: 'userId'
        },
        {
          title: '下单门店',
          width: 150,
          key: 'storeName'
        },
        {
          title: '订单总价',
          width: 120,
          key: 'totalAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠金额',
          width: 120,
          key: 'couponAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '运费',
          width: 120,
          key: 'deliveryAmount',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.deliveryAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '应付金额',
          width: 120,
          key: 'amountPayable',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        {
          title: '提货类型',
          width: 120,
          key: 'receivingWay',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.receivingWay === 'TO_THE_HOME') {
              return <div><tag color='green'>{receivingWayConvert(row.receivingWay).label}</tag></div>;
            } else if (row.receivingWay === 'TO_THE_STORE') {
              return <div><tag color='gold'>{receivingWayConvert(row.receivingWay).label}</tag></div>;
            } else {
              return <div>{row.receivingWay}</div>;
            }
          }
        },
        {
          title: '订单状态',
          width: 120,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            // WAIT_PAYMENT("待支付"),WAIT_SEND_OUT("待出库"),
            // SEND_OUTING("出库中"),WAIT_DISPATCHING("待配送"),DISPATCHING("配送中"),RECEIVED("已收货"),RETURNING("退货中"),
            // RETURN_FAILURE("退款失败"),FAILURE("已失效"),
            // ALREADY_RETURN("退货完成"),FINISHED("完成")
            if (row.status === 'WAIT_PAYMENT' || row.status === 'WAIT_SEND_OUT') {
              return <div><tag color='default'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'SEND_OUTING' || row.status === 'WAIT_DISPATCHING' || row.status === 'DISPATCHING' || row.status === 'RECEIVED' || row.status === 'RETURNING') {
              return <div><tag color='primary'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'RETURN_FAILURE' || row.status === 'FAILURE') {
              return <div><tag color='error'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'ALREADY_RETURN' || row.status === 'FINISHED') {
              return <div><tag color='success'>{orderStatusConvert(row.status).label}</tag></div>;
            } else {
              return <div>{row.status}</div>;
            }
          }
        },
        {
          title: '海鼎状态',
          width: 120,
          key: 'hdStatus',
          render: (h, params, vm) => {
            const { row } = params;
            // WAIT_PAYMENT("待支付"),WAIT_SEND_OUT("待出库"),
            // SEND_OUTING("出库中"),WAIT_DISPATCHING("待配送"),DISPATCHING("配送中"),RECEIVED("已收货"),RETURNING("退货中"),
            // RETURN_FAILURE("退款失败"),FAILURE("已失效"),
            // ALREADY_RETURN("退货完成"),FINISHED("完成")
            if (row.hdStatus === 'WAIT_PAYMENT' || row.hdStatus === 'WAIT_SEND_OUT') {
              return <div><tag color='default'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'SEND_OUTING' || row.status === 'WAIT_DISPATCHING' || row.status === 'DISPATCHING' || row.status === 'RECEIVED' || row.status === 'RETURNING') {
              return <div><tag color='primary'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'RETURN_FAILURE' || row.status === 'FAILURE') {
              return <div><tag color='error'>{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'ALREADY_RETURN' || row.status === 'FINISHED') {
              return <div><tag color='success'>{orderStatusConvert(row.status).label}</tag></div>;
            } else {
              return <div>{row.status}</div>;
            }
          }
        },
        {
          title: '海鼎备货时间',
          width: 160,
          key: 'hdStockAt',
          sortable: true
        },
        {
          title: '配送状态',
          width: 160,
          key: 'deliverStatus',
          sortable: true
        },
        {
          title: '配送距离(km)',
          width: 160,
          key: 'distance',
          sortable: true
        },
        {
          title: '配送重量(kg)',
          width: 160,
          key: 'weight',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          fixed: 'right',
          options: ['view']
        }
      ],
      currentTableRowSelected: null,
      searchRowData: this._.cloneDeep(roleRowData),
      orderDetail: this._.cloneDeep(orderDetail),
      exportType: 'xlsx',
      downloadLoading: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    orderStatusesOnChange(value) {
      console.log(value);
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.startAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endAt = value;
    },
    handleEditCloseTransferModalView() {
      this.transferModalView = false;
    },
    handleEditClose() {
      this.modalViewLoading = false;
    },
    handleSubmit() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          '请用鼠标左键点击选择下方表格一行订单数据,才能进行调货处理'
        );
        return;
      }
      if (!this.currentTableRowSelected.orderStore) {
        this.$Message.error('该订单门店id为空');
        return;
      }
      if (
        this.currentTableRowSelected.receivingWay !==
        receivingWayEnum.TO_THE_STORE
      ) {
        this.$Message.error('该订单提货方式不是门店自提！');
        return;
      }
      if (this.currentTableRowSelected.status !== orderStatusEnum.SEND_OUTING) {
        this.$Message.error('该订单不为待收货或者海鼎发送没有成功！');
        return;
      }
    },
    deliverOrder() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          '请用鼠标左键点击选择下方表格一行订单数据,才能进行调货处理'
        );
        return;
      }
      this.transferModalView = true;
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.orderDetail = this._.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) { },
    getTableData() {
      this.loading = true;
      getOrderPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      });
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      // this.searchRowData.applicationType = this.applicationType;
      getOrderPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['code'] = item['code'] + '';
          item['totalAmount'] = (item['totalAmount'] / 100.00).toFixed(2);
          item['couponAmount'] = (item['couponAmount'] / 100.00).toFixed(2);
          item['amountPayable'] = (item['amountPayable'] / 100.00).toFixed(2);
          item['orderType'] = orderTypeConvert(item['orderType']).label;
          item['deliverStatus'] = thirdDeliverStatusConvert(item['deliverStatus']).label;
          item['receivingWay'] = receivingWayConvert(item['receivingWay']).label;
          item['status'] = orderStatusConvert(item['status']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `普通订单信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}

.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
