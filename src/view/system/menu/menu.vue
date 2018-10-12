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
          @on-edit="handleEdit">
            <div slot="operations">
                <Button type="success" class="mr5">
                  <Icon type="md-add"/>
                  子菜单
                </Button>
                <Button type="success">
                  <Icon type="md-add"/>
                  父菜单
                </Button>
                <!-- <Button style="margin: 10px 0;" type="primary" @click="handleBtachDel">
                  <Icon type="md-trash"/>
                  删除
                </Button> -->
            </div>
          </tables>
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
        v-model="modalView"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-cancel="handleCancel">
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
              <i-col span="20">{{rowData.title}}</i-col>
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
       </div>
       <div slot="footer">
          <Button type="primary" @click="handleClose">关闭</Button>
       </div>
  </Modal>

  <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>编辑菜单</span>
        </p>
       <div class="modal-content">
         <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">类型</i-col>
              <i-col span="12"><Input v-model="menuType" placeholder=""  disabled /></i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10" >
              <i-col span="4">名称</i-col>
              <i-col span="12"><Input v-model="rowData.title" placeholder="" clearable /></i-col>
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
    </Modal>
</div>
</template>

<script type='text/ecmascript-6'>
import { getTableData, getMenuList, getMenuData } from '@/api/data';
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
        { title: '名称', key: 'title', sortable: true },
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
        { title: '排序', key: 'sort', editable: false },
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
      currentPid: 1,
      page: 1,
      pageSize: 10,
      total: 0,
      modalEdit: false,
      modalView: false,
      loading: true,
      loadingBtn: true,
      rowData: {
        'id': 0,
        'parentid': 0,
        'sort': 0,
        'code': '',
        'title': '',
        'type': ''
      }
    };
  },
  mounted() {
    this.getTableData(this.currentPid);
    // 获取系统所有的菜单列表
    getMenuList().then(res => {
      if (res && res.array.length > 0) {
        console.log('menuList from mock: ', res.array);
        console.log('buildMenu: ', buildMenu(res.array));
        this.menuList = buildMenu(res.array, 'parentid', false);
      }
    });
  },
  filters: {
    switchType(value) {
      if (!value) return;
      const str= value=='PARENT'? '父级菜单' : '子级菜单';
      return str;
    }
  },
  computed: {
    menuType() {
      const str =this.rowData.type=='PARENT'? '父级菜单' : '子级菜单';
      return str;
    }
  },
  methods: {
    renderContent(h, { root, node, data }) {
      const iconType=data.children? 'ios-folder': 'ios-paper';
      const isClick=data.children? 'pointer': 'auto';

      return (
        <div
          style={{ display: 'inline-block', width: '100%', fontSize: '14px', cursor: isClick }}
        >
          <span><CommonIcon type={iconType} class="mr10" /></span>
          <span onClick={() => this.handleClick({ root, node, data })}>{data.meta.title}</span>
        </div>
      );
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
    addChildren() {
      console.log('addChildren');
    },
    addParent() {
      console.log('addParent');
    },
    handleView(params) {
      console.log(params);
      const { row, index, column } = params;
      this.rowData = row;
      this.modalView = true;
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
    handleClose() {
      this.modalView= false;
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
      this.getTableData(this.currentPid);
    },
    changePageSize(pageSize) {
      // console.log(pageSize);
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData(this.currentPid);
    },
    handleClick({ root, node, data }) {
       // 展开当前节点-先Pending过后handle
       console.log('node: ', node);
       if (typeof node.expand === 'undefined') {
         this.$set(node, 'expend', true);
       } else {
         node.expand= !node.expand;
       }
       // 获取新数据
       this.getTableData(data.id);
    },
    getTableData(id) {
      this.currentPid=id;
      console.log('currentPid：', id);
      getMenuData({
        page: this.page,
        rows: this.pageSize,
        parentid: id
      }).then(res => {
        console.log(res);
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
