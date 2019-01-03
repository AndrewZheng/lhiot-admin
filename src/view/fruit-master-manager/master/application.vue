<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        border
        search-place="top"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        @on-view="handleView"
        @on-auditor="onAuditor"
      >
        <div slot="searchCondition" :searchAreaColumn="24">
          <Input
            placeholder="姓名"
            class="search-input mr5"
            v-model="searchRowData.realName"
            style="width: 100px"
            clearable
          />
          <Input
            placeholder="手机号码"
            class="search-input mr5"
            v-model="searchRowData.phone"
            style="width: 100px"
            clearable
          />
          <Input
            placeholder="身份证号码"
            class="search-input mr5"
            v-model="searchRowData.idcardNo"
            style="width: 150px"
            clearable
          />
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="startTimeChange"
            type="datetime"
            placeholder="申请时间起"
            class="search-input ml20"
            v-model="searchRowData.beginCreateAt"
            style="width: 160px"
          />
          <i> - </i>
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="endTimeChange"
            type="datetime"
            placeholder="申请时间止"
            class="search-input mr20"
            v-model="searchRowData.endCreateAt"
            style="width: 160px"
          />
          <Select
            class="search-col"
            placeholder="审核状态"
            v-model="searchRowData.auditStatus"
            style="width:100px"
            clearable
          >
            <Option
              class="ml15 mt10"
              v-for="item in userStatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn ml5 mr5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button
            v-waves
            @click="handleClear"
            class="search-btn"
            type="info"
            :loading="clearSearchLoading"
          >
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-sizer
            show-total
          ></Page>
        </Row>
      </div>
    </Card>

    <!--查看菜单 -->
    <Modal v-model="modalView">
      <p slot="header">
        <span>鲜果师申请详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{masterDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="4">姓名:</i-col>
              <i-col span="20">{{masterDetail.realName}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{masterDetail.phone}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">身份证号码:</i-col>
              <i-col span="16">{{masterDetail.idcardNo}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">申请时间:</i-col>
              <i-col span="16">{{masterDetail.createTime}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="4">身份证正面照: </i-col>
            <i-col span="20">
              <img :src="masterDetail.idcardFront" style="width: 200px;height: auto">
            </i-col>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="4">身份证反面照: </i-col>
            <i-col span="20">
              <img :src="masterDetail.idcardReverse" style="width: 200px;height: auto">
            </i-col>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="4">资质证明: </i-col>
            <i-col span="20">
              <img :src="masterDetail.credentials" style="width: 200px;height: auto">
            </i-col>
          </i-col>
        </Row>
        <Divider orientation="center">审核信息</Divider>
        <Row v-if="tempModalType === modalType.view">
          <Row type="flex" :gutter="8" align="middle" class="mb10">
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle">
                <i-col span="8">审核状态:</i-col>
                <i-col span="16">{{auditStatusComputed}}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle">
                <i-col span="8">审核时间:</i-col>
                <i-col span="16">{{masterDetail.auditTime}}</i-col>
              </Row>
            </i-col>
          </Row>
          <Row type="flex" :gutter="8" align="middle" class="mb10">
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle">
                <i-col span="8">审核人:</i-col>
                <i-col span="16">{{masterDetail.auditUser}}</i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle">
                <i-col span="8">审核备注:</i-col>
                <i-col span="16">{{masterDetail.failureReason}}</i-col>
              </Row>
            </i-col>
          </Row>
        </Row>
        <Form
          ref="modalEdit"
          :model="masterDetail"
          :rules="ruleInline"
          :label-width="80"
          v-if="tempModalType === modalType.edit"
        >
          <FormItem label="审核状态:" prop>
            <Select
              class="search-col"
              placeholder="审核状态"
              v-model="masterDetail.auditStatus"
              style="width:100px"
              clearable
            >
              <Option
                class="ml15 mt10"
                v-for="item in userStatus"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="审核人:">
            <i-col>{{masterDetail.auditUser}}</i-col>
          </FormItem>
          <FormItem label="审核备注:" prop="failureReason">
            <Input type="textarea" v-model="masterDetail.failureReason"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" v-if="tempModalType === modalType.edit">
        <Button type="primary" @click="handleAuditUser('modalEdit')" :loading="auditUserLoading">审核</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getFruitDoctorsQualificationsPages, editFruitDoctorsQualification } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const masterDetail = {
  id: 1,
  idcardNo: '',
  phone: '',
  verificationCode: null,
  idcardFront: '',
  idcardReverse: '',
  credentials: '',
  failureReason: null,
  auditStatus: '',
  createTime: null,
  realName: '',
  auditTime: null,
  auditUser: null,
  userId: null,
  refereeId: null,
  beginCreateAt: null,
  endCreateAt: null
};

const roleRowData = {
  auditStatus: null,
  beginCreateAt: '',
  endCreateAt: '',
  idcardNo: '',
  page: 1,
  phone: '',
  realName: '',
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin],
  computed: {
    auditStatusComputed() {
      if (this.masterDetail.auditStatus === 'UNAUDITED') {
        return '待审核';
      } else if (this.masterDetail.auditStatus === 'AGREE') {
        return '审核通过';
      } else if (this.masterDetail.auditStatus === 'REJECT') {
        return '审核不通过';
      } else {
        return this.masterDetail.auditStatus;
      };
    }
  },
  data() {
    return {
      ruleInline: {},
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          width: 80,
          fixed: 'left'
        },
        {
          title: '姓名',
          width: 150,
          key: 'realName'
        },
        {
          title: '手机号码',
          width: 150,
          key: 'phone'
        },
        {
          title: '身份证号码',
          width: 200,
          key: 'idcardNo'
        },
        {
          title: '审核状态',
          width: 150,
          key: 'auditStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.auditStatus === 'UNAUDITED') {
              return <div><tag color="primary">{'待审核'}</tag></div>;
            } else if (row.auditStatus === 'AGREE') {
              return <div><tag color="success">{'审核通过'}</tag></div>;
            } else if (row.auditStatus === 'REJECT') {
              return <div><tag color="error">{'审核不通过'}</tag></div>;
            } else {
              return <div>{row.auditStatus}</div>;
            };
          }
        },
        {
          title: '申请时间',
          key: 'createTime',
          width: 160,
          sortable: true
        },
        {
          title: '审核时间',
          key: 'auditTime',
          minWidth: 160,
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          fixed: 'right',
          options: ['view', 'auditor']
        }
      ],
      auditUserLoading: false,
      masterDetail: this._.cloneDeep(masterDetail),
      searchRowData: _.cloneDeep(roleRowData),
      // 审核状态（UNAUDITED 待审核 AGREE 审核通过 REJECT 审核不通过）
      userStatus: [
        {
          label: '待审核',
          value: 'UNAUDITED'
        },
        {
          label: '审核通过',
          value: 'AGREE'
        },
        {
          label: '审核不通过',
          value: 'REJECT'
        }]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    startTimeChange(value, date) {
      this.searchRowData.beginCreateAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endCreateAt = value;
    },
    handleAuditUser(name) {
      // if (this.masterDetail.auditStatus !== 'AGREE') {
      //   if (!this.masterDetail.failureReason ||this.masterDetail.failureReason === '') {
      //     this.$Message.warning("请填写审核备注")
      //     return
      //   };
      // };
      this.auditUserLoading = true;
      editFruitDoctorsQualification({
        userId: this.masterDetail.userId,
        id: this.masterDetail.id,
        auditStatus: this.masterDetail.auditStatus,
        failureReason: this.masterDetail.failureReason,
        realName: this.masterDetail.realName,
        phone: this.masterDetail.phone,
        refereeId: this.masterDetail.refereeId
      }).then(res => {
        this.getTableData();
      }).finally(res => {
        this.modalView = false;
        this.auditUserLoading = false;
      });
    },
    onAuditor(params) {
      this.tempModalType = this.modalType.edit;
      this.masterDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.masterDetail = params.row;
      this.modalView = true;
    },
    getTableData() {
      getFruitDoctorsQualificationsPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.clearSearchLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
