<template>
<div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
      search-place="top" size="small"
      v-model="tableData"
      :loading="loading"
      :columns="columns"
      @on-delete="handleDelete"
      @on-view="handleView"
      @on-edit="handleEdit"
      @on-relation="handleMenu"
      >
        <div slot="operations">
          <Button @click="handleAdd" type="success" style="margin-right: 5px"><Icon type="md-add"/>新增</Button>
          <Button @click="handleDelete" type="error" style="margin-right: 5px"><Icon type="md-close"/>删除</Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
            <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </Row>
      </div>
    </Card>

    <!-- 修改模态框 -->
     <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleAddOrEditOk('formValidate')"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>角色管理</span>
        </p>
       <div class="modal-content">
         <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
            <FormItem label="角色名称" prop="name">
                <Input v-model="rowData.name" placeholder="请输入角色名称"/>
            </FormItem>
            <FormItem label="角色状态" prop="status">
                <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                    <Radio label="AVAILABLE">{{getDictByName('status','AVAILABLE')}}</Radio>
                    <Radio label="UNAVAILABLE">{{getDictByName('status','UNAVAILABLE')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="角色描述" prop="roleDesc">
                <Input v-model="rowData.roleDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述" />
            </FormItem>
        </Form>
       </div>
    </Modal>

    <!-- 添加模态框 -->
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
                      <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                          <Radio label="AVAILABLE">{{getDictByName('status','AVAILABLE')}}</Radio>
                          <Radio label="UNAVAILABLE">{{getDictByName('status','UNAVAILABLE')}}</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem label="角色描述" prop="roleDesc">
                      <Input v-model="rowData.roleDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述" />
                  </FormItem>
              </Form>
            </TabPane>
            <TabPane label="权限管理" name="menuAdd" :disabled="isDisable">
              <Tree :data="menuList" :render="renderContent" show-checkbox multiple></Tree>
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

    <!-- 管理权限 -->
    <Modal
        v-model="modalMenu"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleMenuOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>管理权限</span>
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
        { title: '角色状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const str = row.status == 'AVAILABLE' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
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
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      modalEdit: false,
      modalAdd: false,
      loading: true,
      loadingBtn: true,
      rowData: {
        name: '',
        status: '',
        roleDesc: '',
        createBy: '',
        createAt: '',
        menuids: ''
      },
      modalMenu: false,
      // 待翻译字典对象信息
      translateDicts: {},
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
        status: [
            { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    
  },
  mounted() {
    this.getTableData();
    this.getMenuList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.chirldren) {
        return (
          <span
            style={{ display: 'inline-block', width: '100%', fontSize: '14px' }}
          >
            <span>
            </span>
            <span>{data.meta.title}</span>
          </span>
        );
      } else {
        return (
          <span
            style={{ display: 'inline-block', width: '100%', fontSize: '14px' }}
          >
            <span>
            </span>
            <span>{data.meta.title}</span>
          </span>
        );
      }
    },
    handleView(params) {
      this.$Modal.info({
        title: '角色管理详情',
        content: `角色名称: ${this.tableData[params.row.initRowIndex].name}<br>
          角色状态: `+this.getDictByName('status', this.tableData[params.row.initRowIndex].status)+`<br>
          角色描述: ${this.tableData[params.row.initRowIndex].roleDesc}<br>
          创建人: ${this.tableData[params.row.initRowIndex].createBy}<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}`
      });
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求
      this.$http.request({
        url: '/ims-role/'+ row.id,
        method: 'delete',
        data: this.rowData
      }).then(res => {
        this.loadingBtn = false;
        this.modalEdit= false;
        this.$Message.info('删除成功!');
        // 刷新表格数据
        this.getTableData();
      });
    },
    handleEdit(params) {
      console.log(params);
      const { row } = params;
      this.rowData = Object.assign({}, row);
      // 测试先写死
      this.rowData.menuids='11,12,13,14';
      this.rowData = _.merge({}, this.rowData, row);
      // 将status由number变为string(否则单选框无法正常显示)
      // this.rowData.status = row.status + '';
      this.modalEdit = true;
    },
    handleAddOrEditOk(name) {
       this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.rowData.id == undefined) {
              // 发送axios请求
              this.$http.request({
                url: '/ims-role/',
                method: 'post',
                data: this.rowData
              }).then(res => {
                this.loadingBtn = false;
                this.modalEdit= false;
                this.$Message.info('保存成功!');
                this.step = 'menuAdd';
                this.isDisable = false;
                this.isCreated = true;
              });
            } else {
              // 发送axios请求
              this.$http.request({
                url: '/ims-role/'+ this.rowData.id,
                method: 'put',
                data: this.rowData
              }).then(res => {
                this.loadingBtn = false;
                this.modalEdit= false;
                this.$Message.info('更新成功!');
                // 清空rowData对象
                this.resetRowData();
                // 刷新表格数据
                this.getTableData();
              });
            }
          } else {
              this.$Message.error('提交失败!');
          }
      });
    },
    handleMenu(params) {
      console.log(params);
      const { row } = params;
      this.rowData = Object.assign({}, row);
      // 测试先写死
      this.rowData.menuids='11,12,13,14';
      // 反选中已有的权限
      this.checkMenuByIds();
      this.modalMenu = true;
    },
    handleChange(checkedArr) {
      console.log('checkedArr: ', checkedArr);
      // 循环执行所有选中的节点链,找到他们的id以及他们父级id，父级的父级id
      let result = [];
      checkedArr.forEach(item => {
         // 递归寻找父级
         result.push(...this.findParent(item));
      });
      this.selectedIds=dedupe(result);
      console.log('result: ', result);
      console.log('uniq result: ', this.selectedIds);
    },
    findParent(item) {
      let result=[];
      let findParentIds= (node) => {
        result.push(node.id);
        if (node && node.parentid) {
          let parent= this.originMenuList.find(o => o.id==node.parentid);
          findParentIds(parent);
        };
      };
      findParentIds(item);
      console.log('result from parent:', result);
      return result;
    },
    checkMenuByIds() {
      const menuids= this.rowData.menuids.split(',');
      console.log('menuids: ', menuids);
      setTreeNodeChecked(this.menuList, menuids);
      console.log('this.menuList selected:', this.menuList);
    },
    handleMenuOk() {
      this.loadingBtn = true;
      this.modalAdd = false;
      this.modalMenu = false;
      setTimeout(() => {
        this.$Message.info('保存成功');
        // 模态框消失再切换tab选项卡的属性
        this.tabOperation.tabSelected = 'roleAdd';
        this.tabOperation.menuDisabled = true;
        this.tabOperation.roleDisabled = false;
      }, 1000);

      getRelationMenu(this.rowData.id).then(res => {
        if (res && res.array.length > 0) {
          console.log('getRelationMenu: ', buildMenu(res.array, 'parentid', true));
          this.relationMenuList = buildMenu(res.array, 'parentid', true);
        }
      });
      // 分发action动态修改权限 TODO:待测试
      // this.$store.dispatch('changePermission').then(res => {
      //   this.$router.addRoutes(this.$store.getters.getActualRouter);
      //   // 刷新当前路由
      //   this.reload();
      // });
    },
    handleCancel() {
      this.$Message.info('取消成功');
    },
    handleAdd() {
      this.rowData = {};
      this.modalAdd = true;
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable= true;
      this.step='addRole';
      // 清空rowData对象
      this.resetRowData();
      // 刷新表格数据
      this.getTableData();
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    changeRadio(selectItem) {
      console.log('选择按钮的值:'+`${selectItem}`);
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
      this.rowData = {
        id: 0,
        name: '',
        status: '',
        roleDesc: '',
        createBy: '',
        createAt: ''
      };
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
          const menuList= buildMenu(res.array);
          const map= {
             title: 'name',
             children: 'children'
          };
          this.menuList = convertTree(menuList, map, true);
          this.originMenuList= res.array;// 保留一份元数据供后续处理
          console.log('after convert: ', this.menuList);
        }
      });
    },
    // 获取所有要翻译字典信息
    getAllDicts() {
      // 只初始化一次
      if (JSON.stringify(this.translateDicts) == '{}') {
          console.log('加载字典:::'+JSON.stringify(this.translateDicts));
          this.translateDicts.status = {
            'INITIAL': '初始化',
            'AVAILABLE': '可用',
            'UNAVAILABLE': '不可用',
            'LOCK': '锁定，暂不可用',
            'DELETE': '删除，永不可用',
            'UNKNOWN': '未知'
          };
      }
    },
    /**
     * 翻译字典
     * fieldName 需要翻译的字段名称，value 需要翻译的字段值
     */
    getDictByName(fieldName, value) {
        this.getAllDicts();
        var translateDictName = '';// 需要翻译字典名称
        // 判断字段名称存在字典对象  并且值也存在,则获取翻译名称
        if (this.translateDicts.hasOwnProperty(fieldName) && this.translateDicts[fieldName].hasOwnProperty(value)) {
            translateDictName = this.translateDicts[fieldName][value];
        }
        return translateDictName == '' ? value : translateDictName;
    }
  }
};
</script>

<style>
</style>
