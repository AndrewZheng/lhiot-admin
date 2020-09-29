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
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.nickName"
              placeholder="用户昵称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
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
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>机器人详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">主键ID:</i-col>
              <i-col span="18">{{ robotDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">门店id:</i-col>
              <i-col span="18">{{ robotDetail.storeId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">门店名称:</i-col>
              <i-col span="18">{{ robotDetail.storeName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户id:</i-col>
              <i-col span="18">{{ robotDetail.userId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">收货人:</i-col>
              <i-col span="18">{{ robotDetail.receiverName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">联系方式:</i-col>
              <i-col span="18">{{ robotDetail.receiverMobile }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户昵称:</i-col>
              <i-col span="18">{{ robotDetail.nickName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">用户头像:</i-col>
              <i-col span="18">
                <img :src="robotDetail.avater" style="width: 150px" >
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改机器人信息':'创建机器人信息' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="robotDetail" :rules="ruleInline" :label-width="90">
          <Row>
            <Col span="18">
            <FormItem :label-width="85" label="所属门店:" prop="storeId">
              <Select v-model="robotDetail.storeId">
                <Option
                  v-for="(item,index) in flagShipList"
                  :value="item.storeId"
                  :key="index"
                  class="ptb2-5"
                  style="padding-left: 5px"
                  @click.native="selectStore(item)"
                >{{ item.storeName }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="用户ID:" prop="userId">
              <InputNumber v-model="robotDetail.userId"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="收货人:" prop="receiverName">
              <Input v-model="robotDetail.receiverName "></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="联系方式:" prop="receiverMobile">
              <Input v-model="robotDetail.receiverMobile"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="用户昵称:" prop="nickName">
              <Input v-model="robotDetail.nickName"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="用户头像   推荐使用尺寸为400X225(单位:px):" prop="avater">
              <Input v-show="false" v-model="robotDetail.avater" style="width: auto"></Input>
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
            </FormItem>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteRobot,
  getRobotPages,
  editRobot,
  createRobot,
  getStorePages,
  deletePicture
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const robotDetail = {
  id: 0,
  storeId: 0,
  storeName: '',
  userId: 0,
  receiverName: '',
  receiverMobile: '',
  nickName: '',
  avater: ''
};

const roleRowData = {
  nickName: '',
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
        storeId: [{ required: true, message: '请选择门店' }],
        userId: [
          { required: true, message: '请输入用户id' },
          { message: '必须为非零整数', pattern: /^[-1-9]\d*$/ }
        ],
        receiverName: [{ required: true, message: '请输入收货人' }],
        receiverMobile: [
          {
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '电话号码不正确',
            trigger: 'blur'
          }
        ],
        nickName: [{ required: true, message: '请输入用户昵称' }],
        avater: [{ required: true, message: '请上传用户头像' }]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      flagShipList: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '门店ID',
          align: 'center',
          key: 'storeId'
        },
        {
          title: '门店名称',
          align: 'center',
          key: 'storeName'
        },
        {
          title: '用户ID',
          align: 'center',
          key: 'userId'
        },
        {
          title: '收货人',
          align: 'center',
          key: 'receiverName'
        },
        {
          title: '联系方式',
          align: 'center',
          key: 'receiverMobile'
        },
        {
          title: '用户昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '用户头像',
          align: 'center',
          key: 'avater',
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.avater} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '操作',
          minWidth: 80,
          align: 'center',
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      robotDetail: _.cloneDeep(robotDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.loading = true;
    this.createLoading = true;
    this.getTableData();
    getStorePages({
      page: 1,
      rows: 100
    }).then(res => {
      this.flagShipList = res.rows;
      this.createLoading = false;
    });
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.robotDetail.storeImage = null;
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
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStore();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editStore();
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
    createStore() {
      this.modalViewLoading = true;
      createRobot(this.robotDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editStore() {
      this.modalViewLoading = true;
      editRobot(this.robotDetail)
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.robotDetail = _.cloneDeep(robotDetail);
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
      deleteRobot({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.avater != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.avater;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.robotDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.avater);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.robotDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.robotDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getRobotPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.robotDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.robotDetail.avater = null;
      this.robotDetail.avater = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    selectStore(options) {
      this.robotDetail.storeName = options.storeName;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
