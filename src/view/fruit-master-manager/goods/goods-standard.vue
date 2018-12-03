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
              @on-delete="handleDelete"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Button v-waves @click="createStandard" class="search-btn ml5 mr5" type="primary">
            <Icon type="md-add"/>&nbsp;创建
          </Button>
          <Poptip confirm
                  placement="bottom"
                  style="width: 100px"
                  title="您确认删除选中的内容吗?"
                  @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>
              删除
            </Button>
          </Poptip>
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
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{productStandardDetail.productName}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">规格条码:</i-col>
              <i-col span="16">{{productStandardDetail.barcode}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">规格单位:</i-col>
              <i-col span="16">{{productStandardDetail.packagingUnit}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">海鼎规格数量:</i-col>
              <i-col span="16">{{productStandardDetail.specificationQty}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">是否可用:</i-col>
              <i-col span="16">{{productStandardDetail.availableStatus}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">单份商品重量:</i-col>
              <i-col span="16">{{productStandardDetail.weight}}</i-col>
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
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productStandardDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="12">
            <FormItem label="商品名称:">
              {{productStandardDetail.productName}}
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="规格条码:" prop="barcode">
              <Input v-model="productStandardDetail.barcode"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="规格单位:" prop="packagingUnit" :label-width="80">
              <Select :value="productStandardDetail.packagingUnit" @on-change="uniteChange">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in unitsList" :value="item.value"
                        :key="index">{{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="海鼎规格数量:" prop="specificationQty">
              <Input v-model="productStandardDetail.specificationQty"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否可用:" prop="packagingUnit" :label-width="80">
              <Select :value="productStandardDetail.availableStatus" @on-change="uniteChange" style="width: 100px">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in useAble" :value="item.value"
                        :key="index">{{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="单份商品重量:" prop="specificationQty">
              <Input v-model="productStandardDetail.specificationQty" style="width: 100px"></Input>
              <i-col style="display: inline-block;margin-left: 5px">kg</i-col>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {deleteProductSpecification, getProductSpecificationsPages,createProductSpecification} from '@/api/fruitermaster';
  import deleteMixin from '@/mixins/deleteMixin.js'

  const productStandardDetail = {
    id: 0,
    productName: null,
    barcode: null,
    packagingUnit: null,
    weight: 0,
    specificationQty: 0,
    limitInventory: 0,
    inventorySpecification: "NO",
    availableStatus: null,
    createAt: null,
    specification: null
  };
  const roleRowData = {
    availableStatus: "ENABLE",
    barCodes: "",
    inventorySpecification: "YES",
    beginCreateAt: "",
    endCreateAt: "",
    code: null,
    name: null,
    productId: 0,
    page: 1,
    rows: 10
  };

  export default {
    components: {
      Tables
    },
    created() {
      this.unitsList = this.$route.params.unitsList
      this.getTableData();
    },
    data() {
      return {
        mixins: [deleteMixin],
        unitsList: [],
        ruleInline: {},
        useAble: [{label: '是', value: 'ENABLE'}, {label: '否', value: 'DISABLE'}],
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '商品名称',
            key: 'productName',
            sortable: true,
            minWidth: 180,
          },
          {
            title: '规格条码',
            key: 'barcode',
            width: 150
          },
          {
            title: '规格单位',
            width: 100,
            key: 'packagingUnit'
          },
          {
            title: '是否基础规格',
            width: 120,
            key: 'inventorySpecification'
          },
          {
            title: '规格',
            width: 80,
            key: 'specification'
          },
          {
            title: '重量(kg)',
            width: 120,
            key: 'weight',
            sortable: true
          },
          {
            title: '安全库存',
            width: 120,
            key: 'limitInventory',
            sortable: true
          },
          {
            title: '操作',
            minWidth: 150,
            key: 'handle',
            options: ['delete', 'edit', 'view']
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalViewLoading: false,
        modalView: false,
        modalEdit: false,
        rowData: roleRowData,
        searchRowData: roleRowData,
        productStandardDetail: productStandardDetail,
        //选中的行
        tableDataSelected: [],
      };
    },
    methods: {
      handleDelete(params) {
        this.tableDataSelected = []
        this.tableDataSelected.push(params.row)
        this.deleteTable(params.row.id)
      },
      poptipOk() {
        if (this.tableDataSelected.length < 1) {
          this.$Message.warning('请选中要删除的行');
          return
        }
        let tempDeleteList = []
        this.tableDataSelected.filter(value => {
          tempDeleteList.push(value.id)
        })
        let strTempDelete = tempDeleteList.join(',')
        this.deleteTable(strTempDelete)
      },
      //删除
      deleteTable(ids) {
        this.loading = true
        deleteProductSpecification({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.searchRowData.pageSize)
            if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
              this.searchRowData.page -= 1
            }
            this.tableDataSelected = [];
            this.getTableData();
          }
        ).catch(err => {
          this.loading = false
        })
      },
      uniteChange(value) {
        this.productStandardDetail.packagingUnit = value
      },
      handleClose() {
        this.modalView = false;
      },
      handleView(params) {
        this.productStandardDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.productStandardDetail = params.row;
        this.modalEdit = true;
      },
      createStandard() {
        this.modalEdit = true
      },
      deleteStandard() {

      },
      changePage(page) {
        this.searchRowData.page = page;
        this.getTableData();
      },
      changePageSize(pageSize) {
        this.searchRowData.page = 1;
        this.searchRowData.rows = pageSize;
        this.getTableData();
      },
      getTableData() {
        console.log(this.$route.params.id);
        this.searchRowData.productId = this.$route.params.id
        this.productStandardDetail.productName = this.$route.params.productName
        getProductSpecificationsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      },
      onSelectionAll(selection) {
        this.tableDataSelected = selection
      },
      onSelectionChange(selection) {
        this.tableDataSelected = selection
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
