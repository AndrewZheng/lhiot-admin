<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
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
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.continueSignDay"
            placeholder="签到天数"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.rewardType"
            placeholder="奖励类型"
            class="mr5"
            style="width: 100px"
            clearable
          >
            <Option
              v-for="(item,index) in rewardTypeEnum"
              :key="index"
              :value="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
            :search-loading="searchLoading"
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
        </div>
        <div slot="operations">
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
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建签到奖励':'编辑签到奖励' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="signRewardDetail" :rules="ruleInline">
          <Row>
            <FormItem label="连续签到天数:" prop="continueSignDay">
              <Input v-model="signRewardDetail.continueSignDay" placeholder="请输入签到天数" style="width: 200px"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="获得积分:" prop="getIntegral">
              <Input v-model="signRewardDetail.getIntegral" placeholder="请输入任务积分" style="width: 200px"></Input>
            </FormItem>
          </Row>
          <Row v-if="signRewardDetail.rewardType==='GIFTPACK'">
            <FormItem label="礼包类型:" prop="giftPackType">
              <Input v-model="giftPackTypeStr" style="width: 200px" readonly>
              <Button v-if="signRewardDetail.giftPackType==='COUPON'" slot="append" type="success" icon="ios-settings" class="pr5" @click="handleConfig"></Button>
              </Input>
            <!-- <Select
                v-model="signRewardDetail.giftPackType"
                class="search-col mr5"
                placeholder="请选择"
                style="width:200px"
                clearable
              >
                <Option
                  v-for="item in rewardTypeEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select> -->
            </FormItem>
          </Row>
          <Row>
            <FormItem label="奖励类型:" prop="rewardType">
              <Select
                v-model="signRewardDetail.rewardType"
                class="search-col mr5"
                placeholder="请选择"
                style="width:200px"
                clearable
                @on-change="rewardTypeChange"
              >
                <Option
                  v-for="item in rewardTypeEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getSignRewardPages,
  editSignReward,
  deleteSignReward,
  createSignReward
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import uploadMixin from '@/mixins/uploadMixin.js';
import { rewardTypeEnum } from '@/libs/enumerate';
import { rewardTypeConvert } from '@/libs/converStatus';

const signRewardDetail = {
  continueSignDay: 0,
  getIntegral: 0,
  giftPackType: '',
  rewardType: ''
};

const searchRowData = {
  continueSignDay: null,
  rewardType: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      ids: [],
      rewardTypeEnum,
      columns: [
        {
          type: 'selection',
          key: '',
          align: 'center',
          width: 60
        },
        {
          title: '编号',
          align: 'center',
          key: 'id',
          width: 80
        },
        {
          title: '连续签到天数',
          align: 'center',
          key: 'continueSignDay',
          width: '200'
        },
        {
          title: '获得积分',
          align: 'center',
          key: 'getIntegral',
          width: '100'
        },
        {
          title: '礼包类型',
          align: 'center',
          key: 'giftPackType',
          render: (h, params, vm) => {
            const { row } = params;
            const str = row.giftPackType === 'COUPON' ? '优惠券' : 'N/A';
            return <div>{str}</div>;
          }
        },
        {
          title: '奖励类型',
          align: 'center',
          key: 'rewardType',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{rewardTypeConvert(row.rewardType)}</div>;
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      ruleInline: {
        continueSignDay: { required: false, message: '请填写连续签到天数' },
        getIntegral: { required: true, message: '请填写任务积分' },
        giftPackType: { required: false, message: '请选择礼包类型' },
        rewardType: { required: true, message: '请选择奖励类型' }
      },
      searchRowData: _.cloneDeep(searchRowData),
      signRewardDetail: _.cloneDeep(signRewardDetail)
    };
  },
  computed: {
    giftPackTypeStr() {
      return this.signRewardDetail.giftPackType === 'COUPON' ? '优惠券' : 'N/A';
    }
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.loading = true;
      getSignRewardPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(searchRowData);
    },
    handleConfig() {
      this.turnToPage({
        name: 'small-hand-coupon',
        params: { couponBusinessType: 'ACTIVITY_SIGN_COUPON', pageStatus: 'signReward' }
      })
    },
    handleCreate() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.signRewardDetail = _.cloneDeep(signRewardDetail);
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.signRewardDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善任务信息!');
        }
      });
    },
    editTableRow() {
      this.modalEditLoading = true;
      editSignReward(this.signRewardDetail)
        .then(res => {
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    createTableRow() {
      createSignReward(this.signRewardDetail)
        .then(res => {})
        .finally(res => {
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    rewardTypeChange(value) {
      this.signRewardDetail.giftPackType = value === 'GIFTPACK' ? 'COUPON' : '';
    },
    deleteTable(ids) {
      deleteSignReward({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

