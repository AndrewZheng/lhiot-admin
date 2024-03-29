<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="18"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @custom-on-sale="handleSwitch"
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
            v-model="searchRowData.positionId"
            :disable="selectDisable"
            class="search-col mr5"
            placeholder="广告位置"
            style="width: 150px"
            clearable
          >
            <Option
              v-for="(item,index) in advertisementList"
              :key="`adv-${index}`"
              :value="item.id"
              class="pt5 pb5 pl15"
            >
              {{ item.description }}
            </Option>
          </Select>
          <Select
            v-model="searchRowData.status"
            class="search-col mr5"
            placeholder="状态"
            style="width: 100px"
            clearable
          >
            <Option
              v-for="(item,index) in status"
              :key="`status-${index}`"
              :value="item.value"
              class="pt5 pb5 pl15"
            >
              {{ item.label }}
            </Option>
          </Select>
          <Select
            v-model="searchRowData.linkType"
            class="search-col mr5"
            placeholder="链接类型"
            style="width: 100px"
            clearable
          >
            <Option
              v-for="(item,index) in linkTypeEnum"
              :key="`status-${index}`"
              :value="item.value"
              class="pt5 pb5 pl15"
            >
              {{ item.label }}
            </Option>
          </Select>
          <Button
            v-waves
            class="search-btn mr5"
            type="primary"
            @click="handleSearch"
          >
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
          <Button v-waves type="success" class="mr5" @click="handleCreate">
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
      <div style="margin: 10px; overflow: hidden">
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
              <i-col span="8">
                广告位置:
              </i-col>
              <i-col span="16">
                {{ advertisementPositionComputed }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                广告名称:
              </i-col>
              <i-col span="16">
                {{
                  advertisementDetail.advertisementName
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                内容描述:
              </i-col>
              <i-col span="16">
                {{ advertisementDetail.contentDesc }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                广告图:
              </i-col>
              <i-col span="16">
                <img
                  :src="advertisementDetail.imageUrl"
                  style="width: 100%; height: auto"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                广告状态:
              </i-col>
              <i-col span="16">
                {{
                  advertisementDetail.status | couponStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                广告序号:
              </i-col>
              <i-col span="16">
                {{ advertisementDetail.rankNo }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                链接类型:
              </i-col>
              <i-col span="16">
                {{
                  advertisementDetail.linkType | advertisementLinkTypeFilter
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                链接目标:
              </i-col>
              <i-col span="16">
                {{
                  advertisementDetail.advertiseRelation
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="4">
            有效时间:
          </i-col>
          <i-col span="16">
            {{ validityPeriodComputed }}
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                创建人:
              </i-col>
              <i-col span="16">
                {{ advertisementDetail.createUser }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">
                创建时间:
              </i-col>
              <i-col span="16">
                {{ advertisementDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="750" :mask-closable="false">
      <p slot="header">
        <span>{{
          isEdit ? "修改广告" : "创建广告"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="advertisementDetail"
          :rules="ruleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="12">
              <FormItem label="广告位置:" prop="positionId">
                <Select
                  v-model="advertisementDetail.positionId"
                  style="width: 200px"
                  @on-change="advertisementChange"
                >
                  <Option
                    v-for="(item,index) in advertisementList"
                    :key="`modal-adv-${index}`"
                    :value="item.id"
                    class="pt5 pb5 pl15"
                  >
                    {{ item.description }}
                  </Option>
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
                    v-for="(item, index) in advertiseType"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem
                :label-width="80"
                :label="
                  advertisementDetail.advertiseType === 'IMAGE'
                    ? '广告图片:建议尺寸 (xxx*xxx):'
                    : '广告文字:'
                "
                prop="imageUrl"
              >
                <div v-if="advertisementDetail.advertiseType === 'IMAGE'">
                  <Input
                    v-show="false"
                    v-model="advertisementDetail.imageUrl"
                    style="width: auto"
                  ></Input>
                  <div
                    v-for="item in uploadListMain"
                    :key="item.url"
                    class="demo-upload-list"
                  >
                    <template v-if="item.status === 'finished'">
                      <div>
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                          <Icon
                            type="ios-eye-outline"
                            @click.native="handleUploadView(item)"
                          ></Icon>
                          <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemoveMain(item)"
                          ></Icon>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <Progress
                        v-if="item.showProgress"
                        :percent="item.percentage"
                        hide-info
                      ></Progress>
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
                    <div
                      slot="content"
                      style="width: 58px; height: 58px; line-height: 58px"
                    >
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
                  @on-change="advDetailStatusChange"
                >
                  <Option
                    v-for="(item, index) in status"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="广告序号:" prop="rankNo">
                <InputNumber
                  v-model="advertisementDetail.rankNo"
                  :min="0"
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
                  @on-change="advLinkTypeChange"
                >
                  <Option
                    v-for="(item, index) in linkType"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row span="24" align="middle" type="flex">
            <i-col span="24">
              <FormItem label="链接目标:" prop="advertisementRelation">
                <Row v-if="isTargetLink">
                  <Input
                    v-model="advertisementDetail.advertisementRelation"
                  ></Input>
                </Row>
                <Row v-else>
                  <i-col span="24">
                    <Input
                      v-model="advertisementDetail.advertisementRelationText"
                      :disabled="
                        advertisementDetail.linkType !== 'EXTERNALLINK'
                      "
                    >
                    <Button
                      slot="append"
                      v-waves
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
                    v-for="(item, index) in validityTimeList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
                <Row
                  v-if="advertisementDetail.isPermanent === 'OFF'"
                  span="24"
                  class="mt15"
                >
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
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>

    <Modal
      v-model="relationTargetShow"
      :mask-closable="false"
      :width="1200"
      title="关联商品规格"
    >
      <div class="modal-content">
        Tips：点击要选择的行
        <tables
          ref="tables"
          v-model="tempModalTableData"
          :columns="tempColumns"
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

        <div style="margin: 10px; overflow: hidden">
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
import {
  getAdvertisementPositionPages,
  createAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  getAdvertisementPages,
  getAdvertisement,
  getProductStandardsPages,
  getDynamicFormPages,
  getDynamicForm,
  createDynamicForm,
  updateDynamicForm,
  deleteDynamicForm
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
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
  status: null,
  linkType: null,
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
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
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      oldPicture: [],
      newPicture: [],
      save: [],
      defaultListMain: [],
      uploadListMain: [],
      advertisementList: [],
      tempColumns: [],
      tempModalTableData: [],
      relationTypeKeys: [],
      searchModalTableLoading: false,
      relationTargetShow: false,
      selectDisable: true,
      relationTotal: 0,
      tempContent: null,
      tempImage: null,
      advertiseType: [
        { value: 'IMAGE', label: '图片广告' },
        { value: 'TEXT', label: '文字广告' }
      ],
      linkType: [
        {
          value: linkType.GOODSINFO,
          label: '普通商品',
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns
        },
        { value: linkType.GROUPACTIVE, label: '拼团商品' },
        { value: linkType.PRESALEACTIVE, label: '预售商品' },
        { value: linkType.SECKILLACTIVE, label: '秒杀商品' },
        // {
        //   value: linkType.FLASHACTIVE,
        //   label: '抢购商品',
        //   api: getProductStandardsPages,
        //   columns: miniGoodsStandardColumns
        // },
        // {
        //   value: linkType.INVITEACTIVE,
        //   label: '邀请有礼',
        //   api: getProductStandardsPages,
        //   columns: miniGoodsStandardColumns
        // },
        // {
        //   value: linkType.RECHARGE,
        //   label: '充值页面',
        //   api: getProductStandardsPages,
        //   columns: miniGoodsStandardColumns
        // },
        { value: linkType.EXTERNALLINK, label: '外部链接' },
        { value: linkType.INTERNALLINK, label: '内部链接' },
        { value: linkType.TABLINK, label: '底部导航' }
      ],
      linkTypeEnum,
      status: [
        { label: '有效', value: 'VALID' },
        { label: '无效', value: 'INVALID' }
      ],
      validityTimeList: [{ label: '定时生效', value: 'OFF' }],
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
      columns: [
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          fixed: 'left',
          minWidth: 70
        },
        {
          title: '广告名称',
          align: 'center',
          minWidth: 140,
          fixed: 'left',
          key: 'advertisementName'
        },
        {
          title: '链接类型',
          align: 'center',
          minWidth: 100,
          fixed: 'left',
          key: 'linkType',
          render: (h, params, vm) => {
            const { row } = params;
            return (
              <div>{advertisementLinkTypeConvert(row.linkType).label}</div>
            );
          }
        },
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
          minWidth: 260,
          key: 'advertisementRelation'
        },
        {
          title: '创建时间',
          align: 'center',
          minWidth: 180,
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
          minWidth: 180,
          key: 'validTime'
        },
        {
          title: '失效时间',
          align: 'center',
          minWidth: 180,
          key: 'invalidTime'
        },
        {
          title: '广告位置',
          align: 'center',
          minWidth: 170,
          key: 'positionId',
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.advertisementList.find((item) => {
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
          title: '内容描述',
          align: 'center',
          minWidth: 200,
          key: 'contentDesc',
          tooltip: true
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          fixed: 'right',
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      advertisementDetail: _.cloneDeep(advertisementDetail),
      searchRelationRowData: _.cloneDeep(relationRowData)
    };
  },
  computed: {
    isTargetLink() {
      return (
        this.advertisementDetail.linkType === 'EXTERNALLINK' ||
        this.advertisementDetail.linkType === 'INTERNALLINK' ||
        this.advertisementDetail.linkType === 'TABLINK' ||
        this.advertisementDetail.linkType === 'GROUPACTIVE' ||
        this.advertisementDetail.linkType === 'PRESALEACTIVE' ||
        this.advertisementDetail.linkType === 'SECKILLACTIVE'
      );
    },
    advertisementPositionComputed() {
      const tempObj = this.advertisementList.find(
        (item) => item.id === this.advertisementDetail.positionId
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
          '～' +
          this.advertisementDetail.invalidTime
        );
      }
    }
  },
  created() {
    this.getAdvPositionPages();
  },
  methods: {
    resetFields() {
      this.tempImage = null;
      this.$refs.editForm.resetFields();
      if (this.$refs.uploadMain) { this.$refs.uploadMain.clearFileList(); }
      this.uploadListMain = [];
      this.advertisementDetail = _.cloneDeep(advertisementDetail);
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    getAdvPositionPages() {
      getAdvertisementPositionPages({
        page: 0,
        rows: 0
      }).then((res) => {
        this.selectDisable = false;
        this.advertisementList = res.rows;
        this.getTableData();
      });
    },
    getTableData() {
      this.loading = true;
      this.searchRowData.applicationType = this.applicationType;
      getAdvertisementPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getRelationTable() {
      this.searchModalTableLoading = true;
      const tempObj = this.linkType.find((item) => {
        return item.value === this.advertisementDetail.linkType;
      });
      if (tempObj) {
        this.tempColumns = tempObj.columns;
        tempObj.api(this.searchRelationRowData).then((res) => {
          this.searchModalTableLoading = false;
          this.relationTargetShow = true;
          this.tempModalTableData = res.rows;
          this.relationTotal = res.total;
        });
      }
    },
    handleSwitch(params) {
      this.advertisementDetail = _.cloneDeep(params.row);
      this.advertisementDetail.status = params.row.status === 'VALID' ? 'INVALID' : 'VALID';
      this.editTableRow();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.advertisementDetail = params.row;
      this.modalView = true;
    },
    handleCreate() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.imageUrl);
      this.$refs.editForm.resetFields();
      this.tempImage = null;
      this.loading = true;
      getAdvertisement({ id: params.row.id, flag: 'yes' })
        .then((res) => {
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
    handleEditClose() {
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
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
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createTableRow() {
      this.modalViewLoading = true;
      createAdvertisement(this.advertisementDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        }).finally(() => {
          this.modalViewLoading = false;
        });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editAdvertisement(this.advertisementDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        }).finally(() => {
          this.modalViewLoading = false;
        });
    },
    deleteTable(ids) {
      deleteAdvertisement({
        ids
      })
        .then((res) => {
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
    },
    advertiseTypeChange(value) {
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
    startTimeChange(value, date) {
      this.advertisementDetail.validTime = value;
    },
    endTimeChange(value, date) {
      this.advertisementDetail.invalidTime = value;
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
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.advertisementDetail.imageUrl = null;
      this.advertisementDetail.imageUrl = fileList[0].url;
      this.tempImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.advertisementDetail.imageUrl = null;
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
    advLinkTypeChange(value) {
      this.advertisementDetail.linkType = value;
    },
    advDetailStatusChange(value) {
      this.advertisementDetail.status = value;
    },
    advertiseTimeChange() {},
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
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleRelationSearch();
    },
    relationTextChange(event) {
      this.advertisementDetail.advertisementRelation = event;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
