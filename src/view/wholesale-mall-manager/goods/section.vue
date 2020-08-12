<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="3" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="21" order="3">
        <Card>
          <h6>
            当前选中：
            <span
              class="brand-red font-sm"
            >{{ parentCategory.plateName? parentCategory.plateName: '全部板块' }}</span>
          </h6>
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
              <Row>
                <Input
                  v-model="searchRowData.plateName"
                  placeholder="板块名称"
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
              <Button
                v-waves
                :loading="clearSearchLoading"
                type="warning"
                class="mr5"
                @click="handleBack"
              >
                <Icon type="ios-arrow-back" />&nbsp;返回全部板块
              </Button>
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
                :page-size="searchRowData.rows"
                :page-size-opts="templatePageOpts"
                show-sizer
                show-total
                @on-change="changePage"
                @on-page-size-change="changePageSize"
              ></Page>
            </Row>
          </div>
        </Card>
      </i-col>
    </Row>

    <!--编辑 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建板块':'编辑板块' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="currentCategory" :rules="ruleInline" :label-width="100">
          <FormItem v-show="isCreate" label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem v-show="isCreate" label="父级名称:">
            <i-col
              style="color:red;font-weight:bold;"
            >
              {{ parentCategory.plateName?parentCategory.plateName:'全部板块' }}
            </i-col>
          </FormItem>
          <FormItem :label-width="100" label="板块名称:" prop="plateName">
            <Input v-model="currentCategory.plateName" style="width:200px;"></Input>
          </FormItem>
          <FormItem :label-width="100" label="板块顺序:" prop="rank">
            <InputNumber v-model="currentCategory.rank"></InputNumber>
          </FormItem>
          <FormItem :label-width="100" label="板块布局:" prop="layout">
            <Select
              v-model="currentCategory.layout"
              placeholder="请选择布局方式"
              style="padding-right: 5px; width:205px;"
            >
              <Option
                v-for="(item,index) in layoutEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="板块图片:建议尺寸;750x338(单位:px):" prop="plateImage">
            <Input v-show="false" v-model="currentCategory.plateImage" style="width: auto"></Input>
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
              group-type="base_image"
              file-dir="product"
              @on-success="handleSuccessMain"
            >
              <div slot="content" style="width:58px;height:58px;line-height:58px">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </IViewUpload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import IViewUpload from '_c/iview-upload';

import {
  createProductSection,
  deleteProductSection,
  getProductSectionPages,
  getProductSectionTree,
  editProductSection,
  deletePicture
} from '@/api/wholesale';
import { layoutEnum } from '@/libs/enumerate';
import { layoutConvert } from '@/libs/converStatus';
import { buildMenu, convertTree } from '@/libs/util';

import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const currentCategory = {
  id: 0,
  rank: 0,
  levels: 0,
  parentId: 0,
  plateName: '',
  plateImage: '',
  layout: '', // xlayout-横向布局 ylayout-纵向布局 roll-滚动布局 list-列表-用于推荐商品
  parentPlateName: '',
  channelGoods: []
};

const roleRowData = {
  plateName: '',
  page: 1,
  rows: 20,
  sidx: 'rank'
};

const dataColumns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    align: 'center'
  },
  {
    title: '板块ID',
    key: 'id',
    align: 'center',
    maxWidth: 80
  },
  {
    title: '板块名称',
    key: 'plateName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '板块布局',
    key: 'layout',
    align: 'center',
    minWidth: 150,
    render: (h, params, vm) => {
      const { row } = params;
      return <div>{layoutConvert(row.layout)}</div>;
    }
  },
  {
    title: '板块图片',
    key: 'plateImage',
    align: 'center',
    maxWidth: 790,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.plateImage} height='60' width='100%' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '排序',
    key: 'rank',
    sortable: true,
    align: 'center',
    minWidth: 150
  },
  {
    title: '操作',
    key: 'handle',
    align: 'center',
    minWidth: 150,
    options: ['edit', 'delete']
  }
];

export default {
  components: {
    Tables,
    CommonIcon,
    IViewUpload
  },
  mixins: [tableMixin, searchMixin, deleteMixin, uploadMixin],
  data() {
    return {
      layoutEnum,
      templatePageOpts: [20, 50],
      menuData: [],
      uploadListMain: [],
      defaultListMain: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      uploadVisible: false,
      clearSearchLoading: false,
      currentParentName: '',
      imgUploadViewItem: '',
      imageSize: 2048,
      currentParentId: 0,
      currentCategory: _.cloneDeep(currentCategory),
      parentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      columns: dataColumns,
      ruleInline: {
        plateName: [{ required: true, message: '请输入板块名称' }],
        plateImage: [{ required: false, message: '请上传上板块图片' }],
        rank: [
          { required: true, message: '请输入板块排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      }
    };
  },
  created() {
    this.initMenuList();
    this.parentCategory.plateName = '全部版块';
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductSectionPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        }
      });
    },
    handleCreate() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = _.cloneDeep(currentCategory);
      }
      this.currentCategory.parentId = this.parentCategory.id;
      this.currentCategory.parentPlateName = this.parentCategory.plateName;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.currentCategory.parentId =
        this.parentCategory.id !== 0 ? this.parentCategory.id : 0;
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.modalEditLoading = true;
          this.modalViewLoading = true;
          if (this.isCreate) {
            this.createProductSection();
          } else if (this.isEdit) {
            this.editProductSection();
          }
        } else {
          this.$Message.error('请完善板块信息!');
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
    createProductSection() {
      this.modalEditLoading = true;
      this.modalViewLoading = true;
      createProductSection(this.currentCategory)
        .then(res => {
          this.$Message.info('添加成功!');
        })
        .finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    editProductSection() {
      this.modalEditLoading = true;
      this.modalViewLoading = true;
      editProductSection(this.currentCategory)
        .then(res => {
          this.$Message.info('修改成功!');
        })
        .finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    // 编辑分类
    handleEdit(params) {
      if (this.parentCategory.plateName === '全部版块') {
        this.$Message.warning('请先从左侧选择一个板块');
        return;
      }
      this.save = [];
      this.save.push(params.row.avater);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);

      this.setDefaultUploadList(params.row);
      this.modalEdit = true;
    },
    handleBack() {
      this.parentCategory.id = 0;
      this.parentCategory.plateName = '全部版块';
      this.handleClear();
    },
    deleteTable(ids) {
      deleteProductSection({
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
          this.initMenuList();
          this.searchRowData.page = this.page;
          this.getTableData();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree().then(res => {
        if (res && res.length > 0) {
          const menuList = buildMenu(res);
          const map = {
            title: 'title',
            children: 'children'
          };
          this.menuData = convertTree(menuList, map, true);
          if (this.menuData.length > 0) {
            this.getTableData();
          }
        }
      });
    },
    renderContent(h, { root, node, data }) {
      if (data.type == 'PARENT') {
        return (
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span>
              <CommonIcon type='ios-folder' class='mr10' />
            </span>
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      } else {
        return (
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span>
              <CommonIcon type='ios-paper' class='mr10' />
            </span>
            <span onClick={() => this.handleClick({ root, node, data })}>
              {data.title}
            </span>
          </div>
        );
      }
    },
    handleClick({ root, node, data }) {
      this.loading = true;
      // 展开当前节点
      if (typeof data.expand === 'undefined') {
        // this.$set(data, 'expend', true);
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.parentCategory.id = data.id;
      this.parentCategory.plateName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
      // 获取新数据
      this.getTableData();
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.plateImage != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.plateImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.currentCategory.plateImage = null;
      this.currentCategory.plateImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.currentCategory.plateImage = null;
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.currentCategory.plateImage = null;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
