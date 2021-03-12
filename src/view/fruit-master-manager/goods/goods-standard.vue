<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Button v-waves class="search-btn ml5 mr5" type="primary" @click="handleCreateView">
            <Icon type="md-add" />&nbsp;创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />删除
            </Button>
          </Poptip>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>商品规格详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">商品名称:</i-col>
              <i-col
                v-if="productStandardDetail.product"
                span="16"
              >{{ productStandardDetail.product.name }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">规格条码:</i-col>
              <i-col span="16">{{ productStandardDetail.barcode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">规格单位:</i-col>
              <i-col span="16">{{ productStandardDetail.packagingUnit }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">海鼎规格数量:</i-col>
              <i-col span="14">{{ productStandardDetail.specificationQty }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">是否可用:</i-col>
              <i-col span="16">{{ productStandardDetail.availableStatus }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">单份商品重量:</i-col>
              <i-col span="14">{{ productStandardDetail.weight }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改商品规格':'创建商品规格' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productStandardDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="12">
              <FormItem
                v-if="productStandardDetail.product"
                label="商品名称:"
              >{{ productStandardDetail.product.name }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="规格条码:" prop="barcode">
                <Input v-model="productStandardDetail.barcode"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem :label-width="80" label="规格单位:" prop="packagingUnit">
                <Select v-model="productStandardDetail.packagingUnit" @on-change="uniteChange">
                  <Option
                    v-for="(item,index) in unitsList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label
                    }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="海鼎规格数量:" prop="specificationQty">
                <Input v-model="productStandardDetail.specificationQty"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem :label-width="80" label="是否可用:" prop="packagingUnit">
                <Select
                  :value="productStandardDetail.availableStatus"
                  style="width: 100px"
                  @on-change="useAbleUniteChange"
                >
                  <Option
                    v-for="(item,index) in useAble"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label
                    }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单份商品重量:" prop="weight">
                <Input v-model="productStandardDetail.weight" style="width: 100px"></Input>
                <i-col style="display: inline-block;margin-left: 5px">kg</i-col>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  createProductSpecification,
  deleteProductSpecification,
  getProductSpecificationsPages,
  editProductSpecification,
  productSpecificationsUnits
} from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import { getGoodsStandard } from '../../../libs/util';

const productStandardDetail = {
  id: 0,
  productName: null,
  barcode: null,
  packagingUnit: null,
  weight: 0,
  specificationQty: 0,
  limitInventory: 0,
  productId: 0,
  inventorySpecification: 'NO',
  availableStatus: null,
  createAt: null,
  specification: null
};
const roleRowData = {
  productId: 0,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      unitsList: [],
      ruleInline: {
        availableStatus: [{ required: true, message: '请选择商品分类' }],
        packagingUnit: [{ required: true, message: '请选择规格单位' }],
        barcode: [
          { required: true, message: '请输入规格条码' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        specificationQty: [
          { required: true, message: '请输入安全库存' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        weight: [
          { required: true, message: '请输入重量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
                errors.push(new Error('必须为大于0的数字'));
              }
              callback(errors);
            }
          }
        ]
      },
      useAble: [
        { label: '是', value: 'ENABLE' },
        { label: '否', value: 'DISABLE' }
      ],
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
          minWidth: 180,
          render(h, params) {
            return <div>{params.row.product.name}</div>;
          }
        },
        {
          title: '规格条码',
          key: 'barcode',
          minWidth: 100
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
          minWidth: 130,
          key: 'specificationInfo'
        },
        {
          title: '重量(kg)',
          width: 120,
          key: 'weight'
        },
        {
          title: '安全库存',
          width: 120,
          key: 'limitInventory'
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      productStandardDetail: _.cloneDeep(productStandardDetail)
    };
  },
  created() {
    // this.unitsList = this.$route.params.unitsList;
    productSpecificationsUnits().then(res => {
      res.forEach(value => {
        const map = { label: 'label', value: 'value' };
        map.value = value;
        map.label = value;
        this.unitsList.push(map);
        this.createLoading = false;
      });
      this.getTableData();
    });
  },
  methods: {
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    poptipOk() {
      if (this.tableDataSelected.length < 1) {
        this.$Message.warning('请选中要删除的行');
        return;
      }
      const tempDeleteList = [];
      this.tableDataSelected.filter(value => {
        tempDeleteList.push(value.id);
      });
      const strTempDelete = tempDeleteList.join(',');
      this.deleteTable(strTempDelete);
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductSpecification({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    uniteChange(value) {
      this.productStandardDetail.packagingUnit = value;
    },
    useAbleUniteChange(value) {
      this.productStandardDetail.availableStatus = value;
    },
    handleClose() {
      this.modalView = false;
    },
    handleEditClose() {
      this.productStandardDetail = productStandardDetail;
      this.productStandardDetail.productId = this.$route.params.id;
      this.modalEdit = false;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.productStandardDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.productStandardDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleCreateView() {
      this.$refs.modalEdit.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.productStandardDetail = this._.cloneDeep(productStandardDetail);
      }
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      // this.$refs.uploadMain.clearFileList();
      // this.uploadListMain = [];
      // this.productDetail.image = null;
    },
    createStandard() {
      this.modalViewLoading = true;
      createProductSpecification({
        productId: this.$route.params.id,
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            // 添加状态
            this.createStandard();
          } else if (this.isEdit) {
            // 编辑状态
            this.editProductSpecification();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    editProductSpecification() {
      this.modalViewLoading = true;
      editProductSpecification({
        ...this.productStandardDetail
      })
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.productStandardDetail = productStandardDetail;
          this.productStandardDetail.productId = this.$route.params.id;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
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
      const goodsStandard = getGoodsStandard();
      this.searchRowData.productId = goodsStandard.id;
      this.productStandardDetail.productId = goodsStandard.id;
      this.productStandardDetail.productName = goodsStandard.name;
      getProductSpecificationsPages(this.searchRowData)
        .then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
