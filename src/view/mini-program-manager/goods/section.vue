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
            <span class="brand-red font-sm">{{
              parentCategory.groupName ? parentCategory.groupName : "全部板块"
            }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="13"
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
                  v-model="searchRowData.sectionName"
                  placeholder="板块名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
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
            <div slot="operations" style="width: 400px; margin-left: -90px">
              <Button
                v-waves
                :loading="clearSearchLoading"
                type="warning"
                class="mr5"
                @click="handleBack"
              >
                <Icon type="ios-arrow-back" />&nbsp;返回全部板块
              </Button>
              <Button v-waves type="success" class="mr5" @click="addSection">
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
          <div style="margin: 10px; overflow: hidden">
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
      </i-col>
    </Row>

    <!--编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ currentCategory.id == "" ? "创建板块" : "编辑板块" }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="currentCategory"
          :rules="ruleInline"
          :label-width="140"
        >
          <FormItem label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem label="父级名称:">
            <i-col style="color: red; font-weight: bold">{{
              parentCategory.groupName ? parentCategory.groupName : "全部板块"
            }}</i-col>
          </FormItem>
          <FormItem label="板块名称:" prop="sectionName">
            <Input v-model="currentCategory.sectionName"></Input>
          </FormItem>
          <FormItem label="板块描述:" prop="sectionRemarks">
            <Input v-model="currentCategory.sectionRemarks"></Input>
          </FormItem>
          <FormItem label="板块位置英文描述:" prop="positionName">
            <Input v-model="currentCategory.positionName"></Input>
          </FormItem>
          <FormItem label="板块顺序:" prop="rankNo">
            <InputNumber v-model="currentCategory.rankNo"></InputNumber>
          </FormItem>
          <FormItem label="板块图片:建议尺寸;45x45(单位:px):" prop="sectionImg">
            <Input
              v-show="false"
              v-model="currentCategory.sectionImg"
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
              file-dir="plate"
              @on-success="handleSuccessMain"
            >
              <div
                slot="content"
                style="width: 58px; height: 58px; line-height: 58px"
              >
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </IViewUpload>
          </FormItem> </Form>*Tips：如果添加
        <b style="color: red">父级板块</b>&nbsp;,板块位置英文描述需添加
        <b style="color: red">-F</b>&nbsp;后缀,如
        <b style="color: red">XXXX-F</b>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalEditLoading"
          type="primary"
          @click="handleSubmit"
        >确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  createProductSection,
  deleteProductSection,
  getProductSectionPages,
  getProductSectionTree,
  editProductSection,
  deleteProductSectionValidation
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import IViewUpload from '_c/iview-upload';
import { appTypeEnum } from '@/libs/enumerate';
import { appTypeConvert } from '@/libs/converStatus';

const currentCategory = {
  applyType: 'S_MALL', // 默认就一个小程序 S_MALL
  id: 0,
  parentId: 0,
  sectionProductId: 0,
  sectionName: '',
  sectionImg: '',
  rankNo: 0,
  productStandardList: [],
  positionName: '',
  sectionRemarks: ''
};

const roleRowData = {
  sectionName: null,
  page: 1,
  rows: 10,
  sidx: 'rank_no'
};

const dataColumns = [
  {
    type: 'selection',
    key: '',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '板块ID',
    key: 'id',
    align: 'center',
    minWidth: 80
  },
  {
    title: '板块名称',
    key: 'sectionName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '板块描述',
    key: 'sectionRemarks',
    align: 'center',
    minWidth: 150
  },
  {
    title: '板块图片',
    key: 'sectionImg',
    align: 'center',
    minWidth: 120,
    render: (h, params, vm) => {
      const { row } = params;
      const str = <img src={row.sectionImg} height='60' width='60' />;
      return <div>{str}</div>;
    }
  },
  {
    title: '位置英文描述',
    key: 'positionName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '排序',
    key: 'rankNo',
    sortable: true,
    align: 'center',
    minWidth: 70
  },
  {
    title: '操作',
    key: 'handle',
    align: 'center',
    minWidth: 120,
    options: ['edit', 'delete']
  }
];

export default {
  components: {
    Tables,
    CommonIcon,
    IViewUpload
  },
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      appTypeEnum,
      menuData: [],
      uploadListMain: [],
      defaultListMain: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      currentParentName: '',
      currentParentId: 0,
      ruleInline: {
        sectionName: [{ required: true, message: '请输入板块名称' }],
        sectionRemarks: [{ required: false, message: '请输入板块描述' }],
        positionName: [
          {
            required: true,
            message: '请输入板块位置英文描述,父级板块需添加 -F 后缀,如 XXXX-F'
          }
        ],
        sectionImg: [{ required: true, message: '请上传上板块图片' }],
        rankNo: [
          { required: true, message: '请输入板块排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ]
      },
      columns: dataColumns,
      currentCategory: _.cloneDeep(currentCategory),
      parentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      treeData: _.cloneDeep(currentCategory)
    };
  },
  created() {
    this.initMenuList();
    this.parentCategory.groupName = '全部版块';
  },
  methods: {
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.currentCategory.sectionImg = null;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    getTableData() {
      this.loading = true;
      getProductSectionPages(this.searchRowData).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    handleEdit(params) {
      if (
        params.row.positionName.indexOf('F') == -1 &&
        this.parentCategory.groupName === '全部版块'
      ) {
        this.$Message.warning('请从左侧选择一个板块');
        return;
      }
      this.save = [];
      this.save.push(params.row.sectionImg);
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.modalEdit = true;
    },
    handleBack() {
      this.parentCategory.groupName = '全部版块';
      this.resetSearchRowData();
      this.initMenuList();
    },
    addSection() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = this._.cloneDeep(currentCategory);
      }
      this.currentCategory.currentParentId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleSubmit() {
      this.currentCategory.parentId = this.parentCategory.id ? this.parentCategory.id : 0;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createRowData();
          } else if (this.isEdit) {
            this.updateRowData();
          }
        } else {
          this.$Message.error('请完善板块信息!');
        }
      });
    },
    createRowData() {
      this.modalEditLoading = true;
      createProductSection(this.currentCategory)
        .then((res) => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally((res) => {
          this.modalEditLoading = false;
        });
    },
    updateRowData() {
      this.modalEditLoading = true;
      editProductSection(this.currentCategory)
        .then((res) => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally((res) => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      deleteProductSectionValidation({ ids })
        .then((res) => {
          if (!res) {
            this.$Message.info('该板块或其子板块关联了商品，删除失败！');
          } else if (res) {
            deleteProductSection({
              ids
            })
              .then((res) => {
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
          }
        })
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree(this.treeData).then((res) => {
        const menuList = buildMenu(res.array);
        const map = {
          title: 'title',
          children: 'children'
        };
        this.menuData = convertTree(menuList, map, false);
        this.getTableData();
      });
    },
    renderContent(h, { root, node, data }) {
      if (data.type === 'PARENT') {
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
        // if (data.children) {
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.parentCategory.id = data.id;
      this.parentCategory.groupName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
      this.getTableData();
    },
    setDefaultUploadList(res) {
      if (res.sectionImg != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.sectionImg;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.currentCategory.sectionImg = null;
      this.currentCategory.sectionImg = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.currentCategory.sectionImg = null;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
