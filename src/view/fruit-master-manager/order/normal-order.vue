<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-view="handleView"
      >
        <div slot="searchCondition">
          <Row>
            <Col span="24">
              <Input placeholder="订单编码" class="search-input" v-model="searchRowData.name"/>
              <Input placeholder="用户手机号" class="search-input" v-model="searchRowData.phoneNumber"/>
              <Select class="search-col ml15" placeholder="订单类型">
                <Option v-for="item in orderType" :value="item.value" class="mb10 ml15" :key="`search-col-${item.value}`">
                  {{item.value}}
                </Option>
              </Select>
              <Select class="search-col ml15" placeholder="订单状态">
                <Option v-for="item in orderStatus" :value="item.value" class="mb10 ml15"
                        :key="`search-col-${item.value}`">{{item.value}}
                </Option>
              </Select>
              <Select class="search-col ml15" placeholder="海鼎状态">
                <Option v-for="item in haiDingStatus" :value="item.value" class="mb10 ml15"
                        :key="`search-col-${item.value}`">{{item.value}}
                </Option>
              </Select>
              <DatePicker type="datetime" placeholder="开始时间" class="mb10 ml15"></DatePicker>
              <i class="mr5 ml5">-</i>
              <DatePicker type="datetime" placeholder="结束时间" class="mb10 ml15"></DatePicker>
            </Col>
            <Col span="24">
              <Button v-waves @click="handleSearch" class="search-btn ml5" type="primary">
                <Icon type="md-search"/>&nbsp;搜索
              </Button>
              <Button v-waves @click="handleSearch" class="search-btn ml5" type="warning">
                门店调货
              </Button>
              <Button v-waves type="primary" @click="exportExcel" class="ml15">导出</Button>
            </Col>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <!--查看菜单 -->
    <Modal
      v-model="modalView"
    >
      <p slot="header">
        <span>鲜果师详情</span>
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
  import {getFruitMasterUserData} from '@/api/fruitermaster';

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
        orderType: [],
        orderStatus: [],
        haiDingStatus: [],
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
            options: ['view']
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
      handleClose() {
        this.modalView = false;
      },
      handleView(params) {
        this.userDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {

      },
      handleSearch() {
      },
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
    height: auto !important
  }

  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
