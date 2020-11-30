<template>
  <div class="m-content">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="22"
        :operate-area-column="5"
        editable
        searchable
        border
        highlight-row
        search-place="top"
        @on-delete="handleDelete"
        @on-set-vip="handleSetVip"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.phone"
            placeholder="用户电话"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.nickname"
            placeholder="用户姓名"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <!-- <Select
            v-model="searchRowData.isVip"
            class="search-col mr5"
            placeholder="是否VIP"
            style="width:80px"
            clearable
          >
            <Option
              v-for="item in isVipStatus"
              :key="item.value"
              :value="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select> -->
          <DatePicker
            v-model="searchRowData.regBeginTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间起"
            class="search-input"
            style="width: 150px"
            @on-change="beginTimeChange"
          />
          <i>-</i>
          <DatePicker
            v-model="searchRowData.regEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间止"
            class="search-input mr5"
            style="width: 150px"
            @on-change="endTimeChange"
          />
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
            class="search-btn mr5"
            type="info"
            @click="handleClear"
          >
            <Icon type="md-refresh" />&nbsp;清除
          </Button>
          <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
          </Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            :page-size="20"
            :page-size-opts="templatePageOpts"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getUserPages,
  editUser,
  deleteUser,
  auditUser,
  changeUser,
  createUser,
  getAllSalesman,
  storeAssign,
  unlockSalesman
} from '@/api/lhfarm-small';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import city from '@/assets/city/city.js';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber
} from '@/libs/util';
import { userStatusEnum, sexEnum, userTypeEnum } from '@/libs/enumerate';
import {
  userTypeConvert,
  userStatusConvert,
  sexConvert
} from '@/libs/converStatus';

const userDetail = {
  addressDetail: '',
  balance: 0,
  city: '',
  id: 0,
  inviteCode: '',
  isVip: '',
  nickname: '',
  openId: '',
  phone: '',
  profilePhoto: '',
  registerTime: '',
  salesUserId: '',
  saleUserName: '',
  salesUserStatus: '',
  sex: '',
  shopName: '',
  unionId: '',
  userName: '',
  userStatus: '',
  userType: ''
};

const roleRowData = {
  userName: '',
  phone: '',
  regBeginTime: null,
  regEndTime: null,
  salesUserId: null,
  page: 1,
  rows: 20,
  sidx: 'registerTime',
  sort: 'desc'
};

const columns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    align: 'center'
  },
  {
    title: '编号',
    align: 'center',
    key: 'id',
    width: 80
  },
  {
    title: '微信昵称',
    align: 'center',
    key: 'nickname'
  },
  {
    title: '手机号码',
    align: 'center',
    key: 'phone'
  },
  {
    title: '用户余额',
    align: 'center',
    key: 'balance',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.balance);
      return <div>{amount}</div>;
    }
  },
  {
    title: '注册时间',
    align: 'center',
    key: 'registerTime'
  },
  // {
  //   title: "是否VIP",
  //   align: "center",
  //   key: "isVip",
  //   render: (h, params, vm) => {
  //     const { row } = params;
  //     if (row.isVip === "yes") {
  //       return (
  //         <div>
  //           <tag color="gold">VIP</tag>
  //         </div>
  //       );
  //     } else if (row.isVip === "no") {
  //       return (
  //         <div>
  //           <tag color="primary">普通用户</tag>
  //         </div>
  //       );
  //     }
  //   }
  // },
  {
    title: '操作',
    align: 'center',
    key: 'handle',
    width: 240,
    options: ['setVip']
  }
];

// v1.2.0
const userDetailChange = {
  addressDetail: '',
  balance: 0,
  city: '',
  id: 0,
  inviteCode: '',
  isVip: '',
  nickname: '',
  openId: '',
  phone: '',
  profilePhoto: '',
  registerTime: '',
  salesUserId: '',
  saleUserName: '',
  salesUserStatus: '',
  sex: '',
  shopName: '',
  unionId: '',
  userName: '',
  userStatus: '',
  userType: ''
};

const userRowData = {
  nickname: '',
  phone: '',
  userType: 'sale',
  isVip: '',
  city: '',
  page: 1,
  rows: 10
};

const userColumns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    fixed: 'left',
    align: 'center'
  },
  {
    title: '编号',
    align: 'center',
    key: 'id',
    fixed: 'left',
    maxWidth: 80
  },

  {
    title: '店长姓名',
    align: 'center',
    key: 'userName'
  },
  {
    title: '手机号码',
    align: 'center',
    key: 'phone',
    minWidth: 60
  },
  {
    title: '注册时间',
    align: 'center',
    key: 'registerTime',
    minWidth: 80
  },
  {
    title: '业务员状态',
    align: 'center',
    key: 'salesUserStatus',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.salesUserStatus === 'certified') {
        return (
          <div>
            <tag color='success'>{userStatusConvert(row.salesUserStatus)}</tag>
          </div>
        );
      } else if (row.salesUserStatus === 'locking') {
        return (
          <div>
            <tag color='error'>{userStatusConvert(row.salesUserStatus)}</tag>
          </div>
        );
      } else if (row.salesUserStatus === 'unaudited') {
        return (
          <div>
            <tag color='warning'>{userStatusConvert(row.salesUserStatus)}</tag>
          </div>
        );
      }
      return <div>{userStatusConvert(row.salesUserStatus)}</div>;
    }
  },
  {
    title: '邀请码',
    align: 'center',
    key: 'inviteCode',
    maxWidth: 100
  }
];
export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ids: [],
      userData: [],
      salesManList: [],
      selectedUserIds: [],
      data: [],
      isVipStatus: [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' }
      ],
      loginName: '',
      currentSalesId: null,
      assginSalesUserId: null,
      modalUser: false,
      loadingUser: false,
      usersTotal: 0,
      templatePageOpts: [20, 50],
      userStatusEnum,
      userTypeEnum,
      sexEnum,
      userColumns,
      cityDaty: '',
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      userDetail: _.cloneDeep(userDetail),
      columns: columns,
      userDetailChange: _.cloneDeep(userDetailChange),
      searchUserRowData: _.cloneDeep(userRowData)
    };
  },
  computed: {
    sexConvertName() {
      return sexConvert(this.userDetail.sex);
    },
    userBalance() {
      return fenToYuanDot2(this.userDetail.balance);
    }
  },
  created() {
    this.data = city;
    this.getTableData();
    this.loginName = sessionStorage.getItem('loginName');
  },
  methods: {
    resetSearchUserRowData() {
      this.searchUserRowData = _.cloneDeep(userRowData);
    },
    getTableData() {
      getUserPages(this.searchRowData).then((res) => {
        for (let i = 0; i < res.rows.length; i++) {
          res.rows[i].loginName = this.loginName;
        }
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    beginTimeChange(value, date) {
      this.searchRowData.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.regEndTime = value;
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    handleSetVip(params) {
      this.userDetail = _.cloneDeep(params.row);
      if (params.row.userStatus !== 'certified') {
        this.$Message.info('该用户还未完成认证');
        return;
      }
      this.userDetail.isVip = params.row.isVip === 'yes' ? 'no' : 'yes';
      this.$Message.info('操作成功');
      this.editTableRow();
    },

    createTableRow() {
      createUser(this.userDetail)
        .then((res) => {})
        .finally((res) => {
          this.modalEditLoading = false;
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.userDetail = _.cloneDeep(userDetail);
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteUser({
        ids
      })
        .then((res) => {
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
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 导出
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      const pageSize = this.searchRowData.page;
      this.searchRowData.page = 1;
      getUserPages(this.searchRowData)
        .then((res) => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 20;
          this.searchRowData.page = pageSize;
          // 表格数据导出字段翻译
          tableData.forEach((item) => {
            item['userType'] =
              item['userType'] === 'sale' ? '业务员' : '普通用户';
            item['userStatus'] = userStatusConvert(item['userStatus']);
            item['salesUserStatus'] = userStatusConvert(
              item['salesUserStatus']
            );
            item['balance'] = (item['balance'] / 100.0).toFixed(2);
            item['addressDetail'] = item['city'] + item['addressDetail'];
          });
          const date = this.$moment(new Date()).format('YYYYMMDDHHmmss');
          this.$refs.tables.handleDownload({
            filename: `会员信息-${date}`,
            data: tableData
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
    },
    // v1.2.0
    getUserTableData() {
      getUserPages(this.searchUserRowData)
        .then((res) => {
          this.userData = res.rows;
          this.usersTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    changeUserPage(page) {
      this.searchUserRowData.page = page;
      this.getUserTableData();
    },
    changeUserPageSize(pageSize) {
      this.searchUserRowData.page = 1;
      this.searchUserRowData.rows = pageSize;
      this.getUserTableData();
    },
    handleSearch1() {
      this.searchUserRowData.page = 1;
      this.searchLoading = true;
      this.getUserTableData();
    },
    handleClear1() {
      // 重置数据
      this.resetSearchUserRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleSearch1();
    },
    onSelectionChange(selection) {
      this.selectedUserIds = selection.map((item) => item.id.toString());
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}
.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
