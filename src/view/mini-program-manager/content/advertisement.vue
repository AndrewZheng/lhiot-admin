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
        @custom-on-sale="onOff"
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.advertisementName"
            placeholder="广告名称"
            class="search-input mr5"
            style="width: 150px"
            clearable
          ></Input>
          <Select
            :disable="selectDisable"
            v-model="searchRowData.positionId"
            class="search-col mr5"
            placeholder="广告位置"
            style="width:150px"
            clearable
          >
            <Option
              v-for="item in advertisementList"
              :value="item.id"
              :key="`search-col-${item.id}`"
              class="pt5 pb5 pl15"
            >{{ item.description }}</Option>
          </Select>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button
            v-waves
            :loading="clearSearchLoading"
            class="search-btn"
            type="info"
            @click="handleClear"
          >
            <Icon type="md-refresh" />&nbsp;清除
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren">
            <Icon type="md-add" />添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
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
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false" :width="600">
      <p slot="header">
        <span>广告详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告位置:</i-col>
              <i-col span="16">{{ advertisementPositionComputed }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告名称:</i-col>
              <i-col span="16">{{ advertisementDetail.advertisementName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">内容描述:</i-col>
              <i-col span="16">{{ advertisementDetail.contentDesc }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告图:</i-col>
              <i-col span="16">
                <img :src="advertisementDetail.imageUrl" style="width: 100%;height: auto" >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告状态:</i-col>
              <i-col span="16">{{ advertisementDetail.status | couponStatusFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告序号:</i-col>
              <i-col span="16">{{ advertisementDetail.rankNo }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接类型:</i-col>
              <i-col span="16">{{ advertisementDetail.linkType | advertisementLinkTypeFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接目标:</i-col>
              <i-col span="16">{{ advertisementDetail.advertiseRelation }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="16">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">有效时间:</i-col>
              <i-col span="16">{{ validityPeriodComputed }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">有效时间:</i-col>
              <i-col span="16">{{ advertisementDetail.validTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">失效时间:</i-col>
              <i-col span="16">{{ advertisementDetail.invalidTime }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">创建人:</i-col>
              <i-col span="16">{{ advertisementDetail.createUser }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{ advertisementDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="750" :mask-closable="false">
      <p slot="header">
        <span>{{ tempModalType===modalType.edit?'修改广告':'创建广告' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="advertisementDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <i-col span="12">
              <FormItem label="广告位置:" prop="positionId">
                <Select
                  v-model="advertisementDetail.positionId"
                  style="width: 200px"
                  @on-change="advertisementChange"
                >
                  <Option
                    v-for="item in advertisementList"
                    :value="item.id"
                    :key="`search-col-${item.id}`"
                    class="pt5 pb5 pl15"
                  >{{ item.description }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="广告名:" prop="advertisementName">
                <Input
                  v-model="advertisementDetail.advertisementName"
                  placeholder="广告名"
                  style="width: 220px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <FormItem label="内容描述:" prop="contentDesc">
              <Input
                v-model="advertisementDetail.contentDesc"
                placeholder="内容描述"
                style="width: 580px"
              ></Input>
            </FormItem>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="广告类型:" prop="advertiseType">
                <Select
                  v-model="advertisementDetail.advertiseType"
                  style="width: 200px"
                  @on-change="advertiseTypeChange"
                >
                  <Option
                    v-for="(item,index) in advertiseType"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem
                :label-width="80"
                :label="advertisementDetail.advertiseType ===&quot;IMAGE&quot;?&quot;广告图片:建议尺寸 (xxx*xxx):&quot;:&quot;广告文字:&quot;"
                prop="imageUrl"
              >
                <div v-if="advertisementDetail.advertiseType ==='IMAGE'">
                  <Input v-show="false" v-model="advertisementDetail.imageUrl" style="width: auto"></Input>
                  <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <div>
                        <img :src="item.url" >
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
                    group-type="activity_image"
                    file-dir="activity"
                    @on-success="handleSuccessMain"
                  >
                    <div slot="content" style="width:58px;height:58px;line-height:58px">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </IViewUpload>
                </div>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="广告状态:" prop="status">
                <Select
                  v-model="advertisementDetail.status"
                  style="width: 200px"
                  @on-change="advertisementDetailStatusChange"
                >
                  <Option
                    v-for="(item,index) in status"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="广告序号:" prop="rankNo">
                <InputNumber
                  :min="0"
                  v-model="advertisementDetail.rankNo"
                  placeholder="广告序号"
                  style="width: 220px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="链接类型:" prop="linkType">
                <Select
                  v-model="advertisementDetail.linkType"
                  style="width: 200px"
                  @on-change="advertiseLinkTypeChange"
                >
                  <Option
                    v-for="(item,index) in linkType"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Row span="24" align="middle" type="flex">
                <FormItem label="链接目标:" prop="advertisementRelation">
                  <Row v-if="isTargetLink">
                    <Input v-model="advertisementDetail.advertisementRelation" style="width:200px;"></Input>
                  </Row>
                  <Row v-else>
                    <i-col span="24">
                      <Input
                        v-model="advertisementDetail.advertisementRelationText"
                        :disabled="advertisementDetail.linkType !== 'EXTERNALLINK'"
                      >
                      <Button
                        v-waves
                        slot="append"
                        :loading="searchModalTableLoading"
                        class="search-btn"
                        type="primary"
                        @click="searchAdvertisementRelation"
                      >
                        <Icon type="md-search" />&nbsp;搜索
                      </Button>
                      </Input>
                    </i-col>
                  </Row>
                </FormItem>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="有效时间:">
                <Select
                  v-model="advertisementDetail.isPermanent"
                  style="width: 200px"
                  disabled
                  @on-change="advertiseTimeChange"
                >
                  <Option
                    v-for="(item,index) in validityTimeList"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
                <Row v-if="advertisementDetail.isPermanent ==='OFF'" span="24" class="mt15">
                  <DatePicker
                    :value="advertisementDetail.validTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 200px"
                    @on-change="startTimeChange"
                  />
                  <i class="mr5 ml5">-</i>
                  <DatePicker
                    :value="advertisementDetail.invalidTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 200px"
                    @on-change="endTimeChange"
                  />
                </Row>
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

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" >
    </Modal>

    <Modal :mask-closable="false" :width="1200" v-model="relationTargetShow" title="关联商品规格">
      <div class="modal-content">
        Tips：点击要选择的行
        <tables
          ref="tables"
          :columns="tempColumns"
          v-model="tempModalTableData"
          border
          searchable
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchRelationRowData.productCode"
                placeholder="商品编码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRelationRowData.productName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleRelationSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleProductClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
            </Row>
          </div>
        </tables>

        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="relationTotal"
              :current="searchRelationRowData.page"
              show-sizer
              show-total
              @on-change="changeRelationPage"
              @on-page-size-change="changeRelationPageSize"
            ></Page>
          </Row>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  getAdvertisementPositionPages,
  createAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  getAdvertisementPages,
  getAdvertisement,
  getProductStandardsPages,
  deletePicture
} from '@/api/mini-program';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';
import { compareData } from '@/libs/util';
import { linkType, linkTypeEnum } from '@/libs/enumerate';
import {
  couponStatusConvert,
  advertisementLinkTypeConvert
} from '@/libs/converStatus';
import { miniGoodsStandardColumns } from '@/libs/columns';

const advertisementDetail = {
  id: 0,
  linkType: null,
  rankNo: 0,
  imageUrl: '',
  advertisementRelation: '',
  advertisementName: '',
  createTime: null,
  status: null,
  validTime: null,
  invalidTime: null,
  positionId: 0,
  createUser: '',
  contentDesc: '',
  relationId: 0,
  advertisementPosition: null,
  isPermanent: 'OFF',
  advertiseType: 'IMAGE',
  validityPeriod: '',
  advertisementRelationText: ''
};
const roleRowData = {
  applicationType: null,
  advertisementName: null,
  positionId: null,
  page: 1,
  rows: 10
};

const relationRowData = {
  productCode: null,
  productName: null,
  shelvesStatus: 'VALID',
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
        advertisementName: [{ required: true, message: '请输入广告名称' }],
        contentDesc: [{ required: true, message: '请填写广告内容描述' }],
        advertiseType: [{ required: true, message: '请选择广告类型' }],
        status: [{ required: true, message: '请选择广告状态' }],
        linkType: [{ required: true, message: '请选择链接类型' }],
        advertisementRelation: [{ required: true, message: '请填写链接目标' }],
        positionId: [{ required: true, message: '请选择广告位置' }],
        rankNo: [
          { required: true, message: '请输入序号' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      advertiseType: [
        { value: 'IMAGE', label: '图片广告' },
        { value: 'TEXT', label: '文字广告' }
      ],
      linkType: [
        {
          value: linkType.GOODSINFO,
          label: '商品详情',
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns
        },
        {
          value: linkType.INVITEACTIVE,
          label: '邀请有礼',
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns
        },
        {
          value: linkType.FLASHACTIVE,
          label: '抢购商品',
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns
        },
        {
          value: linkType.RECHARGE,
          label: '充值页面',
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns
        },
        { value: linkType.EXTERNALLINK, label: '外部链接' },
        { value: linkType.INTERNALLINK, label: '内部链接' },
        { value: linkType.TABLINK, label: '底部导航' }
      ],
      tempColumns: [],
      linkTypeEnum,
      tempModalTableData: [],
      relationTypeKeys: [],
      status: [
        { label: '有效', value: 'VALID' },
        { label: '无效', value: 'INVALID' }
      ],
      validityTimeList: [{ label: '定时生效', value: 'OFF' }],
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
          align: 'center',
          key: 'id',
          sortable: true,
          minWidth: 70
        },
        {
          title: '链接类型',
          align: 'center',
          minWidth: 100,
          key: 'linkType',
          render: (h, params, vm) => {
            const { row } = params;
            return (
              <div>{advertisementLinkTypeConvert(row.linkType).label}</div>
            );
          }
        },
        // {
        //   title: '序号',
        //   key: 'rankNo',
        //   sortable: true,
        //   minWidth: 80
        // },
        {
          title: '图片',
          align: 'center',
          width: 120,
          key: 'imageUrl',
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.imageUrl} height='60' width='100' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '广告关联',
          align: 'center',
          minWidth: 110,
          key: 'advertisementRelation'
        },
        {
          title: '广告名称',
          align: 'center',
          minWidth: 150,
          key: 'advertisementName'
        },
        {
          title: '创建时间',
          align: 'center',
          minWidth: 170,
          key: 'createTime'
        },
        {
          title: '当前状态',
          align: 'center',
          minWidth: 100,
          key: 'status',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.status}</tag>
              </div>
            );
          }
        },
        {
          title: '生效时间',
          align: 'center',
          minWidth: 170,
          key: 'validTime'
        },
        {
          title: '失效时间',
          align: 'center',
          minWidth: 170,
          key: 'invalidTime'
        },
        {
          title: '广告位置',
          align: 'center',
          minWidth: 160,
          key: 'positionId',
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.advertisementList.find(item => {
              return item.id === row.positionId;
            });
            if (obj) {
              return h('span', obj.description + '');
            } else {
              return h('span', row.positionId + '');
            }
          }
        },
        {
          title: '创建人',
          align: 'center',
          minWidth: 150,
          key: 'createUser'
        },
        {
          title: '内容描述',
          align: 'center',
          minWidth: 150,
          key: 'contentDesc',
          tooltip: true
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'delete']
        }
      ],
      defaultListMain: [],
      uploadListMain: [],
      searchRowData: _.cloneDeep(roleRowData),
      advertisementDetail: _.cloneDeep(advertisementDetail),
      searchRelationRowData: _.cloneDeep(relationRowData),
      tempContent: null,
      tempImage: null,
      relationTotal: 0,
      oldPicture: [],
      newPicture: [],
      save: []
    };
  },
  computed: {
    isTargetLink() {
      return (
        this.advertisementDetail.linkType === 'EXTERNALLINK' ||
        this.advertisementDetail.linkType === 'INTERNALLINK' ||
        this.advertisementDetail.linkType === 'TABLINK'
      );
    },
    advertisementPositionComputed() {
      const tempObj = this.advertisementList.find(
        item => item.id === this.advertisementDetail.positionId
      );
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
    validityPeriodComputed() {
      if (
        !this.advertisementDetail.invalidTime &&
        !this.advertisementDetail.validTime
      ) {
        return '永久有效';
      } else {
        return (
          this.advertisementDetail.validTime +
          '--' +
          this.advertisementDetail.invalidTime
        );
      }
    }
  },
  created() {
    getAdvertisementPositionPages({
      page: 0,
      rows: 0
    }).then(res => {
      this.selectDisable = false;
      this.advertisementList = res.rows;
      this.getTableData();
    });
  },
  methods: {
    advertiseTypeChange(value) {
      console.log(value);
      if (value === 'TEXT') {
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.clearFileList();
        }
        this.uploadListMain = [];
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
    },
    deleteTable(ids) {
      this.loading = true;
      deleteAdvertisement({
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
    startTimeChange(value, date) {
      this.advertisementDetail.validTime = value;
    },
    endTimeChange(value, date) {
      this.advertisementDetail.invalidTime = value;
    },
    handleSubmit(name) {
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.advertisementDetail.isPermanent === 'OFF') {
            if (this.advertisementDetail.validTime === '') {
              this.$Message.error('请填写开始时间!');
              return;
            }
            if (this.advertisementDetail.invalidTime === '') {
              this.$Message.error('请填写结束时间!');
              return;
            }
            if (
              compareData(
                this.advertisementDetail.validTime,
                this.advertisementDetail.invalidTime
              )
            ) {
              this.$Message.error('结束时间必须大于开始时间!');
              return;
            }
            if (
              this.advertisementDetail.advertiseType === 'IMAGE' &&
              this.advertisementDetail.imageUrl === null
            ) {
              this.$Message.error('请上传广告图片!');
              return;
            }
          }
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            console.log(
              'createTableRow' + JSON.stringify(this.advertisementDetail)
            );
            this.createTableRow();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            console.log(
              'editTableRow' + JSON.stringify(this.advertisementDetail)
            );
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = {
      //     urls: this.newPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    // deletePicture(urls) {
    //   deletePicture({
    //     urls
    //   })
    //     .then(res => {})
    //     .catch(() => {});
    // },
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
      if (
        this.advertisementDetail.linkType === null ||
        this.advertisementDetail.linkType === ''
      ) {
        this.$Message.warning('请填写链接类型');
        return;
      }
      this.getRelationTable();
    },
    getRelationTable() {
      this.searchModalTableLoading = true;
      const tempObj = this.linkType.find(item => {
        return item.value === this.advertisementDetail.linkType;
      });
      console.log(tempObj);
      if (tempObj) {
        this.tempColumns = tempObj.columns;
        console.log(this.tempColumns);
        tempObj.api(this.searchRelationRowData).then(res => {
          this.searchModalTableLoading = false;
          this.relationTargetShow = true;
          this.tempModalTableData = res.rows;
          this.relationTotal = res.total;
        });
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.advertisementDetail.imageUrl = null;
    },
    resetFields() {
      this.tempImage = null;
      this.$refs.modalEdit.resetFields();
      if (this.$refs.uploadMain) {
        this.$refs.uploadMain.clearFileList();
      }
      this.uploadListMain = [];
      this.advertisementDetail = _.cloneDeep(advertisementDetail);
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.advertisementDetail.imageUrl = null;
      this.advertisementDetail.imageUrl = fileList[0].url;
      this.tempImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
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
      this.save = [];
      this.save.push(params.row.imageUrl);
      this.$refs.modalEdit.resetFields();
      this.tempImage = null;
      this.loading = true;
      getAdvertisement({ id: params.row.id, flag: 'yes' })
        .then(res => {
          this.advertisementDetail = res;
          this.setDefaultUploadList(this.advertisementDetail);
          if (
            !this.advertisementDetail.invalidTime &&
            !this.advertisementDetail.validTime
          ) {
            this.advertisementDetail.isPermanent = 'ON';
          } else {
            this.advertisementDetail.isPermanent = 'OFF';
          }
          this.advertisementDetail.advertiseType = 'IMAGE';
          this.loading = false;
          this.tempModalType = this.modalType.edit;
          this.modalEdit = true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    setDefaultUploadList(res) {
      if (res.imageUrl != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.imageUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    advertisementChange(value) {
      this.advertisementDetail.positionId = value;
    },
    advertiseLinkTypeChange(value) {
      this.advertisementDetail.linkType = value;
      console.log(value);
    },
    advertisementDetailStatusChange(value) {
      this.advertisementDetail.status = value;
    },
    advertiseTimeChange() {},
    getTableData() {
      this.searchRowData.applicationType = this.applicationType;
      getAdvertisementPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    onRowClick(row, index) {
      if (this.advertisementDetail.linkType === linkType.GOODSINFO) {
        this.advertisementDetail.advertisementRelationText = row.productName;
      } else {
        this.advertisementDetail.advertisementRelationText = row.name;
      }
      this.advertisementDetail.advertisementRelation = row.id;
      this.relationTargetShow = false;
    },
    changeRelationPage(page) {
      this.searchRelationRowData.page = page;
      this.getRelationTable();
    },
    changeRelationPageSize(pageSize) {
      this.searchRelationRowData.page = 1;
      this.searchRelationRowData.rows = pageSize;
      this.getRelationTable();
    },
    handleRelationSearch() {
      this.searchRelationRowData.page = 1;
      this.searchLoading = true;
      this.getRelationTable();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleRelationSearch();
    },
    onOff(params) {
      this.advertisementDetail = this._.cloneDeep(params.row);
      if (params.row.status === 'VALID') {
        this.advertisementDetail.status = 'INVALID';
      } else {
        this.advertisementDetail.status = 'VALID';
      }
      this.loading = true;
      this.editTableRow();
    },
    relationTextChange(event) {
      this.advertisementDetail.advertisementRelation = event;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
