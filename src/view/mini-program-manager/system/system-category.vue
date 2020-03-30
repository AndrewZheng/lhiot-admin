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
        <span>系统参数分类详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">主键ID:</i-col>
              <i-col span="20">{{ systemCategoryDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">分类code:</i-col>
              <i-col span="20">{{ systemCategoryDetail.categoriesCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">分类名称:</i-col>
              <i-col span="20">{{ systemCategoryDetail.categoriesName }}</i-col>
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
        <i-col>{{ tempModalType===modalType.edit?'修改系统参数分类':'创建系统参数分类' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="systemCategoryDetail" :rules="ruleInline" :label-width="80">
          <!-- <InputNumber :min="0" v-model="systemCategoryDetail.parentId" placeholder="父级分类id"></InputNumber> -->
          <!-- <Row>
            <Col span="12">
              <FormItem label="父级分类ID:" prop="parentId">
                <Cascader
                  placeholder="全部分类"
                  :data="systemCategoryData"
                  v-model="defaultSystemCategoryData"
                  span="21"
                  @on-change="systemCategoryChange"
                ></Cascader>
              </FormItem>
            </Col>
          </Row>-->
          <Row>
            <Col span="12">
              <FormItem label="分类名称:" prop="categoriesName">
                <Input v-model="systemCategoryDetail.categoriesName" placeholder="分类名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="分类code:" prop="categoriesCode">
                <Input v-model="systemCategoryDetail.categoriesCode" placeholder="分类code"></Input>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import _ from "lodash";
import {
  deleteSystemSettingCategory,
  getSystemSettingCategoryPages,
  editSystemSettingCategory,
  createSystemSettingCategory,
  getSystemSettingCategoryTree
} from "@/api/mini-program";
import uploadMixin from "@/mixins/uploadMixin";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import { buildMenu, convertTreeCategory, convertTree } from "@/libs/util";

const systemCategoryDetail = {
  id: 0,
  parentId: 0,
  categoriesName: ""
};

const roleRowData = {
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        // parentId: [
        //   { required: true, message: '输入父级分类id' }
        // ],
        categoriesName: [{ required: true, message: "请输入分类名称" }],
        categoriesCode: [{ required: false, message: "请输入分类名code" }]
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "ID",
          align: "center",
          key: "id"
        },
        {
          title: "分类code",
          align: "center",
          key: "categoriesCode"
        },
        {
          title: "分类名称",
          align: "center",
          key: "categoriesName"
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          options: ["view", "edit", "delete"]
        }
      ],
      systemCategoryData: [],
      defaultSystemCategoryData: [41],
      systemCategoriesTreeList: [],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      systemCategoryDetail: _.cloneDeep(systemCategoryDetail)
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
          this.$Message.error("请完善信息!");
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createSystemSettingCategory(this.systemCategoryDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success("创建成功!");
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editStore() {
      this.modalViewLoading = true;
      editSystemSettingCategory(this.systemCategoryDetail)
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
        this.systemCategoryDetail = _.cloneDeep(systemCategoryDetail);
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
      deleteSystemSettingCategory({
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
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.systemCategoryDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.systemCategoryDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getSystemSettingCategoryPages(this.searchRowData)
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
    getSystemSettingCategoryTree() {
      getSystemSettingCategoryTree()
        .then(res => {
          if (res && res.array.length > 0) {
            this.systemCategoriesTreeList = res.array;
            const menuList = buildMenu(res.array);
            const map = {
              id: "id",
              title: "title",
              children: "children"
            };
            this.systemCategoryData = convertTreeCategory(menuList, map, true);
            console.log("cate after convert", this.systemCategoryData);
            this.createLoading = false;
          }
        })
        .catch(() => {
          this.createLoading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.description != null) {
        const map = { status: "finished", url: "url" };
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
        this.systemCategoryDetail.parentId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.systemCategoryDetail.parentId = null;
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
