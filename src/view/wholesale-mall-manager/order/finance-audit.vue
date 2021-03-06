<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-operate="handleOperate"
      >
        <div slot="searchCondition">
          <Row>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              style="width: 160px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              style="width: 160px"
              @on-change="endTimeChange"
            />
            <Input
              v-model="searchRowData.orderCode"
              placeholder="订单编码"
              class="search-input"
              style="width: 180px"
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
              placeholder="店长姓名"
              class="search-input"
              style="width: 100px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input"
              style="width: 120px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.serviceMode"
              class="search-col"
              placeholder="售后方式"
              style="width: 90px"
              clearable
            >
              <Option
                v-for="item in serviceModeEnum"
                :key="`search-col-${item.value}`"
                :value="item.label"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.status"
              class="search-col"
              placeholder="售后状态"
              style="width: 110px"
              clearable
            >
              <Option
                v-for="item in serviceStatusEnum"
                :key="`search-col-${item.value}`"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
          </Row>
          <Row style="margin-top: 10px; float: right">
            <Button
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
            <Button
              :loading="downloadLoading"
              class="search-btn"
              type="primary"
              @click="handleDownload('POST_SALE_ORDER_GOODS')"
            >
              <Icon type="md-download" />导出售后订单商品
            </Button>
          </Row>
        </div>
        <div slot="operations"></div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
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
    <!--查看/审核售后订单详情-->
    <Modal
      v-model="modalView"
      :width="1500"
      :mask-closable="false"
      :styles="{ bottom: '20px' }"
    >
      <p slot="header">
        <i-col>{{
          tempModalType === modalType.view ? "查看售后订单" : "审核售后订单"
        }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 订单编号: </i-col>
              <i-col span="18">
                {{ orderDetail.orderCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 订单状态: </i-col>
              <i-col span="18">
                {{ orderDetail.orderStatus | wholesaleOrderStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 海鼎编号: </i-col>
              <i-col span="18">
                {{ orderDetail.hdCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 海鼎状态: </i-col>
              <i-col span="18">
                {{ orderDetail.hdStatus | wholesaleHdStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 下单时间: </i-col>
              <i-col span="18">
                {{ orderDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center"> 支付信息 </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 支付类型: </i-col>
              <i-col span="18">
                {{ orderDetail.settlementType | wholeslaePayTypeFilter }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 支付状态: </i-col>
              <i-col span="18">
                {{ orderDetail.payStatus | payStatusFilter }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 订单金额: </i-col>
              <i-col span="18">
                {{ orderDetail.totalFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 优惠金额: </i-col>
              <i-col span="18">
                {{ orderDetail.discountFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 配送费: </i-col>
              <i-col span="18">
                {{ orderDetail.deliveryFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 应付金额: </i-col>
              <i-col span="18">
                {{ orderDetail.payableFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 支付时间: </i-col>
              <i-col span="18">
                {{ orderDetail.paymentTime ? orderDetail.paymentTime : "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center"> 用户信息 </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 门店名称: </i-col>
              <i-col span="18">
                {{ orderDetail.shopName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 店长名称: </i-col>
              <i-col span="18">
                {{ orderDetail.userName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 店长手机: </i-col>
              <i-col span="18">
                {{ orderDetail.phone }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 所属业务员: </i-col>
              <i-col span="18">
                {{ orderDetail.saleUserName }}
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Divider orientation="center"> 配送信息 </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 收货人: </i-col>
              <i-col span="18">
                {{ deliveryInfo.contactsName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 联系方式: </i-col>
              <i-col span="18">
                {{ deliveryInfo.phone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 收货地址: </i-col>
              <i-col span="18">
                {{ address }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 收货时间: </i-col>
              <i-col span="18">
                {{ orderDetail.receiveTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center"> 商品信息 </Divider>
        <Row>
          <tables
            v-model="orderDetail.orderGoodsList"
            :columns="goodsColumns"
            border
          ></tables>
        </Row>
        <Divider orientation="center"> 售后信息 </Divider>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 审核状态: </i-col>
              <i-col v-if="afterMsg.status === 'WAIT'" span="16">
                <tag color="magenta">
                  {{ "待审核" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'AUDIT_REJECT'" span="16">
                <tag color="orange">
                  {{ "审核拒绝" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'CANCEL'" span="16">
                <tag color="cyan">
                  {{ "客户取消" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'WAIT_REVIEW'" span="16">
                <tag color="cyan">
                  {{ "待财务确认" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'REVIEW_REJECT'" span="16">
                <tag color="orange">
                  {{ "财务拒绝" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'SERVICEING'" span="16">
                <tag color="cyan">
                  {{ "售后中" }}
                </tag>
              </i-col>
              <i-col v-else-if="afterMsg.status === 'FINISH'" span="16">
                <tag color="cyan">
                  {{ "售后完成" }}
                </tag>
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 联系方式: </i-col>
              <i-col span="18">
                {{ afterMsg.phone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 其他原因: </i-col>
              <i-col span="18" style="color: red">
                {{ afterMsg.remark }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="6"> 售后图片: </i-col>
              <i-col span="18">
                <div
                  v-for="item in afterImageList"
                  :key="item"
                  :v-show="afterMsg.images"
                  class="demo-upload-list"
                >
                  <div>
                    <img :src="item">
                    <div class="demo-upload-list-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleUploadView(item)"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center"> 补损信息 </Divider>
        <Row>
          <tables
            v-model="compensateDetail"
            :columns="compensateColumns"
            :loading="tempTableLoading"
            border
          ></tables>
        </Row>
        <Row style="margin-top: 10px">
          <i-col span="10">
            <Row>
              <i-col span="6">
                退款总金额：{{ afterMsg.refundAmount | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="10">
            <Row class="check">
              <i-col span="6">
                退运费金额：{{
                  afterMsg.refundFreightAmount | fenToYuanDot2Filters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div v-show="afterMsg.status === 'WAIT_REVIEW'" slot="footer">
        <Button type="error" @click="hanldeFinanceRefuse('pass')">
          审核拒绝
        </Button>
        <Button type="primary" @click="hanldeFinanceAudit('refuse')">
          审核通过
        </Button>
      </div>
    </Modal>
    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getFinanceAuditPages,
  getFinanceAudit,
  getFinanceRefuse,
  getOrderDetail,
  getOrderGoods
} from '@/api/wholesale';
import { fenToYuanDot2, fenToYuanDot2Number, download } from '@/libs/util';
import { serviceModeEnum, serviceStatusEnum } from '@/libs/enumerate';
import { serviceModeConvert, serviceStatusConvert } from '@/libs/converStatus';
import tableMixin from '@/mixins/tableMixin.js';

const orderDetail = {
  addressDetail: '',
  afterSaleTime: '',
  afterStatus: '',
  checkStatus: '',
  createTime: '',
  createTimeBegin: '',
  createTimeEnd: '',
  currentOrderStatus: '',
  deliveryAddress: '',
  deliveryFee: '',
  deliveryTime: '',
  discountFee: '',
  hdCode: '',
  hdStatus: '',
  id: '',
  invoiceStatus: '',
  needPay: '',
  notHdStatus: '',
  orderCode: '',
  orderCoupon: '',
  orderGoodsList: [],
  orderStatus: '',
  delivery: '',
  orderStatusIn: '',
  payStatus: '',
  payableFee: '',
  paymentTime: '',
  phone: '',
  receiveTime: '',
  refundFee: '',
  remarks: '',
  saleUserName: '',
  salesmanId: '',
  settlementType: '',
  shopCode: '',
  shopName: '',
  totalFee: '',
  userId: '',
  userName: ''
};
const afterMsg = {
  id: '',
  userId: '',
  orderId: '',
  remark: '',
  images: '',
  phone: '',
  serviceMode: '',
  status: '',
  statusList: null,
  createTime: null,
  orderGoods: '',
  serviceGoods: '',
  replenishGoods: '',
  refundAmount: 0,
  refundFreightAmount: 0,
  totalRefundAmount: 0,
  serviceReason: '',
  auditUser: '',
  auditTime: null,
  reviewUser: '1',
  reviewTime: null,
  finishTime: null,
  order: {},
  postSaleGoods: []
};
const compensateDetail = [
  {
    orderGoods: {},
    postSaleGoods: {}
  }
];
const rowData = {
  page: 1,
  rows: 20,
  startTime: null,
  endTime: null,
  orderCode: '',
  hdCode: '',
  userName: '',
  phone: '',
  serviceMode: null,
  status: 'WAIT_REVIEW',
  sidx: 't.auditTime',
  sort: 'desc'
};
// 地址对象
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
// 商品对象
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
// 审核对象
const postSaleAudit = {
  id: 0,
  postSaleGoods: [],
  refundAmount: 0,
  refundFreightAmount: 0
};
// 商品列表
const goodsColumns = [
  {
    title: '商品编号',
    key: 'goodsId',
    align: 'center'
  },
  {
    title: '商品名称',
    key: 'goodsName',
    align: 'center',
    minWidth: 130
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
    key: 'standard',
    align: 'center',
    minWidth: 130
  },
  {
    title: '购买数量',
    key: 'quanity',
    align: 'center'
  },
  {
    title: '商品单位',
    key: 'unitName',
    align: 'center'
  },
  {
    title: '商品单价',
    key: 'goodsPrice',
    align: 'center',
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
    title: '商品类型',
    align: 'center',
    key: 'flash',
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

// 补损信息列表
const compensateColumns = [
  {
    title: '商品名称',
    key: 'goodsName',
    align: 'center',
    minWidth: 120,
    render(h, params, vm) {
      const data = !params.row.orderGoods.goodsName
        ? ''
        : params.row.orderGoods.goodsName;
      return <div>{data}</div>;
    }
  },
  {
    title: '商品规格',
    key: 'standard',
    align: 'center',
    minWidth: 120,
    render(h, params, vm) {
      const data = !params.row.orderGoods.standard
        ? ''
        : params.row.orderGoods.standard;
      return <div>{data}</div>;
    }
  },
  {
    title: '数量',
    key: 'quanity',
    align: 'center',
    minWidth: 40,
    render(h, params, vm) {
      const data = !params.row.orderGoods.quanity
        ? ''
        : params.row.orderGoods.quanity;
      return <div>{data}</div>;
    }
  },
  {
    title: '单位',
    key: 'goodsUnit',
    align: 'center',
    minWidth: 40,
    render(h, params, vm) {
      const data = !params.row.orderGoods.goodsUnit
        ? ''
        : params.row.orderGoods.goodsUnit;
      return <div>{data}</div>;
    }
  },
  {
    title: '折后单价',
    key: 'discountGoodsPrice',
    align: 'center',
    minWidth: 50,
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.orderGoods.discountGoodsPrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '总价',
    key: 'discountGoodsPrice',
    align: 'center',
    minWidth: 40,
    render(h, params, vm) {
      const amount = fenToYuanDot2(
        params.row.orderGoods.quanity * params.row.orderGoods.discountGoodsPrice
      );
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品类型',
    key: 'flash',
    minWidth: 100,
    align: 'center',
    render(h, params, vm) {
      if (params.row.orderGoods.flash === 0) {
        return (
          <div>
            <tag color='primary'>普通商品</tag>
          </div>
        );
      } else if (params.row.orderGoods.flash === 1) {
        return (
          <div>
            <tag color='pink'>抢购商品</tag>
          </div>
        );
      }
    }
  },
  {
    title: '售后方式',
    key: 'serviceMode',
    align: 'center',
    minWidth: 50,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h(
          'Select',
          {
            props: {
              value: params.row.postSaleGoods.serviceMode,
              transfer: true
            },
            style: {
              width: '100%',
              height: '100%'
            },
            on: {
              'on-change': (event) => {
                params.row.postSaleGoods.serviceMode = event;
                if (event === 'NORMAL' || event === 'ABNORMAL') {
                  params.row.postSaleGoods.unitCode = null;
                  params.row.postSaleGoods.unitName = null;
                }
              }
            }
          },
          [
            h(
              'Option',
              {
                props: {
                  value: 'NORMAL'
                }
              },
              '正常'
            ),
            h(
              'Option',
              {
                props: {
                  value: 'ABNORMAL'
                }
              },
              '异常'
            ),
            h(
              'Option',
              {
                props: {
                  value: 'REPLENISH'
                }
              },
              '补货'
            ),
            h(
              'Option',
              {
                props: {
                  value: 'SUPPLEMENT'
                }
              },
              '补款'
            ),
            h(
              'Option',
              {
                props: {
                  value: 'REVERT'
                }
              },
              '返仓'
            )
          ]
        );
      } else {
        if (params.row.postSaleGoods.serviceMode === 'NORMAL') {
          return h('div', '正常');
        } else if (params.row.postSaleGoods.serviceMode === 'ABNORMAL') {
          return h('div', '异常');
        } else if (params.row.postSaleGoods.serviceMode === 'REPLENISH') {
          return h('div', '补货');
        } else if (params.row.postSaleGoods.serviceMode === 'SUPPLEMENT') {
          return h('div', '补款');
        } else if (params.row.postSaleGoods.serviceMode === 'REVERT') {
          return h('div', '返仓');
        }
      }
    }
  },
  {
    title: '售后原因',
    key: 'serviceReason',
    minWidth: 140,
    align: 'center',
    render: (h, params) => {
      if (
        params.row.isEdit &&
        params.row.postSaleGoods.serviceMode != 'NORMAL'
      ) {
        return h('Form', [
          h('Input', {
            style: {
              marginLeft: '4px',
              width: '100%'
            },
            props: {
              type: 'textarea',
              rows: 4,
              value: params.row.postSaleGoods.serviceReason
            },
            on: {
              input: (event) => {
                params.row.postSaleGoods.serviceReason = event;
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.postSaleGoods.serviceReason);
      }
    }
  },
  {
    title: '售后数量',
    key: 'quantity',
    minWidth: 50,
    align: 'center',
    render: (h, params) => {
      if (
        params.row.isEdit &&
        params.row.postSaleGoods.serviceMode !== 'NORMAL' &&
        params.row.postSaleGoods.serviceMode !== 'ABNORMAL'
      ) {
        return h('Form', [
          h('Input', {
            style: {
              marginLeft: '4px',
              width: '100%'
            },
            props: {
              type: 'text',
              value: params.row.postSaleGoods.quantity
            },
            on: {
              input: (event) => {
                params.row.postSaleGoods.quantity = event;
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.postSaleGoods.quantity);
      }
    }
  },
  {
    title: '单位',
    key: 'unitName',
    minWidth: 40,
    align: 'center',
    render: (h, params) => {
      if (
        params.row.isEdit &&
        params.row.postSaleGoods.serviceMode !== 'NORMAL' &&
        params.row.postSaleGoods.serviceMode !== 'ABNORMAL'
      ) {
        return h(
          'Select',
          {
            props: {
              value: params.row.postSaleGoods.unitCode,
              transfer: true,
              placeholder: '单位'
            },
            style: {
              width: '67px',
              height: '100%'
            },
            on: {
              'on-change': (event) => {
                params.row.postSaleGoods.unitCode = event;
                if (event === '01') {
                  params.row.postSaleGoods.unitName = '个';
                } else if (event === '02') {
                  params.row.postSaleGoods.unitName = '盒';
                } else if (event === '03') {
                  params.row.postSaleGoods.unitName = '袋';
                } else if (event === '04') {
                  params.row.postSaleGoods.unitName = '件';
                } else if (event === '05') {
                  params.row.postSaleGoods.unitName = '盘';
                } else if (event === '06') {
                  params.row.postSaleGoods.unitName = '千克';
                } else if (event === '07') {
                  params.row.postSaleGoods.unitName = '元';
                }
              }
            }
          },
          [
            h(
              'Option',
              {
                props: {
                  value: '01'
                }
              },
              '个'
            ),
            h(
              'Option',
              {
                props: {
                  value: '02'
                }
              },
              '盒'
            ),
            h(
              'Option',
              {
                props: {
                  value: '03'
                }
              },
              '袋'
            ),
            h(
              'Option',
              {
                props: {
                  value: '04'
                }
              },
              '件'
            ),
            h(
              'Option',
              {
                props: {
                  value: '05'
                }
              },
              '盘'
            ),
            h(
              'Option',
              {
                props: {
                  value: '06'
                }
              },
              '千克'
            ),
            h(
              'Option',
              {
                props: {
                  value: '07'
                }
              },
              '元'
            )
          ]
        );
      } else {
        return h('div', params.row.postSaleGoods.unitName);
      }
    }
  },
  {
    title: '补款金额',
    key: 'refundAmount',
    minWidth: 50,
    align: 'center',
    render: (h, params) => {
      if (
        params.row.isEdit &&
        (params.row.postSaleGoods.serviceMode === 'SUPPLEMENT' ||
          params.row.postSaleGoods.serviceMode === 'REVERT')
      ) {
        return h('Form', [
          h('Input', {
            style: {
              marginLeft: '4px',
              width: '100%'
            },
            props: {
              type: 'text',
              value: params.row.postSaleGoods.fillingMoney // 使用key的键值
            },
            on: {
              input: (event) => {
                params.row.postSaleGoods.fillingMoney = event;
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.postSaleGoods.fillingMoney);
      }
    }
  }
];
export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      templatePageOpts: [20, 50],
      downloadLoading: false,
      createLoading: false,
      modalViewLoading: false,
      serviceModeEnum,
      serviceStatusEnum,
      afterImageList: [],
      uploadVisible: false,
      tempTableLoading: false,
      deliveryFlag: false,
      imgUploadViewItem: '',
      deliveryFeeGroup: '否',
      allMoney: 0,
      deliveryFee: 0,
      searchRowData: _.cloneDeep(rowData),
      orderDetail: _.cloneDeep(orderDetail),
      deliveryInfo: _.cloneDeep(deliveryInfo),
      afterMsg: _.cloneDeep(afterMsg),
      compensateDetail: _.cloneDeep(compensateDetail),
      postSaleAudit: _.cloneDeep(postSaleAudit),
      // 商品列表
      goodsColumns,
      compensateColumns,
      serviceMode: [
        {
          label: '正常',
          value: 'NORMAL'
        },
        {
          label: '补货',
          value: 'REPLENISH'
        },
        {
          label: '补款',
          value: 'SUPPLEMENT'
        },
        {
          label: '返仓',
          value: 'REVERT'
        }
      ],
      // 售后列表
      columns: [
        {
          title: '申请时间',
          key: 'createTime',
          fixed: 'left',
          width: 180,
          align: 'center'
        },
        {
          title: '订单编号',
          key: 'orderCode',
          fixed: 'left',
          width: 190,
          align: 'center'
        },
        {
          title: '海鼎单号',
          key: 'hdCode',
          fixed: 'left',
          width: 180,
          align: 'center'
        },
        {
          title: '售后方式',
          fixed: 'left',
          align: 'center',
          width: 120,
          key: 'serviceMode',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.serviceMode) {
              return <div>{row.serviceMode}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '售后状态',
          align: 'center',
          fixed: 'left',
          width: 110,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'WAIT') {
              return (
                <div>
                  <tag color='magenta'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'AUDIT_REJECT') {
              return (
                <div>
                  <tag color='orange'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'CANCEL') {
              return (
                <div>
                  <tag color='cyan'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'WAIT_REVIEW') {
              return (
                <div>
                  <tag color='pink'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'REVIEW_REJECT') {
              return (
                <div>
                  <tag color='error'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'SERVICEING') {
              return (
                <div>
                  <tag color='gold'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            } else if (row.status === 'FINISH') {
              return (
                <div>
                  <tag color='success'>{serviceStatusConvert(row.status)}</tag>
                </div>
              );
            }
            return <div>{row.status}</div>;
          }
        },
        {
          title: '门店名称',
          align: 'center',
          width: 160,
          key: 'shopName'
        },
        {
          title: '店长名称',
          align: 'center',
          width: 100,
          key: 'userName'
        },
        {
          title: '店长手机',
          align: 'center',
          width: 130,
          key: 'phone'
        },
        {
          title: '商品名称',
          align: 'center',
          width: 160,
          key: 'orderGoods'
        },
        {
          title: '实付金额',
          align: 'center',
          width: 120,
          key: 'payableFee',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.payableFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '收货区域',
          align: 'center',
          width: 160,
          key: 'receiptArea'
        },
        {
          title: '操作',
          minWidth: 120,
          resizable: true,
          align: 'center',
          fixed: 'right',
          key: 'handle',
          options: ['operate', 'finish']
        }
      ]
    };
  },
  computed: {
    address() {
      const addressArea = this.deliveryInfo.addressArea
        ? this.deliveryInfo.addressArea.replace(new RegExp('/', 'gm'), '')
        : '';
      return addressArea + this.deliveryInfo.addressDetail;
    }
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
      if (this.searchRowData.rows === -1) {
        this.searchRowData.rows = 20;
      }
      getFinanceAuditPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getOrderDetail(id) {
      this.afterImageList = [];
      getOrderDetail({ id: id })
        .then((res) => {
          this.orderDetail = res.order;
          this.afterMsg = res;
          res.postSaleGoodsDtoList.forEach((element) => {
            element.isEdit = false;
            element.status = res.status;
            element.postSaleGoods.refundAmount =
              element.postSaleGoods.refundAmount / 100;
          });
          this.compensateDetail = res.postSaleGoodsDtoList;
          if (this.orderDetail.deliveryAddress) {
            const deliveryInfo = JSON.parse(this.orderDetail.deliveryAddress);
            this.deliveryInfo = _.cloneDeep(deliveryInfo);
          }
          if (this.afterMsg.images) {
            const imageList = this.afterMsg.images.split(',');

            for (let i = 0; i < imageList.length; i++) {
              if (imageList[i] != '') {
                this.afterImageList.push(imageList[i]);
              }
            }
          }
          this.modalView = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 根据id修改
    handleOperate(params) {
      this.loading = true;
      this.allMoney = 0;
      const id = params.row.id;
      this.tempModalType = this.modalType.edit;
      this.deliveryFeeGroup = '否';
      this.deliveryFlag = false;
      this.getOrderDetail(id);
    },
    dateGroupChange(value) {
      value === '是' ? (this.deliveryFlag = true) : (this.deliveryFlag = false);
    },
    startTimeChange(value, date) {
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, data) {
      this.searchRowData.endTime = value;
    },
    handleUploadView(item) {
      this.imgUploadViewItem = item;
      this.uploadVisible = true;
    },
    // 财务审核通过
    hanldeFinanceAudit() {
      getFinanceAudit(this.afterMsg)
        .then((res) => {
          this.$Message.info('通过审核');
          this.getTableData();
          this.modalView = false;
        })
        .finally(() => {});
    },
    // 财务审核拒绝
    hanldeFinanceRefuse() {
      getFinanceRefuse(this.afterMsg)
        .then((res) => {
          this.$Message.info('拒绝审核');
          this.getTableData();
          this.modalView = false;
        })
        .finally(() => {});
    },
    handleDownload(name) {
      const dataParams = this.searchRowData;
      dataParams.name = name;
      dataParams.rows = -1;
      getOrderGoods(dataParams).then((res) => {
        if (!res) {
          this.$Message.info('暂无任何数据返回');
          return;
        }
        const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
        const fileType =
          name === 'POST_SALE_ORDER_GOODS' ? '售后订单商品' : '售后订单';
        const fileName = `${fileType}-${date}.xls`;
        download(res, fileName);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.check {
  display: flex;
  align-items: center;
}
</style>
