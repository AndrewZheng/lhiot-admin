<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :loading="loading"
        :columns="columns"
        editable
        searchable
        search-place="top"
        size="small"
        @on-selection-change="onSelectionChange"
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-relation="handleMenu"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.name"
            placeholder="角色名称"
            class="search-input mr5"
            style="width: auto"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.status"
            class="search-col mr5"
            placeholder="角色状态"
            style="width: auto"
            clearable
          >
            <Option
              v-for="item in roleStatusList"
              :value="item.key"
              :key="`search-col-${item.key}`"
            >{{ item.value }}</Option>
          </Select>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button v-waves class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh" />&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
            <Icon type="md-add" />新增
          </Button>
          <Button v-waves type="error" class="mr5" @click="handleDeleteBatch">
            <Icon type="md-trash" />删除
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
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <!-- 创建/修改模态框 -->
    <Modal
      v-model="modalEdit"
      :loading="loadingBtn"
      :mask-closable="false"
      @on-ok="handleAddOrEditOk('formValidate')"
      @on-cancel="handleCancel"
    >
      <p slot="header">
        <span>{{ rowData.id==''?'创建角色':'编辑角色' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
          <FormItem label="角色名称" prop="name">
            <Input v-model="rowData.name" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色状态" prop="status">
            <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
              <Option
                v-for="item in roleStatusList"
                :value="item.key"
                :key="`search-col-${item.key}`"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="角色描述" prop="roleDesc">
            <Input
              v-model="rowData.roleDesc"
              :autosize="{minRows: 2,maxRows: 5}"
              width="100px"
              type="textarea"
              placeholder="请输入角色描述"
            ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>

    <!-- 多功能添加模态框 -->
    <Modal v-model="modalAdd" :loading="loadingBtn" :mask-closable="false">
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <TabPane label="创建角色" name="roleAdd">
            <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
              <FormItem label="角色名称" prop="name">
                <Input v-model="rowData.name" placeholder="请输入角色名称"></Input>
              </FormItem>
              <FormItem label="角色状态" prop="status">
                <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
                  <Option
                    v-for="item in roleStatusList"
                    :value="item.key"
                    :key="`search-col-${item.key}`"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="角色描述" prop="roleDesc">
                <Input
                  v-model="rowData.roleDesc"
                  :autosize="{ minRows: 2,maxRows: 5}"
                  type="textarea"
                  placeholder="请输入角色描述"
                ></Input>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane :disabled="isDisable" label="关联菜单" name="menuAdd">
            <Tree
              ref="menuTree"
              :data="menuList"
              :render="renderContent"
              show-checkbox
              multiple
              @on-check-change="handleChange"
            ></Tree>
          </TabPane>
        </Tabs>
      </div>
      <div v-if="step=='roleAdd' && !isCreated" slot="footer">
        <Button type="primary" @click="handleAddOrEditOk('formValidate')">下一步</Button>
      </div>
      <div v-else-if="step=='menuAdd'" slot="footer">
        <Button type="primary" @click="handleMenuOk">保存</Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
      </div>
    </Modal>

    <!-- 关联菜单 -->
    <Modal
      v-model="modalMenu"
      :loading="loadingBtn"
      :mask-closable="false"
      @on-ok="handleMenuOk"
      @on-cancel="handleCancel"
    >
      <p slot="header">
        <span>关联菜单</span>
      </p>
      <div class="modal-content">
        <Tree
          ref="menuTree"
          :data="menuList"
          :render="renderContent"
          show-checkbox
          multiple
          @on-check-change="handleChange"
        ></Tree>
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
  name: 'RolePage',
  inject: ['reload'],
  components: {
    Tables
  },
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      modalEdit: false,
      modalAdd: false,
      loading: true,
      loadingBtn: true,
      modalMenu: false,
      isDisable: true,
      isCreated: false,
      ids: [],
      roleStatusList: [],
      menuList: [],
      originMenuList: [],
      selectedIds: [],
      relationMenuList: [],
      step: 'roleAdd',
      rowData: _.cloneDeep(roleRowData),
      searchRowData: _.cloneDeep(roleRowData),
      ruleValidate: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }]
      },
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
                <tag color='success'>
                  {this.getDictValueByKey(this.roleStatusList, row.status)}
                </tag>
              ) : (
                <tag color='error'>
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
                  }
                }
              });
            }
          ]
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.getTableData();
    this.getMenuList();
    this.getStatusList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getRoleData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
      });
    },
    getMenuList() {
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: 'name',
            children: 'children'
          };
          this.menuList = convertTree(menuList, map, false);
          this.originMenuList = res.array;
        }
      });
    },
    getStatusList() {
      this.roleStatusList = this.getDictListByName('userStatus');
    },
    resetRowData() {
      this.rowData = _.cloneDeep(roleRowData);
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
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
          if (res === 0) {
            this.$Message.error('已关联用户 删除失败');
          } else {
            this.$Message.info('删除成功');
            // 刷新表格数据
            this.getTableData();
          }
        });
    },
    handleDeleteBatch() {
      if (this.ids.length !== 0) {
        // 发送axios请求
        this.$http
          .request({
            url: '/ims-role/' + this.ids,
            method: 'delete'
          })
          .then(res => {
            // 返回结果为0则不能删除
            if (res === 0) {
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
      const { row } = params;
      this.rowData = _.cloneDeep(row);
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
      const { row } = params;
      this.rowData = _.cloneDeep(row);
      getRelationMenu(this.rowData.id).then(res => {
        if (res && res.array.length > 0) {
          console.log('menuids: ', this.getRelationMenuIds(res.array));
          this.rowData.menuids = this.getRelationMenuIds(res.array);
          this.checkMenuByIds();
        } else {
          setTreeNodeChecked(this.menuList, '');
        }
      });
      this.modalMenu = true;
    },
    getRelationMenuIds(res) {
      const relationMenuIds = res.map(item => item.id.toString());
      return relationMenuIds.toString();
    },
    handleChange(checkedArr, currentNode) {
      const selectedNodes = this.$refs.menuTree.getCheckedAndIndeterminateNodes();
      const result = [];
      selectedNodes.forEach(node => {
        result.push(node.id)
      });
      this.selectedIds = result;
    },
    handleSearch(params) {
      this.$http
        .request({
          url: '/ims-role/pages',
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
      this.resetSearchRowData();
      this.handleSearch();
    },
    findParent(item) {
      const result = [];
      const findParentIds = node => {
        result.push(node.id);
        if (node && node.parentid) {
          const parent = this.originMenuList.find(o => o.id === node.parentid);
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
        this.selectedIds = menuids;
        setTreeNodeChecked(this.menuList, menuids);
      } else {
        setTreeNodeChecked(this.menuList, '');
      }
    },
    handleMenuOk() {
      let menuIds = '';
      if (this.selectedIds === this.rowData.menuids) {
        this.loadingBtn = false;
        this.modalAdd = false;
      } else {
        menuIds = this.selectedIds.length === 0 ? '-1' : this.selectedIds; // menuIds = -1为没有选择任何数数据
        this.$http
          .request({
            url: '/ims-role/relation/' + this.rowData.id + '/' + menuIds,
            method: 'put'
          })
          .then(res => {
            this.loadingBtn = false;
            if (this.modalMenu === true) {
              this.modalMenu = false;
              this.targetKeys = [];
              this.$Message.info('修改成功');
            } else if (this.modalAdd === true) {
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
        this.$store.dispatch('changePermission').then(res => {
          this.$router.addRoutes(this.$store.getters.getActualRouter);
          this.reload();
        });
      }
    },
    handleCancel() {
      setTreeNodeChecked(this.menuList, '');
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
      this.getTableData();
    },
    changePage(currentPage) {
      this.page = currentPage;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
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
    }
  }
};
</script>

<style>
</style>
