<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>
            当前选中：
            <span
              class="brand-red font-sm"
            >{{ parentCategory.categoryName? parentCategory.categoryName: '父级分类' }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="14"
            :operate-area-column="10"
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
                  v-model="searchRowData.categoryName"
                  placeholder="分类名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Button
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
                <Icon type="ios-arrow-back" />&nbsp;返回父级分类
              </Button>
              <Button v-waves type="success" class="mr5" @click="createParentRow">
                <Icon type="md-add" />添加父分类
              </Button>
              <Button v-waves type="success" class="mr5" @click="createSonRow">
                <Icon type="md-add" />添加子分类
              </Button>
              <Poptip
                confirm
                placement="bottom"
                style="width: 100px"
                title="您确认删除选中的内容吗?"
                @on-ok="handleBatchDel"
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
        <i-col>{{ isEdit?'修改商品分类':'创建商品分类' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :label-width="100" :rules="ruleInline" :model="currentCategory">
          <FormItem label="父级ID:" prop="parentId">
            <i-col>{{ currentCategory.parentId }}</i-col>
          </FormItem>
          <FormItem label="父级分类:">
            <i-col>{{ parentCategory.categoryName }}</i-col>
          </FormItem>
          <FormItem label="分类名称:" prop="categoryName">
            <Input v-model="currentCategory.categoryName" placeholder="分类名称" style="width:150"></Input>
          </FormItem>
          <FormItem label="分类排序:" prop="rank">
            <Input v-model="currentCategory.rank" placeholder="分类排序" style="width:80"></Input>
          </FormItem>
          <FormItem v-show="!addSon" label="分类图标:建议尺寸;400x400(单位:px):" prop="image">
            <Input v-show="false" v-model="currentCategory.image" style="width: auto"></Input>
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
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit('editForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import IViewUpload from '_c/iview-upload';

import {
  createProductCategories,
  delProductCategories,
  getProductCategoriesPages,
  getProductCategoriesTree,
  editProductCategories
} from '@/api/wholesale';
import { buildMenu, convertTree } from '@/libs/util';

import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';

const currentCategory = {
  id: 0,
  parentId: 0,
  categoryCode: '',
  categoryName: '',
  image: '',
  levels: 0,
  parentCategoryCode: '',
  parentCategoryName: '',
  rank: 0
};

const roleRowData = {
  parentId: 0,
  categoryName: '',
  page: 1,
  rows: 20
};

export default {
  components: {
    Tables,
    IViewUpload,
    CommonIcon
  },
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      menuData: [],
      templatePageOpts: [20, 50],
      uploadListMain: [],
      defaultListMain: [],
      addSon: false,
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      clearSearchLoading: false,
      currentParentName: '',
      currentParentId: 0,
      currentCategory: _.cloneDeep(currentCategory),
      parentCategory: _.cloneDeep(currentCategory),
      searchRowData: _.cloneDeep(roleRowData),
      ruleInline: {
        categoryName: { required: true, message: '请填写单位名称' }
      },
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center'
        },
        {
          title: '商品分类ID',
          key: 'id',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '分类名',
          key: 'categoryName',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '排序',
          key: 'rank',
          sortable: true,
          align: 'center',
          minWidth: 40
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 150,
          options: ['edit', 'delete']
        }
      ]
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    // 初始化商品菜单列表
    initMenuList() {
      getProductCategoriesTree().then(res => {
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
    getTableData() {
      this.loading = true;
      getProductCategoriesPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        }
      });
    },
    createSonRow() {
      this.addSon = true;
      if (!this.parentCategory.id) {
        this.$Message.warning('请从左侧选择一个父分类');
        return;
      }
      this.resetRowData();
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = _.cloneDeep(currentCategory);
      }
      this.currentCategory.parentId = this.parentCategory.id;
      this.currentCategory.parentCategoryName = this.parentCategory.categoryName;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    createParentRow() {
      this.addSon = false;
      this.resetRowData();
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = _.cloneDeep(currentCategory);
      }
      this.currentCategory.parentId = 0;
      this.currentCategory.parentCategoryName = '父级分类';
      this.parentCategory.categoryName = '父级分类';
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    resetRowData() {
      this.currentCategory = _.cloneDeep(currentCategory);
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      // 防止选择子分类，清除对象后未保留当前父分类查询
      this.searchRowData.parentId = this.currentParentId;
      this.getTableData();
    },
    // 编辑分类
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            // 添加状态
            this.createProductCategories();
          } else if (this.isEdit) {
            // 编辑状态
            this.editProductCategories();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createProductCategories() {
      this.modalEditLoading = true;
      createProductCategories(this.currentCategory)
        .then(res => {})
        .finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    editProductCategories() {
      this.modalEditLoading = true;
      editProductCategories(this.currentCategory)
        .then(res => {})
        .finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
    },
    handleBack() {
      this.parentCategory.id = 0;
      this.parentCategory.categoryName = '父级分类';
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      delProductCategories({
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
        })
        .catch(() => {
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
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.currentCategory.image = '';
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.currentCategory.image = '';
      this.currentCategory.image = fileList[0].url;
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
            <span>{data.title}</span>
          </div>
        );
      }
    },
    handleClick({ root, node, data }) {
      this.loading = true;
      // 递归展开当前节点
      if (typeof data.expand === 'undefined') {
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      }

      if (typeof data.selected === 'undefined') {
        this.$set(data, 'selected', true);
      } else {
        this.$set(data, 'selected', !data.selected);
      }
      this.parentCategory.id = data.id;
      this.parentCategory.categoryName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
      // 获取新数据
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}

.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
