<template>
  <div class="m-role">
    <Card>
      <tables ref="tables" editable searchable
              border
              search-place="top"
              v-model="tableData"
              :columns="columns"
              :loading="loading"
              @on-delete="handleDelete"
              @on-view="handleView"
              @on-edit="handleEdit"
              @on-push="handlePush"
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
              <Icon type="md-download"/>
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
        <span>商品基础信息</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品编码:</i-col>
              <i-col span="20">{{fruitMasterDetail.id}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">商品名称:</i-col>
              <i-col span="16">{{fruitMasterDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="8">益处:</i-col>
              <i-col span="16">{{fruitMasterDetail.phoneNumber}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="8">是否可用:</i-col>
              <i-col span="16">{{fruitMasterDetail.extractingAmount}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品描述:</i-col>
              <i-col span="21">黄瓜、芦荟、奇异果等水果精心搭配，让肌肤焕发光彩</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品主图:</i-col>
              <i-col span="21">
                <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 200px;height: auto"/>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">商品附图:</i-col>
              <i-col span="21">
                <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width: 200px;height: auto"/>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="3">详情图:</i-col>
              <i-col span="21"><a style="color:#0072bc; text-decoration : underline" @click="goDetail"> 预览效果</a>----直接打开新页面，展示详情组合图片
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Divider orientation="center">基础规格</Divider>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="7">规格单位:</i-col>
              <i-col span="17">盒</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="7">规格条码:</i-col>
              <i-col span="17">00815</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="7">安全库存:</i-col>
              <i-col span="17">0</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="7">重量(kg):</i-col>
              <i-col span="17">0.5</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>


    <Modal
      style="z-index: 1000"
      v-model="modalEdit"
    >
      <p slot="header">
        <span>修改商品基础信息</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row align="middle" type="flex">
              <i-col span="6">商品编码:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
          <i-col span="12">
            <Row align="middle" type="flex">
              <i-col span="6">商品名称:</i-col>
              <Input span="18" style="width: 150px"/>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row align="middle" type="flex">
              <i-col span="6">商品分类:</i-col>
              <Select span="18" style="width:150px" value="New York">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20" align="middle" type="flex">
          <i-col span="18">
            <Row align="middle" type="flex">
              <i-col span="4">益处:</i-col>
              <Input span="18" style="width: 290px"/>
            </Row>
          </i-col>
          <i-col span="6" style="color: gray">关键词，使用逗号分隔</i-col>
        </Row>
        <Row class-name="mb20" align="middle" type="flex">
          <i-col span="24">
            <Row>
              <i-col span="3">商品描述:</i-col>
              <Input span="20" type="textarea" style="width: 350px;"/>
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
        <Row class="mt15">
          <i-col span="24">
            <Row>
              <i-col span="3">商品附图:建议尺寸 (xxx*xxx)</i-col>
              <i-col span="21">
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
                <Upload
                  ref="uploadSecond"
                  :show-upload-list="false"
                  :default-file-list="defaultListSecond"
                  :on-success="handleSuccessSecond"
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
        <Row class="mt15">
          <i-col span="24">
            <Row>
              <i-col span="3">商品详情:建议尺寸 (xxx*xxx)</i-col>
              <i-col span="21">
                <div class="demo-upload-list" v-for="item in uploadListMultiple">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveMultiple(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload
                  ref="uploadMultiple"
                  :show-upload-list="false"
                  :default-file-list="defaultListMultiple"
                  :on-success="handleSuccessMultiple"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUploadMutiple"
                  multiple
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
        <Divider orientation="center">审核信息</Divider>
        <Row type="flex" :gutter="8" align="middle" class="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">规格单位:</i-col>
              <Select span="16" style="width:150px" value="New York">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">规格条码:</i-col>
              <Input span="16" style="width: 150px"/>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">安全库存:</i-col>
              <Input span="16" style="width: 150px"/>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle">
              <i-col span="8">重量(kg):</i-col>
              <Input span="16" style="width: 150px"/>
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
  import {getMasterSalary} from '@/api/fruitermaster';
  import ImageCropper from '_c/ImageCropper';

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
      Tables,
      ImageCropper
    },
    mounted() {
      this.uploadListMultiple = this.$refs.uploadMultiple.fileList;
      this.uploadListSecond = this.$refs.uploadSecond.fileList;
      this.uploadListMain = this.$refs.uploadMain.fileList;
      this.getTableData();
    },
    data() {
      return {
        defaultListMultiple: [
          {
            'status': 'finished',
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'status': 'finished',
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        defaultListMain: [
          {
            'status': 'finished',
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          }
        ],
        defaultListSecond: [
          {
            'status': 'finished',
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          }
        ],
        imgUploadViewItem: '',
        uploadVisible: false,
        uploadListMain: [],
        uploadListSecond: [],
        uploadListMultiple: [],
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
        model1: '',
        imagecropperShow: false,
        columns: [
          {
            title: '商品编码',
            key: 'id',
            sortable: true,
            width: 150,
            fixed: 'left'
          },
          {
            title: '商品名称',
            key: 'name',
            width: 150
          },
          {
            title: '益处',
            minWidth: 150,
            key: 'phoneNumber'
          },
          {
            title: '是否可用',
            width: 150,
            key: 'extractingAmount'
          },
          {
            title: '商品描述',
            width: 150,
            key: 'settlementStatus'
          },
          {
            title: '操作',
            minWidth: 230,
            key: 'handle',
            options: ['delete', 'edit', 'view', 'push']
          }
        ],
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        loading: true,
        modalView: false,
        modalEdit: false,
        imagecropperKey: 0,
        image: '',
        rowData: roleRowData,
        searchRowData: roleRowData,
        fruitMasterDetail: fruitMasterDetail
      };
    },
    methods: {
      goDetail() {
        this.turnToPage('goods-detail');
      },
      addChildren() {
        this.modalEdit = true
      },
      deleteChildren() {

      },
      close() {
        this.imagecropperShow = false;
      },
      handleClose() {
        this.modalView = false;
      },
      handleDelete() {

      },
      handleView(params) {
        this.modalView = true;
      },
      handleEdit(params) {
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
        getMasterSalary({
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
      handlePush() {
        this.turnToPage('goods-standard');
      },
      handleUploadView(name) {
        this.imgUploadViewItem = name.url;
        this.uploadVisible = true;
      },
      handleRemoveMultiple(file) {
        const fileList = this.$refs.uploadMultiple.fileList;
        this.$refs.uploadMultiple.fileList.splice(fileList.indexOf(file), 1);
      },
      handleRemoveSecond(file) {
        const fileList = this.$refs.uploadSecond.fileList;
        this.$refs.uploadSecond.fileList.splice(fileList.indexOf(file), 1);
      },
      handleRemoveMain(file) {
        const fileList = this.$refs.uploadMain.fileList;
        this.$refs.uploadMain.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccessMultiple(response, file, fileList) {
        this.$refs.uploadMultiple.fileList = fileList
        file.url = response.fileUrl;
        file.name = file.name;
      },
      handleSuccessSecond(response, file, fileList) {
        this.$refs.uploadSecond.fileList = fileList
        file.url = response.fileUrl;
        file.name = file.name;
      },
      handleSuccessMain(response, file, fileList) {
        this.$refs.uploadMain.fileList = fileList
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
      handleBeforeUploadMutiple(file) {
        return this.checkImageWHMutiple(file,720,1280)
      },
      handleBeforeUploadMain(file){
        return this.checkImageWHMain(file,720,1280)
      },
      checkImageWHMutiple(file, width, height) {
        let self = this;
        return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
              const check = self.uploadListMultiple.length < 3;
              if (!check){
                self.$Notice.error({title: '只能上传3张图片'});
                reject()
              }
              if (width && this.width != width) {
                self.$Notice.error({title: '请上传宽为' + width + "的图片",});
                reject();
              } else if (height && this.height != height) {
                self.$Notice.error({title: '请上传高为' + height + "的图片",});
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
              if (!check){
                self.$Notice.error({title: '只能上传3张图片'});
                reject()
              }
              if (width && this.width != width) {
                self.$Notice.error({title: '请上传宽为' + width + "的图片",});
                reject();
              } else if (height && this.height != height) {
                self.$Notice.error({title: '请上传高为' + height + "的图片",});
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
    z-index: 999999;
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
