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
          <Button @click="handleDelete" type="error" style="margin-right: 5px"><Icon type="md-close"/>删除</Button>
          <!-- <Button style="margin: 10px 0;" type="primary" @click="handleBtachDel"><Icon type="md-trash"/>删除</Button> -->
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
            <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </Row>
      </div>
    </Card>

    <pan-thumb :image="image"/>

  <Button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">Change Avatar
  </Button>

  <image-cropper
    v-show="imagecropperShow"
    :width="300"
    :height="300"
    :key="imagecropperKey"
    url="https://httpbin.org/post"
    lang-type="en"
    @close="close"
    @crop-upload-success="cropSuccess"/>

    <!-- 修改模态框 -->
     <Modal
        v-model="modalEdit"
        :loading="loadingBtn"
        :mask-closable="false"
        @on-ok="handleAddOrEditOk('formValidate')"
        @on-cancel="handleCancel"
        ref="formValidate" :model="rowData" :rules="ruleValidate" >
        <p slot="header">
            <span>用户管理</span>
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
                  <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :default-file-list="defaultList"
                  :on-success="handleImageSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleImageFormatError"
                  :on-exceeded-size="handleImageMaxSize"
                  :before-upload="handleImageBeforeUpload"
                  multiple
                  type="drag"
                  action="//jsonplaceholder.typicode.com/posts/"
                  style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                  <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleImageView(item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleImageRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
              </FormItem>
              <FormItem label="用户状态" prop="status">
                  <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                    <Radio label="AVAILABLE">{{getDictByName('status','AVAILABLE')}}</Radio>
                    <Radio label="UNAVAILABLE">{{getDictByName('status','UNAVAILABLE')}}</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="备注" prop="remark">
                  <Input v-model="rowData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
              </FormItem>
            </Form>
       </div>
    </Modal>

    <!-- 添加模态框(创建用户/关联角色) -->
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
                  <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :default-file-list="defaultList"
                  :on-success="handleImageSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleImageFormatError"
                  :on-exceeded-size="handleImageMaxSize"
                  :before-upload="handleImageBeforeUpload"
                  multiple
                  type="drag"
                  action="//jsonplaceholder.typicode.com/posts/"
                  style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                  <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleImageView(item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleImageRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
              </FormItem>
              <FormItem label="用户状态" prop="status">
                  <RadioGroup v-model="rowData.status" @on-change="changeRadio">
                    <Radio label="AVAILABLE">{{getDictByName('status','AVAILABLE')}}</Radio>
                    <Radio label="UNAVAILABLE">{{getDictByName('status','UNAVAILABLE')}}</Radio>
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
         <Transfer
            :data="roleData"
            :target-keys="targetKeys"
            :render-format="render1"
            :titles="titles"
            @on-change="handleChange">
          </Transfer>
      </div>
    </Modal>
  </div>
</template>

<script type='text/ecmascript-6'>
import Tables from '_c/tables';
import { getUserData, getRoleList, getRelationRoles } from '@/api/system';
import ImageCropper from '_c/ImageCropper';
import PanThumb from '_c/PanThumb';
import _ from 'lodash';

export default {
  name: 'user_page',
  components: {
    Tables,
    ImageCropper,
    PanThumb
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
      // 表格数据
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
            const { row } = params;
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
            const { row } = params;
            // const str = row.status == '1' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
            const str = <img src={row.avatarUrl} height="80px" width="80px"></img>;
            return <div>{str}</div>;
          }
        },
        { title: '用户状态',
          key: 'status',
          sortable: true,
          render: (h, params, vm) => {
            const { row } = params;
            const str = row.status == 'AVAILABLE' ? <span style="color:green">{this.getDictByName('status', row.status)}</span> : <span style="color:red">{this.getDictByName('status', row.status)}</span>;
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
      // 待翻译字典对象信息
      translateDicts: {},
      modalRole: false,
      step: 'userAdd',
      isDisable: true,
      isCreated: false,
      // 图片上传数据
      defaultList: [
          {
              'name': 'a42bdcc1178e62b4694c830f028db5c0',
              'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
              'name': 'bc7521e033abdd1e92222d733590f104',
              'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      // 双栏穿梭选择框数据
      roleData: this.getRoleData(),
      targetKeys: [],
      titles: ['未关联角色', '已关联角色'],
      // 表单验证
      ruleValidate: {
        name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        account: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        passwdCheck: [
            { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        tel: [
            { required: true, message: '电话号码不能为空', trigger: 'blur' }
        ],
        status: [
            { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      },
      // 头像上传
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    };
  },
  created() {},
  mounted() {
    this.getTableData();
    this.uploadList = this.$refs.upload.fileList;
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
          头像:<img src="`+this.tableData[params.row.initRowIndex].avatarUrl+`" width="80px" height="80px"/><br>
          用户状态: `+this.getDictByName('status', this.tableData[params.row.initRowIndex].status)+`<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}<br>
          最后登录时间: ${this.tableData[params.row.initRowIndex].lastLoginAt}<br>
          备注: ${this.tableData[params.row.initRowIndex].remark}<br>
          关联角色：<Tag type="border">角色1</Tag><Tag type="border">角色2</Tag><Tag type="border">角色3</Tag>`
      });
      console.log(this.tableData[params.row.initRowIndex].avatarUrl);
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求
      this.$http.request({
        url: '/admin/batch/'+ row.id,
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
      this.rowData = _.merge({}, this.rowData, row);
      this.rowData.passwdCheck = row.password;
      this.modalEdit = true;
    },
    handleAddOrEditOk(name) {
       this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.rowData.id == undefined) {
              // 发送axios请求
              this.$http.request({
                url: '/admin/',
                method: 'post',
                data: this.rowData
              }).then(res => {
                this.loadingBtn = false;
                this.modalEdit= false;
                this.$Message.info('保存成功!');
                this.step = 'roleAdd';
                this.isDisable = false;
                this.isCreated = true;
              });
            } else {
              // 发送axios请求
              this.$http.request({
                url: '/admin/'+ this.rowData.id,
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
    handleCancel() {
      this.$Message.info('取消成功');
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable= true;
      this.step='addUser';
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
            console.log('relationRoleIds: ', this.getTargetKeys(res));
            this.targetKeys = this.getTargetKeys(res);
        }
      });

      this.modalRole = true;
    },
    handleRoleOk() {
      let roleIds = this.targetKeys.join(',');
      // 发送axios请求
      this.$http.request({
        url: '/admin/update/relation/'+ this.rowData.id + '/' + roleIds,
        method: 'put'
      }).then(res => {
        this.loadingBtn = false;
        if (this.modalRole == true) {
          this.modalRole= false;
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
      console.log('选择按钮的值:'+`${selectItem}`);
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
    getRoleData () {
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
    getTargetKeys (res) {
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
    render1 (item) {
        return item.label;
    },
    handleChange (newTargetKeys, direction, moveKeys) {
        console.log(newTargetKeys);
        console.log(direction);
        console.log(moveKeys);
        this.targetKeys = newTargetKeys;
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
    // 翻译字典 fieldName 需要翻译的字段名称，value 需要翻译的字段值
    getDictByName(fieldName, value) {
        this.getAllDicts();
        var translateDictName = '';// 需要翻译字典名称
        // 判断字段名称存在字典对象  并且值也存在,则获取翻译名称
        if (this.translateDicts.hasOwnProperty(fieldName) && this.translateDicts[fieldName].hasOwnProperty(value)) {
            translateDictName = this.translateDicts[fieldName][value];
        }
        return translateDictName == '' ? value : translateDictName;
    },
    // 图片上传
    handleImageView (name) {
        this.imgName = name;
        this.visible = true;
    },
    handleImageRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleImageSuccess (res, file) {
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        file.name = file.name;
    },
    handleImageFormatError (file) {
        this.$Notice.warning({
            title: '图片格式不正确',
            desc: file.name + ' 图片格式不正确, 请选择jpg or png图片'
        });
    },
    handleImageMaxSize (file) {
        this.$Notice.warning({
            title: '超过文件大小限制',
            desc: file.name + '图片超过2M.'
        });
    },
    handleImageBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
          this.$Notice.warning({
              title: '最多上传5张图片！'
          });
      }
      return check;
    },
    // 头像上传
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
    },
    close() {
      this.imagecropperShow = false;
    }
   }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  // 图片上传样式
  .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    //  头像
    .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>
