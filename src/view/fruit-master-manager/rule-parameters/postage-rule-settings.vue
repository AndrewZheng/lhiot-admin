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
              :searchAreaColumn="18"
              :operateAreaColumn="6"
      >
        <div slot="searchCondition">
          <Row>
            <InputNumber :min="0" placeholder="最小金额" class="search-input" v-model="searchRowData.minOrderAmount" style="width: 100px"/>
            <i class="">-</i>
            <InputNumber :min="0" placeholder="最大金额" class="search-input mr20" v-model="searchRowData.maxOrderAmount" style="width: 100px"/>
            <Select
              v-model="searchRowData.deliveryAtType"
              class="search-col mr5" placeholder="配送时间段" style="width: 100px" >
              <Option v-for="item in deliveryAtTypeList" :value="item.value" class="ptb2-5" :key="`search-col-${item.value}`">
                {{item.label}}
              </Option>
            </Select>
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
            创建
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
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{fruitMasterDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请人:</i-col>
              <i-col span="16">{{fruitMasterDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{fruitMasterDetail.phoneNumber}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">提取金额:</i-col>
              <i-col span="16">{{fruitMasterDetail.extractingAmount}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">银行卡号:</i-col>
              <i-col span="16">{{fruitMasterDetail.creditCardNumbers}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">结算状态:</i-col>
              <i-col span="16">{{fruitMasterDetail.settlementStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请时间:</i-col>
              <i-col span="16">{{fruitMasterDetail.applicationTime}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">处理时间:</i-col>
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
      :width="900"
    >
      <p slot="header">
        <span>运费模板</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :label-width="100">
          <Row>
            <FormItem label="金额范围:">
              <InputNumber :min="0" placeholder="最小金额" class="search-input" v-model="searchRowData.minOrderAmount" style="width: 100px"/>
              <i class="">-</i>
              <InputNumber :min="0" placeholder="最大金额" class="search-input mr20" v-model="searchRowData.maxOrderAmount" style="width: 100px"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="配送时间段:">
              <RadioGroup v-model="searchRowData.deliveryAtType">
                <Radio :label="item.value" v-for="item in deliveryAtTypeEnum">
                  <span>{{item.label}}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Row>
          <Row>
            <tables
              border
              :columns="postageRuleTableColumns"
              v-model="postageDetail.detailList"
              @on-delete="postageRuleTableHandleDelete"
            ></tables>
          </Row>
          <Row class="mt15">
            <Button v-waves type="success" class="mr5" @click="addPostageRuleTableColumns">
              <Icon type="md-add"/>
              添加
            </Button>
          </Row>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getDeliveryFeeRulePages} from '@/api/fruitermaster';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import {deliveryAtTypeConvert} from '../../../libs/converStatus';
  import {deliveryAtTypeEnum} from '../../../libs/enumerate';

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
    minOrderAmount: 0,
    maxOrderAmount: 0,
    deliveryAtType: null,
    createBy: '',
    deleteIds: null,
    detailList: []
  };
  const detailList = {
    minDistance: 0,
    maxDistance: 3,
    firstWeight: 3,
    firstFee: 500,
    additionalWeight: 5,
    additionalFee: 5,
    updateWay: 'UPDATE'
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
        deliveryAtTypeList: deliveryAtTypeEnum,
        deliveryAtTypeEnum,
        postageRuleTableColumns: [
          {
            title: '距离范围（Km）',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Select', {
                  props: {
                    value: params.row.minDistance == 0 ? '0-3':'3-5'
                  },
                  on: {
                    'on-change': e => {
                      if (e == '0-3') {
                        this.postageDetail.detailList[params.row.initRowIndex].minDistance = e;
                        this.postageDetail.detailList[params.row.initRowIndex].maxDistance = e;
                      } else if (e == '3-5') {
                        this.postageDetail.detailList[params.row.initRowIndex].minDistance = e;
                        this.postageDetail.detailList[params.row.initRowIndex].maxDistance = e;
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
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.firstWeight,
                    min: 0
                  },
                  on: {
                    'on-change': e => {
                      this.postageDetail.detailList[params.row.initRowIndex].firstWeight = e;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '费用（元）',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.firstFee
                  },
                  on: {
                    'on-change': e => {
                      params.row.firstFee = e;
                      this.postageDetail.detailList[params.row.initRowIndex].firstFee = e;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '续重（Kg）',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.additionalWeight
                  },
                  on: {
                    'on-change': e => {
                      this.postageDetail.detailList[params.row.initRowIndex].additionalWeight = e;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '续费（元）',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.additionalFee
                  },
                  on: {
                    'on-change': e => {
                      this.postageDetail.detailList[params.row.initRowIndex].additionalFee = e;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '操作',
            minWidth: 80,
            key: 'handle',
            options: ['delete']
          }
        ],
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center'
          },
          {
            title: '金额范围',
            key: 'id',
            width: 180,
            render(h, params) {
              return <div>{params.row.minOrderAmount+' - '+params.row.maxOrderAmount}</div>;
            }
          },
          {
            title: '配送时间',
            key: 'deliveryAtType',
            width: 150,
            render(h, params) {
              return <div>{deliveryAtTypeConvert(params.row.deliveryAtType).label}</div>;
            }
          },
          {
            title: '更新时间',
            key: 'updateAt',
            width: 150
          },
          {
            title: '创建人',
            key: 'createBy',
            width: 150
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['view', 'edit', 'delete', 'copy']
          }
        ],
        rowData: roleRowData,
        searchRowData: this._.cloneDeep(roleRowData),
        fruitMasterDetail: fruitMasterDetail,
        postageDetail: this._.cloneDeep(postageDetail)
      };
    },
    methods: {
      addPostageRuleTableColumns() {
        this.postageDetail.detailList.push(this._.cloneDeep(detailList));
      },
      postageRuleTableHandleDelete(params) {
        this.postageDetail.detailList = params.tableData.filter((item, index) => index !== params.row.initRowIndex);
      },
      addChildren() {
        this.tempModalType = this.modalType.create;
        this.postageDetail.detailList.length = 0;
        this.postageDetail.detailList.push(this._.cloneDeep(detailList));
        this.modalEdit = true;
      },
      deleteChildren() {

      },
      onSale() {

      },
      resetSearchRowData() {
        this.clearSearchLoading = true;
        this.searchRowData = this._.cloneDeep(roleRowData);
        this.getTableData();
      },
      handleView(params) {
        this.fruitMasterDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.fruitMasterDetail = params.row;
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
