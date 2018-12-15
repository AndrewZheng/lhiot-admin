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
              @on-sale="onSale"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input placeholder="上架名称" class="search-input mr5" v-model="searchRowData.name" style="width: auto"/>
            <Input placeholder="商品名称" class="search-input mr5" v-model="searchRowData.productName" style="width: auto"/>
            <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary" :loading="searchLoading">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="addChildren" :loading="createLoading">
            <Icon type="md-add"/>
            创建
          </Button>
          <Poptip confirm
                  placement="bottom"
                  style="width: 100px"
                  title="您确认删除选中的内容吗?"
                  @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash"/>
              删除
            </Button>
          </Poptip>
          <Button align="right" v-waves type="primary" class="mr5" @click="exportExcel" :loading="exportExcelLoading">
            <Icon type="md-download"/>
            导出
          </Button>
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
      :width="750"
    >
      <p slot="header">
        <span>商品上架详情</span>
      </p>
      <div class="modal-content">
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="16">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="3">商品规格:</i-col>
              <i-col span="21">{{productDetail.specificationInfo}}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">上架名称:</i-col>
              <i-col span="16">{{productDetail.name}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="16">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="3">上架份数:</i-col>
              <i-col span="21">{{productDetail.shelfQty}}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">商品排序:</i-col>
              <i-col span="16">{{productDetail.sorting}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="2">上架描述:</i-col>
              <i-col span="22">{{productDetail.description}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="16">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="3">商品原价:</i-col>
              <i-col span="21">{{productDetail.originalPrice}}</i-col>
            </Row>
          </i-col>
          <i-col span="8">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">商品特价:</i-col>
              <i-col span="16">{{productDetail.price}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="4">是否上架:</i-col>
              <i-col span="18">{{productDetail.shelfStatus}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="24">
            <Row :gutter="8">
              <i-col span="4">上架主图:</i-col>
              <img span="18" :src="productDetail.image" style="width: 350px"/>
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
      :width="750"
    >
      <p slot="header">
        <i-col>{{tempModalType===modalType.edit?'修改商品上架信息':'创建商品上架信息'}}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="productDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="商品规格:" prop="specificationId">
              <Select
                v-if="tempModalType===modalType.create"
                ref="shelfSpecificationSelect"
                :remote="true"
                :filterable="true"
                :remote-method="remoteMethod"
                :disabled="tempModalType===modalType.edit?true:false"
                :loading="shelfSpecificationLoading">
                <Option @click.native="selectIndex(option)" class="pb5 pt5 pl15"
                        v-for="(option, index) in optionsShelfSpecification"
                        :value="option.id" :key="index">
                  {{option.specificationInfo}}
                </Option>
              </Select>
              <Input v-else :value="shelfSpecificationEditDefault" disabled/>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="上架名称:" prop="name">
              <Input v-model="productDetail.name" placeholder="上架名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="上架份数:" prop="shelfQty">
              <InputNumber :min="0" v-model="productDetail.shelfQty" size="large" style="width: 160px"></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品排序:" prop="sorting">
              <InputNumber :min="0" v-model="productDetail.sorting" size="large" style="width: 160px"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="上架描述:">
              <Input v-model="productDetail.description" placeholder="上架描述"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="商品原价:" prop="originalPrice">
              <InputNumber :min="0" v-model="productDetail.originalPrice"
              ></InputNumber>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="商品特价:" prop="price">
              <InputNumber :min="0" v-model="productDetail.price" placeholder="商品特价"></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否上架:" prop="shelfStatus">
              <Select :value="productDetail.shelfStatus" @on-change="useAbleUniteChange"
                      style="width: 100px">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in useAble" :value="item.value"
                        :key="index">{{ item.label
                  }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="商品主图:建议尺寸 (xxx*xxx):" prop="image" :label-width="80">
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
                  <Button type="primary">
                    上传图片
                  </Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
          <Row v-show="tempModalType===modalType.create">
            <Col span="24">
            <FormItem label="上架板块:">
              <div v-for="item in uiPositionData">
                <div>
                  {{item.description}}:
                </div>
                <CheckboxGroup @on-change="checkAllGroupChange" v-model="model">
                  <Checkbox
                    ref="checkBox"
                    :label="innerItem.id"
                    v-for="innerItem in item.productSections"
                  >{{innerItem.sectionName}}
                  </Checkbox>
                </CheckboxGroup>
              </div>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button type="primary" :loading="modalViewLoading" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="uploadVisible">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import IViewUpload from '_c/iview-upload'
  import {
    getuiPositionsPages,
    createProductShelve,
    deleteProductShelve,
    editProductShelve,
    getProductShelvesPages,
    getProductSpecificationsPages
  } from '@/api/fruitermaster';
  import uploadMixin from '@/mixins/uploadMixin'
  import deleteMixin from '@/mixins/deleteMixin.js'
  import tableMixin from '@/mixins/tableMixin.js'
  import searchMixin from '@/mixins/searchMixin.js'
  import {positionType, YN} from '@/libs/enumerate';

  const productDetail = {
    id: 0,
    image: "",
    name: "",
    originalPrice: 0,
    price: 0,
    productName: "",
    productImage: '',
    productSpecification: {},
    sectionIds: "",
    shelfQty: 0,
    shelfStatus: "",
    shelfType: "NORMAL",
    sorting: 0,
    specificationId: 0,
    specificationInfo: ''
  };
  const roleRowData = {
    productName: '',
    name: '',
    page: 1,
    rows: 10
  };

  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [uploadMixin, deleteMixin, tableMixin,searchMixin],
    mounted() {
    },
    created() {
      this.loading = true
      this.createLoading = true
      this.searchRowData = _.cloneDeep(roleRowData)
      getuiPositionsPages({
        applicationType:'HEALTH_GOOD',
        includeSection: YN.YES,
        positionType: null,
        page: 0,
        rows: 0
      }).then(res => {
        this.uiPositionData = res.array;
        console.log(this.uiPositionData);
        this.createLoading = false
        this.getTableData();
      })
    },
    data() {
      return {
        shelfSpecificationEditDefault: '',
        shelfSpecificationLoading: false,
        optionsShelfSpecification: [],
        list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming'],
        createLoading: false,
        model: [],
        uiPositionData: [],
        ruleInline: {
          originalPrice: [
            {required: true, message: '请输入商品原价'},
            {message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/}
          ],
          price: [
            {required: true, message: '请输入商品特价'},
            {message: '必须为大于0的数字', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/}
          ],
          specificationId: [{required: true, message: '请输入商品规格', pattern: /^[1-9]\d*$/}],
          image: [{required: true, message: '请上传图片'}],
          name: [{required: true, message: '请输入上架名称'}],
          shelfQty: [
            {required: true, message: '请输入上架份数'},
            {message: '必须为非零整数', pattern: /^[1-9]\d*$/}
          ],
          sorting: [
            {required: true, message: '请输入上架份数'},
            {message: '必须为非零整数', pattern: /^[1-9]\d*$/}
          ],
          shelfStatus: [
            {required: true, message: '请选择是否上架'},
          ]
        },
        useAble: [{label: '是', value: 'ON'}, {label: '否', value: 'OFF'}],
        defaultListMain: [],
        uploadListMain: [],
        modalViewLoading: false,
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
            width: 120,
            render: (h, params, vm) => {
              let {row} = params
              const str = <img src={row.image} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
              return <div>{str}</div>;
            }
          },
          {
            title: '商品名称',
            key: 'productName',
            width: 150
          },
          {
            title: '上架名称',
            width: 150,
            key: 'name'
          },
          {
            title: '上架规格',
            width: 150,
            key: 'shelfSpecification'
          },
          {
            title: '规格条码',
            width: 150,
            key: 'barcode'
          },
          {
            title: '商品原价',
            minWidth: 120,
            key: 'originalPrice',
            sortable: true
          },
          {
            title: '商品特价',
            minWidth: 120,
            key: 'price',
            sortable: true
          },
          {
            title: '排序',
            minWidth: 80,
            key: 'sorting',
            sortable: true
          },
          {
            title: '是否上架',
            minWidth: 100,
            key: 'shelfStatus',
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            fixed: 'right',
            options: ['delete', 'edit', 'view', 'onSale']
          }
        ],
        searchRowData: _.cloneDeep(roleRowData),
        productDetail: productDetail,
        exportExcelLoading: false
      };
    },
    methods: {
      resetSearchRowData() {
        this.clearSearchLoading = true
        this.searchRowData = _.cloneDeep(roleRowData);
        this.getTableData()
      },
      selectIndex(options) {
        this.productDetail.specificationId = options.id
        this.productDetail.image = options.product.productImage
        this.productDetail.name = options.product.name
        let tempImgObj = {}
        tempImgObj.image = options.product.productImage
        this.setDefaultUploadList(tempImgObj)
      },
      remoteMethod(query) {
        if (query !== '') {
          this.handleSearchAutoComplete(query)
        } else {
          this.optionsShelfSpecification = [];
        }
      },
      handleSearchAutoComplete(value) {
        this.shelfSpecificationLoading = true;
        getProductSpecificationsPages({
          keyword: value + '',
          page: '1',
          rows: '5'
        }).then(res => {
          console.log(res);
          this.optionsShelfSpecification.length = 0
          if (res.length > 0) {
            res.forEach(value => {
              this.optionsShelfSpecification.push(value)
            })
          }
          console.log(this.optionsShelfSpecification);
        }).finally(() => {
          this.shelfSpecificationLoading = false;
        })
      },
      checkAllGroupChange(data) {
        this.productDetail.sectionIds = data.join(',')
      },
      deleteTable(ids) {
        this.loading = true
        deleteProductShelve({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.searchRowData.pageSize)
            if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
              this.searchRowData.page -= 1
            }
            this.tableDataSelected = [];
            this.getTableData();
          }
        ).catch(err => {
          this.loading = false
        })
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              //添加状态
              this.createProductShelve()
            } else if (this.tempModalType === this.modalType.edit) {
              //编辑状态
              this.editProductShelve()
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        })
      },
      editProductShelve() {
        this.modalViewLoading = true
        editProductShelve({
          ...this.productDetail
        }).then(res => {
          this.resetFields()
          this.modalEdit = false
          this.modalViewLoading = false
          this.getTableData()
        }).catch(err => {
          this.resetFields()
          this.modalEdit = false
          this.modalViewLoading = false
        })
      },
      createProductShelve() {
        this.modalViewLoading = true
        createProductShelve({
          ...this.productDetail
        }).then(res => {
          this.resetFields()
          this.modalViewLoading = false
          this.modalEdit = false
          this.$Message.success('创建成功!');
          this.getTableData()
        })
      },
      //商品主图
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList
        this.productDetail.image = null
        this.productDetail.image = fileList[0].url
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = []
        this.productDetail.image = null
      },
      useAbleUniteChange(value) {
        this.productDetail.shelfStatus = value;
      },
      addChildren() {
        if (this.tempModalType !== this.modalType.create) {
          this.resetFields()
          this.tempModalType = this.modalType.create
        }
        this.modalEdit = true;
      },
      onSale(params) {
        console.log(params.row.shelfStatus);
        // this.tableData[params.index].onSale = !this.tableData[params.index].onSale;
        this.productDetail = params.row
        if (params.row.shelfStatus === 'ON') {
          this.productDetail.shelfStatus = 'OFF';
        } else {
          this.productDetail.shelfStatus = 'ON'
        }
        this.editProductShelve()
      },
      handleView(params) {
        this.tempModalType = this.modalType.view
        this.productDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit
        this.productDetail = _.cloneDeep(params.row);
        this.shelfSpecificationEditDefault = params.row.specificationInfo
        // .length = 0
        // this.shelfSpecificationModel.push(temp)
        // this.$refs.shelfSpecificationSelect.setQuery(temp)
        this.setDefaultUploadList(params.row)
        this.modalEdit = true;
      },
      resetFields() {
        this.$refs.modalEdit.resetFields()
        this.$refs.uploadMain.clearFileList()
        this.uploadListMain = []
        this.productDetail = _.cloneDeep(productDetail)
      },
      setDefaultUploadList(res) {
        if (res.image != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = []
          map.url = res.image
          mainImgArr.push(map)
          this.$refs.uploadMain.setDefaultFileList(mainImgArr)
          this.uploadListMain = mainImgArr
        }
      },
      getTableData() {
        getProductShelvesPages(this.searchRowData).then(res => {
          this.tableData = res.array;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false
          this.searchLoading = false
        });
      },
      exportExcel() {
        this.exportExcelLoading = true
        getProductShelvesPages({}).then(res => {
          if (res.array.length > 0) {
            this.$refs.tables.exportCsv({
              filename: `table-${new Date().valueOf()}.csv`,
              columns: this.columns.filter((col, index) => index !== 0),
              data: res.array,
            });
          }
          this.exportExcelLoading = false
        })
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
