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
      :width="600"
    >
      <p slot="header">
        <span>定制计划</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="customPlanDetail" :rules="ruleInline" :label-width="110">
          <FormItem label="定制计划名称:" prop="name">
            <Input placeholder="上架名称" class="search-input mr5" v-model="customPlanDetail.name" style="width: auto"/>
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
              class="search-col mr5" v-model="customPlanDetail.status" style="width: 100px" >
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
              <CheckboxGroup @on-change="checkAllGroupChange" v-model="model">
                <Checkbox
                  ref="checkBox"
                  :label="innerItem.id"
                  v-for="innerItem in item.productSections"
                >{{innerItem.sectionName}}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </Form>
        <Tabs value="name1" type="card">
          <TabPane label="周" name="name1" style="margin-bottom: 100px">
            <Form ref="weekForm" :model="customPlanDetail" :label-width="80">
              <Col span="8">
                <FormItem label="单人套餐价:">
                  <Input class="search-input mr5" v-model="customPlanDetail.periodWeek1"  style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="双人套餐价:" prop="name">
                  <Input class="search-input mr5"  v-model="customPlanDetail.periodWeek2" style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="三人套餐价:">
                  <Input class="search-input mr5"  v-model="customPlanDetail.periodWeek3" style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第1天:">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek1"
                  >
                    <Option @click.native="selectIndex(option)" class="pb5 pt5 pl15"
                            v-for="(option, index) in optionsShelfSpecification"
                            :value="option.id" :key="index">
                      {{option.name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Form>
          </TabPane>
          <TabPane label="月" name="name2">
            <Form>
              <Col span="8">
                <FormItem label="单人套餐价:">
                  <Input class="search-input mr5" v-model="customPlanDetail.periodMonth1" style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="双人套餐价:">
                  <Input class="search-input mr5" v-model="customPlanDetail.periodMonth2" style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="三人套餐价:">
                  <Input class="search-input mr5" v-model="customPlanDetail.periodMonth3" style="width: 100px"/>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第1天:">

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
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getCustomPlansPages,
    deleteCustomPlan,
    getuiPositionsPages,
    createCustomPlan,
    getProductShelvesPages,getCustomPlan} from '@/api/fruitermaster';
  import IViewUpload from '_c/iview-upload'
  import deleteMixin from '@/mixins/deleteMixin.js'
  import tableMixin from '@/mixins/tableMixin.js'
  import searchMixin from '@/mixins/searchMixin.js'
  import uploadMixin from '@/mixins/uploadMixin'
  import {fenToYuanDot2} from '@/libs/util';
  import {onSaleStatusConvert} from '@/libs/converStatus';
  import {onSaleStatusEnum,YNEnum,positionType} from '@/libs/enumerate';

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

  const customPlanDetail = {
    id:0,
    status:null,
    createAt:null,
    overRule:"",
    createUser:"",
    image:null,
    name:"",
    description:"",
    price:null,
    periodList:null,
    sorts:null,
    customPlanSectionIds:null,
    periodWeek1:null,
    periodWeek2:null,
    periodWeek3:null,
    periodMonth1:null,
    periodMonth2:null,
    periodMonth3:null,
    selectWeek1:null
  };

  const periodWeekDay = {
    planPeriod: null,
    quantity: null,
    price: null
  };

  const periodDetail = {
    planPeriod:0,
    specificationList:null,
    products:null
  };

  const productDetail = {
    dayOfPeriod: 0,
    shelfId: 0
  };

  const specificationDetail = {
    id:0,
    planId:0,
    price:0,
    quantity:0,
    description:"",
    planPeriod:0,
    image:null,
    standardId:0,

  };

  const roleRowData = {
    name: "",
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
        applicationType:'HEALTH_GOOD',
        includeSection: YNEnum.YES,
        positionType: positionType.PRODUCT,
        page: 0,
        rows: 0
      }).then(res => {
        this.uiPositionData = res.array;
        this.createLoading = false
        this.getTableData();
      })
    },
    mixins: [ deleteMixin, tableMixin,searchMixin,uploadMixin],
    data() {
      return {
        shelfSpecificationLoadingDay1:false,
        modalViewLoading:false,
        model: [],
        uiPositionData:[],
        onSaleStatusEnum,
        topRuleInline:false,
        ruleInline:{
          name: [{required: false, message: '请填写定制名称'}],
          image: [{required: false, message: '请上传图片'}],
          status: [{required: false, message: '请选择状态'}],
          customPlanSectionIds:[{required: false, message: '请选择上架板块'}]
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
              let {row} = params
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              } ;
              let obj = row.periodList.find( item => {
                return item.planPeriod === 7
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 1
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              } ;
              let obj = row.periodList.find( item => {
                return item.planPeriod === 7
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 2
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              } ;
              let obj = row.periodList.find( item => {
                return item.planPeriod === 7
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 3
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              };
              let obj = row.periodList.find( item => {
                return item.planPeriod === 30
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 1
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              } ;
              let obj = row.periodList.find( item => {
                return item.planPeriod === 30
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 2
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
              let {row} = params
              if (!row.periodList){
                return <div></div>;
              } ;
              let obj = row.periodList.find( item => {
                return item.planPeriod === 30
              });
              if (!obj){
                return <div></div>;
              };
              if (!obj.specificationList){
                return <div></div>;
              };
              let innerObj = obj.specificationList.find( item => {
                return item.quantity === 3
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
              let {row} = params
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
        uploadListMain:[],
        defaultListMain: [],
        optionsShelfSpecification:[],
        searchRowData: this._.cloneDeep(roleRowData),
        customPlanDetail: this._.cloneDeep(customPlanDetail),
        fruitMasterDetail: fruitMasterDetail,
        periodList:[],
        periodDetail : this._.cloneDeep(periodDetail),
        products: [],
        productDetail : this._.cloneDeep(productDetail),
        specificationList:[],
        specificationDetail : this._.cloneDeep(specificationDetail)
      };
    },
    methods: {
      selectIndex(options) {
        if (!this.customPlanDetail.periodList){
          this.customPlanDetail.periodList = [];
        };
        let obj = this.customPlanDetail.periodList.find( item =>  item.planPeriod === 7);
        if (!obj){
          this.productDetail = this._.cloneDeep(productDetail);
          this.productDetail.shelfId = options.id;
          this.productDetail.dayOfPeriod = 1;

          this.periodDetail = this._.cloneDeep(periodDetail);
          this.periodDetail.planPeriod = 7;
          this.periodDetail.products = [];
          this.periodDetail.products.push(this.productDetail);
          this.customPlanDetail.periodList.push(this.periodDetail);
        }else {
          let innerObj = obj.products.find( item => item.dayOfPeriod === 1);
          if (innerObj){
            innerObj.shelfId = options.id;
          } else {
            this.productDetail = this._.cloneDeep(productDetail);
            this.productDetail.shelfId = options.id;
            this.productDetail.dayOfPeriod = 1;
            obj.products.push(this.productDetail)
          };
        };
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
          this.shelfSpecificationLoading = false;
        });
      },
      formItemChangeDay1(){

      },
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              this.convertPeriod(this.customPlanDetail.periodWeek1,7,1);
              this.convertPeriod(this.customPlanDetail.periodWeek2,7,2);
              this.convertPeriod(this.customPlanDetail.periodWeek3,7,3);
              console.log(this.customPlanDetail.periodList);
              return;

              //添加状态
              this.createTableRow()
            } else if (this.tempModalType === this.modalType.edit) {
              //编辑状态
              this.editTableRow()
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        })
      },
      convertPeriod(value,planPeriod,quantity,){
        if (value){
          if (!this.customPlanDetail.periodList){
            this.customPlanDetail.periodList=[];
            this.specificationDetail = this._.cloneDeep(specificationDetail);
            this.specificationDetail.price = value;
            this.specificationDetail.quantity = quantity;
            this.specificationList.push(this.specificationDetail);
            this.periodDetail.planPeriod = planPeriod;
            this.periodDetail.specificationList = this.specificationList;
            this.customPlanDetail.periodList.push(this.periodDetail);
          }else {
            let obj = this.customPlanDetail.periodList.find( item => {
              return item.planPeriod === planPeriod;
            });
            let innerObj = obj.specificationList.find( item => {
              return item.quantity === quantity;
            });
            if (!innerObj){
              this.specificationDetail = this._.cloneDeep(specificationDetail);
              this.specificationDetail.price = value;
              this.specificationDetail.quantity = quantity;
              obj.specificationList.push(this.specificationDetail);
            }else {
              innerObj.price = value;
            };
          };
        }else {
          if (this.customPlanDetail.periodList){
            let obj = this.customPlanDetail.periodList.find( item => {
              return item.planPeriod === planPeriod
            });
            if (obj){
              if(obj.specificationList)
                obj.specificationList = obj.specificationList.filter( item => item.quantity !== quantity);
            };
          };
        };
      },
      createTableRow(){
        this.modalViewLoading = true;
        this.loading=true;
        createCustomPlan(this.customPlanDetail).then(res => {
          this.$Message.success('创建成功!');
        }).finally( res => {
          this.getTableData();
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
      },
      editTableRow(){

      },
      checkAllGroupChange(value){
        if (value){
          this.customPlanDetail.customPlanSectionIds = value.join(',')
        } else {
          this.customPlanDetail.customPlanSectionIds = null
        };
        console.log(this.customPlanDetail.customPlanSectionIds);
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList
        this.customPlanDetail.image = null
        this.customPlanDetail.image = fileList[0].url
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = []
        this.customPlanDetail.image = null
      },
      handleView(params) {
        this.tempModalType = this.modalType.view
        this.loading = true;
        getCustomPlan({id:params.row.id}).then( res => {
          this.loading = false;
          this.modalView = true;
        })
      },
      addChildren() {
        this.tempModalType = this.modalType.create;
        this.modalEdit = true
      },
      resetSearchRowData() {
        this.clearSearchLoading = true
        this.searchRowData = this._.cloneDeep(roleRowData);
        this.getTableData()
      },
      customOnSale(params) {
        console.log(params);
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;
        this.fruitMasterDetail = params.row;
        this.modalEdit = true;
      },
      getTableData() {
        getCustomPlansPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
        }).finally( res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
      },
      deleteTable(ids) {
        this.loading = true
        deleteCustomPlan({
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
