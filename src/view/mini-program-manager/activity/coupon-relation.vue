<template>
  <div class="m-role">
    <Card>
      <tables
        :columns="columns"
        v-model="relationDetail"
        :loading="tempTableLoading"
        :search-area-column="16"
        :operate-area-column="8"
        editable
        searchable
        border
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Select v-model="searchRowData.ifEffective" placeholder="活动状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.formBeginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="beginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.formEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input  mr5"
              style="width: 150px"
              @on-change="endTimeChange"/>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves v-show="showBack" class="search-btn ml5 mr5" type="primary" @click="goBack">
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addCouponTemplate">
            <Icon type="md-add"/>
            系统优惠券
          </Button>
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addHdCouponTemplate">
            <Icon type="md-add"/>
            海鼎优惠券
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>
              删除
            </Button>
          </Poptip>
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalAdd"
      :width="1000"
      style="z-index: 1000"
    >
      <p slot="header">
        <i-col>{{ tempModalType == 'addTemplate'?'添加系统优惠券':'添加海鼎优惠券' }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            v-if="tempModalType == 'addTemplate'"
            ref="tables"
            v-model="couponTemplateDetail"
            :columns="templateColumns"
            :loading="tempTableLoading"
            border
            searchable
            search-place="top"
            @on-select-all="onTemplateSelectionAll"
            @on-selection-change="onTemplateSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input v-model="searchTemplateRowData.couponName" placeholder="优惠券名称" class="search-input mr5" style="width: auto" clearable></Input>
                <Select v-model="searchTemplateRowData.couponType" placeholder="优惠券类型" style="padding-right: 5px;width: 100px" clearable>
                  <Option
                    v-for="(item,index) in couponTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px">{{ item.label }}
                  </Option>
                </Select>
                <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleTemplateSearch">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
                <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleTemplateClear">
                  <Icon type="md-refresh"/>&nbsp;清除条件
                </Button>
              </Row>
            </div>
          </tables>

          <tables
            v-if="tempModalType=='addHdTemplate'"
            ref="tables"
            v-model="hdCouponTemplateDetail"
            :columns="hdTemplateColumns"
            :loading="tempTableLoading"
            border
            searchable
            search-place="top"
            @on-select-all="onHdTemplateSelectionAll"
            @on-selection-change="onHdTemplateSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input v-model="searchTemplateRowData.couponName" placeholder="优惠券名称" class="search-input mr5" style="width: auto" clearable></Input>
                <Select v-model="searchTemplateRowData.couponType" placeholder="优惠券类型" style="padding-right: 5px;width: 100px" clearable>
                  <Option
                    v-for="(item,index) in couponTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100px">{{ item.label }}
                  </Option>
                </Select>
                <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleTemplateSearch">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
                <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleTemplateClear">
                  <Icon type="md-refresh"/>&nbsp;清除条件
                </Button>
              </Row>
            </div>
          </tables>

          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="couponTemplateTotal"
                :current="searchTemplateRowData.page"
                show-sizer
                show-total
                @on-change="changeProductPage"
                @on-page-size-change="changeProductPageSize"></Page>
            </Row>
          </div>

          <Form ref="modalAdd" :model="addRelationDetail" :rules="relationRuleInline" :label-width="80">
            <Row>
              <Col span="7">
              <FormItem label="生效时间:" prop="effectiveStartTime">
                <DatePicker
                  :value="addRelationDetail.effectiveStartTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="生效时间"
                  style="width: 160px"
                  @on-change="effectiveStartTimeChange"/>
              </FormItem>
                  </Col>
              <Col span="7">
              <FormItem label="失效时间:" prop="effectiveEndTime">
                <DatePicker
                  :value="addRelationDetail.effectiveEndTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  @on-change="effectiveEndTimeChange"/>
              </FormItem>
                   </Col>
              <Col span="5">
              <FormItem label="发券总数:" prop="couponLimit">
                <InputNumber :min="0" v-model="addRelationDetail.couponLimit" class="ml20" label="限购数量"></InputNumber>
              </FormItem>
                   </Col>
            </Row>
          </Form>
          *Tips：请先选择要关联的优惠券模板，然后输入关联配置信息，若关联多个优惠券模板，则所有的商品配置信息相同，添加完成后可在下方表格修改
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="addTempData('modalAdd')">确定
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      style="z-index: 1000"
    >
      <p slot="header">
        <i-col>修改优惠券活动和模板关联</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="addRelationDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
            <FormItem label="优惠券名称:">
              {{ addRelationDetail.couponName }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="优惠券类型:">
              {{ addRelationDetail.couponType | couponTypeFilter }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="优惠金额:" prop="couponFee">
              {{ addRelationDetail.couponFee | fenToYuanDot2Filters }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="最小购买金额:" prop="minBuyFee">
              {{ addRelationDetail.minBuyFee | fenToYuanDot2Filters }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="优惠券状态:" prop="couponStatus">
              {{ addRelationDetail.couponStatus | couponStatusFilter }}
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="使用范围:" prop="couponScope">
              {{ addRelationDetail.couponScope | couponScopeFilter }}
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="使用规则:" prop="couponRules">
              <Input v-model="addRelationDetail.couponRules" :rows="6" placeholder="使用规则" type="textarea"></Input>
            </FormItem>
             </Col>
          </Row>
          <Row>
            <FormItem label="优惠券图片     (推荐尺寸为750X160(单位:px)):" prop="couponImage" >
              <img :src="addRelationDetail.couponImage" width="40%">
            </FormItem>
          </Row>
          <Row>
            <Col span="7">
            <FormItem label="生效时间:" prop="effectiveStartTime">
              <DatePicker
                :value="addRelationDetail.effectiveStartTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="生效时间"
                style="width: 160px"
                @on-change="effectiveStartTimeChange"/>
            </FormItem>
                  </Col>
          </Row>
          <Row>
            <Col span="7">
            <FormItem label="失效时间:" prop="effectiveEndTime">
              <DatePicker
                :value="addRelationDetail.effectiveEndTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="结束时间"
                style="width: 160px"
                @on-change="effectiveEndTimeChange"/>
            </FormItem>
              </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="发券总限制:" prop="couponLimit">
              <InputNumber :min="0" v-model="addRelationDetail.couponLimit" class="ml20" label="限购数量"></InputNumber>
            </FormItem>
             </Col>
          </Row>
        </row></Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  getCouponTemplateRelationPages,
  deleteCouponTemplateRelation,
  createCouponTemplateRelation,
  editCouponTemplateRelation,
  getCouponTemplatePages,
  getHdCouponActivitiesPages
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { couponStatusConvert, couponTypeConvert, couponScopeConvert } from '@/libs/converStatus';
import { couponStatusEnum, couponTypeEnum, couponScopeEnum } from '@/libs/enumerate';
import { compareData, getSmallCouponActivity, fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber } from '@/libs/util';

const couponDetail = {
  formBeginTime: null,
  formEndTime: null,
  activityShareId: 0,
  id: 0,
  activityId: 0,
  activityName: '',
  activityRuel: '',
  activityContent: '',
  ifEffective: null,
  beginTime: null,
  endTime: null,
  createUser: '',
  createTime: null,
  applicationType: null,
  activityImage: '',
  activityUrl: ''
};

const relationDetail = {
  id: 0,
  activityCouponId: 0,
  couponName: '',
  couponType: null,
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  effectiveStartTime: null,
  effectiveEndTime: null,
  couponLimit: 0,
  receiveCount: 0,
  couponRules: '',
  couponScope: null,
  hdActivityId: 0,
  couponTemplateIds: ''
}
const relationList = [
  {
    id: 0,
    activityCouponId: 0,
    couponName: '',
    couponType: null,
    couponFee: 0,
    minBuyFee: 0,
    couponStatus: null,
    couponImage: '',
    effectiveStartTime: null,
    effectiveEndTime: null,
    couponLimit: 0,
    receiveCount: 0,
    couponRules: '',
    couponScope: null,
    hdActivityId: 0,
    couponTemplateIds: ''
  }
]

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
  couponScope: null
};

const hdCouponTemplateDetail = {
  activity_id: 0,
  begin_date: null,
  end_date: null,
  coupon_name: '',
  coupon_remark: '',
  coupon_type: '',
  face_value: 0,
  price: 0,
  use_rule: ''
};

const roleRowData = {
  formBeginTime: null,
  formEndTime: null,
  ifEffective: null,
  activityName: null,
  page: 1,
  rows: 10
};

const relationRowData = {
  activityCouponId: 0,
  page: 1,
  rows: 10
};

const templateRowData = {
  couponName: null,
  couponType: null,
  couponStatus: 'VALID',
  page: 1,
  rows: 5
};

const hdTemplateRowData = {
  storeId: null,
  sortKey: null,
  desc: null,
  platformId: null,
  activityTypes: ['all'],
  activityId: null
};

const templateColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    minWidth: 80
  },
  {
    title: '优惠券类型',
    key: 'couponType',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return <div><tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag></div>;
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return <div><tag color='orange'>{couponTypeConvert(row.couponType).label}</tag></div>;
      } else if (row.couponType === 'CASH_COUPON') {
        return <div><tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag></div>;
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: '优惠金额',
    key: 'couponFee',
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
    }
  },
  {
    title: '最小购买金额',
    key: 'minBuyFee',
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: '优惠券状态',
    key: 'couponStatus',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === 'VALID') {
        return <div><tag color='success'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
      } else if (row.couponStatus === 'INVALID') {
        return <div><tag color='error'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
      }
      return <div>{row.couponStatus}</div>;
    }
  },
  {
    title: '优惠券图片',
    key: 'couponImage',
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.couponImage} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '使用范围',
    key: 'couponScope',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponScope === 'STORE') {
        return <div><tag color='magenta'>{couponScopeConvert(row.couponScope).label}</tag></div>;
      } else if (row.couponScope === 'STORE_AND_SMALL') {
        return <div><tag color='orange'>{couponScopeConvert(row.couponScope).label}</tag></div>;
      } else if (row.couponScope === 'SMALL') {
        return <div><tag color='cyan'>{couponScopeConvert(row.couponScope).label}</tag></div>;
      }
      return <div>{row.couponScope}</div>;
    }
  },
  {
    title: '创建人',
    minWidth: 60,
    key: 'createUser'
  },
  {
    title: '创建时间',
    minWidth: 90,
    key: 'createTime'
  }
];

const hdTemplateColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  // {
  //   title: '活动id',
  //   width: 60,
  //   key: 'activity_id'
  // },
  {
    title: '优惠券名称',
    key: 'coupon_name',
    minWidth: 80
  },
  {
    title: '优惠券类型',
    key: 'coupon_type',
    minWidth: 80
  },
  {
    title: '券面额',
    key: 'face_value',
    minWidth: 80
  },
  // {
  //   title: '券面额',
  //   key: 'face_value',
  //   minWidth: 80,
  //   render(h, params) {
  //     return <div>{fenToYuanDot2(params.row.face_value)}</div>;
  //   }
  // },
  {
    title: '券说明',
    key: 'coupon_remark',
    minWidth: 80
  },
  {
    title: '用券条件',
    key: 'use_rule',
    minWidth: 80
  },
  {
    title: '活动起始时间',
    key: 'begin_date',
    minWidth: 80
  },
  {
    title: '活动结束时间',
    key: 'end_date',
    minWidth: 80
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        effectiveStartTime: [{ required: true, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: true, message: '请选择失效时间' }],
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
      relationRuleInline: {
        effectiveStartTime: [{ required: true, message: '请选择生效时间' }],
        effectiveEndTime: [{ required: true, message: '请选择失效时间' }],
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
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      columns: [
        {
          title: '优惠券名称',
          key: 'couponName',
          minWidth: 80
        },
        {
          title: '优惠券类型',
          key: 'couponType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return <div><tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag></div>;
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return <div><tag color='orange'>{couponTypeConvert(row.couponType).label}</tag></div>;
            } else if (row.couponType === 'CASH_COUPON') {
              return <div><tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag></div>;
            }
            return <div>{row.couponType}</div>;
          },
          minWidth: 80
        },
        {
          title: '优惠金额',
          key: 'couponFee',
          minWidth: 60,
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
          }
        },
        {
          title: '优惠/折扣额度',
          key: 'minBuyFee',
          minWidth: 60,
          render(h, params) {
            return h('div', fenToYuanDot2(params.row.minBuyFee));
          }
        },
        {
          title: '优惠券状态',
          key: 'couponStatus',
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponStatus === 'VALID') {
              return <div><tag color='success'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
            } else if (row.couponStatus === 'INVALID') {
              return <div><tag color='error'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
            }
            return <div>{row.couponStatus}</div>;
          }
        },
        {
          title: '优惠券图片',
          key: 'couponImage',
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.couponImage} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '生效时间',
          key: 'effectiveStartTime',
          minWidth: 80
        },
        {
          title: '失效时间',
          key: 'effectiveEndTime',
          minWidth: 80
        },
        {
          title: '发券总数限制',
          key: 'couponLimit',
          minWidth: 60
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      templateColumns: _.cloneDeep(templateColumns),
      hdTemplateColumns: _.cloneDeep(hdTemplateColumns),
      addTempDataLoading: false,
      tempTableLoading: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchHdTemplateRowData: _.cloneDeep(hdTemplateRowData),
      couponDetail: _.cloneDeep(couponDetail),
      relationDetail: _.cloneDeep(relationDetail),
      addRelationDetail: [],
      addRelationList: _.cloneDeep(relationList),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      hdCouponTemplateDetail: _.cloneDeep(hdCouponTemplateDetail),
      couponTemplateTotal: 0,
      couponHdTemplateTotal: 0,
      showBack: false,
      modalAdd: false
    };
  },
  computed: {
    minBuyFeeComputed() {
      return fenToYuanDot2Number(this.relationDetail.minBuyFee);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
    this.showBack = this.$route.name === 'small-activity-relation-coupon';
    console.log('showBack:' + this.showBack);
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalCreate.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.couponDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (compareData(this.addRelationDetail.effectiveStartTime, this.addRelationDetail.effectiveEndTime)) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.tempTableLoading = true;
            editCouponTemplateRelation(this.addRelationDetail).then(res => {
              this.getRelationTableData();
              this.modalEdit = false;
            }).finally(res => {
              this.tempTableLoading = false;
            });
            this.tempTableLoading = false;
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    handleEdit(params) {
      // this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.addRelationDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      // 获取优惠券活动页面传过来的优惠券信息
      if (this.$route.name === 'small-activity-relation-coupon') {
        const couponActivity = getSmallCouponActivity();
        if (couponActivity != null && couponActivity !== '') {
        // 给商品规格的商品和搜索条件赋值
          this.searchRelationRowData.activityCouponId = couponActivity.id;
          this.addRelationDetail.activityCouponId = couponActivity.id;
          this.relationDetail = this._.cloneDeep(couponActivity);
          // this.relationDetail.productId = couponActivity.id;
          // this.relationDetail.baseUnit = couponActivity.unitName;
          // this.relationDetail.baseProductName = couponActivity.productName;
          // this.relationDetail.baseImage = couponActivity.image;
          // this.relationDetail.image = couponActivity.image;
          // this.relationDetail.baseProductDescription = couponActivity.description;
          // this.relationDetail.productDescription = couponActivity.description;
        }
      }
      this.getRelationTableData();
    },
    beginTimeChange(value, date) {
      this.couponDetail.beginTime = value;
      this.couponDetail.formBeginTime = value;
    },
    endTimeChange(value, date) {
      this.couponDetail.endTime = value;
      this.couponDetail.formEndTime = value;
    },
    goBack() {
      this.turnToPage('small-activity-coupon');
    },
    getRelationTableData() {
      getCouponTemplateRelationPages(this.searchRelationRowData).then(res => {
        this.relationDetail = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getTemplateTableData() {
      getCouponTemplatePages(this.searchTemplateRowData).then(res => {
        this.couponTemplateDetail = res.rows;
        this.couponTemplateTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
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
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleTemplateSearch();
    },
    onTemplateSelectionAll(selection) {
      this.addRelationDetail.couponTemplateIds = selection.map(item => item.id.toString()).join(',');
      console.log('商品选择变化,当前页选择couponTemplateIds:' + this.addRelationDetail.couponTemplateIds);
      this.addRelationList = [];
      selection.forEach(element => {
        this.addRelationList.push({
          couponName: element.couponName,
          couponType: element.couponType,
          couponFee: element.couponFee,
          minBuyFee: element.minBuyFee,
          couponStatus: element.couponStatus,
          couponImage: element.couponImage,
          receiveCount: 0,
          couponRules: element.couponRules,
          couponScope: element.couponScope
        });
      });
      console.log(JSON.stringify(this.addRelationList));
    },
    onTemplateSelectionChange(selection) {
      this.addRelationDetail.couponTemplateIds = selection.map(item => item.id.toString()).join(',');
      console.log('商品选择变化,当前页选择couponTemplateIds:' + this.addRelationDetail.couponTemplateIds);
      this.addRelationList = [];
      selection.forEach(element => {
        this.addRelationList.push({
          couponName: element.couponName,
          couponType: element.couponType,
          couponFee: element.couponFee,
          minBuyFee: element.minBuyFee,
          couponStatus: element.couponStatus,
          couponImage: element.couponImage,
          receiveCount: 0,
          couponRules: element.couponRules,
          couponScope: element.couponScope
        });
      });
      console.log(JSON.stringify(this.addRelationList));
    },
    onHdTemplateSelectionAll(selection) {
      this.addRelationDetail.couponTemplateIds = selection.map(item => item.activity_id.toString()).join(',');
      this.addRelationList = [];
      selection.forEach(element => {
        var startIndex = element.use_rule.indexOf('满');
        var endIndex = element.use_rule.indexOf('元');
        var minBuyFee = element.use_rule.slice(startIndex + 1, endIndex);
        this.addRelationList.push({
          couponName: element.coupon_name,
          // couponType: element.coupon_type,
          couponType: 'CASH_COUPON',
          couponFee: element.face_value,
          // minBuyFee: element.price,
          minBuyFee: minBuyFee,
          couponStatus: 'VALID',
          couponImage: '',
          receiveCount: 0,
          couponRules: element.use_rule,
          couponScope: 'STORE_AND_SMALL',
          hdActivityId: element.activity_id
        });
      });
      console.log(JSON.stringify(this.addRelationList));
    },
    onHdTemplateSelectionChange(selection) {
      this.addRelationDetail.couponTemplateIds = selection.map(item => item.activity_id.toString()).join(',');
      this.addRelationList = [];
      selection.forEach(element => {
        var startIndex = element.use_rule.indexOf('满');
        var endIndex = element.use_rule.indexOf('元');
        var minBuyFee = element.use_rule.slice(startIndex + 1, endIndex);
        this.addRelationList.push({
          couponName: element.coupon_name,
          // couponType: element.coupon_type,
          couponType: 'CASH_COUPON',
          couponFee: element.face_value,
          // minBuyFee: element.price,
          minBuyFee: minBuyFee,
          couponStatus: 'VALID',
          couponImage: '',
          receiveCount: 0,
          couponRules: element.use_rule,
          couponScope: 'STORE_AND_SMALL',
          hdActivityId: element.activity_id
        });
      });
      console.log(JSON.stringify(this.addRelationList));
    },
    effectiveStartTimeChange(value, date) {
      this.addRelationDetail.effectiveStartTime = value;
    },
    effectiveEndTimeChange(value, date) {
      this.addRelationDetail.effectiveEndTime = value;
    },
    addTempData(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const couponTemplateIds = this.addRelationDetail.couponTemplateIds.split(',');
          if (couponTemplateIds.length === 0 || this.addRelationDetail.couponTemplateIds === '') {
            this.$Message.error('请选择一个要关联的商品!');
            return;
          } else if (compareData(this.addRelationDetail.effectiveStartTime, this.addRelationDetail.effectiveEndTime)) {
            this.$Message.error('优惠券失效时间必须大于生效时间!');
            return;
          }
          if (this.tempModalType === 'addTemplate') {
            this.createRelation();
          } else if (this.tempModalType === 'addHdTemplate') {
            this.createHdRelation();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRelation() {
      this.modalViewLoading = true;
      this.addRelationList.forEach(item => {
        item.activityCouponId = this.addRelationDetail.activityCouponId;
        item.effectiveStartTime = this.addRelationDetail.effectiveStartTime;
        item.effectiveEndTime = this.addRelationDetail.effectiveEndTime;
        item.couponLimit = this.addRelationDetail.couponLimit;
      })
      // this.addRelationDetail.receiveCount = 0;
      createCouponTemplateRelation(this.addRelationList).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.modalAdd = false;
        this.getRelationTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    createHdRelation() {
      this.modalViewLoading = true;
      this.addRelationList.forEach(item => {
        item.activityCouponId = this.addRelationDetail.activityCouponId;
        item.effectiveStartTime = this.addRelationDetail.effectiveStartTime;
        item.effectiveEndTime = this.addRelationDetail.effectiveEndTime;
        item.couponLimit = this.addRelationDetail.couponLimit;
      })
      console.log(JSON.stringify(this.addRelationList));
      createCouponTemplateRelation(this.addRelationList).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.modalAdd = false;
        this.getRelationTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    getHdTemplateTableData() {
      getHdCouponActivitiesPages(this.searchHdTemplateRowData).then(res => {
        this.hdCouponTemplateDetail = res.rows;
        this.couponHdTemplateTotal = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    addCouponTemplate() {
      this.getTemplateTableData();
      this.tempModalType = 'addTemplate';
      this.modalAdd = true;
    },
    addHdCouponTemplate() {
      this.getHdTemplateTableData();
      this.tempModalType = 'addHdTemplate';
      this.addRelationList = this._.cloneDeep(relationList);
      this.modalAdd = true;
    },
    handleAddClose() {
      this.modalAdd = false;
    },
    minBuyFeeInputNumberOnchange(value) {
      this.relationDetail.minBuyFee = yuanToFenNumber(value);
    },
    // 删除
    handleDelete(params) {
      deleteCouponTemplateRelation({ ids: params.row.id }).then(res => {
        this.relationDetail = this.relationDetail.filter((item, index) =>
          index !== params.row.initRowIndex
        );
        this.getRelationTableData();
      }).finally(res => {
        this.tempTableLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
