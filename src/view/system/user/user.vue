<template>
  <div class="m-user">
      <Card>
      <tables ref="tables" editable searchable
      search-place="top" size="small"
      v-model="tableData"
      :loading="loading"
      :columns="columns"
      @on-delete="handleDelete"
      @on-view="handleView"
      @on-edit="handleEdit"
      @on-relation="handleRole"
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
            <span>用户管理</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">姓名</i-col>
          <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">账号</i-col>
          <i-col span="8"><Input v-model="rowData.account" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">电话</i-col>
          <i-col span="8"><Input v-model="rowData.tel" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">用户头像</i-col>
          <i-col span="8"><img src=""/></i-col>
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
          <i-col span="4">创建时间</i-col>
          <i-col span="8"><Input v-model="rowData.createAt" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">最后登录时间</i-col>
          <i-col span="8"><Input v-model="rowData.lastLoginAt" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="4">备注</i-col>
          <i-col span="8"><Input v-model="rowData.remark" placeholder="" clearable /></i-col>
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
          <TabPane label="创建用户" name="userAdd" :disabled="tabOperation.userDisabled">
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">姓名</i-col>
                <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">账号</i-col>
                <i-col span="8"><Input v-model="rowData.account" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">电话</i-col>
                <i-col span="8"><Input v-model="rowData.tel" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">用户头像</i-col>
                <i-col span="8"><img src=""/></i-col>
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
                <i-col span="4">创建时间</i-col>
                <i-col span="8"><Input v-model="rowData.createAt" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">最后登录时间</i-col>
                <i-col span="8"><Input v-model="rowData.lastLoginAt" placeholder="" clearable /></i-col>
              </Row>
              <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
                <i-col span="4">备注</i-col>
                <i-col span="8"><Input v-model="rowData.remark" placeholder="" clearable /></i-col>
              </Row>
          </TabPane>
          <TabPane label="角色管理" name="roleAdd" :disabled="tabOperation.roleDisabled">
            角色管理
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <div v-if="tabOperation.tabSelected==='userAdd'">
            <Button type="primary" @click="handleAddNext">下一步</Button>
        </div>
        <div  v-else-if="tabOperation.tabSelected==='roleAdd'">
            <Button type="primary" @click="handleRoleOk">完成</Button>
        </div>
      </div>
    </Modal>

     <!-- 角色权限 -->
    <Modal
        v-model="modalRole"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleRoleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>角色权限</span>
        </p>
       <div class="modal-content">
          角色管理
      </div>
    </Modal>

  </div>
</template>

<script type='text/ecmascript-6'>
import Tables from '_c/tables';
import { getUserData } from '@/api/data';

export default {
  name: 'user_page',
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
        { title: '姓名', key: 'name', sortable: true },
        { title: '账号', key: 'account', sortable: true },
        { title: '电话', key: 'tel', sortable: true },
        { title: '用户头像url',
          key: 'avatarUrl',
          sortable: true,
          render: (h, params, vm) => {
            const { row, index, column } = params;
            // const str = row.status == '1' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
            const str = <img src={row.avatarUrl} height="80px" width="150px"></img>;
            return <div>{str}</div>;
          }
        },
        { title: '用户状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row, index, column } = params;
            const str = row.status == '1' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
            return <div>{str}</div>;
          }
        },
        { title: '创建时间', key: 'createAt', sortable: true },
        { title: '最后登录时间', key: 'lastLoginAt', sortable: true },
        { title: '备注', key: 'remark', sortable: true },
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
      // 待翻译字典对象信息
      translateDicts: {},
      modalRole: false,
      tabOperation: {
        tabSelected: 'userAdd',
        roleDisabled: true,
        userDisabled: false
      }
    };
  },
  created() {},
  mounted() {
    this.getUserData();
  },
  computed: {},
  filters: {},
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
        title: '用户管理详情',
        content: `姓名: ${this.tableData[params.row.initRowIndex].name}<br>
          账号: ${this.tableData[params.row.initRowIndex].account}<br>
          电话: ${this.tableData[params.row.initRowIndex].tel}<br>
          头像: <img src=${this.tableData[params.row.initRowIndex].avatarUrl}/><br>
          角色状态: `+this.getDictByName('status', this.tableData[params.row.initRowIndex].status)+`<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}<br>
          最后登录时间: ${this.tableData[params.row.initRowIndex].lastLoginAt}<br>
          备注: ${this.tableData[params.row.initRowIndex].remark}`
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
    handleCancel() {
      this.$Message.info('取消成功');
    },
    handleAdd() {
      this.rowData = {};
      this.modalAdd = true;
    },
    handleAddNext() {
      this.loadingBtn = false;
      this.tabOperation.tabSelected = 'roleAdd';
      this.tabOperation.roleDisabled = false;
      this.tabOperation.userDisabled = true;
      // setTimeout(() => {
      //   this.$Message.info('保存成功');
      // }, 2000);
      // 发送axios请求
      // TODO字段验证
    },
    handleRole(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalRole = true;
    },
    handleRoleOk() {
      this.loadingBtn = true;
      this.modalAdd = false;
      this.modalRole = false;
      setTimeout(() => {
        this.$Message.info('保存成功');
        // 模态框消失再切换tab选项卡的属性
        this.tabOperation.tabSelected = 'userAdd';
        this.tabOperation.roleDisabled = true;
        this.tabOperation.userDisabled = false;
      }, 1000);
      // 发送axios请求
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
    getUserData() {
      getUserData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.loading = false;
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
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
