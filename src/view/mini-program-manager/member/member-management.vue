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
        @on-upgrade="handleUpgrade"
        @on-coupons="handleCoupons"
        @on-staff="handleStaff"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.phone"
              placeholder="手机号码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.gender"
              placeholder="性别"
              style="padding-right: 5px; width: 100px"
              clearable
            >
              <Option
                v-for="(item, index) in genderEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.isCommunity"
              placeholder="是否社群用户"
              style="padding-right: 5px; width: 130px"
              clearable
            >
              <Option
                v-for="(item, index) in communityEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.userClass"
              placeholder="是否白名单用户"
              style="padding-right: 5px; width: 130px"
              clearable
            >
              <Option
                v-for="(item, index) in userClassEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.userType"
              placeholder="用户类型"
              style="padding-right: 5px; width: 100px"
              clearable
            >
              <Option
                v-for="(item, index) in userEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
            <DatePicker
              v-model="searchRowData.regBeginTime"
              format="yyyy-MM-dd"
              type="date"
              placeholder="自定义开始时间"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.regEndTime"
              format="yyyy-MM-dd"
              type="date"
              placeholder="自定义结束时间"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Button
              v-waves
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
          </Row>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
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

    <!-- 查询某用户优惠券列表-->
    <Modal
      v-model="modalCoupon"
      :mask-closable="false"
      :width="1500"
      :z-index="1000"
      footer-hide
    >
      <p slot="header">
        <span>{{ userDetail.nickName }}-优惠券列表</span>
      </p>
      <div class="modal-content">
        <tables
          ref="tables"
          v-model="couponTableData"
          :columns="dataColumns"
          :loading="couponLoading"
          :search-area-column="22"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
        >
          <div slot="searchCondition">
            <Row>
              <Select
                v-model="searchCouponRowData.validStatus"
                placeholder="券状态"
                style="padding-right: 5px; width: 100px"
                clearable
              >
                <Option
                  v-for="(item, index) in couponValidEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}</Option>
              </Select>
              <Button
                v-waves
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleCouponSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn mr5"
                type="info"
                @click="handleCouponClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
            </Row>
          </div>
        </tables>
        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="couponTotal"
              :current="searchCouponRowData.page"
              :page-size="searchCouponRowData.rows"
              show-sizer
              show-total
              @on-change="changeCouponPage"
              @on-page-size-change="changeCouponPageSize"
            ></Page>
          </Row>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getUsersInfo, getUserCoupons, setUserClass, setStaff } from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  userClassEnum,
  userScopeEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert,
  expandTypeConvert
} from '@/libs/converStatus';
import {
  setSmallGoodsStandard,
  fenToYuanDot2,
  fenToYuanDot2Number,
  compareCouponData
} from '@/libs/util';

const userDetail = {
  id: 0,
  nickName: '',
  phone: '',
  gender: '',
  consumeSumAmount: '',
  rechargeSumAmount: '',
  isCommunity: '',
  userType: '',
  registrationAt: '',
  userClass: 'EXTERIOR'
};

const coupoonDetail = {
  barcodes: '',
  beginDay: 0,
  commissionScale: 0,
  couponCode: '',
  couponEntityStatus: '', // UNUSED-未使用 USED-已使用 EXPIRED-已过期
  couponFee: 0,
  couponImage: '',
  couponName: '',
  couponRules: '',
  couponScope: '',
  couponType: '',
  effectiveEndTime: '',
  effectiveStartTime: '',
  endDay: 0,
  hdActivityId: '',
  id: 0,
  isSend: '',
  issuedNum: 0,
  maxDiscountFee: 0,
  minBuyFee: 0,
  paymentLogId: 0,
  preferentialPrice: 0,
  receiveTime: '',
  receiveTimeBegin: '',
  receiveTimeEnd: '',
  source: '',
  standardIds: '',
  stores: '',
  templateRelationId: 0,
  useLimitType: '',
  useTime: '',
  userId: 0,
  valid: false,
  validDateType: ''
}

const couponRowData = {
  userId: 0,
  validStatus: 'VALID', // VALID-有效,UNVALID-无效
  page: 1,
  rows: 10
}

const roleRowData = {
  isCommunity: null,
  userType: null,
  userClass: null,
  gender: null,
  nickName: null,
  phone: null,
  regBeginTime: null,
  regEndTime: null,
  page: 1,
  rows: 10
};

const dataColumns = [
  {
    title: '优惠券名称',
    align: 'center',
    key: 'couponName',
    minWidth: 150
  },
  {
    title: '券类型',
    align: 'center',
    key: 'couponType',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'FREIGHT_COUPON') {
        return (
          <div>
            <tag color='blue'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
    minWidth: 100
  },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    minWidth: 140,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'minBuyFee',
    minWidth: 130,
    render(h, params) {
      return h('div', fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    minWidth: 130,
    render(h, params) {
      const { row } = params;
      if (row.maxDiscountFee != null) {
        return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '佣金比例',
    align: 'center',
    key: 'commissionScale',
    minWidth: 100,
    render(h, params) {
      const { row } = params;
      if (row.commissionScale != null) {
        return <div>{row.commissionScale + '%'}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '使用状态',
    align: 'center',
    key: 'couponEntityStatus',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponEntityStatus === 'UNUSED') {
        return (
          <div>
            <tag color='primary'>
              未使用
            </tag>
          </div>
        );
      } else if (row.couponEntityStatus === 'USED') {
        return (
          <div>
            <tag color='success'>
              已使用
            </tag>
          </div>
        );
      } else if (row.couponEntityStatus === 'EXPIRED') {
        return (
          <div>
            <tag color='error'>
              已过期
            </tag>
          </div>
        );
      } else {
        <div>{row.couponEntityStatus ? row.couponEntityStatus : 'N/A'}</div>
      }
    }
  },
  {
    title: '使用范围',
    align: 'center',
    key: 'couponScope',
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponScope === 'STORE') {
        return (
          <div>
            <tag color='magenta'>
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === 'STORE_AND_SMALL') {
        return (
          <div>
            <tag color='orange'>
              {couponScopeConvert(row.couponScope).label}
            </tag>
          </div>
        );
      } else if (row.couponScope === 'SMALL') {
        return (
          <div>
            <tag color='cyan'>{couponScopeConvert(row.couponScope).label}</tag>
          </div>
        );
      }
      return <div>{row.couponScope}</div>;
    }
  },
  {
    title: '使用限制',
    align: 'center',
    key: 'useLimitType',
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.useLimitType === 'SMALL_ALL') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_GOODS') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_STORES') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'HD_ALL') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '来源',
    key: 'source',
    align: 'center',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === 'SMALL') {
        return <div>小程序</div>;
      } else if (row.source === 'HD') {
        return <div>海鼎</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '生效时间',
    key: 'effectiveStartTime',
    align: 'center',
    minWidth: 110
    // render: (h, params, vm) => {
    //   const { row } = params;
    //   if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
    //     return <div>{row.effectiveStartTime}</div>;
    //   } else if (
    //     row.source === 'SMALL' &&
    //     row.validDateType === 'UN_FIXED_DATE'
    //   ) {
    //     return <div>{row.beginDay}</div>;
    //   } else if (row.source === 'HD') {
    //     return <div>{row.beginDay}</div>;
    //   } else {
    //     return <div>N/A</div>;
    //   }
    // }
  },
  {
    title: '失效时间',
    key: 'effectiveEndTime',
    align: 'center',
    minWidth: 110
    // render: (h, params, vm) => {
    //   const { row } = params;
    //   if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
    //     if (!compareCouponData(row.effectiveEndTime)) {
    //       return (
    //         <div style='color:red'>
    //           <p>{row.effectiveEndTime + '　已过期'}</p>
    //         </div>
    //       );
    //     } else {
    //       return <div>{row.effectiveEndTime}</div>;
    //     }
    //   } else if (
    //     row.source === 'SMALL' &&
    //     row.validDateType === 'UN_FIXED_DATE'
    //   ) {
    //     return <div>{row.endDay}</div>;
    //   } else if (row.source === 'HD') {
    //     return <div>{row.endDay}</div>;
    //     // if (!compareCouponData(row.effectiveEndTime)) {
    //     //   return <div style="color:red">{row.effectiveEndTime + "已过期"}</div>;
    //     // } else {
    //     //   return <div>{row.effectiveEndTime}</div>;
    //     // }
    //   } else {
    //     return <div>N/A</div>;
    //   }
    // }
  }
];

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      modalCoupon: false,
      couponLoading: false,
      couponTotal: 0,
      couponTableData: [],
      columns: [
        {
          title: '会员ID',
          key: 'id',
          align: 'center',
          width: '90px'
        },
        {
          title: '昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
          width: '140px'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          width: '80px',
          render(h, params) {
            const { row } = params;
            if (row.gender === '1') {
              return <div>{'男'}</div>;
            } else if (row.gender === '2') {
              return <div>{'女'}</div>;
            } else {
              return <div>{'未知'}</div>;
            }
          }
        },
        {
          title: '消费总额',
          align: 'center',
          key: 'consumeSumAmount'
        },
        {
          title: '充值总额',
          key: 'rechargeSumAmount',
          align: 'center'
        },
        {
          title: '社群成员',
          key: 'isCommunity',
          align: 'center',
          width: '100px',
          render(h, params) {
            const { row } = params;
            if (row.isCommunity === 'YES') {
              return (
                <div>
                  <tag color='orange'>{'是'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'否'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '用户类型',
          key: 'userType',
          align: 'center',
          width: '120px',
          render(h, params) {
            const { row } = params;
            if (row.userType === 'CONSUMER') {
              return (
                <div>
                  <tag color='blue'>{'普通用户'}</tag>
                </div>
              );
            } else if (row.userType === 'STAFF') {
              return (
                <div>
                  <tag color='gold'>{'员工特权'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'N/A'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '白名单',
          key: 'userClass',
          align: 'center',
          width: '120px',
          render(h, params) {
            const { row } = params;
            if (row.userClass === 'EXTERIOR') {
              return (
                <div>
                  <tag color='blue'>{'外部用户'}</tag>
                </div>
              );
            } else if (row.userClass === 'INTERIOR') {
              return (
                <div>
                  <tag color='gold'>{'内部用户'}</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='blue'>{'N/A'}</tag>
                </div>
              );
            }
          }
        },
        {
          title: '注册时间',
          key: 'registrationAt',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          key: 'handle',
          options: ['upgrade', 'staff', 'searchCoupons']
        }
      ],
      dataColumns,
      userClassEnum,
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      userScopeEnum,
      relationStoreTypeEnum,
      couponValidEnum: [
        { label: '有效', value: 'VALID' },
        { label: '失效', value: 'UNVALID' }
      ],
      genderEnum: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '0' }
      ],
      communityEnum: [
        { label: '是', value: 'YES' },
        { label: '否', value: 'NO' }
      ],
      userEnum: [
        { label: '普通用户', value: 'CONSUMER' },
        { label: '员工特权', value: 'STAFF' }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchCouponRowData: _.cloneDeep(couponRowData),
      userDetail: _.cloneDeep(userDetail),
      coupoonDetail: _.cloneDeep(coupoonDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    getCouponData() {
      if (!this.userDetail.id) {
        this.$Message.error(`请先选择一个用户再查看`);
        return;
      }
      this.couponLoading = true;
      this.searchCouponRowData.userId = this.userDetail.id;
      getUserCoupons(this.searchCouponRowData)
        .then((res) => {
          this.couponTableData = res.rows;
          this.couponTotal = res.total;
        })
        .finally(() => {
          this.couponLoading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getTableData() {
      this.loading = true;
      getUsersInfo(this.searchRowData)
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
    startTimeChange(value, date) {
      this.searchRowData.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.regEndTime = value;
    },
    changeCouponPage(page) {
      this.searchCouponRowData.page = page;
      this.getCouponData();
    },
    changeCouponPageSize(pageSize) {
      this.searchCouponRowData.page = 1;
      this.searchCouponRowData.rows = pageSize;
      this.getCouponData();
    },
    handleCouponSearch() {
      this.searchCouponRowData.page = 1;
      this.searchLoading = true;
      this.getCouponData();
    },
    handleCouponClear() {
      // 清除搜索条件恢复至查询该用户的有效券
      this.searchCouponRowData.validStatus = 'VALID';
      this.clearSearchLoading = true;
      this.handleCouponSearch();
    },
    handleCoupons(params) {
      const { row } = params;
      // 清除掉之前选择搜索条件
      this.searchCouponRowData = _.cloneDeep(couponRowData);
      this.userDetail = _.cloneDeep(row);
      // 获取用户当前的券列表
      this.getCouponData();
      this.modalCoupon = true;
    },
    handleUpgrade(params) {
      this.userDetail = _.cloneDeep(params.row);
      this.userDetail.userClass =
        params.row.userClass === 'EXTERIOR' || params.row.userClass == null
          ? 'INTERIOR'
          : 'EXTERIOR';
      setUserClass(this.userDetail)
        .then((res) => {
          this.$Message.info('操作成功');
          this.getTableData();
        })
    },
    handleStaff(params) {
      const rows = params.row;
      const _this = this;
      rows.topStatus = 'manage';
      this.userDetail = _.cloneDeep(params.row);
      this.userDetail.userType = params.row.userType === 'CONSUMER' ? 'STAFF' : 'CONSUMER';
      setStaff(this.userDetail)
        .then((res) => {
          this.$Message.info('操作成功');
          this.getTableData();
          if (this.userDetail.userType === 'STAFF') {
            setTimeout(function() {
              setSmallGoodsStandard(rows);
              _this.turnToPage({
                name: 'small-member-relation-handCheck'
              });
            }, 2000);
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
