<template>
  <div class="m-user">
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
        @on-relation="handleRole"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.name"
            placeholder="姓名"
            class="search-input mr5"
            style="width: auto"
            clearable
          ></Input>
          <Input
            v-model="searchRowData.tel"
            placeholder="电话"
            class="search-input mr5"
            style="width: auto"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.status"
            class="search-col mr5"
            placeholder="用户状态"
            style="width: auto"
            clearable
          >
            <Option
              v-for="item in userStatusList"
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
          <Button type="success" class="mr5" @click="handleAdd">
            <Icon type="md-add" />新增
          </Button>
          <Button type="error" class="mr5" @click="handleDeleteBatch">
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
      ref="formValidate"
      v-model="modalEdit"
      :loading="loadingBtn"
      :mask-closable="false"
      :model="rowData"
      :rules="ruleValidate"
      @on-ok="handleAddOrEditOk('formValidate')"
      @on-cancel="handleCancel"
    >
      <p slot="header">
        <span>{{ rowData.id==''?'创建用户':'编辑用户' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
          <FormItem label="姓名" prop="name">
            <Input v-model="rowData.name" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="账号" prop="account">
            <Input v-model="rowData.account" placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="rowData.password" type="password"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="passwdCheck">
            <Input v-model="rowData.passwdCheck" type="password" placeholder="请确认密码"></Input>
          </FormItem>
          <FormItem label="电话" prop="tel">
            <Input v-model="rowData.tel" placeholder="请输入电话号码"></Input>
          </FormItem>
          <FormItem label="用户头像" prop="avatarUrl">
            <Input v-show="false" v-model="rowData.avatarUrl" style="width: auto"></Input>
            <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
              <template v-if="item.status === 'finished'">
                <div>
                  <img :src="item.url" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                  </div>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <IViewUpload
              ref="uploadMain"
              :default-list="defaultListMain"
              :image-size="imageSize"
              groupType="system_image"
              fileDir="system"
              appType="min_app"
              @on-success="handleSuccessMain"
            >
              <div slot="content">
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <FormItem label="用户状态" prop="status">
            <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
              <Option
                v-for="item in userStatusList"
                :value="item.key"
                :key="`search-col-${item.key}`"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input
              v-model="rowData.remark"
              :autosize="{minRows: 2,maxRows: 5}"
              type="textarea"
              placeholder="请输入备注"
            ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>

    <!-- 多功能添加模态框(创建用户/关联角色) -->
    <Modal v-model="modalAdd" :loading="loadingBtn" :mask-closable="false">
      <div class="modal-content">
        <Tabs v-model="step" size="small">
          <!-- :value="tabOperation.tabSelected" -->
          <TabPane label="创建用户" name="userAdd">
            <Form ref="formValidate" :model="rowData" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名" prop="name">
                <Input v-model="rowData.name" placeholder="请输入姓名"></Input>
              </FormItem>
              <FormItem label="账号" prop="account">
                <Input v-model="rowData.account" placeholder="请输入账号"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="rowData.password" type="password" placeholder="请输入密码"></Input>
              </FormItem>
              <FormItem label="确认密码" prop="passwdCheck">
                <Input v-model="rowData.passwdCheck" type="password"></Input>
              </FormItem>
              <FormItem label="电话" prop="tel">
                <Input v-model="rowData.tel" placeholder="请输入电话号码"></Input>
              </FormItem>
              <FormItem label="用户头像" prop="avatarUrl">
                <Input v-show="false" v-model="rowData.avatarUrl" style="width: auto"></Input>
                <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMain(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadMain"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  groupType="system_image"
                  fileDir="system"
                  appType="min_app"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content">
                    <Button type="primary">上传图片</Button>
                  </div>
                </IViewUpload>
              </FormItem>
              <FormItem label="用户状态" prop="status">
                <Select v-model="rowData.status" class="search-col" placeholder="请选择用户状态">
                  <Option
                    v-for="item in userStatusList"
                    :value="item.key"
                    :key="`search-col-${item.key}`"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input
                  v-model="rowData.remark"
                  :autosize="{minRows: 2,maxRows: 5}"
                  type="textarea"
                  placeholder="请输入备注"
                ></Input>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane :disabled="isDisable" label="关联角色" name="roleAdd">
            <Transfer
              :data="roleData"
              :target-keys="targetKeys"
              :render-format="render1"
              :titles="titles"
              @on-change="handleChange"
            ></Transfer>
          </TabPane>
        </Tabs>
      </div>
      <div v-if="step=='userAdd' && !isCreated" slot="footer">
        <Button type="primary" @click="handleAddOrEditOk('formValidate')">下一步</Button>
      </div>
      <div v-else-if="step=='roleAdd'" slot="footer">
        <Button type="primary" @click="handleRoleOk">保存</Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="handleCloseAdd">关闭</Button>
      </div>
    </Modal>

    <!-- 关联角色 -->
    <Modal
      v-model="modalRole"
      :loading="loadingBtn"
      :mask-closable="false"
      @on-ok="handleRoleOk"
      @on-cancel="handleCancel"
    >
      <p slot="header">
        <span>关联角色</span>
      </p>
      <div class="modal-content">
        <Transfer
          :data="roleData"
          :target-keys="targetKeys"
          :render-format="render1"
          :titles="titles"
          @on-change="handleChange"
        ></Transfer>
      </div>
    </Modal>

    <!-- 头像上传组件 -->
    <image-cropper
      v-show="imagecropperShow"
      :width="70"
      :height="70"
      :key="imagecropperKey"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script type='text/ecmascript-6'>
import Tables from "_c/tables";
import { getUserData, getRoleList, getRelationRoles } from "@/api/system";
import ImageCropper from "_c/ImageCropper";
import _ from "lodash";
import uploadMixin from "@/mixins/uploadMixin";
import IViewUpload from "_c/iview-upload";

const userRowData = {
  id: "",
  name: "",
  account: "",
  password: "",
  passwdCheck: "",
  tel: "",
  avatarUrl: "",
  status: "",
  createAt: "",
  lastLoginAt: "",
  remark: ""
};

export default {
  name: "UserPage",
  components: {
    Tables,
    ImageCropper,
    IViewUpload
  },
  filters: {},
  mixins: [uploadMixin],
  data() {
    const validatePassCheck = (rule, value, callback) => {
      // console.log(this.rowData.password);
      if (value === "") {
        callback(new Error("请再次输入您的密码"));
      } else if (value !== this.rowData.password) {
        callback(new Error("两次输入密码不匹配"));
      } else {
        callback();
      }
    };
    return {
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "编号",
          key: "id",
          sortable: true,
          width: 80,
          render: (h, params, vm) => {
            const { row } = params;
            return h("span", row.id + "");
          },
          fixed: "left"
        },
        { title: "姓名", key: "name", sortable: true, width: 140 },
        { title: "账号", key: "account", sortable: true, width: 140 },
        { title: "电话", key: "tel", sortable: true, width: 140 },
        {
          title: "用户头像url",
          key: "avatarUrl",
          sortable: true,
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.avatarUrl} height="60" width="60" />;
            return <div>{str}</div>;
          }
        },
        {
          title: "用户状态",
          key: "status",
          sortable: true,
          width: 120,
          render: (h, params, vm) => {
            const { row } = params;
            const str =
              row.status === "AVAILABLE" ? (
                <tag color="success">
                  {this.getDictValueByKey(this.userStatus, row.status)}
                </tag>
              ) : (
                <tag color="error">
                  {this.getDictValueByKey(this.userStatus, row.status)}
                </tag>
              );
            return <div>{str}</div>;
          }
        },
        { title: "创建时间", key: "createAt", sortable: true, width: 160 },
        {
          title: "最后登录时间",
          key: "lastLoginAt",
          sortable: true,
          width: 160
        },
        { title: "备注", key: "remark", sortable: true, width: 180 },
        {
          title: "操作",
          key: "handle",
          width: 180,
          options: ["view", "edit", "relation", "delete"],
          button: [
            (h, params, vm) => {
              return h("Poptip", {
                props: {
                  confirm: true,
                  title: "你确定要删除吗?"
                },
                on: {
                  "on-ok": () => {
                    vm.$emit("on-delete", params);
                    vm.$emit(
                      "input",
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
      rowData: userRowData,
      searchRowData: userRowData,
      modalRole: false,
      step: "userAdd",
      isDisable: true,
      isCreated: false,
      // 图片上传数据
      imageVisible: false,
      // 双栏穿梭选择框数据
      roleData: this.getRoleData(),
      targetKeys: [],
      titles: ["未关联角色", "已关联角色"],
      // 表单验证
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ],
        tel: [
          {
            required: false,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "电话号码不正确",
            trigger: "blur"
          }
        ],
        avatarUrl: [
          { required: true, message: "头像不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择角色状态", trigger: "blur" }]
      },
      // 头像上传
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "",
      ids: [],
      userStatusList: [],
      defaultListMultiple: [],
      defaultListMain: [],
      uploadListMain: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getTableData();
    this.getStatusList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.chirenderContentldren) {
        return (
          <span
            style={{ display: "inline-block", width: "100%", fontSize: "14px" }}
          >
            <span />
            <span>{data.meta.title}</span>
          </span>
        );
      } else {
        return (
          <span
            style={{ display: "inline-block", width: "100%", fontSize: "14px" }}
          >
            <span />
            <span>{data.meta.title}</span>
          </span>
        );
      }
    },
    handleView(params) {
      this.$Modal.info({
        title: "用户详情",
        content:
          `姓名: ${this.tableData[params.row.initRowIndex].name}<br>
          账号: ${this.tableData[params.row.initRowIndex].account}<br>
          电话: ${this.tableData[params.row.initRowIndex].tel}<br>
          头像:<img src="` +
          this.tableData[params.row.initRowIndex].avatarUrl +
          `" width="80px" height="80px"/><br>
          用户状态: ` +
          this.getDictValueByKey(
            this.userStatus,
            this.tableData[params.row.initRowIndex].status
          ) +
          `<br>
          创建时间: ${this.tableData[params.row.initRowIndex].createAt}<br>
          最后登录时间: ${
            this.tableData[params.row.initRowIndex].lastLoginAt
          }<br>
          备注: ${this.tableData[params.row.initRowIndex].remark}<br>`
        // 关联角色：<tag type="border">角色1</tag><tag type="border">角色2</tag><tag type="border">角色3</tag>
      });
      // console.log(this.tableData[params.row.initRowIndex].avatarUrl);
    },
    handleDelete(params) {
      const { row } = params;
      // 发送axios请求
      this.$http
        .request({
          url: "/admin/batch/" + row.id,
          method: "delete",
          data: this.rowData
        })
        .then(res => {
          this.$Message.info("删除成功");
          // 刷新表格数据
          this.getTableData();
        });
    },
    handleDeleteBatch() {
      if (this.ids.length !== 0) {
        // 发送axios请求
        this.$http
          .request({
            url: "/admin/batch/" + this.ids,
            method: "delete"
          })
          .then(res => {
            this.$Message.info("删除成功");
            // 刷新表格数据
            this.getTableData();
          });
      } else {
        this.$Message.error("请至少选择一行记录");
      }
    },
    onSelectionChange(selection) {
      this.ids = selection.map(item => item.id.toString());
      console.log("选择变化,当前页选择ids:" + this.ids);
    },
    handleEdit(params) {
      // console.log(params);
      const { row } = params;
      this.image = "";
      this.rowData = _.merge({}, this.rowData, row);
      this.rowData.passwdCheck = row.password;
      this.defaultListMain = [];
      // this.image = this.rowData.avatarUrl;
      this.modalEdit = true;
    },
    handleAddOrEditOk(name) {
      // this.rowData.avatarUrl = this.image;
      this.loadingBtn = false;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.rowData.id === undefined) {
            // 发送axios请求
            this.$http
              .request({
                url: "/admin/",
                method: "post",
                data: this.rowData
              })
              .then(res => {
                this.modalEdit = false;
                this.$Message.info("保存成功");
                this.step = "roleAdd";
                this.isDisable = false;
                this.isCreated = true;
                // 获取新增加的id
                this.rowData.id = res.id;
              });
          } else {
            // 发送axios请求
            this.$http
              .request({
                url: "/admin/" + this.rowData.id,
                method: "put",
                data: this.rowData
              })
              .then(res => {
                this.loadingBtn = false;
                this.modalEdit = false;
                this.$Message.info("更新成功");
                // 清空rowData对象
                this.resetRowData();
                // 刷新表格数据
                this.getTableData();
              });
          }
        } else {
          this.$Message.warning("请先完善信息");
        }
      });
    },
    handleCancel() {
      this.$Message.info("取消成功");
    },
    handleCloseAdd() {
      this.modalAdd = false;
      this.isCreated = false;
      this.isDisable = true;
      this.step = "addUser";
      // 清空rowData对象
      this.resetRowData();
      // 刷新表格数据
      this.getTableData();
    },
    handleAdd() {
      this.imageVisible = false;
      this.rowData = _.merge({}, this.rowData);
      this.rowData = {};
      this.defaultListMain = [];
      this.step = "userAdd";
      this.isDisable = true;
      this.isCreated = false;
      this.modalAdd = true;
    },
    handleRole(params) {
      // console.log(params);
      const { row } = params;
      this.rowData = row;
      this.targetKeys = [];
      getRelationRoles(this.rowData.id).then(res => {
        if (res && res.length > 0) {
          // console.log('relationRoleIds: ', this.getRelationRoleIds(res));
          this.targetKeys = this.getRelationRoleIds(res);
        }
      });
      this.modalRole = true;
    },
    handleSearch(params) {
      // 发送axios请求
      this.$http
        .request({
          url: "/admin/pages",
          data: this.searchRowData,
          method: "post"
        })
        .then(res => {
          // this.tableData = res.data;
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
    },
    handleClear(params) {
      // 重置数据
      this.resetSearchRowData();
      this.handleSearch();
    },
    handleRoleOk() {
      const roleIds = this.targetKeys.join(",");
      // 发送axios请求
      this.$http
        .request({
          url: "/admin/update/relation/" + this.rowData.id + "/" + roleIds,
          method: "put"
        })
        .then(res => {
          this.loadingBtn = false;
          if (this.modalRole === true) {
            this.modalRole = false;
            this.targetKeys = [];
            this.$Message.info("修改成功");
          } else if (this.modalAdd === true) {
            this.modalAdd = false;
            this.$Message.info("保存成功");
            this.step = "userAdd";
            this.isDisable = false;
            this.isCreated = true;
            // 清空rowData对象
            // this.resetRowData();
            // 刷新表格数据
            this.getTableData();
          }
        });
    },
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    changeRadio(selectItem) {
      console.log("选择按钮的值:" + `${selectItem}`);
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
      this.rowData = userRowData;
    },
    resetSearchRowData() {
      this.searchRowData = userRowData;
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
      const role = [];
      getRoleList().then(res => {
        if (res && res.array.length > 0) {
          for (let i = 0; i < res.array.length; i++) {
            role.push({
              key: res.array[i].id.toString(),
              label: res.array[i].name,
              description: res.array[i].roleDesc,
              disabled: res.array[i].status !== "AVAILABLE"
              // disabled: Math.random() * 3 < 1
            });
          }
        }
      });
      return role;
    },
    getRelationRoleIds(res) {
      const relationRoles = [];
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
      console.log("resData: ", resData);
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.fileUrl;
      this.imageVisible = true;
    },
    close() {
      this.imagecropperShow = false;
    },
    // 数据字典集合
    getStatusList() {
      this.userStatusList = this.getDictListByName("userStatus");
    },
    // 用户头像
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.rowData.avatarUrl = null;
      this.rowData.avatarUrl = fileList[0].url;
      console.log(this.rowData.avatarUrl);
    }
  }
};
</script>
<style>
.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
