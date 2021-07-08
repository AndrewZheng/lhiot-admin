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
              :key="`search-col-${item.key}`"
              :value="item.key"
            >
              {{ item.value }}
            </Option>
          </Select>
          <Button v-waves class="search-btn mr5" type="primary" @click="handleSearch">
            <Icon type="md-search" />&nbsp;搜索
          </Button>
          <Button v-waves class="search-btn" type="info" @click="handleClear">
            <Icon type="md-refresh" />&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleCreate">
            <Icon type="md-add" />添加
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
    <Modal v-model="modalEdit" :mask-closable="false" :width="450">
      <p slot="header">
        <span>{{ !rowData.id? '创建角色': '编辑角色' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="rowData" :rules="ruleValidate" :label-width="80">
          <FormItem label="角色名称" prop="name">
            <Input v-model="rowData.name" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色状态" prop="status">
            <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
              <Option
                v-for="item in roleStatusList"
                :key="`search-col-${item.key}`"
                :value="item.key"
              >
                {{ item.value }}
              </Option>
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
      <div slot="footer">
        <Button :loading="loadingBtn" type="primary" @click="handleSubmit('editForm')">
          <span v-if="!loadingBtn">确认</span>
          <span v-else>确认中...</span>
        </Button>
      </div>
    </Modal>

    <!-- 多功能添加模态框 -->
    <Modal v-model="modalAdd" :mask-closable="false" :width="600">
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <TabPane label="创建角色" name="roleAdd">
            <Form ref="editForm" :model="rowData" :rules="ruleValidate" :label-width="80">
              <FormItem label="角色名称" prop="name">
                <Input v-model="rowData.name" placeholder="请输入角色名称"></Input>
              </FormItem>
              <FormItem label="角色状态" prop="status">
                <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
                  <Option
                    v-for="item in roleStatusList"
                    :key="`search-col-${item.key}`"
                    :value="item.key"
                  >
                    {{ item.value }}
                  </Option>
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
          <TabPane :disabled="isDisable" label="关联菜单 & 操作" name="menuAdd">
            <Tree
              ref="menuTree"
              :data="menuOperateList"
              :render="renderContent"
              show-checkbox
              multiple
              @on-check-change="handleChange"
            ></Tree>
          </TabPane>
        </Tabs>
      </div>
      <div v-if="step=='roleAdd' && !isCreated" slot="footer">
        <Button type="primary" @click="handleSubmit('editForm')">
          下一步
        </Button>
      </div>
      <div v-else-if="step=='menuAdd'" slot="footer">
        <Button type="primary" @click="handleMenuOk">
          保存
        </Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="handleCloseAdd">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 关联菜单 -->
    <Modal
      v-model="modalMenu"
      :mask-closable="false"
      :width="750"
      @on-ok="handleMenuOk"
    >
      <p slot="header">
        <span>关联菜单 & 操作</span>
      </p>
      <div class="modal-content">
        <Tree
          ref="menuTree"
          :data="menuOperateList"
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
import {
  getRoleData,
  deleteRole,
  createRole,
  editRole,
  getMenuOperatesByRoleId,
  createRoleRelation
} from '@/api/system';
import tableMixin from '@/mixins/tableMixin.js';
import { buildMenu, convertTree } from '@/libs/util';

const roleRowData = {
  id: 0,
  name: '',
  status: '',
  roleDesc: '',
  createBy: '',
  createAt: ''
};

const searchRowData = {
  name: '',
  status: '',
  page: 1,
  rows: 10
};

export default {
  name: 'RolePage',
  inject: ['reload'],
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      modalEdit: false,
      modalAdd: false,
      loading: true,
      loadingBtn: false,
      modalMenu: false,
      isDisable: true,
      isCreated: false,
      ids: [],
      roleStatusList: [],
      menuOperateList: [],
      originMenuList: [],
      selectedIds: [],
      selectedOperationIds: [],
      relationMenuList: [],
      step: 'roleAdd',
      rowData: _.cloneDeep(roleRowData),
      searchRowData: _.cloneDeep(searchRowData),
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
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
    this.getMenuOperateList();
    this.getStatusList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getRoleData(this.searchRowData)
        .then(res => {
          this.tableData = res.array;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMenuOperateList() {
      getMenuOperatesByRoleId().then(res => {
        if (res && res.array.length > 0) {
          const menuList = buildMenu(res.array);
          const map = {
            title: 'name',
            children: 'children'
          };
          this.menuOperateList = convertTree(menuList, map, false);
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
      this.searchRowData = _.cloneDeep(searchRowData);
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
    handleMenuOk() {
      this.loadingBtn = true;
      createRoleRelation({
        id: this.rowData.id,
        menuIds: this.selectedIds.join(','),
        operationIds: this.selectedOperationIds.join(',')
      }).then(res => {
        if (this.modalMenu) {
          this.modalMenu = false;
          this.$Message.info('修改成功');
        } else if (this.modalAdd) {
          this.modalAdd = false;
          this.$Message.info('保存成功');
          this.isCreated = true;
        }
        // 成功过后更改当前用户的权限
        this.$store.dispatch('changePermission').then(res => {
          this.$router.addRoutes(this.$store.getters.getActualRouter);
          this.reload();
        });
      }).finally(() => {
        this.loadingBtn = false;
      });
    },
    handleCreate() {
      this.rowData = _.cloneDeep(roleRowData);
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
    handleDelete(params) {
      const { row } = params;
      deleteRole(row.id)
        .then(res => {
          if (res === 0) {
            this.$Message.error('已关联用户 删除失败');
          } else {
            this.$Message.info('删除成功');
            this.getTableData();
          }
        });
    },
    handleDeleteBatch() {
      if (this.ids.length === 0) {
        this.$Message.error('请至少选择一行记录');
        return;
      }
      deleteRole(this.ids)
        .then(res => {
          if (res === 0) {
            this.$Message.error('有角色已关联用户 删除失败');
          } else {
            this.$Message.info('删除成功');
            this.getTableData();
          }
        });
    },
    onSelectionChange(selection) {
      this.ids = selection.map(item => item.id.toString());
    },
    handleEdit(params) {
      const { row } = params;
      this.rowData = _.cloneDeep(row);
      this.modalEdit = true;
    },
    handleSubmit(name) {
      this.loadingBtn = true;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.rowData.id) {
            createRole(this.rowData)
              .then(res => {
                this.modalEdit = false;
                this.$Message.info('保存成功');
                this.step = 'menuAdd';
                this.isDisable = false;
                this.isCreated = true;
                this.rowData.id = res.id;
                this.getTableData();
              }).finally(() => {
                this.loadingBtn = false;
              });
          } else {
            editRole(this.rowData)
              .then(res => {
                this.loadingBtn = false;
                this.modalEdit = false;
                this.$Message.info('更新成功');
                this.resetRowData();
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
      // 清楚掉上次操作的数据
      this.menuOperateList = [];
      this.selectedIds = [];
      this.selectedOperationIds = [];
      // 根据当前roleId获取所拥有的菜单和操作权限
      getMenuOperatesByRoleId(this.rowData.id)
        .then(res => {
          if (res && res.array.length > 0) {
            const menuList = buildMenu(res.array);
            const map = {
              title: 'name',
              children: 'children'
            };
            this.menuOperateList = convertTree(menuList, map, false);
            console.log(`menuOperateList after convert:`, this.menuOperateList);
          }
        })
        .finally(() => {
          this.modalMenu = true;
        });
    },
    handleChange(checkedArr, currentNode) {
      const selectedNodes = this.$refs.menuTree.getCheckedAndIndeterminateNodes();
      const menuIds = [];
      const operationIds = [];
      selectedNodes.forEach(node => {
        if (node.type === 'OPERATION') {
          operationIds.push(node.operationId);
        } else {
          menuIds.push(node.id);
        }
      });
      this.selectedIds = menuIds;
      this.selectedOperationIds = operationIds;
      console.log('menuIds:', menuIds);
      console.log('selectedOperationIds:', operationIds);
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
    renderContent(h, { root, node, data }) {
      if (data.children) {
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
