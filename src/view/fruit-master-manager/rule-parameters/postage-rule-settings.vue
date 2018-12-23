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
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-delete="handleDelete"
        @on-copy="onCopy"
        :searchAreaColumn="18"
        :operateAreaColumn="6"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <InputNumber
              :min="0"
              placeholder="最小金额"
              class="search-input"
              v-model="searchRowData.minOrderAmount"
              style="width: 100px"
            />
            <i class>-</i>
            <InputNumber
              :min="0"
              placeholder="最大金额"
              class="search-input mr20"
              v-model="searchRowData.maxOrderAmount"
              style="width: 100px"
            />
            <Select
              v-model="searchRowData.deliveryAtType"
              class="search-col mr5"
              placeholder="配送时间段"
              style="width: 150px"
              clearable
            >
              <Option
                v-for="item in deliveryAtTypeList"
                :value="item.value"
                class="ptb2-5"
                :key="`search-col-${item.value}`"
              >{{item.label}}</Option>
            </Select>
            <Button
              v-waves
              @click="handleSearch"
              class="search-btn mr5"
              type="primary"
              :loading="searchLoading"
            >
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button
              v-waves
              @click="handleClear"
              class="search-btn"
              type="info"
              :loading="clearSearchLoading"
            >
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren">
            <Icon type="md-add"/>创建
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>删除
            </Button>
          </Poptip>
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

    <Modal v-model="modalEdit" :width="900">
      <p slot="header">
        <span>运费模板</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="postageDetail" :rules="ruleInline">
          <Row span="24">
            <Col span="6">
              <FormItem label="金额范围:" :label-width="100" prop="minOrderAmount">
                <InputNumber
                  :readonly="modalTypeComputed"
                  :min="0"
                  placeholder="最小金额"
                  class="search-input"
                  v-model="postageDetail.minOrderAmount"
                  style="width: 100px"
                />
              </FormItem>
            </Col>
            <Col span="16">
              <FormItem label="——" prop="maxOrderAmount">
                <InputNumber
                  :readonly="modalTypeComputed"
                  :min="0"
                  placeholder="最大金额"
                  class="search-input"
                  v-model="postageDetail.maxOrderAmount"
                  style="width: 100px"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="配送时间段:" :label-width="100" prop="deliveryAtType">
              <RadioGroup v-model="postageDetail.deliveryAtType" :readonly="modalTypeComputed">
                <Radio
                  :label="item.value"
                  v-for="item in deliveryAtTypeEnum"
                  :disabled="modalTypeComputed"
                >
                  <span>{{item.label}}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Row>
          <Row>
            <FormItem prop="detailList">
              <tables
                border
                :columns="tableColumnComputed"
                v-model="postageDetail.detailList"
                @on-delete="postageRuleTableHandleDelete"
              ></tables>
            </FormItem>
          </Row>
          <Row class="mt15">
            <Button v-waves type="success" class="mr5" @click="addPostageRuleTableColumns">
              <Icon type="md-add"/>添加
            </Button>
          </Row>
        </Form>
      </div>
      <div
        slot="footer"
        v-if="tempModalType === modalType.create || tempModalType === modalType.edit"
      >
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getDeliveryFeeRulePages, createDeliveryFeeRule, deleteDeliveryFeeRule, editDeliveryFeeRule } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import { deliveryAtTypeConvert } from '@/libs/converStatus';
import { deliveryAtTypeEnum, updateWay } from '@/libs/enumerate';

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
const postageDetail = {
  minOrderAmount: null,
  maxOrderAmount: null,
  deliveryAtType: null,
  createBy: '',
  deleteIds: [],
  detailList: []
};
const detailList = {
  minDistance: 0,
  maxDistance: 3,
  firstWeight: 3,
  firstFee: 500,
  additionalWeight: 5,
  additionalFee: 5,
  updateWay: updateWay.INSERT
};
const roleRowData = {
  minOrderAmount: null,
  maxOrderAmount: null,
  deliveryAtType: null,
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
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ruleInline: {
        minOrderAmount: [{ required: true, message: '请填写最小金额', type: 'number' }],
        maxOrderAmount: [{ required: true, message: '请填写最大金额', type: 'number' }],
        deliveryAtType: [{ required: true, message: '请选择时间段' }],
        detailList: [{ required: true, message: '请添加运费信息' },
        {
          validator(rule, value, callback, source, options) {
            console.log(value);
            let errors = [];
            if (!value || value.length === 0) {
              callback('请至少添加一条运费信息');
            }
            callback(errors);
          }
        }
        ]
      },
      deliveryAtTypeList: deliveryAtTypeEnum,
      deliveryAtTypeEnum,
      postageRuleTableColumns: [
        {
          title: '距离范围（Km）',
          minWidth: 150,
          render: (h, params, vm) => {
            return h('div', [
              h('Select', {
                props: {
                  value: params.row.minDistance == 0 ? '0-3' : '3-5',
                  readonly: this.modalTypeComputed
                },
                on: {
                  'on-change': e => {
                    console.log(vm);
                    if (e == '0-3') {
                      this.postageDetail.detailList[params.row.initRowIndex].minDistance = 0;
                      this.postageDetail.detailList[params.row.initRowIndex].maxDistance = 3;
                    } else if (e == '3-5') {
                      this.postageDetail.detailList[params.row.initRowIndex].minDistance = 3;
                      this.postageDetail.detailList[params.row.initRowIndex].maxDistance = 5;
                    };
                  }
                }
              },
                [
                  h('Option', {
                    props: {
                      value: '0-3'
                    }
                  }, '0-3Km'),
                  h('Option', {
                    props: {
                      value: '3-5'
                    }
                  }, '3-5Km')
                ]
              )
            ]);
          }
        },
        {
          title: '首重（Kg）',
          key: 'updateAt',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.firstWeight,
                  readonly: this.modalTypeComputed,
                  min: 0
                },
                on: {
                  'on-change': e => {
                    if (!e) {
                      e = 0;
                    };
                    this.postageDetail.detailList[params.row.initRowIndex].firstWeight = e;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '费用（元）',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.firstFee,
                  readonly: this.modalTypeComputed,
                  min: 0
                },
                on: {
                  'on-change': e => {
                    if (!e) {
                      e = 0;
                    };
                    this.postageDetail.detailList[params.row.initRowIndex].firstFee = e;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '续重（Kg）',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.additionalWeight,
                  readonly: this.modalTypeComputed,
                  min: 0
                },
                on: {
                  'on-change': e => {
                    if (!e) {
                      e = 0;
                    };
                    this.postageDetail.detailList[params.row.initRowIndex].additionalWeight = e;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '续费（元）',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.additionalFee,
                  readonly: this.modalTypeComputed,
                  min: 0
                },
                on: {
                  'on-change': e => {
                    if (!e) {
                      e = 0;
                    };
                    this.postageDetail.detailList[params.row.initRowIndex].additionalFee = e;
                  }
                }
              })
            ]);
          }
        }
      ],
      columns: [
        {
          type: 'selection',
          key: '',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '金额范围',
          key: 'id',
          minWidth: 180,
          render(h, params) {
            return <div>{params.row.minOrderAmount + ' - ' + params.row.maxOrderAmount}</div>;
          }
        },
        {
          title: '配送时间',
          key: 'deliveryAtType',
          minWidth: 150,
          render(h, params) {
            return <div>{deliveryAtTypeConvert(params.row.deliveryAtType).label}</div>;
          }
        },
        {
          title: '更新时间',
          key: 'updateAt',
          minWidth: 150
        },
        {
          title: '创建人',
          key: 'createBy',
          minWidth: 150
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['view', 'edit', 'delete', 'copy']
        }
      ],
      options: [
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['delete']
        }
      ],
      modalViewLoading: false,
      tempDetailList: [],
      searchRowData: this._.cloneDeep(roleRowData),
      fruitMasterDetail: fruitMasterDetail,
      postageDetail: this._.cloneDeep(postageDetail)
    };
  },
  computed: {
    modalTypeComputed() {
      return this.tempModalType === this.modalType.view;
    },
    tableColumnComputed() {
      if (this.modalTypeComputed) {
        return this.postageRuleTableColumns;
      } else {
        console.log(this.postageRuleTableColumns.concat(this.options)); ;
        return this.postageRuleTableColumns.concat(this.options);
      };
    }
  },
  methods: {
    onCopy(params) {
      console.log(params);
      params.row.detailList.forEach(item => {
        item.updateWay = updateWay.INSERT;
      });
      this.postageDetail = params.row;
      this.createTableRow();
    },
    deleteTable(ids) {
      this.loading = true;
      deleteDeliveryFeeRule({
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
      this.loading = true;
      createDeliveryFeeRule(this.postageDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      this.loading = true;
      editDeliveryFeeRule(this.postageDetail).then(res => {
        this.getTableData();
      }).finally(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addPostageRuleTableColumns() {
      let obj = this._.cloneDeep(detailList);
      obj.deliveryFeeRuleId = this.postageDetail.id;
      this.postageDetail.detailList.push(obj);
    },
    postageRuleTableHandleDelete(params) {
      if (this.tempModalType === this.modalType.create) {
        this.postageDetail.detailList = params.tableData.filter((item, index) => index !== params.row.initRowIndex);
      } else {
        let index = this.tempDetailList.findIndex(item => {
          return item.id === params.row.id;
        });
        if (index > -1) {
          if (!this.postageDetail.deleteIds) {
            this.postageDetail.deleteIds = [];
          };
          this.postageDetail.deleteIds.push(params.row.id);
        }
        this.postageDetail.detailList = params.tableData.filter((item, index) => index !== params.row.initRowIndex);
      };
    },
    addChildren() {
      this.tempModalType = this.modalType.create;
      this.postageDetail.detailList.length = 0;
      this.postageDetail.detailList.push(this._.cloneDeep(detailList));
      this.modalEdit = true;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.postageDetail = this._.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.postageDetail = this._.cloneDeep(params.row);
      this.tempDetailList.length = 0;
      this.tempDetailList = this.postageDetail.detailList;
      this.modalEdit = true;
    },
    getTableData() {
      getDeliveryFeeRulePages(this.searchRowData).then(res => {
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
