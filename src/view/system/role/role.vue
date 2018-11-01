<template>
<div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
      search-place="top" size="small"
      v-model="tableData"
      :loading="loading"
      :columns="columns"
      @on-selection-change="onSelectionChange"
      @on-delete="handleDelete"
      @on-view="handleView"
      @on-edit="handleEdit"
      @on-relation="handleMenu"
      >
       <div slot="searchCondition">
          <Input  placeholder="角色名称" class="search-input" v-model="searchRowData.name" style="width: auto" clearable/>
          <Select v-model="searchRowData.status" class="search-col" placeholder="角色状态" style="width: auto" clearable>
            <Option v-for="item in roleStatusList" :value="item.key"  :key="`search-col-${item.key}`">{{item.value}}</Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary"><Icon type="md-search"/>&nbsp;搜索</Button>
          <Button v-waves @click="handleClear" class="search-btn" type="info"><Icon type="md-refresh"/>&nbsp;清除条件</Button>
        </div>
        <div slot="operations">
          <Button v-waves @click="handleAdd" type="success" class="mr5">
            <Icon type="md-add"/> 新增</Button>
          <Button v-waves @click="handleDeleteBatch" type="error" class="mr5">
            <Icon type="md-trash"/> 删除</Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
            <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </Row>
      </div>
    </Card>

    <!-- 创建/修改模态框 -->
     <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleAddOrEditOk('formValidate')"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>{{rowData.id==''?'创建角色':'编辑角色'}}</span>
        </p>
       <div class="modal-content">
         <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
            <FormItem label="角色名称" prop="name">
                <Input v-model="rowData.name" placeholder="请输入角色名称"/>
            </FormItem>
            <FormItem label="角色状态" prop="status">
               <Select v-model="rowData.status" class="search-col"  placeholder="请选择用户状态">
                  <Option v-for="item in roleStatusList" :value="item.key"  :key="`search-col-${item.key}`">{{item.value}}</Option>
                </Select>
            </FormItem>
            <FormItem label="角色描述" prop="roleDesc">
                <Input v-model="rowData.roleDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述" />
            </FormItem>
        </Form>
       </div>
    </Modal>

    <!-- 多功能添加模态框 -->
     <Modal
        v-model="modalAdd"
        :loading="loadingBtn"
        :mask-closable="false">
       <div class="modal-content">
          <Tabs size="small" v-model="step">
            <TabPane label="创建角色" name="roleAdd">
              <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
                  <FormItem label="角色名称" prop="name">
                      <Input v-model="rowData.name" placeholder="请输入角色名称"/>
                  </FormItem>
                  <FormItem label="角色状态" prop="status">
                      <Select v-model="rowData.status" class="search-col"  placeholder="请选择用户状态">
                        <Option v-for="item in roleStatusList" :value="item.key"  :key="`search-col-${item.key}`">{{item.value}}</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="角色描述" prop="roleDesc">
                      <Input v-model="rowData.roleDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述" />
                  </FormItem>
              </Form>
            </TabPane>
            <TabPane label="关联菜单" name="menuAdd" :disabled="isDisable">
              <Tree :data="menuList" :render="renderContent" show-checkbox multiple ref="menuTree" @on-check-change="handleChange"></Tree>
            </TabPane>
          </Tabs>
       </div>
       <div slot="footer" v-if="step=='roleAdd' && !isCreated">
        <Button type="primary" @click="handleAddOrEditOk('formValidate')">下一步</Button>
      </div>
      <div slot="footer" v-else-if="step=='menuAdd'">
        <Button type="primary" @click="handleMenuOk">保存</Button>
       </div>
      <div slot="footer" v-else>
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
      </div>
    </Modal>

    <!-- 关联菜单 -->
    <Modal
        v-model="modalMenu"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleMenuOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>关联菜单</span>
        </p>
       <div class="modal-content">
         <Tree :data="menuList" :render="renderContent" show-checkbox multiple ref="menuTree" @on-check-change="handleChange"></Tree>
       </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables';
import { getRoleData, getMenuList, getRelationMenu } from '@/api/system';
import { buildMenu, convertTree, setTreeNodeChecked } from '@/libs/util';
import { dedupe } from '@/libs/tools';
import _ from 'lodash';

const roleRowData = {
  name: '',
  status: '',
  roleDesc: '',
  createBy: '',
  createAt: '',
  menuids: ''
};

export default {
  name: 'role_page',
  inject: ['reload'],
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center'
        },
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
        { title: '角色名称', key: 'name', sortable: true },
        {
          title: '角色状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const str =
              row.status == 'AVAILABLE' ? (
                <tag color="success">
                  {this.getDictValueByKey(this.roleStatusList, row.status)}
                </tag>
              ) : (
                <tag color="error">
                  {this.getDictValueByKey(this.roleStatusList, row.status)}
                </tag>
              );
            return <div>{str}</div>;
          }
        },
        { title: '角色描述', key: 'roleDesc', sortable: true },
        { title: '创建人', key: 'createBy', sortable: true },
        { title: '创建时间', key: 'createAt', sortable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['view', 'edit', 'relation', 'delete'],
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
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      modalEdit: false,
      modalAdd: false,
      loading: true,
      loadingBtn: true,
      rowData: roleRowData,
      searchRowData: roleRowData,
      modalMenu: false,
      menuList: [],
      originMenuList: [],
      selectedIds: [],
      relationMenuList: [],
      // tab选项操作数据
      step: 'roleAdd',
      isDisable: true,
      isCreated: false,
      // 表单验证
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
          // { type: 'string', max: 64, message: '64个字以内', trigger: 'blur'}
        ],
        status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }]
      },
      ids: [],
      roleStatusList: []
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
    this.getMenuList();
    this.getStatusList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.chirldren) {
        return (
          <span
            style={{ display: 'inline-block', width: '100%', fontSize: '14px' }}
          >
            <span />
            <span>{data.meta.title}</span>
          </span>
        );
      } else {
        return (
          <span
            style={{ display: 'inline-block', width: '100%', fontSize: '14px' }}
          >
            <span />
            <span>{data.meta.title}</span>
          </span>
        );
      }
    },
    handleView(params) {
      this.$Modal.info({
        title: '角色详情',
        content:
          `角色名称: ${this.tableData[params.row.initRowIndex].name}<br>
          角色状态: ` +
          this.getDictValueByKey(
            this.roleStatusList,
            this.tableData[params.row.initRowIndex].status
          ) +
          `<br>
          角色描述: ${this.tableData[params.row.initRowIndex].roleDesc}<br>
          创建人: ${this.tableData[params.row.initRowIndex].createBy}<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}`
      });
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求
      this.$http
        .request({
          url: '/ims-role/' + row.id,
          method: 'delete',
          data: this.rowData
        })
        .then(res => {
          // 返回结果为0则不能删除
          if (res == 0) {
            this.$Message.error('已关联用户 删除失败');
          } else {
            this.$Message.info('删除成功');
            // 刷新表格数据
            this.getTableData();
          }
        });
    },
    handleDeleteBatch() {
      if (this.ids.length != 0) {
        // 发送axios请求
        this.$http
          .request({
            url: '/ims-role/' + this.ids,
            method: 'delete'
          })
          .then(res => {
            // 返回结果为0则不能删除
            if (res == 0) {
              this.$Message.error('有角色已关联用户 删除失败');
            } else {
              this.$Message.info('删除成功');
              // 刷新表格数据
              this.getTableData();
            }
          });
      } else {
        this.$Message.error('请至少选择一行记录');
      }
    },
    onSelectionChange(selection) {
      this.ids = selection.map(item => item.id.toString());
      console.log('选择变化,当前页选择ids:' + this.ids);
    },
    handleEdit(params) {
      console.log(params);
      const { row } = params;
      this.rowData = Object.assign({}, row);
      // 测试先写死
      // this.rowData.menuids='11,12,13,14';
      this.rowData = _.merge({}, this.rowData, row);
      this.modalEdit = true;
    },
    handleAddOrEditOk(name) {
      this.loadingBtn = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.rowData.id === undefined) {
            // 发送axios请求
            this.$http
              .request({
                url: '/ims-role/',
                method: 'post',
                data: this.rowData
              })
              .then(res => {
                this.modalEdit = false;
                this.$Message.info('保存成功');
                this.step = 'menuAdd';
                this.isDisable = false;
                this.isCreated = true;
                // 获取新增加的id
                this.rowData.id = res.id;
                // 刷新表格数据
                this.getTableData();
              });
          } else {
            // 发送axios请求
            this.$http
              .request({
                url: '/ims-role/' + this.rowData.id,
                method: 'put',
                data: this.rowData
              })
              .then(res => {
                this.loadingBtn = false;
                this.modalEdit = false;
                this.$Message.info('更新成功');
                // 清空rowData对象
                this.resetRowData();
                // 刷新表格数据
                this.getTableData();
              });
          }
        } else {
          this.$Message.warning('请先完善信息');
        }
      });
    },
    handleMenu(params) {
      console.log(params);
      const { row } = params;
      this.rowData = Object.assign({}, row);
      // 测试先写死
      // this.rowData.menuids='11,12,13,14';
      getRelationMenu(this.rowData.id).then(res => {
        if (res && res.array.length > 0) {
          console.log('menuids: ', this.getRelationMenuIds(res.array));
          this.rowData.menuids = this.getRelationMenuIds(res.array);
          // 反选中已有的权限
          this.checkMenuByIds();
        } else {
          setTreeNodeChecked(this.menuList, '');
        }
      });
      this.modalMenu = true;
    },
    getRelationMenuIds(res) {
      let relationMenuIds = res.map(item => item.id.toString());
      console.log(relationMenuIds);
      return relationMenuIds.toString();
    },
    handleChange(checkedArr) {
      console.log('checkedArr: ', checkedArr);
      // 循环执行所有选中的节点链,找到他们的id以及他们父级id，父级的父级id
      let result = [];
      checkedArr.forEach(item => {
        // 递归寻找父级
        result.push(...this.findParent(item));
      });
      this.selectedIds = dedupe(result);
      console.log('result: ', result);
      console.log('uniq result: ', this.selectedIds);
    },
    handleSearch(params) {
      // 发送axios请求
      this.$http
        .request({
          url: '/ims-role/pages',
          data: this.searchRowData,
          method: 'post'
        })
        .then(res => {
          // this.tableData = res.data;
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
    findParent(item) {
      let result = [];
      let findParentIds = node => {
        result.push(node.id);
        if (node && node.parentid) {
          let parent = this.originMenuList.find(o => o.id == node.parentid);
          findParentIds(parent);
        }
      };
      findParentIds(item);
      console.log('result from parent:', result);
      return result;
    },
    checkMenuByIds() {
      if (this.rowData.menuids !== undefined) {
        const menuids = this.rowData.menuids.split(',');
        console.log('menuids: ', menuids);
        setTreeNodeChecked(this.menuList, menuids);
        console.log('this.menuList selected:', this.menuList);
      } else {
        setTreeNodeChecked(this.menuList, '');
        console.log('this.menuList selected:', this.menuList);
      }
    },
    handleMenuOk() {
      let menuIds = '';
      if (this.selectedIds.length === 0) {
        menuIds = '-1'; // 未选择
      } else {
        menuIds = this.selectedIds.join(',');
      }
      // 发送axios请求
      this.$http
        .request({
          url: '/ims-role/relation/' + this.rowData.id + '/' + menuIds,
          method: 'put'
        })
        .then(res => {
          this.loadingBtn = false;
          if (this.modalMenu == true) {
            this.modalMenu = false;
            this.targetKeys = [];
            this.$Message.info('修改成功');
          } else if (this.modalAdd == true) {
            this.modalAdd = false;
            this.$Message.info('保存成功');
            this.isCreated = true;
          }
        });
      // TODO 清除已选择的菜单数据
      // setTreeNodeChecked(this.menuList, '');
      // getRelationMenu(this.rowData.id).then(res => {
      //   if (res && res.array.length > 0) {
      //     console.log('getRelationMenu: ', buildMenu(res.array, 'parentid', true));
      //     this.relationMenuList = buildMenu(res.array, 'parentid', true);
      //   }
      // });
      // 分发action动态修改权限 TODO:待测试
      this.$store.dispatch('changePermission').then(res => {
        this.$router.addRoutes(this.$store.getters.getActualRouter);
        // 刷新当前路由
        this.reload();
      });
    },
    handleCancel() {
      // TODO 清除已选择的菜单数据
      // this.selectedIds = [];
      setTreeNodeChecked(this.menuList, '');
      // setTreeNodeChecked(this.menuList, 0);
      // setTreeNodeChecked(this.menuList, ',');
    },
    handleAdd() {
      this.rowData = {};
      this.step = 'roleAdd';
      this.isDisable = true;
      this.isCreated = false;
      this.modalAdd = true;
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable = true;
      this.step = 'roleAdd';
      // 刷新表格数据
      this.getTableData();
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    changeRadio(selectItem) {
      console.log('选择按钮的值:' + `${selectItem}`);
    },
    changePage(currentPage) {
      // console.log(currentPage);
      this.page = currentPage;
      this.getTableData();
    },
    changePageSize(pageSize) {
      // console.log(pageSize);
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    resetRowData() {
      this.rowData = roleRowData;
    },
    resetSearchRowData() {
      this.searchRowData = roleRowData;
    },
    getTableData() {
      getRoleData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        // this.tableData = res.data;
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
      });
    },
    getMenuList() {
      // 获取系统所有的菜单列表
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          console.log('buildMenu: ', buildMenu(res.array));
          const menuList = buildMenu(res.array);
          const map = {
            title: 'name',
            children: 'children'
          };
          this.menuList = convertTree(menuList, map, true);
          this.originMenuList = res.array; // 保留一份元数据供后续处理
          console.log('after convert: ', this.menuList);
        }
      });
    },
    // 数据字典集合
    getStatusList() {
      this.roleStatusList = this.getDictListByName('userStatus');
    }
  }
};
</script>

<style>
</style>
