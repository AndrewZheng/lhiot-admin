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
              v-model="searchRowData.code"
              placeholder="门店编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Input v-model="searchRowData.name" placeholder="门店名称" class="search-input mr5" style="width: auto" clearable></Input>
            <Select v-model="searchRowData.area" placeholder="所属区域" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in areaList"
                :key="index"
                :value="item.area"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >{{ item.areaName }}
              </Option>
            </Select>
            <Select v-if="applicationType == null" v-model="searchRowData.applicationType" placeholder="应用类型" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in applicationTypeList"
                :key="index"
                :value="item.code"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.name }}
              </Option>
            </Select>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh" />&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add" />
            创建
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
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

    <Modal
      v-model="modalView"
      :mask-closable="false"
    >
      <p slot="header">
        <span>门店信息详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品编码:</i-col>
              <i-col span="18">{{ storeDetail.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ storeDetail.name }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">所属区域:</i-col>
              <i-col span="18">{{ storeDetail.area }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">所属旗舰店:</i-col>
              <i-col span="16">{{ storeDetail.flagShip }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店状态:</i-col>
              <i-col span="18">{{ storeDetail.status }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店电话:</i-col>
              <i-col span="18">{{ storeDetail.phone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">位置经度:</i-col>
              <i-col span="18">{{ storeDetail.latitude }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">位置纬度:</i-col>
              <i-col span="18">{{ storeDetail.longitude }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店地址:</i-col>
              <i-col span="14">{{ storeDetail.address }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">坐标系类型:</i-col>
              <i-col span="16">{{ storeDetail.coordinateType|coordinateTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">应用类型:</i-col>
              <i-col span="21">{{ applicationTypeComputed(storeDetail.applicationType) }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">录播地址:</i-col>
          <i-col span="21">{{ storeDetail.tapeUrl }}</i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">直播地址:</i-col>
          <i-col span="21">{{ storeDetail.videoUrl }}</i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:</i-col>
              <i-col span="21">
                <img :src="storeDetail.image" style="width: 300px">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">直播时间起:</i-col>
              <i-col span="16">{{ storeDetail.beginAt }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">直播时间止:</i-col>
              <i-col span="16">{{ storeDetail.endAt }}</i-col>
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
      style="z-index: 1000"
    >
      <p slot="header">
        <span>门店基础信息</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="storeDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="门店编码:" prop="code">
              <Input v-model="storeDetail.code"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="门店名称:" prop="name">
              <Input v-model="storeDetail.name"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="所属区域:" prop="area">
              <Select v-model="storeDetail.area">
                <Option
                  v-for="(item,index) in areaList"
                  :key="index"
                  :value="item.area"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.areaName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem :label-width="85" label="所属旗舰店:" prop="flagShip">
              <Select v-model="storeDetail.flagShip">
                <Option
                  v-for="(item,index) in flagShipList"
                  :key="index"
                  :value="item.flagShip"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.name }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="门店状态:" prop="status">
              <Select v-model="storeDetail.status">
                <Option
                  v-for="(item,index) in storeStatusEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem :label-width="85" label="门店电话:" prop="phone">
              <Input v-model="storeDetail.phone"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="位置经度:" prop="longitude">
              <Input v-model="storeDetail.longitude"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="位置纬度:" prop="latitude">
              <Input v-model="storeDetail.latitude"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="门店类型:" prop="storeType">
              <Select v-model="storeDetail.storeType">
                <Option
                  v-for="(item,index) in storeTypeEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem :label-width="85" label="坐标系类型:" prop="coordinateType">
              <Select v-model="storeDetail.coordinateType">
                <Option
                  v-for="(item,index) in coordinateTypeEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row align="middle" type="flex">
            <Col span="24">
            <FormItem label="应用类型:" prop="applicationType">
              <Select v-model="storeDetail.applicationTypeBak" multiple clearable>
                <Option
                  v-for="(item,index) in applicationTypeList"
                  :key="index"
                  :value="item.code"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.name }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row align="middle" type="flex">
            <Col span="24">
            <FormItem label="门店地址:" prop="address">
              <Input v-model="storeDetail.address" type="textarea"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="推荐使用尺寸为400X225(单位:px):" prop="image">
              <Input v-show="false" v-model="storeDetail.image" style="width: auto"></Input>
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
            </FormItem>
          </Row>
          <Row align="middle" type="flex">
            <Col span="24">
            <FormItem label="直播地址:" prop="videoUrl">
              <Input v-model="storeDetail.videoUrl" type="textarea"></Input>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteStore,
  getStoreDetail,
  getStorePages,
  getStoreAreas,
  editStore,
  createStore
} from '@/api/fruitermaster';
import { buildMenu, convertTreeCategory } from '@/libs/util';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { storeType, storeStatus, storeStatusEnum, storeTypeEnum, coordinateTypeEnum } from '../../../libs/enumerate';
import { storeStatusConvert, storeTypeConvert, coordinateTypeConvert } from '../../../libs/converStatus';
import { getDictionary } from '@/api/basic';

const storeDetail = {
  id: 30,
  code: '',
  name: '',
  address: '',
  phone: '',
  image: '',
  area: '',
  status: '',
  flagShip: null,
  storeType: null,
  videoUrl: '',
  beginAt: '',
  endAt: '',
  tapeUrl: '',
  latitude: null,
  longitude: null,
  applicationType: null,
  applicationTypeBak: null,
  coordinateType: null
};
const roleRowData = {
  code: null,
  name: null,
  area: null,
  applicationType: null,
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
      ruleInline: {
        code: [
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
        name: [
          { required: true, message: '请输入门店名称' }
        ],
        status: [
          { required: true, message: '请选择门店状态' }
        ],
        area: [
          { required: true, message: '请选择门店区域' }
        ],
        flagShip: [
          { required: true, message: '请选择旗舰店' }
        ],
        longitude: [
          { required: true, message: '请填写正确的经度', pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/ }
        ],
        latitude: [
          { required: true, message: '请填写正确的维度', pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/ }
        ],
        coordinateType: [
          { required: true, message: '请选择坐标系类型' }
        ],
        image: [
          { required: true, message: '请上传门店图片' }
        ],
        phone: [
          { required: true, message: '请填写正确电话号码', pattern: /^1\d{10}$/ }
        ],
        storeType: [
          { required: true, message: '请选择门店类型' }
        ],
        address: [
          { required: true, message: '请填写门店地址' }
        ],
        videoUrl: [
          { required: true, message: '请填写直播地址' }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      flagShipList: [],
      columns: [
        {
          title: '门店编码',
          key: 'code',
          sortable: true,
          fixed: 'left',
          minWidth: 150
        },
        {
          title: '门店名称',
          key: 'name',
          fixed: 'left',
          minWidth: 150
        },
        {
          title: '所属区域',
          minWidth: 150,
          render: (h, params, vm) => {
            const { row } = params;
            const obj = this.areaList.find(item => {
              return item.area === row.area
            })
            if (obj) {
              return h('span', obj.areaName + '');
            } else {
              return h('span', row.area + '');
            }
          }
        },
        {
          title: '区域旗舰店',
          minWidth: 150,
          key: 'flagShip',
          render: (h, params) => {
            const { row } = params;
            const obj = this.flagShipList.find(item => row.flagShip === item.flagShip)
            if (obj) {
              return h('span', obj.name);
            }
            return h('span', row.flagShip);
          }
        },
        {
          title: '门店状态',
          minWidth: 150,
          render: (h, params) => {
            const { row } = params;
            if (row.status === 'ENABLED') {
              return <div><tag color='success'>{storeStatusConvert(row.status).label}</tag></div>;
            } else if (row.status === 'DISABLED') {
              return <div><tag color='error'>{storeStatusConvert(row.status).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.status}</tag></div>;
          }
        },
        {
          title: '联系方式',
          minWidth: 150,
          key: 'phone'
        },
        {
          title: '门店类型',
          minWidth: 150,
          render: (h, params) => {
            const { row } = params;
            if (row.storeType === 'FLAGSHIP_STORE') {
              return <div><tag color='success'>{storeTypeConvert(row.storeType).label}</tag></div>;
            } else if (row.storeType === 'ORDINARY_STORE') {
              return <div><tag color='primary'>{storeTypeConvert(row.storeType).label}</tag></div>;
            }
            return <div><tag>{row.storeType}</tag></div>;
          }
        },
        {
          title: '应用类型',
          width: 160,
          key: 'applicationType',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const result = [];
            if (row.applicationType !== null && row.applicationType !== '') {
              let applicationTypes = [];
              applicationTypes = row.applicationType.split(',');
              applicationTypes.forEach(element => {
                const filterObj = this.applicationTypeList.find(item => {
                  return item.code === element;
                });
                result.push(filterObj !== null ? filterObj.name : element);
              });
              return <div>{result.join(', ')}</div>;
            }
          }
        },
        // {
        //   title: '坐标系类型',
        //   minWidth: 150,
        //   key: 'coordinateType',
        //   render: (h, params) => {
        //     const { row } = params;
        //     return h('span', coordinateTypeConvert(row.coordinateType).label + '');
        //   }
        // },
        {
          title: '操作',
          minWidth: 230,
          key: 'handle',
          options: ['view', 'delete', 'edit', 'onStoreStatus']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      storeDetail: _.cloneDeep(storeDetail),
      applicationTypeList: []
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.loading = true;
    this.createLoading = true;
    getStoreAreas().then(res => {
      this.areaList = res.array;
      getStorePages({
        storeType: storeType.FLAGSHIP_STORE,
        page: 1,
        rows: 10
      }).then(res => {
        this.flagShipList = res.array;
        this.getTableData();
        this.createLoading = false;
      })
    });
  },
  created() {
    this.getApplications();
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.storeDetail.image = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            // 添加状态
            this.createStore();
          } else if (this.isEdit) {
            // 编辑状态
            this.storeDetail.applicationType = this.storeDetail.applicationTypeBak.join(',');
            console.log('this.storeDetail.applicationType:' + JSON.stringify(this.storeDetail.applicationType));
            this.editStore();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createStore(this.storeDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editStore() {
      this.modalViewLoading = true;
      editStore(this.storeDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addStore() {
      if (this.tempModalType !== this.modalType.create) {
        this.resetFields();
        this.tempModalType = this.modalType.create;
        this.storeDetail = _.cloneDeep(storeDetail)
      }
      this.modalEdit = true;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteStore({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(err => {
        console.log(err);
        this.loading = false;
      });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.image != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.image;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.storeDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.storeDetail = _.cloneDeep(params.row);
      if (this.storeDetail.applicationType !== null && this.storeDetail.applicationType !== '') {
        this.storeDetail.applicationTypeBak = this.storeDetail.applicationType.split(',');
        console.log('applicationTypeBak：' + this.storeDetail.applicationTypeBak);
      }
      this.setDefaultUploadList(this.storeDetail);
      this.modalEdit = true;
    },
    onStoreStatus(params) {
      console.log(params);
      this.storeDetail = this._.cloneDeep(params.row);
      if (params.row.status === storeStatus.ENABLED) {
        this.storeDetail.status = storeStatus.DISABLED;
      } else {
        this.storeDetail.status = storeStatus.ENABLED;
      }
      this.loading = true;
      this.editStore();
    },
    getTableData() {
      // 当前系统应用类型不为空时，搜索的应用类型为当前应用类型
      if (this.applicationType !== null) {
        this.searchRowData.applicationType = this.applicationType;
      }
      getStorePages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.storeDetail.image = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.storeDetail.image = null;
      this.storeDetail.image = fileList[0].url;
    },
    getApplications() {
      getDictionary({ code: 'applications' }).then(res => {
        if (res.entries) {
          this.applicationTypeList = res.entries;
          console.log('applicationTypeList:' + JSON.stringify(this.applicationTypeList));
        }
      });
    },
    applicationTypeComputed(applicationType) {
      const result = [];
      // const applicationType = _.cloneDeep(this.storeDetail.applicationType);
      if (this.applicationTypeList !== [] && this.storeDetail.applicationType !== null) {
        let applicationTypes = [];
        applicationTypes = applicationType.split(',');
        applicationTypes.forEach(element => {
          const filterObj = this.applicationTypeList.find(item => {
            return item.code === element;
          });
          result.push(filterObj !== null ? filterObj.name : element);
        });
        return result;
      } else {
        return applicationType;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
