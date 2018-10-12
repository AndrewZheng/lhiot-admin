<template>
<div class="m-menu">
  <Row :gutter="24" type="flex" align="top" justify="space-between">
      <i-col span="4" order="1">
        <Tree :data="menuList" :render="renderContent"></Tree>
      </i-col>
      <i-col span="20" order="3">
        <Card>
          <tables ref="tables" editable searchable
          search-place="top" size="small"
          v-model="tableData"
          :loading="loading"
          :columns="columns"
          @on-delete="handleDelete"
          @on-view="handleView"
          @on-edit="handleEdit" />
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
                <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
            </Row>
          </div>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        </Card>
      </i-col>
  </Row>

  <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>用户信息管理</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">姓名</i-col>
          <i-col span="8"><Input v-model="rowData.name" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">年龄</i-col>
          <i-col span="8"> <Input v-model="rowData.age" placeholder="" clearable /></i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">性别</i-col>
          <i-col span="8">
            <RadioGroup v-model="rowData.sex" @on-change="changeSex">
                <Radio label="1">
                    <span>男</span>
                </Radio>
                <Radio label="0">
                    <span>女</span>
                </Radio>
            </RadioGroup>
          </i-col>
         </Row>
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="2">邮箱</i-col>
          <i-col span="12"> <Input v-model="rowData.email" placeholder="" clearable /></i-col>
         </Row>
       </div>
    </Modal>
</div>
</template>

<script type='text/ecmascript-6'>
import { getTableData, getMenuList } from '@/api/data';
import { buildMenu } from '@/libs/util';
import Tables from '_c/tables';
import CommonIcon from '_c/common-icon';

export default {
  name: 'menu_pages',
  components: {
    Tables,
    CommonIcon
  },
  data() {
    return {
      menuList: [],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
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
        { title: '姓名', key: 'name', sortable: true },
        { title: '年龄', key: 'age', sortable: true, maxWidth: 100 },
        {
          title: '性别',
          key: 'sex',
          sortable: true,
          maxWidth: 100,
          render: (h, params, vm) => {
            const { row, index, column } = params;
            const str = row.sex == '1' ? '男' : '女';
            return <span>{str}</span>;
          }
        },
        { title: '邮箱', key: 'email', editable: true },
        { title: '创建时间', key: 'createTime', sortable: true },
        {
          title: '操作',
          key: 'handle',
          options: ['view', 'edit', 'delete'],
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
        age: 0,
        sex: 0,
        email: '',
        createTime: ''
      }
    };
  },
  mounted() {
    this.getTableData();
    // 获取系统所有的菜单列表
    getMenuList().then(res => {
      if (res && res.array.length > 0) {
        console.log('menuList from mock: ', res.array);
        console.log('buildMenu: ', buildMenu(res.array));
        this.menuList = buildMenu(res.array, 'parentid', false);
      }
    });
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.children) {
        return (
          <span
            style={{ display: 'inline-block', width: '100%', fontSize: '14px' }}
          >
            <span>
              <CommonIcon type='ios-folder' class="mr10" />
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
              <CommonIcon type={data.meta.icon} class="mr10" />
            </span>
            <span>{data.meta.title}</span>
          </span>
        );
      }
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: 'appended node',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    handleView(params) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name: ${this.tableData[params.row.initRowIndex].name}<br>
          emial: ${this.tableData[params.row.initRowIndex].email}<br>
          createTime: ${this.tableData[params.row.initRowIndex].createTime}`
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
      this.getTableData();
    },
    changePageSize(pageSize) {
      // console.log(pageSize);
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      getTableData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.loading = false;
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
