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
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-storeStatus="onStoreStatus"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.storeCode"
              placeholder="门店编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.storeName"
              placeholder="门店名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.cityCode"
              placeholder="所属城市"
              style="padding-right: 5px; width: 100px"
              clearable
              @on-change="handleCityChange"
            >
              <Option
                v-for="(item, index) in cityList"
                :key="index"
                :value="item.cityCode"
                class="ptb2-5"
                style="padding-left: 5px; width: 100px"
              >
                {{ item.cityName }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.storeArea"
              placeholder="所属区域"
              style="padding-right: 5px; width: 100px"
              clearable
            >
              <Option
                v-for="(item, index) in areaList"
                :key="index"
                :value="item.area"
                class="ptb2-5"
                style="padding-left: 5px; width: 100px"
              >
                {{ item.areaName }}
              </Option>
            </Select>
            <Select
              v-model="searchRowData.storeStatus"
              placeholder="营业状态"
              style="padding-right: 5px; width: 100px"
              clearable
            >
              <Option
                v-for="(item, index) in storeStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px; width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-if="applicationType == null"
              v-model="searchRowData.applicationType"
              placeholder="应用类型"
              style="padding-right: 5px; width: 100px"
              clearable
            >
              <Option
                v-for="(item, index) in applicationTypeList"
                :key="index"
                :value="item.storeCode"
                class="ptb2-5"
                style="padding-left: 5px"
              >
                {{ item.name }}
              </Option>
            </Select>
            <Button
              :loading="searchLoading"
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
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            type="success"
            class="mr5"
            @click="addStore"
          >
            <Icon type="md-add" />添加
          </Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <!-- 查看 -->
    <Modal v-model="modalView" :mask-closable="false" :width="750">
      <p slot="header">
        <span>门店信息详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                商品编码:
              </i-col>
              <i-col span="18">
                {{ storeDetail.storeCode }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                门店名称:
              </i-col>
              <i-col span="18">
                {{ storeDetail.storeName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                所属城市:
              </i-col>
              <i-col span="18">
                {{ cityName }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                所属区域:
              </i-col>
              <i-col span="18">
                {{ areaName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                门店状态:
              </i-col>
              <i-col span="18">
                {{
                  storeDetail.storeStatus | storeStatusFilters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                门店电话:
              </i-col>
              <i-col span="18">
                {{ storeDetail.storePhone }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                开始时间:
              </i-col>
              <i-col span="18">
                {{
                  storeDetail.beginTime | storeStatusFilters
                }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                结束时间:
              </i-col>
              <i-col span="18">
                {{
                  storeDetail.endTime | storeStatusFilters
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                位置经度:
              </i-col>
              <i-col span="18">
                {{ storeDetail.storeCoordy }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                位置纬度:
              </i-col>
              <i-col span="18">
                {{ storeDetail.storeCoordx }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                配送方式:
              </i-col>
              <i-col v-if="storeDetail.deliverType === 'MEITUAN'" span="18">
                {{
                  "美团"
                }}
              </i-col>
              <i-col v-else span="18">
                {{ "达达" }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                企业微信ID:
              </i-col>
              <i-col span="18" style="font-size: 12px">
                {{
                  storeDetail.enterpriseWxId
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">企业微信ID:</i-col>
              <i-col span="18">{{ storeDetail.enterpriseWxId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店类型:</i-col>
              <i-col span="18">{{ storeDetail.storeType }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="3">
            门店地址:
          </i-col>
          <i-col span="21">
            {{ storeDetail.storeAddress }}
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">
            录播地址:
          </i-col>
          <i-col span="21">
            <a :href="storeDetail.tapeUrl" target="_blank">{{
              storeDetail.tapeUrl
            }}</a>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">
            直播地址:
          </i-col>
          <i-col span="21">
            {{ storeDetail.videoUrl }}
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">
                门店照片:
              </i-col>
              <i-col span="21">
                <img :src="storeDetail.storeImage" style="width: 300px">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">
                门店微信:
              </i-col>
              <i-col span="21">
                <img :src="storeDetail.wxImage" style="width: 300px">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">
                直播时间起:
              </i-col>
              <i-col span="16">
                {{ storeDetail.beginAt }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">
                直播时间止:
              </i-col>
              <i-col span="16">
                {{ storeDetail.endAt }}
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

    <!-- 修改 -->
    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <span>门店基础信息</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="storeDetail"
          :rules="ruleInline"
          :label-width="90"
        >
          <Row>
            <i-col span="12">
              <FormItem label="门店编码:" prop="storeCode">
                <Input v-model="storeDetail.storeCode"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="门店名称:" prop="storeName">
                <Input v-model="storeDetail.storeName"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem
                :label-width="85"
                label="所属城市:"
                prop="cityCode"
              >
                <Select v-model="storeDetail.cityCode" @on-change="handleCitySwitch">
                  <Option
                    v-for="(item, index) in cityList"
                    :key="index"
                    :value="item.cityCode"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.cityName }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem :label-width="85" label="所属区域:" prop="storeArea">
                <Select v-model="storeDetail.storeArea">
                  <Option
                    v-for="(item, index) in areaList"
                    :key="index"
                    :value="item.area"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.areaName }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem :label-width="85" label="门店状态:" prop="storeStatus">
                <Select v-model="storeDetail.storeStatus">
                  <Option
                    v-for="(item, index) in storeStatusEnum"
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
              <FormItem :label-width="85" label="门店类型:" prop="storeType">
                <Select v-model="storeDetail.storeType">
                  <Option
                    v-for="(item, index) in storeTypeEnum"
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
          </Row>
          <Row>
            <i-col span="12">
              <FormItem
                :label-width="85"
                label="店长姓名:"
                prop="shopownerName"
              >
                <Input v-model="storeDetail.shopownerName"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem :label-width="85" label="门店电话:" prop="storePhone">
                <Input v-model="storeDetail.storePhone"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="开始时间:" prop="beginTime">
                <TimePicker
                  v-model="storeDetail.beginTime"
                  type="time"
                  placeholder="请选择"
                  class="search-input"
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="结束时间:" prop="endTime">
                <TimePicker
                  v-model="storeDetail.endTime"
                  type="time"
                  placeholder="请选择"
                  class="search-input"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="位置经度:" prop="storeCoordy">
                <Input v-model="storeDetail.storeCoordy"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="位置纬度:" prop="storeCoordx">
                <Input v-model="storeDetail.storeCoordx"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem :label-width="85" label="配送方式:" prop="deliverType">
                <Select v-model="storeDetail.deliverType">
                  <Option
                    v-for="(item, index) in deliverTypeEnum"
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
              <FormItem label="企业微信ID:" prop="enterpriseWxId">
                <Input v-model="storeDetail.enterpriseWxId"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row align="middle" type="flex">
            <i-col span="24">
              <FormItem label="门店地址:" prop="storeAddress">
                <Input
                  v-model="storeDetail.storeAddress"
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <!-- 门店店照 -->
          <Row>
            <FormItem label="推荐使用尺寸为650*480(单位:px):" prop="storeImage">
              <Input
                v-show="false"
                v-model="storeDetail.storeImage"
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
                group-type="base_image"
                file-dir="store"
                @on-success="handleSuccessMain"
              >
                <div
                  slot="content"
                  style="width: 58px; height: 58px; line-height: 58px"
                >
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <!-- 门店微信 -->
          <Row>
            <i-col span="12">
              <FormItem label="门店微信" prop="wxImage">
                <Input
                  v-show="false"
                  v-model="storeDetail.wxImage"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadwxImageList"
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
                          @click.native="handleRemoveWxImage(item)"
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
                  ref="uploadWxImage"
                  :default-list="defaultWxImageList"
                  :image-size="imageSize"
                  :max-num="1"
                  group-type="base_image"
                  file-dir="store"
                  @on-success="handleSuccessWxImage"
                >
                  <div
                    slot="content"
                    style="width: 58px; height: 58px; line-height: 58px"
                  >
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
          <Row align="middle" type="flex">
            <i-col span="24">
              <FormItem label="直播地址:">
                <Input v-model="storeDetail.videoUrl" type="textarea"></Input>
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
          :loading="modalEditLoading"
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteStore,
  getStoreCityPages,
  getStorePages,
  getStoreAreas,
  editStore,
  createStore
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import {
  storeStatus,
  storeStatusEnum,
  storeTypeEnum,
  coordinateTypeEnum
} from '@/libs/enumerate';
import {
  storeStatusConvert,
  storeTypeConvert
} from '@/libs/converStatus';

const storeDetail = {
  storeId: 0,
  storeCode: '',
  cityCode: '0731',
  storeName: '',
  storeAddress: '',
  storePhone: '',
  storeImage: '',
  shopownerName: '',
  storeArea: '',
  storeStatus: '',
  storeFlagship: '',
  storeType: null,
  videoUrl: '',
  beginAt: '',
  endAt: '',
  tapeUrl: '',
  storeCoordx: null,
  storeCoordy: null,
  coordinateType: null,
  wxImage: '',
  enterpriseWxId: '',
  deliverType: 'MEITUAN'
};

const roleRowData = {
  cityCode: '0731',
  storeCode: null,
  storeName: null,
  storeArea: null,
  storeStatus: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      storeStatusEnum,
      storeTypeEnum,
      coordinateTypeEnum,
      defaultListMain: [],
      defaultWxImageList: [],
      uploadListMain: [],
      uploadwxImageList: [],
      areaList: [],
      cityList: [],
      flagShipList: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      deliverTypeEnum: [
        { label: '美团', value: 'MEITUAN' },
        { label: '达达', value: 'DADA' }
      ],
      columns: [
        {
          title: '门店编码',
          key: 'storeCode',
          align: 'center',
          minWidth: 110
        },
        {
          title: '门店名称',
          align: 'center',
          key: 'storeName',
          minWidth: 170
        },
        {
          title: '所属城市',
          align: 'center',
          minWidth: 100,
          key: 'cityCode',
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.cityList.find(item => item.cityCode === row.cityCode);
            if (obj) {
              return h('span', obj.cityName + '');
            } else {
              return h('span', row.cityCode + '');
            }
          }
        },
        {
          title: '所属区域',
          align: 'center',
          minWidth: 100,
          key: 'storeArea',
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.areaList.find(item => item.area === row.storeArea);
            if (obj) {
              return h('span', obj.areaName + '');
            } else {
              return h('span', row.storeArea + '');
            }
          }
        },
        {
          title: '门店状态',
          align: 'center',
          minWidth: 100,
          key: 'storeStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.storeStatus === 'ENABLED') {
              return (
                <div>
                  <tag color='success'>
                    {storeStatusConvert(row.storeStatus).label}
                  </tag>
                </div>
              );
            } else if (row.storeStatus === 'DISABLED') {
              return (
                <div>
                  <tag color='error'>
                    {storeStatusConvert(row.storeStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.storeStatus}</tag>
              </div>
            );
          }
        },
        {
          title: '营业时间(起)',
          align: 'center',
          minWidth: 120,
          key: 'beginTime'
        },
        {
          title: '营业时间(止)',
          align: 'center',
          minWidth: 120,
          key: 'endTime'
        },
        {
          title: '店长姓名',
          align: 'center',
          minWidth: 100,
          key: 'shopownerName'
        },
        {
          title: '联系方式',
          align: 'center',
          minWidth: 130,
          key: 'storePhone'
        },
        {
          title: '门店类型',
          align: 'center',
          minWidth: 110,
          render: (h, params) => {
            const { row } = params;
            if (row.storeType === 'FLAGSHIP_STORE') {
              return (
                <div>
                  <tag color='success'>
                    {storeTypeConvert(row.storeType).label}
                  </tag>
                </div>
              );
            } else if (row.storeType === 'ORDINARY_STORE') {
              return (
                <div>
                  <tag color='primary'>
                    {storeTypeConvert(row.storeType).label}
                  </tag>
                </div>
              );
            } else if (row.storeType === 'JOIN_STORE') {
              return (
                <div>
                  <tag color='warning'>
                    {storeTypeConvert(row.storeType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.storeType}</div>;
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          key: 'handle',
          options: ['onStoreStatus', 'view', 'edit', 'delete']
        }
      ],
      ruleInline: {
        storeCode: [
          { required: true, message: '请输入门店编码' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        storeName: [{ required: true, message: '请输入门店名称' }],
        storeStatus: [{ required: true, message: '请选择门店状态' }],
        storeArea: [{ required: true, message: '请选择所属区域' }],
        cityCode: [{ required: true, message: '请选择所属城市' }],
        beginTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        storeCoordy: [
          {
            required: true,
            message: '请填写正确的经度',
            pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/
          }
        ],
        storeCoordx: [
          {
            required: true,
            message: '请填写正确的维度',
            pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/
          }
        ],
        coordinateType: [{ required: true, message: '请选择坐标系类型' }],
        storeImage: [{ required: true, message: '请上传门店图片' }],
        storePhone: [
          {
            required: true,
            message: '请填写正确电话号码',
            pattern: /^1\d{10}$/
          }
        ],
        storeType: [{ required: true, message: '请选择门店类型' }],
        storeAddress: [{ required: true, message: '请填写门店地址' }],
        shopownerName: [{ required: true, message: '请填写店长姓名' }]
      },
      searchRowData: _.cloneDeep(roleRowData),
      storeDetail: _.cloneDeep(storeDetail)
    };
  },
  computed: {
    cityName() {
      const code = this.storeDetail.cityCode;
      const obj = this.cityList.find(item => item.cityCode === code);
      if (!obj) { return code; }
      return obj.cityName;
    },
    areaName() {
      const code = this.storeDetail.storeArea;
      const obj = this.cityList.find(item => item.area === code);
      if (!obj) { return code; }
      return obj.areaName;
    }
  },
  mounted() {
    this.getStoreCityPages();
    this.getStoreAreas();
    this.resetSearchRowData();
  },
  created() {},
  methods: {
    getTableData() {
      this.loading = true;
      getStorePages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    getStoreCityPages() {
      getStoreCityPages({
        sidx: 'id',
        sort: 'asc',
        page: 1,
        rows: -1
      })
        .then((res) => {
          this.cityList = res.rows;
        })
    },
    getStoreAreas() {
      getStoreAreas(this.searchRowData.cityCode).then((res) => {
        this.areaList = res;
      });
    },
    handleCitySwitch(value) {
      this.storeDetail.cityCode = value;
      // 当城市修改过后，重新获取区域列表
      getStoreAreas(value).then((res) => {
        this.areaList = res;
      });
    },
    handleCityChange(value) {
      // 当城市修改过后，重新获取区域列表，门店列表
      this.searchRowData.cityCode = value;
      this.getStoreAreas();
      this.getTableData();
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createStore();
          } else if (this.isEdit) {
            this.editStore();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    handleEditClose() {
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    createStore() {
      this.modalEditLoading = true;
      createStore(this.storeDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    editStore() {
      this.modalEditLoading = true;
      editStore(this.storeDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    addStore() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.storeDetail = _.cloneDeep(storeDetail);
      this.storeDetail.cityCode = this.searchRowData.cityCode ? this.searchRowData.cityCode : '0731';
      this.modalEdit = true;
    },
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.storeId);
    },
    deleteTable(ids) {
      deleteStore({
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
        });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getStoreAreas();
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.uploadwxImageList = [];
      this.storeDetail.storeImage = null;
      this.storeDetail.wxImage = null;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.storeImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.storeImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.wxImage != null) {
        const map = { status: 'finished', url: 'url' };
        const detailImgArr = [];
        map.url = res.wxImage;
        detailImgArr.push(map);
        this.$refs.uploadWxImage.setDefaultFileList(detailImgArr);
        this.uploadwxImageList = detailImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.storeDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.storeImage);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.storeDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.storeDetail);
      this.modalEdit = true;
    },
    onStoreStatus(params) {
      this.storeDetail = this._.cloneDeep(params.row);
      if (params.row.storeStatus === storeStatus.ENABLED) {
        this.storeDetail.storeStatus = storeStatus.DISABLED;
      } else {
        this.storeDetail.storeStatus = storeStatus.ENABLED;
      }
      this.loading = true;
      this.editStore();
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.storeDetail.storeImage = null;
    },
    handleRemoveWxImage(file) {
      this.$refs.uploadWxImage.deleteFile(file);
      this.storeDetail.wxImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.storeDetail.storeImage = null;
      this.storeDetail.storeImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleSuccessWxImage(response, file, fileList) {
      this.uploadwxImageList = fileList;
      this.storeDetail.wxImage = null;
      this.storeDetail.wxImage = fileList[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
