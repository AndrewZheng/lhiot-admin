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
      >
        <div slot="searchCondition">
          <Row>
            <Select v-model="searchRowData.status" placeholder="活动状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in teamBuyStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add"/>
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
            @on-page-size-change="changePageSize"></Page>
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
              <i-col span="18">{{ teambuyDetail.storeCode }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ teambuyDetail.storeName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">所属区域:</i-col>
              <i-col span="18">{{ teambuyDetail.storeArea }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">所属旗舰店:</i-col>
              <i-col span="16">{{ teambuyDetail.storeFlagship }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">门店状态:</i-col>
              <i-col span="18">{{ teambuyDetail.storeStatus }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">门店电话:</i-col>
              <i-col span="18">{{ teambuyDetail.storePhone }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">位置经度:</i-col>
              <i-col span="18">{{ teambuyDetail.storeCoordy }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">位置纬度:</i-col>
              <i-col span="18">{{ teambuyDetail.storeCoordx }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">门店地址:</i-col>
          <i-col span="21">{{ teambuyDetail.storeAddress }}</i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">录播地址:</i-col>
          <i-col span="21">{{ teambuyDetail.tapeUrl }}</i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="3">直播地址:</i-col>
          <i-col span="21">{{ teambuyDetail.videoUrl }}</i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:</i-col>
              <i-col span="21">
                <img :src="teambuyDetail.storeImage" style="width: 300px">
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">直播时间起:</i-col>
              <i-col span="16">{{ teambuyDetail.beginAt }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">直播时间止:</i-col>
              <i-col span="16">{{ teambuyDetail.endAt }}</i-col>
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
        <Form ref="modalEdit" :model="teambuyDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="门店编码:" prop="storeCode">
              <Input v-model="teambuyDetail.storeCode"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="门店名称:" prop="storeName">
              <Input v-model="teambuyDetail.storeName" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="所属区域:" prop="storeArea">
              <Select v-model="teambuyDetail.storeArea">
                <Option
                  v-for="(item,index) in areaList"
                  :value="item.area"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.areaName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem :label-width="85" label="所属旗舰店:" prop="storeFlagship">
              <Select v-model="teambuyDetail.storeFlagship">
                <Option
                  v-for="(item,index) in flagShipList"
                  :value="item.storeFlagship"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.storeName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="门店状态:" prop="storeStatus">
              <Select v-model="teambuyDetail.storeStatus">
                <Option
                  v-for="(item,index) in storeStatusEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem :label-width="85" label="门店电话:" prop="storePhone">
              <Input v-model="teambuyDetail.storePhone" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="位置经度:" prop="storeCoordy">
              <Input v-model="teambuyDetail.storeCoordy" ></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="位置纬度:" prop="storeCoordx">
              <Input v-model="teambuyDetail.storeCoordx" ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem :label-width="85" label="门店类型:" prop="storeType">
              <Select v-model="teambuyDetail.storeType">
                <Option
                  v-for="(item,index) in storeTypeEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row align="middle" type="flex">
            <Col span="24">
            <FormItem label="门店地址:" prop="storeAddress">
              <Input v-model="teambuyDetail.storeAddress" type="textarea"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="推荐使用尺寸为400X225(单位:px):" prop="storeImage" >
              <Input v-show="false" v-model="teambuyDetail.storeImage" style="width: auto"></Input>
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
              <Input v-model="teambuyDetail.videoUrl" type="textarea" ></Input>
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
  deleteTeamBuy,
  getTeamBuyPages,
  editTeamBuy,
  createTeamBuy
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { teamBuyConvert } from '@/libs/converStatus';
import { teamBuyStatusEnum } from '@/libs/enumerate';

const teambuyDetail = {
  remainingProductNum: 0,
  triesLimit: 0,
  teamGuaranteeURL: '',
  storeId: 0,
  storeIds: '',
  singleTeambuyPrice: 0,
  originalPrice: 0,
  saleQuantity: 0,
  createTime: '',
  teamBuyType: null,
  teamBuyNum: 0,
  rewardActivitySetting: '',
  joinInfoStatus: '',
  teamResultEnum: 0,
  id: 0,
  activityName: '',
  content: '',
  status: null,
  rank: 0,
  startTime: '',
  endTime: '',
  banner: '',
  totalNum: 0,
  activityPrice: 0,
  tourDiscount: 0,
  fullUserNum: 0,
  standardId: 0,
  validSeconds: 0,
  deliveryEndTime: '',
  standardDesc: '',
  fullTeambuyCount: 0,
  robot: null,
  teamBuys: '',
  productStandard: '',
  leftTime: '',
  productNum: 0,
  robotStartSecond: 0
};

const roleRowData = {
  status: null,
  activityName: '',
  // createTimeStart: '',
  // createTimeEnd: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
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
        storeName: [
          { required: true, message: '请输入门店名称' }
        ],
        storeStatus: [
          { required: true, message: '请选择门店状态' }
        ],
        storeArea: [
          { required: true, message: '请选择门店区域' }
        ],
        storeFlagship: [
          { required: true, message: '请选择旗舰店' }
        ],
        storeCoordy: [
          { required: true, message: '请填写正确的经度', pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/ }
        ],
        storeCoordx: [
          { required: true, message: '请填写正确的维度', pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/ }
        ],
        coordinateType: [
          { required: true, message: '请选择坐标系类型' }
        ],
        storeImage: [
          { required: true, message: '请上传门店图片' }
        ],
        storePhone: [
          { required: true, message: '请填写正确电话号码', pattern: /^1\d{10}$/ }
        ],
        storeType: [
          { required: true, message: '请选择门店类型' }
        ],
        storeAddress: [
          { required: true, message: '请填写门店地址' }
        ],
        videoUrl: [
          { required: true, message: '请填写直播地址' }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      teamBuyStatusEnum,
      flagShipList: [],
      columns: [
        {
          title: '活动名称',
          key: 'activityName',
          sortable: true,
          fixed: 'left',
          minWidth: 150
        },
        {
          title: '活动状态',
          key: 'status',
          minWidth: 90,
          render: (h, params) => {
            const { row } = params;
            if (row.status == 'on') {
              return <div><tag color='success'>{teamBuyConvert(row.status).label}</tag></div>;
            } else if (row.status == 'off') {
              return <div><tag color='error'>{teamBuyConvert(row.status).label}</tag></div>;
            } else if (row.status == 'expire') {
              return <div><tag color='warning'>{teamBuyConvert(row.status).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.status}</tag></div>;
          }
        },
        {
          title: '有效期起',
          minWidth: 160,
          key: 'startTime'
        },
        {
          title: '有效期止',
          minWidth: 160,
          key: 'endTime'
        },
        {
          title: '商品库存',
          minWidth: 100,
          key: 'productNum'
        },
        {
          title: '活动价',
          minWidth: 100,
          key: 'activityPrice'
        },
        {
          title: '团长优惠',
          minWidth: 100,
          key: 'tourDiscount'
        },
        {
          title: '成团有效时长',
          minWidth: 100,
          key: 'validSeconds'
        },
        {
          title: '提货截至时间',
          minWidth: 160,
          key: 'deliveryEndTime'
        },
        {
          title: '规格描述',
          minWidth: 120,
          key: 'standardDesc',
          tooltip: true
        },
        {
          title: '限购次数',
          minWidth: 80,
          key: 'triesLimit'
        },
        {
          title: '是否模拟成团',
          minWidth: 120,
          key: 'robot',
          render: (h, params) => {
            const { row } = params;
            if (row.robot === 'on') {
              return <div><tag color='success'>{teamBuyConvert(row.robot).label}</tag></div>;
            } else if (row.robot === 'off') {
              return <div><tag color='error'>{teamBuyConvert(row.robot).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.robot}</tag></div>;
          }
        },
        {
          title: '操作',
          minWidth: 120,
          key: 'handle',
          options: ['view', 'edit']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      teambuyDetail: _.cloneDeep(teambuyDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
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
      this.teambuyDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStore();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editStore();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createTeamBuy(this.teambuyDetail).then(res => {
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
      editTeamBuy(this.teambuyDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.teambuyDetail = _.cloneDeep(teambuyDetail)
      }

      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.storeId);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteTeamBuy({
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
      this.teambuyDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.teambuyDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getTeamBuyPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
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
      this.teambuyDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.teambuyDetail.storeImage = null;
      this.teambuyDetail.storeImage = fileList[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
