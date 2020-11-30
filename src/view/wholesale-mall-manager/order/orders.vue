<template>
  <div class="m-content">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="7"
        :need-permission="false"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-hand="handleReimburse"
        @on-receive="handSureReceive"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input mr5"
              style="width: 150px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userName"
              placeholder="用户名"
              class="search-input mr5"
              style="width: 70px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 90px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.payStatus"
              class="search-col mr5"
              placeholder="支付状态"
              style="width: 85px"
              clearable
            >
              <Option
                v-for="item in payStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.orderStatus"
              class="search-col mr5"
              placeholder="订单状态"
              style="width: 85px"
              clearable
            >
              <Option
                v-for="item in wholesaleOrderStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.createTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.createTimeEnd"
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
              class="search-btn ml5 mr5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button
              :loading="downloadLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出订单
            </Button>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current.sync="page"
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

    <!-- 查看订单详情-->
    <Modal v-model="modalView" :width="1000" :mask-closable="false">
      <p slot="header">
        <span>查看订单详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单编号:</i-col>
              <i-col span="18">{{ orderDetail.orderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单状态:</i-col>
              <i-col span="18">{{
                orderDetail.orderStatus | wholesaleOrderStatusFilter
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">下单时间:</i-col>
              <i-col span="18">{{ orderDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">支付信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付类型:</i-col>
              <i-col span="18">{{
                orderDetail.settlementType | wholeslaePayTypeFilter
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付状态:</i-col>
              <i-col span="18">{{
                orderDetail.payStatus | payStatusFilter
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">订单金额:</i-col>
              <i-col span="18">{{
                orderDetail.totalFee | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">优惠金额:</i-col>
              <i-col span="18">{{
                orderDetail.discountFee | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">配送费:</i-col>
              <i-col span="18">{{
                orderDetail.deliveryFee | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">应付金额:</i-col>
              <i-col span="18">{{
                orderDetail.payableFee | fenToYuanDot2Filters
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">支付时间:</i-col>
              <i-col span="18">{{
                orderDetail.paymentTime ? orderDetail.paymentTime : "N/A"
              }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">用户信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">用户名称:</i-col>
              <i-col span="18">{{ orderDetail.userName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">用户手机:</i-col>
              <i-col span="18">{{ orderDetail.phone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">用户备注:</i-col>
              <i-col span="18">{{
                orderDetail.remarks ? orderDetail.remarks : "N/A"
              }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">配送信息</Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货人:</i-col>
              <i-col span="18">{{ deliveryInfo.contactsName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">联系方式:</i-col>
              <i-col span="18">{{ deliveryInfo.phone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货地址:</i-col>
              <i-col span="18">{{ address }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">收货时间:</i-col>
              <i-col span="18">{{ orderDetail.receiveTime }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">商品信息</Divider>
        <Row>
          <tables
            v-model="orderDetail.orderGoodsList"
            :columns="goodsColumns"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加单号 -->
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :z-index="1000"
      :width="600"
    >
      <p slot="header">添加快递单号</p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="orderDetail"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="20">
              <FormItem label="订单编号:" prop="orderCode">
                <Input v-model="orderDetail.orderCode" disabled></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="20">
              <FormItem label="快递单号:" prop="deliveryCode">
                <Input
                  v-model="orderDetail.deliveryCode"
                  placeholder="请输入快递单号..."
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" @click="handleCourierCode">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';

import {
  getOrderPages,
  exporGoodsStandard,
  getOrder,
  getPrintOrder,
  sendHdManual,
  exportOrder,
  putCourierCode,
  confirmReceipt
} from '@/api/lhfarm-small';
import getLodop from '@/assets/lodop/lodopFuncs.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import city from '@/assets/city/city.js';
import { fenToYuanDot2, fenToYuanDot2Number } from '@/libs/util';
import {
  orderStatusEnum,
  payStatusEnum,
  payTypeEnum,
  wholesaleOrderStatusEnum,
  wholesaleHdStatusEnum
} from '@/libs/enumerate';
import {
  thirdDeliverStatusConvert,
  wholesalePayTypeConvert,
  wholesaleOrderStatusConvert
} from '@/libs/converStatus';

const orderDetail = {
  afterSaleTime: '',
  afterStatus: '',
  checkStatus: '',
  createTime: '',
  currentOrderStatus: '',
  deliveryAddress: '',
  deliveryFee: 0,
  deliveryTime: '',
  discountFee: 0,
  hdCode: '',
  hdStatus: '',
  id: 0,
  invoiceStatus: '',
  notHdStatus: '',
  orderCode: '',
  orderCoupon: 0,
  orderGoodsList: [],
  orderStatus: '',
  orderStatusIn: [],
  payStatus: '',
  payableFee: 0,
  receiveTime: '',
  remarks: '',
  salesmanId: 0,
  settlementType: '',
  supplements: [],
  totalFee: 0,
  userId: 0,
  deliveryCode: '',
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  salesmanId: null,
  orderCode: '',
  phone: '',
  orderStatus: '',
  settlementType: '',
  payStatus: '',
  hdStatus: '',
  createTimeBegin: null,
  createTimeEnd: null,
  orderCodes: '',
  userName: '',
  hdCode: '',
  deliveryAddress: '',
  page: 1,
  rows: 20,
  sidx: 'createTime',
  sort: 'desc'
};

const deliveryInfo = {
  id: 0,
  sex: null,
  phone: '',
  addressDetail: '',
  addressArea: '',
  isDefault: '',
  userId: 0,
  contactsName: ''
};

const orderColumns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '订单编号',
    key: 'orderCode',
    sortable: true,
    resizable: true,
    width: 200,
    fixed: 'left',
    align: 'center'
  },
  {
    title: '创建时间',
    align: 'center',
    width: 200,
    fixed: 'left',
    key: 'createTime'
  },
  {
    title: '快递单号',
    align: 'center',
    width: 150,
    key: 'deliveryCode',
    render(h, params, vm) {
      const { row } = params;
      return <div>{row.deliveryCode ? row.deliveryCode : 'N/A'}</div>;
    }
  },
  {
    title: '订单总价',
    align: 'center',
    width: 120,
    key: 'totalFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.totalFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '优惠金额',
    align: 'center',
    width: 120,
    key: 'discountFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '应付金额',
    align: 'center',
    width: 120,
    key: 'payableFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.payableFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '配送费',
    align: 'center',
    width: 120,
    key: 'deliveryFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.deliveryFee);
      return <div>{amount || 'N/A'}</div>;
    }
  },
  {
    title: '实付金额',
    align: 'center',
    width: 120,
    key: 'payableFee1',
    render(h, params, vm) {
      const amount = fenToYuanDot2(
        params.row.payableFee + params.row.deliveryFee
      );
      return <div>{amount}</div>;
    }
  },
  {
    title: '支付类型',
    align: 'center',
    width: 120,
    key: 'settlementType',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.settlementType === 'wechat') {
        return (
          <div>
            <tag color='success'>
              {wholesalePayTypeConvert(row.settlementType)}
            </tag>
          </div>
        );
      } else if (row.settlementType === 'balance') {
        return (
          <div>
            <tag color='primary'>
              {wholesalePayTypeConvert(row.settlementType)}
            </tag>
          </div>
        );
      } else if (row.settlementType === 'offline') {
        return (
          <div>
            <tag color='warning'>
              {wholesalePayTypeConvert(row.settlementType)}
            </tag>
          </div>
        );
      } else if (row.settlementType === 'haiding') {
        return (
          <div>
            <tag color='warning'>
              {wholesalePayTypeConvert(row.settlementType)}
            </tag>
          </div>
        );
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '用户名称',
    align: 'center',
    width: 120,
    key: 'userName'
  },
  {
    title: '配送区域',
    align: 'center',
    width: 160,
    key: 'deliveryAddress',
    render(h, params, vm) {
      const { row } = params;
      const address = JSON.parse(row.deliveryAddress);
      return <div>{address.addressArea}</div>;
    }
  },
  {
    title: '用户手机',
    align: 'center',
    width: 120,
    key: 'phone'
  },
  {
    title: '订单状态',
    align: 'center',
    fixed: 'right',
    width: 120,
    key: 'orderStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (
        row.orderStatus === 'unpaid' ||
              row.orderStatus === 'paying' ||
              row.orderStatus === 'undelivery'
      ) {
        return (
          <div>
            <tag color='default'>
              {wholesaleOrderStatusConvert(row.orderStatus)}
            </tag>
          </div>
        );
      } else if (
        row.orderStatus === 'delivery' ||
              row.orderStatus === 'unrefunded'
      ) {
        return (
          <div>
            <tag color='primary'>
              {wholesaleOrderStatusConvert(row.orderStatus)}
            </tag>
          </div>
        );
      } else if (row.orderStatus === 'failed') {
        return (
          <div>
            <tag color='error'>
              {wholesaleOrderStatusConvert(row.orderStatus)}
            </tag>
          </div>
        );
      } else if (
        row.orderStatus === 'received' ||
              row.orderStatus === 'refunded'
      ) {
        return (
          <div>
            <tag color='success'>
              {wholesaleOrderStatusConvert(row.orderStatus)}
            </tag>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '操作',
    minWidth: 150,
    resizable: true,
    align: 'center',
    fixed: 'right',
    key: 'handle',
    options: ['view', 'edit', 'onReceive']
  }
];

const goodsColumns = [
  {
    title: '商品编号',
    align: 'center',
    key: 'goodsId'
  },
  {
    title: '商品名称',
    align: 'center',
    key: 'goodsName'
  },
  {
    title: '商品图片',
    key: 'goodsImage',
    align: 'center',
    maxWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '商品规格',
    align: 'center',
    key: 'standard'
  },
  {
    title: '购买数量',
    align: 'center',
    key: 'quanity'
  },
  {
    title: '商品单位',
    align: 'center',
    key: 'unitName'
  },
  {
    title: '商品单价',
    align: 'center',
    key: 'goodsPrice',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.goodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '折扣价',
    key: 'discountGoodsPrice',
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountGoodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '是否限时抢购',
    key: 'flash',
    align: 'center',
    minWidth: 20,
    render(h, params, vm) {
      if (params.row.flash === 0) {
        return (
          <div>
            <tag color='success'>普通商品</tag>
          </div>
        );
      } else if (params.row.flash === 1) {
        return (
          <div>
            <tag color='error'>限时抢购</tag>
          </div>
        );
      }
    }
  },
  {
    title: '退货状态',
    minWidth: 20,
    align: 'center',
    key: 'refundStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.refundStatus === 'yes') {
        return (
          <div>
            <tag color='error'>已退货</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color='success'>未退货</tag>
          </div>
        );
      }
    }
  }
];

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      data: [],
      templatePageOpts: [20, 50],
      amount: 0,
      sum: 0,
      printNum: 0,
      printQuantity: 0,
      downloadLoading: false,
      modalPrinting: false,
      flag: true,
      printFlag: null,
      currentTableRowSelected: null,
      exportType: '', // ORDER_GOODS,DELIVERY_NOTE
      selectedOrderCodes: '',
      payTypeEnum,
      payStatusEnum,
      orderStatusEnum,
      wholesaleOrderStatusEnum,
      wholesaleHdStatusEnum,
      goodsColumns,
      columns: orderColumns,
      deliveryInfo: _.cloneDeep(deliveryInfo),
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      ruleInline: {
        orderCode: [{ required: true, message: '请输入订单编号' }],
        deliveryCode: [{ required: true, message: '请输入快递单号' }]
      }
    };
  },
  computed: {
    address() {
      const addressArea = this.deliveryInfo.addressArea
        ? this.deliveryInfo.addressArea.replace(new RegExp('/', 'gm'), '')
        : '';
      return addressArea + this.deliveryInfo.addressDetail;
    },
    isSalesmanAnalysis() {
      return this.$route.query.id > 0;
    }
  },
  created() {
    this.data = city;
    this.getTableData();
  },
  methods: {
    orderStatusesOnChange(value) {
      if (value.length === 0) {
        this.searchRowData.orderStatuses = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.createTimeBegin = value;
      this.orderDetail.createTimeBegin = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.createTimeEnd = value;
      this.orderDetail.createTimeEnd = value;
    },
    handleReimburse(params) {
      if (params.row.orderStatus === 'RETURNING') {
        this.$Message.error('退货中订单不能操作退款');
        return;
      }
      if (params.row.orderStatus === 'ALREADY_RETURN') {
        this.$Message.error('退货完成订单不能操作退款');
        return;
      }
      if (params.row.orderStatus === 'FAILURE') {
        this.$Message.error('已失效的订单不能操作退款');
        return;
      }
    },
    // 确认收货
    handSureReceive(params) {
      if (params.row.orderStatus === 'delivery') {
        confirmReceipt(params.row)
          .then((res) => {
            this.loading = false;
            this.$Message.success('确认收货成功');
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$Message.error('只有配送中的订单才能操作收货');
      }
    },
    handleSubmit() {
      if (!this.currentTableRowSelected) {
        this.$Message.error(
          '请用鼠标左键点击选择下方表格一行订单数据,才能进行调货处理'
        );
        return;
      }
      this.modifyStoreInOrder();
      this.currentTableRowSelected = null;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.loading = true;
      getOrder({ id: params.row.id })
        .then((res) => {
          this.orderDetail = res;
          if (this.orderDetail.deliveryAddress) {
            const deliveryInfo = JSON.parse(this.orderDetail.deliveryAddress);
            this.deliveryInfo = _.cloneDeep(deliveryInfo);
          }
          this.tempModalType = this.modalType.view;
          this.modalView = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTableData() {
      this.loading = true;
      // 如果从业务员业绩明细过来查看的按业务员ID过滤订单
      if (this.isSalesmanAnalysis) {
        this.searchRowData.salesmanId = this.$route.query.id;
      }
      getOrderPages(this.searchRowData)
        .then((res) => {
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
    // 导出
    handleDownload() {
      var tableData;
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getOrderPages(this.searchRowData).then((res) => {
        tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 20;
        this.searchRowData.page = pageSize;
        this.handleDown(tableData);
      });
    },
    handleDown(tableData) {
      exporGoodsStandard({
        exportType: 'ORDER_INFO'
      }).then((res) => {
        const tableColumns = res;
        // 表格数据导出字段翻译
        tableData.forEach((item) => {
          const deliveryAddress = JSON.parse(item['deliveryAddress']);
          item['orderCode'] = item['orderCode'] + '';
          item['hdCode'] = item['hdCode'] + '';
          item['addressArea'] = deliveryAddress.addressArea;
          item['contactsPhone'] = deliveryAddress.phone;
          item['contactsName'] = deliveryAddress.contactsName;
          item['address'] =
            deliveryAddress.addressArea + deliveryAddress.addressDetail;
          item['totalFee'] = (item['totalFee'] / 100.0).toFixed(2);
          item['discountFee'] = (item['discountFee'] / 100.0).toFixed(2);
          item['payableFee'] = (item['payableFee'] / 100.0).toFixed(2);
          item['deliveryFee'] = (item['deliveryFee'] / 100.0).toFixed(2);
          item['refundFee'] = (item['refundFee'] / 100.0).toFixed(2);
          item['actualPayFee'] = (
            Number(item['payableFee']) + Number(item['deliveryFee'])
          ).toFixed(2);
          item['deliverStatus'] = thirdDeliverStatusConvert(
            item['deliverStatus']
          );
          item['orderStatus'] = wholesaleOrderStatusConvert(
            item['orderStatus']
          );
          item['settlementType'] = wholesalePayTypeConvert(
            item['settlementType']
          );
          if (item['hdStatus'] === 'success') {
            item['hdStatus'] = '成功';
          } else if (item['hdStatus'] === 'failed') {
            item['hdStatus'] = '失败';
          } else {
            item['hdStatus'] = 'N/A';
          }
          if (item['payStatus'] === 'paid') {
            item['payStatus'] = '已支付';
          } else if (item['hdStatus'] === 'unpaid') {
            item['payStatus'] = '未支付';
          } else {
            item['payStatus'] = 'N/A';
          }
          item['payableFee1'] = (
            Number(item['deliveryFee']) + Number(item['payableFee'])
          ).toFixed(2);
        });
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        this.$refs.tables.handleCustomDownload({
          filename: `普通订单信息-${date}`,
          data: tableData,
          columns: tableColumns
        });
      });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      this.selectedOrderCodes = selection
        .map((item) => item.orderCode.toString())
        .join(',');
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      this.selectedOrderCodes = selection
        .map((item) => item.orderCode.toString())
        .join(',');
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      const selection = [];
      selection.push(currentRow);
      this.tableDataSelected = selection;
      this.currentTableRowSelected = currentRow;
      this.selectedOrderCodes = this.currentTableRowSelected.orderCode;
    },
    onChangeCity(value, selectedData) {
      let city = '';
      let index = 1;
      for (let i = 0; i < value.length; i++) {
        if (value.length - index > 0) {
          city += value[i] + '/';
        } else {
          city += value[i];
        }
        index++;
      }
      this.searchRowData.deliveryAddress = city;
    },
    handleEdit(params) {
      if (params.row.orderStatus === 'undelivery') {
        this.orderDetail = _.cloneDeep(params.row);
        this.modalEdit = true;
      } else {
        this.$Message.info('只有待发货的订单才能编辑!');
      }
    },
    handleCourierCode() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          putCourierCode(this.orderDetail)
            .then((res) => {
              this.modalEdit = false;
              this.getTableData();
            })
            .catch(() => {
              this.modalEdit = false;
            });
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.print {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
