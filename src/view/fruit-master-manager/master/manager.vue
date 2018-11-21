<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-view="handleView"
              @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Input placeholder="姓名" class="search-input" v-model="searchRowData.name" style="width: 100px"/>
          <Input placeholder="手机号码" class="search-input" v-model="searchRowData.phoneNumber" style="width: 100px"/>
          <Input placeholder="身份证号码" class="search-input" v-model="searchRowData.idCard" style="width: 150px"/>
          <DatePicker type="datetime" placeholder="注册时间起" class="search-input ml20" v-model="searchRowData.timeStart" style="width: 100px"/>
          <DatePicker type="datetime" placeholder="注册时间止" class="search-input mr20" v-model="searchRowData.timeEnd" style="width: 100px"/>
          <Select class="search-col" placeholder="审核状态" v-model="searchRowData.status" style="width:100px" clearable>
            <Option class="ml15 mt10" v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn ml5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves type="primary" @click="exportExcel" style="margin-left: 200px">导出</Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <!--查看菜单 -->
    <Modal
      v-model="modalView"
    >
      <p slot="header">
        <span>鲜果师详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">ID:</i-col>
              <i-col span="20">{{fruitMasterDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">姓名:</i-col>
              <i-col span="20">{{fruitMasterDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">手机号码:</i-col>
              <i-col span="16">{{fruitMasterDetail.phoneNumber}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">邀请码:</i-col>
              <i-col span="18">{{fruitMasterDetail.inviteCode}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">鲜果师等级:</i-col>
              <i-col span="14">{{fruitMasterDetail.level}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">状态:</i-col>
              <i-col span="20">{{fruitMasterDetail.status}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">个人简介:</i-col>
              <i-col span="20">{{fruitMasterDetail.headStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">头像:</i-col>
              <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">职业照:</i-col>
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="img"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">半身照:</i-col>
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="img"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">开户人姓名:</i-col>
              <i-col span="14">高级鲜果师</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">开户行:</i-col>
              <i-col span="16">中国建设银行</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="10">银行卡号:</i-col>
              <i-col span="14">62223565421541558</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">可结算薪资:</i-col>
              <i-col span="16">1885.64</i-col>
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
    >
      <div class="modal-content" style="margin-top: 30px;">
        <Form :label-width="80" >
          <FormItem label="ID:">
            <i-col>{{fruitMasterDetail.id}}</i-col>
          </FormItem>
          <FormItem label="姓名:">
            <Input v-model="fruitMasterDetail.name" placeholder="请输入您的姓名" ></Input>
          </FormItem>
          <FormItem label="手机号码:">
            <Input v-model="fruitMasterDetail.phoneNumber" placeholder="请输入您的手机号码" ></Input>
          </FormItem>
          <FormItem label="邀请码:">
            <i-col>{{fruitMasterDetail.inviteCode}}</i-col>
          </FormItem>
          <FormItem label="鲜果师等级:">
            <Select style="width: 180px">
              <Option value="beijing">初级</Option>
              <Option value="shanghai">中级</Option>
              <Option value="shenzhen">高级</Option>
            </Select>
          </FormItem>
          <FormItem label="状态:">
            <Select style="width: 180px" >
              <Option value="beijing">可用</Option>
              <Option value="shanghai">不可用</Option>
              <Option value="shenzhen">异常</Option>
            </Select>
          </FormItem>
          <FormItem label="鲜果师头衔:">
            <Input v-model="fruitMasterDetail.headStatus" placeholder="" ></Input>
          </FormItem>
          <FormItem label="用户头像:" prop="avatarUrl">
            <Button @click="imagecropperShow=true" class="add-image">
              <Icon type="ios-camera" size="20"></Icon>
            </Button>
            <img :src="image" width='80px' height='80px'/>
          </FormItem>
          <FormItem label="职业照:">
            <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="img"/>
          </FormItem>
          <FormItem label="半身照:">
            <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="img"/>
          </FormItem>
          <FormItem label="银行卡号:">
            <i-col>62223565421541558</i-col>
          </FormItem>
          <FormItem label="可结算薪资:">
            <i-col>1885.64</i-col>
          </FormItem>
        </Form>
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

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import ImageCropper from '_c/ImageCropper';
  import {getMasterManager} from '@/api/fruitermaster';

  const fruitMasterDetail = {
    id: '',
    name: 0,
    phoneNumber: '',
    inviteCode: '',
    level: '',
    status: '',
    headStatus: '',
    cash: ''
  };
  const roleRowData = {
    name: '',
    phoneNumber: '',
    idCard: '',
    timeStart: '',
    timeEnd: '',
    status: ''
  };
  export default {
    components: {
      Tables,
      ImageCropper
    },
    data() {
      return {
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
            key: 'name'
          },
          {
            title: '手机号码',
            width: 150,
            key: 'phoneNumber'
          },
          {
            title: '邀请码',
            width: 100,
            key: 'inviteCode'
          },
          {
            title: '鲜果师等级',
            width: 100,
            key: 'level'
          },
          {
            title: '状态',
            width: 100,
            key: 'status'
          },
          {
            title: '头衔',
            width: 200,
            key: 'headStatus'
          },
          {
            title: '可结算薪资',
            width: 180,
            key: 'cash',
            sortable: true
          },
          {
            title: '操作',
            minWidth: 150,
            key: 'handle',
            options: ['view', 'edit']
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        modalEdit: false,
        // 头像上传
        imagecropperShow: false,
        imagecropperKey: 0,
        image: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        fruitMasterDetail: fruitMasterDetail,
        searchRowData: roleRowData,
        modalMenu: false,
        originMenuList: [],
        selectedIds: [],
        relationMenuList: [],
        // tab选项操作数据
        step: 'roleAdd',
        userStatus: [
          {
            key: 'INITIAL',
            value: '审核通过'
          },
          {
            key: 'AVAILABLE',
            value: '审核未通过'
          },
          {
            key: 'UNAVAILABLE',
            value: '审核中'
          }]
      };
    },
    created() {
      this.getTableData();
    },
    methods: {
      handleClose(){
        this.modalView = false;
      },
      handleView(params) {
        this.fruitMasterDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.fruitMasterDetail = params.row;
        this.modalEdit = true;
      },
      handleSearch() {
      },
      changePage(page) {
        this.page = page;
        this.getTableData();
      },
      changePageSize(pageSize) {
        console.log(pageSize);
        this.page = 1;
        this.pageSize = pageSize;
        this.getTableData();
      },
      getTableData() {
        getMasterManager({
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      },
      close() {
        this.imagecropperShow = false;
      },
      // 头像上传
      cropSuccess(resData) {
        console.log('resData: ', resData);
        this.imagecropperShow = false;
        this.imagecropperKey = this.imagecropperKey + 1;
        this.image = resData.fileUrl;
        this.imageVisible = true;
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
    height: auto !important
  }
  .add-image {
    line-height: 48px;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
</style>
