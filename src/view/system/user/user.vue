<template>
  <div class="m-user">
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
      @on-relation="handleRole"
      >
        <div slot="operations">
          <Button @click="handleAdd" type="success" class="mr5">
            <Icon type="md-add"/> 新增</Button>
          <Button @click="handleDeleteBatch" type="error" class="mr5">
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
        @on-cancel="handleCancel"
        ref="formValidate" :model="rowData" :rules="ruleValidate" fullscreen>
        <p slot="header">
            <span>{{rowData.id==0?'创建用户':'编辑用户'}}</span>
        </p>
       <div class="modal-content">
         <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名" prop="name">
                  <Input v-model="rowData.name" placeholder="请输入姓名"/>
              </FormItem>
              <FormItem label="账号" prop="account">
                  <Input v-model="rowData.account" placeholder="请输入账号"/>
              </FormItem>
              <FormItem label="密码" prop="password">
                  <Input v-model="rowData.password" type="password"/>
              </FormItem>
              <FormItem label="确认密码" prop="passwdCheck">
                  <Input v-model="rowData.passwdCheck" type="password"/>
              </FormItem>
              <FormItem label="电话" prop="tel">
                  <Input v-model="rowData.tel" placeholder="请输入电话号码"/>
              </FormItem>
              <FormItem label="用户头像" prop="avatarUrl">
                  <Button @click="imagecropperShow=true" class="addImage">
                        <Icon type="ios-camera" size="20"></Icon>
                  </Button>
                  <img :src="image" width='80px' height='80px'/>
              </FormItem>
              <FormItem label="用户状态" prop="status">
                  <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                    <Radio label="AVAILABLE">{{this.getDictByName('status','AVAILABLE')}}</Radio>
                    <Radio label="UNAVAILABLE">{{this.getDictByName('status','UNAVAILABLE')}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="备注" prop="remark">
                  <Input v-model="rowData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
              </FormItem>
              <FormItem label="富文本编辑器测试">
                  <tinymce-editor id="tinymce" ref="editor" v-model="content" :height="300"/>
              </FormItem>
            </Form>
       </div>
    </Modal>

    <!-- 多功能添加模态框(创建用户/关联角色) -->
    <Modal
      v-model="modalAdd"
      :loading="loadingBtn"
      :mask-closable="false">
      <div class="modal-content">
        <Tabs size="small" v-model="step">
          <!-- :value="tabOperation.tabSelected" -->
          <TabPane label="创建用户" name="userAdd">
            <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名" prop="name">
                  <Input v-model="rowData.name" placeholder="请输入姓名"/>
              </FormItem>
              <FormItem label="账号" prop="account">
                  <Input v-model="rowData.account" placeholder="请输入账号"/>
              </FormItem>
              <FormItem label="密码" prop="password">
                  <Input v-model="rowData.password" type="password"/>
              </FormItem>
              <FormItem label="确认密码" prop="passwdCheck">
                  <Input v-model="rowData.passwdCheck" type="password"/>
              </FormItem>
              <FormItem label="电话" prop="tel">
                  <Input v-model="rowData.tel" placeholder="请输入电话号码"/>
              </FormItem>
              <FormItem label="用户头像" prop="avatarUrl">
                  <Button  @click="imagecropperShow=true" class="addImage">
                        <Icon type="ios-camera" size="20"></Icon>
                  </Button>
                  <div v-if="imageVisible" style="display: inline-block">
                      <img :src="image" width='80px' height='80px'/>
                  </div>
              </FormItem>
              <FormItem label="用户状态" prop="status">
                  <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                    <Radio label="AVAILABLE">{{this.getDictByName('status','AVAILABLE')}}</Radio>
                    <Radio label="UNAVAILABLE">{{this.getDictByName('status','UNAVAILABLE')}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="备注" prop="remark">
                  <Input v-model="rowData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="关联角色" name="roleAdd" :disabled="isDisable">
            <Transfer
            :data="roleData"
            :target-keys="targetKeys"
            :render-format="render1"
            :titles="titles"
            @on-change="handleChange"></Transfer>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer" v-if="step=='userAdd' && !isCreated">
        <Button type="primary" @click="handleAddOrEditOk('formValidate')">下一步</Button>
      </div>
      <div slot="footer" v-else-if="step=='roleAdd'">
        <Button type="primary" @click="handleRoleOk">保存</Button>
       </div>
      <div slot="footer" v-else>
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
       </div>
    </Modal>

     <!-- 关联角色 -->
    <Modal
        v-model="modalRole"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleRoleOk"
        @on-cancel="handleCancel">
        <p slot="header">
            <span>关联角色</span>
        </p>
       <div class="modal-content">
         <Transfer
            :data="roleData"
            :target-keys="targetKeys"
            :render-format="render1"
            :titles="titles"
            @on-change="handleChange">
          </Transfer>
      </div>
    </Modal>

    <!-- 头像上传组件 -->
    <image-cropper
      v-show="imagecropperShow"
      :width="70"
      :height="70"
      :key="imagecropperKey"
      url="https://resource.food-see.com/v1/upload/product_image"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess" />

  </div>
</template>

<script type='text/ecmascript-6'>
import Tables from '_c/tables';
import { getUserData, getRoleList, getRelationRoles } from '@/api/system';
import ImageCropper from '_c/ImageCropper';
import _ from 'lodash';
import tinymceEditor from '_c/tinymce-editor';

export default {
  name: 'user_page',
  components: {
    Tables,
    ImageCropper,
    tinymceEditor
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入您的密码'));
      } else if (value !== this.rowData.password) {
        callback(new Error('两次输入密码不匹配!'));
      } else {
        callback();
      }
    };
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
        { title: '姓名', key: 'name', sortable: true, maxWidth: 80 },
        { title: '账号', key: 'account', sortable: true },
        { title: '电话', key: 'tel', sortable: true },
        {
          title: '用户头像url',
          key: 'avatarUrl',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.avatarUrl} height="60" width="60" />;
            return <div>{str}</div>;
          }
        },
        {
          title: '用户状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const str =
              row.status == 'AVAILABLE' ? (
                <tag color="success">
                  {this.getDictByName('status', row.status)}
                </tag>
              ) : (
                <tag color="error">
                  {this.getDictByName('status', row.status)}
                </tag>
              );
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
        id: '',
        name: '',
        account: '',
        password: '',
        passwdCheck: '',
        tel: '',
        avatarUrl: '',
        status: '',
        createAt: '',
        lastLoginAt: '',
        remark: ''
      },
      modalRole: false,
      step: 'userAdd',
      isDisable: true,
      isCreated: false,
      // 图片上传数据
      imageVisible: false,
      // 双栏穿梭选择框数据
      roleData: this.getRoleData(),
      targetKeys: [],
      titles: ['未关联角色', '已关联角色'],
      // 表单验证
      ruleValidate: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        tel: [
          {
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '电话号码不正确',
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      },
      // 头像上传
      imagecropperShow: false,
      imagecropperKey: 0,
      image: '',
      ids: [],
      content: '请输入内容'
    };
  },
  created() {},
  mounted() {
    this.getTableData();
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
        title: '用户详情',
        content:
          `姓名: ${this.tableData[params.row.initRowIndex].name}<br>
          账号: ${this.tableData[params.row.initRowIndex].account}<br>
          电话: ${this.tableData[params.row.initRowIndex].tel}<br>
          头像:<img src="` +
          this.tableData[params.row.initRowIndex].avatarUrl +
          `" width="80px" height="80px"/><br>
          用户状态: ` +
          this.getDictByName(
            'status',
            this.tableData[params.row.initRowIndex].status
          ) +
          `<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}<br>
          最后登录时间: ${
            this.tableData[params.row.initRowIndex].lastLoginAt
          }<br>
          备注: ${this.tableData[params.row.initRowIndex].remark}<br>
          关联角色：<Tag type="border">角色1</Tag><Tag type="border">角色2</Tag><Tag type="border">角色3</Tag>`
      });
      console.log(this.tableData[params.row.initRowIndex].avatarUrl);
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求
      this.$http
        .request({
          url: '/admin/batch/' + row.id,
          method: 'delete',
          data: this.rowData
        })
        .then(res => {
          this.loadingBtn = false;
          this.modalEdit = false;
          this.$Message.info('删除成功!');
          // 刷新表格数据
          this.getTableData();
        });
    },
    handleDeleteBatch() {
      if (this.ids.length != 0) {
        // 发送axios请求
        this.$http
          .request({
            url: '/admin/batch/' + this.ids,
            method: 'delete'
          })
          .then(res => {
            this.loadingBtn = false;
            this.modalEdit = false;
            this.$Message.info('删除成功!');
            // 刷新表格数据
            this.getTableData();
          });
      } else {
        this.$Message.error('请至少选择一行记录!');
      }
    },
    onSelectionChange(selection) {
      this.ids = selection.map(item => item.id.toString());
      console.log('选择变化,当前页选择ids:' + this.ids);
    },
    handleEdit(params) {
      console.log(params);
      const { row } = params;
      this.rowData = _.merge({}, this.rowData, row);
      this.rowData.passwdCheck = row.password;
      this.image = this.rowData.avatarUrl;
      this.modalEdit = true;
    },
    handleAddOrEditOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.rowData.id == undefined) {
            // 发送axios请求
            this.$http
              .request({
                url: '/admin/',
                method: 'post',
                data: this.rowData
              })
              .then(res => {
                this.loadingBtn = false;
                this.modalEdit = false;
                this.$Message.info('保存成功!');
                this.step = 'roleAdd';
                this.isDisable = false;
                this.isCreated = true;
              });
          } else {
            // 发送axios请求
            this.$http
              .request({
                url: '/admin/' + this.rowData.id,
                method: 'put',
                data: this.rowData
              })
              .then(res => {
                this.loadingBtn = false;
                this.modalEdit = false;
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
    handleCancel() {
      this.$Message.info('取消成功');
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable = true;
      this.step = 'addUser';
      // 清空rowData对象
      this.resetRowData();
      // 刷新表格数据
      this.getTableData();
    },
    handleAdd() {
      this.rowData = {};
      this.modalAdd = true;
    },
    handleRole(params) {
      console.log(params);
      const { row } = params;
      this.rowData = row;
      this.targetKeys = [];
      getRelationRoles(this.rowData.id).then(res => {
        if (res && res.length > 0) {
          console.log('relationRoleIds: ', this.getRelationRoleIds(res));
          this.targetKeys = this.getRelationRoleIds(res);
        }
      });
      this.modalRole = true;
    },
    handleRoleOk() {
      let roleIds = this.targetKeys.join(',');
      // 发送axios请求
      this.$http
        .request({
          url: '/admin/update/relation/' + this.rowData.id + '/' + roleIds,
          method: 'put'
        })
        .then(res => {
          this.loadingBtn = false;
          if (this.modalRole == true) {
            this.modalRole = false;
            this.targetKeys = [];
            this.$Message.info('修改成功!');
          } else if (this.modalAdd == true) {
            this.modalAdd = false;
            this.$Message.info('保存成功!');
            this.step = 'userAdd';
            this.isDisable = false;
            this.isCreated = true;
          }
        });
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
      this.page = currentPage;
      this.getTableData();
    },
    changePageSize(pageSize) {
      // 如果切换页数需要变为页码1
      this.page = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    resetRowData() {
      this.rowData = {
        id: '',
        name: '',
        account: '',
        password: '',
        passwdCheck: '',
        tel: '',
        avatarUrl: '',
        status: '',
        createAt: '',
        lastLoginAt: '',
        remark: ''
      };
    },
    getTableData() {
      getUserData({
        page: this.page,
        rows: this.pageSize
      }).then(res => {
        // this.tableData = res.data;
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 模拟双栏穿梭选择框数据
    getRoleData() {
      let role = [];
      getRoleList().then(res => {
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            role.push({
              key: res[i].id.toString(),
              label: res[i].name,
              description: res[i].roleDesc
              // disabled: Math.random() * 3 < 1
            });
          }
        }
      });
      return role;
    },
    getRelationRoleIds(res) {
      let relationRoles = [];
      for (let i = 0; i < res.length; i++) {
        relationRoles.push({
          key: res[i].id.toString(),
          label: res[i].name,
          description: res[i].roleDesc
        });
      }
      return relationRoles.map(item => item.key);
    },
    render1(item) {
      return item.label;
    },
    handleChange(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys);
      console.log(direction);
      console.log(moveKeys);
      this.targetKeys = newTargetKeys;
    },
    // 头像上传
    cropSuccess(resData) {
      console.log('resData: ', resData);
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.fileUrl;
      this.imageVisible = true;
    },
    close() {
      this.imagecropperShow = false;
    }
  },
  watch: {
    content(val, oldVal) {
      console.log(`new: ${val}, old: ${oldVal}`);
    }
  }
};
</script>
<style>
.addImage {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
