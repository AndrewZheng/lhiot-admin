<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-edit="handleEdit"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
              @on-delete="handleDelete"
      >
        <div slot="searchCondition">
          <Row>
            <Input placeholder="商品名称" class="search-input mr5" v-model="searchRowData.name" style="width: auto"/>
            <Input placeholder="商品条码" class="search-input mr5" v-model="searchRowData.barcode" style="width: auto"/>
            <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary" :loading="searchLoading">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren">
            <Icon type="md-add"/>
            关联商品
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
          <Page :total="total" :current.sync="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalEdit"
      :mask-closable="false"
      :width="700"
    >
      <p slot="header">
        <span>{{tempModalType === modalType.create?'关联商品':'修改关联商品'}}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="goodsDetail" :rules="ruleInline">
          <Row>
            <Col span="12">
              <FormItem label="上架商品:" prop="shelfId">
                <Select
                  v-if="tempModalType===modalType.create"
                  ref="shelfSpecificationSelect"
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="shelfSpecificationLoading"
                  style="width: 250px"
                >
                  <Option @click.native="selectIndex(option)" class="pb5 pt5 pl15"
                          v-for="(option, index) in optionsShelfSpecification"
                          :value="option.id" :key="index">
                    {{option.specificationInfo}}
                  </Option>
                </Select>
                <Input v-else v-model="goodsDetail.specificationInfo" disabled style="width: 250px"/>
              </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品价格:" >
              <i-col>{{goodsDetail.originalPrice|fenToYuanDot2Filters}}</i-col>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="尝鲜价格:" prop="activityPrice">
              <InputNumber
                :min="0"
                v-model="goodsDetail.activityPrice"
                @on-change="activityPriceOnchange"
                style="width: 150px"
              ></InputNumber>

            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品排序:" prop="sort">
              <InputNumber :min="1" v-model="goodsDetail.sort" style="width: 150px"/>
            </FormItem>
            </Col>
          </Row>
          <Checkbox v-if="tempModalType === modalType.create"
            v-model="goodsDetail.relationSection"
            :true-value="YNEnum.YES"
            :false-value="YNEnum.NO"
          >
            将改商品同步至新品尝鲜板块</Checkbox>
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
  import {
    getActivityProductsPages,
    deleteActivityProduct,
    getProductShelvesPages,
    addActivityProduct,
    editActivityProduct} from '@/api/fruitermaster';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import {fenToYuanDot2} from '@/libs/util';
  import {YNEnum} from '@/libs/enumerate';

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

  const goodsDetail = {
    shelfId: null,
    activityPrice: null,
    sort: null,
    specification: '',
    barcode: '',
    price: null,
    originalPrice: null,
    relationSection: YNEnum.YES
  };

  const roleRowData = {
    barcode: '',
    name: '',
    page: 1,
    rows: 10
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
        YNEnum,
        relationSection: true,
        value9: 1,
        ruleInline: {
          shelfId: [{required: true, message: '请填写上架商品ID'}],
          activityPrice: [{required: true, message: '请填写尝鲜价'}],
          sort: [{required: true, message: '请填写排序'}]
        },
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '上架图片',
            sortable: true,
            width: 180,
            render: (h, params, vm) => {
              let {row} = params;
              const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
              return <div>{str}</div>;
            }
          },
          {
            title: '上架名称',
            key: 'name',
            width: 150
          },
          {
            title: '上架规格',
            width: 150,
            key: 'name'
          },
          {
            title: '规格条码',
            width: 150,
            key: 'barcode'
          },
          {
            title: '商品原价',
            width: 150,
            render(h, params, vm) {
              let amount = fenToYuanDot2(params.row.originalPrice);
              return <div>{amount}</div>;
            }
          },
          {
            title: '尝鲜价',
            width: 180,
            render(h, params, vm) {
              let amount = fenToYuanDot2(params.row.activityPrice);
              return <div>{amount}</div>;
            }
          },
          {
            title: '排序',
            width: 150,
            key: 'sort',
            sortable: true
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit']
          }
        ],
        modalViewLoading: false,
        shelfSpecificationLoading: false,
        optionsShelfSpecification: [],
        searchRowData: this._.clone(roleRowData),
        fruitMasterDetail: fruitMasterDetail,
        goodsDetail: this._.clone(goodsDetail)
      };
    },
    mixins: [tableMixin, searchMixin, deleteMixin],
    methods: {
      activityPriceOnchange(value) {

      },
      selectIndex(options) {
        this.goodsDetail.shelfId = options.id;
        this.goodsDetail.originalPrice = options.originalPrice;
      },
      remoteMethod(query) {
        if (query !== '') {
          this.handleSearchAutoComplete(query);
        } else {
          this.optionsShelfSpecification = [];
        }
      },
      handleSearchAutoComplete(value) {
        this.shelfSpecificationLoading = true;
        getProductShelvesPages({
          keyword: value + '',
          page: '1',
          rows: '5',
          shelfStatus: 'ON'
        }).then(res => {
          if (res.array.length > 0) {
            this.optionsShelfSpecification.length = 0;
            this.optionsShelfSpecification = this.optionsShelfSpecification.concat(res.array);
          };
          console.log(this.optionsShelfSpecification);
          this.shelfSpecificationLoading = false;
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              // 添加状态
              this.createTableRow();
            } else if (this.tempModalType === this.modalType.edit) {
              // 编辑状态
              this.editTableRow();
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        });
      },
      createTableRow() {
        this.modalViewLoading = true;
        this.loading =true;
        addActivityProduct(this.goodsDetail).then(res => {
          this.$Message.success('创建成功!');
          this.getTableData();
          this.resetKeyWord();
        }).finally(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
      },
      editTableRow() {
        this.modalViewLoading = true;
        editActivityProduct(this.goodsDetail).then(res => {
          this.getTableData();
        }).finally(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
      },
      deleteTable(ids) {
        this.loading = true;
        deleteActivityProduct({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
            if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
              this.searchRowData.page -= 1;
            }
            this.tableDataSelected = [];
            this.getTableData();
          }
        ).catch(err => {
          this.loading = false;
        });
      },
      resetSearchRowData() {
        this.clearSearchLoading = true;
        this.searchRowData = this._.cloneDeep(roleRowData);
        this.getTableData();
      },
      addChildren() {
        if (this.tempModalType !== this.modalType.create) {
          this.tempModalType = this.modalType.create;
          this.goodsDetail = this._.cloneDeep(goodsDetail);
        };
        this.modalEdit = true;
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;
        this.goodsDetail = this._.clone(params.row);
        this.modalEdit = true;
      },
      getTableData() {
        getActivityProductsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
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

</style>
