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
              @on-sale="onSale"
      >
        <div slot="searchCondition">
          <Row>
            <Col span="12">
            <Input placeholder="商品编码" class="search-input" v-model="searchRowData.name" style="width: auto"/>
            <Input placeholder="商品名称" class="search-input" v-model="searchRowData.name" style="width: auto"/>
            <Button v-waves @click="handleSearch" class="search-btn ml5" type="primary">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            </Col>
            <Col span="12">
            <Button v-waves type="success" class="mr5" @click="addChildren">
              <Icon type="md-add"/>
              创建
            </Button>
            <Button v-waves type="error" class="mr5" @click="deleteChildren">
              <Icon type="md-close"/>
              删除
            </Button>
            <Button v-waves type="primary" class="mr5" @click="exportExcel">
              <Icon type="md-download" />
              导出
            </Button>
            </Col>
          </Row>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer
                show-total></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
      :width="rowData.type=='SON'?'750':'540'"
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
              <i-col span="8">申请人:</i-col>
              <i-col span="16">{{fruitMasterDetail.name}}</i-col>
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
              <i-col span="8">提取金额:</i-col>
              <i-col span="16">{{fruitMasterDetail.extractingAmount}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">银行卡号:</i-col>
              <i-col span="16">{{fruitMasterDetail.creditCardNumbers}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">结算状态:</i-col>
              <i-col span="16">{{fruitMasterDetail.settlementStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">申请时间:</i-col>
              <i-col span="16">{{fruitMasterDetail.applicationTime}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">处理时间:</i-col>
              <i-col span="16">{{fruitMasterDetail.handlingTime}}</i-col>
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
      <p slot="header">
        <span>修改商品上架信息</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">商品规格:</i-col>
              <Input span="18" disabled style="width: 150px"/>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">上架名称:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">上架份数:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">商品排序:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="3">上架描述:</i-col>
              <Input span="21" style="width: 400px" type="textarea"/>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" class-name="mb10" >
          <i-col span="12">
            <Row class-name="mb10"  :gutter="8" type="flex" align="middle">
              <i-col span="6">商品原价:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
          <i-col span="12">
            <Row class-name="mb10"  :gutter="8" type="flex" align="middle">
              <i-col span="6">商品特价:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="6">是否上架:</i-col>
              <Select span="18" style="width:150px" value="New York">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:建议尺寸 (xxx*xxx)</i-col>
              <i-col span="21">
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
                <Upload
                  ref="uploadMain"
                  :show-upload-list="false"
                  :default-file-list="defaultListMain"
                  :on-success="handleSuccessMain"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUploadMain"
                  type="drag"
                  action="https://resource.food-see.com/v1/upload/product_image"
                  style="display: inline-block;width:158px;">
                  <div>
                    <Button type="primary" style="width:158px;">
                      <Icon type="ios-camera" size="20"></Icon>
                      上传图片
                    </Button>
                  </div>
                </Upload>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
    </Modal>
    <Modal title="View Image" v-model="uploadVisible">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {getOnSaleData} from '@/api/fruitermaster';

  const fruitMasterDetail = {
    id: '',
    name: 0,
    phoneNumber: '',
    extractingAmount: '',
    settlementStatus: '',
    creditCardNumbers: '',
    headStatus: '',
    applicationTime: '',
    handlingTime: '2018-10-28'
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
      Tables
    },
    mounted() {
      this.uploadListMain = this.$refs.uploadMain.fileList;
    },
    created() {
      this.getTableData();
    },
    data() {
      return {
        defaultListMain: [
          {
            'status': 'finished',
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          }
        ],
        uploadListMain: [],
        cityList: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          }
        ],
        columns: [
          {
            type: 'selection',
            key: '',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '上架图片',
            key: 'id',
            sortable: true,
            width: 180,
            render: (h, params, vm) => {
              const { row } = params;
              const str = <img src='https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar' style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
              return <div>{str}</div>;
            }
          },
          {
            title: '商品名称',
            key: 'name',
            width: 150
          },
          {
            title: '上架名称',
            width: 150,
            key: 'onSaleName'
          },
          {
            title: '上架规格',
            width: 150,
            key: 'onSaleRole'
          },
          {
            title: '规格条码',
            width: 150,
            key: 'roleCode'
          },
          {
            title: '商品原价',
            width: 180,
            key: 'price',
            sortable: true
          },
          {
            title: '商品特价',
            width: 150,
            key: 'sort',
            sortable: true
          },
          {
            title: '排序',
            width: 150,
            key: 'price',
            sortable: true
          },
          {
            title: '是否上架',
            width: 150,
            key: 'onSale',
            sortable: true
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'onSale']
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        modalEdit: false,
        rowData: roleRowData,
        searchRowData: roleRowData,
        fruitMasterDetail: fruitMasterDetail,
        imgUploadViewItem: '',
        uploadVisible: false
      };
    },
    methods: {
      addChildren() {
        this.modalEdit = true;
      },
      deleteChildren() {

      },
      onSale(params) {
        this.tableData[params.index].onSale = !this.tableData[params.index].onSale;
      },
      handleClose() {
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
        getOnSaleData({
          page: this.page,
          rows: this.pageSize
        }).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
        });
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        });
      },
      handleRemoveMain(file) {
        const fileList = this.$refs.uploadMain.fileList;
        this.$refs.uploadMain.fileList.splice(fileList.indexOf(file), 1);
      },
      handleUploadView(name) {
        this.imgUploadViewItem = name.url;
        this.uploadVisible = true;
      },
      handleSuccessMain(response, file, fileList) {
        this.$refs.uploadMain.fileList = fileList;
        file.url = response.fileUrl;
        file.name = file.name;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUploadMain(file) {
        return this.checkImageWHMain(file, 720, 1280);
      },
      checkImageWHMain(file, width, height) {
        let self = this;
        return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
              const check = self.uploadListMain.length < 1;
              if (!check) {
                self.$Notice.error({title: '只能上传1张图片'});
                reject();
              }
              if (width && this.width != width) {
                self.$Notice.error({title: '请上传宽为' + width + '的图片' });
                reject();
              } else if (height && this.height != height) {
                self.$Notice.error({title: '请上传高为' + height + '的图片' });
                reject();
              } else {
                resolve();
              }
            };
            image.onerror = reject;
            image.src = src;
          };
          filereader.readAsDataURL(file);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .demo-upload-list {
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-bottom: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
