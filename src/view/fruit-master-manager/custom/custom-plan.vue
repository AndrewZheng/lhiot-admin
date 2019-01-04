z<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              :searchAreaColumn="18"
              :operateAreaColumn="6"
              @on-view="handleView"
              @on-edit="handleEdit"
              @on-relevance="handlePeriod"
              @custom-on-sale="customOnSale"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
              @on-delete="handleDelete"
      >
        <div slot="searchCondition">
          <Row>
            <Input placeholder="定制计划名称" class="search-input mr5" v-model="searchRowData.name" style="width: auto" clearable/>
            <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary" :loading="searchLoading">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
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
          <!-- 多类型导出 -->
           <BookTypeOption v-model="exportType" class="mr5"/>
           <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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
        <span>定制计划详情</span>
      </p>
      <div class="modal-content" :model="rowData">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">定制计划名称:</i-col>
              <i-col span="14">{{rowData.name}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">定制计划描述:</i-col>
              <i-col span="14">{{rowData.description}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" class-name="mb10">
              <i-col span="6">定制计划主图:</i-col>
              <img style="width: 80px" :src="rowData.image" span="16">
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">是否上架:</i-col>
              <i-col span="14">{{rowData.status|customPlanStatusFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">上架板块:</i-col>
              <i-col span="14">
                <div v-for="(item,key) in customPlanSectionData" :key="'modalView' + key">
                  <CheckboxGroup v-model="rowData.customPlanSectionIds">
                    <Checkbox
                      ref="checkBox"
                      :label="item.id"
                      :key="item.sectionName"
                    >{{item.sectionName}}
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>

        <Tabs value="name1" type="card">
            <TabPane v-for="(period, key) in rowData.periodList" :key="'addOrEdit' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'name'+(key+1)">
                <Row type="flex" :gutter="24" align="middle" class-name="mb10">
                  <i-col span="8" v-for="specification in period.specificationList" :key="'addOrEdit' + period.index +  '--' + specification.index">
                    {{specification.description}}价: {{(specification.price/100.00).toFixed(2)}}
                  </i-col>
                </Row>
                <Row v-if="period.products" class-name="mb10">
                  <tables
                    border
                    :columns="tempColumnsView"
                    v-model="period.products"
                  ></tables>
                </Row>
            </TabPane>
        </Tabs>

      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!-- 定制计划新增和修改 -->
    <Modal
     v-model="modalEdit"
      :width="650"
    >
      <p slot="header">
        <span>{{rowData.id==''?'创建定制计划':'编辑定制计划'}}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="rowData" :rules="ruleInline" :label-width="110" v-if="showHeader">
          <FormItem label="定制计划名称:" prop="name">
            <Input placeholder="上架名称" class="search-input mr5" v-model="rowData.name" style="width: auto"/>
          </FormItem>
          <FormItem label="定制计划描述:" prop="description">
            <Input placeholder="定制计划描述" class="search-input mr5" v-model="rowData.description" style="width: auto"/>
          </FormItem>
          <FormItem label="定制计划主图:" prop="image">
            <Input v-model="rowData.image" style="width: auto" v-show="false"/>
            <div class="demo-upload-list" v-for="(item,key) in uploadListMain" :key="'modalEdit' + key">
              <template v-if="item.status === 'finished'">
                <div>
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                  </div>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <IViewUpload
              ref="uploadMain"
              :defaultList="defaultListMain"
              @on-success="handleSuccessMain"
              :imageSize="imageSize"
            >
              <div slot="content">
                <Button type="primary">
                  上传图片
                </Button>
              </div>
            </IViewUpload>
          </FormItem>
          <FormItem label="是否上架:" prop="status">
            <Select
              class="search-col mr5" v-model="rowData.status" style="width: 100px" >
              <Option v-for="item in customPlanStatusEnum" :value="item.value" class="ptb2-5" :key="`search-col-${item.value}`">
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="上架板块:" prop="customPlanSectionIds" v-if="tempModalType === modalType.create">
            <div v-for="(item,key) in customPlanSectionData" :key="'modalEdit-Section' + key">
              <CheckboxGroup v-model="rowData.customPlanSectionIds">
                <Checkbox
                  ref="checkBox"
                  :label="item.id"
                  :key="item.sectionName"
                >{{item.sectionName}}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
          <Tabs value="name1" type="card" v-if="showTab">
            <TabPane v-for="(period, key) in rowData.periodList" :key="'addOrEdit' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'name'+(key+1)">
                  <Col span="8" v-for="specification in period.specificationList" :key="'addOrEdit' + period.index +  '--' + specification.index">
                    <FormItem :label="specification.description + '价:'">
                      <InputNumber :min="0" class="search-input mr5" :value="priceComputed(specification.price)"
                      placeholder="最多两位小数"
                       @on-change="priceOnChange(period.index, specification.index, $event)"
                        style="width: 90px"/>
                    </FormItem>
                  </Col>
                  <Col span="11" v-for="product in period.products" :key="'addOrEdit' + period.index +  '-' + product.index">
                    <FormItem :label="'第'+ product.dayOfPeriod +'天:'">
                      <Select
                      filterable
                      style="width: 150px"
                      v-model="product.productName"
                      placeholder="输入上架商品名称"
                      remote
                      :remote-method ="remoteMethod"
                      :loading="shelfSpecificationLoading"
                      transfer>
                          <Option
                            v-for="(option, index) in optionsShelfSpecification"
                            :value="option.name" :key="'addOrEdit' + period.index +  '-' + product.index + '-' + index" class="pb5 pt5 pl15"
                             @click.native="updateProduct(period.index, product.index, option.id, product.id)"
                          >
                          {{option.name}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
            </TabPane>
        </Tabs>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose('modalEdit')">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>

    <!-- 定制周期管理 -->
     <Modal
      v-model="modalSetting"
      :width="650"
    >
      <p slot="header">
        <span>定制计划周期管理</span>
      </p>
      <div class="modal-content">
         <Form ref="modalSetting" :model="rowData">
          <template v-for="(customPlan, index) in rowData" v-if="index == 'periodList'" >
              <Tabs value="name1" type="card" :key="'productUpdate' + customPlan.id">
                  <TabPane v-for="(period, key) in customPlan" :key="'update' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'name'+(key+1)">
                        <Col span="7" v-for="specification in period.specificationList" :key="'update' + period.index +  '--' + specification.index">
                          <FormItem :label="specification.description + '价:'">
                          <InputNumber :min="0" class="search-input mr5" :value="priceComputed(specification.price)"
                          placeholder="最多两位小数"
                       @on-change="priceOnChange(period.index, specification.index, $event, specification.id)"
                        style="width: 90px"/>
                          </FormItem>
                        </Col>
                        <Col span="11" v-for="product in period.products" :key="'update' + period.index +  '-' + product.index">
                          <FormItem :label="'第'+ product.dayOfPeriod +'天:'">
                            <Select
                            filterable
                            style="width: 200px"
                            remote
                            :remote-method ="remoteMethod"
                            :loading ="shelfSpecificationLoading"
                            :placeholder =  "product.productName == '' ? '输入上架商品名称' : product.productName"
                            transfer>
                              <Option
                                  v-for="(option, index) in optionsShelfSpecification"
                                  :value="option.name" class="pb5 pt5 pl15"
                                  :key="'update' + period.index +  '-' + product.index + '-' + index"
                                  @click.native="updateProduct(period.index, product.index, option.id, product.id)"
                                >
                                {{option.name}}</Option>
                            </Select>
                          </FormItem>
                        </Col>
                  </TabPane>
              </Tabs>
          </template>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleSettingClose('modalSetting')">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="updatePeriod()">确定
        </Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="uploadVisible">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getCustomPlansPages,
    deleteCustomPlan,
    getCustomPlanSectionsPages,
    createCustomPlan,
    getProductShelvesPages, getCustomPlan, editCustomPlan, editCustomPlanStatus, editCustomPlanPeriod} from '@/api/fruitermaster';
  import IViewUpload from '_c/iview-upload';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import {fenToYuanDot2, fenToYuanDot2Number, yuanToFenNumber} from '@/libs/util';
  import {customPlanStatusConvert} from '@/libs/converStatus';
  import {customPlanStatusEnum} from '@/libs/enumerate';
  import BookTypeOption from '_c/book-type-option';

  const customPlanDetail = {
    id: 0,
    customPlanSectionIds: [],
    description: '',
    image: '',
    name: '',
    overRule: '',
    periodList: [
      {
        planPeriod: 0,
        products: [
          {
            benefit: '',
            dayOfPeriod: 0,
            description: '',
            id: 0,
            image: '',
            planId: 0,
            productName: '',
            shelfId: 0,
            optionType: null
          }
        ],
        specificationList: [
          {
            description: '',
            id: 0,
            image: '',
            planId: 0,
            planPeriod: 0,
            price: 0,
            quantity: 0,
            standardId: 0,
            optionType: null
          }
        ]
      }
    ],
    price: 0,
    status: null
  };

  const roleRowData = {
    name: '',
    page: 1,
    rows: 10
  };

  const commonTempColumns =[
    {
      title: '时间',
      key: 'dayOfPeriod',
      minWidth: 150,
      align: 'center',
      render: (h, params, vm) => {
        return <div>{'第' + params.row.dayOfPeriod + '天'}</div>;
      }
    },
    {
      title: '套餐名称',
      key: 'productName',
      minWidth: 150,
      align: 'center'
    }
  ];

  export default {
    components: {
      Tables,
      IViewUpload,
      BookTypeOption
    },
    created() {
      getCustomPlanSectionsPages({
        page: 0,
        rows: 0
      }).then(res => {
        this.customPlanSectionData = res.array;
        this.createLoading = false;
        this.getTableData();
      });
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    data() {
      return {
        shelfSpecificationLoadingDay1: false,
        modalViewLoading: false,
        shelfSpecificationLoading: false,
        model: [],
        customPlanSectionData: [],
        customPlanStatusEnum,
        topRuleInline: false,
        ruleInline: {
          name: [{required: true, message: '请填写定制名称'}],
          image: [{required: true, message: '请上传图片'}],
          status: [{required: true, message: '请选择状态'}],
          description: [{required: true, message: '请选择状态'}],
          customPlanSectionIds: [{required: true, message: '请选择上架板块'}]
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '定制计划主图',
            width: 150,
            align: 'center',
            key: 'image',
            render: (h, params, vm) => {
              let {row} = params;
              const str = <img src={row.image} style="margin-top:5px" height="60" width="100" margin-top="10px"/>;
              return <div>{str}</div>;
            }
          },
          {
            title: '定制计划名称',
            key: 'name',
            width: 150
          },
          {
            title: '价格(周/单人)',
            width: 150,
            key: 'weekPrice1',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              } ;
              let obj = row.periodList.find(item => {
                return item.planPeriod === 7;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 1;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '价格(周/双人)',
            width: 150,
            key: 'weekPrice2',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              } ;
              let obj = row.periodList.find(item => {
                return item.planPeriod === 7;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 2;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '价格(周/三人)',
            width: 150,
            key: 'weekPrice3',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              } ;
              let obj = row.periodList.find(item => {
                return item.planPeriod === 7;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 3;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '价格(月/单人)',
            width: 180,
            key: 'monthPrice1',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              };
              let obj = row.periodList.find(item => {
                return item.planPeriod === 30;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 1;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '价格(月/双人)',
            width: 150,
            key: 'monthPrice2',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              } ;
              let obj = row.periodList.find(item => {
                return item.planPeriod === 30;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 2;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '价格(月/三人)',
            width: 150,
            key: 'monthPrice3',
            render: (h, params, vm) => {
              let {row} = params;
              if (!row.periodList) {
                return <div></div>;
              } ;
              let obj = row.periodList.find(item => {
                return item.planPeriod === 30;
              });
              if (!obj) {
                return <div></div>;
              };
              if (!obj.specificationList) {
                return <div></div>;
              };
              let innerObj = obj.specificationList.find(item => {
                return item.quantity === 3;
              });
              if (!innerObj) {
                return <div></div>;
              }
              return <div>{fenToYuanDot2(innerObj.price)}</div>;
            }
          },
          {
            title: '是否上架',
            width: 100,
            key: 'status',
            render: (h, params, vm) => {
              let {row} = params;
              if (row.status == 'VALID') {
                return <div><tag color="success">{customPlanStatusConvert(row.status).label}</tag></div>;
              } else if (row.status == 'INVALID') {
                return <div><tag color="error">{customPlanStatusConvert(row.status).label}</tag></div>;
              }
              return <div>{row.status}</div>;
            }
          },
          {
            title: '操作',
            minWidth: 250,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'customOnSale', 'settings']
          }
        ],
        uploadListMain: [],
        defaultListMain: [],
        optionsShelfSpecification: [],
        searchRowData: this._.cloneDeep(roleRowData),
        periodList: [],
        products: [],
        specificationList: [],
        rowData: customPlanDetail,
        periodIndex: -1,
        productIndex: -1,
        modalSetting: false,
        modalEdit: false,
        showTab: false,
        showHeader: true,
        exportType: 'xlsx',
        downloadLoading: false,
        tempColumnsView: [
          ...commonTempColumns
        ]
      };
    },
    methods: {
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
          this.shelfSpecificationLoading = false;
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
              console.log('添加/修改');
              if (this.rowData.id == 0) {
                  this.modalViewLoading = true;
                  this.loading=true;
                  createCustomPlan(this.rowData).then(res => {
                    this.$Message.success('创建成功!');
                    this.getTableData();
                    this.modalEdit = false;
                  }).finally(res => {
                    this.modalViewLoading = false;
                  });
              } else {
                  this.modalViewLoading = true;
                  this.loading=true;
                  editCustomPlan(this.rowData).then(res => {
                    this.$Message.success('修改成功!');
                    this.getTableData();
                    this.modalEdit = false;
                  }).finally(res => {
                    this.modalViewLoading = false;
                  });
              }
          } else {
             this.$Message.warn('请完善周套餐/月套餐信息');
          }
        });
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.rowData.image = null;
        this.rowData.image = fileList[0].url;
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = [];
        this.rowData.image = null;
      },
      handleView(params) {
        this.tempModalType = this.modalType.view;
        this.loading = true;
        getCustomPlan({id: params.row.id}).then(res => {
          this.step = 'name1';
          this.loading = false;
          this.rowData = {};
          this.rowData = res;
          // 如果只有一个周期的套餐，则另一个套餐数据补齐
          if (res.periodList.length !== 2) {
            let planPeriod = this.rowData.periodList[0].planPeriod;
            let newPlanPeriod = planPeriod == 7 ? 30 : 7;
            let newIndex = this.rowData.periodList[0].index == 0 ? 1 : 0;
            this.rowData.periodList.push({'index': newIndex, 'planPeriod': newPlanPeriod, 'products': [], 'specificationList': []});
            // console.log(JSON.stringify(this.rowData));
          }
          this.modalView = true;
        });
      },
      handlePeriod(params) {
        this.tempModalType = this.modalType.setting;
        this.loading = true;
        this.step = 'name1';
        getCustomPlan({id: params.row.id}).then(res => {
          this.loading = false;
          this.rowData = {};
          this.rowData = res;
          // 如果只有一个周期的套餐，则另一个套餐数据补齐
          if (res.periodList.length !== 2) {
            let planId = this.rowData.id;
            let planPeriod = this.rowData.periodList[0].planPeriod;
            let newPlanPeriod = planPeriod == 7 ? 30 : 7;
            let newIndex = this.rowData.periodList[0].index == 0 ? 1 : 0;
            this.rowData.periodList.push({'index': newIndex, 'planPeriod': newPlanPeriod, 'products': [], 'specificationList': []});
            // 升序排序
            res.periodList.sort((a, b) => a.index - b.index);
            for (var product = 0; product < newPlanPeriod; product++) {
                this.rowData.periodList[newIndex].products.push({'index': product, 'benefit': '', 'dayOfPeriod': (product+1), 'description': '', 'id': 0, 'image': '', 'planId': planId, 'productName': '', 'shelfId': 0, 'optionType': null});
            }
            for (var specification = 0; specification < 3; specification++) {
                let description = specification == 0 ? '单人套餐' : (specification == 1 ? '双人套餐' : '三人套餐');
                this.rowData.periodList[newIndex].specificationList.push({'options': null, 'index': specification, 'description': description, 'id': 0, 'image': '', 'planId': planId, 'planPeriod': newPlanPeriod, 'price': 0, 'quantity': (specification+1), 'standardId': 0, 'optionType': null});
            }
            // console.log(JSON.stringify(this.rowData));
          }
          this.step = 'name1';
          this.modalSetting = true;
        });
      },
      handleAdd() {
        if (this.tempModalType != this.modalType.create) {
          this.resetFields();
        };
        this.tempModalType = this.modalType.create;
        // 对象初始化
        this.rowData = {};
        this.rowData = {'id': 0, 'customPlanSectionIds': [], 'description': '', 'image': '', 'name': '', 'overRule': '', 'periodList': [], 'price': 0, 'status': null};
        // console.log(JSON.stringify(this.rowData));
        // 数据循环初始化
        for (var period = 0; period < 2; period++) {
          let planPeriod = period == 0 ? 7 : 30;
          this.rowData.periodList.push({'index': period, 'planPeriod': planPeriod, 'products': [], 'specificationList': []});
          for (var product = 0; product < planPeriod; product++) {
              this.rowData.periodList[period].products.push({'index': product, 'benefit': '', 'dayOfPeriod': (product+1), 'description': '', 'id': 0, 'image': '', 'planId': 0, 'productName': '', 'shelfId': 0, 'optionType': null});
          }
          for (var specification = 0; specification < 3; specification++) {
              let description = specification == 0 ? '单人套餐' : (specification == 1 ? '双人套餐' : '三人套餐');
              this.rowData.periodList[period].specificationList.push({'index': specification, 'description': description, 'id': 0, 'image': '', 'planId': 0, 'planPeriod': planPeriod, 'price': 0, 'quantity': (specification+1), 'standardId': 0, 'optionType': null});
          }
        }
        // console.log(JSON.stringify(this.rowData));
        this.showHeader = true;
        this.showTab = true;
        this.modalEdit = true;
      },
      resetFields() {
        this.$refs.modalEdit.resetFields();
        this.$refs.uploadMain.clearFileList();
        this.uploadListMain = [];
      },
      resetSearchRowData() {
        this.clearSearchLoading = true;
        this.searchRowData = this._.cloneDeep(roleRowData);
        this.getTableData();
      },
      customOnSale(params) {
        const rowData = this._.cloneDeep(params.row);
        if (params.row.status === 'VALID') {
          rowData.status = 'INVALID';
        } else {
          rowData.status = 'VALID';
        }
        this.loading = true;
        editCustomPlanStatus(rowData).then(res => {
          this.$Message.success('修改成功!');
        }).finally(res => {
          this.loading = false;
          this.modalViewLoading = false;
          this.getTableData();
          this.modalEdit = false;
        });
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;
        this.loading = true;
        this.showHeader = true;
        getCustomPlan({id: params.row.id}).then(res => {
           this.step = 'name1';
          this.loading = false;
          this.rowData = res;
          this.showHeader = true;
          this.showTab = false;
          this.setDefaultUploadList(res);
          this.modalEdit = true;
        });
      },
      setDefaultUploadList(res) {
        if (res.image != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.image;
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          };
          this.uploadListMain = mainImgArr;
        }
      },
      getTableData() {
        getCustomPlansPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
        }).finally(res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
      },
      deleteTable(ids) {
        this.loading = true;
        deleteCustomPlan({
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
      handleDownload() {
        // 导出不分页
        this.searchRowData.rows = null;
        getCustomPlansPages(this.searchRowData).then(res => {
          let tableData = res.array;
          // 表格数据导出字段翻译
          tableData.forEach(item => {
            if (item['periodList'] !== null) {
              item['periodList'].forEach(element => {
                if (element.planPeriod === 7 && element['specificationList'] !== null) {
                  element['specificationList'].find(specification => {
                    switch (specification.quantity) {
                      case 1:
                        item['weekPrice1'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      case 2:
                        item['weekPrice2'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      case 3:
                        item['weekPrice3'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      default:
                        break;
                    }
                  });
                }
                if (element.planPeriod === 30 && element['specificationList'] !== null) {
                  element['specificationList'].find(specification => {
                    switch (specification.quantity) {
                      case 1:
                        item['monthPrice1'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      case 2:
                        item['monthPrice2'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      case 3:
                        item['monthPrice3'] = (specification['price'] /100.00).toFixed(2);
                        break;
                      default:
                        break;
                    }
                  });
                }
            });
            }
            item['status'] = customPlanStatusConvert(item['status']).label;
          });
          this.$refs.tables.handleDownload({
            filename: `定制计划-${new Date().valueOf()}`,
            data: tableData
          });
        });
      },
      updateProduct(periodIndex, productIndex, shelfId, productId) {
        console.log('updateProduct:' + periodIndex + ',' + productIndex + ',' + shelfId + ',' + productId);
        this.rowData.periodList[periodIndex].products[productIndex].shelfId = shelfId;
        this.rowData.periodList[periodIndex].products[productIndex].optionType = productId === 0 ? 'INSERT' : 'UPDATE';
      },
      updatePeriod() {
         editCustomPlanPeriod(this.rowData).then(res => {
            this.$Message.info('修改成功');
            this.getTableData();
            this.step = 'name1';
            this.modalSetting = false;
        });
      },
      // editProduct(periodIndex, productIndex, shelfId) {
      //   console.log('editProduct:' + periodIndex + ',' + productIndex + ',' + shelfId);
      //   this.rowData.periodList[periodIndex].products[productIndex].shelfId = shelfId;
      //   console.log(this.rowData.periodList[periodIndex].products[productIndex].shelfId);
      // },
      handleEditClose(name) {
        this.modalEdit = false;
        this.isCreated = false;
        this.isDisable = true;
        this.rowData = {};
        this.$refs[name].resetFields();
        this.step = 'name1';
      },
      handleSettingClose(name) {
        this.modalSetting = false;
        this.rowData = {};
        this.$refs[name].resetFields();
        this.step = 'name1';
      },
      handleClose() {
        this.rowData = {};
        this.modalView = false;
         this.step = 'name1';
      },
      priceComputed(price) {
        return fenToYuanDot2Number(price);
      },
      priceOnChange(periodIndex, specificationIndex, value, specificationId) {
        console.log('priceOnChange:' + periodIndex + ',' + specificationIndex + ',' + value + ',' + specificationId);
        if (value !== null) {
          this.rowData.periodList[periodIndex].specificationList[specificationIndex].price = yuanToFenNumber(value);
          this.rowData.periodList[periodIndex].specificationList[specificationIndex].optionType = specificationId === 0 ? 'INSERT' : 'UPDATE';
        }
        console.log(this.rowData.periodList[periodIndex].specificationList[specificationIndex].price);
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
