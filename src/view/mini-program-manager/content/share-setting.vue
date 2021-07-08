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
        @on-sale="handleSwitch"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
        @on-relevance="handleSetting"
      >
        <div slot="operations">
          <Row>
            <!-- <Input
              v-model="searchRowData.activityName"
              placeholder="活动标题"
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
              class="search-btn mr5"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>-->
            <Button v-waves type="success" class="mr5" @click="addShareSetting">
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
          </Row>
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

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>注册送礼活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动ID:
              </i-col>
              <i-col span="18">
                {{ shareDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动名称:
              </i-col>
              <i-col span="18">
                {{ shareDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动状态:
              </i-col>
              <i-col span="18">
                {{
                  shareDetail.onOff | imageStatusFilter
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">领券方式:</i-col>
              <i-col span="18">{{ shareDetail.receiveType | imageStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                开始时间:
              </i-col>
              <i-col span="18">
                {{
                  (this.shareDetail.beginTime = this.$moment(
                    this.shareDetail.beginTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                结束时间:
              </i-col>
              <i-col span="18">
                {{
                  (this.shareDetail.endTime = this.$moment(
                    this.shareDetail.endTime
                  ).format("YYYY-MM-DD HH:mm:ss"))
                }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建人:
              </i-col>
              <i-col span="18">
                {{ shareDetail.createBy }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ shareDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动规则:
              </i-col>
              <i-col span="18">
                <Input
                  :v-if="shareDetail.activityRule"
                  :rows="6"
                  :value="shareDetail.activityRule"
                  type="textarea"
                ></Input>
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

    <Modal
      v-model="modalEdit"
      :width="800"
      :z-index="1000"
      :mask-closable="false"
    >
      <p slot="header">
        <i-col>
          {{
            isEdit
              ? "修改板块活动分享配置"
              : "创建板块活动分享配置"
          }}
        </i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Form
            ref="editForm"
            :model="shareDetail"
            :rules="ruleInline"
            :label-width="130"
          >
            <Row>
              <Col span="22">
              <FormItem label="分享页面名称:" prop="sharePageName">
                <Input v-model="shareDetail.sharePageName"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
              <FormItem label="分享页面路径:" prop="sharePagePath">
                <Input v-model="shareDetail.sharePagePath"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
              <FormItem label="分享内容:" prop="shareContext">
                <Input v-model="shareDetail.shareContext"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
              <!-- <FormItem label="分享图片路径:" prop="shareUrl">
                  <Input v-model="shareDetail.shareUrl"></Input>
                </FormItem>-->
              <p style="color: #ff3861; margin-left: 59px">
                请上传JPG&PNG格式的图片!
              </p>
              <FormItem label="分享图片:">
                <Input
                  v-show="false"
                  v-model="shareDetail.shareUrl"
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
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
              <FormItem label="分享图片路径:" prop="shareUrl">
                <!-- <Input v-model="shareDetail.shareUrl"></Input> -->
                <Input
                  v-model="shareDetail.shareUrl"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  type="textarea"
                  placeholder="分享图片路径..."
                  readonly
                ></Input>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>
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
import {
  getShareSettingPages,
  deleteShareSetting,
  createShareSettingPages,
  updateShareSetting
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { imageStatusEnum, receiveTypeEnum } from '@/libs/enumerate';
import { setSmallCouponActivity } from '@/libs/util';

const shareDetail = {
  shareContext: '',
  sharePageName: '',
  sharePagePath: '',
  shareUrl: ''
};

const roleRowData = {
  shareContext: '',
  sharePageName: '',
  sharePagePath: '',
  shareUrl: '',
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
      defaultListMain: [],
      uploadListMain: [],
      addTempDataLoading: false,
      tempTableLoading: false,
      templateLoading: false,
      modalRelation: false,
      imageStatusEnum,
      receiveTypeEnum,
      ruleInline: {
        // activityName: [
        //   { required: true, message: "请输入活动名称" },
        //   {
        //     validator(rule, value, callback, source, options) {
        //       const errors = [];
        //       if (value.length > 20) {
        //         errors.push(new Error("字数限制20字"));
        //       }
        //       callback(errors);
        //     },
        //   },
        // ],
        // activityRule: [
        //   { required: true, message: "请输入活动规则" },
        //   {
        //     validator(rule, value, callback, source, options) {
        //       const errors = [];
        //       if (value.length > 200) {
        //         errors.push(new Error("字数限制200字"));
        //       }
        //       callback(errors);
        //     },
        //   },
        // ],
        shareContext: [{ required: true, message: '请输入分享内容' }],
        sharePageName: [{ required: true, message: '请输入分享页面名称' }],
        sharePagePath: [{ required: true, message: '请输入分享页面路径' }],
        shareUrl: [{ required: true, message: '请输入分享图片路径' }]
      },
      columns: [
        {
          title: 'ID',
          align: 'center',
          key: 'id',
          width: 60
        },
        {
          title: '分享页面名称',
          align: 'center',
          key: 'sharePageName',
          minWidth: 80
        },
        {
          title: '分享页面路径',
          align: 'center',
          key: 'sharePagePath',
          minWidth: 160
        },
        {
          title: '分享内容',
          align: 'center',
          key: 'shareContext',
          minWidth: 130
        },
        {
          title: '分享图片',
          align: 'center',
          key: 'shareUrl',
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.shareUrl} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '分享图片路径',
          align: 'center',
          key: 'shareUrl',
          minWidth: 180
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 80,
          options: ['edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      shareDetail: _.cloneDeep(shareDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      if (this.tempModalType == null) {
        this.$refs.modalCreate.resetFields();
      }
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    getTableData() {
      getShareSettingPages(this.searchRowData)
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
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.shareDetail = _.cloneDeep(params.row);
      this.shareDetail.activityRule = this.shareDetail.activityRule.replace(
        /&/g,
        '\n'
      );
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.resetFields();
      this.shareDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.modalEdit = true;
    },
    handleSwitch(params) {
      this.shareDetail = _.cloneDeep(params.row);
      this.shareDetail.onOff = params.row.onOff === 'ON' ? 'OFF' : 'ON';
      this.updateShareSetting();
    },
    beginTimeChange(value, date) {
      this.shareDetail.beginTime = value;
      if (this.shareDetail.beginTime.indexOf('T') > -1) {
        this.shareDetail.beginTime = this.$moment(
          this.shareDetail.beginTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    endTimeChange(value, date) {
      this.shareDetail.endTime = value;
      if (this.shareDetail.endTime.indexOf('T') > -1) {
        this.shareDetail.endTime = this.$moment(
          this.shareDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createShareSettingPages();
          } else if (this.isEdit) {
            this.updateShareSetting();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createShareSettingPages() {
      this.modalEditLoading = true;
      createShareSettingPages(this.shareDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    updateShareSetting() {
      this.modalEditLoading = true;
      updateShareSetting(this.shareDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    addShareSetting() {
      this.tempModalType = this.modalType.create;
      this.shareDetail = _.cloneDeep(shareDetail);
      this.resetFields();
      this.modalEdit = true;
    },
    handleSetting(params) {
      var rows = params.row;
      setSmallCouponActivity(rows);
      this.turnToPage({
        name: 'small-vip-activities-associated'
      });
    },
    deleteTable(ids) {
      deleteShareSetting({
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
          this.$Message.success('删除成功!');
          this.getTableData();
        });
    },
    setDefaultUploadList(res) {
      if (res.shareUrl != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.shareUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.shareDetail.shareUrl = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.shareDetail.shareUrl = null;
      this.shareDetail.shareUrl = fileList[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
