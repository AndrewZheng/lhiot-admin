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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addRegisterReward">
            <Icon type="md-add"/>
            创建
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
      v-model="modalView"
      :mask-closable="false"
    >
      <p slot="header">
        <span>注册送礼优惠券详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ registerRewardDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券名称:</i-col>
              <i-col span="18">{{ registerRewardDetail.couponName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">优惠券类型:</i-col>
              <i-col span="18">{{ registerRewardDetail.couponType | couponTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">单次发放数量:</i-col>
              <i-col span="18">{{ registerRewardDetail.issuedNum }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">有效天数:</i-col>
              <i-col span="18">{{ registerRewardDetail.effectiveDay }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ registerRewardDetail.createBy }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ registerRewardDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      style="z-index: 1000"
    >
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改注册送礼优惠券活动':'创建注册送礼优惠券活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="registerRewardDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
            <FormItem label="优惠券名称:" prop="couponName">
              <Input v-model="registerRewardDetail.couponName" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="优惠券类型:" prop="couponType">
              <Select v-model="registerRewardDetail.couponType" clearable>
                <Option
                  v-for="(item,index) in couponTypeEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="单次发放数量:" prop="issuedNum">
              <Input v-model="registerRewardDetail.issuedNum" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="有效天数:" prop="effectiveDay">
              <Input v-model="registerRewardDetail.effectiveDay" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="创建人:" prop="createBy">
              <Input v-model="registerRewardDetail.createBy" ></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  deleteRegisterReward,
  getRegisterRewardPages,
  editRegisterReward,
  createRegisterReward
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { couponStatusConvert, couponTypeConvert } from '@/libs/converStatus';
import { couponStatusEnum, couponTypeEnum } from '@/libs/enumerate'

const registerRewardDetail = {
  couponName: '',
  couponFee: 0,
  minBuyFee: 0,
  couponStatus: null,
  couponImage: '',
  couponType: null,
  id: 0,
  activityRegisterId: 0,
  couponTemplateId: 0,
  issuedNum: 0,
  effectiveDay: 0,
  createTime: null,
  createBy: ''
};

const roleRowData = {
  stBeginTime: null,
  stFinishTime: null,
  edBeginTime: null,
  edFinishTime: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        storeId: [
          { required: true, message: '请选择门店' }
        ],
        userId: [
          { required: true, message: '请输入用户id' },
          { message: '必须为非零整数', pattern: /^[-1-9]\d*$/ }
        ],
        receiverName: [
          { required: true, message: '请输入收货人' }
        ],
        receiverMobile: [
          { required: true, message: '请输入联系方式' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称' }
        ],
        avater: [
          { required: true, message: '请上传用户头像' }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      couponTypeEnum,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动与模板配置表id',
          key: 'id'
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
              return <div><tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag></div>;
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return <div><tag color='orange'>{couponTypeConvert(row.couponType).label}</tag></div>;
            } else if (row.couponType === 'CASH_COUPON') {
              return <div><tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag></div>;
            }
            return <div><tag color='error'>{row.couponType}</tag></div>;
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
              return <div><tag color='success'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
            } else if (row.couponStatus === 'INVALID') {
              return <div><tag color='error'>{couponStatusConvert(row.couponStatus).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.couponStatus}</tag></div>;
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
          key: 'issuedNum'
        },
        {
          title: '有效天数',
          key: 'effectiveDay'
        },
        {
          title: '创建人',
          key: 'createBy'
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['onSale', 'view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      registerRewardDetail: _.cloneDeep(registerRewardDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      // this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.registerRewardDetail.couponImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createRegisterReward();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editRegisterReward();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    createRegisterReward() {
      this.modalViewLoading = true;
      createRegisterReward(this.registerRewardDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editRegisterReward() {
      this.modalViewLoading = true;
      editRegisterReward(this.registerRewardDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addRegisterReward() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.registerRewardDetail = _.cloneDeep(registerRewardDetail)
      }

      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteRegisterReward({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(err => {
        console.log(err);
        this.loading = false;
      });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.registerRewardDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.registerRewardDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getRegisterRewardPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
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
    onOff(params) {
      this.registerRewardDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === 'ON') {
        this.registerRewardDetail.onOff = 'OFF';
      } else {
        this.registerRewardDetail.onOff = 'ON';
      }
      this.loading = true;
      this.editRegisterReward();
    },
    startTimeChange(value, date) {
      this.registerRewardDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.registerRewardDetail.endTime = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
