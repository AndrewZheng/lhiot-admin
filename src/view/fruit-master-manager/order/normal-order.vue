<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-view="handleView"
              :searchAreaColumn="20"
              :operateAreaColumn="4"
      >
        <div slot="searchCondition">
          <Row>
            <Col span="24">
              <Input placeholder="订单编码" class="search-input mr5" v-model="searchRowData.name" style="width: 120px"/>
              <Input placeholder="用户手机号" class="search-input mr5" v-model="searchRowData.phoneNumber" style="width: 100px"/>
              <Select class="search-col mr5" placeholder="订单类型" style="width: 100px">
                <Option v-for="item in orderType" :value="item.value" class="ptb2-5" :key="`search-col-${item.value}`">
                  {{item.value}}
                </Option>
              </Select>
              <Select class="search-col mr5" placeholder="订单状态" style="width: 100px">
                <Option v-for="item in orderStatus" :value="item.value" class="mb10 ml15"
                        :key="`search-col-${item.value}`">{{item.value}}
                </Option>
              </Select>
              <DatePicker type="datetime" placeholder="开始时间" class="mr5" style="width: 160px"></DatePicker>
              <i>-</i>
              <DatePicker type="datetime" placeholder="结束时间" class="mr5" style="width: 160px"></DatePicker>
            </Col>
              <Button v-waves @click="handleSearch" class="search-btn ml5" type="primary">
                <Icon type="md-search"/>&nbsp;搜索
              </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="warning">
            门店调货
          </Button>
          <Button v-waves type="primary" @click="exportExcel" class="ml15">导出</Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <!--查看订单详情-->
    <Modal
      v-model="modalView"
      :width="700"
    >
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
              <i-col span="16">{{orderDetail.phone}}</i-col>
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
                <i-col span="16">{{orderDetail.address +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+ orderDetail.nickname +`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+ orderDetail.phone}}</i-col>
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
          <tables
            border
            :columns="tempColumnsView"
            v-model="deliverNoteList"
          ></tables>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单总额:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">优惠金额:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">折后金额:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户配送费:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">折后金额:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">用户配送费:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎编码:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">海鼎备货时间:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row class-name="mb10">
              <i-col span="8">订单备注:</i-col>
              <i-col span="16">{{orderDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <tables
            border
            :columns="orderViewRelationsColumn"
            v-model="orderDetail.productShelfList"
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
  import {getOrdersPages,getOrderDetail} from '@/api/fruitermaster';
  import tableMixin from '@/mixins/tableMixin.js'
  import searchMixin from '@/mixins/searchMixin.js'
  import {fenToYuanDot2} from '@/libs/util';

  const orderDetail = {
    id:0,
    code:"",
    userId:"",
    phone:"",
    applicationType:"",
    orderType:"",
    receivingWay:"",
    totalAmount:1203,
    amountPayable:1203,
    deliveryAmount:0,
    couponAmount:0,
    hdStockAt:"",
    status:"",
    receiveUser:"",
    contactPhone:"",
    address:"",
    remark:"",
    deliveryEndAt:"",
    hdOrderCode:"",
    nickname:null,
    deliverAt:null,
    allowRefund:null,
    createAt:"",
    payId:null,
    orderProductList:{},
    orderStore:{},
    orderFlowList:[],
    deliverNote:{}
  };
  const roleRowData = {
    page:1,
    rows:10
  };
  export default {
    components: {
      Tables
    },
    mixins: [tableMixin,searchMixin],
    data() {
      return {
        orderType: [],
        orderStatus: [],
        deliverNoteList:[],
        haiDingStatus: [],
        tempColumnsView:[
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
            render(h,params,vm){
              let amount = fenToYuanDot2(params.row.fee);
              return <div>{amount}</div>
            }

          },
          {
            title: '配送状态',
            minWidth: 100,
            key: 'deliverStatus',
            // 配送状态 UNRECEIVED-未接单 WAIT_GET-待取货 DELIVERING-配送中 DONE-配送完成 FAILURE-配送失败
            render:(h,params,vm) => {
              const {row} = params;
              switch (row.deliverStatus) {
                case 'UNRECEIVED':
                  return <div>{'未接单'}</div>;
                case 'WAIT_GET':
                  return <div>{'待取货'}</div>;
                case 'DELIVERING':
                  return <div>{'配送中'}</div>;
                case 'DONE':
                  return <div>{'配送完成'}</div>;
                case 'FAILURE':
                  return <div>{'配送失败'}</div>;
                default :
                  return <div>{row.orderType}</div>
              }
            }
          },
          {
            title: '接单时间',
            minWidth: 100,
            key: 'receiveTime'
          },
          {
            title: '配送员手机号',
            minWidth: 100,
            key: 'deliverPhone'
          }
        ],
        orderViewRelationsColumn:[
          {
            title: '商品名称',
            minWidth: 100,
            key: 'phone'
          },
          {
            title: '商品条码',
            minWidth: 100,
            key: 'phone'
          },
          {
            title: '规格',
            minWidth: 100,
            key: 'phone'
          },
          {
            title: '购买份数',
            minWidth: 100,
            key: 'phone'
          },
          {
            title: '商品总金额',
            minWidth: 100,
            key: 'phone'
          },
          {
            title: '折后总金额',
            minWidth: 100,
            key: 'phone'
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
            key: 'phone'
          },
          {
            title: '订单类型',
            width: 120,
            render:(h,params,vm) => {
              const {row} = params;
              switch (row.orderType) {
                case 'NORMAL':
                  return <div>{'普通订单'}</div>;
                case 'CUSTOM':
                  return <div>{'定制订单'}</div>;
                case 'TEAM_BUY':
                  return <div>{'团购订单'}</div>;
                default :
                  return <div>{row.orderType}</div>
              }
            }
          },
          {
            title: '订单总金额',
            width: 100,
            render(h,params,vm){
              let amount = fenToYuanDot2(params.row.totalAmount);
              return <div>{amount}</div>
            }
          },
          {
            title: '优惠金额',
            width: 100,
            render(h,params,vm){
              let amount = fenToYuanDot2(params.row.couponAmount);
              return <div>{amount}</div>
            }
          },
          {
            title: '应付金额',
            width: 100,
            render(h,params,vm){
              let amount = fenToYuanDot2(params.row.amountPayable);
              return <div>{amount}</div>
            }
          },
          {
            title: '收货方式',
            width: 100,
            key: 'receivingWay',
            render:(h,params,vm) => {
              const {row} = params;
              switch (row.receivingWay) {
                case 'TO_THE_STORE':
                  return <div>{'门店自提'}</div>;
                case 'TO_THE_HOME':
                  return <div>{'送货上门'}</div>;
                default :
                  return <div>{row.receivingWay}</div>
              }
            }
          },
          {
            title: '订单状态',
            width: 90,
            key: 'status',
            render: (h, params, vm) => {
              const {row} = params;
              switch (row.status) {
                case 'WAIT_PAYMENT':
                  return <div>{'待支付'}</div>;
                case 'WAIT_SEND_OUT':
                  return <div>{'待出库'}</div>;
                case 'SEND_OUTING':
                  return <div>{'出库中'}</div>;
                case 'WAIT_DISPATCHING':
                  return <div>{'待配送'}</div>;
                case 'DISPATCHING':
                  return <div>{'配送中'}</div>;
                case 'RECEIVED':
                  return <div>{'已收货'}</div>;
                case 'RETURNING':
                  return <div>{'退货中'}</div>;
                case 'RETURN_FAILURE':
                  return <div>{'退款失败'}</div>;
                case 'ALREADY_RETURN':
                  return <div>{'退货完成'}</div>;
                case 'FAILURE':
                  return <div>{'已失效'}</div>;
                case 'FINISHED':
                  return <div>{'完成'}</div>;
                default :
                  return <div>{row.status}</div>
              }
            }
          },
          {
            title: '创建时间',
            width: 110,
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
        searchRowData: roleRowData,
        orderDetail:this._.cloneDeep(orderDetail)
      };
    },
    created() {
      this.getTableData();
    },
    methods: {
      resetSearchRowData() {
        this.clearSearchLoading = true
        this.searchRowData = _.cloneDeep(roleRowData);
        this.getTableData()
      },
      handleView(params) {
        this.loading = true;
        getOrderDetail({code:params.row.code}).then( res => {
          this.orderDetail = res
          if (res.deliverNote) {
            this.deliverNoteList.length = 0;
            this.deliverNoteList.push(res.deliverNote)
          };
          this.modalView = true;
        }).finally( res => {
          this.loading = false;
        })
      },
      handleEdit(params) {

      },
      getTableData() {
        getOrdersPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .img {
    width: 150px;
    height: auto !important
  }

  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
