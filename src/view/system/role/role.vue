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
          <Button @click="handleDeleteSome" type="error" style="margin-right: 5px"><Icon type="md-close"/>删除</Button>
          <!-- <Button style="margin: 10px 0;" type="primary" @click="handleBtachDel"><Icon type="md-trash"/>删除</Button> -->
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
        @on-ok="handleEditOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>角色管理</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">角色名称</i-col>
          <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">角色状态</i-col>
          <i-col span="8">
            <RadioGroup v-model="rowData.status" @on-change="changeSex">
                <Radio label="1">
                    <span>{{getDictByName('status',1)}}</span>
                </Radio>
                <Radio label="0">
                    <span>{{getDictByName('status',0)}}</span>
                </Radio>
            </RadioGroup>
          </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">角色描述</i-col>
          <i-col span="8"><Input v-model="rowData.roleDesc" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">创建人</i-col>
          <i-col span="8"><Input v-model="rowData.createBy" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">创建时间</i-col>
          <i-col span="8"><Input v-model="rowData.createAt" placeholder="" clearable /></i-col>
         </Row>
       </div>
    </Modal>

    <!-- 添加模态框 -->
     <Modal
        v-model="modalAdd"
        :loading="loadingBtn"
        :mask-closable="false">
       <div class="modal-content">
          <Tabs :value="tabOperation.tabSelected">
            <TabPane label="创建角色" name="roleAdd" :disabled="tabOperation.roleDisabled">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">角色名称 </i-col>
                <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">角色状态</i-col>
                <i-col span="8">
                  <RadioGroup v-model="rowData.status" @on-change="changeSex">
                      <Radio label="1">
                          <span>{{getDictByName('status',1)}}</span>
                      </Radio>
                      <Radio label="0">
                          <span>{{getDictByName('status',0)}}</span>
                      </Radio>
                  </RadioGroup>
                </i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">角色描述</i-col>
                <i-col span="8"><Input v-model="rowData.roleDesc" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">创建人</i-col>
                <i-col span="8"><Input v-model="rowData.createBy" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">创建时间</i-col>
                <i-col span="8"><Input v-model="rowData.createAt" placeholder="" clearable /></i-col>
              </Row>
            </TabPane>
            <TabPane label="权限管理" name="menuAdd" :disabled="tabOperation.menuDisabled">
              <Tree :data="menuList" :render="renderContent" show-checkbox multiple></Tree>
            </TabPane>
          </Tabs>
       </div>
        <div slot="footer">
          <div v-if="tabOperation.tabSelected==='roleAdd'">
              <Button type="primary" @click="handleAddNext">下一步</Button>
          </div>
          <div  v-else-if="tabOperation.tabSelected==='menuAdd'">
              <Button type="primary" @click="handleMenuOk">完成</Button>
          </div>
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
         <Tree :data="menuList" :render="renderContent" show-checkbox multiple></Tree>
       </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables';
import { getRoleData } from '@/api/data';
import { getMenuList } from '@/api/system';
import { buildMenu } from '@/libs/util';

export default {
  name: 'role_page',
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        // 选择框
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
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
        { title: '角色名称', key: 'name', sortable: true },
        { title: '角色状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row, index, column } = params;
            const str = row.status == '1' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
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
        createAt: ''
      },
      modalMenu: false,
      // 待翻译字典对象信息
      translateDicts: {},
      menuList: [],
      tabOperation: {
        tabSelected: 'roleAdd',
        menuDisabled: true,
        roleDisabled: false
      }
    };
  },
  computed: {
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.chirenderContentldren) {
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
      console.log(params);
      // 发送axios请求
    },
    handleDeleteSome() {
      console.log('删除多条记录');
      // TODO 删除多条记录
    },
    handleEdit(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalEdit = true;
    },
    handleEditOk() {
      setTimeout(() => {
        this.modalEdit = false;
        this.$Message.info('保存成功');
      }, 2000);
      // 发送axios请求
    },
    handleMenu(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalMenu = true;
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

      // 发送axios请求
    },
    handleCancel() {
      this.$Message.info('取消成功');
    },
    handleAdd() {
      this.rowData = {};
      this.modalAdd = true;
    },
    handleAddNext() {
      this.loadingBtn = false;
      this.tabOperation.tabSelected = 'menuAdd';
      this.tabOperation.menuDisabled = false;
      this.tabOperation.roleDisabled = true;
      // setTimeout(() => {
      //   this.$Message.info('保存成功');
      // }, 2000);
      // 发送axios请求
      // TODO字段验证
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    changeSex(selectItem) {
      console.log('选择按钮的值:'+`${selectItem}`);
    },
    changePage(currentPage) {
      // console.log(currentPage);
      this.page = currentPage;
      this.getRoleData();
    },
    changePageSize(pageSize) {
      // console.log(pageSize);
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getRoleData();
    },
    getRoleData() {
      getRoleData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.loading = false;
      });
    },
    getMenuList() {
       // 获取系统所有的菜单列表
      getMenuList().then(res => {
        if (res && res.array.length > 0) {
          console.log('buildMenu: ', buildMenu(res.array, 'parentid', true));
          this.menuList = buildMenu(res.array, 'parentid', true);
        }
      });
    },
    // 获取所有要翻译字典信息
    getAllDicts() {
      // 只初始化一次
      if (JSON.stringify(this.translateDicts) == '{}') {
          console.log('加载字典:::'+JSON.stringify(this.translateDicts));
          this.translateDicts.status = {
              '1': '可用',
              '0': '不可用'
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
  },
  mounted() {
    this.getRoleData();
    this.getMenuList();
  }
};
</script>

<style>
</style>
