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
          <Row v-if="this.$route.name != 'small-relation-system'">
            <Input
              v-model="searchRowData.indexName"
              placeholder="键"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.description"
              placeholder="描述"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Cascader
              v-model="defaultSystemCategoryData"
              change-on-select
              :data="systemCategoryData"
              class="search-col"
              @on-change="systemCategoryChange1"
            ></Cascader>
            <Button
              :search-loading="searchLoading"
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
            v-if="this.$route.name === 'small-relation-system'"
            v-waves
            class="search-btn ml5 mr5"
            type="primary"
            @click="goBack"
          >
            <Icon type="ios-arrow-back" />&nbsp;返回
          </Button>
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
        <span>系统参数详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">主键ID:</i-col>
              <i-col span="20">{{ systemDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">键:</i-col>
              <i-col span="20">{{ systemDetail.indexName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">值:</i-col>
              <i-col span="20">{{ systemDetail.indexValue }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">描述:</i-col>
              <i-col span="20">
                {{ systemDetail.description }}
                <img
                  v-if="showImage"
                  :src="systemDetail.description"
                  width="70%"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">分类ID:</i-col>
              <i-col span="20">{{ systemDetail.categoryId }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改系统参数':'创建系统参数' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="systemDetail" :rules="ruleInline" :label-width="80">
          <Row v-if="tempModalType===modalType.edit">
            <Col span="20">
            <FormItem label="键:" prop="indexName">
              <Input v-model="systemDetail.indexName" placeholder="键" disabled></Input>
            </FormItem>
            </Col>
          </Row>
          <Row v-else-if="tempModalType===modalType.create">
            <Col span="20">
            <FormItem label="键:" prop="indexName">
              <Input v-model="systemDetail.indexName" placeholder="键"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
            <FormItem label="值:" prop="indexValue">
              <Input v-model="systemDetail.indexValue" :rows="6" type="textarea" placeholder="值"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
            <FormItem label="描述:" prop="description">
              <Input v-model="systemDetail.description" type="textarea" placeholder="描述"></Input>
              <template v-if="showImage">
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
              </template>
              <IViewUpload
                ref="uploadMain"
                :default-list="defaultListMain"
                :image-size="imageSize"
                @on-success="handleSuccessMain"
              >
                <div slot="content" style="width:58px;height:58px;line-height:58px">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </IViewUpload>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col v-show="this.$route.name === 'small-relation-system'" span="20">
            <FormItem label="分类ID:" prop="categoryId">
              <Cascader
                v-model="defaultData"
                disabled
                :data="skipData"
                span="21"
                @on-change="systemCategoryChange"
              ></Cascader>
            </FormItem>
            </Col>
            <Col v-show="this.$route.name != 'small-relation-system'" span="20">
            <FormItem label="分类ID:" prop="categoryId">
              <Cascader
                v-model="defaultSystemCategoryData"
                change-on-select
                :data="systemCategoryData"
                span="21"
                @on-change="systemCategoryChange"
              ></Cascader>
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
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import {
  deleteSystemSetting,
  getSystemSettingPages,
  editSystemSetting,
  createSystemSetting,
  getSystemSettingCategoryTree
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import {
  buildMenu,
  convertTreeCategory,
  getSmallGoodsStandard
} from '@/libs/util';

const systemDetail = {
  id: 0,
  indexName: '',
  indexValue: '',
  description: '',
  categoryId: 0
};

const roleRowData = {
  indexName: null,
  indexValue: null,
  categoryId: null,
  description: null,
  page: 1,
  rows: 10
};

const categoryRowData = {
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
      skipData: [],
      defaultData: [],
      systemCategoryData: [],
      defaultSystemCategoryData: [41],
      systemCategoriesTreeList: [],
      defaultListMain: [],
      uploadListMain: [],
      showImage: false,
      ruleInline: {
        indexName: [{ required: true, message: '请输入键' }],
        indexValue: [{ required: true, message: '请输入值' }],
        categoryId: [
          { required: true, message: '请选择分类' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        description: [{ required: true, message: '请输入描述' }]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '分类名称',
          key: 'categoriesName',
          align: 'center',
          width: 130
        },
        {
          title: '键',
          align: 'center',
          key: 'indexName'
        },
        {
          title: '值',
          align: 'center',
          key: 'indexValue',
          type: 'html'
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      searchTreeRowData: _.cloneDeep(categoryRowData),
      systemDetail: _.cloneDeep(systemDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getSystemSettingCategoryTree();
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
      this.systemDetail.description = null;
    },
    getSystemSettingCategoryTree() {
      getSystemSettingCategoryTree()
        .then(res => {
          if (res && res.array.length > 0) {
            this.systemCategoriesTreeList = res.array;
            const menuList = buildMenu(res.array);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.systemCategoryData = convertTreeCategory(menuList, map, true);
          }
        })
    },
    getTableData() {
      if (this.$route.name === 'small-relation-system') {
        const systemInfos = getSmallGoodsStandard();
        this.skipArr = systemInfos;
        this.searchRowData.categoryId = systemInfos.id;
        this.skipData = [];
        this.skipData = [
          {
            value: this.skipArr.parentid,
            label: this.skipArr.parentName,
            children: [
              {
                value: this.skipArr.id,
                label: this.skipArr.categoriesName
              }
            ]
          }
        ];
        this.defaultData = [this.skipArr.parentid, this.skipArr.id];
      }
      getSystemSettingPages(this.searchRowData)
        .then(res => {
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              element.indexValue = element.indexValue == null ? null : element.indexValue.replace(/&/g, '\n');
            });
          }
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    addStore() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.systemDetail = _.cloneDeep(systemDetail);
      this.modalEdit = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.systemDetail = _.cloneDeep(params.row);
      if (this.systemDetail.description != null) {
        this.showImage = this.systemDetail.description.indexOf('http') != -1;
      }
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.systemDetail = _.cloneDeep(params.row);
      if (this.systemDetail.description != null) {
        this.showImage = this.systemDetail.description.indexOf('http') != -1;
      }
      this.setDefaultUploadList(this.systemDetail);
      this.defaultGoodsCategoryData = [];
      this.findGroupId(this.systemDetail.categoryId);
      this.defaultGoodsCategoryData.reverse();
      this.modalEdit = true;
    },
    handleSubmit(name) {
      if (this.$route.name === 'small-relation-system') {
        const systemInfos = getSmallGoodsStandard();
        this.systemDetail.categoryId = systemInfos.id;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.systemDetail.indexValue = this.systemDetail.indexValue.replace(
            /\n|\r/g,
            '&'
          );
          if (this.isCreate) {
            // 添加状态
            this.createStore();
          } else if (this.isEdit) {
            // 编辑状态
            this.editStore();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createSystemSetting(this.systemDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    editStore() {
      this.modalViewLoading = true;
      editSystemSetting(this.systemDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    deleteTable(ids) {
      deleteSystemSetting({
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
        });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.imageDetail.storeImage = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.systemDetail.description = null;
      this.systemDetail.description = fileList[0].url;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.description != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.description;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    // 选择分类
    systemCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.systemDetail.categoryId = selectedData[selectedData.length - 1].id;
      } else {
        this.systemDetail.categoryId = null;
      }
      this.defaultSystemCategoryData = selectedData;
    },
    // 选择分类搜索
    systemCategoryChange1(value, selectedData) {
      if (selectedData.length > 0) {
        this.searchRowData.categoryId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.searchRowData.categoryId = null;
      }
      this.defaultSystemCategoryData = selectedData;
    },
    findGroupId(id) {
      const obj = this.systemCategoriesTreeList.find(item => {
        return item.id === id;
      });
      this.defaultSystemCategoryData.push(id);
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    },
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
