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
        :searchAreaColumn="20"
        :operateAreaColumn="4"
        @on-edit="handleEdit"
        @on-view="handleView"
      >
        <div slot="searchCondition">
          <Input
            placeholder="申请人"
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
            placeholder="银行卡号"
            class="search-input mr5"
            v-model="searchRowData.idCard"
            style="width: 150px"
            clearable
          />
          <Select
            class="search-col mr10"
            placeholder="结算状态"
            v-model="searchRowData.settlementStatus"
            style="width:150px"
            clearable
          >
            <Option
              class="ptb2-5"
              v-for="item in userStatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <DatePicker
            v-model="searchRowData.createAt"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="startTimeChange"
            type="datetime"
            placeholder="申请时间起"
            class="search-input mr5"
            style="width: 150px"
          />
          <i>-</i>
          <DatePicker
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="endTimeChange"
            type="datetime"
            placeholder="申请时间止"
            class="search-input mr5"
            v-model="searchRowData.endCreateAt"
            style="width: 150px"
          />
          <Button
            v-waves
            @click="handleSearch"
            class="search-btn mr5"
            type="primary"
            :loading="searchLoading"
          >
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
        <div slot="operations">
           <!-- 多类型导出 -->
           <BookTypeOption v-model="exportType" class="mr5"/>
           <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{salaryDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请人:</i-col>
              <i-col span="16">{{salaryDetail.realName}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{salaryDetail.phone}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">提取金额:</i-col>
              <i-col span="16">{{salaryDetail.amount|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">银行卡号:</i-col>
              <i-col span="16">{{salaryDetail.cardNo}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">结算状态:</i-col>
              <i-col span="16">{{salaryDetail.settlementStatus|settlementStatusFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请时间:</i-col>
              <i-col span="16">{{salaryDetail.createAt}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">处理时间:</i-col>
              <i-col span="16">{{salaryDetail.dealAt}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">开户行:</i-col>
              <i-col span="16">{{salaryDetail.bankDeposit}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">持卡人姓名:</i-col>
              <i-col span="16">{{salaryDetail.cardUsername}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="modalEdit">
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{salaryDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请人:</i-col>
              <i-col span="16">{{salaryDetail.realName}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{salaryDetail.phone}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">提取金额:</i-col>
              <i-col span="16">{{salaryDetail.amount|fenToYuanDot2Filters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">银行卡号:</i-col>
              <i-col span="16">{{salaryDetail.cardNo}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">结算状态:</i-col>
              <Select
                span="16"
                class="search-col mr5"
                placeholder="结算状态"
                v-model="salaryDetail.settlementStatus"
                style="width:150px"
                clearable
              >
                <Option
                  class="ptb2-5"
                  v-for="item in editStatus"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请时间:</i-col>
              <i-col span="16">{{salaryDetail.createAt}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">处理时间:</i-col>
              <i-col span="16">{{salaryDetail.dealAt}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">开户行:</i-col>
              <i-col span="16">{{salaryDetail.bankDeposit}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">持卡人姓名:</i-col>
              <i-col span="16">{{salaryDetail.cardUsername}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getFruitDoctorsSettlementPagesPages, editFruitDoctorsSettlement } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { settlementStatusConvert } from '@/libs/converStatus';
import { settlementStatusEnum, settlementStatus } from '@/libs/enumerate';
import {fenToYuanDot2} from '../../../libs/util';
import BookTypeOption from '_c/book-type-option';

const salaryDetail = {
  doctorId: 0,
  createAt: '',
  amount: 0,
  cardNo: '',
  settlementStatus: null,
  phone: '',
  dealAt: null,
  beginCreateAt: null,
  endCreateAt: null,
  realName: '',
  dealAt: '',
  bankDeposit: '',
  cardUsername: ''
};

const roleRowData = {
  amount: null,
  beginCreateAt: '',
  endCreateAt: '',
  createAt: '',
  dealAt: '',
  page: 1,
  realName: '',
  rows: 10,
  settlementStatus: null
};

export default {
  components: {
    Tables,
    BookTypeOption
  },
  mixins: [tableMixin, searchMixin],
  created() {
    this.getTableData();
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          width: 80,
          fixed: 'left'
        },
        {
          title: '申请人',
          key: 'realName',
          width: 150
        },
        {
          title: '手机号',
          width: 150,
          key: 'phone'
        },
        {
          title: '提取金额',
          width: 150,
          key: 'amount',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{fenToYuanDot2(row.amount)}</div>;
          }
        },
        {
          title: '结算状态',
          width: 150,
          key: 'settlementStatus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{settlementStatusConvert(row.settlementStatus).label}</div>;
          }
        },
        {
          title: '银行卡号',
          width: 180,
          key: 'cardNo',
          sortable: true
        },
        {
          title: '申请时间',
          width: 110,
          key: 'createAt',
          sortable: true
        }, {
          title: '处理时间',
          width: 110,
          key: 'dealAt',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          fixed: 'right',
          options: ['view', 'edit']
        }
      ],
      userStatus: settlementStatusEnum,
      editStatus: [
        { value: 'UNSETTLED', label: '未结算' },
        { value: 'SUCCESS', label: '已结算' }
      ],
      modalViewLoading: false,
      searchRowData: this._.cloneDeep(roleRowData),
      salaryDetail: this._.cloneDeep(salaryDetail),
      exportType: 'xlsx',
      downloadLoading: false
    };
  },
  methods: {
    startTimeChange(value, date) {
      this.searchRowData.createAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endCreateAt = value;
    },
    handleSubmit() {
      if (!this.salaryDetail.settlementStatus) {
        this.$Message.warning('请选择结算状态');
        return;
      };
      this.editTableRow();
    },
    editTableRow() {
      this.modalViewLoading = true;
      editFruitDoctorsSettlement(this.salaryDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.salaryDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      if (params.row.settlementStatus === settlementStatus.EXPIRED) {
        this.$Message.warning('已过期不能修改状态');
        return;
      };
      this.salaryDetail = this._.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getFruitDoctorsSettlementPagesPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch( error => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      this.searchLoading = false;
      this.clearSearchLoading = false;
      getFruitDoctorsSettlementPagesPages(this.searchRowData).then(res => {
        let tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['id'] = item['id'] + '';
          item['amount'] = (item['amount'] /100.00).toFixed(2);
          item['settlementStatus'] = settlementStatusConvert(item['settlementStatus']).label;
          item['cardNo'] = item['cardNo'] + '';
        });
        this.$refs.tables.handleDownload({
          filename: `薪资信息-${new Date().valueOf()}`,
          data: tableData
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
