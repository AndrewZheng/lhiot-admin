<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        @on-view="handleView"
        :searchAreaColumn="20"
        :operateAreaColumn="4"
        @on-current-change="onCurrentChange"
      >
        <div slot="searchCondition">
          <Row>
              <Input
                placeholder="订单编码"
                class="search-input mr5"
                v-model="searchRowData.code"
                style="width: 120px"
                clearable
              />
              <Input
                placeholder="用户手机号"
                class="search-input mr5"
                v-model="searchRowData.userPhone"
                style="width: 100px"
                clearable
              />
              <Select
                class="search-col mr5"
                placeholder="订单类型"
                style="width: 100px"
                v-model="searchRowData.orderType"
                clearable
              >
                <Option
                  v-for="item in orderType"
                  :value="item.value"
                  class="ptb2-5"
                  :key="`search-col-${item.value}`"
                >{{item.label}}</Option>
              </Select>
              <Select
                multiple
                class="search-col mr5"
                placeholder="订单状态"
                style="width: 150px"
                @on-change="orderStatusesOnChange"
                v-model="searchRowData.orderStatuses"
                clearable
              >
                <Option
                  v-for="item in orderStatus"
                  :value="item.value"
                  class="ptb2-5"
                  :key="`search-col-${item.value}`"
                >{{item.label}}</Option>
              </Select>
              <DatePicker
                v-model="searchRowData.startAt"
                @on-change="startTimeChange"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="开始时间"
                class="mr5"
                style="width: 160px"
              />
              <i>-</i>
              <DatePicker
                v-model="searchRowData.endAt"
                @on-change="endTimeChange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间"
                class="mr5"
                style="width: 160px"
              />
            <Button
              v-waves
              @click="handleSearch"
              class="search-btn ml5"
              type="primary"
              :loading="searchLoading"
            >
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button
              v-waves
              @click="handleClear"
              class="search-btn"
              type="info"
              :loading="clearSearchLoading"
            >
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            @click="deliverOrder"
            class="search-btn mr5"
            :loading="deliverOrderLoading"
            type="warning"
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
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-sizer
            show-total
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
              <i-col span="16">{{orderDetail.code}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户手机号:</i-col>
              <i-col span="16">{{orderDetail.userPhone}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户昵称:</i-col>
              <i-col span="16">{{orderDetail.nickname}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单类型:</i-col>
              <i-col span="18">{{orderDetail.orderType|orderTypeFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">收货方式:</i-col>
              <i-col span="16">{{orderDetail.receivingWay|receivingWayFilters}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单状态:</i-col>
              <i-col span="16">{{orderDetail.status|orderStatusFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row style="background: lightgray;margin-bottom: 10px">
          <Row>
            <i-col span="24">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货地址:</i-col>
                <i-col span="16">
                  {{orderDetail.address +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+ orderDetail.nickname +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+
                  orderDetail.userPhone}}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货时间:</i-col>
                <i-col span="16">{{orderDetail.deliverAt}}</i-col>
              </Row>
            </i-col>
          </Row>
          <tables border :columns="tempColumnsView" v-model="deliverNoteList"></tables>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单总额:</i-col>
              <i-col span="16">{{orderDetail.totalAmount|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">优惠金额:</i-col>
              <i-col span="16">{{orderDetail.couponAmount|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">折后金额:</i-col>
              <i-col span="16">{{orderDetail.amountPayable|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户配送费:</i-col>
              <i-col span="16">{{orderDetail.deliveryAmount|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎编码:</i-col>
              <i-col span="16">{{orderDetail.hdOrderCode}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎备货时间:</i-col>
              <i-col span="16">{{orderDetail.hdStockAt}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{orderDetail.createAt}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单备注:</i-col>
              <i-col span="16">{{orderDetail.remark}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <tables border :columns="orderViewRelationsColumn" v-model="orderDetail.orderProductList"></tables>
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
            <i-col span="16">{{currentTableRowSelected.code}}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">送货方式:</i-col>
            <i-col span="16">{{currentTableRowSelected.receivingWay|receivingWayFilters}}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">当前门店:</i-col>
            <i-col span="16">{{currentTableRowSelected.orderStore.storeName}}</i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <Row class-name="mb20">
            <i-col span="8">订单状态:</i-col>
            <i-col span="16">{{currentTableRowSelected.status|orderStatusFilters}}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="currentTableRowSelected">
        <i-col span="15">
          <Row type="flex" :gutter="8" align="middle" class-name="mb10">
            <i-col span="8">调货门店:</i-col>
            <Select
              v-model="currentTableRowSelected.orderStore.storeId"
              class="search-col mr5"
              placeholder="调货门店"
              style="width: 200px"
              clearable
            >
              <Option
                class="ptb2-5"
                v-for="item in storeList"
                :value="item.id"
                :key="`search-col-${item.id}`"
              >{{item.name}}</Option>
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
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit">调货</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getOrdersPages,
  getOrderDetail,
  transferHdOrder,
  getStore
} from '@/api/fruitermaster';
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
  userId: '',
  userPhone: '',
  applicationType: '',
  orderType: '',
  receivingWay: '',
  totalAmount: 0,
  amountPayable: 0,
  deliveryAmount: 0,
  couponAmount: 0,
  hdStockAt: '',
  status: '',
  receiveUser: '',
  contactPhone: '',
  address: '',
  remark: '',
  deliveryEndAt: '',
  hdOrderCode: '',
  nickname: null,
  deliverAt: null,
  allowRefund: null,
  createAt: '',
  payId: null,
  orderProductList: [],
  orderStore: {},
  orderFlowList: [],
  deliverNote: {},
  discountPrice: 0
};
const roleRowData = {
  startAt: null,
  endAt: null,
  code: null,
  userPhone: null,
  orderStatuses: null,
  orderType: null,
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
            let amount = fenToYuanDot2(params.row.fee);
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
            let amount = fenToYuanDot2(params.row.totalPrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '折后总金额',
          minWidth: 100,
          key: 'discountPrice',
          render(h, params, vm) {
            let amount = fenToYuanDot2(params.row.discountPrice);
            return <div>{amount}</div>;
          }
        }
      ],
      columns: [
        {
          title: '订单编码',
          key: 'code',
          sortable: true,
          width: 170,
          fixed: 'left'
        },
        {
          title: '用户手机号',
          width: 150,
          key: 'userPhone'
        },
        {
          title: '订单类型',
          width: 120,
          key: 'orderType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.orderType === 'NORMAL') {
              return <div><tag color="blue">{orderTypeConvert(row.orderType).label}</tag></div>;
            } else if (row.orderType === 'CUSTOM') {
              return <div><tag color="cyan">{orderTypeConvert(row.orderType).label}</tag></div>;
            } else {
               return <div>{row.orderType}</div>;
            }
          }
        },
        {
          title: '订单总金额',
          width: 120,
          key: 'totalAmount',
          render(h, params, vm) {
            let amount = fenToYuanDot2(params.row.totalAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠金额',
          width: 120,
          key: 'couponAmount',
          render(h, params, vm) {
            let amount = fenToYuanDot2(params.row.couponAmount);
            return <div>{amount}</div>;
          }
        },
        {
          title: '应付金额',
          width: 120,
          key: 'amountPayable',
          render(h, params, vm) {
            let amount = fenToYuanDot2(params.row.amountPayable);
            return <div>{amount}</div>;
          }
        },
        {
          title: '收货方式',
          width: 120,
          key: 'receivingWay',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.receivingWay === 'TO_THE_HOME') {
              return <div><tag color="green">{receivingWayConvert(row.receivingWay).label}</tag></div>;
            } else if (row.receivingWay === 'TO_THE_STORE') {
              return <div><tag color="gold">{receivingWayConvert(row.receivingWay).label}</tag></div>;
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
              return <div><tag color="default">{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'SEND_OUTING' || row.status === 'WAIT_DISPATCHING' || row.status === 'DISPATCHING' || row.status === 'RECEIVED' || row.status === 'RETURNING') {
              return <div><tag color="primary">{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'RETURN_FAILURE' || row.status === 'FAILURE') {
              return <div><tag color="error">{orderStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'ALREADY_RETURN' || row.status === 'FINISHED') {
              return <div><tag color="success">{orderStatusConvert(row.status).label}</tag></div>;
            } else {
               return <div>{row.status}</div>;
            }
          }
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createAt',
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
    this.deliverOrderLoading = true;
    getStore().then(res => {
      this.storeList = res.array;
      this.deliverOrderLoading = false;
      this.getTableData();
    }).catch(error => {
      this.deliverOrderLoading = false;
    });
  },
  methods: {
    orderStatusesOnChange(value) {
      console.log(value);
      if (value.length===0) {
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
      if (!this.currentTableRowSelected.orderStore.storeId) {
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
      this.deliverOrderLoading = true;
      transferHdOrder({
        code: this.currentTableRowSelected.code,
        storeId: this.currentTableRowSelected.orderStore.storeId
      }).then(res => {
        this.deliverOrderLoading = false;
        this.getTableData();
      }).catch(error => {
        this.deliverOrderLoading = false;
      });
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
      this.loading = true;
      getOrderDetail({ code: params.row.code })
        .then(res => {
          this.orderDetail = res;
          if (res.deliverNote) {
            this.deliverNoteList.length = 0;
            this.deliverNoteList.push(res.deliverNote);
          }
          this.modalView = true;
        }).catch(res => {
          this.loading = false;
        });
    },
    handleEdit(params) { },
    getTableData() {
      this.loading = true;
      getOrdersPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
        this.searchLoading = false;
      }).catch(error => {
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
      getOrdersPages(this.searchRowData).then(res => {
        let tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['code'] = item['code'] + '';
          item['totalAmount'] = (item['totalAmount'] /100.00).toFixed(2);
          item['couponAmount'] = (item['couponAmount'] /100.00).toFixed(2);
          item['amountPayable'] = (item['amountPayable'] /100.00).toFixed(2);
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
