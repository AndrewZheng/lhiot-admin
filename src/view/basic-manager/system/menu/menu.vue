<template>
  <div class="m-menu">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuList" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
        <Card>
          <h6>
            当前选中：
            <span
              class="brand-red font-sm"
            >{{ parentRowData.name? parentRowData.name: '全部菜单' }}</span>
          </h6>
          <tables
            ref="tables"
            v-model="tableData"
            :loading="loading"
            :columns="columns"
            :export-type="exportType"
            :search-area-column="14"
            :operate-area-column="10"
            editable
            searchable
            border
            search-place="top"
            size="small"
            @on-delete="handleDelete"
            @on-view="handleView"
            @on-edit="handleEdit"
            @on-edit-permission="handleEditPermission"
          >
            <div slot="searchCondition">
              <Input
                v-model="searchRowData.name"
                placeholder="菜单名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Select
                v-model="searchRowData.type"
                class="search-col mr5"
                placeholder="菜单类型"
                style="width: auto"
                clearable
              >
                <Option value="PARENT">
                  父级菜单
                </Option>
                <Option value="SON">
                  子级菜单
                </Option>
              </Select>
              <Button v-waves class="search-btn mr5 ml5" type="primary" @click="handleSearch">
                <Icon type="md-search" />搜索
              </Button>
              <Button v-waves class="search-btn mr5" type="info" @click="handleClear">
                <Icon type="md-refresh" />清除条件
              </Button>
              <!-- <Button v-waves class="search-btn mr5" type="warning" @click="handleExpandAll">
                <Icon type="md-search" /> {{ expandAll }}
              </Button> -->
            </div>
            <div slot="operations">
              <Button
                v-waves
                :loading="clearSearchLoading"
                type="warning"
                class="mr5"
                @click="handleBack"
              >
                <Icon type="ios-arrow-back" />&nbsp;返回全部
              </Button>
              <Button v-waves type="success" class="mr5" @click="handleAddSon">
                <Icon type="md-add" />子菜单
              </Button>
              <Button v-waves type="success" class="mr5" @click="handleAddParent">
                <Icon type="md-add" />父菜单
              </Button>
              <!-- <Button v-waves type="success" class="mr5" @click="handleUploadExcel">
                <Icon type="md-cloud-upload" /> 导入Excel
              </Button>-->
              <Button
                :loading="downloadLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleDownload"
              >
                <Icon type="md-download" />多类型导出
              </Button>
              <BookTypeOption v-model="exportType" class="mr5" />
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

    <!--查看菜单 -->
    <Modal v-model="modalView" :mask-closable="false" :width="rowData.type=='SON'?'750':'540'">
      <p slot="header">
        <span>查看菜单</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                类型
              </i-col>
              <i-col span="20">
                {{ rowData.type | switchType }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                名称
              </i-col>
              <i-col span="20">
                {{ rowData.name }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                编码
              </i-col>
              <i-col span="20">
                {{ rowData.code }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                排序
              </i-col>
              <i-col span="20">
                {{ rowData.sort }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-if="rowData.type=='SON'" :gutter="8" type="flex" align="middle" class-name="mb10">
          <tables
            ref="operate_tables"
            v-model="operateData"
            :loading="loading"
            :columns="opColumns"
            search-place="top"
            size="small"
          />
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>

    <!--创建/编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="750">
      <p slot="header">
        <span>{{ rowData.id==''?'创建菜单':'编辑菜单' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :label-width="100" :model="rowData" :rules="ruleInline">
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="12">
              <FormItem label="类型:" prop="type">
                <Input v-model="menuType" placeholder readonly></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="名称:" prop="name">
                <Input v-model="rowData.name" placeholder clearable></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="8" type="flex" align="middle" class-name="mb10">
            <i-col span="12">
              <FormItem label="编码:" prop="code">
                <Input v-model="rowData.code" placeholder clearable></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="排序:" prop="sort">
                <Input v-model="rowData.sort" placeholder clearable></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button :loading="loadingBtn" type="primary" @click="handleSubmit">
          <span v-if="!loadingBtn">确认</span>
          <span v-else>确认中...</span>
        </Button>
      </div>
    </Modal>

    <!--创建/编辑操作权限 -->
    <Modal
      v-model="modalPermission"
      :mask-closable="false"
      width="800"
      @on-cancel="handleCloseEdit"
    >
      <p slot="header">
        <span>编辑操作权限</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                名称
              </i-col>
              <i-col span="12">
                <Input v-model="operateRowData.name" placeholder clearable></Input>
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                类型
              </i-col>
              <i-col span="20">
                <CheckboxGroup v-model="requestTypeList">
                  <Checkbox v-for="item in optionList" :key="item" :label="item">
                    {{ item }}
                  </Checkbox>
                </CheckboxGroup>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">
                路径
              </i-col>
              <i-col span="16">
                <Input v-model="operateRowData.antUrl" placeholder clearable></Input>
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle">
                  <i-col span="4">
                    标识
                  </i-col>
                  <i-col span="16">
                    <Input v-model="operateRowData.code" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Button :loading="loadingAdd" type="success" @click="handleAdd">
                  <span v-if="!loadingAdd">添加</span>
                  <span v-else>保存中...</span>
                </Button>
              </i-col>
            </Row>
          </i-col>
        </Row>

        <tables
          ref="operate_tables"
          v-model="operateData"
          :loading="loading"
          :columns="oColumns"
          search-place="top"
          size="small"
          @on-delete="handleDeleteOperate"
        />
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleCloseEdit">
          关闭
        </Button>
      </div>
    </Modal>

    <!--创建子菜单并添加操作权限 -->
    <Modal
      v-model="modalAdd"
      :loading="loadingBtn"
      :mask-closable="false"
      width="750"
      @on-cancel="handleCloseAdd"
    >
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <TabPane label="创建菜单" name="addMenu">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    类型
                  </i-col>
                  <i-col span="12">
                    <Input v-model="menuType" placeholder readonly></Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    名称
                  </i-col>
                  <i-col span="12">
                    <Input v-model="rowData.name" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
            </Row>
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    编码
                  </i-col>
                  <i-col span="12">
                    <Input v-model="rowData.code" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    排序
                  </i-col>
                  <i-col span="12">
                    <Input v-model="rowData.sort" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
            </Row>
          </TabPane>
          <TabPane :disabled="isDisable" label="添加操作权限" name="addPermission">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    名称
                  </i-col>
                  <i-col span="12">
                    <Input v-model="operateRowData.name" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    类型
                  </i-col>
                  <i-col span="20">
                    <CheckboxGroup v-model="requestTypeList">
                      <Checkbox v-for="item in optionList" :key="item" :label="item">
                        {{ item }}
                      </Checkbox>
                    </CheckboxGroup>
                  </i-col>
                </Row>
              </i-col>
            </Row>
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">
                    路径
                  </i-col>
                  <i-col span="16">
                    <Input v-model="operateRowData.antUrl" placeholder clearable></Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="24">
                    <Button :loading="loadingAdd" type="success" @click="handleAdd">
                      <span v-if="!loadingAdd">添加</span>
                      <span v-else>保存中...</span>
                    </Button>
                  </i-col>
                </Row>
              </i-col>
            </Row>

            <tables
              ref="operate_tables"
              v-model="operateData"
              :loading="loading"
              :columns="oColumns"
              search-place="top"
              size="small"
              @on-delete="handleDeleteOperate"
            />
          </TabPane>
        </Tabs>
      </div>
      <div v-if="step=='addMenu' && !isCreated" slot="footer">
        <Button type="primary" @click="goNext">
          下一步
        </Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="handleCloseAdd">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 导入excel -->
    <Modal
      v-model="modalUploadExcel"
      :mask-closable="false"
      :width="750"
      @on-ok="handleUploadExcelOk"
    >
      <UploadExcel ref="uploadExcel"></UploadExcel>
    </Modal>
  </div>
</template>

<script type='text/ecmascript-6'>
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import BookTypeOption from '_c/book-type-option';
import UploadExcel from '_c/excel';
import tableMixin from '@/mixins/tableMixin.js';
import { getMenuData, getOperateData } from '@/api/data';
import { getMenuList, deleteMenu, deleteOperate, createMenu, editMenu } from '@/api/system';
import {
  buildMenu,
  getNewTagList,
  convertTree,
  changeObjKeyName
} from '@/libs/util';
import { mapMutations } from 'vuex';

const menuColumns = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    fixed: 'left',
    maxWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return h('span', row.id + '');
    }
  },
  { title: '父菜单编号', width: 80, key: 'parentid', sortable: false,
    render: (h, params, vm) => {
      const { row } = params;
      return h('span', row.parentid + '');
    }
  },
  { title: '名称', width: 150, key: 'name', sortable: true },
  { title: '编码', width: 300, key: 'code', sortable: false },
  {
    title: '类型',
    key: 'type',
    sortable: true,
    width: 100,
    render: (h, params, vm) => {
      const { row } = params;
      const str = row.type == 'PARENT' ? '父级菜单' : '子级菜单';
      return <span>{str}</span>;
    }
  },
  { title: '排序', key: 'sort', editable: false, maxWidth: 75 },
  {
    title: '操作',
    key: 'handle',
    minWidth: 200,
    options: ['view', 'edit', 'permission', 'delete'],
    button: [
      (h, params, vm) => {
        return h('Poptip', {
          props: {
            confirm: true,
            title: '你确定要删除吗?'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-delete', params);
            }
          }
        });
      }
    ]
  }
];

const operateColumns = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    maxWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return h('span', row.id + '');
    }
  },
  { title: '名称', key: 'name', sortable: true },
  { title: '标识', key: 'code', sortable: false, minWidth: 120 },
  { title: '类型', key: 'type', sortable: false },
  { title: '路径', key: 'antUrl', sortable: false },
  {
    title: '操作',
    key: 'handle',
    maxWidth: 100,
    options: ['delete'],
    button: [
      (h, params, vm) => {
        return h('Poptip', {
          props: {
            confirm: true,
            title: '你确定要删除吗?'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-delete', params);
              vm.$emit(
                'input',
                params.tableData.filter(
                  (item, index) => index !== params.row.initRowIndex
                )
              );
            }
          }
        });
      }
    ]
  }
];

const operateColumns2 = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    maxWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return h('span', row.id + '');
    }
  },
  { title: '名称', key: 'name', sortable: true },
  { title: '类型', key: 'type', sortable: false },
  { title: '路径', key: 'antUrl', sortable: false }
];

const menuRowData = {
  id: '',
  parentid: null,
  sort: '',
  code: '',
  name: '',
  type: ''
};

const operateRowData = {
  id: 0,
  type: '',
  menuId: 0,
  name: '',
  code: '',
  antUrl: ''
};

const searchRowData = {
  parentid: null,
  name: '',
  type: null,
  page: 1,
  rows: 20
};

export default {
  name: 'MenuPages',
  components: {
    Tables,
    CommonIcon,
    BookTypeOption,
    UploadExcel
  },
  filters: {
    switchType(value) {
      if (!value) return;
      const str = value === 'PARENT' ? '父级菜单' : '子级菜单';
      return str;
    }
  },
  mixins: [tableMixin],
  data() {
    return {
      menuList: [],
      templatePageOpts: [20, 30, 40, 50],
      requestTypeList: ['GET'],
      optionList: ['GET', 'POST', 'PUT', 'DELETE'],
      step: 'addMenu',
      exportType: 'xlsx',
      filename: '',
      columns: menuColumns,
      oColumns: operateColumns,
      opColumns: operateColumns2,
      operateData: [],
      currentPid: null,
      currentMenuId: 0,
      operatePage: 1,
      operatePageSize: 10,
      operateTotal: 0,
      isAllExpand: true,
      modalUploadExcel: false,
      modalPermission: false,
      loadingBtn: false,
      loadingAdd: false,
      isDisable: true,
      isCreated: false,
      downloadLoading: false,
      autoWidth: true,
      rowData: _.cloneDeep(menuRowData),
      parentRowData: _.cloneDeep(menuRowData),
      operateRowData: _.cloneDeep(operateRowData),
      searchRowData: _.cloneDeep(searchRowData),
      ruleInline: {
        name: { required: true, message: '请填写菜单的名称' },
        code: { required: true, message: '请填写菜单的编码' }
      }
    };
  },
  computed: {
    expandAll() {
      return this.isAllExpand ? '全部收起' : '全部展开';
    },
    menuType() {
      return this.rowData.type === 'PARENT' ? '父级菜单' : '子级菜单';
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  mounted() {
    this.initMenuList();
  },
  methods: {
    ...mapMutations(['setTagNavList', 'addTag']),
    getTableData() {
      this.loading = true;
      getMenuData(this.searchRowData)
        .then(res => {
          this.tableData = res.array;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.clearSearchLoading = false;
        });
    },
    getOperateData() {
      getOperateData({
        page: this.operatePage,
        rows: this.operatePageSize,
        menuId: this.currentMenuId
      }).then(res => {
        this.operateData = res.array;
        this.operateTotal = res.total;
        this.loading = false;
      });
    },
    handleAddSon() {
      if (!this.currentPid) {
        this.$Message.warning('请先从左侧选择一个父级菜单');
        return false;
      }
      this.resetRowData();
      this.resetOperateRowData();
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.create;
      this.rowData.type = 'SON';
      this.modalAdd = true;
    },
    handleAddParent() {
      if (!this.currentPid) {
        this.$Message.warning('请先从左侧选择一个父级菜单');
        return false;
      }
      this.resetRowData();
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.create;
      this.rowData.type = 'PARENT';
      this.modalEdit = true;
    },
    handleBack() {
      this.searchRowData = _.cloneDeep(searchRowData);
      this.currentPid = null;
      this.parentRowData.id = null;
      this.parentRowData.name = '';
      this.getTableData();
    },
    handleView(params) {
      const { row } = params;
      this.rowData = row;
      this.modalView = true;
      if (row.type == 'SON') {
        this.currentMenuId = row.id;
        this.getOperateData();
      }
    },
    handleEdit(params) {
      const { row } = params;
      if (!row.parentid) {
        this.$Message.warning('系统顶级菜单不可编辑');
        return false;
      }
      this.tempModalType = this.modalType.edit;
      this.rowData = _.cloneDeep(row);
      this.modalEdit = true;
    },
    handleEditPermission(params) {
      const { row } = params;
      this.modalPermission = true;
      this.currentMenuId = row.id;
      this.getOperateData();
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.rowData.parentid = this.currentPid;
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error('请完善商品单位信息!');
        }
      });
    },
    createTableRow() {
      this.loadingBtn = true;
      createMenu(this.rowData)
        .then(res => {
          this.modalEdit = false;
          this.$Message.info('创建成功');
          this.refreshMenuList();
          this.resetRowData();
          this.getTableData();
        })
        .finally(() => {
          this.loadingBtn = false;
        });
    },
    editTableRow() {
      this.loadingBtn = true;
      editMenu(this.rowData).then(res => {
        this.modalEdit = false;
        this.$Message.info('更新成功');
        this.refreshMenuList();
        this.resetRowData();
        this.getTableData();
      }).finally(() => {
        this.loadingBtn = false;
      });
    },
    handleDelete(params) {
      if (!params.row.parentid) {
        this.$Message.warning('系统顶级菜单不可删除');
        return false;
      }
      deleteMenu(params.row.id)
        .then(res => {
          if (!res) {
            this.$Message.error('已关联角色 删除失败');
          } else {
            this.$Message.info('删除成功');
            this.refreshMenuList();
            this.getTableData();
          }
        });
    },
    handleDeleteOperate(params) {
      deleteOperate(params.row.id)
        .then(res => {
          this.$Message.info('删除成功');
          this.getOperateData();
        });
    },
    handleAdd() {
      // 校验字段
      if (!this.operateRowData.name) {
        this.$Message.warning('请填写操作的名称');
        return false;
      }

      // if (!this.operateRowData.antUrl) {
      //   this.$Message.warning('请填写操作的匹配路径');
      //   return false;
      // }

      if (this.requestTypeList.length === 0) {
        this.$Message.warning('请至少选择一种请求类型');
        return false;
      }

      this.operateRowData.type = this.requestTypeList.join(',');
      this.operateRowData.menuId = this.currentMenuId;
      this.loadingAdd = true;
      this.$http
        .request({
          url: '/ims-operation/',
          method: 'post',
          data: this.operateRowData
        })
        .then(res => {
          this.loadingAdd = false;
          this.$Message.info('保存成功');
          this.requestTypeList = ['GET'];
          this.resetOperateRowData();
          this.getOperateData();
        });
    },
    handleClose() {
      this.modalView = false;
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable = true;
      this.step = 'addMenu';
    },
    handleCloseEdit() {
      this.modalPermission = false;
      // 初始化
      this.currentMenuId = 0;
      this.requestTypeList = ['GET'];
    },
    handleSearch() {
      this.searchRowData.parentid = this.currentPid;
      this.searchRowData.page = 1;
      this.getTableData();
    },
    resetRowData() {
      this.rowData = _.cloneDeep(menuRowData);
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(searchRowData);
    },
    resetOperateRowData() {
      this.operateRowData = _.cloneDeep(operateRowData);
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    goNext() {
      // 校验字段
      if (!this.rowData.name) {
        this.$Message.warning('请填写菜单的名称');
        return false;
      }

      if (!this.rowData.code) {
        this.$Message.warning('请填写菜单的编码');
        return false;
      }
      // 组织rowData数据
      this.rowData.parentid = this.currentPid;
      // 下一步之前先创建子菜单
      this.$http
        .request({
          url: '/ims-menu/',
          method: 'post',
          data: this.rowData
        })
        .then(res => {
          this.$Message.info('创建成功');
          this.step = 'addPermission';
          this.isDisable = false;
          this.isCreated = true;
          this.currentMenuId = res.id;
          // 刷新左边菜单
          this.refreshMenuList();
          // 刷新表格数据
          this.getTableData();
          this.getOperateData();
        });
    },
    handleDownload() {
      // 表格数据导出字段翻译
      this.tableData.forEach(item => {
        item['type'] === 'PARENT'
          ? (item['type'] = '父级菜单')
          : (item['type'] = '子级菜单');
      });
      this.$refs.tables.handleDownload({
        filename: `菜单-${new Date().valueOf()}`,
        data: this.tableData
      });
    },
    handleUploadExcel() {
      this.modalUploadExcel = true;
    },
    handleUploadExcelOk() {
      console.log(
        'handleUploadExcelOk 表格数据（JSON 字符串）' +
          JSON.stringify(this.$refs.uploadExcel.tableData)
      );
      var dataObj = this.$refs.uploadExcel.tableData;
      var titleObj = this.$refs.uploadExcel.tableTitle;
      var tableTitlesZh = []; // 原有的中文标题数组
      titleObj.forEach((value, index) =>
        tableTitlesZh.push(titleObj[index]['key'])
      );
      var tableTitlesEn = ['name', 'code', 'type', 'sort']; // 要替换成的英文标题数组
      console.log('tableTitlesZh(中文):' + tableTitlesZh);
      console.log('tableTitlesEn(英文):' + tableTitlesEn);
      var a = changeObjKeyName(dataObj, tableTitlesZh, tableTitlesEn);
      console.log('更换key值后的javaScript对象' + a);
      console.log('更换key值后的json' + JSON.stringify(a));
      console.log(
        '更换key值后的json' + a.map(v => tableTitlesEn.map(j => v[j]))
      );
      this.$refs.uploadExcel.initUpload();
      this.modalUploadExcel = false;
    },
    initMenuList() {
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          console.log('menuList from server: ', res.array);
          const menuList = buildMenu(res.array);
          console.log('menuList after build: ', buildMenu(res.array));
          // const { id, parentid, code, title, type } = menuList[0];
          // this.currentPid = id;
          // this.parentRowData.id = id;
          // this.parentRowData.parentid = parentid;
          // this.parentRowData.code = code;
          // this.parentRowData.name = title;
          // this.parentRowData.type = type;
          const map = {
            title: 'title',
            children: 'children'
          };
          this.menuList = convertTree(menuList, map, false);
          console.log('menuList after convert: ', this.menuList);
          this.getTableData();
        }
      });
    },
    refreshMenuList() {
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: 'title',
            children: 'children'
          };
          this.menuList = convertTree(menuList, map, false);
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
              cursor: 'auto'
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
      if (typeof data.expand === 'undefined') {
        this.$set(data, 'expend', false);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        data.expand = !data.expand;
      }
      this.currentPid = data.id;
      this.parentRowData.id = data.id;
      this.parentRowData.parentid = data.parentid;
      this.parentRowData.name = data.title;
      this.searchRowData.parentid = data.id;
      this.getTableData();
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
