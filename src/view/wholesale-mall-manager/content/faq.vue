<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
        <Card>
          <h6>
            当前选中：
            <span
              class="brand-red font-sm"
            >{{ parentCategory.categoryName?parentCategory.categoryName:'全部分类' }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :columns="columns"
            :loading="loading"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            search-place="top"
            @on-view="handleView"
            @on-delete="handleDelete"
            @on-edit="handleEdit"
            @on-select-all="onSelectionAll"
            @on-selection-change="onSelectionChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchRowData.title"
                  placeholder="标题"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <DatePicker
                  v-model="searchRowData.regBeginTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="创建时间起"
                  class="search-input"
                  style="width: 150px"
                  @on-change="beginTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchRowData.regEndTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="创建时间止"
                  class="search-input mr5"
                  style="width: 150px"
                  @on-change="endTimeChange"
                />
                <Button
                  :loading="loading"
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
                <Icon type="ios-arrow-back" />&nbsp;返回全部分类
              </Button>
              <Button v-waves type="success" class="mr5" @click="createTableRow">
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
      </i-col>
    </Row>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>FAQ详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                主键ID:
              </i-col>
              <i-col span="18">
                {{ faqDetail.id }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                序号:
              </i-col>
              <i-col span="18">
                {{ faqDetail.rankNum }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                标题:
              </i-col>
              <i-col span="18">
                {{ faqDetail.title }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                链接地址:
              </i-col>
              <i-col span="18">
                {{ faqDetail.linkUrl }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">
                创建人:
              </i-col>
              <i-col span="18">
                {{ faqDetail.createPerson }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ faqDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">
                内容:
              </i-col>
              <i-col span="20" v-html="faqDetail.content"></i-col>
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

    <!--编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ tempModalType===modalType.edit?'修改FAQ':'创建FAQ' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :label-width="100" :model="faqDetail" :rules="ruleInline">
          <FormItem label="标题:" prop="title">
            <Input v-model="faqDetail.title" placeholder="标题"></Input>
          </FormItem>
          <FormItem label="内容:" prop="content">
            <Input
              v-model="faqDetail.content"
              :autosize="{minRows: 4,maxRows: 10}"
              placeholder="内容"
              type="textarea"
            ></Input>
          </FormItem>
          <FormItem label="序号:" prop="rankNum">
            <InputNumber
              v-model="faqDetail.rankNum"
              :min="0"
              placeholder="序号"
              style="padding-right: 5px;width: 95px"
            ></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalEditLoading" type="primary" @click="asyncEditOK('modalEdit')">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';

import {
  getFaqPages,
  getFaqCategoriesTree,
  createFaq,
  deleteFaq,
  editFaq
} from '@/api/wholesale';
import { buildMenu, convertTree } from '@/libs/util';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';
import { faqStatusEnum } from '@/libs/enumerate';
import { faqStatusConvert } from '@/libs/converStatus';

const faqDetail = {
  id: 0,
  title: '',
  content: '',
  faqCategoryId: 0,
  rankNum: 0,
  createTime: null,
  createPerson: '',
  regBeginTime: null,
  regEndTime: null,
  faqStatus: '', // unpublished-未发布 published-已发布
  linkUrl: ''
};

const roleRowData = {
  faqCategoryId: null,
  title: '',
  content: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      menuData: [],
      faqCategoryTreeList: [],
      faqStatusEnum,
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: '',
      currentParentId: 0,
      faqDetail: _.cloneDeep(faqDetail),
      parentCategory: this._.cloneDeep(faqDetail),
      searchRowData: this._.cloneDeep(roleRowData),
      ruleInline: {
        title: { required: true, message: '请输入FAQ标题' },
        content: { required: true, message: '请输入FAQ内容' },
        rankNum: [
          { required: true, message: '请输入序号' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        applicationType: { required: true, message: '请选择应用类型' }
      },
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          align: 'center',
          minWidth: 60
        },
        {
          title: '问题类型',
          key: 'faqCategoryId',
          align: 'center',
          minWidth: 70,
          render: (h, params) => {
            const { row } = params;
            const obj = this.faqCategoryTreeList.find(
              item => row.faqCategoryId === item.id
            );
            if (obj) {
              return h('span', obj.faqCategoryName);
            }
            return h('span', row.faqCategoryId);
          }
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          minWidth: 150
        },
        // {
        //   title: '内容',
        //   key: 'content',
        //   sortable: true,
        //   align: 'center',
        //   minWidth: 150,
        //   tooltip: true
        // },
        {
          title: '创建人',
          align: 'center',
          key: 'createPerson',
          sortable: true,
          minWidth: 80
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          sortable: true,
          minWidth: 160
        },
        {
          title: '序号',
          key: 'rankNum',
          sortable: true,
          align: 'center',
          minWidth: 50
        },
        {
          title: '发布状态',
          key: 'faqStatus',
          align: 'center',
          minWidth: 80,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.faqStatus === 'unpublished') {
              return (
                <div>
                  <tag color='success'>{faqStatusConvert(row.faqStatus) }</tag>
                </div>
              );
            } else if (row.faqStatus === 'published') {
              return (
                <div>
                  <tag color='error'>{faqStatusConvert(row.faqStatus) }</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>N/A</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 120,
          options: ['view', 'edit', 'delete']
        }
      ]
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
    createTableRow() {
      if (this.tempModalType !== this.modalType.create) {
        this.faqDetail = this._.cloneDeep(faqDetail);
      }
      this.faqDetail.faqCategoryId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.faqDetail = _.cloneDeep(faqDetail);
    },
    asyncEditOK(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalEditLoading = true;
          this.modalViewLoading = true;
          if (!this.parentCategory.id) {
            this.faqDetail.faqCategoryId = 0;
          } else {
            this.faqDetail.faqCategoryId = this.parentCategory.id;
          }
          if (this.isCreate) {
            createFaq(this.faqDetail)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
                this.resetFields();
              });
          } else if (this.isEdit) {
            editFaq(this.faqDetail)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
                this.resetFields();
              });
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteFaq({
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
    // 编辑分类
    handleEdit(params) {
      // this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.faqDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      this.loading = true;
      getFaqPages(this.searchRowData).then(res => {
        if (this.menuData.length > 0) {
          // 现在对象是 PagerResultObject res.rows获取数据，如果是Pages res.array获取数据
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
        }
      });
    },
    // 初始化商品菜单列表
    initMenuList() {
      getFaqCategoriesTree().then(res => {
        this.faqCategoryTreeList = [];
        if (res && res.length > 0) {
          this.faqCategoryTreeList = res;
          const menuList = buildMenu(res);
          const map = {
            title: 'faqCategoryName',
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
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        // data.expand = !data.expand;
      }
      this.parentCategory.id = data.id;
      this.parentCategory.categoryName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.faqCategoryId = data.id;
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
    findGroupId(id) {
      const obj = this.faqCategoryTreeList.find(item => {
        return item.id === id;
      });
      this.defaultGoodsCategoryData.push(id);
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    },
    findGroupName(id) {
      if (this.faqCategoryTreeList.length > 0) {
        const obj = this.faqCategoryTreeList.find(item => item.id === id);
        if (obj) {
          return obj.faqCategoryName;
        }
      }
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.faqDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleBack() {
      this.parentCategory.id = 0;
      this.parentCategory.categoryName = '全部分类';
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    uniteChange(value) {
      this.faqDetail.applicationType = value;
    },
    beginTimeChange(value, date) {
      this.searchRowData.regBeginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.regEndTime = value;
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
