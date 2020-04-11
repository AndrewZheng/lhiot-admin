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
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.customOrderCode"
              placeholder="定制编码"
              class="search-input mr5"
              style="width: 120px"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.phone"
              placeholder="用户手机号"
              class="search-input mr5"
              style="width: 100px"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.totalQty"
              class="search-col mr5"
              placeholder="定制周期"
              style="width: 100px"
              clearable>
              <Option
                v-for="item in totalQtyList"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.quantity"
              class="search-col mr5"
              placeholder="定制份数"
              style="width: 100px"
              clearable>
              <Option
                v-for="item in customCopiesList"
                :value="item.quantity"
                :key="`search-col-${item.quantity}`"
                class="ptb2-5"
              >{{ item.description }}</Option>
            </Select>
            <Select
              v-model="searchRowData.statusIn"
              multiple
              class="search-col mr5"
              placeholder="订单状态"
              style="width: 150px"
              clearable
              @on-change="orderStatusesOnChange">
              <Option
                v-for="item in orderStatus"
                :value="item.value"
                :key="`search-col-${item.value}`"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.beginCreateAt"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              class="mr5"
              style="width: 160px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endCreateAt"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              class="mr5"
              style="width: 160px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
              :loading="searchLoading"
              class="search-btn mr5"
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
              <i-col span="16">{{ orderDetail.customOrderCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户手机号:</i-col>
              <i-col span="16">{{ orderDetail.phone }}</i-col>
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
            <Row v-if="orderDetail.customPlan" class-name="mb10">
              <i-col span="6">定制计划:</i-col>
              <i-col span="18">{{ orderDetail.customPlan.name }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">定制周期:</i-col>
              <i-col span="16">{{ orderDetail.totalQty|customPeriodFilters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">定制份数:</i-col>
              <i-col span="16">{{ orderDetail.quantity }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">定制状态:</i-col>
              <i-col span="16">{{ orderDetail.status|customOrderStatusFilters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">配送方式:</i-col>
              <i-col span="16">{{ orderDetail.deliveryType|deliveryTypeCustomFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row
          v-if="orderDetail.deliveryType === deliveryTypeCustom.AUTO"
          style="background: lightgray;margin-bottom: 10px"
        >
          <Row>
            <i-col span="24">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货地址:</i-col>
                <i-col span="16">
                  {{ orderDetail.deliveryAddress +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+ orderDetail.nickname +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+
                  orderDetail.phone }}
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Row class="mb10 pl10 pt5">
                <i-col span="8">收货时间:</i-col>
                <i-col span="16">{{ orderDetail.deliveryTime }}</i-col>
              </Row>
            </i-col>
          </Row>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">定制总额:</i-col>
              <i-col span="16">{{ orderDetail.price|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">剩余次数:</i-col>
              <i-col span="16">{{ orderDetail.remainingQty }}</i-col>
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
          <tables
            :columns="orderViewRelationsColumn"
            v-model="orderDetail.customOrderDeliveryList"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getCustomOrdersPages, getCustomPlanSpecificationStandardsPages, getcustomOrders } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import { fenToYuanDot2 } from '@/libs/util';
import { deliveryTypeCustom, customOrderStatusEnum } from '@/libs/enumerate';
import { customOrderStatusConvert, customPeriodConvert, deliveryTypeCustomConvert, customDeliverStatusConvert } from '@/libs/converStatus';
import BookTypeOption from '_c/book-type-option';

const orderDetail = {
  id: 54,
  customOrderCode: '',
  userId: '',
  userIds: null,
  status: '',
  statusIn: null,
  remainingQty: 0,
  deliveryType: '',
  totalQty: 0,
  planId: 0,
  price: 0,
  createAt: '',
  quantity: 1,
  specificationId: 58,
  receiveUser: '',
  contactPhone: '',
  deliveryTime: null,
  deliveryAddress: '',
  storeCode: '',
  customPlan: null,
  customOrderDeliveryList: [],
  nickname: '',
  phone: '',
  beginCreateAt: null,
  endCreateAt: null,
  payId: '',
  description: '',
  endExtractionAt: null,
  alreadyPauseDay: null
};
const roleRowData = {
  totalQty: null,
  quantity: null,
  endCreateAt: null,
  customOrderCode: null,
  phone: null,
  orderStatuses: null,
  orderType: null,
  status: null,
  statusIn: null,
  page: 1,
  rows: 10
};
export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin],
  data() {
    return {
      totalQtyList: [
        {
          label: '周',
          value: 7
        },
        {
          label: '月',
          value: 30
        }
      ],
      customCopiesList: [],
      orderStatus: customOrderStatusEnum,
      deliveryTypeCustom: deliveryTypeCustom,
      orderViewRelationsColumn: [
        {
          title: '配送时间',
          minWidth: 100,
          key: 'dayOfPeriod',
          render(h, params, vm) {
            return <div>{'第' + params.row.dayOfPeriod + '天'}</div>;
          }
        },
        {
          title: '配送套餐',
          minWidth: 100,
          key: 'productName'
        },
        {
          title: '配送状态',
          minWidth: 100,
          key: 'deliveryStatus',
          render(h, params, vm) {
            if (params.row.deliveryStatus) {
              return <div>{customDeliverStatusConvert(params.row.deliveryStatus).label}</div>;
            } else {
              return <div>{'未配送'}</div>;
            }
          }
        },
        {
          title: '收货时间',
          minWidth: 100,
          key: 'recevingTime'
        }
      ],
      columns: [
        {
          title: '定制编码',
          key: 'customOrderCode',
          width: 170,
          fixed: 'left'
        },
        {
          title: '用户手机号',
          width: 150,
          key: 'phone'
        },
        {
          title: '定制计划',
          width: 120,
          key: 'name',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{row.customPlan.name}</div>;
          }
        },
        {
          title: '定制周期',
          width: 120,
          key: 'totalQty',
          render(h, params, vm) {
            if (params.row.totalQty === 7) {
              return <div><tag color='blue'>{customPeriodConvert(params.row.totalQty).label}</tag></div>;
            } else if (params.row.totalQty === 30) {
              return <div><tag color='cyan'>{customPeriodConvert(params.row.totalQty).label}</tag></div>;
            } else {
              return <div>{params.row.totalQty}</div>;
            }
          }
        },
        {
          title: '定制份数',
          width: 120,
          key: 'description',
          render(h, params, vm) {
            if (params.row.description === '单人套餐') {
              return <div><tag color='geekblue'>{params.row.description}</tag></div>;
            } else if (params.row.description === '双人套餐') {
              return <div><tag color='purple'>{params.row.description}</tag></div>;
            } else if (params.row.description === '三人套餐') {
              return <div><tag color='magenta'>{params.row.description}</tag></div>;
            } else {
              return <div>{params.row.description}</div>;
            }
          }
        },
        {
          title: '定制金额',
          width: 120,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '定制状态',
          width: 120,
          key: 'status',
          render(h, params, vm) {
            // WAIT_PAYMENT-待付款
            // CUSTOMING-定制中
            // PAUSE_DELIVERY-暂停配送
            // INVALID-已失效
            // FINISHED-已结束
            if (params.row.status === 'WAIT_PAYMENT') {
              return <div><tag color='default'>{customOrderStatusConvert(params.row.status).label}</tag></div>;
            } else if (params.row.status === 'CUSTOMING') {
              return <div><tag color='primary'>{customOrderStatusConvert(params.row.status).label}</tag></div>;
            } else if (params.row.status === 'PAUSE_DELIVERY') {
              return <div><tag color='warning'>{customOrderStatusConvert(params.row.status).label}</tag></div>;
            } else if (params.row.status === 'INVALID') {
              return <div><tag color='error'>{customOrderStatusConvert(params.row.status).label}</tag></div>;
            } else if (params.row.status === 'FINISHED') {
              return <div><tag color='success'>{customOrderStatusConvert(params.row.status).label}</tag></div>;
            } else {
              return <div>{params.row.status}</div>;
            }
          }
        },
        {
          title: '配送方式',
          width: 120,
          key: 'deliveryType',
          render: (h, params, vm) => {
            if (params.row.deliveryType === 'MANUAL') {
              return <div><tag color='green'>{deliveryTypeCustomConvert(params.row.deliveryType).label}</tag></div>;
            } else if (params.row.deliveryType === 'AUTO') {
              return <div><tag color='gold'>{deliveryTypeCustomConvert(params.row.deliveryType).label}</tag></div>;
            } else {
              return <div>{params.row.deliveryType}</div>;
            }
          }
        },
        {
          title: '剩余次数',
          width: 100,
          key: 'remainingQty'
        },
        {
          title: '创建时间',
          width: 160,
          key: 'createAt'
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          fixed: 'right',
          options: ['view']
        }
      ],
      searchRowData: this._.cloneDeep(roleRowData),
      orderDetail: this._.cloneDeep(orderDetail),
      exportType: 'xlsx',
      downloadLoading: false
    };
  },
  created() {
    this.searchLoading = true;
    this.clearSearchLoading = true;
    getCustomPlanSpecificationStandardsPages({}).then(res => {
      this.customCopiesList = res.array;
      this.getTableData();
    }).catch(() => {
      this.searchLoading = true;
      this.clearSearchLoading = true;
    });
  },
  methods: {
    orderStatusesOnChange(value) {
      console.log(value);
      if (value.length === 0) {
        this.searchRowData.statusIn = null;
      }
    },
    startTimeChange(value, date) {
      this.searchRowData.beginCreateAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endCreateAt = value;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.loading = true;
      getcustomOrders({ id: params.row.customOrderCode }).then(res => {
        this.orderDetail = res;
        this.modalView = true;
      }).finally(res => {
        this.loading = false;
      });
    },
    getTableData() {
      this.loading = true;
      getCustomOrdersPages(this.searchRowData).then(res => {
        this.tableData = res.array;
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
      getCustomOrdersPages(this.searchRowData).then(res => {
        const tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['customOrderCode'] = item['customOrderCode'] + '';
          item['name'] = item['customPlan']['name'];
          item['price'] = (item['price'] / 100.00).toFixed(2);
          item['status'] = customOrderStatusConvert(item['status']).label;
          item['deliveryType'] = deliveryTypeCustomConvert(item['deliveryType']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `定制订单信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
