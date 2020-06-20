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
        <span>图片信息详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">主键ID:</i-col>
              <i-col span="20">{{ imageDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">图片类型:</i-col>
              <i-col span="20">{{ imageDetail.imageType|imageTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">图片详情:</i-col>
              <i-col span="20">
                <img :src="imageDetail.imageUrl" width="100%" >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">图片名称:</i-col>
              <i-col span="20">{{ imageDetail.imageName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">排序序号:</i-col>
              <i-col span="20">{{ imageDetail.rank }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">图片状态:</i-col>
              <i-col span="20">{{ imageDetail.imageStatus | imageStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">创建用户:</i-col>
              <i-col span="20">{{ imageDetail.createUser }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">创建时间:</i-col>
              <i-col span="20">{{ imageDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- 图片链接 -->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">图片地址:</i-col>
              <i-col span="20">{{ imageDetail.imageUrl }}</i-col>
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
        <i-col>{{ tempModalType===modalType.edit?'修改图片信息':'创建图片信息' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="imageDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="18">
            <FormItem :label-width="85" label="图片类型:" prop="imageType">
              <Select v-model="imageDetail.imageType">
                <Option
                  v-for="item in imageType"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="图片详情     (推荐尺寸为750X160(单位:px)):" prop="imageUrl">
              <Input v-show="false" v-model="imageDetail.imageUr" style="width: auto"></Input>
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
          <Row>
            <Col span="12">
            <FormItem label="图片名称:" prop="imageName">
              <Input v-model="imageDetail.imageName" placeholder="图片名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="排序序号:" prop="rank">
              <InputNumber :min="0" v-model="imageDetail.rank" placeholder="排序序号"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="图片状态:" prop="imageStatus">
              <Select v-model="imageDetail.imageStatus">
                <Option
                  v-for="item in imageStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
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
  deleteImage,
  getImagePages,
  editImage,
  createImage,
  deletePicture
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { imageStatusConvert, imageTypeConvert } from '@/libs/converStatus';

const imageDetail = {
  id: 0,
  imageType: null,
  imageUrl: '',
  imageName: '',
  rank: 0,
  imageStatus: null,
  createUser: '',
  createTime: ''
};

const roleRowData = {
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
        imageType: [{ required: true, message: '请选择图片类型' }],
        rank: [
          { required: true, message: '请输入排序序号' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        imageName: [{ required: true, message: '请输入图片名称' }],
        imageStatus: [{ required: true, message: '请选择图片状态' }],
        imageUrl: [{ required: true, message: '请上传图片详情' }]
      },
      defaultListMain: [],
      uploadListMain: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      imageType: [{ label: '拼团保障图', value: 'TEAM_GUARANTEE' }],
      imageStatus: [
        { label: '关闭', value: 'OFF' },
        { label: '开启', value: 'ON' }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '图片ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '图片地址',
          align: 'center',
          key: 'imageUrl',
          tooltip: true
        },
        {
          title: '图片',
          align: 'center',
          key: 'imageUrl',
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.imageUrl} width='100%' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '图片类型',
          align: 'center',
          key: 'imageType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.imageType === 'TEAM_GUARANTEE') {
              return (
                <div>
                  <tag color='success' type='border'>
                    {imageTypeConvert(row.imageType).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary' type='border'>
                  {row.imageType}
                </tag>
              </div>
            );
          }
        },
        {
          title: '图片名称',
          align: 'center',
          key: 'imageName'
        },
        {
          title: '排序序号',
          align: 'center',
          key: 'rank'
        },
        {
          title: '图片状态',
          align: 'center',
          key: 'imageStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.imageStatus === 'ON') {
              return (
                <div>
                  <tag color='success'>
                    {imageStatusConvert(row.imageStatus).label}
                  </tag>
                </div>
              );
            } else if (row.imageStatus === 'OFF') {
              return (
                <div>
                  <tag color='error'>
                    {imageStatusConvert(row.imageStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.imageStatus}</tag>
              </div>
            );
          }
        },
        {
          title: '创建用户',
          align: 'center',
          key: 'createUser'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          minWidth: 100
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      imageDetail: _.cloneDeep(imageDetail)
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
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.imageDetail.imageUrl = null;
    },
    handleSubmit(name) {
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
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    createStore() {
      this.modalViewLoading = true;
      createImage(this.imageDetail)
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
      editImage(this.imageDetail)
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
        this.imageDetail = _.cloneDeep(imageDetail);
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
      deleteImage({
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
      if (res.imageUrl != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.imageUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.imageDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.imageUrl);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.imageDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.imageDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getImagePages(this.searchRowData)
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
      this.imageDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.imageDetail.imageUrl = null;
      this.imageDetail.imageUrl = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
