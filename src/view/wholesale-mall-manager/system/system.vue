<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="18"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.indexName"
              placeholder="键"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.description"
              placeholder="描述"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Cascader
              :data="systemCategoryData"
              v-model="defaultSystemCategoryData"
              class="search-col mr5"
              @on-change="systemCategoryChange1"
            ></Cascader>
            <Button
              :searchLoading="searchLoading"
              class="search-btn mr5"
              type="primary"
              @click="handleSearch"
            >
              <Icon type="md-search" />&nbsp;搜索
            </Button>
            <Button
              v-waves
              :loading="clearSearchLoading"
              class="search-btn"
              type="info"
              @click="handleClear"
            >
              <Icon type="md-refresh" />&nbsp;清除
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add" />添加
          </Button>
          <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>系统参数详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">主键ID:</i-col>
              <i-col span="20">{{ systemDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">键:</i-col>
              <i-col span="20">{{ systemDetail.indexName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">值:</i-col>
              <i-col span="20">{{ systemDetail.indexValue }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">描述:</i-col>
              <i-col span="20">
                {{ systemDetail.description }}
                <img
                  v-if="showImage"
                  :src="systemDetail.description"
                  width="70%"
                >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">分类ID:</i-col>
              <i-col span="20">{{ systemDetail.categoryId }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">参数类型:</i-col>
              <i-col span="20">{{ systemDetail.showType | showTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000" :width="900">
      <p slot="header">
        <i-col>{{ isEdit?'修改系统参数':'创建系统参数' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="systemDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <i-col span="12">
              <FormItem label="键:" prop="indexName">
                <Input v-model="systemDetail.indexName" :disabled="isEdit" placeholder="键"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="分类ID:" prop="categoryId">
                <Cascader
                  :data="systemCategoryData"
                  v-model="defaultSystemCategoryData"
                  span="21"
                  @on-change="systemCategoryChange"
                ></Cascader>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="值:" prop="indexValue">
                <Input v-model="systemDetail.indexValue" :rows="6" :readonly="hasParamRule || noParamRule || systemDetail.showType==='time'" type="textarea" placeholder="值"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="描述:" prop="description">
                <Input v-model="systemDetail.description" :rows="3" type="textarea" placeholder="描述"></Input>
                <template v-if="showImage">
                  <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                    <template v-if="item.status === 'finished'">
                      <div>
                        <img :src="item.url" >
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
                </template>
                <IViewUpload
                  ref="uploadMain"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>

          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="参数类型:" prop="showType">
                <Select v-model="systemDetail.showType">
                  <Option
                    v-for="(item,index) in showTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row v-if="systemDetail.showType==='time'">
            <i-col span="12">
              <FormItem label="营业时间:" prop="orderTimeSpan">
                <TimePicker
                  type="timerange"
                  placement="bottom-end"
                  format="HH:mm"
                  placeholder="选择营业时间"
                  style="width: 168px"
                  confirm
                  @on-change="handleTimeChange"
                  @on-clear="handleTimeClear"></TimePicker>
              </FormItem>
            </i-col>
          </Row>
          <template v-if="hasParamRule">
            <Row v-for="(item,index) in paramObjectList" :key="index" type="flex" justify="start" class="mt10">
              <i-col span="10">
                <Row v-for="(objKey,index) in keys" :key="index" type="flex" justify="start">
                  <i-col span="12 mt5">
                    <Input v-model="item[objKey]" style="width:300px;" @on-change="handleInputChange">
                    <span slot="prepend">{{ findKeyName(objKey) }}</span>
                    </Input>
                  </i-col>
                </Row>
              </i-col>
              <i-col span="14 mt5">
                <Button v-waves size="small" type="primary" class="mr5" @click="handleAddParam">
                  <Icon type="md-add" />
                </Button>
                <Button v-waves size="small" type="error" class="mr5" @click="handleDelParam(index)">
                  <Icon type="md-trash" />
                </Button>
              </i-col>
            </Row>
          </template>
          <template v-else-if="noParamRule">
            <Row v-for="(item,index) in paramObjectList" v-show="paramObjectList.length>0" :key="index" type="flex" justify="start" class="mt10">
              <i-col span="9">
                <Input :value="item" style="width:300px;" @on-change="handleItemChange">
                <span slot="prepend">列表项</span>
                </Input>
              </i-col>
              <i-col span="12 mt5">
                <Button v-waves size="small" type="error" class="mr5" @click="handleDelItem(index)">
                  <Icon type="md-trash" />
                </Button>
              </i-col>
            </Row>
            <Row type="flex" justify="start" class="mt10">
              <i-col span="9">
                <Input v-model="newItem" style="width:300px;" @on-change="handleItemChange">
                <span slot="prepend">列表项</span>
                </Input>
              </i-col>
              <i-col span="12">
                <Button v-waves size="small" type="primary" class="mr5 mt5" @click="handleAddItem">
                  <Icon type="md-add" />
                </Button>
              </i-col>
            </Row>
          </template>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" >
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';

import {
  deleteSystemSetting,
  getSystemSettingPages,
  editSystemSetting,
  createSystemSetting,
  getSystemSettingCategoryTree
} from '@/api/wholesale';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import { showTypeEnum } from '@/libs/enumerate';
import { showTypeConvert } from '@/libs/converStatus';

import { buildMenu, convertTreeCategory, convertTree } from '@/libs/util';

const systemDetail = {
  id: 0,
  indexName: '',
  indexValue: '',
  description: '',
  categoryId: 0,
  paramRuleSetting: '',
  showType: '',
  orderTimeSpan: []
};

const roleRowData = {
  indexName: null,
  indexValue: null,
  categoryId: null,
  description: null,
  page: 1,
  rows: 10
};

const categoryRowData = {
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      showTypeEnum,
      systemCategoryData: [],
      defaultSystemCategoryData: [],
      systemCategoriesTreeList: [],
      defaultListMain: [],
      uploadListMain: [],
      paramRuleSetting: [],
      paramObjectList: [],
      paramObject: {},
      keys: [],
      newItem: '',
      showImage: false,
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      searchTreeRowData: _.cloneDeep(categoryRowData),
      systemDetail: _.cloneDeep(systemDetail),
      ruleInline: {
        showType: [{ required: true, message: '请选择参数类型' }],
        indexName: [{ required: true, message: '请输入键' }],
        indexValue: [{ required: true, message: '请输入值' }],
        categoryId: [
          { required: true, message: '请选择分类' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        ],
        description: [{ required: true, message: '请输入描述' }]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '键',
          align: 'center',
          key: 'indexName'
        },
        {
          title: '值',
          align: 'center',
          key: 'indexValue',
          type: 'html'
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '分类ID',
          align: 'center',
          key: 'categoryId',
          width: 80
        },
        {
          title: '参数类型',
          align: 'center',
          key: 'showType',
          minWidth: 60,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.showType === 'normal') {
              return <div>{showTypeConvert(row.showType).label}</div>;
            } else if (row.showType === 'list') {
              return <div>{showTypeConvert(row.showType).label}</div>;
            } else {
              return <div>{showTypeConvert(row.showType).label}</div>;
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ]
    };
  },
  computed: {
    hasParamRule() {
      return this.systemDetail.showType === 'list' && this.systemDetail.paramRuleSetting;
    },
    noParamRule() {
      return this.systemDetail.showType === 'list' && !this.systemDetail.paramRuleSetting;
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getSystemSettingCategoryTree();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.paramRuleSetting = [];
      this.uploadListMain = [];
      this.paramObjectList = [];
      this.keys = [];
      this.paramObject = {};
      this.systemDetail.description = null;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          console.log(this.systemDetail.indexValue);
          console.log(this.systemDetail.categoryId);
          this.systemDetail.indexValue = this.systemDetail.indexValue.replace(
            /\n|\r/g,
            '&'
          );
          if (this.isCreate) {
            // 添加状态
            this.createStore();
          } else if (this.isEdit) {
            // 编辑状态
            this.editStore();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createSystemSetting(this.systemDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editStore() {
      this.modalViewLoading = true;
      editSystemSetting(this.systemDetail)
        .then(res => {
          this.modalEdit = false;
          this.modalViewLoading = false;
          this.getTableData();
        })
        .catch(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.systemDetail = _.cloneDeep(systemDetail);
      }
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    handleAddParam() {
      // 添加参数对象
      const obj = {};
      this.keys.forEach(key => {
        obj[key] = '';
      });
      this.paramObjectList.push(obj);
      this.systemDetail.indexValue = JSON.stringify(this.paramObjectList);
    },
    handleDelParam(index) {
      // 删除参数对象
      this.paramObjectList.splice(index, 1);
      this.systemDetail.indexValue = JSON.stringify(this.paramObjectList);
    },
    handleAddItem() {
      this.paramObjectList.push(this.newItem);
      this.newItem = '';
      this.systemDetail.indexValue = this.paramObjectList.join(',');
    },
    handleDelItem(index) {
      // 删除参数对象
      this.paramObjectList.splice(index, 1);
      this.systemDetail.indexValue = this.paramObjectList.join(',');
    },
    handleItemChange() {
      this.systemDetail.indexValue = this.paramObjectList.join(',');
    },
    handleTimeChange(timerange) {
      // ["09:00", "09:00"]
      console.log('time:', timerange);
      this.systemDetail.orderTimeSpan = timerange;
      this.systemDetail.indexValue = timerange.join('-');
    },
    handleTimeClear() {
      this.systemDetail.orderTimeSpan = [];
      this.systemDetail.indexValue = '';
    },
    deleteTable(ids) {
      this.loading = true;
      deleteSystemSetting({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length == this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.systemDetail = _.cloneDeep(params.row);
      if (this.systemDetail.description != null) {
        this.showImage = this.systemDetail.description.indexOf('http') != -1;
      }
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.systemDetail.orderTimeSpan = [];
      this.tempModalType = this.modalType.edit;
      this.systemDetail = _.cloneDeep(params.row);
      if (this.systemDetail.description != null) {
        this.showImage = this.systemDetail.description.indexOf('http') != -1;
      }
      // 编辑时反填时间信息
      if (this.systemDetail.showType === 'time' && this.systemDetail.indexValue) {
        this.systemDetail.orderTimeSpan = this.systemDetail.indexValue.split('-');
        console.log('timespan', this.systemDetail.orderTimeSpan);
      }
      // 如果有参数配置参考则读取
      if (this.hasParamRule) {
        this.paramRuleSetting = JSON.parse(this.systemDetail.paramRuleSetting);
        this.paramRuleSetting.forEach(item => this.keys.push(item.key));
        // const obj = {};
        // this.keys.forEach(key => { obj[key] = ''; });
        // this.paramObject = _.cloneDeep(obj);
        // console.log('paramObject', this.paramObject);
      }

      if (this.hasParamRule && this.systemDetail.indexValue) {
        this.paramObjectList = JSON.parse(this.systemDetail.indexValue);
      }

      if (this.noParamRule && this.systemDetail.indexValue) {
        this.paramObjectList = this.systemDetail.indexValue.split(',');
      }

      this.setDefaultUploadList(this.systemDetail);
      this.defaultGoodsCategoryData = [];
      this.findGroupId(this.systemDetail.categoryId);
      this.defaultGoodsCategoryData.reverse();
      this.modalEdit = true;
    },
    findKeyName(key) {
      if (this.paramRuleSetting.length > 0) {
        return this.paramRuleSetting.find(item => item['key'] === key).name;
      }
    },
    getTableData() {
      getSystemSettingPages(this.searchRowData)
        .then(res => {
          if (res.rows.length !== 0) {
            res.rows.forEach(element => {
              // element.indexValue = element.indexValue.replace(/&/g, '<br>');
              element.indexValue =
                element.indexValue == null
                  ? null
                  : element.indexValue.replace(/&/g, '\n');
              // element.indexValue = element.indexValue.replace(/&/g, /\n/g);
            });
          }
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.imageDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.systemDetail.description = null;
      this.systemDetail.description = fileList[0].url;
    },
    getSystemSettingCategoryTree() {
      getSystemSettingCategoryTree()
        .then(res => {
          if (res && res.array.length > 0) {
            this.systemCategoriesTreeList = res.array;
            const menuList = buildMenu(res.array);
            console.log('menuList from server:', menuList);
            const map = {
              id: 'id',
              title: 'title',
              children: 'children'
            };
            this.systemCategoryData = convertTreeCategory(menuList, map, true);
            console.log('menuList after covert:', this.systemCategoryData);
            this.createLoading = false;
          }
        })
        .catch(() => {
          this.createLoading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.description != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.description;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    // 选择分类
    systemCategoryChange(value, selectedData) {
      if (selectedData.length > 0) {
        this.systemDetail.categoryId = selectedData[selectedData.length - 1].id;
      } else {
        this.systemDetail.categoryId = null;
      }
      this.defaultSystemCategoryData = selectedData;
    },
    // 选择分类搜索
    systemCategoryChange1(value, selectedData) {
      if (selectedData.length > 0) {
        this.searchRowData.categoryId =
          selectedData[selectedData.length - 1].id;
      } else {
        this.searchRowData.categoryId = null;
      }
      this.defaultSystemCategoryData = selectedData;
    },
    findGroupId(id) {
      const obj = this.systemCategoriesTreeList.find(item => {
        return item.id === id;
      });
      this.defaultSystemCategoryData.push(id);
      if (obj && obj.parentid !== 0) {
        this.findGroupId(obj.parentid);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
