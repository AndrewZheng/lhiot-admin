<template>
  <div class="m-role">
    <Card>
      <Row v-show="isSalesmanAnalysis">
        <i-col
          span="24"
          class="brand-red font-sm"
        >
          {{ salesmanName }}--旗下门店订单信息明细
        </i-col>
      </Row>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="24"
        :operate-area-column="7"
        :need-permission="true"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-view="handleView"
        @on-hand="handleReimburse"
        @on-receive="handSureReceive"
        @on-send-hd="sendHdManual"
        @on-afterSale="onAfterSale"
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
              style="width: 170px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.hdCode"
              placeholder="海鼎编码"
              class="search-input"
              style="width: 150px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.userName"
              placeholder="用户名"
              class="search-input"
              style="width: 100px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.payStatus"
              class="search-col"
              placeholder="支付状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in payStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.orderStatus"
              class="search-col"
              placeholder="订单状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in wholesaleOrderStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.hdStatus"
              class="search-col"
              placeholder="海鼎状态"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in wholesaleHdStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.createTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              style="width: 160px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.createTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              style="width: 160px"
              @on-change="endTimeChange"
            />
            <Cascader
              ref="showClass"
              :data="data"
              change-on-select
              placeholder="请选择区域"
              class="search-col mt5"
              @on-change="onChangeCity"
            ></Cascader>
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn"
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
          <Row style="margin-top: 15px; float: right">
            <Button
              v-show="isSalesmanAnalysis"
              v-waves
              type="warning"
              @click="handleBack"
            >
              <Icon type="ios-arrow-back" />返回
            </Button>
            <Button
              v-has="'export_order'"
              :loading="downloadLoading"
              class="search-btn"
              type="primary"
              @click="handleDownload"
            >
              <Icon type="md-download" />导出订单
            </Button>
            <Button
              v-has="'export_order_goods'"
              :loading="downloadLoading"
              class="search-btn"
              type="success"
              @click="handleExport('ORDER_GOODS')"
            >
              <Icon type="md-download" />导出订单商品
            </Button>
            <Button
              v-has="'export_delivery_order'"
              :loading="downloadLoading"
              class="search-btn"
              type="success"
              @click="handleExport('DELIVERY_NOTE')"
            >
              <Icon type="md-download" />导出配送单
            </Button>
            <Button
              v-if="flag"
              v-has="'online_printing'"
              :loading="downloadLoading"
              class="search-btn"
              type="success"
              @click="onlinePrinting"
            >
              <Icon type="md-download" />在线打印
            </Button>
            <Button v-if="!flag" class="search-btn mr2" type="success">
              <Icon type="md-download" />正在打印中...
            </Button>
          </Row>
          <div v-if="printFlag === true" class="ml15 mt10">
            已完成打印
            <i style="color: red">{{ printNum }}</i> 条配送单
          </div>
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
              <i-col span="6">
                订单编号:
              </i-col>
              <i-col span="18">
                {{ orderDetail.orderCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                订单状态:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.orderStatus | wholesaleOrderStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                海鼎编号:
              </i-col>
              <i-col span="18">
                {{ orderDetail.hdCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                海鼎状态:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.hdStatus | wholesaleHdStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                下单时间:
              </i-col>
              <i-col span="18">
                {{ orderDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">
          支付信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                支付类型:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.settlementType | wholeslaePayTypeFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                支付状态:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.payStatus | payStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                余额支付:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.currencyFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                微信支付:
              </i-col>
              <i-col span="18">
                {{
                  (orderDetail.payableFee +
                    orderDetail.deliveryFee -
                    orderDetail.currencyFee)
                    | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                订单金额:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.totalFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                优惠金额:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.discountFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                配送费:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.deliveryFee | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                应付金额:
              </i-col>
              <i-col span="18">
                {{
                  (orderDetail.payableFee + orderDetail.deliveryFee)
                    | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                支付时间:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.paymentTime ? orderDetail.paymentTime : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">
          用户信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                门店名称:
              </i-col>
              <i-col span="18">
                {{ orderDetail.shopName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                店长名称:
              </i-col>
              <i-col span="18">
                {{ orderDetail.userName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                店长手机:
              </i-col>
              <i-col span="18">
                {{ orderDetail.phone }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                所属业务员:
              </i-col>
              <i-col span="18">
                {{ orderDetail.saleUserName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                用户备注:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.remarks ? orderDetail.remarks : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">
          配送信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                用户备注:
              </i-col>
              <i-col span="18">
                {{
                  orderDetail.remarks ? orderDetail.remarks : "N/A"
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">
          配送信息
        </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                收货人:
              </i-col>
              <i-col span="18">
                {{ deliveryInfo.contactsName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                联系方式:
              </i-col>
              <i-col span="18">
                {{ deliveryInfo.phone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                收货地址:
              </i-col>
              <i-col span="18">
                {{ address }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6">
                收货时间:
              </i-col>
              <i-col span="18">
                {{ orderDetail.receiveTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center">
          商品信息
        </Divider>
        <Row>
          <tables
            v-model="orderDetail.orderGoodsList"
            :columns="goodsColumns"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>
    <!-- 在线打印-->
    <div ref="printTable" style="display: none">
      <table
        border="1"
        width="800"
        cellspacing="0"
        cellpadding="0"
        align="center"
        style="fontsize: 16px"
      >
        <thead>
          <tr align="center">
            <th colspan="10" style="font-size: 26px; height: 60px">
              <img
                src="http://resource.shuiguoshule.com.cn/product_image/2020-03-31/OVFftIF74gHs2Qa01dF2.png"
                style="width: 120px; height: 39px; float: left"
              >
              <p style="margin-right: 120px; color: #666666">
                万翼果联销售单
              </p>
            </th>
          </tr>
        </thead>
        <tbody id="tabInfo"></tbody>
        <tbody id="tab"></tbody>
        <tbody id="tabTotal"></tbody>
        <tr style="height: 80px">
          <td colspan="10">
            <p style="margin-top: -40px">
              发货备注:
            </p>
          </td>
        </tr>
        <tfoot>
          <tr
            style="height: 50px; border: 0 solid red; border-collapse: collapse"
          >
            <td
              colspan="3"
              style="border: 0 solid red; border-collapse: collapse"
            >
              配送员签字:
            </td>
            <td
              colspan="2"
              style="border: 0 solid red; border-collapse: collapse"
            >
              司机签字:
            </td>
            <td
              colspan="3"
              style="border: 0 solid red; border-collapse: collapse"
            >
              客户签字:
            </td>
            <td
              colspan="2"
              style="border: 0 solid red; border-collapse: collapse"
            >
              仓库审核:
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import BookTypeOption from '_c/book-type-option';

import {
  getOrderPages,
  exporGoodsStandard,
  getOrder,
  getPrintOrder,
  sendHdManual,
  handSubmitRefuse,
  exportOrder
} from '@/api/wholesale';
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
  page: 1,
  rows: 20,
  sidx: 'createTime',
  sort: 'desc',
  orderCodes: '',
  userName: '',
  hdCode: '',
  deliveryAddress: ''
};

const goodsDetail = {
  discountGoodsPrice: 0,
  flash: 0,
  goodsId: 0,
  goodsImage: '',
  goodsName: '',
  goodsPrice: 0,
  goodsStandardId: 0,
  hdSkuId: '',
  id: 0,
  orderId: 0,
  paymentTime: '',
  purchasePrice: 0,
  quanity: 0,
  refundStatus: '',
  standard: '',
  standardWeight: 0,
  unitName: '',
  userId: 0
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
  // {
  //   type: "selection",
  //   key: "",
  //   width: 60,
  //   align: "center",
  //   fixed: "left",
  // },
  {
    title: '订单编号',
    key: 'orderCode',
    sortable: true,
    resizable: true,
    width: 190,
    fixed: 'left',
    align: 'center'
  },
  {
    title: '海鼎单号',
    key: 'hdCode',
    sortable: true,
    resizable: true,
    width: 160,
    align: 'center'
  },
  {
    title: '创建时间',
    align: 'center',
    width: 190,
    key: 'createTime'
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
      } else if (
        row.settlementType === 'balance_wechat' ||
        row.settlementType === 'balance_haiding'
      ) {
        return (
          <div>
            <tag color='warning'>{'组合支付'}</tag>
          </div>
        );
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '余额支付金额',
    align: 'center',
    minWidth: 150,
    key: 'currencyFee',
    render(h, params, vm) {
      const { row } = params;
      const amount = fenToYuanDot2(row.currencyFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '微信支付金额',
    align: 'center',
    minWidth: 150,
    key: 'weiXinFee',
    render(h, params, vm) {
      const { row } = params;
      const amount = fenToYuanDot2(
        row.payableFee + row.deliveryFee - row.currencyFee
      );
      return <div>{amount}</div>;
    }
  },
  {
    title: '门店名称',
    align: 'center',
    minWidth: 150,
    key: 'currencyFee',
    render(h, params, vm) {
      const { row } = params;
      const amount = fenToYuanDot2(row.currencyFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '微信支付金额',
    align: 'center',
    minWidth: 150,
    key: 'weiXinFee',
    render(h, params, vm) {
      const { row } = params;
      const amount = fenToYuanDot2(
        row.payableFee + row.deliveryFee - row.currencyFee
      );
      return <div>{amount}</div>;
    }
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
    title: '店长手机',
    align: 'center',
    width: 130,
    key: 'phone'
  },
  {
    title: '订单状态',
    align: 'center',
    minWidth: 120,
    fixed: 'right',
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
    title: '海鼎状态',
    align: 'center',
    minWidth: 120,
    fixed: 'right',
    key: 'hdStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.hdStatus === 'success') {
        return (
          <div>
            <tag color='success'>成功</tag>
          </div>
        );
      } else if (row.hdStatus === 'failed') {
        return (
          <div>
            <tag color='error'>失败</tag>
          </div>
        );
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '操作',
    width: 160,
    align: 'center',
    fixed: 'right',
    key: 'handle',
    options: ['view', 'sendHd', 'afterSale']
  }
];

const goodsColumns = [
  {
    title: '编号',
    key: 'goodsId',
    align: 'center',
    width: 80
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
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.goodsImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '规格',
    key: 'standard',
    align: 'center',
    width: 80
  },
  {
    title: '数量',
    key: 'quanity',
    align: 'center',
    width: 80
  },
  {
    title: '单位',
    key: 'unitName',
    align: 'center',
    width: 80
  },
  {
    title: '单价',
    align: 'center',
    key: 'goodsPrice',
    width: 90,
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.goodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '折扣价',
    align: 'center',
    width: 90,
    key: 'discountGoodsPrice',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.discountGoodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品类型',
    key: 'flash',
    align: 'center',
    width: 110,
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
    key: 'refundStatus',
    align: 'center',
    width: 100,
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
      amount: 0,
      printQuantity: 0,
      sum: 0,
      modalPrinting: false,
      templatePageOpts: [20, 50],
      payTypeEnum,
      payStatusEnum,
      orderStatusEnum,
      wholesaleOrderStatusEnum,
      wholesaleHdStatusEnum,
      goodsColumns,
      columns: orderColumns,
      salesmanName: '',
      currentTableRowSelected: null,
      deliveryInfo: _.cloneDeep(deliveryInfo),
      searchRowData: _.cloneDeep(roleRowData),
      orderDetail: _.cloneDeep(orderDetail),
      downloadLoading: false,
      currentSaleUserId: 0,
      exportType: '', // ORDER_GOODS,DELIVERY_NOTE
      tableDataSelected: [],
      data: [],
      selectedOrderCodes: '',
      flag: true,
      printFlag: null,
      printNum: 0
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
    this.salesmanName = this.$route.query.salesmanName
      ? this.$route.query.salesmanName
      : 'N/A';
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
      if (
        params.row.orderStatus === 'SEND_OUT' ||
        params.row.orderStatus === 'DISPATCHING'
      ) {
        sureReceive({ orderId: params.row.id })
          .then((res) => {
            this.loading = false;
            this.$Message.success('确认收货成功');
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$Message.error('只有已发货和配送中的订单才能操作收货');
      }
    },
    // 手动售后
    onAfterSale(params) {
      if (params.row.orderStatus === 'received') {
        handSubmitRefuse(params.row)
          .then((res) => {
            this.$Message.success('操作成功');
          })
          .finally(() => {});
      } else {
        this.$Message.error('只有已收货的订单能操作售后');
      }
    },
    // 手动售后
    onAfterSale(params) {
      if (params.row.orderStatus === 'received') {
        handSubmitRefuse(params.row)
          .then((res) => {
            this.$Message.success('操作成功');
          })
          .finally(() => {});
      } else {
        this.$Message.error('只有已收货的订单能操作售后');
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
      this.$refs.showClass.clearSelect();
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
        })
        .finally(() => {
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
          item['currencyFee'] = (item['currencyFee'] / 100.0).toFixed(2);
          item['weiXinFee'] =
            Number(item['payableFee']) +
            Number(item['deliveryFee']) -
            Number(item['currencyFee']);
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
    handleExport(name) {
      const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
      if (name === 'ORDER_GOODS') {
        this.searchRowData.orderCodes = this.selectedOrderCodes;
        // 导出订单商品
        exportOrder({
          exportType: name,
          searchParam: this.searchRowData
        }).then((res) => {
          const tableData = res.rows;
          const tableColumns = res.columns;
          this.$refs.tables.handleCustomDownload({
            filename: `订单商品信息-${date}`,
            data: tableData,
            columns: tableColumns
          });
        });
      } else {
        // 导出配送单
        const orderCodes = { orderCodes: this.selectedOrderCodes };
        exportOrder({
          exportType: name,
          searchParam: orderCodes
        }).then((res) => {
          const tableData = res.rows;
          const tableColumns = res.columns;
          this.$refs.tables.handleCustomDownload({
            filename: `配送单-${date}`,
            data: tableData,
            columns: tableColumns
          });
        });
      }
    },
    sendHdManual() {
      if (this.tableDataSelected.length > 1) {
        this.$Message.warn('目前只支持单笔订单重发海鼎');
        return;
      }

      if (this.tableDataSelected.length > 0) {
        sendHdManual({ orderCode: this.selectedOrderCodes }).then((res) => {
          this.$Message.info('海鼎重发成功');
          this.getTableData();
        });
      }
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
    handleBack() {
      this.turnToPage({
        name: 'wholesale-salesman-analysis'
      });
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      const selection = [];
      selection.push(currentRow);
      this.tableDataSelected = selection;
      this.currentTableRowSelected = currentRow;
      this.selectedOrderCodes = this.currentTableRowSelected.orderCode;
    },
    // 在线打印
    onlinePrinting() {
      for (let i = 0; i < this.tableDataSelected.length; i++) {
        if (
          this.tableDataSelected[i].orderStatus != 'undelivery' &&
          this.tableDataSelected[i].orderStatus != 'delivery'
        ) {
          this.$Message.info('选中的订单不是待发货或者配送中的订单');
          return;
        }
      }
      this.flag = false;
      const data = { orderCodes: this.selectedOrderCodes };
      var otab = document.getElementById('tab');
      var otabInfo = document.getElementById('tabInfo');
      var otabTotal = document.getElementById('tabTotal');
      var _this = this;
      getPrintOrder(data)
        .then((res) => {
          this.$nextTick(() => {
            var LODOP; // 声明为全局变量
            LODOP = getLodop();
            LODOP.PRINT_INIT('');
            for (let j = 0; j < res.length; j++) {
              this.amount = 0;
              this.sum = 0;
              // 循环前先清理
              _this.orderDetail = _.cloneDeep(orderDetail);
              _this.orderDetail = _.cloneDeep(res[j]);
              const orderGoodsList = _this.orderDetail.orderGoodsList;
              let address = '';
              if (_this.orderDetail.deliveryAddress) {
                const deliveryInfo = JSON.parse(
                  _this.orderDetail.deliveryAddress
                );
                const addressArea = deliveryInfo.addressArea
                  ? deliveryInfo.addressArea.replace(new RegExp('/', 'gm'), '')
                  : '';
                address = addressArea + deliveryInfo.addressDetail;
                _this.deliveryInfo = _.cloneDeep(deliveryInfo);
              }
              if (_this.orderDetail.shopCode == null) {
                _this.orderDetail.shopCode = '';
              }
              if (_this.orderDetail.hdCode == null) {
                _this.orderDetail.hdCode = '';
              }
              _this.orderDetail.settlementType =
                _this.orderDetail.settlementType === 'balance'
                  ? '余额'
                  : '微信支付';
              const remarks = !_this.orderDetail.remarks
                ? ''
                : _this.orderDetail.remarks;
              var strData = "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '门店代码' + '</td>';
              strData += '<td>' + _this.orderDetail.shopCode + '</td>';
              strData += '<td>' + '订单号' + '</td>';
              strData +=
                '<td colspan="2">' + _this.orderDetail.orderCode + '</td>';
              strData += "<td colspan='2'>" + '海鼎编号' + '</td>';
              strData +=
                "<td colspan='2'>" + _this.orderDetail.hdCode + '</td>';
              strData += '</tr>';
              strData += "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '门店名称' + '</td>';
              strData += '<td>' + _this.orderDetail.shopName + '</td>';
              strData += '<td>' + '联系人' + '</td>';
              strData +=
                '<td colspan="2">' + _this.deliveryInfo.contactsName + '</td>';
              strData += "<td colspan='2'>" + '联系电话' + '</td>';
              strData +=
                '<td colspan="2">' + _this.deliveryInfo.phone + '</td>';
              strData += '</tr>';
              strData += "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '联系地址' + '</td>';
              strData += '<td colspan="8">' + address + '</td>';
              strData += '</tr>';
              strData += "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '下单时间' + '</td>';
              strData += '<td>' + _this.orderDetail.createTime + '</td>';
              strData += '<td>' + '支付类型' + '</td>';
              strData += '<td>' + _this.orderDetail.settlementType + '</td>';
              strData += "<td colspan='3'>" + '订单金额' + '</td>';
              strData +=
                '<td colspan="2">' +
                fenToYuanDot2(_this.orderDetail.totalFee) +
                '</td>';
              strData += '</tr>';
              strData += "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '配送费' + '</td>';
              strData +=
                '<td>' + fenToYuanDot2(_this.orderDetail.deliveryFee) + '</td>';
              strData += '<td>' + '优惠金额' + '</td>';
              strData +=
                '<td colspan="2">' +
                fenToYuanDot2(_this.orderDetail.discountFee) +
                '</td>';
              strData += "<td colspan='2'>" + '付款金额' + '</td>';
              strData +=
                '<td colspan="2">' +
                fenToYuanDot2(_this.orderDetail.payableFee) +
                '</td>';
              strData += '</tr>';
              strData += "<tr align='center' style='height:30px;'>";
              strData += '<td colspan="2">' + '客户备注' + '</td>';
              strData += '<td colspan="8">' + remarks + '</td>';
              strData += '</tr>';
              strData +=
                "<tr align='center' style='backgroung:#ccc;height:30px'>";
              strData += '<td colspan="10">' + '客户订单明细' + '</td>';
              strData += '</tr>';
              strData +=
                "<tr align='center' style='height:30px;background:#eeeeee'>";
              strData += "<td style='min-Width:40px'>" + '序号' + '</td>';
              strData += "<td style='min-Width:60px'>" + '条码' + '</td>';
              strData += "<td style='min-Width:125px'>" + '商品名称' + '</td>';
              strData += "<td style='min-Width:110px'>" + '商品规格' + '</td>';
              strData += "<td style='min-Width:53px'>" + '出库参数' + '</td>';
              strData += "<td style='min-Width:53px'>" + '单位' + '</td>';
              strData += "<td style='min-Width:53px'>" + '数量' + '</td>';
              strData += "<td style='min-Width:63px'>" + '单价' + '</td>';
              strData += "<td style='min-Width:73px'>" + '金额' + '</td>';
              strData += "<td style='min-Width:70px'>" + '商品备注' + '</td>';
              strData += '</tr>';
              otabInfo.innerHTML += strData;
              for (let i = 0; i < orderGoodsList.length; i++) {
                const mark = i + 1;
                var strHTML = "<tr align='center' style='height:30px;'>";
                strHTML += '<td>' + mark + '</td>';
                strHTML += '<td>' + orderGoodsList[i].baseBar + '</td>';
                strHTML += '<td>' + orderGoodsList[i].goodsName + '</td>';
                strHTML += '<td>' + orderGoodsList[i].standard + '</td>';
                strHTML +=
                  '<td>' +
                  (
                    orderGoodsList[i].standardWeight * orderGoodsList[i].quanity
                  ).toFixed(2) +
                  '</td>';
                strHTML += '<td>' + orderGoodsList[i].goodsUnit + '</td>';
                strHTML += '<td>' + orderGoodsList[i].quanity + '</td>';
                strHTML +=
                  '<td>' +
                  fenToYuanDot2(orderGoodsList[i].goodsPrice) +
                  '</td>';
                strHTML +=
                  '<td>' +
                  fenToYuanDot2(orderGoodsList[i].goodsSumPrice) +
                  '</td>';
                strHTML += '<td>' + '</td>';
                strHTML += '</tr>';
                _this.amount += Number(orderGoodsList[i].quanity);
                _this.sum += Number(orderGoodsList[i].goodsSumPrice);
                otab.innerHTML += strHTML;
              }
              var strTotal = "<tr align='center' style='height:30px;'>";
              strTotal += '<td colspan="6">' + '小计' + '</td>';
              strTotal +=
                "<td style='font-weight:bold;'>" + _this.amount + '</td>';
              strTotal += '<td>' + '</td>';
              strTotal +=
                "<td style='font-weight:bold;'>" +
                fenToYuanDot2(_this.sum) +
                '</td>';
              strTotal += '<td>' + '</td>';
              strTotal += '</tr>';
              otabTotal.innerHTML += strTotal;
              var strBodyStyle =
                '<style> thead,tbody{ border: 1px solid #232323;border-collapse:collapse;}</style>';
              var printHtml =
                strBodyStyle +
                '<body>' +
                _this.$refs.printTable.innerHTML +
                '</body>';
              _this.printNum = Number(j) + 1;
              _this.previewPrinting(printHtml, LODOP);
            }
            // LODOP.SET_PRINT_STYLEA(0, "Vorient", 2);
            LODOP.PREVIEW();
          });
        })
        .finally(() => {});
    },
    previewPrinting(printHtml, LODOP) {
      LODOP.SET_PRINT_PAGESIZE(1, 2400, 2794, '');
      // LODOP.SET_PRINT_STYLEA(0, "Vorient", 2);
      LODOP.NewPageA();
      LODOP.ADD_PRINT_HTM(10, -10, '98%', '98%', printHtml);
      var otab = document.getElementById('tab');
      var otabInfo = document.getElementById('tabInfo');
      var otabTotal = document.getElementById('tabTotal');
      otab.innerHTML = '';
      otabInfo.innerHTML = '';
      otabTotal.innerHTML = '';
      this.flag = true;
      this.printFlag = true;
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
