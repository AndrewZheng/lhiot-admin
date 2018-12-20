<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        border
        search-place="top"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        @on-view="handleView"
        @on-edit="handleEdit"
        :searchAreaColumn="20"
        :operateAreaColumn="4"
      >
        <div slot="searchCondition">
          <Input
            placeholder="姓名"
            class="search-input mr5"
            v-model="searchRowData.realName"
            style="width: 100px"
          />
          <Input
            placeholder="手机号码"
            class="search-input mr5"
            v-model="searchRowData.phone"
            style="width: 100px"
          />
          <DatePicker
            @on-change="startTimeChange"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="注册时间起"
            class="search-input"
            v-model="searchRowData.beginCreateAt"
            style="width: 150px"
          />
          <i>-</i>
          <DatePicker
            @on-change="endTimeChange"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="注册时间止"
            class="search-input mr5"
            v-model="searchRowData.endCreateAt"
            style="width: 150px"
          />
          <Select
            class="search-col mr5"
            placeholder="鲜果师等级"
            v-model="searchRowData.doctorLevel"
            style="width:100px"
            clearable
          >
            <Option
              class="ptb2-5"
              v-for="item in userStatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
            @click="handleSearch"
            class="search-btn mr5"
            type="primary"
            :searchLoading="searchLoading"
          >
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button
            v-waves
            @click="handleClear"
            class="search-btn"
            type="info"
            :loading="clearSearchLoading"
          >
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="primary" @click="exportExcel">导出</Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="page"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-sizer
            show-total
          ></Page>
        </Row>
      </div>
    </Card>

    <!--查看菜单 -->
    <Modal v-model="modalView">
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{managerDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">姓名:</i-col>
              <i-col span="20">{{managerDetail.realName}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{managerDetail.phone}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">邀请码:</i-col>
              <i-col span="18">{{managerDetail.inviteCode}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">鲜果师等级:</i-col>
              <i-col span="14">{{managerDetail.doctorLevel|doctorLevelFilters}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">状态:</i-col>
              <i-col span="20">{{managerDetail.doctorStatus|doctorStatusFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">明星鲜果师:</i-col>
              <i-col span="14">{{managerDetail.hot|hotFilters}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">个人简介:</i-col>
              <i-col span="20">{{managerDetail.profile}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">头像:</i-col>
              <Avatar :src="managerDetail.avatar" size="large"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">职业照:</i-col>
              <img :src="managerDetail.photo" class="img">
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">半身照:</i-col>
              <img :src="managerDetail.upperbodyPhoto" class="img">
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">开户人姓名:</i-col>
              <i-col span="14">{{managerDetail.cardUsername}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">开户行:</i-col>
              <i-col span="16">{{managerDetail.bankDeposit}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">银行卡号:</i-col>
              <i-col span="14">{{managerDetail.cardNo}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">可结算薪资:</i-col>
              <i-col span="16">{{managerDetail.balance}}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit">
      <div class="modal-content" style="margin-top: 20px">
        <Form :label-width="80" ref="modalEdit" :model="managerDetail" :rules="ruleInline">
          <Row>
            <Col span="12">
              <FormItem label="ID:">
                <i-col>{{managerDetail.id}}</i-col>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="姓名:" prop="realName">
                <Input v-model="managerDetail.realName" placeholder="请输入您的姓名"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="手机号码:" prop="phone">
                <Input v-model="managerDetail.phone" placeholder="请输入您的手机号码"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邀请码:">
                <i-col>{{managerDetail.inviteCode}}</i-col>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="鲜果师等级:" prop="doctorLevel">
                <Select
                  class="search-col mr5"
                  placeholder="鲜果师等级"
                  v-model="managerDetail.doctorLevel"
                  style="width:100px"
                  clearable
                >
                  <Option
                    class="ptb2-5"
                    v-for="item in userStatus"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="鲜果师状态:" prop="doctorStatus">
                <Select
                  class="search-col mr5"
                  placeholder="鲜果师状态"
                  v-model="managerDetail.doctorStatus"
                  style="width:100px"
                  clearable
                >
                  <Option
                    class="ptb2-5"
                    v-for="item in doctorStatus"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="明星鲜果师:" prop="hot">
                <Select
                  class="search-col mr5"
                  placeholder="明星鲜果师"
                  v-model="managerDetail.hot"
                  style="width:100px"
                  clearable
                >
                  <Option
                    class="ptb2-5"
                    v-for="item in hotStatus"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="鲜果师头衔:" prop="jobTitle">
            <Input v-model="managerDetail.jobTitle" placeholder="鲜果师头衔"/>
          </FormItem>
          <FormItem label="鲜果师简介:" prop="profile">
            <Input v-model="managerDetail.profile" placeholder="鲜果师简介" type="textarea"/>
          </FormItem>
          <FormItem label="用户头像:">
            <img :src="managerDetail.avatar" width="80px" height="80px">
          </FormItem>
          <FormItem label="职业照:" prop="photo">
            <div class="demo-upload-list" v-for="item in uploadListMain">
              <template v-if="item.status === 'finished'">
                <div>
                  <img :src="item.url">
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
              :defaultList="defaultListMain"
              @on-success="handleSuccessMain"
              :imageSize="imageSize"
            >
              <div slot="content">
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <FormItem label="半身照:" prop="upperbodyPhoto">
            <div class="demo-upload-list" v-for="item in uploadListSecond">
              <template v-if="item.status === 'finished'">
                <div>
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveSecond(item)"></Icon>
                  </div>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <IViewUpload
              ref="uploadSecond"
              :defaultList="defaultListSecond"
              @on-success="handleSuccessSecond"
              :imageSize="imageSize"
            >
              <div slot="content">
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="开户人姓名:">
                <i-col>{{managerDetail.cardUsername}}</i-col>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="开户行:">
                <i-col>{{managerDetail.bankDeposit}}</i-col>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="银行卡号:">
                <i-col>{{managerDetail.cardNo}}</i-col>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="可结算薪资:">
                <i-col>{{managerDetail.balance}}</i-col>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="uploadVisible">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getFruitDoctorsPages, editFruitDoctor } from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';
import {
  doctorLevelConvert,
  doctorStatusConvert,
  hotConvert
} from '@/libs/converStatus';

const managerDetail = {
  id: 2,
  realName: '',
  photo: '',
  inviteCode: '',
  userId: '',
  doctorLevel: '',
  doctorLevels: null,
  doctorStatus: '',
  jobTitle: '',
  createAt: null,
  refereeId: 1,
  profile: '',
  cardNo: '',
  bankDeposit: '',
  cardUsername: '',
  hot: '',
  balance: 0,
  amountOfMonth: null,
  avatar: '',
  upperbodyPhoto: '',
  phone: '',
  applicationId: 0
};

const roleRowData = {
  realName: '',
  phone: '',
  inviteCode: '',
  doctorLevel: null,
  beginCreateAt: '',
  endCreateAt: '',
  page: 1,
  rows: 10
};
export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      defaultListSecond: [],
      uploadListSecond: [],
      ruleInline: {
        realName: { required: true, message: '请填写姓名' },
        phone: { required: true, message: '请填写电话号码' },
        upperbodyPhoto: { required: true, message: '请上传图片' },
        photo: { required: true, message: '请上传图片' },
        doctorStatus: { required: true, message: '请选择鲜果师状态' },
        doctorLevel: { required: true, message: '请选择鲜果师等级' },
        hot: { required: true, message: '请选择明星鲜果师状态' },
        jobTitle: { required: true, message: '请填写鲜果师头衔' },
        profile: { required: true, message: '请填写鲜果师个人简历' }
      },
      columns: [
        {
          title: '编号',
          key: 'id',
          sortable: true,
          width: 80,
          fixed: 'left'
        },
        {
          title: '姓名',
          width: 150,
          key: 'realName'
        },
        {
          title: '手机号码',
          width: 150,
          key: 'phone'
        },
        {
          title: '邀请码',
          width: 100,
          key: 'inviteCode'
        },
        {
          title: '鲜果师等级',
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{doctorLevelConvert(row.doctorLevel).label}</div>;
          }
        },
        {
          title: '明星鲜果师',
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{hotConvert(row.hot).label}</div>;
          }
        },
        {
          title: '状态',
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{doctorStatusConvert(row.doctorStatus).label}</div>;
          }
        },
        {
          title: '头衔',
          width: 200,
          key: 'jobTitle'
        },
        {
          title: '可结算薪资',
          width: 180,
          key: 'balance',
          sortable: true
        },
        {
          title: '操作',
          minWidth: 150,
          key: 'handle',
          fixed: 'right',
          options: ['view', 'edit']
        }
      ],
      modalViewLoading: false,
      clearSearchLoading: false,
      userStatus: [
        {
          label: '培训中',
          value: 'TRAINING'
        },
        {
          label: '初级',
          value: 'PRIMARY'
        },
        {
          label: '中高级',
          value: 'SENIOR'
        }
      ],
      doctorStatus: [
        {
          label: '正常',
          value: 'VALID'
        },
        {
          label: '已停用',
          value: 'INVALID'
        }
      ],
      hotStatus: [
        {
          label: '明星鲜果师',
          value: 'YES'
        },
        {
          label: '普通鲜果师',
          value: 'NO'
        }
      ],
      searchRowData: this._.cloneDeep(roleRowData),
      managerDetail: this._.cloneDeep(managerDetail)
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.$refs.uploadSecond.clearFileList();
      this.uploadListMain = [];
      this.uploadListSecond = [];
      // this.managerDetail.photo = null
      // this.managerDetail.upperbodyPhoto = null
    },
    setDefaultUploadList(res) {
      if (res.photo != null) {
        const map = { status: 'finished', url: 'url' };
        let mainImgArr = [];
        map.url = res.photo;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.upperbodyPhoto != null) {
        const map = { status: 'finished', url: 'url' };
        let mainImgArr = [];
        map.url = res.upperbodyPhoto;
        mainImgArr.push(map);
        this.$refs.uploadSecond.setDefaultFileList(mainImgArr);
        this.uploadListSecond = mainImgArr;
      }
    },
    handleRemoveSecond(file) {
      this.$refs.uploadSecond.deleteFile(file);
      this.managerDetail.upperbodyPhoto = null;
    },
    handleSuccessSecond(response, file, fileList) {
      this.uploadListSecond = fileList;
      this.managerDetail.upperbodyPhoto = null;
      this.managerDetail.upperbodyPhoto = fileList[0].url;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.managerDetail.photo = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.managerDetail.photo = null;
      this.managerDetail.photo = fileList[0].url;
    },
    startTimeChange(value, date) {
      this.searchRowData.beginCreateAt = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endCreateAt = value;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.editTableRow();
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      editFruitDoctor(this.managerDetail).then(res => {
        this.resetFields();
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      });
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.managerDetail = params.row;
      this.modalView = true;
    },
    handleEdit(params) {
      // this.resetFields()
      this.managerDetail = this._.cloneDeep(params.row);
      this.setDefaultUploadList(this.managerDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getFruitDoctorsPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 150px;
  height: auto !important;
}
.add-image {
  line-height: 48px;
  vertical-align: text-bottom;
  margin-right: 10px;
}
</style>
