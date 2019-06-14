<template>
  <div class="m-role">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuData" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
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
                  style="padding-right: 5px;width: 100px"
                  clearable
                >
                  <Option
                    v-for="(item,index) in appTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
                <Button
                  :loading="loading"
                  class="search-btn mr5"
                  type="primary"
                  @click="handleSearch"
                >
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
                <Button
                  v-waves
                  :loading="clearSearchLoading"
                  class="search-btn"
                  type="info"
                  @click="handleClear"
                >
                  <Icon type="md-refresh"/>&nbsp;清除条件
                </Button>
              </Row>
            </div>
            <div slot="operations">
              <Button v-waves type="success" class="mr5" @click="createTableRow">
                <Icon type="md-add"/>添加
              </Button>
              <Poptip
                confirm
                placement="bottom"
                style="width: 100px"
                title="您确认删除选中的内容吗?"
                @on-ok="poptipOk"
              >
                <Button type="error" class="mr5">
                  <Icon type="md-trash"/>删除
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
          <i-col span="24">
            <Row>
              <i-col span="6">主键ID:</i-col>
              <i-col span="18">{{ faq.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">标题:</i-col>
              <i-col span="18">{{ faq.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">内容:</i-col>
              <i-col span="18">{{ faq.content }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">序号:</i-col>
              <i-col span="18">{{ faq.rankNo }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">应用类型:</i-col>
              <i-col span="18">{{ faq.applicationType | appTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ faq.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">创建人:</i-col>
              <i-col span="18">{{ faq.createUser }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!--编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ tempModalType===modalType.edit?'修改FAQ':'创建FAQ' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :label-width="100" :model="faq" :rules="ruleInline">
          <FormItem label="标题:" prop="title">
            <Input v-model="faq.title" placeholder="标题"></Input>
          </FormItem>
          <FormItem label="内容:" prop="content">
            <Input
              v-model="faq.content"
              :autosize="{minRows: 4,maxRows: 10}"
              placeholder="内容"
              type="textarea"
            ></Input>
          </FormItem>
          <FormItem label="序号:" prop="rankNo">
            <InputNumber :min="0" v-model="faq.rankNo" placeholder="序号"></InputNumber>
          </FormItem>
          <FormItem label="应用类型:" prop="applicationType">
            <Select
              v-model="faq.applicationType"
              placeholder="应用类型"
              style="padding-right: 5px;width: 100px"
              clearable
              @on-change="uniteChange"
            >
              <Option
                v-for="(item,index) in appTypeEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="asyncEditOK('modalEdit')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  createFaq,
  deleteFaq,
  getFaqPages,
  getFaqCategoriesTree,
  editFaq
} from "@/api/mini-program";
import { buildMenu, convertTree } from "@/libs/util";
import CommonIcon from "_c/common-icon";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import { appTypeEnum } from "@/libs/enumerate";
import { appTypeConvert } from "@/libs/converStatus";

const faq = {
  id: 0,
  title: "",
  content: "",
  faqCategoryId: 0,
  rankNo: 0,
  createTime: null,
  createUser: "",
  applicationType: null,
  createTimeBegin: null,
  createTimeEnd: null
};

const roleRowData = {
  title: "",
  content: "",
  applicationType: null,
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
      ruleInline: {
        title: { required: true, message: "请输入FAQ标题" },
        content: { required: true, message: "请输入FAQ内容" },
        rankNo: [
          { required: true, message: "请输入序号" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error("必须为整数"));
              }
              callback(errors);
            }
          }
        ],
        applicationType: { required: true, message: "请选择应用类型" }
      },
      menuData: [],
      appTypeEnum,
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "ID",
          key: "id",
          sortable: true,
          align: "center",
          minWidth: 80
        },
        {
          title: "标题",
          key: "title",
          sortable: true,
          align: "center",
          minWidth: 150
        },
        {
          title: "内容",
          key: "content",
          sortable: true,
          align: "center",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "faq分类id",
          key: "faqCategoryId",
          align: "center",
          minWidth: 70
        },
        {
          title: "序号",
          key: "rankNo",
          sortable: true,
          align: "center",
          minWidth: 50
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          minWidth: 160
        },
        {
          title: "创建人",
          key: "createUser",
          sortable: true,
          minWidth: 80
        },
        {
          title: "应用类型",
          key: "applicationType",
          sortable: true,
          align: "center",
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.applicationType === "WXSMALL_SHOP") {
              return (
                <div>
                  <tag color="green">
                    {appTypeConvert(row.applicationType).label}
                  </tag>
                </div>
              );
            } else if (row.applicationType === "S_MALL") {
              return (
                <div>
                  <tag color="gold">
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
          title: "操作",
          key: "handle",
          minWidth: 120,
          options: ["view", "edit", "delete"]
        }
      ],
      modalEdit: false,
      modalViewLoading: false,
      modalEditLoading: false,
      currentParentName: "",
      currentParentId: 0,
      faq: this._.cloneDeep(faq),
      parentCategory: this._.cloneDeep(faq),
      searchRowData: this._.cloneDeep(roleRowData)
    };
  },
  created() {
    this.initMenuList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.type == "PARENT") {
        return (
          <div
            style={{
              display: "inline-block",
              width: "100%",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            <span>
              <CommonIcon type="ios-folder" class="mr10" />
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
              display: "inline-block",
              width: "100%",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            <span>
              <CommonIcon type="ios-paper" class="mr10" />
            </span>
            <span>{data.title}</span>
          </div>
        );
      }
    },
    createTableRow() {
      if (this.tempModalType !== this.modalType.create) {
        this.faq = this._.cloneDeep(faq);
      }
      this.faq.faqCategoryId = this.currentParentId;
      this.tempModalType = this.modalType.create;
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.faq = _.cloneDeep(faq);
    },
    asyncEditOK(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalEditLoading = true;
          this.modalViewLoading = true;
          if (!this.parentCategory.id) {
            this.faq.faqCategoryId = 0;
          } else {
            this.faq.faqCategoryId = this.parentCategory.id;
          }
          if (this.tempModalType === this.modalType.create) {
            createFaq(this.faq)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
                this.resetFields();
              });
          } else if (this.tempModalType === this.modalType.edit) {
            editFaq(this.faq)
              .then(res => {})
              .finally(res => {
                this.initMenuList();
                this.modalEditLoading = false;
                this.modalEdit = false;
                this.resetFields();
              });
          }
        } else {
          this.$Message.error("请完善信息!");
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
      this.faq = _.cloneDeep(params.row);
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
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: "title",
            children: "children"
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
      if (typeof data.expand === "undefined") {
        // this.$set(data, 'expend', true);
        this.$set(data, "expend", false);
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
      // 获取新数据
      this.getTableData();
    },
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === "undefined") {
          // this.$set(item, 'expend', true);
          this.$set(item, "expend", false);
          // } else {
        } else {
          item.expand = !item.expand;
        }
        if (item.children) {
          this.expandChildren(item.children);
        }
      });
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.faq = _.cloneDeep(params.row);
      this.modalView = true;
    },
    uniteChange(value) {
      this.faq.applicationType = value;
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
