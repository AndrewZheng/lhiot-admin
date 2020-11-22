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
        @on-edit="handleEdit"
        @on-sale="handleStatus"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.couponName"
              placeholder="优惠券名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.couponType"
              class="search-col mr5"
              placeholder="优惠券类型"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in couponTemplateTypeEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.couponSendType"
              class="search-col mr5"
              placeholder="发放类型"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in couponFromEnum"
                :key="item.value"
                :value="item.value"
                class="ptb2-5"
              >{{ item.label }}</Option>
            </Select>
            <Select
              v-model="searchRowData.couponConfigvaild"
              class="search-col mr5"
              placeholder="优惠券状态"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in activityStatusEnum"
                :key="item.value"
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
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="handleCreate"
          >
            <Icon type="md-add" />添加
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>-->
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="searchRowData.rows"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :z-index="1000"
      :width="750"
    >
      <p slot="header">
        <i-col>{{
          tempModalType === modalType.edit ? "修改优惠券配置" : "创建优惠券配置"
        }}</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="couponConfig"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="12">
              <FormItem label="优惠券名称:" prop="couponName">
                <Input
                  v-model="couponConfig.couponName"
                  placeholder="请关联优惠券模板"
                  readonly
                >
                <Button
                  slot="append"
                  icon="ios-search"
                  @click="handleRelation"
                ></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col v-show="couponConfig.couponName" span="12">
              <FormItem label="模板类型:" style="width: 200px">{{
                couponConfig.couponType === "DISCOUNT_COUPON"
                  ? "折扣券"
                  : "满减券"
              }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="满减金额:" prop="fullFee">{{
                couponConfig.fullFee | fenToYuanDot2Filters
              }}</FormItem>
            </i-col>
            <i-col
              v-if="couponConfig.couponType === 'DISCOUNT_COUPON'"
              span="12"
            >
              <FormItem
                label="折扣额度:"
                prop="couponFee"
              >{{ couponConfig.couponFee / 10 }}折</FormItem>
            </i-col>
            <i-col v-else span="12">
              <FormItem label="优惠金额:" prop="couponFee">{{
                couponConfig.couponFee | fenToYuanDot2Filters
              }}</FormItem>
            </i-col>
          </Row>
          <Divider orientation="center">配置信息</Divider>
          <Row v-show="couponConfig.vaildDays === null">
            <i-col span="12">
              <FormItem label="生效时间:" prop="effectiveTime">
                <DatePicker
                  :value="couponConfig.effectiveTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="生效时间"
                  style="width: 160px"
                  @on-change="handleStartTimeChange"
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="失效时间:" prop="failureTime">
                <DatePicker
                  :value="couponConfig.failureTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="失效时间"
                  style="width: 160px"
                  @on-change="handleEndTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col
              v-show="
                couponConfig.effectiveTime === '' &&
                  couponConfig.failureTime === ''
              "
              span="12"
            >
              <p class="ml20">*有效天数为相对时间，领券后几天内有效</p>
              <FormItem label="有效天数:" prop="vaildDays">
                <InputNumber
                  v-model="couponConfig.vaildDays"
                  placeholder="有效天数"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem
                label="发放类型:"
                prop="couponSendType"
                style="width: 260px"
              >
                <Select v-model="couponConfig.couponSendType">
                  <Option
                    v-for="(item, index) in couponFromEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px; width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="21">
              <FormItem label="优惠券描述:" prop="couponDes">
                <Input
                  v-model="couponConfig.couponDes"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  placeholder="请输入优惠券描述..."
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >确定</Button>
      </div>
    </Modal>

    <!-- 关联商品弹窗-->
    <Modal v-model="modalTemplate" :width="1000" title="关联优惠券模板">
      <Card>
        <tables
          ref="dataTables"
          v-model="couponTemplateData"
          :columns="couponTemplateColumns"
          :loading="loadingTemplate"
          :search-area-column="18"
          :operate-area-column="6"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="handleCouponRelation"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchTemplateRowData.couponName"
                placeholder="优惠券名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Select
                v-model="searchTemplateRowData.couponType"
                class="search-col mr5"
                placeholder="优惠券类型"
                style="width: 150px"
                clearable
              >
                <Option
                  v-for="item in couponTemplateTypeEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Select
                v-model="searchTemplateRowData.vaild"
                class="search-col mr5"
                placeholder="优惠券状态"
                style="width: 150px"
                clearable
                disabled
              >
                <Option
                  v-for="item in activityStatusEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleTemplateSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleTemplateClear"
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
              :current="searchTemplateRowData.page"
              show-sizer
              show-total
              @on-change="changeTemplatePage"
              @on-page-size-change="changeTemplatePageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getCouponConfigPages,
  getCouponTemplatePages,
  deleteCouponConfig,
  editCouponConfig,
  createCouponConfig
} from '@/api/lhfarm-small';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  activityTypeEnum,
  couponTemplateTypeEnum,
  activityStatusEnum,
  couponFromEnum
} from '@/libs/enumerate';
import {
  activityStatusConvert,
  activityTypeConvert,
  couponFromConvert,
  couponTemplateTypeConvert
} from '@/libs/converStatus';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareCouponData
} from '@/libs/util';

const couponConfig = {
  id: 0,
  vaild: '',
  endTime: null,
  startTime: null,
  couponFee: 0,
  couponName: '',
  couponType: '',
  fullFee: 0,
  couponDes: '',
  couponId: 0, // 优惠券模板id
  effectiveTime: '',
  failureTime: '',
  plateType: '', // allgoods-全品类 singlegoods-单品类
  vaildDays: null,
  couponSendType: ''
};

const roleRowData = {
  couponSendType: '',
  couponConfigvaild: '',
  endTime: null,
  startTime: null,
  page: 1,
  rows: 20
};

const couponTemplate = {
  id: 0,
  activityCode: '',
  activityDesc: '',
  linkUrl: '',
  vaild: '',
  endTime: null,
  startTime: null,
  couponFee: 0,
  couponName: '',
  couponType: '', // allgoods-全品类 singlegoods-单品
  fullFee: 0
};

const tempRoleRowData = {
  activityCode: null,
  activityDesc: null,
  vaild: 'yes',
  endTime: null,
  startTime: null,
  page: 1,
  rows: 10
};

const couponTemplateColumns = [
  {
    title: 'ID',
    align: 'center',
    key: 'id',
    maxWidth: 80
  },
  {
    title: '优惠券名称',
    align: 'center',
    key: 'couponName',
    minWidth: 150
  },
  {
    title: '最小起购门槛',
    align: 'center',
    minWidth: 60,
    key: 'fullFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.fullFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '最高折扣金额',
    align: 'center',
    minWidth: 60,
    key: 'discountMaxFee',
    render(h, params, vm) {
      if (params.row.couponType === 'DISCOUNT_COUPON') {
        const amount = fenToYuanDot2(params.row.discountMaxFee);
        return <div>{amount}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '优惠金额/折扣额度',
    align: 'center',
    minWidth: 60,
    key: 'couponFee',
    render(h, params, vm) {
      if (params.row.couponType === 'DISCOUNT_COUPON') {
        return <div>{params.row.couponFee / 10 + '折'}</div>;
      } else {
        const amount = fenToYuanDot2(params.row.couponFee);
        return <div>{amount}</div>;
      }
    }
  },
  {
    title: '模板类型',
    align: 'center',
    key: 'couponType',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='primary'>满减券</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='pink'>折扣券</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color='primary'>N/A</tag>
          </div>
        );
      }
    }
  },
  {
    title: '优惠券状态',
    align: 'center',
    key: 'vaild',
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaild === 'yes') {
        return (
          <div>
            <tag color='success'>有效</tag>
          </div>
        );
      } else if (row.vaild === 'no') {
        return (
          <div>
            <tag color='error'>无效</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>N/A</tag>
        </div>
      );
    }
  }
];

export default {
  components: {
    Tables
  },
  filters: {
    plateTypeFilter(value) {
      if (!value) return 'N/A';
      const str = value === 'allgoods' ? '全品类' : '单品类';
      return str;
    }
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      couponFromEnum,
      templatePageOpts: [20, 50],
      activityTypeEnum,
      activityStatusEnum,
      couponTemplateTypeEnum,
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponTemplateColumns,
      couponTemplateData: [],
      templateTotal: 0,
      modalTemplate: false,
      createLoading: false,
      loadingTemplate: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTemplateRowData: _.cloneDeep(tempRoleRowData),
      couponConfig: _.cloneDeep(couponConfig),
      couponTemplate: _.cloneDeep(couponTemplate),
      ruleInline: {
        couponType: [{ required: true, message: '请选择活动类型' }],
        couponFee: [
          { required: true, message: '请输入优惠金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        fullFee: [
          { required: true, message: '请输入满减金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        vaild: [{ required: true, message: '请选择活动状态' }]
      },
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          maxWidth: 55
        },
        {
          title: '优惠券名称',
          align: 'center',
          key: 'couponName',
          minWidth: 100
        },
        {
          title: '最小起购门槛',
          align: 'center',
          minWidth: 60,
          key: 'fullFee',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.fullFee);
            return <div>{amount}</div>;
          }
        },
        {
          title: '最高折扣金额',
          align: 'center',
          minWidth: 60,
          key: 'discountMaxFee',
          render(h, params, vm) {
            if (params.row.couponType === 'DISCOUNT_COUPON') {
              const amount = fenToYuanDot2(params.row.discountMaxFee);
              return <div>{amount}</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '优惠金额/折扣额度',
          align: 'center',
          minWidth: 25,
          key: 'couponFee',
          render(h, params, vm) {
            if (params.row.couponType === 'DISCOUNT_COUPON') {
              return <div>{params.row.couponFee / 10 + '折'}</div>;
            } else {
              const amount = fenToYuanDot2(params.row.couponFee);
              return <div>{amount}</div>;
            }
          }
        },
        {
          title: '模板类型',
          align: 'center',
          key: 'couponType',
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return (
                <div>
                  <tag color='primary'>满减券</tag>
                </div>
              );
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return (
                <div>
                  <tag color='pink'>折扣券</tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='primary'>N/A</tag>
                </div>
              );
            }
          }
        },
        {
          title: '发放类型',
          align: 'center',
          key: 'couponSendType',
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponSendType === 'artificial') {
              return (
                <div>
                  <tag color='primary'>
                    {couponFromConvert(row.couponSendType)}
                  </tag>
                </div>
              );
            } else if (row.couponSendType === 'recharge') {
              return (
                <div>
                  <tag color='pink'>
                    {couponFromConvert(row.couponSendType)}
                  </tag>
                </div>
              );
            } else if (row.couponSendType === 'registration') {
              return (
                <div>
                  <tag color='orange'>
                    {couponFromConvert(row.couponSendType)}
                  </tag>
                </div>
              );
            } else if (row.couponSendType === 'flashsale') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponFromConvert(row.couponSendType)}
                  </tag>
                </div>
              );
            } else {
              return (
                <div>
                  <tag color='primary'>N/A</tag>
                </div>
              );
            }
          }
        },

        {
          title: '生效时间',
          align: 'center',
          key: 'effectiveTime',
          minWidth: 90,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.vaildDays) {
              return <div>{'N/A'}</div>;
            } else {
              return <div>{row.effectiveTime}</div>;
            }
          }
        },
        {
          title: '失效时间',
          align: 'center',
          key: 'failureTime',
          minWidth: 90,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.vaildDays) {
              return <div>{'N/A'}</div>;
            } else {
              if (!compareCouponData(row.failureTime)) {
                return (
                  <div style='color:red'>{row.failureTime + '　已过期'}</div>
                );
              } else {
                return <div>{row.failureTime}</div>;
              }
            }
          }
        },
        {
          title: '有效天数',
          align: 'center',
          key: 'vaildDays',
          minWidth: 15,
          render(h, params, vm) {
            const { row } = params;
            if (row.vaildDays) {
              return <div>{row.vaildDays}</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '券状态',
          align: 'center',
          minWidth: 20,
          key: 'couponConfigvaild',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponConfigvaild === 'yes') {
              return (
                <div>
                  <tag color='success'>有效</tag>
                </div>
              );
            } else if (row.couponConfigvaild === 'no') {
              return (
                <div>
                  <tag color='error'>无效</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>N/A</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          options: ['onSale', 'edit']
        }
      ]
    };
  },
  computed: {
    couponFeeComputed() {
      return fenToYuanDot2Number(this.couponConfig.couponFee);
    },
    fullFeeComputed() {
      return fenToYuanDot2Number(this.couponConfig.fullFee);
    }
  },
  created() {},
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  methods: {
    // 变化函数
    fullFeeOnchange(value) {
      this.couponConfig.fullFee = yuanToFenNumber(value);
    },
    couponFeeOnchange(value) {
      this.couponConfig.couponFee = yuanToFenNumber(value);
    },
    changeTemplatePage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplatesTableData();
    },
    changeTemplatePageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplatesTableData();
    },
    getTableData() {
      getCouponConfigPages(this.searchRowData)
        .then((res) => {
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
    getTemplatesTableData() {
      getCouponTemplatePages(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.templateTotal = res.total;
        })
        .finally((error) => {
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleCreate() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponConfig = _.cloneDeep(couponConfig);
      }
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponConfig = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleStatus(params) {
      this.couponConfig = _.cloneDeep(params.row);
      this.couponConfig.couponConfigvaild =
        params.row.couponConfigvaild === 'yes' ? 'no' : 'yes';
      this.editCouponConfig();
    },
    handleRelation() {
      this.getTemplatesTableData();
      this.modalTemplate = true;
    },
    handleTemplateSearch() {
      this.searchTemplateRowData.page = 1;
      this.searchLoading = true;
      this.getTemplatesTableData();
    },
    handleTemplateClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.clearSearchLoading = true;
      this.handleTemplateSearch();
    },
    handleCouponRelation(row, index) {
      this.couponConfig.couponId = row.id;
      this.couponConfig.couponName = row.couponName;
      this.couponConfig.couponFee = row.couponFee;
      this.couponConfig.fullFee = row.fullFee;
      this.couponConfig.couponType = row.couponType;
      this.modalTemplate = false;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createCouponConfig();
          } else if (this.isEdit) {
            this.editCouponConfig();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createCouponConfig() {
      this.modalViewLoading = true;
      createCouponConfig(this.couponConfig)
        .then((res) => {
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    editCouponConfig() {
      this.modalViewLoading = true;
      editCouponConfig(this.couponConfig)
        .then((res) => {
          this.$Message.success('操作成功！');
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    handleStartTimeChange(value, date) {
      this.couponConfig.effectiveTime = value;
    },
    handleEndTimeChange(value, data) {
      this.couponConfig.failureTime = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.couponConfig.storeImage = null;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteCouponConfig({
        ids
      })
        .then((res) => {
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
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.ml20 {
  margin-left: 37px;
  color: #ff3861;
}
</style>
