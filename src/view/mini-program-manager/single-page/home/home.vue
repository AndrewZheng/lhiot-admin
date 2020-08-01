<template>
  <div>
    <Row :gutter="20" class="topBox">
      <i-col
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        span="4"
        style="height: 120px;cursor: pointer;"
        @click.native="handgoIng(i)"
      >
        <infor-card :color="infor.color" :icon="infor.icon" :icon-size="36" shadow>
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow style="height: 180px;padding:0 30px">
        <div class="orderBox">
          <div
            class="orderDel"
            v-for="(item, i) in orderTotalData"
            :key="`item-${i}`"
            :class="i>=2?'bg_169bd5':'bg_ff3861'"
          >
            <p style="margin-bottom:30px;">
              <Icon :type="item.icon" />
              {{item.title}}
            </p>
            <div class="orderData">
              <b>{{item.todayNum}}</b>
              <b>{{item.yesterdayNum}}</b>
            </div>
            <div class="orderData" style="font-size:14px;">
              <span>{{item.todayTitle}}</span>
              <span>{{item.yesterdayTitle}}</span>
            </div>
          </div>
        </div>
      </Card>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <i-col span="6">
        <Card shadow>
          <div class="topStore">
            <h3>门店排行</h3>
            <div class="tabStore">
              <span
                data-index="COUNT_ORDER_AMOUNT"
                :class="storeStatus=='COUNT_ORDER_AMOUNT'?'checked':''"
                @click="storeDataChange"
              >今日销售额</span>
              <span
                data-index="COUNT_ORDER"
                :class="storeStatus=='COUNT_ORDER'?'checked':''"
                @click="storeDataChange"
              >今日订单数</span>
            </div>
          </div>
          <div v-for="(item, i) in storeRank" :key="`items-${i}`" class="storeRanking">
            <div>
              <b>{{i+1}}</b>
              <span>{{item.storeName}}</span>
            </div>
            <p v-if="storeStatus=='COUNT_ORDER_AMOUNT'">{{item.sumAmount}}</p>
            <p v-else>{{item.totalCount}}</p>
          </div>
        </Card>
      </i-col>
      <i-col span="18">
        <Card shadow>
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
              <h3 style="display:inline-block">商品点赞/点踩排行</h3>
              <div class="seniority" style="display:inline-block">
                <span
                  data-index="PRAISE"
                  :class="seniorityStatus=='PRAISE'?'checked':''"
                  @click="productDataChange"
                >按点赞排行</span>
                <span
                  data-index="TREAD"
                  :class="seniorityStatus=='TREAD'?'checked':''"
                  @click="productDataChange"
                >按点踩排行</span>
              </div>
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
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <Card shadow>
        <tables
          ref="tables"
          v-model="goodsTableData"
          :columns="goodsColumns"
          :loading="loading"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <h3 style="display:inline-block">商品规格销售排行</h3>
            <div class="seniority" style="display:inline-block">
              <span
                data-index="SALE_COUNT"
                :class="saleStatus=='SALE_COUNT'?'checked':''"
                @click="saleDataChange"
              >按销售数排</span>
              <span
                data-index="SALE_AMOUNT"
                :class="saleStatus=='SALE_AMOUNT'?'checked':''"
                @click="saleDataChange"
              >按销售额排</span>
            </div>
          </div>
        </tables>
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="goodsTotal"
              :current="goodsSearchRowData.page"
              show-sizer
              show-total
              @on-change="goodsChangePage"
              @on-page-size-change="goodsChangePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import config from "@/config";
import Tables from "_c/tables";
import _ from "lodash";
import {
  getWaitOrder,
  getOrderTotal,
  storeRanking,
  productRanking,
  productStanardRanking,
} from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  setSmallGoodsStandard,
} from "@/libs/util";

const roleRowData = {
  rankingType: "PRAISE",
  page: 1,
  rows: 10,
};

const goodsRoleRowData = {
  rankingType: "SALE_COUNT",
  beginDate: "",
  endDate: "",
  page: 1,
  rows: 10,
};

export default {
  name: "Home",
  components: {
    InforCard,
    CountTo,
    Tables,
  },
  mixins: [tableMixin, searchMixin],
  data() {
    return {
      brandType: config.brandType,
      storeStatus: "COUNT_ORDER_AMOUNT",
      seniorityStatus: "PRAISE",
      saleStatus: "SALE_COUNT",
      storeRank: [],
      goodsTableData: [],
      goodsTotal: 0,
      searchRowData: _.cloneDeep(roleRowData),
      goodsSearchRowData: _.cloneDeep(goodsRoleRowData),
      inforCardData: [
        {
          title: "预售订单",
          typeCode: "PRESAL_ORDER",
          queryDay: 0,
          icon: "ios-copy",
          count: 0,
          color: "#ff3861",
        },
        {
          title: "提货过期",
          typeCode: "DELIVERY_EXPIRES",
          queryDay: 0,
          icon: "md-clock",
          count: 0,
          color: "#19be6b",
        },
        {
          title: "配送异常",
          typeCode: "DELIVERY_FAILURE",
          queryDay: 0,
          icon: "md-bus",
          count: 0,
          color: "#ff9900",
        },
        {
          title: "海鼎异常",
          typeCode: "HD_FAILURE",
          queryDay: 0,
          icon: "md-close-circle",
          count: 0,
          color: "#9A66E4",
        },
        {
          title: "退款订单",
          typeCode: "REFUND_ORDER",
          queryDay: 0,
          icon: "ios-cloud-download",
          count: 0,
          color: "#ed3f14",
        },
      ],
      orderTotalData: [
        {
          title: "销售额",
          todayTitle: "今日销售额",
          yesterdayTitle: "昨日销售额",
          icon: "logo-yen",
          todayNum: 0,
          yesterdayNum: 0,
        },
        {
          title: "订单量",
          todayTitle: "今日订单数",
          yesterdayTitle: "昨日订单数",
          icon: "ios-stats",
          todayNum: 0,
          yesterdayNum: 0,
        },
        {
          title: "退单额",
          todayTitle: "今日退单额",
          yesterdayTitle: "昨日退单额",
          icon: "logo-yen",
          todayNum: 0,
          yesterdayNum: 0,
        },
        {
          title: "退单数",
          todayTitle: "今日退单数",
          yesterdayTitle: "昨日退单数",
          icon: "ios-stats",
          todayNum: 0,
          yesterdayNum: 0,
        },
      ],
      columns: [
        {
          title: "排名",
          key: "standardId",
          width: "60px",
          align: "center",
          render(h, params, vm) {
            const { row } = params;
            return <div>{row._index + 1}</div>;
          },
        },
        {
          title: "规格ID",
          key: "standardId",
          align: "center",
        },
        {
          title: "商品名称",
          key: "productName",
          align: "center",
        },
        {
          title: "规格",
          key: "specification",
          align: "center",
        },
        {
          title: "点赞",
          align: "center",
          key: "praiseCount",
        },
        {
          title: "点踩",
          key: "treadCount",
          align: "center",
        },
      ],
      goodsColumns: [
        {
          title: "排名",
          key: "standardId",
          align: "center",
          width: "60px",
          render(h, params, vm) {
            const { row } = params;
            return <div>{row._index + 1}</div>;
          },
        },
        {
          title: "规格ID",
          key: "standardId",
          align: "center",
        },
        {
          title: "商品名称",
          key: "productName",
          align: "center",
        },
        {
          title: "规格",
          key: "specification",
          align: "center",
        },
        {
          title: "单位",
          align: "center",
          key: "unitName",
        },
        {
          title: "规格类型",
          key: "productExpandType",
          align: "center",
        },
        {
          title: "价格",
          key: "price",
          align: "center",
        },
        {
          title: "销售份数",
          align: "center",
          key: "saleCount",
        },
        {
          title: "销售金额",
          key: "saleAmount",
          align: "center",
        },
      ],
    };
  },
  computed: {
    banner() {
      // 默认万翼果联品牌
      let str =
        "http://resource.shuiguoshule.com.cn/product_image/2019-07-31/sgv7qBdSKI7ZrH5JU2kB.jpg";
      if (this.brandType === "qgg") {
        str =
          "http://resource.shuiguoshule.com.cn/v2/qgg/activity_image/activity/2020-04-24/e7qhDWpvwOrSGRCJqDHT.jpg";
      } else if (this.brandType === "lv_hang") {
        str =
          "http://resource.shuiguoshule.com.cn/v2/lv_hang/activity_image/activity/2020-04-24/EenfAkUuSzvbxu0Jmz1G.jpg";
      }
      return str;
    },
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.goodsSearchRowData = _.cloneDeep(goodsRoleRowData);
    this.getWaitOrder();
    this.getOrderTotal();
    this.getStoreRanking();
    this.getTableData();
    this.getGoodsTableData();
  },
  methods: {
    //头部数据
    getWaitOrder() {
      const _this = this;
      getWaitOrder()
        .then((res) => {
          const newData = _.cloneDeep(this.inforCardData);
          for (let value of res) {
            for (let val of newData) {
              if (value.typeCode === val.typeCode) {
                val.count = Number(value.typeCount);
                val.queryDay = Number(value.queryDay);
              }
            }
          }
          this.inforCardData = newData;
        })
        .catch((error) => {});
    },
    // 销售数据
    getOrderTotal() {
      const _this = this;
      getOrderTotal()
        .then((res) => {
          this.orderTotalData[0].todayNum = res.nowSumAmount;
          this.orderTotalData[0].yesterdayNum = res.yesSumAmount;
          this.orderTotalData[1].todayNum = res.nowSumTotal;
          this.orderTotalData[1].yesterdayNum = res.yesSumTotal;
          this.orderTotalData[2].todayNum = res.nowReturnAmount;
          this.orderTotalData[2].yesterdayNum = res.yesReturnTotal;
          this.orderTotalData[3].todayNum = res.nowReturnTotal;
          this.orderTotalData[3].yesterdayNum = res.yesSumTotal;
        })
        .catch((error) => {});
    },
    //头部数据
    getStoreRanking(rankingType) {
      const _this = this;
      rankingType = !rankingType ? "COUNT_ORDER_AMOUNT" : rankingType;
      storeRanking(rankingType)
        .then((res) => {
          this.storeRank = res;
        })
        .catch((error) => {});
    },
    getTableData() {
      const _this = this;
      this.searchRowData.rankingType = !this.searchRowData.rankingType
        ? "PRAISE"
        : this.searchRowData.rankingType;
      productRanking(this.searchRowData)
        .then((res) => {
          console.log("返回", res);
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getGoodsTableData() {
      const _this = this;
      productStanardRanking(this.goodsSearchRowData)
        .then((res) => {
          console.log("商品规格", res);
          this.goodsTableData = res.rows;
          this.goodsTotal = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    goodsChangePage(page) {
      console.log("商品规格page", page);
      this.goodsSearchRowData.page = page;
      this.getGoodsTableData();
    },
    goodsChangePageSize(pageSize) {
      this.goodsSearchRowData.page = 1;
      this.goodsSearchRowData.rows = pageSize;
      this.getGoodsTableData();
    },
    //跳转
    handgoIng(i) {
      const orderDel = this.inforCardData;
      console.log("点击的下标", orderDel[i]);
      setSmallGoodsStandard(orderDel[i]);
      this.turnToPage({
        name: "small-skip-order",
        params: {
          typeCode: orderDel[i].typeCode,
          queryDay: orderDel[i].queryDay,
        },
      });
    },
    storeDataChange(e) {
      let index = e.currentTarget.dataset.index;
      if (this.storeStatus === index) {
        return;
      } else {
        this.storeStatus = index;
        this.getStoreRanking(this.storeStatus);
      }
    },
    productDataChange(e) {
      let index = e.currentTarget.dataset.index;
      if (this.seniorityStatus === index) {
        return;
      } else {
        this.seniorityStatus = index;
        this.searchRowData.rankingType = this.seniorityStatus;
        this.getTableData();
      }
    },
    saleDataChange(e) {
      let index = e.currentTarget.dataset.index;
      if (this.saleStatus === index) {
        return;
      } else {
        this.saleStatus = index;
        this.goodsSearchRowData.rankingType = this.saleStatus;
        this.getGoodsTableData();
      }
    },
  },
};
</script>

<style lang="less">
.topBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderDel {
  box-sizing: border-box;
  width: 240px;
  height: 150px;
  border-radius: 5px;
  padding: 20px 20px 0;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.bg_ff3861 {
  background: #ff3861;
}
.bg_169bd5 {
  background: #169bd5;
}
.orderData {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-size: 16px;
  b {
    display: inline-block;
    text-align: center;
    width: 300px;
  }
  span {
    display: inline-block;
    text-align: center;
    width: 300px;
    font-weight: normal;
  }
}
.topStore {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 10px 0;
}
.tabStore {
  width: 180px;
  height: 36px;
  background: #ccc;
  border-radius: 50px;
  line-height: 36px;
  cursor: pointer;
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
.checked {
  background: #169bd5;
  border-radius: 50px;
  color: #fff;
}
.storeRanking {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  b {
    display: inline-block;
    width: 30px;
  }
  div {
    margin-bottom: 30px;
  }
  p {
    margin-bottom: 30px;
    font-weight: bold;
  }
}
.seniority {
  width: 180px;
  height: 36px;
  background: #ccc;
  border-radius: 50px;
  line-height: 36px;
  cursor: pointer;
  margin-left: 20px;
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
</style>