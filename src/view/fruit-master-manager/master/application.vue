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
          <Input placeholder="姓名" class="search-input" v-model="searchRowData.name" style="width: 100px"/>
          <Input placeholder="手机号码" class="search-input" v-model="searchRowData.phoneNumber" style="width: 100px"/>
          <Input placeholder="身份证号码" class="search-input" v-model="searchRowData.idCard" style="width: 150px"/>
          <DatePicker type="datetime" placeholder="注册时间起" class="search-input ml20" v-model="searchRowData.timeStart" style="width: 160px"/>
          <DatePicker type="datetime" placeholder="注册时间止" class="search-input mr20" v-model="searchRowData.timeEnd" style="width: 160px"/>
          <Select class="search-col" placeholder="审核状态" v-model="searchRowData.status" style="width:100px" clearable>
            <Option class="ml15 mt10" v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn ml5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
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
              <i-col span="20">{{masterDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{masterDetail.phoneNumber}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">身份证号码:</i-col>
              <i-col span="16">{{masterDetail.unionid}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" >
              <i-col span="10">申请时间:</i-col>
              <i-col span="14">{{masterDetail.level}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
              <i-col span="4">身份证正面照:</i-col>
              <i-col span="20">
                <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 200px;height: auto"/>
              </i-col>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="4">身份证反面照:</i-col>
            <i-col span="20">
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 200px;height: auto"/>
            </i-col>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <i-col span="4">   资质证明:</i-col>
            <i-col span="20">
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 200px;height: auto"/>
            </i-col>
          </i-col>
        </Row>
        <Divider orientation="center">审核信息</Divider>
        <Row type="flex" :gutter="8" align="middle" class="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">审核状态:</i-col>
              <i-col span="16">审核未通过</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">审核时间:</i-col>
              <i-col span="16">2018-10-28</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">审核人:</i-col>
              <i-col span="16">李红</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">审核备注:</i-col>
              <i-col span="16">身份证正面信息模糊</i-col>
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
  import {getMasterApplication} from '@/api/fruitermaster';

  const masterDetail = {
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
            title: '编号',
            key: 'id',
            sortable: true,
            width: 80,
            fixed: 'left'
          },
          {
            title: '姓名',
            width: 150,
            key: 'name'
          },
          {
            title: '手机号码',
            width: 150,
            key: 'phoneNumber'
          },
          {
            title: '身份证号码',
            width: 200,
            key: 'idCard'
          },
          {
            title: '审核状态',
            width: 150,
            key: 'status'
          },
          {
            title: '申请时间',
            key: 'applicationTime',
            width: 150,
            sortable: true
          },
          {
            title: '审核时间',
            key: 'checkTime',
            minWidth: 150,
            sortable: true
          },
          {
            title: '操作',
            minWidth: 150,
            key: 'handle',
            options: ['view']
          }
        ],
        modalView:false,
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        rowData: roleRowData,
        masterDetail,
        searchRowData: roleRowData,
        userStatus: [
          {
            key: 'INITIAL',
            value: '审核通过'
          },
          {
            key: 'AVAILABLE',
            value: '审核未通过'
          },
          {
            key: 'UNAVAILABLE',
            value: '审核中'
          }]
      };
    },
    created() {
      this.getTableData();
    },
    methods: {
      handleView(params){
        this.masterDetail = params.row
        this.modalView = true
      },
      handleClose(){
        this.modalView = false
      },
      handleSearch() {
      },
      changePage(page) {
        this.page = page;
        this.getTableData();
      },
      changePageSize(pageSize) {
        this.page = 1;
        this.pageSize = pageSize;
        this.getTableData();
      },
      getTableData() {
        getMasterApplication({
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
