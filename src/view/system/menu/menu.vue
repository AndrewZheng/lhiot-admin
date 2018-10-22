<template>
<div class="m-menu">
  <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuList" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
        <Card>
          <h6>当前选中：{{currentName}}</h6>
          <tables ref="tables" editable searchable
          search-place="top" size="small"
          v-model="tableData"
          :loading="loading"
          :columns="columns"
          @on-delete="handleDelete"
          @on-view="handleView"
          @on-edit="handleEdit"
          @on-edit-permission="handleEditPermission">
            <div slot="operations">
                <Button v-waves type="success" class="mr5" @click="addChildren">
                  <Icon type="md-add"/>
                  子菜单
                </Button>
                <Button v-waves type="success" class="mr5" @click="addParent">
                  <Icon type="md-add"/>
                  父菜单
                </Button>
                <Button v-waves type="primary" @click="exportExcel">导出为Csv文件</Button>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
                <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
            </Row>
          </div>
        </Card>
      </i-col>
  </Row>

  <!--查看菜单 -->
  <Modal
        v-model="modalView"
        :mask-closable="false"
        :width="rowData.type=='SON'?'750':''"
        >
        <p slot="header">
            <span>查看菜单</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">类型</i-col>
              <i-col span="20">{{rowData.type | switchType}}</i-col>
            </Row>
           </i-col>
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">名称</i-col>
              <i-col span="20">{{rowData.name}}</i-col>
            </Row>
           </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">编码</i-col>
              <i-col span="20">{{rowData.code}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">排序</i-col>
              <i-col span="20">{{rowData.sort}}</i-col>
            </Row>
          </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" v-if="rowData.type=='SON'">
             <tables ref="operate_tables"
              search-place="top" size="small"
              v-model="operateData"
              :loading="loading"
              :columns="opColumns"
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
            <span>{{rowData.id==0?'创建菜单':'编辑菜单'}}</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">类型</i-col>
              <i-col span="12"><Input v-model="menuType" placeholder=""  readonly /></i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">名称</i-col>
              <i-col span="12"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
            </Row>
          </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">编码</i-col>
              <i-col span="12"><Input v-model="rowData.code" placeholder="" clearable /></i-col>
            </Row>
           </i-col>
           <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">排序</i-col>
              <i-col span="12"><Input v-model="rowData.sort" placeholder="" clearable /></i-col>
            </Row>
           </i-col>
         </Row>
       </div>
       <div slot="footer">
          <Button type="primary" @click="handleOk" :loading="loadingBtn">
            <span v-if="!loadingBtn">确定</span>
            <span v-else>确定中...</span>
          </Button>
       </div>
    </Modal>

    <!--创建/编辑操作权限 -->
    <Modal
        v-model="modalPermission"
        :mask-closable="false"
        @on-cancel="handleCloseEdit"
        width="800">
        <p slot="header">
            <span>编辑操作权限</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">名称</i-col>
                <i-col span="12"><Input v-model="operateRowData.name" placeholder="" clearable /></i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">类型</i-col>
                <i-col span="20">
                  <CheckboxGroup v-model="requestTypeList">
                      <Checkbox v-for="item in optionList" :label="item" :key="item">{{ item }}</Checkbox>
                  </CheckboxGroup>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">路径</i-col>
                <i-col span="16"><Input v-model="operateRowData.antUrl" placeholder="" clearable /></i-col>
              </Row>
            </i-col>
            <i-col span="12">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="24">
                  <Button type="success" @click="handleAdd" :loading="loadingAdd">
                      <span v-if="!loadingAdd">添加</span>
                      <span v-else>保存中...</span>
                  </Button>
                </i-col>
              </Row>
            </i-col>
          </Row>

          <tables ref="operate_tables"
          search-place="top" size="small"
          v-model="operateData"
          :loading="loading"
          :columns="oColumns"
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
        @on-cancel="handleCloseAdd"
        width="750">
        <div class="modal-content">
          <Tabs size="small" v-model="step">
            <TabPane label="创建菜单" name="addMenu">
                <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">类型</i-col>
                      <i-col span="12"><Input v-model="menuType" placeholder=""  readonly /></i-col>
                    </Row>
                  </i-col>
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">名称</i-col>
                      <i-col span="12"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
                    </Row>
                  </i-col>
                </Row>
                <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">编码</i-col>
                      <i-col span="12"><Input v-model="rowData.code" placeholder="" clearable /></i-col>
                    </Row>
                  </i-col>
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">排序</i-col>
                      <i-col span="12"><Input v-model="rowData.sort" placeholder="" clearable /></i-col>
                    </Row>
                  </i-col>
                </Row>
            </TabPane>
            <TabPane label="添加操作权限" name="addPermission" :disabled="isDisable">
                <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">名称</i-col>
                      <i-col span="12"><Input v-model="operateRowData.name" placeholder="" clearable /></i-col>
                    </Row>
                  </i-col>
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">类型</i-col>
                      <i-col span="20">
                        <CheckboxGroup v-model="requestTypeList">
                            <Checkbox v-for="item in optionList" :label="item" :key="item">{{ item }}</Checkbox>
                        </CheckboxGroup>
                      </i-col>
                    </Row>
                  </i-col>
                </Row>
                <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="4">路径</i-col>
                      <i-col span="16"><Input v-model="operateRowData.antUrl" placeholder="" clearable /></i-col>
                    </Row>
                  </i-col>
                  <i-col span="12">
                    <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                      <i-col span="24">
                        <Button type="success" @click="handleAdd" :loading="loadingAdd">
                           <span v-if="!loadingAdd">添加</span>
                           <span v-else>保存中...</span>
                        </Button>
                      </i-col>
                    </Row>
                  </i-col>
                </Row>

                <tables ref="tables"
                search-place="top" size="small"
                v-model="operateData"
                :loading="loading"
                :columns="oColumns"
                @on-delete="handleDeleteOperate"
                />
            
            </TabPane>
        </Tabs>
       </div>
       <div slot="footer" v-if="step=='addMenu' && !isCreated">
        <Button type="primary" @click="goNext">下一步</Button>
       </div>
       <div slot="footer" v-else>
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
       </div>
    </Modal>
</div>
</template>

<script type='text/ecmascript-6'>
import { getMenuData, getOperateData } from '@/api/data';
import { getMenuList } from '@/api/system';
import { buildMenu, convertTree } from '@/libs/util';
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';
import _ from 'lodash';

const menuColumns = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    maxWidth: 80,
    render: (h, params, vm) => {
      const { row, index, column } = params;
      return h('span', row.id + '');
    }
  },
  { title: '名称', key: 'name', sortable: true },
  { title: '编码', key: 'code', sortable: false },
  {
    title: '类型',
    key: 'type',
    sortable: true,
    maxWidth: 100,
    render: (h, params, vm) => {
      const { row, index, column } = params;
      const str = row.type == 'PARENT' ? '父级菜单' : '子级菜单';
      return <span>{str}</span>;
    }
  },
  { title: '排序', key: 'sort', editable: false, maxWidth: 100 },
  {
    title: '操作',
    key: 'handle',
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

const operateColumns = [
  {
    title: '编号',
    key: 'id',
    sortable: true,
    maxWidth: 80,
    render: (h, params, vm) => {
      const { row, index, column } = params;
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
      const { row, index, column } = params;
      return h('span', row.id + '');
    }
  },
  { title: '名称', key: 'name', sortable: true },
  { title: '类型', key: 'type', sortable: false },
  { title: '路径', key: 'antUrl', sortable: false }
];

export default {
  name: 'menu_pages',
  components: {
    Tables,
    CommonIcon
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
      modalPermission: false,
      loading: true,
      loadingBtn: false,
      loadingAdd: false,
      isDisable: true,
      isCreated: false,
      rowData: {
        id: 0,
        parentid: 0,
        sort: 0,
        code: '',
        name: '',
        type: ''
      },
      operateRowData: {
        id: 0,
        type: '',
        menuId: 0,
        name: '',
        antUrl: ''
      }
    };
  },
  mounted() {
    // 获取系统所有的菜单列表
    this.initMenuList();
  },
  filters: {
    switchType(value) {
      if (!value) return;
      const str = value == 'PARENT' ? '父级菜单' : '子级菜单';
      return str;
    }
  },
  computed: {
    menuType() {
      return this.rowData.type == 'PARENT' ? '父级菜单' : '子级菜单';
    }
  },
  methods: {
    initMenuList() {
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          console.log('menuList from mock: ', res.array);
          const menuList = buildMenu(res.array);
          console.log('menuList after build: ', buildMenu(res.array));
          const { id, title } = menuList[0];
          this.currentPid = id;
          this.currentName = title;
          const map= {
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
          const map= {
             title: 'title',
             children: 'children'
          };
          this.menuList = convertTree(menuList, map, true);
        }
      });
    },
    renderContent(h, { root, node, data }) {
      if (data.type=='PARENT') {
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
              <CommonIcon type='ios-folder' class="mr10" />
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
              <CommonIcon type='ios-paper' class="mr10" />
            </span>
            <span>
              {data.title}
            </span>
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
      // 展开当前节点-先Pending过后handle
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
      if (row.type=='SON') {
        this.currentMenuId= row.id;
        console.log(`row.id ${row.id}`);
        this.getOperateData();
      }
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求删除
      this.$http.request({
        url: '/ims-menu/'+ row.id,
        method: 'delete'
      }).then(res => {
        this.$Message.info('删除成功');
        // 刷新左边菜单
        this.refreshMenuList();
        // 刷新表格数据
        this.getTableData();
      });
    },
    handleDeleteOperate(params) {
      const { row } = params;
      // 发送axios请求删除
      this.$http.request({
        url: '/ims-operation/'+row.id,
        method: 'delete'
      }).then(res => {
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
      this.modalPermission=true;
      this.currentMenuId= row.id;
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
        this.$http.request({
          url: '/ims-menu/',
          method: 'post',
          data: this.rowData
        }).then(res => {
          this.loadingBtn = false;
          this.modalEdit= false;
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
        this.$http.request({
          url: '/ims-menu/'+ this.rowData.id,
          method: 'put',
          data: this.rowData
        }).then(res => {
          this.loadingBtn = false;
          this.modalEdit= false;
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
      
      if (this.requestTypeList.length==0) {
        this.$Message.warning('请至少选择一种请求类型');
        return false;
      }

      // 组织operateRowData数据
      this.operateRowData.type = this.requestTypeList.join(',');
      this.operateRowData.menuId= this.currentMenuId;
 
      this.loadingAdd = true;
      // 发送axios请求创建菜单
      this.$http.request({
        url: '/ims-operation/',
        method: 'post',
        data: this.operateRowData
      }).then(res => {
        this.loadingAdd = false;
        this.$Message.info('保存成功');
        // 清空类型列表
        this.requestTypeList= ['GET'];
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
      this.isDisable= true;
      this.step='addMenu';
    },
    handleCloseEdit() {
      this.modalPermission=false;
      // 初始化
      this.currentMenuId= 0;
      this.requestTypeList=['GET'];
    },
    resetRowData() {
      this.rowData = {
        id: 0,
        parentid: 0,
        sort: 0,
        code: '',
        name: '',
        type: ''
      };
    },
    resetOperateRowData() {
      this.operateRowData = {
        id: 0,
        type: '',
        menuId: 0,
        name: '',
        antUrl: ''
      };
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
      this.$http.request({
        url: '/ims-menu/',
        method: 'post',
        data: this.rowData
      }).then(res => {
        this.$Message.info('创建成功');
        this.step='addPermission';
        this.isDisable= false;
        this.isCreated = true;
        this.currentMenuId= res.id;

        // 刷新表格数据
        this.getTableData();
        this.getOperateData();
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
