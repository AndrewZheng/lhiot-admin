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
          <Input
            v-model="searchRowData.advertiseName"
            placeholder="广告名称"
            class="search-input mr5"
            style="width: 150px"/>
          <Select
            :disable="selectDisable"
            v-model="searchRowData.positionId"
            class="search-col mr5"
            placeholder="广告位置"
            style="width: 150px">
            <Option
              v-for="item in advertisementList"
              :value="item.id"
              :key="`search-col-${item.id}`"
              class="pt5 pb5 pl15">{{ item.description }}
            </Option>
          </Select>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class=" mr5" @click="addChildren">
            <Icon type="md-add"/>
            创建
          </Button>
          <Poptip
            confirm
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
          <Page
            :total="total"
            :current="page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="600"
    >
      <p slot="header">
        <span>广告详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="3">广告内容:</i-col>
          <i-col v-if="advertisementDetail.advertiseType === 'IMAGE'" span="21" class-name="mb10">
          <img :src="advertisementDetail.content" style="width: 100px;height: auto"></i-col>
          <i-col v-else span="21" class-name="mb10">{{ advertisementDetail.content }}</i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="3">广告位置:</i-col>
          <i-col span="21">{{ advertisementPositionComputed }}</i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告名称:</i-col>
              <i-col span="16">{{ advertisementDetail.advertiseName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告类型:</i-col>
              <i-col span="16">{{ advertisementTypeComputed }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接类型:</i-col>
              <i-col span="16">{{ relationTypeComputed }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接关联:</i-col>
              <i-col span="16">{{ advertisementDetail.advertiseRelation }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="3">有效时间:</i-col>
          <i-col span="21">{{ validityPeriodComputed }}</i-col>
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
        <span>{{ tempModalType===modalType.edit?'修改广告':'创建广告' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="advertisementDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <FormItem label="广告位置:" prop="positionId">
              <Select
                v-model="advertisementDetail.positionId"
                style="width: 200px"
                @on-change="advertisementChange">
                <Option
                  v-for="item in advertisementList"
                  :value="item.id"
                  :key="`search-col-${item.id}`"
                  class="pt5 pb5 pl15">{{ item.description }}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="广告名:" prop="advertiseName">
              <Input v-model="advertisementDetail.advertiseName" placeholder="广告名"/>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="广告类型:" prop="advertiseType">
              <Select
                v-model="advertisementDetail.advertiseType"
                style="width: auto"
                @on-change="advertiseTypeChange">
                <Option
                  v-for="(item,index) in advertiseType"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="广告状态:" prop="advertiseStatus">
              <Select
                v-model="advertisementDetail.advertiseStatus"
                style="width: auto"
                @on-change="advertisementDetailStatusChange">
                <Option
                  v-for="(item,index) in useAble"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem
              :label="advertisementDetail.advertiseType ===&quot;IMAGE&quot;?&quot;商品主图:建议尺寸 (xxx*xxx):&quot;:&quot;广告文字:&quot;"
              :label-width="80"
              prop="content">
              <div v-if="advertisementDetail.advertiseType ==='IMAGE'">
                <Input v-show="false" v-model="advertisementDetail.content" style="width: auto"/>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
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
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content">
                    <Button type="primary">
                      上传图片
                    </Button>
                  </div>
                </IViewUpload>
              </div>
              <div v-else>
                <Input v-model="tempContent" placeholder="广告文字内容" @on-change="advertiseNameChange"/>
              </div>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="链接类型:" prop="relationType">
              <Select
                v-model="advertisementDetail.relationType"
                @on-change="advertiseRelationTypeChange"
              >
                <Option
                  v-for="(item,index) in relationType"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <Row span="24" align="middle" type="flex">
              <Col span="18">
              <FormItem label="链接目标:" prop="advertiseRelation">
                <Input
                  v-model="advertisementDetail.advertiseRelationText"
                  :disabled="advertisementDetail.relationType !== 'EXTERNAL_LINKS'"/>
              </FormItem>
              </Col>
              <i-col span="6">
                <Button
                  v-waves
                  :loading="searchModalTableLoading"
                  class="search-btn mt-25"
                  style="margin-left: 15px"
                  type="primary"
                  @click="searchAdvertisementRelation">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
              </i-col>
            </Row>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="有效时间:">
              <Select
                v-model="advertisementDetail.isPermanent"
                style="width: 200px"
                @on-change="advertiseTimeChange"
              >
                <Option
                  v-for="(item,index) in validityTimeList"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5">{{ item.label }}
                </Option>
              </Select>
              <Row v-if="advertisementDetail.isPermanent ==='OFF'" span="24" class="mt15">
                <DatePicker
                  :value="advertisementDetail.beginAt"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="开始时间"
                  @on-change="startTimeChange"/>
                <i class="mr5 ml5">-</i>
                <DatePicker
                  :value="advertisementDetail.endAt"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  @on-change="endTimeChange"/>
              </Row>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
    <Modal
      :mask-closable="false"
      :width="1200"
      v-model="relationTargetShow"
      title="View Image">
      <div class="modal-content">
        <Table
          :columns="tempColumns"
          :data="tempModalTableData"
          border
          @on-row-click="onRowClick"
        ></Table>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getuiPositionsPages,
  createAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  getAdvertisementsPages,
  getProductShelvesPages,
  getCustomPlansPages,
  getProductSectionsPages,
  getCustomPlanSectionsPages,
  getArticlesPages,
  getAdvertisement
} from '@/api/fruitermaster';
import { goodsOnSalesColumns, customPlanColumns, goodsModulsColumns, customPlanSectionColumns, articleColumns } from '@/libs/columns';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';
import { compareData } from '@/libs/util';
import { positionType, YNEnum } from '@/libs/enumerate';
import { relationType } from '../../../libs/enumerate';

const advertisementDetail = {
  id: 0,
  positionId: 0,
  image: '',
  advertiseName: '',
  advertiseRelation: '',
  advertiseType: 'IMAGE',
  advertiseStatus: '',
  relationType: '',
  sorting: 0,
  beginAt: '',
  endAt: '',
  createAt: '',
  isPermanent: 'OFF',
  validityPeriod: '',
  advertiseRelationText: ''
};
const roleRowData = {
  advertiseName: '',
  positionId: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      modalViewLoading: false,
      searchModalTableLoading: false,
      relationTargetShow: false,
      selectDisable: true,
      advertisementList: [],
      ruleInline: {
        advertiseName: [{ required: true, message: '请选择广告位置' }],
        description: [{ required: true, message: '请填写广告描述' }],
        advertiseType: [{ required: true, message: '请选择广告类型' }],
        advertiseStatus: [{ required: true, message: '请选择广告状态' }],
        content: [{ required: true, message: '请填写广告文字内容或者上传图片' }],
        relationType: [{ required: true, message: '请选择链接类型' }],
        advertiseRelation: [{ required: true, message: '请填写链接目标' }],
        positionId: [{ required: true, message: '请选择广告位置' }]
      },
      advertiseType: [
        { value: 'IMAGE', label: '图片广告' },
        { value: 'TEXT', label: '文字广告' }
      ],
      relationType: [
        { value: relationType.PRODUCT_DETAILS, label: '商品详情', api: getProductShelvesPages, columns: goodsOnSalesColumns },
        { value: relationType.PRODUCT_SECTION, label: '商品版块', api: getProductSectionsPages, columns: goodsModulsColumns },
        { value: relationType.CUSTOM_PLAN, label: '定制计划', api: getCustomPlansPages, columns: customPlanColumns },
        { value: relationType.CUSTOM_PLAN_SECTION, label: '定制版块', api: getCustomPlanSectionsPages, columns: customPlanSectionColumns },
        { value: relationType.ARTICLE_DETAILS, label: '文章详情', api: getArticlesPages, columns: articleColumns },
        // {value: relationType.STORE_LIVE_TELECAST, label: '门店直播', api: getProductShelvesPages},
        // {value: relationType.MORE_AMUSEMENT, label: '多娱', api: getProductShelvesPages},
        { value: relationType.EXTERNAL_LINKS, label: '外部链接', api: getProductShelvesPages }
      ],
      tempColumns: [],
      tempModalTableData: [],
      relationTypeKeys: [],
      useAble: [{ label: '开启', value: 'ON' }, { label: '关闭', value: 'OFF' }],
      validityTimeList: [
        { label: '永久有效', value: 'ON' },
        { label: '定时生效', value: 'OFF' }
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
          key: 'id',
          sortable: true,
          minWidth: 80,
          fixed: 'left'
        },
        {
          title: '广告内容',
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.advertiseType === 'IMAGE') {
              const str = <img src={row.content} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
              return <div>{str}</div>;
            } else {
              return <div>{row.content}</div>;
            }
          }
        },
        {
          title: '广告名称',
          minWidth: 150,
          key: 'advertiseName'
        },
        {
          title: '广告类型',
          minWidth: 100,
          key: 'advertiseType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.advertiseType === 'IMAGE') {
              return <div>{'图片'}</div>;
            } else {
              return <div>{'文字'}</div>;
            }
          }
        },
        {
          title: '链接类型',
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            switch (row.relationType) {
              case 'PRODUCT_DETAILS':
                return <div>{'商品详情'}</div>;
              case 'PRODUCT_SECTION':
                return <div>{'定制计划'}</div>;
              case 'CUSTOM_PLAN':
                return <div>{'商品版块'}</div>;
              case 'STORE_LIVE_TELECAST':
                return <div>{'门店直播'}</div>;
              case 'CUSTOM_PLAN_SECTION':
                return <div>{'定制版块'}</div>;
              case 'ARTICLE_DETAILS':
                return <div>{'文章详情'}</div>;
              case 'EXTERNAL_LINKS':
                return <div>{'外部链接'}</div>;
              default :
                return <div>{row.relationType}</div>;
            }
          }
        },
        {
          title: '广告状态',
          minWidth: 110,
          key: 'advertiseStatus',
          render: (h, params, vm) => {
            const { row } = params;
            switch (row.advertiseStatus) {
              case 'ON':
                return <div>{'开启'}</div>;
              case 'OFF':
                return <div>{'关闭'}</div>;
              default :
                return <div>{row.advertiseStatus}</div>;
            }
          }
        },
        {
          title: '有效时间',
          minWidth: 110,
          key: 'validityPeriod'
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      defaultListMain: [],
      uploadListMain: [],
      searchRowData: _.cloneDeep(roleRowData),
      advertisementDetail: _.cloneDeep(advertisementDetail),
      tempContent: null,
      tempImage: null
    };
  },
  computed: {
    advertisementPositionComputed() {
      const tempObj = this.advertisementList.find(item => item.id === this.advertisementDetail.positionId);
      if (tempObj) {
        return tempObj.description;
      }
      return '';
    },
    advertisementTypeComputed() {
      if (this.advertisementDetail.advertiseType === 'IMAGE') {
        return '图片广告';
      } else {
        return '文字广告';
      }
    },
    relationTypeComputed() {
      const tempObj = this.relationType.find(item => item.value === this.advertisementDetail.relationType);
      if (tempObj) {
        return tempObj.label;
      } else {
        return advertisementDetail.relationType;
      }
    },
    validityPeriodComputed() {
      if (!this.advertisementDetail.endAt && !this.advertisementDetail.beginAt) {
        return '永久有效';
      } else {
        return this.advertisementDetail.beginAt + this.advertisementDetail.endAt;
      }
    }
  },
  created() {
    getuiPositionsPages({
      applicationType: 'HEALTH_GOOD',
      includeSection: YNEnum.NO,
      positionType: positionType.ADVERTISEMENT,
      page: 0,
      rows: 0
    }).then(res => {
      this.selectDisable = false;
      this.advertisementList = res.array;
      this.getTableData();
    });
  },
  methods: {
    advertiseNameChange() {
      this.advertisementDetail.content = this.tempContent;
      console.log(this.advertisementDetail.content);
    },
    advertiseTypeChange(value) {
      console.log(value);
      if (value === 'TEXT') {
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.clearFileList();
        }
        this.uploadListMain = [];
        this.advertisementDetail.content = this.tempContent;
      } else if (value === 'IMAGE') {
        if (this.tempImage != null) {
          const map = { status: 'finished', url: 'url' };
          const mainImgArr = [];
          map.url = this.tempImage;
          mainImgArr.push(map);
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          }
          this.uploadListMain = mainImgArr;
        } else {
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.clearFileList();
          }
          this.uploadListMain = [];
        }
        this.advertisementDetail.content = this.tempImage;
      }
      // 切换成图片

      // 切换成文字
      // if (value) ;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteAdvertisement({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length === this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(() => {
        this.loading = false;
      });
    },
    onRowClick(row, index) {
      if (this.advertisementDetail.relationType === relationType.PRODUCT_SECTION ||
          this.advertisementDetail.relationType === relationType.CUSTOM_PLAN_SECTION) {
        this.advertisementDetail.advertiseRelationText = row.sectionName;
      } else if (this.advertisementDetail.relationType === relationType.ARTICLE_DETAILS) {
        this.advertisementDetail.advertiseRelationText = row.title;
      } else {
        this.advertisementDetail.advertiseRelationText = row.name;
      }
      this.advertisementDetail.advertiseRelation = row.id;
      console.log(row);
      console.log(index);
      this.relationTargetShow = false;
    },
    startTimeChange(value, date) {
      this.advertisementDetail.beginAt = value;
    },
    endTimeChange(value, date) {
      this.advertisementDetail.endAt = value;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (this.advertisementDetail.isPermanent === 'OFF') {
          if (this.advertisementDetail.beginAt === '') {
            this.$Message.error('请填写开始时间!');
            return;
          }
          if (this.advertisementDetail.endAt === '') {
            this.$Message.error('请填写结束时间!');
            return;
          }
          if (compareData(this.advertisementDetail.beginAt, this.advertisementDetail.endAt)) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
        }
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
    editTableRow() {
      this.modalViewLoading = true;
      editAdvertisement({
        ...this.advertisementDetail
      }).then(res => {
        this.resetFields();
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      });
    },
    createTableRow() {
      this.modalViewLoading = true;
      createAdvertisement(this.advertisementDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.resetFields();
        this.getTableData();
      });
    },
    searchAdvertisementRelation() {
      if (this.advertisementDetail.relationType === null || this.advertisementDetail.relationType === '') {
        this.$Message.warning('请填写链接类型');
        return;
      }
      this.searchModalTableLoading = true;
      const tempObj = this.relationType.find(item => {
        return item.value === this.advertisementDetail.relationType;
      });
      console.log(tempObj);
      if (tempObj) {
        this.tempColumns = tempObj.columns;
        console.log(this.tempColumns);
        tempObj.api({
          page: 1,
          rows: 10,
          shelfStatus: 'ON',
          status: 'VALID',
          articleStatus: 'PUBLISH'
        }).then(res => {
          this.searchModalTableLoading = false;
          this.relationTargetShow = true;
          this.tempModalTableData = res.array;
        });
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.advertisementDetail.content = null;
    },
    resetFields() {
      this.tempImage = null;
      this.tempContent = null;
      this.$refs.modalEdit.resetFields();
      if (this.$refs.uploadMain) {
        this.$refs.uploadMain.clearFileList();
      }
      this.uploadListMain = [];
      this.advertisementDetail = _.cloneDeep(advertisementDetail);
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.advertisementDetail.content = null;
      this.advertisementDetail.content = fileList[0].url;
      this.tempImage = fileList[0].url;
    },
    addChildren() {
      if (this.tempModalType !== this.modalType.create) {
        this.resetFields();
        this.tempModalType = this.modalType.create;
      }
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.advertisementDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempImage = null;
      this.tempContent = null;
      this.tempModalType = this.modalType.edit;

      this.loading = true;
      getAdvertisement({ id: params.row.id }).then(res => {
        this.advertisementDetail = res;
        if (this.advertisementDetail.advertiseType === 'IMAGE') {
          this.tempImage = this.advertisementDetail.content;
          this.setDefaultUploadList(params.row);
        } else {
          this.tempContent = this.advertisementDetail.content;
        }
        if (!this.advertisementDetail.endAt && !this.advertisementDetail.beginAt) {
          this.advertisementDetail.isPermanent = 'ON';
        } else {
          this.advertisementDetail.isPermanent = 'OFF';
        }
        this.loading = false;
        this.modalEdit = true;
      }).catch(() => {
        this.loading = false;
      });
    },
    setDefaultUploadList(res) {
      if (res.content != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.content;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    advertisementChange(value) {
      this.advertisementDetail.positionId = value;
    },
    advertiseRelationTypeChange(value) {
      this.advertisementDetail.relationType = value;
      console.log(value);
    },
    advertisementDetailStatusChange(value) {

    },
    advertiseTimeChange() {

    },
    getTableData() {
      getAdvertisementsPages(this.searchRowData).then(res => {
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
