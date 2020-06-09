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
        @on-view="handleView"
      >
        <div slot="searchCondition">
          <Row>
            <!-- 金额总计 -->
            <div class="sum">
              金额总计：&yen;{{ sum }} 元
              <!-- <count-to :simplify="true" :delay="500" :end="sum" count-class="count-text" unit-class="unit-class">
                  <span slot="left" class="slot-text">金额总计：&yen;{{sum }}&nbsp;</span>
                  <span slot="right" class="slot-text">&nbsp;元</span>
              </count-to>-->
            </div>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="支付时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="支付时间止"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Select
              v-model="searchRowData.app_type"
              placeholder="应用类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in appTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.payType"
              placeholder="支付类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in payTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.payStep"
              placeholder="支付步骤"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in payStepEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.sourceType"
              placeholder="支付来源"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in sourceTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
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
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
            <Button class="search-btn mr2" type="warning" @click="handleDownload">
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

    <!--
    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>机器人详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">主键ID:</i-col>
              <i-col span="18">{{ paymentLogDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">门店id:</i-col>
              <i-col span="18">{{ paymentLogDetail.storeId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ paymentLogDetail.storeName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户id:</i-col>
              <i-col span="18">{{ paymentLogDetail.userId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">收货人:</i-col>
              <i-col span="18">{{ paymentLogDetail.receiverName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">联系方式:</i-col>
              <i-col span="18">{{ paymentLogDetail.receiverMobile }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户昵称:</i-col>
              <i-col span="18">{{ paymentLogDetail.nickName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户头像:</i-col>
              <i-col span="18">
                <img :src="paymentLogDetail.avater" style="width: 150px" />
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>-->
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import CountTo from "_c/count-to";
import _ from "lodash";
import { getPaymentLogPages, getPaymentLogSum } from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { fenToYuanDot2, fenToYuanDot2Number } from "@/libs/util";
import {
  appTypeConvert,
  payTypeConvert,
  payStepConvert,
  sourceTypeConvert,
  bankTypeConvert
} from "@/libs/converStatus";
import {
  appTypeEnum,
  payTypeEnum,
  payStepEnum,
  sourceTypeEnum
} from "@/libs/enumerate";

const paymentLogDetail = {
  id: 0,
  orderId: "",
  userId: 0,
  app_type: null,
  sourceType: null,
  payType: null,
  payStep: null,
  payFee: 0,
  tradeId: "",
  rechargeAmount: 0,
  signAt: null,
  payAt: null,
  bankType: null,
  deleted: "",
  orderCode: "",
  startTime: null,
  endTime: null,
  nickName: ""
};

const roleRowData = {
  startTime: null,
  endTime: null,
  sourceType: null,
  payType: null,
  payStep: null,
  app_type: null,
  page: 1,
  rows: 10,
  sum: null,
  sidx: "signAt",
  sort: "desc"
};

export default {
  components: {
    Tables,
    CountTo
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      columns: [
        {
          title: "订单ID",
          key: "orderId",
          width: 170,
          align: "center",
          fixed: "left"
        },
        {
          title: "用户ID",
          key: "userId",
          align: "center",
          width: 80
        },
        {
          title: "应用类型",
          key: "app_type",
          align: "center",
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.app_type === "WXSMALL_SHOP") {
              return (
                <div>
                  <tag color="green">{appTypeConvert(row.app_type).label}</tag>
                </div>
              );
            } else if (row.app_type === "S_MALL") {
              return (
                <div>
                  <tag color="gold">{appTypeConvert(row.app_type).label}</tag>
                </div>
              );
            } else {
              return <div>{row.app_type}</div>;
            }
          }
        },
        {
          title: "支付类型",
          width: 120,
          key: "payType",
          align: "center",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.payType === "weixin") {
              return (
                <div>
                  <tag color="green">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === "balance") {
              return (
                <div>
                  <tag color="gold">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === "points") {
              return (
                <div>
                  <tag color="pink">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else if (row.payType === "haiding") {
              return (
                <div>
                  <tag color="warning">{payTypeConvert(row.payType).label}</tag>
                </div>
              );
            } else {
              return <div>{row.payType}</div>;
            }
          }
        },
        {
          title: "支付来源",
          width: 120,
          align: "center",
          key: "sourceType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.sourceType === "recharge") {
              return (
                <div>
                  <tag color="green">
                    {sourceTypeConvert(row.sourceType).label}
                  </tag>
                </div>
              );
            } else if (row.sourceType === "order") {
              return (
                <div>
                  <tag color="gold">
                    {sourceTypeConvert(row.sourceType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.sourceType}</div>;
            }
          }
        },
        {
          title: "第三方支付金额",
          width: 130,
          key: "payFee",
          align: "center",
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.payFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: "实际到账金额",
          width: 110,
          key: "rechargeAmount",
          align: "center",
          render(h, params, vm) {
            if (params.row.sourceType === "recharge") {
              const amount = fenToYuanDot2(params.row.rechargeAmount);
              return <div>{amount}</div>;
            } else {
              return <div>{"N/A"}</div>;
            }
          }
        },
        {
          title: "第三方单号",
          key: "tradeId",
          align: "center",
          width: 170
        },
        {
          title: "支付步骤",
          width: 100,
          align: "center",
          key: "payStep",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.payStep === "paid") {
              return (
                <div>
                  <tag color="green">{payStepConvert(row.payStep).label}</tag>
                </div>
              );
            } else if (row.payStep === "sign") {
              return (
                <div>
                  <tag color="gold">{payStepConvert(row.payStep).label}</tag>
                </div>
              );
            } else {
              return <div>{row.payStep}</div>;
            }
          }
        },
        {
          title: "签名时间",
          key: "signAt",
          align: "center",
          width: 110
        },
        {
          title: "支付时间",
          align: "center",
          key: "payAt",
          width: 110
        },
        {
          title: "银行类型",
          key: "bankType",
          align: "center",
          width: 140,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{bankTypeConvert(row.bankType).label}</div>;
          }
        },
        {
          title: "用户昵称",
          align: "center",
          key: "nickName"
        }
        // {
        //   title: '操作',
        //   minWidth: 80,
        //   key: 'handle',
        //   options: ['view']
        // }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      paymentLogDetail: _.cloneDeep(paymentLogDetail),
      appTypeEnum,
      payTypeEnum,
      payStepEnum,
      sourceTypeEnum,
      sum: 0
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    // 导出
    handleDownload() {
      // 导出不分页 按条件查出多少条导出多少条 限制每次最多5000条
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      let pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      console.log(this.searchRowData.rows);
      getPaymentLogPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 恢复正常页数
        this.searchRowData.rows = 10;
        this.searchRowData.page = pageSize;
        console.log(this.searchRowData.rows);
        // 表格数据导出字段翻译
        const _this = this;
        tableData.forEach(item => {
          item["app_type"] = appTypeConvert(item["app_type"]).label;
          item["payType"] = payTypeConvert(item["payType"]).label;
          item["sourceType"] = sourceTypeConvert(item["app_type"]).label;
          item["payFee"] = (item["payFee"] / 100.0).toFixed(2);
          item["payStep"] = payStepConvert(item["app_type"]).label;
          item["bankType"] = bankTypeConvert(item["bankType"]).label;
        });
        _this.$refs.tables.handleDownload({
          filename: `鲜果币流水信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.paymentLogDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    getTableData() {
      const _this = this;
      getPaymentLogPages(this.searchRowData)
        .then(res => {
          console.log("12312312", res);
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
      // 金额统计
      getPaymentLogSum(this.searchRowData).then(function(result) {
        _this.sum = fenToYuanDot2Number(result);
      });
    },
    startTimeChange(value, date) {
      this.paymentLogDetail.startTime = value;
      this.searchRowData.startTime = value;
    },
    endTimeChange(value, date) {
      this.paymentLogDetail.endTime = value;
      this.searchRowData.endTime = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.sum {
  display: inline-block;
  min-width: 125px;
  height: 32px;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  line-height: 32px;
  text-align: center;
  padding: 0 10px;
  margin-right: 5px;
  font-size: 14px;
}
.sum:hover {
  border: 1px solid #57a3f3;
  color: red;
}
</style>
