<template>
  <div class="m-menu">
    <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuList" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
        <Card>
          <h6>当前选中：{{ currentName }}</h6>
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
            @on-edit-permission="handleEditPermission">
            <div slot="searchCondition">
              <Input
                v-model="searchRowData.name"
                placeholder="菜单名称"
                class="search-input mr5"
                style="width: auto"
                clearable>
              </Input>
              <Select v-model="searchRowData.type" class="search-col" placeholder="菜单类型" style="width: auto" clearable>
                <Option value="PARENT">父级菜单</Option>
                <Option value="SON">子级菜单</Option>
              </Select>
              <Button v-waves class="search-btn mr5 ml5" type="primary" @click="handleSearch">
                <Icon type="md-search"/>&nbsp;搜索
              </Button>
              <Button v-waves class="search-btn" type="info" @click="handleClear">
                <Icon type="md-refresh"/>&nbsp;清除条件
              </Button>
            </div>
            <div slot="operations">
              <Button v-waves type="success" class="mr5" @click="addChildren">
                <Icon type="md-add"/>
                子菜单
              </Button>
              <Button v-waves type="success" class="mr5" @click="addParent">
                <Icon type="md-add"/>
                父菜单
              </Button>
              <!-- <Button v-waves type="primary" @click="exportExcel" class="ml20">导出</Button> -->
              <Button v-waves type="success" class="mr5" @click="handleUploadExcel">
                <Icon type="md-cloud-upload"/>
                导入Excel
              </Button>
              <!-- 多类型导出 -->
              <BookTypeOption v-model="exportType" class="mr5"/>
              <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload">
                <Icon type="md-download"/>
                多类型导出
              </Button>
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

    <!--查看菜单 -->
    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="rowData.type=='SON'?'750':'540'"
    >
      <p slot="header">
        <span>查看菜单</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">类型</i-col>
              <i-col span="20">{{ rowData.type | switchType }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">名称</i-col>
              <i-col span="20">{{ rowData.name }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">编码</i-col>
              <i-col span="20">{{ rowData.code }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">排序</i-col>
              <i-col span="20">{{ rowData.sort }}</i-col>
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
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!--创建/编辑菜单 -->
    <Modal
      v-model="modalEdit"
      :mask-closable="false"
    >
      <p slot="header">
        <span>{{ rowData.id==''?'创建菜单':'编辑菜单' }}</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">类型</i-col>
              <i-col span="12"><Input v-model="menuType" placeholder="" readonly></Input></i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">名称</i-col>
              <i-col span="12"><Input v-model="rowData.name" placeholder="" clearable></Input></i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">编码</i-col>
              <i-col span="12"><Input v-model="rowData.code" placeholder="" clearable></Input></i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">排序</i-col>
              <i-col span="12"><Input v-model="rowData.sort" placeholder="" clearable></Input></i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button :loading="loadingBtn" type="primary" @click="handleOk">
          <span v-if="!loadingBtn">确定</span>
          <span v-else>确定中...</span>
        </Button>
      </div>
    </Modal>

    <!--创建/编辑操作权限 -->
    <Modal
      v-model="modalPermission"
      :mask-closable="false"
      width="800"
      @on-cancel="handleCloseEdit">
      <p slot="header">
        <span>编辑操作权限</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">名称</i-col>
              <i-col span="12"><Input v-model="operateRowData.name" placeholder="" clearable></Input></i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">类型</i-col>
              <i-col span="20">
                <CheckboxGroup v-model="requestTypeList">
                  <Checkbox v-for="item in optionList" :label="item" :key="item">{{ item }}</Checkbox>
                </CheckboxGroup>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">路径</i-col>
              <i-col span="16"><Input v-model="operateRowData.antUrl" placeholder="" clearable></Input></i-col>
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
      @on-cancel="handleCloseAdd">
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <TabPane label="创建菜单" name="addMenu">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">类型</i-col>
                  <i-col span="12"><Input v-model="menuType" placeholder="" readonly></Input></i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">名称</i-col>
                  <i-col span="12"><Input v-model="rowData.name" placeholder="" clearable></Input></i-col>
                </Row>
              </i-col>
            </Row>
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">编码</i-col>
                  <i-col span="12"><Input v-model="rowData.code" placeholder="" clearable></Input></i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">排序</i-col>
                  <i-col span="12"><Input v-model="rowData.sort" placeholder="" clearable></Input></i-col>
                </Row>
              </i-col>
            </Row>
          </TabPane>
          <TabPane :disabled="isDisable" label="添加操作权限" name="addPermission">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">名称</i-col>
                  <i-col span="12"><Input v-model="operateRowData.name" placeholder="" clearable></Input></i-col>
                </Row>
              </i-col>
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">类型</i-col>
                  <i-col span="20">
                    <CheckboxGroup v-model="requestTypeList">
                      <Checkbox v-for="item in optionList" :label="item" :key="item">{{ item }}</Checkbox>
                    </CheckboxGroup>
                  </i-col>
                </Row>
              </i-col>
            </Row>
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="12">
                <Row :gutter="8" type="flex" align="middle" class-name="mb10">
                  <i-col span="4">路径</i-col>
                  <i-col span="16"><Input v-model="operateRowData.antUrl" placeholder="" clearable></Input></i-col>
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
        <Button type="primary" @click="goNext">下一步</Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
      </div>
    </Modal>

    <!-- 导入excel -->
    <Modal
      v-model="modalUploadExcel"
      :mask-closable="false"
      :width="750"
      @on-ok="handleUploadExcelOk">
      <UploadExcel ref="uploadExcel"></UploadExcel>
    </Modal>

  </div>
</template>

<script type='text/ecmascript-6'>
import { getMenuData, getOperateData } from '@/api/data';
import { getMenuList } from '@/api/system';
import { buildMenu, getNewTagList, convertTree, changeObjKeyName } from '@/libs/util';
import { mapMutations } from 'vuex';
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import _ from 'lodash';
import BookTypeOption from '_c/book-type-option';
import UploadExcel from '_c/excel';

const menuColumns = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    fixed: 'left',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      return h('span', row.id + '');
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
  { title: '排序', key: 'sort', width: 50, editable: false, maxWidth: 100 },
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
              // 删除前要判断是否满足删除条件
              // vm.$emit(
              //   'input',
              //   params.tableData.filter(
              //     (item, index) => index !== params.row.initRowIndex
              //   )
              // );
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
  // id: 0,
  id: '',
  parentid: 0,
  // sort: 0,
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
  antUrl: ''
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
      const str = value == 'PARENT' ? '父级菜单' : '子级菜单';
      return str;
    }
  },
  data() {
    return {
      menuList: [],
      requestTypeList: ['GET'],
      optionList: ['GET', 'POST', 'PUT', 'DELETE'],
      step: 'addMenu',
      columns: menuColumns,
      oColumns: operateColumns,
      opColumns: operateColumns2,
      tableData: [],
      operateData: [],
      currentPid: 0,
      currentMenuId: 0,
      currentName: '',
      page: 1,
      pageSize: 10,
      total: 0,
      operatePage: 1,
      operatePageSize: 10,
      operateTotal: 0,
      modalEdit: false,
      modalView: false,
      modalAdd: false,
      modalUploadExcel: false,
      modalPermission: false,
      loading: true,
      loadingBtn: false,
      loadingAdd: false,
      isDisable: true,
      isCreated: false,
      rowData: menuRowData,
      operateRowData: operateRowData,
      searchRowData: menuRowData,
      exportType: 'xlsx',
      downloadLoading: false,
      filename: '',
      autoWidth: true
    };
  },
  computed: {
    menuType() {
      return this.rowData.type == 'PARENT' ? '父级菜单' : '子级菜单';
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    }
  },
  watch: {
    '$route'(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  mounted() {
    // 获取系统所有的菜单列表
    this.initMenuList();
  },
  methods: {
    ...mapMutations([
      'setTagNavList',
      'addTag'
    ]),
    initMenuList() {
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          console.log('menuList from mock: ', res.array);
          const menuList = buildMenu(res.array);
          console.log('menuList after build: ', buildMenu(res.array));
          const { id, title } = menuList[0];
          this.currentPid = id;
          this.currentName = title;
          const map = {
            title: 'title',
            children: 'children'
          };
          this.menuList = convertTree(menuList, map, true);
          console.log('after convert: ', this.menuList);
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
          this.menuList = convertTree(menuList, map, true);
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
              cursor: 'auto'
            }}
          >
            <span>
              <CommonIcon type='ios-paper' class='mr10'/>
            </span>
            <span>{data.title}</span>
          </div>
        );
      }
    },
    getTableData() {
      console.log('currentPid：', this.currentPid);
      getMenuData({
        page: this.page,
        rows: this.pageSize,
        pid: this.currentPid
      }).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
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
    changePage(currentPage) {
      this.page = currentPage;
      this.getTableData();
    },
    changePageSize(pageSize) {
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    addChildren() {
      this.resetRowData();
      this.resetOperateRowData();
      this.modalAdd = true;
      this.rowData.type = 'SON';
    },
    addParent() {
      this.resetRowData();
      this.rowData.type = 'PARENT';
      this.modalEdit = true;
    },
    expandChildren(array) {
      array.forEach(item => {
        if (typeof item.expand === 'undefined') {
          this.$set(item, 'expend', true);
        } else {
          item.expand = !item.expand;
        }
        if (item.children) {
          this.expandChildren(item.children);
        }
      });
    },
    handleClick({ root, node, data }) {
      // 展开当前节点
      console.log('current data: ', data);
      if (typeof data.expand === 'undefined') {
        this.$set(data, 'expend', true);
        if (data.children) {
          this.expandChildren(data.children);
        }
      } else {
        data.expand = !data.expand;
      }
      this.currentName = data.title;
      this.currentPid = data.id;
      // 获取新数据
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
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求删除
      this.$http
        .request({
          url: '/ims-menu/' + row.id,
          method: 'delete'
        })
        .then(res => {
          // 返回结果为0则不能删除
          if (res == 0) {
            this.$Message.error('已关联角色 删除失败');
          } else {
            this.$Message.info('删除成功');
            // 刷新左边菜单
            this.refreshMenuList();
            // 刷新表格数据
            this.getTableData();
          }
        });
    },
    handleDeleteOperate(params) {
      const { row } = params;
      // 发送axios请求删除
      this.$http
        .request({
          url: '/ims-operation/' + row.id,
          method: 'delete'
        })
        .then(res => {
          this.$Message.info('删除成功');
          // 刷新表格数据
          this.getOperateData();
        });
    },
    handleEdit(params) {
      const { row } = params;
      this.rowData = _.merge({}, this.rowData, row);
      this.modalEdit = true;
    },
    handleEditPermission(params) {
      const { row } = params;
      this.modalPermission = true;
      this.currentMenuId = row.id;
      console.log(`row.id ${row.id}`);
      this.getOperateData();
    },
    handleOk() {
      this.loadingBtn = true;
      // 提交前校验
      if (!this.rowData.name) {
        this.$Message.warning('请填写菜单的名称');
        this.loadingBtn = false;
        return;
      }

      if (!this.rowData.code) {
        this.$Message.warning('请填写菜单的编码');
        this.loadingBtn = false;
        return;
      }

      if (this.rowData.id == 0) {
        // 组织rowData数据
        this.rowData.parentid = this.currentPid;
        // 发送axios请求创建菜单
        this.$http
          .request({
            url: '/ims-menu/',
            method: 'post',
            data: this.rowData
          })
          .then(res => {
            this.loadingBtn = false;
            this.modalEdit = false;
            this.$Message.info('保存成功');
            // 刷新左边菜单
            this.refreshMenuList();
            // 清空rowData对象
            this.resetRowData();
            // 刷新表格数据
            this.getTableData();
          });
      } else {
        // 发送axios请求修改菜单
        this.$http
          .request({
            url: '/ims-menu/' + this.rowData.id,
            method: 'put',
            data: this.rowData
          })
          .then(res => {
            this.loadingBtn = false;
            this.modalEdit = false;
            this.$Message.info('更新成功');
            // 刷新左边菜单
            this.refreshMenuList();
            // 清空rowData对象
            this.resetRowData();
            // 刷新表格数据
            this.getTableData();
          });
      }
    },
    handleAdd() {
      // 校验字段
      if (!this.operateRowData.name) {
        this.$Message.warning('请填写操作的名称');
        return false;
      }

      if (!this.operateRowData.antUrl) {
        this.$Message.warning('请填写操作的匹配路径');
        return false;
      }

      if (this.requestTypeList.length == 0) {
        this.$Message.warning('请至少选择一种请求类型');
        return false;
      }

      // 组织operateRowData数据
      this.operateRowData.type = this.requestTypeList.join(',');
      this.operateRowData.menuId = this.currentMenuId;

      this.loadingAdd = true;
      // 发送axios请求创建菜单
      this.$http
        .request({
          url: '/ims-operation/',
          method: 'post',
          data: this.operateRowData
        })
        .then(res => {
          this.loadingAdd = false;
          this.$Message.info('保存成功');
          // 清空类型列表
          this.requestTypeList = ['GET'];
          // 清空rowData对象
          this.resetOperateRowData();
          // 刷新表格数据
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
    handleSearch(params) {
      this.searchRowData.parentid = this.currentPid;
      // 发送axios请求
      this.$http
        .request({
          url: '/ims-menu/pages',
          data: this.searchRowData,
          method: 'post'
        })
        .then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
    },
    handleClear(params) {
      // 重置数据
      this.resetSearchRowData();
      this.handleSearch();
    },
    resetRowData() {
      this.rowData = menuRowData;
    },
    resetSearchRowData() {
      this.searchRowData = menuRowData;
      console.log({ ...menuRowData });
      console.log({ ...this.searchRowData });
    },
    resetOperateRowData() {
      this.operateRowData = operateRowData;
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
        item['type'] === 'PARENT' ? item['type'] = '父级菜单' : item['type'] = '子级菜单';
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
      console.log('handleUploadExcelOk 表格数据（JSON 字符串）' + JSON.stringify(this.$refs.uploadExcel.tableData));
      // 由于表格的key为中文与后台所需key不对应，故更改json的key
      var dataObj = this.$refs.uploadExcel.tableData; // 获取表格中的数据
      var titleObj = this.$refs.uploadExcel.tableTitle; // 获取表格中的标题
      var tableTitlesZh = []; // 原有的中文标题数组
      titleObj.forEach((value, index) => tableTitlesZh.push(titleObj[index]['key']));
      var tableTitlesEn = ['name', 'code', 'type', 'sort']; // 要替换成的英文标题数组
      console.log('tableTitlesZh(中文):' + tableTitlesZh);
      console.log('tableTitlesEn(英文):' + tableTitlesEn);
      var a = changeObjKeyName(dataObj, tableTitlesZh, tableTitlesEn);
      console.log('更换key值后的javaScript对象' + a);
      console.log('更换key值后的json' + JSON.stringify(a));
      console.log('更换key值后的json' + a.map(v => tableTitlesEn.map(j => v[j])));
      // 发送axios请求批量增加
      // 清除数据
      this.$refs.uploadExcel.initUpload();
      this.modalUploadExcel = false;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
