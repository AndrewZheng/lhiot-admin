<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
      >
        <div slot="searchCondition">
          <Input placeholder="姓名" class="search-input" v-model="searchRowData.name" style="width: 100px"/>
          <Input placeholder="手机号码" class="search-input" v-model="searchRowData.phoneNumber" style="width: 100px"/>
          <Input placeholder="身份证号码" class="search-input" v-model="searchRowData.idCard" style="width: 100px"/>
          <Input placeholder="注册时间起" class="search-input ml20" v-model="searchRowData.timeStart" style="width: 100px"/>
          <Input placeholder="注册时间止" class="search-input mr20" v-model="searchRowData.timeEnd" style="width: 100px"/>
          <Select class="search-col" placeholder="审核状态" v-model="searchRowData.status" style="width:100px" clearable>
            <Option v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getMasterApplication} from '../../../api/fruitermaster';

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
            maxWidth: 80
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '手机号码',
            key: 'phoneNumber'
          },
          {
            title: '身份证号码',
            key: 'idCard'
          },
          {
            title: '审核状态',
            key: 'status'
          },
          {
            title: '申请时间',
            key: 'applicationTime',
            sortable: true
          },
          {
            title: '审核时间',
            key: 'checkTime',
            sortable: true
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        rowData: roleRowData,
        searchRowData: roleRowData,
        modalMenu: false,
        originMenuList: [],
        selectedIds: [],
        relationMenuList: [],
        // tab选项操作数据
        step: 'roleAdd',
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
      handleSearch() {
      },
      changePage(page) {
        console.log(page);
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
        getMasterApplication({
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.tableData = res.array;
          console.log(res.array);
          this.total = res.total;
          this.loading = false;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
