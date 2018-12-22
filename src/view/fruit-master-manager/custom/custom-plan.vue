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
        @custom-on-sale="customOnSale"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-delete="handleDelete"
        @on-custom-plan-product="handleCustomPlanProduct"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              placeholder="定制计划名称"
              class="search-input mr5"
              v-model="searchRowData.name"
              style="width: auto"
              clearable
            />
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
          <Button v-waves type="primary" class="mr5" @click="exportExcel">
            <Icon type="md-download"/>导出
          </Button>
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">定制名称:</i-col>
              <i-col span="16">{{customPlanDetail.name}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">序号:</i-col>
              <i-col span="16">{{customPlanDetail.sorts}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb10" :gutter="8">
          <i-col span="24">
            <Row :gutter="8" class-name="mb10">
              <i-col span="8">定制主图:</i-col>
              <img style="width: 150px" :src="customPlanDetail.image" span="16">
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">是否上架:</i-col>
              <i-col span="16">{{customPlanDetail.status|onSaleStatusFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="modalEdit" :width="650">
      <p slot="header">
        <span>定制计划</span>
      </p>
      <div class="modal-content">
        <Form
          ref="modalEdit"
          :model="customPlanDetail"
          :rules="ruleInline"
          :label-width="110"
          v-if="topShow"
        >
          <FormItem label="定制计划名称:" prop="name">
            <Input
              placeholder="上架名称"
              class="search-input mr5"
              v-model="customPlanDetail.name"
              style="width: auto"
            />
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
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <FormItem label="是否上架:" prop="status">
            <Select class="search-col mr5" v-model="customPlanDetail.status" style="width: 100px">
              <Option
                v-for="item in onSaleStatusEnum"
                :value="item.value"
                class="ptb2-5"
                :key="`search-col-${item.value}`"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="上架板块:"
            prop="customPlanSectionIds"
            v-if="tempModalType === modalType.create"
          >
            <div v-for="item in uiPositionData">
              <div>{{item.description}}:</div>
              <CheckboxGroup @on-change="checkAllGroupChange" v-model="model">
                <Checkbox
                  ref="checkBox"
                  :label="innerItem.id"
                  v-for="innerItem in item.productSections"
                >{{innerItem.sectionName}}</Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </Form>
        <Tabs value="name1" type="card" v-if="bottomShow">
          <TabPane label="周" name="name1" style="margin-bottom: 150px">
            <Form
              ref="weekForm"
              :model="customPlanDetail"
              :label-width="90"
              :rules="ruleInlineWeek"
            >
              <Col span="8">
                <FormItem label="单人套餐价:" prop="periodWeek1">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodWeek1"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="双人套餐价:" prop="periodWeek2">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodWeek2"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="三人套餐价:" prop="periodWeek3">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodWeek3"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第1天:" prop="selectWeek1">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek1"
                  >
                    <Option
                      @click.native="selectIndexWeek1(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第2天:" prop="selectWeek2">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek2"
                  >
                    <Option
                      @click.native="selectIndexWeek2(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第3天:" prop="selectWeek3">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek3"
                  >
                    <Option
                      @click.native="selectIndexWeek3(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第4天:" prop="selectWeek3">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek4"
                  >
                    <Option
                      @click.native="selectIndexWeek4(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第5天:" prop="selectWeek3">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek5"
                  >
                    <Option
                      @click.native="selectIndexWeek5(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第6天:" prop="selectWeek3">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek6"
                  >
                    <Option
                      @click.native="selectIndexWeek6(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第7天:" prop="selectWeek3">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectWeek7"
                  >
                    <Option
                      @click.native="selectIndexWeek7(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Form>
          </TabPane>
          <TabPane label="月" name="name2">
            <Form
              ref="monthForm"
              :model="customPlanDetail"
              :label-width="90"
              :rules="ruleInlineMonth"
            >
              <Col span="8">
                <FormItem label="单人套餐价:" prop="periodMonth1">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodMonth1"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="双人套餐价:" prop="periodMonth2">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodMonth2"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="三人套餐价:" prop="periodMonth3">
                  <Input
                    class="search-input mr5"
                    v-model="customPlanDetail.periodMonth3"
                    style="width: 100px"
                  />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="第1天:" prop="selectMonth1">
                  <Select
                    ref="shelfSpecificationSelect"
                    :remote="true"
                    :filterable="true"
                    :remote-method="remoteMethod"
                    :loading="shelfSpecificationLoadingDay1"
                    style="width: 200px"
                    v-model="customPlanDetail.selectMonth1"
                  >
                    <Option
                      @click.native="selectIndexMonth1(option)"
                      class="pb5 pt5 pl15"
                      v-for="(option, index) in optionsShelfSpecification"
                      :value="option.id"
                      :key="index"
                    >{{option.productName}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Form>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {  getCustomPlansPages,
  deleteCustomPlan,
  getuiPositionsPages,
  createCustomPlan,
  getProductShelvesPages, getCustomPlan, editCustomPlan} from '@/api/fruitermaster';
import IViewUpload from '_c/iview-upload'
import deleteMixin from '@/mixins/deleteMixin.js'
import tableMixin from '@/mixins/tableMixin.js'
import searchMixin from '@/mixins/searchMixin.js'
import uploadMixin from '@/mixins/uploadMixin'
import { fenToYuanDot2 } from '@/libs/util';
import { onSaleStatusConvert } from '@/libs/converStatus';
import { onSaleStatusEnum, YNEnum, positionType } from '@/libs/enumerate';
import { onSaleStatus } from '../../../libs/enumerate';

const customPlanDetail = {
  id: 0,
  status: null,
  createAt: null,
  overRule: "",
  createUser: "",
  image: null,
  name: "",
  description: "",
  price: null,
  periodList: null,
  sorts: null,
  customPlanSectionIds: null,
  periodWeek1: null,
  periodWeek2: null,
  periodWeek3: null,
  selectWeek1: null,
  selectWeek2: null,
  selectWeek3: null,
  selectWeek4: null,
  selectWeek5: null,
  selectWeek6: null,
  selectWeek7: null,

  periodMonth1: null,
  periodMonth2: null,
  periodMonth3: null,
  selectMonth1: null,
  selectMonth2: null,
  selectMonth3: null,
  selectMonth4: null,
  selectMonth5: null,
  selectMonth6: null,
  selectMonth7: null,
};

const customPlanDetail = {
  id: 0,
  status: null,
  createAt: null,
  overRule: '',
  createUser: '',
  image: null,
  name: '',
  description: '',
  price: null,
  periodList: null,
  sorts: null,
  customPlanSectionIds: null,
  periodWeek1: null,
  periodWeek2: null,
  periodWeek3: null,
  periodMonth1: null,
  periodMonth2: null,
  periodMonth3: null,
  selectWeek1: null
};

const periodWeekDay = {
  planPeriod: null,
  quantity: null,
  price: null
};

const productDetail = {
  dayOfPeriod: 0,
  shelfId: 0,
  productName: ''
};

const specificationDetail = {
  id: 0,
  planId: 0,
  price: 0,
  quantity: 0,
  description: "",
  planPeriod: 0,
  image: null,
  standardId: 0,
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
      this.createLoading = false
      this.getTableData();
    })
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      topShow: true,
      bottomShow: true,
      shelfSpecificationLoadingDay1: false,
      modalViewLoading: false,
      model: [],
      uiPositionData: [],
      onSaleStatusEnum,
      topRuleInline: false,
      ruleInline: {
        name: [{ required: false, message: '请填写定制名称' }],
        image: [{ required: false, message: '请上传图片' }],
        status: [{ required: false, message: '请选择状态' }],
        customPlanSectionIds: [{ required: false, message: '请选择上架板块' }]
      },
      ruleInline: {
        name: [{ required: true, message: '请填写定制名称' }],
        image: [{ required: true, message: '请上传图片' }],
        status: [{ required: true, message: '请选择状态' }],
        customPlanSectionIds: [{ required: true, message: '请选择上架板块' }]
      },
      ruleInlineWeek: {
        periodWeek1: [{ required: true, message: '请填写' }],
        periodWeek2: [{ required: true, message: '请填写' }],
        periodWeek3: [{ required: true, message: '请填写' }],
        selectWeek1: [{ required: true, message: '请填写' }],
        selectWeek2: [{ required: true, message: '请填写' }],
        selectWeek3: [{ required: true, message: '请填写' }],
        selectWeek4: [{ required: true, message: '请填写' }],
        selectWeek5: [{ required: true, message: '请填写' }],
        selectWeek6: [{ required: true, message: '请填写' }],
        selectWeek7: [{ required: true, message: '请填写' }],
      },
      ruleInlineMonth: {
        periodMonth1: [{ required: true, message: '请填写' }],
        periodMonth2: [{ required: true, message: '请填写' }],
        periodMonth3: [{ required: true, message: '请填写' }],
        selectMonth1: [{ required: true, message: '请填写' }],
        selectMonth2: [{ required: true, message: '请填写' }],
        selectMonth3: [{ required: true, message: '请填写' }],
        selectMonth4: [{ required: true, message: '请填写' }],
        selectMonth5: [{ required: true, message: '请填写' }],
        selectMonth6: [{ required: true, message: '请填写' }],
        selectMonth7: [{ required: true, message: '请填写' }],
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
            let { row } = params
            const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px" />;
            return <div>{str}</div>;
          },
          let obj = row.periodList.find(item => {
            return item.planPeriod === 7;
          }),
          if(!obj) {
            return <div />;
          }
            if(!obj.specificationList) {
            return <div />;
          }
            let innerObj = obj.specificationList.find(item => {
            return item.quantity === 2;
          });
          if(!innerObj) {
            return <div />;
          }
            return<div>{ fenToYuanDot2(innerObj.price) }</div>;
        }
        },
      {
        title: '价格(周/三人)',
        width: 150,
        render: (h, params, vm) => {
          let { row } = params;
          if (!row.periodList) {
            return <div />;
          }
          let obj = row.periodList.find(item => {
            return item.planPeriod === 7;
          });
          if (!obj) {
            return <div />;
          }
          if (!obj.specificationList) {
            return <div />;
          }
          let innerObj = obj.specificationList.find(item => {
            return item.quantity === 3;
          });
          if (!innerObj) {
            return <div />;
          }
        },
          {
      title: '操作',
        minWidth: 250,
          key: 'handle',
            options: ['delete', 'edit', 'view', 'customOnSale', 'customPlanProduct']
    }
        ],
    uploadListMain: [],
      defaultListMain: [],
        optionsShelfSpecification: [],
          searchRowData: this._.cloneDeep(roleRowData),
            customPlanDetail: this._.cloneDeep(customPlanDetail),
              periodList: [],
                periodDetail : this._.cloneDeep(periodDetail),
                  products: [],
                    productDetail : this._.cloneDeep(productDetail),
                      specificationList: [],
                        specificationDetail : this._.cloneDeep(specificationDetail)
  };
},
watch: {
  optionsShelfSpecification(curVal, oldVal){
    console.log(curVal, oldVal);
  },
},
methods: {
  setDefaultUploadList(res) {
    if (res.image != null) {
      const map = { status: 'finished', url: 'url' };
      let mainImgArr = [];
      map.url = res.image;
      mainImgArr.push(map);
      if (this.$refs.uploadMain) {
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      };
    }
  },
  selectIndexWeek1(options) {
    this.selectIndexCommon(options, 1, 7)
  },
  selectIndexWeek2(options){
    this.selectIndexCommon(options, 2, 7)
  },
  selectIndexWeek3(options){
    this.selectIndexCommon(options, 3, 7)
  },
  selectIndexWeek4(options){
    this.selectIndexCommon(options, 4, 7)
  },
  selectIndexWeek5(options){
    this.selectIndexCommon(options, 5, 7)
  },
  selectIndexWeek6(options){
    this.selectIndexCommon(options, 6, 7)
  },
  selectIndexWeek7(options){
    this.selectIndexCommon(options, 7, 7)
  },
  selectIndexMonth1(options){
    this.selectIndexCommon(options, 1, 30)
  },
  selectIndexCommon(options, dayOfPeriod, planPeriod){
    if (!this.customPlanDetail.periodList) {
      this.customPlanDetail.periodList = [];
    };
    let obj = this.customPlanDetail.periodList.find(item => item.planPeriod === planPeriod);
    if (!obj) {
      const productDetail = { shelfId: options.id, dayOfPeriod, productName: options.productName };
      const periodDetail = { planPeriod, products: [] }
      periodDetail.products.push(productDetail);
      this.customPlanDetail.periodList.push(periodDetail);
    } else {
      let innerObj = obj.products.find(item => item.dayOfPeriod === dayOfPeriod);
      if (innerObj) {
        innerObj.shelfId = options.id;
      } else {
        const productDetail = { shelfId: options.id, dayOfPeriod, productName: options.productName };
        obj.products.push(productDetail)
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
  weekValidatePromise(){
    let p = new Promise((resolve, reject) => {
      this.$refs.weekForm.validate((valid) => {
        resolve(valid)
      })
    });
    return p;
  },
  monthValidatePromise(){
    let p = new Promise((resolve, reject) => {
      this.$refs.monthForm.validate((valid) => {
        resolve(valid)
      })
    });
    return p;
  },

  async handleSubmit(name){
    let weekValidate;
    let monthValidate;

    if (this.topShow && !this.bottomShow) {
      weekValidate = true;
      monthValidate = true;
    } else {
      weekValidate = await this.weekValidatePromise();
      monthValidate = await this.monthValidatePromise();
    };
    if (this.$refs[name]) {
      this.$refs[name].validate((valid) => {
        if (valid && weekValidate && monthValidate) {
          if (this.tempModalType === this.modalType.create) {
            this.commonConvertPeriod();
            console.log(this.customPlanDetail.periodList);
            // return
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
    } else {
      this.commonConvertPeriod();
    };
  },
  commonConvertPeriod(){
    this.convertPeriod(this.customPlanDetail.periodWeek1, 7, 1);
    this.convertPeriod(this.customPlanDetail.periodWeek2, 7, 2);
    this.convertPeriod(this.customPlanDetail.periodWeek3, 7, 3);
    this.convertPeriod(this.customPlanDetail.periodMonth1, 30, 1);
    this.convertPeriod(this.customPlanDetail.periodMonth2, 30, 2);
    this.convertPeriod(this.customPlanDetail.periodMonth3, 30, 3);
  },
  convertPeriod(value, planPeriod, quantity){
    if (value) {
      if (!this.customPlanDetail.periodList) {
        this.customPlanDetail.periodList = [];
        const specificationDetail = { price: value, quantity: quantity };
        const specificationList = []
        specificationList.push(specificationDetail);
        const periodDetail = { planPeriod, specificationList };
        this.customPlanDetail.periodList.push(periodDetail);
      } else {
        let obj = this.customPlanDetail.periodList.find(item => {
          return item.planPeriod === planPeriod;
        });
        if (!obj) {
          const specificationDetail = { price: value, quantity: quantity };
          this.specificationList.push(this.specificationDetail);
          const specificationList = []
          specificationList.push(specificationDetail);
          const periodDetail = { planPeriod, specificationList };
          this.customPlanDetail.periodList.push(periodDetail);
        } else {
          if (!obj.specificationList) {
            obj.specificationList = [];
          };
          let innerObj = obj.specificationList.find(item => {
            return item.quantity === quantity;
          });
          if (!innerObj) {
            const specificationDetail = { price: value, quantity: quantity };
            obj.specificationList.push(specificationDetail);
          } else {
            innerObj.price = value;
          };
        };
      };
    } else {
      if (this.customPlanDetail.periodList) {
        let obj = this.customPlanDetail.periodList.find(item => {
          return item.planPeriod === planPeriod
        });
        if (obj) {
          if (obj.specificationList)
            obj.specificationList = obj.specificationList.filter(item => item.quantity !== quantity);
        };
      };
    };
  },
  createTableRow(){
    this.modalViewLoading = true;
    this.loading = true;
    createCustomPlan(this.customPlanDetail).then(res => {
      this.$Message.success('创建成功!');
    })
      .finally(res => {
        this.getTableData();
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
  },
  resetFields() {
    if (this.$refs.modalEdit) {
      this.$refs.modalEdit.resetFields();
    };
    if (this.$refs.weekForm) {
      this.$refs.weekForm.resetFields();
    };
    if (this.$refs.uploadMain) {
      this.$refs.uploadMain.clearFileList();
    }
    this.uploadListMain = [];
    this.customPlanDetail = _.cloneDeep(customPlanDetail);
  },
  editTableRow(){
    this.loading = true;
    this.modalViewLoading = true;
    editCustomPlan(this.customPlanDetail).then(res => {
      this.resetFields();
      this.modalEdit = false;
      this.getTableData();
    }).finally(res => {
      this.modalViewLoading = false;
    });
  },
  checkAllGroupChange(value){
    if (value) {
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
    getCustomPlan({ id: params.row.id }).then(res => {
      this.customPlanDetail = res
      this.loading = false;
      this.modalView = true;
    })
  },
  addChildren() {
    this.topShow = true;
    this.bottomShow = true;
    if (this.tempModalType !== this.modalType.create) {
      this.resetFields();
      this.tempModalType = this.modalType.create;
    };
    this.ruleInline.customPlanSectionIds[0].required = true
    this.modalEdit = true
  },
  resetSearchRowData() {
    this.clearSearchLoading = true
    this.searchRowData = this._.cloneDeep(roleRowData);
    this.getTableData()
  },
  customOnSale(params) {
    console.log(params.row.status);
    this.customPlanDetail = this._.cloneDeep(params.row)
    if (this.customPlanDetail.status === onSaleStatus.VALID) {
      this.customPlanDetail.status = onSaleStatus.INVALID;
    } else {
      this.customPlanDetail.status = onSaleStatus.VALID
    }
    this.editTableRow()
  },
  handleCustomPlanProduct(params){
    this.topShow = false;
    this.bottomShow = true;
    this.tempModalType = this.modalType.edit;
    this.loading = true;
    getCustomPlan({ id: params.row.id }).then(res => {
      this.customPlanDetail = res;
      console.log(res);
      this.setDefaultUploadList(res)
      this.copyConvertData(res);
      console.log(this.customPlanDetail);
      console.log(this.optionsShelfSpecification);
      this.loading = false;
      this.modalEdit = true;
    })
  },
  handleEdit(params) {
    this.topShow = true;
    this.bottomShow = false;
    this.tempModalType = this.modalType.edit;
    this.loading = true;
    getCustomPlan({ id: params.row.id }).then(res => {
      console.log(res);
      this.customPlanDetail = res;
      this.setDefaultUploadList(res)
      this.copyConvertData(res);
      console.log(this.customPlanDetail);
      console.log(this.optionsShelfSpecification);
      this.loading = false;
      this.modalEdit = true;
    })
  },
  getTableData() {
    getCustomPlansPages(this.searchRowData).then(res => {
      this.tableData = res.array;
      this.total = res.total;
    })
      .finally(res => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
  },
  copyConvertData(res){
    this.optionsShelfSpecification = [];
    if (res.periodList) {
      let obj = res.periodList.find(item => item.planPeriod === 7);
      if (obj) {
        if (obj.specificationList) {
          this.defaultPeriodWeek('periodWeek1', obj, 1);
          this.defaultPeriodWeek('periodWeek2', obj, 2);
          this.defaultPeriodWeek('periodWeek3', obj, 3);
        };
        if (obj.products) {
          this.defaultSelectWeek('selectWeek1', obj, 1);
          this.defaultSelectWeek('selectWeek2', obj, 2);
          this.defaultSelectWeek('selectWeek3', obj, 3);
          this.defaultSelectWeek('selectWeek4', obj, 4);
          this.defaultSelectWeek('selectWeek5', obj, 5);
          this.defaultSelectWeek('selectWeek6', obj, 6);
          this.defaultSelectWeek('selectWeek7', obj, 7);
        };
      };
      let objMonth = res.periodList.find(item => item.planPeriod === 30);
      if (objMonth) {
        if (objMonth.specificationList) {
          this.defaultPeriodWeek('periodMonth1', objMonth, 1);
          this.defaultPeriodWeek('periodMonth3', objMonth, 2);
          this.defaultPeriodWeek('periodMonth2', objMonth, 3);
        };
        if (objMonth.products) {
          this.defaultSelectWeek('selectMonth1', objMonth, 1);
          this.defaultSelectWeek('selectMonth2', objMonth, 2);
          this.defaultSelectWeek('selectMonth3', objMonth, 3);
          this.defaultSelectWeek('selectMonth4', objMonth, 4);
          this.defaultSelectWeek('selectMonth5', objMonth, 5);
          this.defaultSelectWeek('selectMonth6', objMonth, 6);
          this.defaultSelectWeek('selectMonth7', objMonth, 7);
        };
      };
    };
  },
  defaultPeriodWeek(key, obj, quantity){
    let innerObj = obj.specificationList.find(item => item.quantity === quantity);
    if (innerObj) {
      this.customPlanDetail[key] = innerObj.price;
    };
  },
  defaultSelectWeek(key, obj, day){
    let innerObjMonth = obj.products.find(item => item.dayOfPeriod === day);
    if (innerObjMonth) {
      this.customPlanDetail[key] = innerObjMonth.shelfId;
      let has = this.optionsShelfSpecification.find(item => {
        return item.shelfId === innerObjMonth.shelfId
      });
      if (!has) {
        this.optionsShelfSpecification.push(innerObjMonth);
      };
    }
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
          this.tableDataSelected = [];
    this.getTableData();
  })
        .catch (err => {
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
