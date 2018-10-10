<template>
<div class="m-role">
    <Card>
      <role ref="tables" editable searchable
      search-place="top" size="small"
      v-model="tableData"
      :loading="loading"
      :columns="columns"
      @on-delete="handleDelete"
      @on-view="handleView"
      @on-edit="handleEdit"
      @on-role="handleRole" />
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
            <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </Row>
      </div>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
     <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>角色管理</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">角色名称</i-col>
          <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">角色状态</i-col>
          <i-col span="8">
            <RadioGroup v-model="rowData.status" @on-change="changeSex">
                <Radio label="1">
                    <span>可用</span>
                </Radio>
                <Radio label="0">
                    <span>不可用</span>
                </Radio>
            </RadioGroup>
          </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">角色描述</i-col>
          <i-col span="8"><Input v-model="rowData.roleDesc" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">创建人</i-col>
          <i-col span="8"><Input v-model="rowData.createBy" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">创建时间</i-col>
          <i-col span="8"><Input v-model="rowData.createAt" placeholder="" clearable /></i-col>
         </Row>
       </div>
    </Modal>

    <!-- 管理权限 -->
    <Modal
        v-model="modalRole"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>管理权限</span>
        </p>
        {{hufan}}
       <div class="modal-content">
          <Tree :data="menus" show-checkbox multiple></Tree>
       </div>
    </Modal>
  </div>
</template>

<script>
import Role from '_c/role';
import { getRoleData, getMenuData } from '@/api/data';
export default {
  name: 'role_page',
  components: {
    Role
  },
  data() {
    return {
      columns: [
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
            const str = row.status == '1' ? '可用' : '不可用';
            return <span>{str}</span>;
          }},
        { title: '角色描述', key: 'roleDesc', sortable: true },
        { title: '创建人', key: 'createBy', sortable: true },
        { title: '创建时间', key: 'createAt', sortable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['view', 'edit', 'role', 'delete'],
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
      loading: true,
      loadingBtn: true,
      rowData: {
        name: '',
        status: '',
        roleDesc: '',
        createBy: '',
        createAt: ''
      },
      modalRole: false,
      menus: [
        {
            title: 'parent 1',
            expand: true,
            selected: true,
            children: [
                {
                    title: 'parent 1-1',
                    expand: true,
                    children: [
                        {
                            title: 'leaf 1-1-1',
                            disabled: true
                        },
                        {
                            title: 'leaf 1-1-2'
                        }
                    ]
                },
                {
                    title: 'parent 1-2',
                    expand: true,
                    children: [
                        {
                            title: 'leaf 1-2-1',
                            checked: true
                        },
                        {
                            title: 'leaf 1-2-1'
                        }
                    ]
                }
            ]
        }
    ],
    hufan: {
        id: '',
        title: '',
        pId: '',
        expand: true,
        selected: false
      }
    };
  },
  computed: {},
  methods: {
    handleView(params) {
      this.$Modal.info({
        title: 'Role Info',
        content: `name: ${this.tableData[params.row.initRowIndex].name}<br>
          status: ${this.tableData[params.row.initRowIndex].status}<br>
          roleDesc: ${this.tableData[params.row.initRowIndex].roleDesc}<br>
          createBy: ${this.tableData[params.row.initRowIndex].createBy}<br>
          createAt: ${this.tableData[params.row.initRowIndex].createAt}`
      });
    },
    handleDelete(params) {
      console.log(params);
      // 发送axios请求
    },
    handleEdit(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalEdit = true;
    },
    handleRole(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalRole = true;
    },
    handleOk() {
      setTimeout(() => {
        this.modalEdit = false;
        this.$Message.info('保存成功');
      }, 2000);
      // 发送axios请求
    },
    handleCancel() {
      this.$Message.info('取消成功');
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    changeSex(selectItem) {
      console.log(`${selectItem}`);
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
    getMenuData() {
       getMenuData().then(res => {
        this.hufan = res.data;
      });
    }
  },
  mounted() {
    this.getRoleData();
    this.getMenuData();
  }
};
</script>

<style>
</style>
