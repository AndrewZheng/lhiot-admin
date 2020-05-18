<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.taskName"
            placeholder="任务名称"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.taskType"
            placeholder="任务类型"
            class="mr5"
            style="width: 120px"
            clearable
          >
            <Option
              v-for="(item,index) in taskTypeEnum"
              :value="item.value"
              :key="index"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
            :searchLoading="searchLoading"
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

    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建任务':'编辑任务' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="taskDetail" :rules="ruleInline">
          <Row>
            <FormItem label="任务名称:" prop="taskName">
              <Input v-model="taskDetail.taskName" placeholder="请输入任务名称" style="width: 200px"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="任务类型:" prop="taskType">
              <Select
                v-model="taskDetail.taskType"
                class="search-col mr5"
                placeholder="请选择"
                style="width:200px"
                clearable
              >
                <Option
                  v-for="item in taskTypeEnum"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="任务积分:" prop="taskIntegral">
              <Input v-model="taskDetail.taskIntegral" placeholder="请输入任务积分" style="width: 200px"></Input>
            </FormItem>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="任务图标(推荐尺寸为36*36(单位:px)):" prop="taskImage">
                <Input v-show="false" v-model="taskDetail.taskImage" style="width: auto"></Input>
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
                  file-dir="task"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem label="任务Banner图(推荐尺寸为750*568(单位:px)):" prop="taskBannerImage">
                <Input v-show="false" v-model="taskDetail.taskBannerImage" style="width: auto"></Input>
                <div v-for="item in uploadListBanner" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" >
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveBanner(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadBanner"
                  :default-list="defaultListBanner"
                  :image-size="imageSize"
                  group-type="activity_image"
                  file-dir="task"
                  @on-success="handleSuccessBanner"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col> -->
          </Row>
          <Row>
            <FormItem label="任务描述:" prop="taskDesc">
              <Input v-model="taskDetail.taskDesc" placeholder="请输入任务描述"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="任务规则:" prop="taskRuleDesc">
              <Input
                :rows="6"
                v-model="taskDetail.taskRuleDesc"
                type="textarea"
              ></Input>
            </FormItem>
          </Row>

        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import {
  getTaskPages,
  editTask,
  deleteTask,
  createTask,
  deletePicture
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import uploadMixin from '@/mixins/uploadMixin.js';
import { taskTypeEnum } from '@/libs/enumerate';
import { taskTypeConvert } from '@/libs/converStatus';

const taskDetail = {
  createTime: '',
  id: 0,
  taskBannerImage: '',
  taskDesc: '',
  taskImage: '',
  taskIntegral: 0,
  taskName: '',
  taskRuleDesc: '',
  taskType: ''
};

const searchRowData = {
  taskName: '',
  taskType: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [tableMixin, searchMixin, deleteMixin, uploadMixin],
  data() {
    return {
      taskTypeEnum,
      ids: [],
      defaultListMain: [],
      uploadListMain: [],
      defaultListBanner: [],
      uploadListBanner: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      modalEditLoading: false,
      searchRowData: this._.cloneDeep(searchRowData),
      taskDetail: this._.cloneDeep(taskDetail),
      columns: [
        {
          type: 'selection',
          key: '',
          align: 'center',
          width: 60
        },
        {
          title: '编号',
          align: 'center',
          key: 'id',
          width: 80
        },
        {
          title: '任务图标',
          align: 'center',
          key: 'taskImage',
          width: '120',
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.taskImage ? row.taskImage : this.defaultImg} height='60' width='60' class='img' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '任务名称',
          align: 'center',
          key: 'taskName',
          resizable: true,
          width: '150'
        },
        {
          title: '任务类型',
          align: 'center',
          key: 'taskType',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{taskTypeConvert(row.taskType).label}</div>;
          }
        },
        {
          title: '任务积分',
          align: 'center',
          key: 'taskIntegral',
          width: '100'
        },
        {
          title: '任务描述',
          align: 'center',
          key: 'taskDesc'
        },
        //   {
        //     title: '任务规则',
        //     align: 'center',
        //     key: 'taskRuleDesc',
        //     resizable: true,
        //     width: '150px'
        //   },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      ruleInline: {
        taskBannerImage: { required: false, message: '请上传任务Banner图标' },
        taskImage: { required: false, message: '请上传任务小图标' },
        taskIntegral: { required: true, message: '请填写任务积分' },
        taskType: { required: true, message: '请选择任务类型' },
        taskName: { required: true, message: '请填写任务名称' }
      }
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.loading = true;
      getTaskPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(searchRowData);
    },
    handleCreate() {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.create;
      this.taskDetail = taskDetail;
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.edit;
      this.taskDetail = this._.cloneDeep(params.row);
      if (this.taskDetail.taskRuleDesc) {
        this.taskDetail.taskRuleDesc = this.taskDetail.taskRuleDesc.replace(/&/g, '\n');
      }
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 任务规则换行用“&”拼接
          if (this.taskDetail.taskRuleDesc) {
            this.taskDetail.taskRuleDesc = this.taskDetail.taskRuleDesc.replace(/\n|\r/g, '&');
          }
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善任务信息!');
        }
      });
    },
    editTableRow() {
      this.modalEditLoading = true;
      editTask(this.taskDetail).then(res => {
        this.modalEdit = false;
        this.getTableData();
        this.resetFields();
      }).finally(() => {
        this.modalEditLoading = false;
      });
    },
    createTableRow() {
      createTask(this.taskDetail)
        .then(res => {})
        .finally(res => {
          this.modalEdit = false;
          this.getTableData();
          this.resetFields();
        }).finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      this.loading = true;
      deleteTask({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.taskImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.taskImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = { urls: this.newPicture };
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
    // },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.taskDetail.taskImage = null;
    },
    handleRemoveBanner(file) {
      this.$refs.uploadBanner.deleteFile(file);
      this.taskDetail.taskBannerImage = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.taskDetail.taskImage = null;
      this.taskDetail.taskImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleSuccessBanner(response, file, fileList) {
      this.uploadListBanner = fileList;
      this.taskDetail.taskBannerImage = null;
      this.taskDetail.taskBannerImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    }
  }
};
</script>
<style lang="scss" scoped>
.img {
    margin-top: .25rem !important;
    vertical-align: middle;
}
</style>

