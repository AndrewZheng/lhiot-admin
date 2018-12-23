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
              @on-relevance="handlePeriod"
              @custom-on-sale="customOnSale"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
              @on-delete="handleDelete"
      >
        <div slot="searchCondition">
          <Row>
            <Input placeholder="定制计划名称" class="search-input mr5" v-model="searchRowData.name" style="width: auto"/>
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
          <Button v-waves type="primary" class="mr5" @click="exportExcel">
            <Icon type="md-download"/>
            导出
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
              <img style="width: 150px" :src="rowData.image" span="16">
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">是否上架:</i-col>
              <i-col span="14">{{rowData.status|onSaleStatusFilters}}</i-col>
            </Row>
          </i-col>
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">上架板块:</i-col>
              <i-col span="14">{{rowData.customPlanSectionIds}}</i-col>
            </Row>
          </i-col>
        </Row>

        <Tabs value="name1" type="card">
            <TabPane v-for="(period, key) in rowData.periodList" :key="'addOrEdit' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'name'+(key+1)">
                <Form>
                  <Row type="flex" :gutter="24" align="middle" class-name="mb10">
                    <i-col span="8" v-for="specification in period.specificationList" :key="'addOrEdit' + period.index +  '--' + specification.index">
                      {{specification.description}}价: {{specification.price}}
                    </i-col>
                  </Row>
                </Form>
                <!-- FIXME -->
                <table>
                    <th>
                      <td>时间</td>
                      <td>套餐名</td>
                    </th>
                    <tr v-for="product in period.products" :key="'addOrEdit' + period.index +  '-' + product.index">
                      <td>第{{product.dayOfPeriod}}天</td>
                      <td>{{product.productName}}</td>
                    </tr>
                  </table>
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
      :width="600"
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
            <div class="demo-upload-list" v-for="item in uploadListMain">
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
              <Option v-for="item in onSaleStatusEnum" :value="item.value" class="ptb2-5" :key="`search-col-${item.value}`">
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="上架板块:" prop="customPlanSectionIds">
            <div v-for="item in uiPositionData">
              <div>
                {{item.description}}:
              </div>
              <CheckboxGroup v-model="rowData.customPlanSectionIds">
                <Checkbox
                  ref="checkBox"
                  :label="innerItem.id"
                  v-for="innerItem in item.productSections"
                  :key="innerItem.sectionName"
                >{{innerItem.sectionName}}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </Form>

        <Tabs value="name1" type="card" v-if="showTab">
            <TabPane v-for="(period, key) in rowData.periodList" :key="'addOrEdit' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'name'+(key+1)">
                <Form>
                  <Col span="8" v-for="specification in period.specificationList" :key="'addOrEdit' + period.index +  '--' + specification.index">
                    <FormItem :label="specification.description + '价:'">
                      <Input type="text" class="search-input mr5" v-model="specification.price" style="width: 100px" required="required"/>
                    </FormItem>
                  </Col>
                  <Col span="12" v-for="product in period.products" :key="'addOrEdit' + period.index +  '-' + product.index">
                    <FormItem :label="'第'+ product.dayOfPeriod +'天:'" :prop="product.productName">
                      <Select
                      :filterable="true"
                      style="width: 200px"
                      v-model="product.productName"
                      :remote="true"
                      :remote-method ="remoteMethod"
                      :loading="shelfSpecificationLoading">
                          <Option
                            v-for="(option, index) in optionsShelfSpecification"
                            :value="option.name" :key="'addOrEdit' + period.index +  '-' + product.index + '-' + index" class="pb5 pt5 pl15"
                             @click.native="addProduct(period.index, product.index, option.id)"
                          >
                          {{option.name}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Form>
            </TabPane>
        </Tabs>

      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>

    <!-- 定制周期管理 -->
     <Modal
      v-model="modalSetting"
      :width="600"
    >
      <p slot="header">
        <span>定制计划周期管理</span>
      </p>
      <div class="modal-content">
        <template v-for="(customPlan, index) in rowData" v-if="index == 'periodList'" >
            <Tabs value="productUpdate1" type="card" :key="'productUpdate' + customPlan.id">
                <TabPane v-for="(period, key) in customPlan" :key="'update' + period.index" :label="period.planPeriod == '7' ? '周' : '月'" :name="'productUpdate'+(key+1)">
                   <Form>
                      <Col span="8" v-for="specification in period.specificationList" :key="'update' + period.index +  '--' + specification.index">
                        <FormItem :label="specification.description + '价:'">
                          <Input type="text" class="search-input mr5" v-model="specification.price" style="width: 100px" required="required"/>
                        </FormItem>
                      </Col>
                      <Col span="12" v-for="product in period.products" :key="'update' + period.index +  '-' + product.index">
                        <FormItem :label="'第'+ product.dayOfPeriod +'天:'" :prop="product.productName">
                          <Select
                          :filterable="true"
                          style="width: 200px"
                          v-model="product.productName"
                          :remote="true"
                          :remote-method ="remoteMethod"
                          :loading="shelfSpecificationLoading">
                             <Option
                                v-for="(option, index) in optionsShelfSpecification"
                                :value="option.name" class="pb5 pt5 pl15"
                                :key="'update' + period.index +  '-' + product.index + '-' + index"
                                @click.native="updateProduct(product.id, option.id)"
                              >
                              {{option.name}}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Form>
                </TabPane>
            </Tabs>
        </template>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="updateSpecification">确定
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getCustomPlansPages,
    deleteCustomPlan,
    getuiPositionsPages,
    createCustomPlan,
    getProductShelvesPages, getCustomPlan, editCustomPlan, editCustomPlanProducts, editCustomPlanSpecifications} from '@/api/fruitermaster';
  import IViewUpload from '_c/iview-upload';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import {fenToYuanDot2} from '@/libs/util';
  import {onSaleStatusConvert} from '@/libs/converStatus';
  import {onSaleStatusEnum, YNEnum, positionType} from '@/libs/enumerate';

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
            shelfId: 0
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
            standardId: 0
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

  export default {
    components: {
      Tables,
      IViewUpload
    },
    created() {
      getuiPositionsPages({
        applicationType: 'HEALTH_GOOD',
        includeSection: YNEnum.YES,
        positionType: positionType.PRODUCT,
        page: 0,
        rows: 0
      }).then(res => {
        this.uiPositionData = res.array;
        this.createLoading = false;
        this.getTableData();
      });
    },
    mixins: [ deleteMixin, tableMixin, searchMixin, uploadMixin],
    data() {
      return {
        shelfSpecificationLoadingDay1: false,
        modalViewLoading: false,
        shelfSpecificationLoading: false,
        model: [],
        uiPositionData: [],
        onSaleStatusEnum,
        topRuleInline: false,
        ruleInline: {
          name: [{required: false, message: '请填写定制名称'}],
          image: [{required: false, message: '请上传图片'}],
          status: [{required: false, message: '请选择状态'}],
          customPlanSectionIds: [{required: false, message: '请选择上架板块'}]
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
            width: 120,
            align: 'center',
            render: (h, params, vm) => {
              let {row} = params;
              const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
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
            width: 150,
            render: (h, params, vm) => {
              let {row} = params;
              return <div>{onSaleStatusConvert(row.status).label}</div>;
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
        customPlanDetail: this._.cloneDeep(customPlanDetail),
        periodList: [],
        products: [],
        specificationList: [],
        rowData: customPlanDetail,
        periodIndex: -1,
        productIndex: -1,
        modalSetting: false,
        modalEdit: false,
        showTab: false,
        showHeader: false
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
          // console.log(JSON.stringify(this.rowData));   
          // FIXME 验证    
          if (valid) {   
                if (this.rowData.id == 0) {
                  this.modalViewLoading = true;
                  this.loading=true;
                  createCustomPlan(this.rowData).then(res => {
                    this.$Message.success('创建成功!');
                  }).finally(res => {
                    this.getTableData();
                    this.modalViewLoading = false;
                    this.modalEdit = false;
                  });
              } else {
                  this.modalViewLoading = true;
                  this.loading=true;
                  editCustomPlan(this.rowData).then(res => {
                    this.$Message.success('修改成功!');
                  }).finally(res => {
                    this.getTableData();
                    this.modalViewLoading = false;
                    this.modalEdit = false;
                  });
              }
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
          this.loading = false;
          this.rowData = {};
          this.rowData = res;
          this.modalView = true;
        });
      },
      handlePeriod(params) {
        this.tempModalType = this.modalType.setting;
        this.loading = true;
        getCustomPlan({id: params.row.id}).then(res => {
          this.loading = false;
          this.rowData = {};
          this.rowData = res;
          this.modalSetting = true;
        });
      },
      handleAdd() {
        // 对象初始化
        this.rowData = {};
        this.rowData = {'id': 0, 'customPlanSectionIds': [], 'description': '', 'image': '', 'name': '', 'overRule': '', 'periodList': [], 'price': 0, 'status': null};
        // console.log(JSON.stringify(this.rowData));
        // 数据循环初始化
        for (var period = 0; period < 2; period++) {
          let planPeriod = period == 0 ? 7 : 30;
          this.rowData.periodList.push({'index': period, 'planPeriod': planPeriod, 'products': [], 'specificationList': []});
          for (var product = 0; product < planPeriod; product++) {
              this.rowData.periodList[period].products.push({'index': product, 'benefit': '', 'dayOfPeriod': (product+1), 'description': '', 'id': 0, 'image': '', 'planId': 0, 'productName': '', 'shelfId': 0});
          }
          for (var specification = 0; specification < 3; specification++) {
              let description = specification == 0 ? '单人套餐' : (specification == 1 ? '双人套餐' : '三人套餐');
              this.rowData.periodList[period].specificationList.push({'index': specification, 'description': description, 'id': 0, 'image': '', 'planId': 0, 'planPeriod': planPeriod, 'price': 0, 'quantity': (specification+1), 'standardId': 0});
          }
        }
        // console.log(JSON.stringify(this.rowData));
        this.showHeader = true;
        this.showTab = true;
        this.modalEdit = true;
      },
      resetSearchRowData() {
        this.clearSearchLoading = true;
        this.searchRowData = this._.cloneDeep(roleRowData);
        this.getTableData();
      },
      customOnSale(params) {
        // FIXME 代码被删除
        console.log(params);
      },
      handleEdit(params) {
        this.loading = true;
        getCustomPlan({id: params.row.id}).then(res => {
          this.loading = false;
          this.rowData = res;
          this.showHeader = true;
          this.showTab = false;
          this.modalEdit = true;
        });
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
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      },
      updateProduct(id, shelfId) {
        const params = {
          id: id,
          shelfId: shelfId
        };
        console.log('修改定制计划商品:' + JSON.stringify(params));
        editCustomPlanProducts(params).then(res => {
              this.$Message.info('修改成功');
        });
      },
      updateSpecification() {
        console.log(JSON.stringify(this.rowData.periodList));
        editCustomPlanSpecifications(this.rowData).then(res => {
             this.$Message.info('修改成功');
             this.modalSetting = false;
        });
      },
      addProduct(periodIndex, productIndex, shelfId) {
        console.log('addProduct:' + periodIndex + ',' + productIndex + ',' + shelfId);
        this.rowData.periodList[periodIndex].products[productIndex].shelfId = shelfId;
        // console.log('rowData:' + JSON.stringify(this.rowData));
        editCustomPlanSpecifications(this.rowData).then(res => {
             this.$Message.info('修改成功');
        });
      },
      handleEditClose() {
        this.modalEdit = false;
        this.isCreated = false;
        this.isDisable = true;
        this.step = 'name1';
      },
      handleSettingClose() {
        this.modalSetting = false;
        this.step = 'name1';
      },
      handleClose() {
        this.modalView = false;
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
