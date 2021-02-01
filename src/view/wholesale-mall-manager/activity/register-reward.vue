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
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="operations">
          <Button
            v-show="showBack"
            v-waves
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
          <Button v-waves type="success" class="mr5" @click="handleCreate">
            <Icon type="md-add" />添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>
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

    <Modal
      v-model="modalEdit"
      :width="1300"
      :z-index="1000"
      :mask-closable="false"
      title="关联优惠券配置"
    >
      <div class="modal-content">
        <Card>
          <tables
            ref="tables"
            v-model="configTableData"
            :columns="configColumns"
            :loading="loadingConfig"
            :search-area-column="18"
            :operate-area-column="6"
            editable
            searchable
            border
            search-place="top"
            @on-select-all="onConfigSelectionAll"
            @on-selection-change="onConfigSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchConfigRowData.couponName"
                  placeholder="优惠券名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Select
                  v-model="searchConfigRowData.couponType"
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
                  >
                    {{ item.label }}
                  </Option>
                </Select>
                <Button
                  :loading="searchLoading"
                  class="search-btn mr5"
                  type="primary"
                  @click="handleConfigSearch"
                >
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button
                  v-waves
                  :loading="clearSearchLoading"
                  class="search-btn"
                  type="info"
                  @click="handleConfigClear"
                >
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>
          <div style="margin: 10px; overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="configTotal"
                :current="searchConfigRowData.page"
                show-sizer
                show-total
                @on-change="changeConfigPage"
                @on-page-size-change="changeConfigPageSize"
              ></Page>
            </Row>
          </div>
        </Card>
        <Row class="mt10">
          <Form
            ref="editForm"
            :model="rewardConfig"
            :rules="ruleInline"
            :label-width="80"
          >
            <Row>
              <i-col span="12">
                <FormItem label="发送数量:" prop="rewardAmount">
                  <InputNumber
                    v-model="rewardConfig.rewardAmount"
                  ></InputNumber>
                </FormItem>
                <div class="ml15 brand-red">
                  * 批量关联多张优惠券时，发放数量统一以此字段为准
                </div>
              </i-col>
            </Row>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose"> 关闭 </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getRewardConfigPages,
  getCouponConfigPages,
  deleteRewardConfig,
  createRewardConfig,
  editRewardConfig
} from '@/api/wholesale';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  imageStatusConvert,
  couponScopeConvert,
  receiveTypeConvert,
  couponFromConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  imageStatusEnum,
  receiveTypeEnum,
  couponFromEnum
} from '@/libs/enumerate';
import {
  compareData,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  setSmallCouponActivity,
  getActivity,
  compareCouponData
} from '@/libs/util';

const rewardConfig = {
  activityId: 0,
  couponConfigId: 0,
  couponConfigIds: '',
  couponFee: '',
  couponName: '',
  fullFee: '',
  id: 0,
  rewardAmount: 0
};

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
  vaildDays: 0
};

const configRoleRowData = {
  couponName: '',
  couponType: '',
  couponConfigvaild: 'yes',
  page: 1,
  rows: 10
};

const roleRowData = {
  activityId: null,
  page: 1,
  rows: 10,
  sidx: 'id',
  sort: 'desc'
};

const relationRowData = {
  activityRegisterId: 0,
  page: 1,
  rows: 10
};

const activityDetail = {
  id: 0,
  activityCode: '',
  activityDesc: '',
  activityType: '',
  linkUrl: '',
  vaild: '',
  endTime: null,
  startTime: null
};

const configColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: 'ID',
    align: 'center',
    key: 'id',
    minWidth: 70
  },
  {
    title: '优惠券名称',
    align: 'center',
    key: 'couponName',
    minWidth: 120
  },
  {
    title: '满减金额',
    align: 'center',
    minWidth: 60,
    key: 'fullFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.fullFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '优惠金额',
    align: 'center',
    minWidth: 60,
    key: 'couponFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.couponFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '发放类型',
    align: 'center',
    key: 'couponType',
    minWidth: 70,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'artificial') {
        return (
          <div>
            <tag color='primary'>{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === 'activity') {
        return (
          <div>
            <tag color='pink'>{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === 'registration') {
        return (
          <div>
            <tag color='orange'>{couponFromConvert(row.couponType)}</tag>
          </div>
        );
      } else if (row.couponType === 'flashsale') {
        return (
          <div>
            <tag color='cyan'>{couponFromConvert(row.couponType)}</tag>
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
    width: 180,
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
    width: 230,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.vaildDays) {
        return <div>{'N/A'}</div>;
      } else {
        if (!compareCouponData(row.failureTime)) {
          return <div style='color:red'>{row.failureTime + '已过期'}</div>;
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
    minWidth: 60
  },
  {
    title: '优惠券状态',
    minWidth: 80,
    align: 'center',
    key: 'vaild',
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
  }
];

const relationTempColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName'
  },
  {
    title: '优惠券类型',
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
      }
      return (
        <div>
          <tag color='error'>{row.couponType}</tag>
        </div>
      );
    }
  },
  {
    title: '优惠金额',
    key: 'couponFee'
  },
  {
    title: '优惠/折扣额度',
    key: 'minBuyFee'
  },
  {
    title: '优惠券状态',
    key: 'couponStatus',
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
      return (
        <div>
          <tag color='primary'>{row.couponStatus}</tag>
        </div>
      );
    }
  },
  {
    title: '优惠券图片',
    key: 'couponImage',
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.couponImage} width='100%' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '单次发放数量',
    key: 'issuedNum',
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.issuedNum
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.issuedNum = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.issuedNum);
      }
    }
  },
  {
    title: '有效天数',
    key: 'effectiveDay',
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            domProps: {
              value: params.row.effectiveDay
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.effectiveDay = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.effectiveDay);
      }
    }
  },
  {
    title: '创建人',
    key: 'createBy'
  }
];

const rewardColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: 'ID',
    align: 'center',
    key: 'id'
  },
  {
    title: '优惠券名称',
    align: 'center',
    key: 'couponName',
    minWidth: 150
  },
  {
    title: '满减金额',
    align: 'center',
    minWidth: 60,
    key: 'fullFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.fullFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '优惠金额',
    align: 'center',
    minWidth: 60,
    key: 'couponFee',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.couponFee);
      return <div>{amount}</div>;
    }
  },
  {
    title: '发放数量',
    align: 'center',
    key: 'rewardAmount',
    minWidth: 40
  },
  {
    title: '操作',
    minWidth: 80,
    key: 'handle',
    options: ['delete']
  }
];

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

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        beginTime: [{ required: true, message: '请选择活动开始时间' }],
        endTime: [{ required: true, message: '请选择活动结束时间' }],
        receiveType: [{ required: true, message: '请选择活动结束时间' }]
      },
      relationRuleInline: {
        issuedNum: [
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
        ],
        effectiveDay: [
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
      configTableData: [],
      templatePageOpts: [5, 10],
      couponStatusEnum,
      couponFromEnum,
      couponTypeEnum,
      imageStatusEnum,
      receiveTypeEnum,
      activityStatus: '',
      columns: rewardColumns,
      relationColumns: [
        ...relationTempColumns,
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          align: 'center',
          options: ['inlineEdit', 'delete']
        }
      ],
      configColumns: _.cloneDeep(configColumns),
      loadingConfig: false,
      addTempDataLoading: false,
      tempTableLoading: false,
      templateLoading: false,
      modalViewLoading: false,
      modalRelation: false,
      showBack: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchRelationRowData: _.cloneDeep(relationRowData),
      searchConfigRowData: _.cloneDeep(configRoleRowData),
      relationDatas: [],
      rewardConfig: _.cloneDeep(rewardConfig),
      couponTemplateDetail: _.cloneDeep(couponTemplateDetail),
      couponTemplates: [],
      couponTemplateTotal: 0,
      configTotal: 0
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
    this.showBack = this.$route.name === 'wholesale-register-reward';
  },
  methods: {
    getTableData() {
      const activity = getActivity();
      // 如果是从统一活动页面过来的
      if (activity) {
        this.activityDetail = _.cloneDeep(activity);
        this.searchRowData.activityId = activity.id;
        this.rewardConfig.activityId = activity.id;
        this.activityStatus = activity.vaild;
      }
      getRewardConfigPages(this.searchRowData)
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
    getConfigTableData() {
      this.loadingConfig = true;
      getCouponConfigPages(this.searchConfigRowData).then((res) => {
        this.configTableData = res.rows;
        this.configTotal = res.total;
        this.loadingConfig = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleCreate() {
      if (this.activityStatus === 'yes') {
        this.$Message.error('活动有效期内不允许添加新活动!');
        return;
      }
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.rewardConfig = _.cloneDeep(rewardConfig);
      }
      this.resetFields();
      this.getConfigTableData();
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: 'small-vip-activities-associated'
      });
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createRewardConfig();
          } else if (this.isEdit) {
            this.editRewardConfig();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRewardConfig() {
      this.modalViewLoading = true;
      createRewardConfig(this.rewardConfig)
        .then((res) => {
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editRewardConfig() {
      this.modalViewLoading = true;
      editRewardConfig(this.rewardConfig)
        .then((res) => {
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    onConfigSelectionChange(selection) {
      this.rewardConfig.couponConfigIds = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    onConfigSelectionAll(selection) {
      this.rewardConfig.couponConfigIds = selection
        .map((item) => item.id.toString())
        .join(',');
    },
    resetSearchRowData() {
      this.searchRelationRowData = _.cloneDeep(relationRowData);
      this.getTableData();
    },
    resetFields() {
      if (this.tempModalType == null) {
        this.$refs.modalCreate.resetFields();
      }
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    deleteTable(ids) {
      this.loading = true;
      deleteRewardConfig({
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
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.resetFields();
      this.rewardConfig = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    addTempData(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const activityRegisterId = this.addRelationDetail.activityRegisterId;
          const couponTemplateIds = this.addRelationDetail.couponTemplateIds.split(
            ','
          );
          if (activityRegisterId === 0 || activityRegisterId === '') {
            this.$Message.error('注册送礼优惠券活动不能为空!');
            return;
          } else if (
            couponTemplateIds.length === 0 ||
            this.addRelationDetail.couponTemplateIds === ''
          ) {
            this.$Message.error('请选择要关联的优惠券模板!');
            return;
          }
          console.log(
            'realtion couponTemplate',
            JSON.stringify(this.addRelationDetail)
          );
          this.createRelation();
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    changeConfigPage(page) {
      this.searchConfigRowData.page = page;
      this.getConfigTableData();
    },
    changeConfigPageSize(pageSize) {
      this.searchConfigRowData.page = 1;
      this.searchConfigRowData.rows = pageSize;
      this.getConfigTableData();
    },
    handleConfigSearch() {
      this.searchConfigRowData.page = 1;
      this.searchLoading = true;
      this.getConfigTableData();
    },
    handleConfigClear() {
      this.clearSearchLoading = true;
      this.searchConfigRowData = _.cloneDeep(configRoleRowData);
      this.handleConfigSearch();
    },
    goBack() {
      this.turnToPage('wholesale-activity');
    },
    handleDelete(params) {
      if (this.activityStatus === 'yes') {
        this.$Message.error('活动有效期内不允删除!');
        return;
      }
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      if (this.activityStatus === 'yes') {
        this.$Message.error('活动有效期内不允删除!');
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter((value) => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteTable(strTempDelete);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
