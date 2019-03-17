<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="6" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="18" order="3">
        <Card>
          <h6>当前选中：{{ parentCategory.groupName }}</h6>
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
                <Input v-model="searchRowData.sectionName" placeholder="板块名称" class="search-input mr5" style="width: auto" clearable></Input>
                <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
                <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
                  <Icon type="md-refresh"/>&nbsp;清除条件
                </Button>
              </Row>
            </div>
            <div slot="operations">
              <Button v-waves type="success" class="mr5" @click="createTableRow">
                <Icon type="md-add"/>
                子分类
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
                :current="page"
                show-sizer
                show-total
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
            </Row>
          </div>
        </Card>
      </i-col>
    </Row>

    <!--编辑菜单 -->
    <Modal
      v-model="modalView"
    >
      <p slot="header">
        <span>编辑商品分类</span>
      </p>
      <div class="modal-content">
        <Form :label-width="100">

        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="asyncEditOK">确定</Button>
      </div>
    </Modal>

    <!--编辑菜单 -->
    <Modal
      v-model="modalEdit"
    >
      <p slot="header">
        <span>编辑商品分类</span>
      </p>
      <div class="modal-content">
        <Form :label-width="120">
          <FormItem label="父级ID:">
            <i-col>{{ parentCategory.id }}</i-col>
          </FormItem>
          <FormItem label="父级名称:">
            <i-col>{{ parentCategory.groupName }}</i-col>
          </FormItem>
          <FormItem label="板块名称:">
            <Input v-model="currentCategory.sectionName"></Input>
          </FormItem>
          <FormItem label="板块位置英文描述:">
            <Input v-model="currentCategory.positionName"></Input>
          </FormItem>
          <FormItem label="板块顺序:">
            <Input v-model="currentCategory.rankNo"></Input>
          </FormItem>
          <FormItem label="商品小图:">
            <FormItem label="商品主图:建议尺寸;400x400(单位:px):" prop=" sectionImg" >
              <Input v-show="false" v-model="currentCategory. sectionImg" style="width: auto"></Input>
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
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="asyncEditOK">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  createProductSection,
  deleteProductSection,
  getProductSectionPages,
  getProductSectionTree,
  editProductSection
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';

const currentCategory = {
  applyType: null,
  id: 0,
  parentId: '',
  sectionProductId: '',
  sectionName: '',
  sectionImg: '',
  rankNo: '',
  positionName: '',
  productStandardList: null
};
const roleRowData = {
  applyType: 'WXSMALL_SHOP',
  sectionName: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CommonIcon,
    IViewUpload
  },
  mixins: [tableMixin, searchMixin, deleteMixin, uploadMixin],
  data() {
    return {
      menuData: [],
      columns: [
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
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '板块名称',
          key: 'sectionName',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '板块图片',
          key: 'sectionImg',
          sortable: true,
          align: 'center',
          minWidth: 150,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.sectionImg} height='60' width='60' />;
            return <div>{str}</div>;
          }
        },
        {
          title: '位置英文描述',
          key: 'positionName',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '排序',
          key: 'rankNo',
          sortable: true,
          align: 'center',
          minWidth: 150
        },
        {
          title: '操作',
          key: 'handle',
          minWidth: 150,
          options: ['edit', 'delete']
        }
      ],
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentParentId: 0,
      currentCategory: this._.cloneDeep(currentCategory),
      parentCategory: this._.cloneDeep(currentCategory),
      searchRowData: this._.cloneDeep(roleRowData),
      treeData: this._.cloneDeep(currentCategory),
      uploadListMain: [],
      defaultListMain: []
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
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
              <CommonIcon type='ios-folder' class='mr10'/>
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
              <CommonIcon type='ios-paper' class='mr10'/>
            </span>
            <span >
              {data.title}
            </span>
          </div>
        );
      }
    },
    createTableRow() {
      if (this.tempModalType !== this.modalType.create) {
        this.currentCategory = this._.cloneDeep(currentCategory);
      }
      this.currentCategory.currentParentId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    asyncEditOK() {
      // if (!this.currentCategory.groupName) {
      //   this.$Message.warning('请输入子分类');
      //   return;
      // }
      this.currentCategory.applyType = 'WXSMALL_SHOP';
      this.modalEditLoading = true;
      this.modalViewLoading = true;
      if (!this.parentCategory.id) {
        this.currentCategory.parentId = 0;
      } else {
        this.currentCategory.parentId = this.parentCategory.id;
      }
      if (this.tempModalType === this.modalType.create) {
        createProductSection(this.currentCategory
        ).then(res => {

        }).finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
      } else if (this.tempModalType === this.modalType.edit) {
        editProductSection(this.currentCategory).then(res => {
        }).finally(res => {
          this.initMenuList();
          this.modalEditLoading = false;
          this.modalEdit = false;
        });
      }
    },
    handleEditClose() {
      this.modalEdit = false;
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteProductSection({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.pageSize);
        if (this.tableData.length === this.tableDataSelected.length && this.page === totalPage && this.page !== 1) {
          this.page -= 1;
        }
        this.tableDataSelected = [];
        this.initMenuList();
      }
      ).catch(() => {
        this.loading = false;
      });
    },
    // 编辑分类
    handleEdit(params) {
      // this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.currentCategory = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      this.loading = true;
      getProductSectionPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getProductSectionTree(this.treeData).then(res => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
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
      // 获取新数据
      this.getTableData();
    },
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === 'undefined') {
          // this.$set(item, 'expend', true);
          this.$set(item, 'expend', false);
        // } else {
        } else {
          item.expand = !item.expand;
        }
        if (item.children) {
          this.expandChildren(item.children);
        }
      });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.mainImg != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.mainImg;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.subImg != null) {
        const subImgArr = [];
        res.subImg.forEach(value => {
          const innerMapSub = { status: 'finished', url: 'url' };
          innerMapSub.url = value;
          subImgArr.push(innerMapSub);
        });
        this.$refs.uploadSecond.setDefaultFileList(subImgArr);
        this.uploadListSecond = subImgArr;
      }
      if (res.detailImg != null) {
        const detailImgArr = [];
        res.detailImg.forEach(value => {
          const innerMapDetailImg = { status: 'finished', url: 'url' };
          innerMapDetailImg.url = value;
          detailImgArr.push(innerMapDetailImg);
        });
        this.$refs.uploadMultiple.setDefaultFileList(detailImgArr);
        this.uploadListMultiple = detailImgArr;
      }
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.currentCategory.sectionImg = null;
      this.currentCategory.sectionImg = fileList[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
  .img {
    width: 150px;
    height: auto !important
  }

  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
