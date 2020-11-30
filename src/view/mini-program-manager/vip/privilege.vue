<template>
  <div class="m-content">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="dataColumns"
        :loading="tempTableLoading"
        :search-area-column="16"
        :operate-area-column="8"
        editable
        searchable
        border
        @on-view="handleView"
        @on-edit="handleEdit"
        @coupon-status="statusChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.svipLevel"
              placeholder="会员身份"
              style="padding-right: 5px;width: 100px"
            >
              <Option
                v-for="(item,index) in vipStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
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
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addHdCouponTemplate"
          >
            <Icon type="md-add" />海鼎优惠券
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />删除
            </Button>
          </Poptip> -->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="searchRowData.rows"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
    <!-- 查看优惠券详情 -->
    <Modal v-model="modalView" :width="800" draggable scrollable :mask-closable="false">
      <p slot="header">
        <span>关联的优惠劵详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券名称:</i-col>
              <i-col span="16">{{ addRelationDetail.couponName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券类型:</i-col>
              <i-col v-if="addRelationDetail.couponType === 'FULL_CUT_COUPON'" span="16">
                <tag color="magenta">{{ "满减券" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'" span="16">
                <tag color="orange">{{ "折扣券" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponType === 'CASH_COUPON'" span="16">
                <tag color="cyan">{{ "现金券" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponType === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">会员身份:</i-col>
              <i-col v-if="addRelationDetail.svipLevel==='SVIP'" span="16">
                <tag color="gold">{{ addRelationDetail.svipLevel | vipStatusFilter }}</tag>
              </i-col>
              <i-col v-else span="16">
                <tag color="silver">{{ addRelationDetail.svipLevel | vipStatusFilter }}</tag>
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">优惠/折扣额度:</i-col>
              <i-col
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                span="16"
              >{{ addRelationDetail.couponFee | fenToDiscountFilters }}</i-col>
              <i-col v-else span="16">{{ addRelationDetail.couponFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">最小购买金额:</i-col>
              <i-col span="16">{{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">优惠券状态:</i-col>
              <i-col v-if="addRelationDetail.couponStatus === 'VALID'" span="16">
                <tag color="success">{{ "有效" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponStatus === 'INVALID'" span="16">
                <tag color="error">{{ "无效" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponStatus === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">已发放:</i-col>
              <i-col span="16">{{ yetgrant }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">已使用:</i-col>
              <i-col span="16">{{ issued }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">券使用范围:</i-col>
              <i-col v-if="addRelationDetail.couponScope === 'STORE'" span="16">
                <tag color="magenta">{{ "门店" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponScope === 'SMALL'" span="16">
                <tag color="cyan">{{ "商城" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponScope === 'STORE_AND_SMALL'" span="16">
                <tag color="orange">{{ "全场通用" }}</tag>
              </i-col>
              <i-col v-else-if="addRelationDetail.couponScope === null" span="16">{{ "N/A" }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">券使用限制:</i-col>
              <i-col span="16">{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row>
              <i-col span="8">使用规则:</i-col>
              <i-col span="16">{{ addRelationDetail.couponRules }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <!-- 添加优惠券 -->
    <Modal
      v-model="modalAdd"
      :width="1000"
      draggable
      scrollable
      @on-visible-change="handleModalAdd"
    >
      <p slot="header">
        <i-col>{{ tempModalType == 'addTemplate'?'添加系统优惠券':'添加海鼎优惠券' }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            v-if="tempModalType == 'addTemplate'"
            ref="tables"
            v-model="couponTemplateData"
            :columns="templateColumns"
            :loading="tempTableLoading"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleTemplateChange"
          ></tables>
          <tables
            v-if="tempModalType=='addHdTemplate'"
            ref="tables"
            v-model="hdCouponTemplateData"
            :columns="hdTemplateColumns"
            :loading="tempTableLoading"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleHdTemplateChange"
          ></tables>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <Row v-if="tempModalType == 'addTemplate'" type="flex" justify="end">
              <Page
                :total="couponTemplateTotal"
                :current="searchTemplateRowData.page"
                :page-size="searchTemplateRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changeProductPage"
                @on-page-size-change="changeProductPageSize"
              ></Page>
            </Row>
            <Row v-else type="flex" justify="end">
              <Page
                :total="couponHdTemplateTotal"
                :current="searchHdTemplateRowData.page"
                :page-size="searchHdTemplateRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changeHdPage"
                @on-page-size-change="changeHdPageSize"
              ></Page>
            </Row>
          </div>
          <Divider>关联优惠券后配置</Divider>
          <Form
            ref="addForm"
            :model="addRelationDetail"
            :rules="relationRuleInline"
            :label-width="80"
          >
            <!-- 会员身份 -->
            <Row>
              <i-col span="6">
                <FormItem label="会员身份:" prop="svipLevel">
                  <Select
                    v-model="addRelationDetail.svipLevel"
                    placeholder="会员身份"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in vipStatusEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <!-- <i-col span="6" v-if="tempModalType == 'addHdTemplate'">
                <FormItem label="券状态:" prop="couponStatus">
                  <Select
                    v-model="addRelationDetail.couponStatus"
                    placeholder="请选择"
                    disabled="disabled"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in couponStatusEnum"
                      :value="item.value"
                      :key="index"
                      class="ptb2-5"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>-->
              <i-col span="6">
                <FormItem label="礼包类型:" prop="giftType">
                  <Select
                    v-model="addRelationDetail.giftType"
                    placeholder="礼包类型"
                    disabled="disabled"
                    style="padding-right: 5px;width: 120px"
                  >
                    <Option
                      v-for="(item,index) in giftTypeEnum"
                      :key="index"
                      :value="item.value"
                      class="ptb2-5"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem
                  label="券使用范围:"
                  prop="couponScope"
                  :label-width="92"
                >{{ addRelationDetail.couponScope | couponScopeFilter }}</FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="使用规则:" prop="couponRules">
                  <Input
                    v-model="addRelationDetail.couponRules"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 8}"
                    placeholder="请输入优惠券的使用规则"
                  ></Input>
                </FormItem>
              </i-col>
            </Row>
          </Form>*Tips：请先选择要关联的优惠券，然后输入关联配置信息，可添加后修改
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateAdd">确定</Button>
      </div>
    </Modal>
    <!-- 修改优惠券 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="1000" draggable>
      <p slot="header">
        <i-col>修改优惠券配置</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="addRelationDetail"
          :rules="relationRuleInline"
          :label-width="80"
        >
          <Row>
            <i-col span="6">
              <FormItem
                label="优惠券类型:"
                prop="couponType"
              >{{ addRelationDetail.couponType | couponTypeFilter }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                v-if="addRelationDetail.couponType === 'DISCOUNT_COUPON'"
                label="折扣额度:"
                prop="couponFee"
              >{{ addRelationDetail.couponFee | fenToDiscountFilters }}</FormItem>
              <FormItem
                v-else
                label="优惠金额:"
                prop="couponFee"
              >{{ addRelationDetail.couponFee | fenToYuanDot2Filters }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="最小购买金额:"
                prop="minBuyFee"
                :label-width="100"
              >{{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="券使用范围:"
                prop="couponScope"
                :label-width="100"
              >{{ addRelationDetail.couponScope | couponScopeFilter }}</FormItem>
            </i-col>
            <i-col span="6">
              <FormItem
                label="券使用限制:"
                prop="useLimitType"
              >{{ addRelationDetail.useLimitType | couponUseLimitFilter }}</FormItem>
            </i-col>
          </Row>
          <Divider>可修改部分</Divider>
          <Row>
            <i-col span="6">
              <FormItem label="优惠券名称:" prop="couponName" :label-width="100">
                <Input v-model="addRelationDetail.couponName" clearable></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="　会员身份:" prop="svipLevel" :label-width="100">
                <Select
                  v-model="addRelationDetail.svipLevel"
                  placeholder="会员身份"
                  style="padding-right: 5px;width: 146px"
                >
                  <Option
                    v-for="(item,index) in vipStatusEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="6">
              <FormItem label="优惠券状态:" prop="couponStatus" :label-width="100">
                <Select
                  v-model="addRelationDetail.couponStatus"
                  placeholder="请选择"
                  style="padding-right: 5px;width: 146px"
                >
                  <Option
                    v-for="(item,index) in couponStatusEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="券使用规则:" prop="couponRules" :label-width="100">
                <Input
                  v-model="addRelationDetail.couponRules"
                  type="textarea"
                  :autosize="{minRows: 3,maxRows: 8}"
                  placeholder="请输入优惠券的使用规则，使用&符号换行"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleTemplateEdit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  getSvipGift,
  getSvipGiftPages,
  deleteSvipGift,
  createSvipGift,
  editSvipGift,
  getHdCouponActivitiesPages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert,
  vipTypeConvert,
  giftTypeConvert
} from '@/libs/converStatus';
import {
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  couponStatusEnum,
  vipStatusEnum,
  giftTypeEnum
} from '@/libs/enumerate';
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab,
  HdDiscount
} from '@/libs/util';

const relationDetail = {
  id: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: 'VALID',
  svipLevel: null,
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 999,
  receiveCount: '0',
  couponRules: '',
  couponScope: null,
  useLimitType: null,
  hdActivityId: 0,
  validDateType: 'FIXED_DATE',
  receiveLimit: 999,
  beginDay: 0,
  endDay: 0,
  rank: 0, // 排序字段
  points: 0,
  realPoints: 0,
  giftType: 'BIRTHDAY_COUPON'
};

const couponTemplateDetail = {
  id: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  createUser: '',
  createTime: null,
  couponRules: '',
  couponScope: null,
  svipLevel: null
};

const hdCouponTemplateDetail = {
  activityId: 0,
  beginDate: null,
  endDate: null,
  couponName: '',
  couponRemark: '',
  couponType: '',
  faceValue: 0,
  price: 0,
  useRule: ''
};

const roleRowData = {
  page: 1,
  rows: 10,
  svipLevel: null,
  giftType: 'BIRTHDAY_COUPON'
};

const templateRowData = {
  couponName: null,
  couponType: null,
  couponStatus: 'VALID',
  page: 1,
  rows: 5,
  svipLevel: 'SVIP'
};
// all表示查全部，manual（手工发券），behavior（行为发券），scmaction（分销领券），
// trans（交易发券），applet（小程序发券），mbrgrade（会员等级发券），
// recharge（充值发券），component（第三方发券），precision（精准发券）
const hdTemplateRowData = {
  storeId: null,
  sortKey: null,
  desc: null,
  platformId: null,
  activityTypes: ['component'],
  activityId: null,
  page: 1,
  rows: 5
};

const dataColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    width: 140,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '优惠券类型',
    key: 'couponType',
    align: 'center',
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
      }
      return <div>{row.couponType}</div>;
    },
    width: 100
  },
  {
    title: '会员身份',
    align: 'center',
    key: 'svipLevel',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.svipLevel === 'SVIP') {
        return (
          <div>
            <tag color='gold'>{vipTypeConvert(row.svipLevel).label}</tag>
          </div>
        );
      } else if (row.svipLevel === 'TRY_SVIP') {
        return (
          <div>
            <tag color='silver'>{vipTypeConvert(row.svipLevel).label}</tag>
          </div>
        );
      }
      return <div>{row.svipLevel}</div>;
    },
    width: 100
  },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    width: 120,
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
    width: 110,
    render(h, params) {
      return h('div', fenToYuanDot2(params.row.minBuyFee));
    }
  },
  {
    title: '优惠券状态',
    align: 'center',
    key: 'couponStatus',
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    }
  },
  {
    title: '券使用范围',
    align: 'center',
    key: 'couponScope',
    width: 100,
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
    title: '券使用限制(门店/商品)',
    align: 'center',
    key: 'useLimitType',
    width: 180,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.useLimitType === 'HD_ALL') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_GOODS') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'PART_STORES') {
        return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
      } else if (row.useLimitType === 'SMALL_ALL') {
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
    width: 80,
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
    align: 'center',
    key: 'effectiveStartTime',
    width: 160,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
        return <div>{row.effectiveStartTime}</div>;
      } else if (
        row.source == 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.beginDay}</div>;
      } else if (row.source == 'HD') {
        return <div>{row.effectiveStartTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '失效时间',
    key: 'effectiveEndTime',
    align: 'center',
    width: 160,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
        return <div>{row.effectiveEndTime}</div>;
      } else if (
        row.source == 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.endDay}</div>;
      } else if (row.source == 'HD') {
        return <div>{row.effectiveEndTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '创建时间',
    align: 'center',
    key: 'createTime',
    width: 160
  },
  {
    title: '操作',
    width: 200,
    align: 'center',
    key: 'handle',
    options: ['couponStatus', 'view', 'edit']
  }
];

const templateColumns = [];

const hdTemplateColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 80
  },
  {
    title: '优惠券类型',
    align: 'center',
    key: 'couponType',
    minWidth: 80,
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
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: '券使用限制',
    align: 'center',
    key: 'useLimitType',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{couponUseLimitConvert(row.useLimitType).label}</div>;
    }
  },
  // {
  //   title: "优惠/折扣额度",
  //   key: "faceValue",
  //   minWidth: 80,
  //   render(h, params) {
  //     const { row } = params;
  //     const disIndex = row.couponName.indexOf("折");
  //     if (row.couponType === "DISCOUNT_COUPON") {
  //       const couponFee =
  //         parseFloat(row.couponName.substring(0, disIndex)) + "折";
  //       return <div>{couponFee}</div>;
  //     } else {
  //       return <div>{fenToYuanDot2(params.row.faceValue)}</div>;
  //     }
  //   }
  // },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'faceValue',
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        const couponFee = HdDiscount(params.row.discount);
        return <div>{couponFee}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.faceValue)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    align: 'center',
    key: 'useRule',
    minWidth: 80,
    render(h, params, vm) {
      const useRule = params.row.useRule;
      const startIndex = useRule.indexOf('满');
      const endIndex = useRule.indexOf('元');
      const minBuyFee = useRule.slice(startIndex + 1, endIndex);
      return <div>{fenToYuanDot2(minBuyFee * 100)}</div>;
    }
  },
  {
    title: '生效时间',
    align: 'center',
    key: 'beginDate',
    minWidth: 50
  },
  {
    title: '失效时间',
    align: 'center',
    key: 'endDate',
    minWidth: 50
  }
  // {
  //   title: '用券条件',
  //   key: 'useRule',
  //   minWidth: 80
  // },
  // {
  //   title: '券说明',
  //   key: 'couponRemark',
  //   minWidth: 80
  // },
  // {
  //   title: '活动起始时间',
  //   key: 'beginDate',
  //   minWidth: 120
  // },
  // {
  //   title: '活动结束时间',
  //   key: 'endDate',
  //   minWidth: 120
  // }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      relationRuleInline: {
        effectiveStartTime: [{ required: true, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: true, message: '请选择失效时间' }],
        beginDay: [{ required: true, message: '请输入生效天数' }],
        endDay: [
          { required: true, message: '请输入失效天数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        couponScope: [{ required: true, message: '请选择券使用范围' }],
        couponDetail: [{ required: true, message: '请输入券详情' }],
        svipLevel: [{ required: true, message: '请选择会员身份' }],
        couponStatus: [{ required: true, message: '请选择优惠券状态' }],
        couponName: [
          { required: true, message: '请输入优惠券名称' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 20) {
                errors.push(new Error('字数限制20字'));
              }
              callback(errors);
            }
          }
        ],
        giftType: [{ required: true, message: '' }],
        couponRules: [
          { required: false, message: '请输入券使用规则' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (value.length > 200) {
                errors.push(new Error('字数限制200字'));
              }
              callback(errors);
            }
          }
        ],
        points: [
          { required: true, message: '请输入兑换积分' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        realPoints: [
          { required: true, message: '请输入促销积分' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        receiveLimit: [
          { required: true, message: '请输入每人限兑数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        couponLimit: [
          { required: true, message: '请输入发券限制数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      vipStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      giftTypeEnum,
      couponStatusEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      dataColumns: dataColumns,
      templatePageOpts: [5, 10],
      templateColumns: templateColumns,
      hdTemplateColumns: hdTemplateColumns,
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      addRelationList: [],
      couponTemplateData: [],
      hdCouponTemplateData: [],
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      modalAdd: false,
      yetgrant: '',
      issued: ''
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.minBuyFee);
    },
    systemCouponFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType == 'FIXED_DATE'
      );
    },
    systemCouponUnFixDate() {
      return (
        this.tempModalType === 'addTemplate' &&
        this.addRelationDetail.validDateType == 'UN_FIXED_DATE'
      );
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData); // 刷新清除上次搜索结果
    this.getTableData();
  },
  methods: {
    statusChange(params) {
      this.addRelationDetail = _.cloneDeep(params.row);
      if (params.row.couponStatus === 'VALID') {
        this.addRelationDetail.couponStatus = 'INVALID';
      } else {
        this.addRelationDetail.couponStatus = 'VALID';
      }
      this.editSvipGift();
    },
    handleModalAdd(isShow) {
      // 先清除对象
      this.resetFields();
      // 当展示的是添加系统优惠券
      if (isShow && this.tempModalType == 'addHdTemplate') {
        this.addRelationDetail.couponScope = 'HD';
        this.addRelationDetail.couponScope = 'STORE_AND_SMALL';
      }
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.addForm.resetFields();
      this.addRelationDetail = _.cloneDeep(relationDetail);
      // this.$refs.uploadMain.clearFileList();
      // this.uploadListMain = [];
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalEdit = true;
    },
    getTableData() {
      getSvipGiftPages(this.searchRowData)
        .then(res => {
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
    },
    getTemplateTableData() {
      getCouponTemplatePages(this.searchTemplateRowData)
        .then(res => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
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
    },
    changeHdPage(page) {
      this.searchHdTemplateRowData.page = page;
      this.getHdTemplateTableData();
    },
    changeHdPageSize(pageSize) {
      this.searchHdTemplateRowData.page = 1;
      this.searchHdTemplateRowData.rows = pageSize;
      this.getHdTemplateTableData();
    },
    changeProductPage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplateTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplateTableData();
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getTemplateTableData();
    },
    handleTemplateClear() {
      this.clearSearchLoading = true;
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.handleTemplateSearch();
    },
    editSvipGift() {
      // 编辑状态
      this.tempTableLoading = true;
      editSvipGift(this.addRelationDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    },
    getSvipGift() {
      getSvipGift(this.addRelationDetail)
        .then(res => {
          const couponDetail = res;
          this.yetgrant = couponDetail.couponStatusTotal.TOTAL;
          this.issued = couponDetail.couponStatusTotal.USED;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    replaceTextByTab() {
      // 编辑时处理下活动规则转换
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTab(
          this.addRelationDetail.couponRules
        );
      }

      if (this.addRelationDetail.couponDetail) {
        this.addRelationDetail.couponDetail = replaceByTab(
          this.addRelationDetail.couponDetail
        );
      }

      if (this.addRelationDetail.couponReminderMsg) {
        this.addRelationDetail.couponReminderMsg = replaceByTab(
          this.addRelationDetail.couponReminderMsg
        );
      }
    },
    replaceTextByTag() {
      // 活动规则换行用“&”拼接
      if (this.addRelationDetail.couponRules) {
        this.addRelationDetail.couponRules = replaceByTag(
          this.addRelationDetail.couponRules
        );
      }
      if (this.addRelationDetail.couponReminderMsg) {
        this.addRelationDetail.couponReminderMsg = replaceByTag(
          this.addRelationDetail.couponReminderMsg
        );
      }
      if (this.addRelationDetail.couponDetail) {
        this.addRelationDetail.couponDetail = replaceByTag(
          this.addRelationDetail.couponDetail
        );
      }
    },
    extraValidator() {
      if (
        this.systemCouponFixDate &&
        compareData(
          this.addRelationDetail.effectiveStartTime,
          this.addRelationDetail.effectiveEndTime
        )
      ) {
        this.$Message.error('优惠券失效时间必须大于生效时间!');
        return false;
      }
    },
    handleTemplateEdit() {
      const _this = this;
      if (this.addRelationDetail.couponName == '') {
        this.$Message.error('请先关联一张优惠券模板!');
        return false;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (this.tempModalType === this.modalType.edit) {
            _this.editSvipGift();
          }
        } else {
          _this.$Message.error('请完善信息!');
        }
      });
    },
    handleTemplateAdd() {
      const _this = this;
      if (this.addRelationDetail.couponName == '') {
        this.$Message.error('请先关联一张优惠券模板!');
        return false;
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          _this.extraValidator();
          _this.replaceTextByTag();
          if (_this.tempModalType === 'addTemplate') {
            _this.createRelation();
          } else if (_this.tempModalType === 'addHdTemplate') {
            _this.createHdRelation();
          }
        } else {
          _this.$Message.error('请完善信息!');
        }
      });
    },
    handleHdTemplateChange(currentRow, oldCurrentRow) {
      const startIndex = currentRow.useRule.indexOf('满');
      const endIndex = currentRow.useRule.indexOf('元');
      const minBuyFee = currentRow.useRule.slice(startIndex + 1, endIndex);
      this.addRelationDetail.useLimitType = currentRow.useLimitType; // 海鼎券的uselimitType从couponRemark解析出
      this.addRelationDetail.couponName = currentRow.couponName;
      this.addRelationDetail.couponType = currentRow.couponType;
      this.addRelationDetail.couponFee = currentRow.faceValue;
      // const disIndex = currentRow.couponName.indexOf("折");
      // if (currentRow.couponType === "DISCOUNT_COUPON") {
      //   this.addRelationDetail.couponFee =
      //     parseFloat(currentRow.couponName.substring(0, disIndex)) * 10;
      //   console.log(
      //     "DISCOUNT_COUPON couponFee:",
      //     this.addRelationDetail.couponFee
      //   );
      // }
      if (currentRow.couponType === 'DISCOUNT_COUPON') {
        this.addRelationDetail.couponFee =
          parseFloat(currentRow.discount) * 100;
        console.log(
          'DISCOUNT_COUPON couponFee:',
          this.addRelationDetail.couponFee
        );
      }
      this.addRelationDetail.hdActivityId = currentRow.activityId;
      this.addRelationDetail.minBuyFee = minBuyFee * 100;
      this.addRelationDetail.effectiveStartTime = currentRow.beginDate; // 海鼎活动开始时间
      this.addRelationDetail.effectiveEndTime = currentRow.endDate; // 海鼎活动结束时间
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    createRelation() {
      this.modalViewLoading = true;
      // 添加的是系统券，填写来源为系统优惠券
      this.addRelationDetail.source = 'SMALL';
      console.log('before create:', this.addRelationDetail);
      createSvipGift(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      // 添加的是海鼎券，填写来源为海鼎
      this.addRelationDetail.source = 'HD';
      createSvipGift(this.addRelationDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalAdd = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
        });
    },
    getHdTemplateTableData() {
      getHdCouponActivitiesPages(this.searchHdTemplateRowData)
        .then(res => {
          this.hdCouponTemplateData = res.rows;
          this.couponHdTemplateTotal = res.total;
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
    },
    addHdCouponTemplate() {
      this.getHdTemplateTableData();
      this.tempModalType = 'addHdTemplate';
      this.modalAdd = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.replaceTextByTab();
      this.modalView = true;
      this.getSvipGift();
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    minBuyFeeInputNumberOnchange(value) {
      this.relationDetail.minBuyFee = yuanToFenNumber(value);
    },
    // 批量删除-单行删除内部也是调用此方法
    deleteTable(ids) {
      this.tempTableLoading = true;
      deleteSvipGift({ ids })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .finally(res => {
          this.tempTableLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
