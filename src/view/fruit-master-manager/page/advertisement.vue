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
          <Input placeholder="广告名称" class="search-input mr5" v-model="searchRowData.advertiseName"
                 style="width: 150px"/>
          <Select :disable="selectDisable" v-model="searchRowData.id" class="search-col mr5" placeholder="广告位置"
                  style="width: 150px">
            <Option v-for="item in advertisementList" :value="item.id" class="pt5 pb5 pl15"
                    :key="`search-col-${item.id}`">{{item.description}}
            </Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class=" mr5" @click="addChildren">
            <Icon type="md-add"/>
            创建
          </Button>
          <Poptip confirm
                  placement="bottom"
                  style="width: 100px;z-index: 99"
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
      :width="750"
      :mask-closable="false"
    >
      <p slot="header">
        <span>{{tempModalType===modalType.edit?'修改广告':'创建广告'}}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="advertisementDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <FormItem label="广告位置:" prop="advertiseName">
              <Select v-model="advertisementDetail.advertiseName" @on-change="advertisementChange"
                      style="width: 200px">
                <Option v-for="item in advertisementList" :value="item.id" class="pt5 pb5 pl15"
                        :key="`search-col-${item.id}`">{{item.description}}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="广告描述:" prop="description">
              <Input v-model="advertisementDetail.description" placeholder="广告描述"/>
            </FormItem>
          </Row>

          <Row>
            <Col span="12">
            <FormItem label="广告类型:" prop="advertiseType">
              <Select v-model="advertisementDetail.advertiseType" @on-change="advertiseTypeChange"
                      style="width: auto">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in advertiseType"
                        :value="item.value"
                        :key="index">{{ item.label}}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="广告状态:" prop="advertiseStatus">
              <Select v-model="advertisementDetail.advertiseStatus" @on-change="advertisementDetailStatusChange"
                      style="width: auto">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in useAble" :value="item.value"
                        :key="index">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem :label='advertisementDetail.advertiseType ==="IMAGE"?"商品主图:建议尺寸 (xxx*xxx):":"广告文字:"'
                      prop="content"
                      :label-width="80">
              <div v-if="advertisementDetail.advertiseType ==='IMAGE'">
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
              </div>
              <div v-else>
                <Input v-model="advertisementDetail.content" placeholder="广告文字内容"/>
              </div>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="链接类型:" prop="relationType">
              <Select v-model="advertisementDetail.relationType" @on-change="advertiseRelationTypeChange"
              >
                <Option class="ptb2-5"  v-for="(item,index) in relationType"
                        :value="item.value"
                        :key="index">{{item.label}}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <Row span="24" align="middle" type="flex">
              <Col span="18">
              <FormItem label="链接目标:" prop="shelfStatus">
                <Input :disabled="advertisementDetail.relationType !== 'EXTERNAL_LINKS'"/>
              </FormItem>
              </Col>
              <i-col span="6">
                <Button v-waves @click="searchAdvertisementRelation" class="search-btn mt-25" style="margin-left: 15px"
                        type="primary">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
              </i-col>
            </Row>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="有效时间:">
              <Select v-model="advertisementDetail.isPermanent" @on-change="advertiseRelationTypeChange"
                      style="width: 200px"
              >
                <Option class="ptb2-5" v-for="(item,index) in validityTimeList"
                        :value="item.value"
                        :key="index">{{item.label}}
                </Option>
              </Select>
              <Row span="24" v-if="advertisementDetail.isPermanent ==='OFF'" class="mt15">
                <DatePicker v-model="advertisementDetail.createAt" type="datetime" placeholder="开始时间"
                            @on-change="startTimeChange"/>
                <i class="mr5 ml5">-</i>
                <DatePicker v-model="advertisementDetail.endAt" type="datetime" placeholder="结束时间"/>
              </Row>
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
    <Modal title="View Image" v-model="uploadVisible">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
    <Modal title="View Image"
           :mask-closable="false"
           v-model="relationTargetShow">
      <div>search</div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {
    checkUiPosition,
    getAdvertisementsPages,
    getOnSaleData,
    getProductShelvesPages
  } from '@/api/fruitermaster';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js'
  import searchMixin from '@/mixins/searchMixin.js'
  import uploadMixin from '@/mixins/uploadMixin'
  import IViewUpload from '_c/iview-upload'
  import _ from 'lodash'

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
  const advertisementDetail = {
    id: 0,
    positionId: 0,
    image: "",
    advertiseName: "",
    advertiseRelation: "",
    advertiseType: "IMAGE",
    advertiseStatus: "",
    relationType: '',
    sorting: 0,
    beginAt: "",
    endAt: "",
    createAt: "",
    isPermanent: 'OFF'
  }
  const roleRowData = {
    advertiseName: '',
    id: '',
    page: 1,
    rows: 10
  };

  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    created() {
      checkUiPosition({
        includeSection: "NO",
        page: 0,
        rows: 0
      }).then(res => {
        this.selectDisable = false
        this.advertisementList = res.array
        this.getTableData();
      })
    },
    data() {
      return {
        modalViewLoading: false,
        relationTargetShow: false,
        selectDisable: true,
        advertisementList: [],
        ruleInline: {
          advertiseName: [{required: true, message: '请选择广告位置'}],
          description: [{required: true, message: '请填写广告描述'}],
          advertiseType: [{required: true, message: '请选择广告类型'}],
          advertiseStatus: [{required: true, message: '请选择广告状态'}],
          content: [{required: true, message: '请填写广告文字内容或者上传图片'}],
          relationType: [{required: true, message: '请选择链接类型'}]
        },
        advertiseType: [
          {value: 'IMAGE', label: '图片广告'},
          {value: 'WORD', label: '文字广告'}
        ],
        // 鲜果师关联类型 -- PRODUCT_DETAILS("商品详情"),
        // PRODUCT_SECTION("商品版块"),
        // CUSTOM_PLAN("定制计划"),
        // CUSTOM_PLAN_SECTION("定制版块"),
        // ARTICLE_DETAILS("文章详情")
        relationType: [
          {value: 'PRODUCT_DETAILS', label: '商品详情',api:getProductShelvesPages},
          {value: 'PRODUCT_SECTION', label: '定制计划',},
          {value: 'CUSTOM_PLAN', label: '商品版块'},
          {value: 'STORE_LIVE_TELECAST', label: '门店直播'},
          {value: 'CUSTOM_PLAN_SECTION', label: '定制版块'},
          {value: 'ARTICLE_DETAILS', label: '文章详情'},
          {value: 'EXTERNAL_LINKS', label: '外部链接'},
        ],
        useAble: [{label: '开启', value: 'ON'}, {label: '关闭', value: 'OFF'}],
        validityTimeList: [
          {label: '永久有效', value: 'ON'},
          {label: '定时生效', value: 'OFF'}
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
            title: 'ID',
            key: 'positionId',
            sortable: true,
            minWidth: 80,
            fixed: 'left'
          },
          {
            title: '广告内容',
            width: 150,
            render: (h, params, vm) => {
              const {row} = params;
              if (row.advertiseType === 'IMAGE') {
                const str = <img src={row.content} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
                return <div>{str}</div>;
              } else {
                return <div>{row.content}</div>;
              }
            }
          },
          {
            title: '广告描述',
            width: 150,
            key: 'advertiseName'
          },
          {
            title: '广告类型',
            width: 150,
            key: 'advertiseType'
          },
          {
            title: '链接类型',
            width: 180,
            key: 'relationType'
          },
          {
            title: '广告状态',
            minWidth: 110,
            key: 'advertiseStatus'
          },
          {
            title: '有效时间',
            minWidth: 300,
            key: 'validityPeriod'
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'onSale']
          }
        ],
        defaultListMain: [],
        uploadListMain: [],
        searchRowData: _.cloneDeep(roleRowData),
        fruitMasterDetail: fruitMasterDetail,
        advertisementDetail: _.cloneDeep(advertisementDetail)
      };
    },
    methods: {
      startTimeChange(value, date) {
        console.log(value);
        console.log(date);
      },
      handleSubmit(name) {
        console.log(this.advertisementDetail);
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              //添加状态
              // this.createProduct()
            } else if (this.tempModalType === this.modalType.edit) {
              //编辑状态
              // this.editProduct()
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        })
      },
      searchAdvertisementRelation() {
        if (this.advertisementDetail.relationType === null || this.advertisementDetail.relationType === '') {
          this.$Message.warning('请填写链接类型');
          return
        }
        this.relationTargetShow = true
        // {value: 'PRODUCT_DETAILS', label: '商品详情'},
        // {value: 'STORE_LIVE_TELECAST', label: '门店直播'},
        // {value: 'MORE_AMUSEMENT', label: '多娱'},
        // {value: 'EXTERNAL_LINKS', label: '外部链接'}
        if (this.advertisementDetail.relationType === 'PRODUCT_DETAILS') {

        }
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = []
        this.advertisementDetail.content = null
      },
      resetFields() {
        this.$refs.modalEdit.resetFields()
        this.$refs.uploadMain.clearFileList()
        this.uploadListMain = []
        this.advertisementDetail = _.cloneDeep(advertisementDetail)
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList
        this.advertisementDetail.content = null
        this.advertisementDetail.content = fileList[0].url
      },
      addChildren() {
        if (this.tempModalType !== this.modalType.cfreate) {
          this.resetFields()
          this.tempModalType = this.modalType.create
        }
        this.modalEdit = true;
      },
      poptipOk() {

      },
      onSale() {

      },
      resetSearchRowData() {
        this.searchRowData = _.cloneDeep(roleRowData);
      },
      handleView(params) {
        this.fruitMasterDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.fruitMasterDetail = params.row;
        this.modalEdit = true;
      },
      advertisementChange(value) {
        this.advertisementDetail.positionId = value
      },
      advertiseTypeChange(value) {
        // let i = 1
        // this.$refs.modalEdit.resetFields()
        if (value === 'WORD') {
          this.$refs.uploadMain.clearFileList()
          this.uploadListMain = []
        }
        this.advertisementDetail.content = ''

      },
      advertiseRelationTypeChange(value) {
      },
      advertisementDetailStatusChange(value) {

      },
      getTableData() {
        getAdvertisementsPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false
          this.clearSearchLoading = false
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
