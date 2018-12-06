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
        :search-area-column="18"
        :operate-area-column="6"
        @on-view="handleView"
        @on-usable="handleUsable"
      >
        <div slot="searchCondition">
          <Input
            placeholder="姓名"
            class="search-input mr5"
            v-model="searchRowData.name"
            style="width: 100px"
          />
          <Input
            placeholder="手机号码"
            class="search-input mr5"
            v-model="searchRowData.phoneNumber"
            style="width: 100px"
          />
          <Input
            placeholder="身份证号码"
            class="search-input mr5"
            v-model="searchRowData.idCard"
            style="width: 150px"
          />
          <DatePicker
            type="datetime"
            placeholder="注册时间起"
            class="search-input ml20 mr5"
            v-model="searchRowData.timeStart"
            style="width: 160px"
          />
          <DatePicker
            type="datetime"
            placeholder="注册时间止"
            class="search-input mr5"
            v-model="searchRowData.timeEnd"
            style="width: 160px"
          />
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
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
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{userDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">昵称:</i-col>
              <i-col span="20">{{userDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">openid:</i-col>
              <i-col span="16">{{userDetail.openid}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">unionid:</i-col>
              <i-col span="18">{{userDetail.unionid}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">性别:</i-col>
              <i-col span="14">{{userDetail.level}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">年龄:</i-col>
              <i-col span="20">{{userDetail.status}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">余额:</i-col>
              <i-col span="20">{{userDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">积分:</i-col>
              <i-col span="20">{{userDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">账号状态:</i-col>
              <i-col span="16">{{userDetail.headStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">注册时间:</i-col>
              <i-col span="16">{{userDetail.headStatus}}</i-col>
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
import { getFruitMasterUserData } from '@/api/fruitermaster';

const userDetail = {
  id: '',
  name: 0,
  phoneNumber: '',
  inviteCode: '',
  level: '',
  status: '',
  headStatus: '',
  cash: ''
};
const roleRowData = {
  name: '',
  phoneNumber: '',
  idCard: '',
  timeStart: '',
  timeEnd: '',
  status: ''
};
export default {
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: 'id',
          key: 'id',
          sortable: true,
          width: 150,
          fixed: 'left'
        },
        {
          title: '昵称',
          width: 150,
          key: 'name'
        },
        {
          title: '手机号码',
          width: 120,
          key: 'phoneNumber'
        },
        {
          title: 'openid',
          width: 185,
          key: 'openid'
        },
        {
          title: 'unionid',
          width: 185,
          key: 'unionid'
        },
        {
          title: '余额',
          width: 100,
          key: 'cash'
        },
        {
          title: '积分',
          width: 80,
          key: 'bonus',
          sortable: true
        },
        {
          title: '账号状态',
          width: 90,
          key: 'status'
        },
        {
          title: '注册时间',
          width: 120,
          key: 'registerTime',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'usable']
        }
      ],
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: true,
      modalView: false,
      image: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
      userDetail: userDetail,
      searchRowData: roleRowData
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleUsable(params) {
      this.tableData[params.index].userStatus = !this.tableData[params.index]
        .userStatus;
    },
    handleClose() {
      this.modalView = false;
    },
    handleView(params) {
      this.userDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {},
    handleSearch() {},
    changePage(page) {
      this.page = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      console.log(pageSize);
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      getFruitMasterUserData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
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
