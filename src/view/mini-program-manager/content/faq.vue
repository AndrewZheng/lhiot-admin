<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="3" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="21" order="3">
        <Card>
          <h6>当前选中：{{ parentCategory.categoryName }}</h6>
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
                <Input
                  v-model="searchRowData.content"
                  placeholder="内容"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Select
                  v-model="searchRowData.applicationType"
                  placeholder="应用类型"
                  style="padding-right: 5px; width: 110px"
                  clearable
                >
                  <Option
                    v-for="(item, index) in appTypeEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
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
                type="success"
                class="mr5"
                @click="handleCreate"
              >
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

    <!--查看菜单 -->
    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>FAQ详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                主键ID:
              </i-col>
              <i-col span="18">
                {{ faq.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                标题:
              </i-col>
              <i-col span="18">
                {{ faq.title }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                内容:
              </i-col>
              <i-col span="18">
                {{ faq.content }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                序号:
              </i-col>
              <i-col span="18">
                {{ faq.rankNo }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                应用类型:
              </i-col>
              <i-col span="18">
                {{ faq.applicationType | appTypeFilter }}
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
                {{ faq.createTime }}
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
                {{ faq.createUser }}
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

    <!--编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{
          isEdit ? "修改FAQ" : "创建FAQ"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :label-width="100"
          :model="faq"
          :rules="ruleInline"
        >
          <FormItem label="标题:" prop="title">
            <Input v-model="faq.title" placeholder="标题"></Input>
          </FormItem>
          <FormItem label="内容:" prop="content">
            <Input
              v-model="faq.content"
              :autosize="{ minRows: 4, maxRows: 10 }"
              placeholder="内容"
              type="textarea"
            ></Input>
          </FormItem>
          <FormItem label="序号:" prop="rankNo">
            <InputNumber
              v-model="faq.rankNo"
              :min="0"
              placeholder="序号"
              style="padding-right: 5px; width: 115px"
            ></InputNumber>
          </FormItem>
          <FormItem label="应用类型:" prop="applicationType">
            <Select
              v-model="faq.applicationType"
              placeholder="应用类型"
              style="padding-right: 5px; width: 120px"
              clearable
              @on-change="uniteChange"
            >
              <Option
                v-for="(item, index) in appTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Form>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  createFaq,
  deleteFaq,
  getFaqPages,
  getFaqCategoriesTree,
  editFaq
} from '@/api/mini-program';
import { buildMenu, convertTree } from '@/libs/util';
import CommonIcon from '_c/common-icon';
import tableMixin from '@/mixins/tableMixin.js';
import { appTypeEnum } from '@/libs/enumerate';
import { appTypeConvert } from '@/libs/converStatus';

const faq = {
  id: 0,
  title: '',
  content: '',
  faqCategoryId: 0,
  rankNo: 0,
  createTime: null,
  createUser: '',
  applicationType: null,
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  title: '',
  content: '',
  applicationType: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    CommonIcon
  },
  mixins: [tableMixin],
  data() {
    return {
      menuData: [],
      currentParentId: 0,
      currentParentName: '',
      appTypeEnum,
      ruleInline: {
        title: { required: true, message: '请输入FAQ标题' },
        content: { required: true, message: '请输入FAQ内容' },
        rankNo: [
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
          title: 'ID',
          key: 'id',
          align: 'center',
          minWidth: 70
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          minWidth: 120
        },
        {
          title: '内容',
          key: 'content',
          align: 'center',
          minWidth: 150,
          tooltip: true
        },
        {
          title: 'FAQ分类ID',
          key: 'faqCategoryId',
          align: 'center',
          minWidth: 90
        },
        {
          title: '序号',
          key: 'rankNo',
          align: 'center',
          minWidth: 50
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          minWidth: 160
        },
        {
          title: '应用类型',
          key: 'applicationType',
          align: 'center',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.applicationType === 'WXSMALL_SHOP') {
              return (
                <div>
                  <tag color='green'>
                    {appTypeConvert(row.applicationType).label}
                  </tag>
                </div>
              );
            } else if (row.applicationType === 'S_MALL') {
              return (
                <div>
                  <tag color='gold'>
                    {appTypeConvert(row.applicationType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.applicationType}</div>;
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 120,
          options: ['view', 'edit', 'delete']
        }
      ],
      faq: _.cloneDeep(faq),
      parentCategory: _.cloneDeep(faq),
      searchRowData: _.cloneDeep(roleRowData)
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    resetFields() {
      this.$refs.editForm.resetFields();
      this.faq = _.cloneDeep(faq);
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    uniteChange(value) {
      this.faq.applicationType = value;
    },
    getTableData() {
      this.loading = true;
      getFaqPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
          this.clearSearchLoading = false;
        });
    },
    handleCreate() {
      if (!this.parentCategory.categoryName) {
        this.$Message.info('请先选中需要添加的类目!');
        return;
      }
      this.faq = _.cloneDeep(faq);
      this.faq.faqCategoryId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.faq = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.faq = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.faq.faqCategoryId = !this.parentCategory.id ? 0 : this.parentCategory.id;
            this.createRowData();
          } else if (this.isEdit) {
            this.editRowData();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRowData() {
      this.modalEditLoading = true;
      createFaq(this.faq)
        .then((res) => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    editRowData() {
      this.modalEditLoading = true;
      editFaq(this.faq)
        .then((res) => {
          this.modalEdit = false;
          this.initMenuList();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      deleteFaq({
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
        })
    },
    initMenuList() {
      getFaqCategoriesTree().then((res) => {
        const menuList = buildMenu(res.array);
        const map = {
          title: 'title',
          children: 'children'
        };
        this.menuData = convertTree(menuList, map, true);
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
            <span>{data.title}</span>
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
      this.parentCategory.categoryName = data.title;
      this.currentParentId = data.id;
      this.searchRowData.parentId = data.id;
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
