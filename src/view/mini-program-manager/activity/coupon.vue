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
        @on-relevance="handleSetting"
        @custom-on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Select v-model="searchRowData.ifEffective" placeholder="活动状态" style="padding-right: 5px;width: 100px" clearable>
              <Option
                v-for="(item,index) in couponStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px">{{ item.label }}
              </Option>
            </Select>
            <DatePicker
              v-model="searchRowData.formBeginTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="beginTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.formEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input  mr5"
              style="width: 150px"
              @on-change="endTimeChange"/>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addCoupon">
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
        <span>优惠券活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动ID:</i-col>
              <i-col span="18">{{ couponDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ couponDetail.activityName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动规则:</i-col>
              <i-col span="18"><Input :v-if="couponDetail.activityRuel" :rows="6" :value="couponDetail.activityRuel" type="textarea"></Input></i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动内容:</i-col>
              <i-col span="18">{{ couponDetail.activityContent }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动开关:</i-col>
              <i-col span="18">{{ couponDetail.ifEffective | couponStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>

        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">{{ couponDetail.beginTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">{{ couponDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ couponDetail.createUser }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ couponDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">应用类型:</i-col>
              <i-col span="18">{{ couponDetail.applicationType | appTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">宣传图片:</i-col>
              <i-col span="18"><img :src="couponDetail.activityImage" style="width: 150px"></i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">宣传链接:</i-col>
              <i-col span="18">{{ couponDetail.activityUrl }}</i-col>
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
        <i-col>{{ tempModalType===modalType.edit?'修改优惠券活动':'创建优惠券活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="couponDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
            <FormItem label="活动名称:" prop="activityName">
              <Input v-model="couponDetail.activityName" placeholder="活动名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动规则:" prop="activityRuel">
              <Input v-model="couponDetail.activityRuel" :rows="6" placeholder="活动规则" type="textarea"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动内容:" prop="activityContent">
              <Input v-model="couponDetail.activityContent" placeholder="活动内容"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动开关:" prop="ifEffective">
              <Select v-model="couponDetail.ifEffective" clearable>
                <Option
                  v-for="(item,index) in couponStatusEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="有效期起:" prop="beginTime">
              <DatePicker
                v-model="couponDetail.beginTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期起"
                class="search-input"
                style="width: 200px"
                @on-change="beginTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="有效期止:" prop="endTime">
              <DatePicker
                v-model="couponDetail.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期止"
                class="search-input"
                style="width: 200px"
                @on-change="endTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <!-- <Row>
            <Col span="18">
            <FormItem label="商品是否显示:" prop="ifEffective">
              <Select v-model="couponDetail.ifEffective" clearable>
                <Option
                  v-for="(item,index) in couponStatusEnum"
                  :value="item.value"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row> -->
          <Row>
            <FormItem label="宣传图片   推荐使用尺寸为400X225(单位:px):">
              <Input v-show="false" v-model="couponDetail.activityImage" style="width: auto"></Input>
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
          <Row>
            <Col span="18">
            <FormItem label="宣传链接:">
              <Input v-model="couponDetail.activityUrl" placeholder="宣传链接"></Input>
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
  deleteCoupon,
  getCouponPages,
  editCoupon,
  createCoupon,
  getCouponTemplateRelationPages,
  deleteCouponTemplateRelation,
  createCouponTemplateRelation,
  editCouponTemplateRelation
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { couponStatusConvert } from '@/libs/converStatus';
import { couponStatusEnum } from '@/libs/enumerate';
import { compareData, setSmallGoodsStandard } from '@/libs/util';

const couponDetail = {
  formBeginTime: null,
  formEndTime: null,
  activityShareId: 0,
  id: 0,
  activityId: 0,
  activityName: '',
  activityRuel: '',
  activityContent: '',
  ifEffective: null,
  beginTime: null,
  endTime: null,
  createUser: '',
  createTime: null,
  applicationType: null,
  activityImage: '',
  activityUrl: ''
};

const roleRowData = {
  formBeginTime: null,
  formEndTime: null,
  ifEffective: null,
  activityName: null,
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
      ruleInline: {
        activityName: [
          { required: true, message: '请输入活动名称' }
        ],
        ifEffective: [
          { required: true, message: '请选择活动开关' }
        ],
        beginTime: [
          { required: true, message: '请输入开始时间' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间' }
        ]
        // TODO 验证商城是否显示
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动编号',
          key: 'id'
        },
        {
          title: '活动名称',
          key: 'activityName'
        },
        {
          title: '活动状态',
          key: 'ifEffective',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.ifEffective === 'VALID') {
              return <div><tag color='success'>{couponStatusConvert(row.ifEffective).label}</tag></div>;
            } else if (row.ifEffective === 'INVALID') {
              return <div><tag color='error'>{couponStatusConvert(row.ifEffective).label}</tag></div>;
            }
            return <div><tag color='primary'>{row.ifEffective}</tag></div>;
          }
        },
        {
          title: '活动开始时间',
          key: 'beginTime'
        },
        {
          title: '活动结束时间',
          key: 'endTime'
        },
        {
          title: '创建人',
          key: 'createUser'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['customOnSale', 'view', 'edit', 'delete', 'settings']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      couponDetail: _.cloneDeep(couponDetail)
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
      this.couponDetail.storeImage = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (compareData(this.couponDetail.beginTime, this.couponDetail.endTime)) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          // 活动规则换行用“&”拼接
          if (this.couponDetail.activityRuel !== null || this.couponDetail.activityContent !== '') {
            this.couponDetail.activityRuel = this.couponDetail.activityRuel.replace(/\n|\r/g, '&');
          }
          // 应用类型为小程序-WXSMALL_SHOP
          this.couponDetail.applicationType = 'WXSMALL_SHOP';
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createCoupon();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editCoupon();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    createCoupon() {
      this.modalViewLoading = true;
      createCoupon(this.couponDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editCoupon() {
      this.modalViewLoading = true;
      editCoupon(this.couponDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addCoupon() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.couponDetail = _.cloneDeep(couponDetail)
      }

      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteCoupon({
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
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.couponDetail = _.cloneDeep(params.row);
      this.couponDetail.activityRuel = this.couponDetail.activityRuel.replace(/&/g, '\n');
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.couponDetail = _.cloneDeep(params.row);
      this.couponDetail.activityRuel = this.couponDetail.activityRuel.replace(/&/g, '\n');
      this.setDefaultUploadList(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getCouponPages(this.searchRowData).then(res => {
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
    onOff(params) {
      this.couponDetail = this._.cloneDeep(params.row);
      if (params.row.ifEffective === 'VALID') {
        this.couponDetail.ifEffective = 'INVALID';
      } else {
        this.couponDetail.ifEffective = 'VALID';
      }
      this.loading = true;
      this.editCoupon();
    },
    beginTimeChange(value, date) {
      this.couponDetail.beginTime = value;
      this.couponDetail.formBeginTime = value;
    },
    endTimeChange(value, date) {
      this.couponDetail.endTime = value;
      this.couponDetail.formEndTime = value;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.activityImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.activityImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.couponDetail.activityImage = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.couponDetail.activityImage = null;
      this.couponDetail.activityImage = fileList[0].url;
    },
    handleSetting(params) {
      this.tempModalType = null;
      // FIXME 查询商品规格分页信息（后期按钮触发，或者先存储，需要时再调用接口）
      this.getProductTableData();
      // 查询限时抢购关联商品
      this.searchRelationRowData.activityFlashsaleId = params.row.id;
      this.addRelationDetail.activityFlashsaleId = params.row.id;
      this.getRelationTableData();
      this.modalEdit = true;

      // // console.log('setGoodsStandard:' + JSON.stringify(params.row));
      // var rows = params.row;
      // // rows.unitsList = this.unitsList;
      // setSmallGoodsStandard(rows);
      // this.turnToPage({
      //   name: 'small-goods-standard',
      //   params: { productId: params.row.id }
      //   // params: { id: params.row.id, unitsList: this.unitsList, productName: params.row.productName }
      // });
    },
    goBack() {
      this.turnToPage('goods-detail');
    },
    getRelationTableData() {
      getCouponTemplateRelationPages(this.searchRelationRowData).then(res => {
        // 设置行是否可编辑
        if (res.rows.length !== 0) {
          res.rows.forEach(element => {
            element.isEdit = false;
          });
          this.relationDetail = res.rows;
        } else {
          this.relationDetail = null;
        }
        // this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
