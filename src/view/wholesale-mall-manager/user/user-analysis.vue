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
            v-model="searchRowData.phone"
            placeholder="用户电话"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.userName"
            placeholder="用户姓名"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <!-- <Select
            v-model="searchRowData.userType"
            class="search-col mr5"
            placeholder="用户类型"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in userTypeEnum"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select> -->
          <Select
            v-model="searchRowData.userStatus"
            class="search-col mr5"
            placeholder="用户状态"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in userStatusEnum"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <!-- <Select
            v-model="searchRowData.salesUserId"
            class="search-col mr5"
            placeholder="业务员"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in salesManList"
              :value="item.id"
              :key="item.id"
              class="ptb2-5"
            >{{ item.UserName }}</Option>
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
            :searchLoading="searchLoading"
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getUserAnalysisPages,
  getAllSalesman,
  editUser,
  deleteUser,
  createUser
} from '@/api/wholesale';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
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

const userAnalysis = {
  accumulative: '',
  addressDetail: '',
  balance: '',
  city: '',
  id: 0,
  lastCreateTime: '',
  lastMonth: '',
  nickName: '',
  phone: '',
  profilePhoto: '',
  registerTime: '',
  saleUserName: '',
  sex: '',
  shopName: '',
  thisMonth: '',
  userName: '',
  userStatus: ''
};

const roleRowData = {
  userName: '',
  phone: '',
  userType: '',
  regBeginTime: null,
  regEndTime: null,
  salesUserId: '7',
  userStatus: '',
  salesUserStatus: '',
  page: 1,
  rows: 10
};

const userColumns = [
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
    minWidth: 40
  },
  {
    title: '门店名称',
    align: 'center',
    key: 'shopName',
    minWidth: 100
  },
  {
    title: '店长姓名',
    align: 'center',
    key: 'userName',
    minWidth: 60
  },
  {
    title: '手机号码',
    align: 'center',
    key: 'phone',
    minWidth: 80
  },
  {
    title: '注册时间',
    align: 'center',
    key: 'registerTime',
    minWidth: 100
  },
  // {
  //   title: "用户类型",
  //   align: "center",
  //   key: "userType",
  //   minWidth: 60,
  //   render: (h, params, vm) => {
  //     const { row } = params;
  //     if (row.userType === "consumer") {
  //       return (
  //         <div>
  //           <tag color="primary">
  //             {userTypeConvert(row.userType).label}
  //           </tag>
  //         </div>
  //       );
  //     } else if (row.userType === "sale") {
  //       return (
  //         <div>
  //           <tag color="warning">
  //             {userTypeConvert(row.userType).label}
  //           </tag>
  //         </div>
  //       );
  //     }
  //   }
  // },
  {
    title: '上月消费/频次',
    align: 'center',
    key: 'lastMonth',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return (
        <div>
          {row.lastMonth ? row.lastMonth : 'N/A'}
        </div>
      );
    }
  },
  {
    title: '本月消费/频次',
    align: 'center',
    key: 'thisMonth',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return (
        <div>
          {row.thisMonth ? row.thisMonth : 'N/A'}
        </div>
      );
    }
  },
  {
    title: '累计消费/频次',
    align: 'center',
    key: 'accumulative',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return (
        <div>
          {row.accumulative ? row.accumulative : 'N/A'}
        </div>
      );
    }
  },
  {
    title: '最近消费时间',
    align: 'center',
    key: 'lastCreateTime',
    minWidth: 100,
    render: (h, params, vm) => {
      const { row } = params;
      return (
        <div>
          {row.lastCreateTime ? row.lastCreateTime : 'N/A'}
        </div>
      );
    }
  },
  {
    title: '用户状态',
    align: 'center',
    key: 'userStatus',
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.userStatus === 'certified') {
        return (
          <div>
            <tag color='success'>
              {userStatusConvert(row.userStatus).label}
            </tag>
          </div>
        );
      } else if (row.userStatus === 'locking') {
        return (
          <div>
            <tag color='error'>
              {userStatusConvert(row.userStatus).label}
            </tag>
          </div>
        );
      } else if (row.userStatus === 'unaudited') {
        return (
          <div>
            <tag color='warning'>
              {userStatusConvert(row.userStatus).label}
            </tag>
          </div>
        );
      }
      return (
        <div>
          <tag color='primary'>
            {userStatusConvert(row.userStatus).label}
          </tag>
        </div>
      );
    }
  },
  {
    title: '所属业务员',
    align: 'center',
    key: 'saleUserName',
    minWidth: 60
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
      salesManList: [],
      userStatusEnum,
      userTypeEnum,
      sexEnum,
      modalViewLoading: false,
      clearSearchLoading: false,
      exportExcelLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      userAnalysis: _.cloneDeep(userAnalysis),
      columns: userColumns
    };
  },
  computed: {
    sexConvertName() {
      return sexConvert(this.userAnalysis.sex).label;
    },
    userBalance() {
      return fenToYuanDot2(this.userAnalysis.balance);
    }
  },
  created() {
    this.getTableData();
    this.getAllSalesman();
  },
  mounted() {},
  methods: {
    getTableData() {
      getUserAnalysisPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    getAllSalesman() {
      getAllSalesman().then(res => {
        this.salesManList = res;
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
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善商品单位信息!');
        }
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editUser(this.userAnalysis).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.getTableData();
        this.resetFields();
      });
    },
    createTableRow() {
      createUser(this.userAnalysis)
        .then(res => {})
        .finally(res => {
          this.modalEditLoading = false;
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.userAnalysis = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleAdd() {
      this.$refs.editForm.resetFields();
      this.userAnalysis = _.cloneDeep(userAnalysis);
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteUser({
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
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleDownload() {
      this.exportExcelLoading = true;
      this.searchRowData.rows = this.total > 5000 ? 5000 : this.total;
      getUserAnalysisPages(this.searchRowData)
        .then(res => {
          const tableData = res.rows;
          // 恢复正常页数
          this.searchRowData.rows = 10;
          // 表格数据导出字段翻译
          tableData.forEach(item => {
            item['userType'] =
              item['userType'] === 'sale' ? '业务员' : '普通用户';
            item['userStatus'] = userStatusConvert(item['userStatus']).label;
            item['salesUserStatus'] = userStatusConvert(
              item['salesUserStatus']
            ).label;
          });
          this.$refs.tables.handleDownload({
            filename: `会员分析信息-${new Date().valueOf()}`,
            data: tableData
          });
        })
        .finally(() => {
          this.exportExcelLoading = false;
        });
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
