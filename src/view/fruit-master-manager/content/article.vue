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
              @on-edit="handleEdit"
              @on-sale="onSale"
      >
        <div slot="searchCondition">
          <Row>
            <Col span="24">
            <Input placeholder="文章标题" class="search-input" v-model="searchRowData.name" style="width: auto"/>
            <Input placeholder="关键词" class="search-input mr20" v-model="searchRowData.name" style="width: auto"/>
            <DatePicker type="datetime" placeholder="创建时间起"></DatePicker>
            <i class="mr5 ml5">-</i>
            <DatePicker type="datetime" placeholder="创建时间止"></DatePicker>

            <DatePicker type="datetime" placeholder="发布时间起" class="mr5 ml5"></DatePicker>
            <i class="mr5 ml5">-</i>
            <DatePicker type="datetime" placeholder="发布时间止"></DatePicker>
            <Button v-waves @click="handleSearch" class="search-btn ml20" type="primary">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>

            <Button v-waves type="success" class="ml5 mr5" @click="addChildren">
              <Icon type="md-add"/>
              创建
            </Button>
            <Button v-waves type="error" class="ml5 mr5" @click="deleteChildren">
              <Icon type="md-close"/>
              删除
            </Button>
            <Button v-waves type="primary" class="ml5 mr5" @click="exportExcel">
              <Icon type="md-download"/>
              导出
            </Button>
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

    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="rowData.type=='SON'?'750':'540'"
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">文章标题:</i-col>
              <i-col span="20">{{fruitMasterDetail.id}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">作者:</i-col>
              <i-col span="16">{{fruitMasterDetail.phoneNumber}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{fruitMasterDetail.creditCardNumbers}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">发布时间:</i-col>
              <i-col span="16">{{fruitMasterDetail.applicationTime}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">关键词:</i-col>
              <i-col span="16">{{fruitMasterDetail.handlingTime}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">文章内容:</i-col>
              <i-col span="16">{{fruitMasterDetail.handlingTime}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="modalEdit"
    >
      <p slot="header">
        <span>编辑文章</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">文章标题:</i-col>
              <Input span="20" style="width: 400px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">文章作者:</i-col>
              <Input span="20" style="width: 400px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">是否发布:</i-col>
              <i-col span="16">{{fruitMasterDetail.creditCardNumbers}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">文章作者:</i-col>
              <Input span="6" style="width: 100px;margin-right: 10px"/>
              <Input span="6" style="width: 100px;margin-right: 10px"/>
              <Input span="6" style="width: 100px;margin-right: 10px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row class-name="mb10" :gutter="8">
              <i-col span="8">文章内容:</i-col>
              <i-col span="16">{{fruitMasterDetail.creditCardNumbers}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getOnSaleData} from '@/api/fruitermaster';

  const fruitMasterDetail = {
    id: '',
    name: 0,
    phoneNumber: '',
    extractingAmount: '',
    settlementStatus: '',
    creditCardNumbers: '',
    headStatus: '',
    applicationTime: '',
    handlingTime: '2018-10-28'
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
    created() {
      this.getTableData();
    },
    data() {
      return {
        columns: [
          {
            title: '文章标题',
            key: 'id',
            sortable: true,
            width: 180,
            fixed: 'left'
          },
          {
            title: '关键词',
            key: 'name',
            width: 150
          },
          {
            title: '作者',
            width: 150,
            key: 'onSaleName'
          },
          {
            title: '创建时间',
            width: 150,
            key: 'onSaleRole'
          },
          {
            title: '发布状态',
            width: 150,
            key: 'roleCode'
          },
          {
            title: '发布时间',
            width: 120,
            key: 'price',
            sortable: true
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'onSale']
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        modalEdit: false,
        rowData: roleRowData,
        searchRowData: roleRowData,
        fruitMasterDetail: fruitMasterDetail
      };
    },
    methods: {
      addChildren() {
        this.modalEdit = true
      },
      deleteChildren() {

      },
      onSale() {

      },
      handleClose() {
        this.modalView = false;
      },
      handleView(params) {
        this.fruitMasterDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.fruitMasterDetail = params.row;
        this.modalEdit = true;
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
        getOnSaleData({
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

</style>
