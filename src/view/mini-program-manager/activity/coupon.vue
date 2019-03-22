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
        <div slot="searchCondition">
          <Row>
            <DatePicker
              v-model="searchRowData.beginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addCoupon">
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
        <span>限时抢购活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ couponDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">限时抢购</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ couponDetail.startTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ couponDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动开关:</i-col>
              <i-col span="18">{{ couponDetail.onOff | imageStatusFilter }}</i-col>
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
        <i-col>{{ tempModalType===modalType.edit?'修改限时抢购活动':'创建限时抢购活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="couponDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
            <FormItem label="活动名称:">
              限时抢购
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="有效期起:" prop="startTime">
              <DatePicker
                v-model="couponDetail.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期起"
                class="search-input"
                style="width: 150px"
                @on-change="startTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="有效期止:" prop="endTime">
              <DatePicker
                v-model="couponDetail.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期止"
                class="search-input"
                style="width: 150px"
                @on-change="endTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动开关:" prop="onOff">
              <Select v-model="couponDetail.onOff" clearable>
                <Option
                  v-for="(item,index) in couponStatusEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%">{{ item.label }}
                </Option>
              </Select>
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
  deleteCoupon,
  getCouponPages,
  editCoupon,
  createCoupon
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { couponStatusConvert } from '@/libs/converStatus';
import { couponStatusEnum } from '@/libs/enumerate'

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
  applicationType: null
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动编号',
          key: 'id'
        },
        {
          title: '活动名称',
          key: 'activityName'
        },
        {
          title: '活动开始时间',
          key: 'beginTime'
        },
        {
          title: '活动结束时间',
          key: 'endTime'
        },
        {
          title: '优惠券生效日期',
          key: 'formBeginTime'
        },
        {
          title: '优惠券失效日期',
          key: 'formEndTime'
        },
        {
          title: '活动状态',
          key: 'ifEffective',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.ifEffective === 'VALID') {
              return <div><tag color='success'>{couponStatusConvert(row.ifEffective).label}</tag></div>;
            } else if (row.ifEffective === 'INVALID') {
              return <div><tag color='error'>{couponStatusConvert(row.ifEffective).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.ifEffective}</tag></div>;
          }
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '创建人',
          key: 'createUser'
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponDetail: _.cloneDeep(couponDetail)
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
      this.couponDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createCoupon();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editCoupon();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    createCoupon() {
      this.modalViewLoading = true;
      createCoupon(this.couponDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editCoupon() {
      this.modalViewLoading = true;
      editCoupon(this.couponDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addCoupon() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponDetail = _.cloneDeep(couponDetail)
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
      deleteCoupon({
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
      this.couponDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getCouponPages(this.searchRowData).then(res => {
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
      this.couponDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === 'ON') {
        this.couponDetail.onOff = 'OFF';
      } else {
        this.couponDetail.onOff = 'ON';
      }
      this.loading = true;
      this.editCoupon();
    },
    startTimeChange(value, date) {
      this.couponDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.couponDetail.endTime = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
