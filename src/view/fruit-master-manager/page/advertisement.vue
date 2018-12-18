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
              @on-delete="handleDelete"
              @on-select-all="onSelectionAll"
              @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input placeholder="广告名称" class="search-input mr5" v-model="searchRowData.advertiseName"
                 style="width: 150px"/>
          <Select :disable="selectDisable" v-model="searchRowData.positionId" class="search-col mr5" placeholder="广告位置"
                  style="width: 150px">
            <Option v-for="item in advertisementList" :value="item.id" class="pt5 pb5 pl15"
                    :key="`search-col-${item.id}`">{{item.description}}
            </Option>
          </Select>
          <Button v-waves @click="handleSearch" class="search-btn mr5" type="primary">
            <Icon type="md-search"/>&nbsp;搜索
          </Button>
          <Button v-waves @click="handleClear" class="search-btn" type="info" :loading="clearSearchLoading">
            <Icon type="md-refresh"/>&nbsp;清除条件
          </Button>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class=" mr5" @click="addChildren">
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
      :width="600"
    >
      <p slot="header">
        <span>广告详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="3">广告内容:</i-col>
          <i-col v-if="advertisementDetail.advertiseType === 'IMAGE'" span="21" class-name="mb10">
            <img :src="advertisementDetail.content" style="width: 300px;height: auto"/></i-col>
          <i-col span="21" v-else class-name="mb10">{{advertisementDetail.content}}</i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="3">广告位置:</i-col>
          <i-col span="21">{{advertisementPositionComputed}}</i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">广告名称:</i-col>
              <i-col span="16">{{advertisementDetail.advertiseName}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">广告类型:</i-col>
              <i-col span="16">{{advertisementTypeComputed}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">链接类型:</i-col>
              <i-col span="16">{{relationTypeComputed}}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row type="flex" :gutter="8" align="middle" class-name="mb10">
              <i-col span="8">链接关联:</i-col>
              <i-col span="16">{{advertisementDetail.advertiseRelation}}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row type="flex" :gutter="8" align="middle" class-name="mb10">
          <i-col span="3">有效时间:</i-col>
          <i-col span="21">{{validityPeriodComputed}}</i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="modalEdit"
      :width="750"
      :mask-closable="false"
    >
      <p slot="header">
        <span>{{tempModalType===modalType.edit?'修改广告':'创建广告'}}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="advertisementDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <FormItem label="广告位置:" prop="positionId">
              <Select v-model="advertisementDetail.positionId" @on-change="advertisementChange"
                      style="width: 200px">
                <Option v-for="item in advertisementList" :value="item.id" class="pt5 pb5 pl15"
                        :key="`search-col-${item.id}`">{{item.description}}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="广告名:" prop="advertiseName">
              <Input v-model="advertisementDetail.advertiseName" placeholder="广告名"/>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="广告类型:" prop="advertiseType">
              <Select v-model="advertisementDetail.advertiseType" @on-change="advertiseTypeChange"
                      style="width: auto">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in advertiseType"
                        :value="item.value"
                        :key="index">{{ item.label}}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="广告状态:" prop="advertiseStatus">
              <Select v-model="advertisementDetail.advertiseStatus" @on-change="advertisementDetailStatusChange"
                      style="width: auto">
                <Option class="ptb2-5" style="padding-left: 5px" v-for="(item,index) in useAble" :value="item.value"
                        :key="index">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem :label='advertisementDetail.advertiseType ==="IMAGE"?"商品主图:建议尺寸 (xxx*xxx):":"广告文字:"'
                      prop="content"
                      :label-width="80">
              <div v-if="advertisementDetail.advertiseType ==='IMAGE'">
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
              </div>
              <div v-else>
                <Input v-model="advertisementDetail.content" placeholder="广告文字内容"/>
              </div>
            </FormItem>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="链接类型:" prop="relationType">
              <Select v-model="advertisementDetail.relationType" @on-change="advertiseRelationTypeChange"
              >
                <Option class="ptb2-5" v-for="(item,index) in relationType"
                        :value="item.value"
                        :key="index">{{item.label}}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <Row span="24" align="middle" type="flex">
              <Col span="18">
              <FormItem label="链接目标:" prop="advertiseRelation">
                <Input v-model="advertisementDetail.advertiseRelationText"
                       :disabled="advertisementDetail.relationType !== 'EXTERNAL_LINKS'"/>
              </FormItem>
              </Col>
              <i-col span="6">
                <Button v-waves @click="searchAdvertisementRelation" :loading="searchModalTableLoading"
                        class="search-btn mt-25" style="margin-left: 15px"
                        type="primary">
                  <Icon type="md-search"/>&nbsp;搜索
                </Button>
              </i-col>
            </Row>
            </Col>
          </Row>
          <Row>
            <Col span="24">
            <FormItem label="有效时间:">
              <Select v-model="advertisementDetail.isPermanent" @on-change="advertiseRelationTypeChange"
                      style="width: 200px"
              >
                <Option class="ptb2-5" v-for="(item,index) in validityTimeList"
                        :value="item.value"
                        :key="index">{{item.label}}
                </Option>
              </Select>
              <Row span="24" v-if="advertisementDetail.isPermanent ==='OFF'" class="mt15">
                <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间"
                            :value="advertisementDetail.beginAt"
                            @on-change="startTimeChange"/>
                <i class="mr5 ml5">-</i>
                <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetime" :value="advertisementDetail.endAt"
                            placeholder="结束时间"
                            @on-change="endTimeChange"/>
              </Row>
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
    <Modal title="View Image"
           :mask-closable="false"
           :width="1200"
           v-model="relationTargetShow">
      <div class="modal-content">
        <Table
          border
          :columns="tempColumns"
          :data="tempModalTableData"
          @on-row-click="onRowClick"
        ></Table>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tables from '_c/tables';
  import {
    getuiPositionsPages,
    createAdvertisement,
    deleteAdvertisement,
    editAdvertisement,
    getAdvertisementsPages,
    getProductShelvesPages,
    getAdvertisement
  } from '@/api/fruitermaster';
  import {goods_on_sales_columns} from '@//libs/columns';
  import deleteMixin from '@/mixins/deleteMixin.js';
  import tableMixin from '@/mixins/tableMixin.js';
  import searchMixin from '@/mixins/searchMixin.js';
  import uploadMixin from '@/mixins/uploadMixin';
  import IViewUpload from '_c/iview-upload';
  import {compareData} from '@/libs/util';
  import {positionTypeEnum, YNEnum} from '@/libs/enumerate';

  const advertisementDetail = {
    id: 0,
    positionId: 0,
    image: '',
    advertiseName: '',
    advertiseRelation: '',
    advertiseType: 'IMAGE',
    advertiseStatus: '',
    relationType: '',
    sorting: 0,
    beginAt: '',
    endAt: '',
    createAt: '',
    isPermanent: 'OFF',
    validityPeriod: '',
    advertiseRelationText:''
  };
  const roleRowData = {
    advertiseName: '',
    positionId: '',
    page: 1,
    rows: 10
  };

  export default {
    components: {
      Tables,
      IViewUpload
    },
    mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
    created() {
      getuiPositionsPages({
        applicationType: 'HEALTH_GOOD',
        includeSection: YNEnum.NO,
        positionType: positionTypeEnum.ADVERTISEMENT,
        page: 0,
        rows: 0
      }).then(res => {
        this.selectDisable = false;
        this.advertisementList = res.array;
        this.getTableData();
      });
    },
    data() {
      return {
        modalViewLoading: false,
        searchModalTableLoading: false,
        relationTargetShow: false,
        selectDisable: true,
        advertisementList: [],
        ruleInline: {
          advertiseName: [{required: true, message: '请选择广告位置'}],
          description: [{required: true, message: '请填写广告描述'}],
          advertiseType: [{required: true, message: '请选择广告类型'}],
          advertiseStatus: [{required: true, message: '请选择广告状态'}],
          content: [{required: true, message: '请填写广告文字内容或者上传图片'}],
          relationType: [{required: true, message: '请选择链接类型'}],
          advertiseRelation: [{required: true, message: '请填写链接目标'}],
          positionId: [{required: true, message: '请选择广告位置'}]
        },
        advertiseType: [
          {value: 'IMAGE', label: '图片广告'},
          {value: 'TEXT', label: '文字广告'}
        ],
        relationType: [
          {value: 'PRODUCT_DETAILS', label: '商品详情', api: getProductShelvesPages, columns: goods_on_sales_columns},
          {value: 'PRODUCT_SECTION', label: '定制计划', api: getProductShelvesPages},
          {value: 'CUSTOM_PLAN', label: '商品版块', api: getProductShelvesPages},
          {value: 'STORE_LIVE_TELECAST', label: '门店直播', api: getProductShelvesPages},
          {value: 'CUSTOM_PLAN_SECTION', label: '定制版块', api: getProductShelvesPages},
          {value: 'ARTICLE_DETAILS', label: '文章详情', api: getProductShelvesPages},
          {value: 'EXTERNAL_LINKS', label: '外部链接', api: getProductShelvesPages}
        ],
        tempColumns: [],
        tempModalTableData: [],
        relationTypeKeys: [],
        useAble: [{label: '开启', value: 'ON'}, {label: '关闭', value: 'OFF'}],
        validityTimeList: [
          {label: '永久有效', value: 'ON'},
          {label: '定时生效', value: 'OFF'}
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
            title: 'ID',
            key: 'id',
            sortable: true,
            minWidth: 80,
            fixed: 'left'
          },
          {
            title: '广告内容',
            width: 150,
            render: (h, params, vm) => {
              const {row} = params;
              if (row.advertiseType === 'IMAGE') {
                const str = <img src={row.content} style="margin-top:5px" height="60" width="60" margin-top="10px"/>;
                return <div>{str}</div>;
              } else {
                return <div>{row.content}</div>;
              }
            }
          },
          {
            title: '广告名称',
            width: 150,
            key: 'advertiseName'
          },
          {
            title: '广告类型',
            width: 150,
            key: 'advertiseType',
            render: (h, params, vm) => {
              const {row} = params;
              if (row.advertiseType === 'IMAGE') {
                return <div>{'图片'}</div>;
              } else {
                return <div>{'文字'}</div>;
              }
            }
          },
          {
            title: '链接类型',
            width: 180,
            render: (h, params, vm) => {
              const {row} = params;
              switch (row.relationType) {
                case 'PRODUCT_DETAILS':
                  return <div>{'商品详情'}</div>;
                  break;
                case 'PRODUCT_SECTION':
                  return <div>{'定制计划'}</div>;
                  break;
                case 'CUSTOM_PLAN':
                  return <div>{'商品版块'}</div>;
                  break;
                case 'STORE_LIVE_TELECAST':
                  return <div>{'门店直播'}</div>;
                  break;
                case 'CUSTOM_PLAN_SECTION':
                  return <div>{'定制版块'}</div>;
                  break;
                case 'ARTICLE_DETAILS':
                  return <div>{'文章详情'}</div>;
                  break;
                case 'EXTERNAL_LINKS':
                  return <div>{'外部链接'}</div>;
                  break;
                default :
                  return <div>{row.relationType}</div>;
                  break;
              }
            }
          },
          {
            title: '广告状态',
            minWidth: 110,
            key: 'advertiseStatus',
            render: (h, params, vm) => {
              const {row} = params;
              switch (row.advertiseStatus) {
                case 'ON':
                  return <div>{'开启'}</div>;
                  break;
                case 'OFF':
                  return <div>{'关闭'}</div>;
                  break;
                default :
                  return <div>{row.advertiseStatus}</div>;
                  break;
              }
            }
          },
          {
            title: '有效时间',
            minWidth: 300,
            key: 'validityPeriod'
          },
          {
            title: '操作',
            minWidth: 200,
            key: 'handle',
            options: ['delete', 'edit', 'view']
          }
        ],
        defaultListMain: [],
        uploadListMain: [],
        searchRowData: _.cloneDeep(roleRowData),
        advertisementDetail: _.cloneDeep(advertisementDetail),
      };
    },
    computed: {
      advertisementPositionComputed() {
        let tempObj = this.advertisementList.find(item => item.id === this.advertisementDetail.positionId);
        if (tempObj) {
          return tempObj.description;
        }
        return '';
      },
      advertisementTypeComputed() {
        if (this.advertisementDetail.advertiseType === 'IMAGE') {
          return '图片广告';
        } else {
          return '文字广告';
        }
      },
      relationTypeComputed() {
        let tempObj = this.relationType.find(item => item.value === this.advertisementDetail.relationType);
        if (tempObj) {
          return tempObj.label;
        } else {
          return advertisementDetail.relationType;
        }
      },
      validityPeriodComputed() {
        if (!this.advertisementDetail.endAt && !this.advertisementDetail.beginAt) {
          return '永久有效';
        } else {
          return this.advertisementDetail.beginAt + this.advertisementDetail.endAt;
        };
      }
    },
    methods: {
      deleteTable(ids) {
        this.loading = true;
        deleteAdvertisement({
          ids
        }).then(res => {
            let totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
            if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
              this.searchRowData.page -= 1;
            }
            this.tableDataSelected = [];
            this.getTableData();
          }
        ).catch(err => {
          this.loading = false;
        });
      },
      onRowClick(row, index) {
        this.advertisementDetail.advertiseRelation = row.id;
        console.log(row);
        console.log(index);
        this.relationTargetShow = false;
      },
      startTimeChange(value, date) {
        this.advertisementDetail.beginAt = value;
      },
      endTimeChange(value, date) {
        this.advertisementDetail.endAt = value;
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (this.advertisementDetail.isPermanent === 'OFF') {
            if (this.advertisementDetail.beginAt === '') {
              this.$Message.error('请填写开始时间!');
              return;
            }
            if (this.advertisementDetail.endAt === '') {
              this.$Message.error('请填写结束时间!');
              return;
            }
            if (compareData(this.advertisementDetail.beginAt, this.advertisementDetail.endAt)) {
              this.$Message.error('结束时间必须大于开始时间!');
              return;
            }
          }
          if (valid) {
            if (this.tempModalType === this.modalType.create) {
              //添加状态
              this.createTableRow();
            } else if (this.tempModalType === this.modalType.edit) {
              //编辑状态
              this.editTableRow();
            }
          } else {
            this.$Message.error('请完善商品的信息!');
          }
        });
      },
      editTableRow() {
        this.modalViewLoading = true;
        editAdvertisement({
          ...this.advertisementDetail
        }).then(res => {
          this.resetFields();
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        });
      },
      createTableRow() {
        this.modalViewLoading = true;
        createAdvertisement({...this.advertisementDetail}).then( res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.resetFields();
          this.getTableData();
        });
      },
      searchAdvertisementRelation() {
        if (this.advertisementDetail.relationType === null || this.advertisementDetail.relationType === '') {
          this.$Message.warning('请填写链接类型');
          return;
        }
        this.searchModalTableLoading = true;
        let tempObj = this.relationType.find(item => {
          return item.value === this.advertisementDetail.relationType;
        });
        console.log(tempObj);
        if (tempObj) {
          this.tempColumns = tempObj.columns;
          console.log(this.tempColumns);
          tempObj.api({
            page: 1,
            rows: 10,
            shelfStatus: 'ON'
          }).then(res => {
            this.searchModalTableLoading = false;
            this.relationTargetShow = true;
            this.tempModalTableData = res.array;
          });
        }
      },
      handleRemoveMain(file) {
        this.$refs.uploadMain.deleteFile(file);
        this.uploadListMain = [];
        this.advertisementDetail.content = null;
      },
      resetFields() {
        this.$refs.modalEdit.resetFields();
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.clearFileList();
        }
        this.uploadListMain = [];
        this.advertisementDetail = _.cloneDeep(advertisementDetail);
      },
      handleSuccessMain(response, file, fileList) {
        this.uploadListMain = fileList;
        this.advertisementDetail.content = null;
        this.advertisementDetail.content = fileList[0].url;
      },
      addChildren() {
        if (this.tempModalType !== this.modalType.create) {
          this.resetFields();
          this.tempModalType = this.modalType.create;
        }
        this.tempModalType = this.modalType.create;
        this.modalEdit = true;
      },
      resetSearchRowData() {
        this.searchRowData = _.cloneDeep(roleRowData);
      },
      handleView(params) {
        this.tempModalType = this.modalType.view;
        this.advertisementDetail = params.row;
        this.modalView = true;
      },
      handleEdit(params) {
        this.tempModalType = this.modalType.edit;

        this.loading = true;
        getAdvertisement({id: params.row.id}).then(res => {
          this.advertisementDetail = res;
          if (this.advertisementDetail.advertiseType === 'IMAGE') {
            this.setDefaultUploadList(params.row);
          };
          if (!this.advertisementDetail.endAt && !this.advertisementDetail.beginAt) {
            this.advertisementDetail.isPermanent = 'ON';
          } else {
            this.advertisementDetail.isPermanent = 'OFF';
          }
          this.loading = false;
          this.modalEdit = true;
        });

      },
      setDefaultUploadList(res) {
        if (res.content != null) {
          const map = {status: 'finished', url: 'url'};
          let mainImgArr = [];
          map.url = res.content;
          mainImgArr.push(map);
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          this.uploadListMain = mainImgArr;
        }
      },
      advertisementChange(value) {
        this.advertisementDetail.positionId = value;
      },
      advertiseTypeChange(value) {
        // if (value === 'WORD') {
        //   this.$refs.uploadMain.clearFileList();
        //   this.uploadListMain = [];
        // }
        // this.advertisementDetail.content = '';
      },
      advertiseRelationTypeChange(value) {
      },
      advertisementDetailStatusChange(value) {

      },
      getTableData() {
        getAdvertisementsPages(this.searchRowData).then(res => {
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

</style>
