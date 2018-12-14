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
        :searchAreaColumn="22"
        :operateAreaColumn="2"

        @on-view="handleView"
        @on-usable="handleUsable"
      >
        <div slot="searchCondition">
          <Input
            placeholder="id"
            class="search-input mr5"
            v-model="searchRowData.id"
            style="width: 150px"
          />
          <Input
            placeholder="昵称"
            class="search-input mr5"
            v-model="searchRowData.nickname"
            style="width: 100px"
          />
          <Input
            placeholder="手机号码"
            class="search-input"
            v-model="searchRowData.phone"
            style="width: 100px"
          />
          <DatePicker
            type="datetime"
            placeholder="注册时间起"
            format="yyyy-MM-dd HH:mm:ss"
            class="search-input ml20 "
            v-model="searchRowData.createAtStart"
            @on-change="startTimeChange"
            style="width: 160px"
          />
          <i>-</i>
          <DatePicker
            type="datetime"
            placeholder="注册时间止"
            format="yyyy-MM-dd HH:mm:ss"
            class="search-input mr5"
            v-model="searchRowData.createAtEnd"
            style="width: 160px"
          />
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary" :loading="searchLoading">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" @click="exportExcel"><Icon type="md-cloud-upload"/> 导出</Button>
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
        <span>用户详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">ID:</i-col>
              <i-col span="16">{{userDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">昵称:</i-col>
              <i-col span="20">{{userDetail.nickname}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">openid:</i-col>
              <i-col span="16">{{userDetail.openId}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">unionid:</i-col>
              <i-col span="16">{{userDetail.unionId}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">性别:</i-col>
              <i-col span="16">{{sexComputed}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">余额:</i-col>
              <i-col span="16">{{userDetail.balance}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">积分:</i-col>
              <i-col span="16">{{userDetail.memberPoints}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">账号状态:</i-col>
              <i-col span="16">{{accountStatusComputed}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">注册时间:</i-col>
              <i-col span="16">{{userDetail.registerAt}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {getUserPages,editUser} from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const userDetail = {
  id: "",
  birthday: "",
  sex: "",
  phone: "",
  realName: null,
  nickname: "",
  email: "",
  qq: "",
  avatar: "",
  address: "",
  description: "",
  registerAt: "",
  point: 0,
  balance: null,
  openId: "",
  unionId: "",
  baseUserId: null,
  locked: "",
  applicationType: "",
  paymentPermissions: "",
  memberPoints:''
};
const roleRowData = {
  applicationType: "",
  createAtEnd: "",
  createAtStart: "",
  nickname: "",
  page: 1,
  phone: "",
  rows: 10,
};
export default {
  components: {
    Tables
  },
  computed:{
    sexComputed(){
      if (this.sex === 'MAN') {
        return '男';
      }else if (this.sex === 'WOMAN') {
        return '女';
      } else {
        return '保密'
      };
    },
    accountStatusComputed(){
      return this.locked ==='LOCK' ? '禁用' : '正常'
    }
  },
  data() {
    return {
      columns: [
        {
          title: 'id',
          key: 'id',
          sortable: true,
          minWidth: 170,
          fixed: 'left'
        },
        {
          title: '昵称',
          width: 150,
          key: 'nickname'
        },
        {
          title: '手机号码',
          width: 120,
          key: 'phone'
        },
        {
          title: 'openId',
          width: 185,
          key: 'openId'
        },
        {
          title: 'unionId',
          width: 185,
          key: 'unionId'
        },
        {
          title: '余额',
          width: 100,
          key: 'balance'
        },
        {
          title: '积分',
          width: 80,
          key: 'memberPoints',
          sortable: true
        },
        {
          title: '账号状态',
          width: 90,
          render: (h, params, vm) => {
            const {row} = params;
            const str = row.locked === 'LOCK' ? '禁用' : '正常';
            return <span>{str}</span>;
          }
        },
        {
          title: '注册时间',
          width: 110,
          key: 'registerAt',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'usable']
        }
      ],
      userDetail: _.cloneDeep(userDetail),
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  mixins:[tableMixin,searchMixin],
  created() {
    this.getTableData();
  },
  methods: {
    startTimeChange(value, date) {
      this.searchRowData.createAtStart = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.createAtEnd = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleUsable(params) {
      let lockStatus = params.row.locked === 'LOCK'?'UNLOCKED':'LOCK'
      this.loading = true
      editUser({
        id:params.row.id,
        lockStatus
      }).then(res=>{
        this.getTableData()
      })
    },
    handleView(params) {
      this.userDetail = params.row;
      this.modalView = true;
    },
    getTableData() {
      getUserPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
      }).finally( res => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
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
