<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="20"
        :operate-area-column="4"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.realName"
            placeholder="姓名"
            class="search-input mr5"
            style="width: 100px"
            clearable
          />
          <Input
            v-model="searchRowData.phone"
            placeholder="手机号码"
            class="search-input mr5"
            style="width: 100px"
            clearable
          />
          <Select
            v-model="searchRowData.doctorLevel"
            class="search-col mr5"
            placeholder="鲜果师等级"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in userStatus"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Select
            v-model="searchRowData.doctorStatus"
            class="search-col mr5"
            placeholder="鲜果师状态"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in doctorStatus"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Select
            v-model="searchRowData.hot"
            class="search-col mr5"
            placeholder="明星鲜果师"
            style="width:100px"
            clearable
          >
            <Option
              v-for="item in hotStatus"
              :value="item.value"
              :key="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
            :searchLoading="searchLoading"
            class="search-btn mr5"
            type="primary"
            @click="handleSearch"
          >
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button
            v-waves
            :loading="clearSearchLoading"
            class="search-btn"
            type="info"
            @click="handleClear"
          >
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <!-- 多类型导出 -->
          <BookTypeOption v-model="exportType" class="mr5"/>
          <Button :loading="downloadLoading" class="search-btn mr5" type="primary" @click="handleDownload"><Icon type="md-download"/>导出</Button>
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

    <!--查看菜单 -->
    <Modal v-model="modalView">
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{ managerDetail.id }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">姓名:</i-col>
              <i-col span="20">{{ managerDetail.realName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{ managerDetail.phone }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="6">邀请码:</i-col>
              <i-col span="18">{{ managerDetail.inviteCode }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">鲜果师等级:</i-col>
              <i-col span="14">{{ managerDetail.doctorLevel|doctorLevelFilters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">状态:</i-col>
              <i-col span="20">{{ managerDetail.doctorStatus|doctorStatusFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">明星鲜果师:</i-col>
              <i-col span="14">{{ managerDetail.hot|hotFilters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">个人简介:</i-col>
              <i-col span="20">{{ managerDetail.profile }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">头像:</i-col>
              <Avatar :src="managerDetail.avatar" size="large"/>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">职业照:</i-col>
              <img :src="managerDetail.photo" class="img">
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="4">半身照:</i-col>
              <img :src="managerDetail.upperbodyPhoto" class="img">
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">开户人姓名:</i-col>
              <i-col span="14">{{ managerDetail.cardUsername }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">开户行:</i-col>
              <i-col span="16">{{ managerDetail.bankDeposit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="10">银行卡号:</i-col>
              <i-col span="14">{{ managerDetail.cardNo }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">红利余额:</i-col>
              <i-col span="16">{{ managerDetail.bonus|fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">可结算余额:</i-col>
              <i-col span="16">{{ managerDetail.settlement|fenToYuanDot2Filters }}</i-col>
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
        <Form ref="modalEdit" :label-width="100" :model="managerDetail" :rules="ruleInline">
          <Row>
            <Col span="12">
            <FormItem label="ID:">
              <i-col>{{ managerDetail.id }}</i-col>
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
              <i-col>{{ managerDetail.inviteCode }}</i-col>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="鲜果师等级:" prop="doctorLevel">
              <Select
                v-model="managerDetail.doctorLevel"
                class="search-col mr5"
                placeholder="鲜果师等级"
                style="width:100px"
                clearable
              >
                <Option
                  v-for="item in userStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="鲜果师状态:" prop="doctorStatus">
              <Select
                v-model="managerDetail.doctorStatus"
                class="search-col mr5"
                placeholder="鲜果师状态"
                style="width:100px"
                clearable
              >
                <Option
                  v-for="item in doctorStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="明星鲜果师:" prop="hot">
              <Select
                v-model="managerDetail.hot"
                class="search-col mr5"
                placeholder="明星鲜果师"
                style="width:100px"
                clearable
              >
                <Option
                  v-for="item in hotStatus"
                  :value="item.value"
                  :key="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
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
            <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
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
              :default-list="defaultListMain"
              :image-size="imageSize"
              @on-success="handleSuccessMain"
            >
              <div slot="content">
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <FormItem label="半身照:" prop="upperbodyPhoto">
            <div v-for="item in uploadListSecond" :key="item.url" class="demo-upload-list">
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
              :default-list="defaultListSecond"
              :image-size="imageSize"
              @on-success="handleSuccessSecond"
            >
              <div slot="content">
                <Button type="primary">上传图片</Button>
              </div>
            </IViewUpload>
          </FormItem>
          <Row>
            <Col span="12">
            <FormItem label="开户人姓名:">
              <i-col>{{ managerDetail.cardUsername }}</i-col>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="开户行:">
              <i-col>{{ managerDetail.bankDeposit }}</i-col>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="银行卡号:">
              <i-col>{{ managerDetail.cardNo }}</i-col>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="红利余额:">
              <i-col>{{ managerDetail.bonus|fenToYuanDot2Filters }}</i-col>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="可结算余额:">
              <i-col>{{ managerDetail.settlement|fenToYuanDot2Filters }}</i-col>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
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
import { fenToYuanDot2 } from '../../../libs/util';
import BookTypeOption from '_c/book-type-option';

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
  bonus: 0,
  amountOfMonth: null,
  avatar: '',
  upperbodyPhoto: '',
  phone: '',
  applicationId: 0,
  settlement: 0
};

const roleRowData = {
  realName: '',
  phone: '',
  inviteCode: '',
  doctorLevel: null,
  page: 1,
  rows: 10
};
export default {
  components: {
    Tables,
    IViewUpload,
    BookTypeOption
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
          key: 'doctorLevel',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{doctorLevelConvert(row.doctorLevel).label}</div>;
          }
        },
        {
          title: '明星鲜果师',
          width: 100,
          key: 'hot',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{hotConvert(row.hot).label}</div>;
          }
        },
        {
          title: '状态',
          width: 100,
          key: 'doctorStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.doctorStatus === 'VALID') {
              return <div><tag color='success'>{doctorStatusConvert(row.doctorStatus).label}</tag></div>;
            } else if (row.doctorStatus === 'INVALID') {
              return <div><tag color='error'>{doctorStatusConvert(row.doctorStatus).label}</tag></div>;
            } else {
              return <div>{row.doctorStatus}</div>;
            }
          }
        },
        {
          title: '头衔',
          width: 200,
          key: 'jobTitle'
        },
        {
          title: '红利余额',
          width: 180,
          key: 'bonus',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{fenToYuanDot2(row.bonus)}</div>;
          }
        },
        {
          title: '可结算余额',
          width: 180,
          key: 'settlement',
          render: (h, params, vm) => {
            const { row } = params;
            return <div>{fenToYuanDot2(row.settlement)}</div>;
          }
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
      managerDetail: this._.cloneDeep(managerDetail),
      exportType: 'xlsx',
      downloadLoading: false
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
        const mainImgArr = [];
        map.url = res.photo;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
      if (res.upperbodyPhoto != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
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
    // exportExcel() {
    //   this.$refs.tables.exportCsv({
    //     filename: `table-${new Date().valueOf()}.csv`
    //   });
    // },
    handleDownload() {
      // 导出不分页
      this.searchRowData.rows = null;
      getFruitDoctorsPages(this.searchRowData).then(res => {
        const tableData = res.array;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['id'] = item['id'] + '';
          item['bonus'] = (item['bonus'] / 100.00).toFixed(2);
          item['settlement'] = (item['settlement'] / 100.00).toFixed(2);
          item['doctorLevel'] = doctorLevelConvert(item['doctorLevel']).label;
          item['hot'] = hotConvert(item['hot']).label;
          item['doctorStatus'] = doctorStatusConvert(item['doctorStatus']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `鲜果师信息-${new Date().valueOf()}`,
          data: tableData
        });
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
