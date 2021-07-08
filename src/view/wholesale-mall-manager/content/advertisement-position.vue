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
        @on-view="handleView"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.description"
            :clearable="true"
            placeholder="广告位描述"
            class="search-input mr5"
            style="width: auto"
          ></Input>
          <Input
            v-model="searchRowData.postionName"
            :clearable="true"
            placeholder="广告位英文名"
            class="search-input mr5"
            style="width: auto"
          ></Input>
          <Select
            v-model="searchRowData.timeLimited"
            :clearable="true"
            style="padding-right: 5px;width: 120px"
            placeholder="时间限制"
          >
            <Option
              v-for="item in timeLimitedEnum"
              :key="`search-col-${item.value}`"
              :value="item.value"
              class="ml15 mt10"
              style="padding-left: 5px"
            >{{ item.label }}</Option>
          </Select>
          <Select
            v-model="searchRowData.applicationType"
            :clearable="true"
            style="padding-right: 5px;width: 120px"
            placeholder="应用类型"
          >
            <Option
              v-for="item in appTypesEnum"
              :key="`search-col-${item.value}`"
              :value="item.value"
              class="ml15 mt10"
              style="padding-left: 5px"
            >{{ item.label }}</Option>
          </Select>
          <Select
            v-model="searchRowData.positionType"
            :clearable="true"
            style="padding-right: 5px;width: 120px"
            placeholder="广告位类型"
          >
            <Option
              v-for="item in advertisementPositionTypeEnum"
              :key="`search-col-${item.value}`"
              :value="item.value"
              class="ml15 mt10"
              style="padding-left: 5px"
            >{{ item.label }}</Option>
          </Select>
          <Button
            v-waves
            :loading="searchLoading"
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
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="createTableRow">
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
            :current="page"
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
        <span>广告位详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">ID:</i-col>
              <i-col span="18">{{ advertisementPositionDetail.id }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">广告位描述:</i-col>
              <i-col span="18">{{ advertisementPositionDetail.description }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">广告位英文名:</i-col>
              <i-col span="18">{{ advertisementPositionDetail.postionName }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">时间限制:</i-col>
              <i-col span="18">{{ advertisementPositionDetail.timeLimited | timeLimitedFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">应用类型:</i-col>
              <i-col span="18">{{ advertisementPositionDetail.applicationType | appTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">广告位类型:</i-col>
              <i-col
                span="18"
              >{{ advertisementPositionDetail.positionType | advertisementPositionTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!--编辑菜单 -->
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ tempModalType===modalType.edit?'修改广告位':'创建广告' }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="modalEdit"
          :label-width="100"
          :model="advertisementPositionDetail"
          :rules="ruleInline"
        >
          <FormItem label="广告位描述:" prop="description">
            <Input v-model="advertisementPositionDetail.description" placeholder="标题"></Input>
          </FormItem>
          <FormItem label="广告位英文名:" prop="postionName">
            <Input v-model="advertisementPositionDetail.postionName" placeholder="内容"></Input>
          </FormItem>
          <FormItem label="时间限制:" prop="timeLimited">
            <Select
              v-model="advertisementPositionDetail.timeLimited"
              placeholder="时间限制"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in timeLimitedEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="应用类型:" prop="applicationType">
            <Select
              v-model="advertisementPositionDetail.applicationType"
              placeholder="应用类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in appTypesEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="广告位类型:" prop="positionType">
            <Select
              v-model="advertisementPositionDetail.positionType"
              placeholder="广告位类型"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in advertisementPositionTypeEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit('modalEdit')">确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%">
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  getAdvertisementPosition,
  getAdvertisementPositionPages,
  createAdvertisementPosition,
  deleteAdvertisementPosition,
  editAdvertisementPosition
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import {
  appTypesEnum,
  timeLimitedEnum,
  advertisementPositionTypeEnum
} from '@/libs/enumerate';
import {
  appTypesConvert,
  timeLimitedConvert,
  advertisementPositionTypeConvert
} from '@/libs/converStatus';

const advertisementPositionDetail = {
  relationId: 0,
  id: 0,
  description: '',
  postionName: '',
  timeLimited: null,
  applicationType: 'S_MALL',
  positionType: null
};

const roleRowData = {
  description: '',
  postionName: '',
  timeLimited: null,
  applicationType: null,
  positionType: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      ruleInline: {
        description: [{ required: true, message: '请输入广告位描述' }],
        postionName: [{ required: true, message: '请输入广告位英文名' }],
        timeLimited: [{ required: true, message: '请选择时间限制类型' }],
        applicationType: [{ required: true, message: '请选择应用类型' }],
        positionType: [{ required: true, message: '请选择广告位类型' }]
      },
      appTypesEnum,
      timeLimitedEnum,
      advertisementPositionTypeEnum,
      columns: [
        // {
        //   title: '广告图',
        //   render: (h, params, vm) => {
        //     const { row } = params;
        //     const str = <img src={row.image} style='margin-top:5px' height='60' width='60' margin-top='10px'/>;
        //     return <div>{str}</div>;
        //   }
        // },
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '广告位描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '广告位英文名',
          align: 'center',
          key: 'postionName'
        },
        {
          title: '时间限制',
          align: 'center',
          key: 'timeLimited',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.timeLimited === 'LIMITED') {
              return (
                <div>
                  <tag color='primary'>
                    {timeLimitedConvert(row.timeLimited).label}
                  </tag>
                </div>
              );
            } else if (row.timeLimited === 'UNLIMITED') {
              return (
                <div>
                  <tag color='success'>
                    {timeLimitedConvert(row.timeLimited).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.timeLimited}</div>;
            }
          }
        },
        {
          title: '应用类型',
          key: 'applicationType',
          sortable: true,
          align: 'center',
          minWidth: 120,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.applicationType === 'S_MALL') {
              return (
                <div>
                  <tag color='green'>
                    {appTypesConvert(row.applicationType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.applicationType}</div>;
            }
          }
        },
        {
          title: '广告位类型',
          key: 'positionType',
          align: 'center',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.positionType === 'WORD') {
              return (
                <div>
                  <tag color='cyan'>
                    {advertisementPositionTypeConvert(row.positionType).label}
                  </tag>
                </div>
              );
            } else if (row.positionType === 'IMAGE') {
              return (
                <div>
                  <tag color='blue'>
                    {advertisementPositionTypeConvert(row.positionType).label}
                  </tag>
                </div>
              );
            } else if (row.positionType === 'CAROUSEL') {
              return (
                <div>
                  <tag color='purple'>
                    {advertisementPositionTypeConvert(row.positionType).label}
                  </tag>
                </div>
              );
            } else {
              return <div>{row.positionType}</div>;
            }
          }
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          minWidth: 120,
          options: ['view', 'edit', 'delete']
        }
      ],
      searchRowData: _.cloneDeep(roleRowData),
      advertisementPositionDetail: _.cloneDeep(advertisementPositionDetail),
      createLoading: false,
      modalViewLoading: false,
      modalEditLoading: false,
      defaultListMain: [],
      uploadListMain: []
    };
  },
  created() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
    },
    handleView(params) {
      this.loading = true;
      getAdvertisementPosition({ id: params.row.id })
        .then(res => {
          this.advertisementPositionDetail = res;
          this.modalView = true;
          this.loading = false;
        })
        .catch(() => {
          this.modalView = true;
          this.loading = false;
        });
    },
    getTableData() {
      // this.searchRowData.applicationType = this.applicationType;
      getAdvertisementPositionPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        })
        .catch(() => {
          this.loading = false;
          this.clearSearchLoading = false;
          this.searchLoading = false;
        });
    },
    // 删除
    deleteTable(ids) {
      this.loading = true;
      deleteAdvertisementPosition({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑分类
    handleEdit(params) {
      this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.edit;
      this.advertisementPositionDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    createTableRow() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.advertisementPositionDetail = _.cloneDeep(
          advertisementPositionDetail
        );
      }
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.advertisementPositionDetail = _.cloneDeep(
        advertisementPositionDetail
      );
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            // 添加状态
            this.createAdvertisementPosition();
          } else if (this.isEdit) {
            // 编辑状态
            this.editAdvertisementPosition();
          }
        } else {
          this.$Message.error('请完善广告位信息!');
        }
      });
    },
    createAdvertisementPosition() {
      this.modalViewLoading = true;
      createAdvertisementPosition(this.advertisementPositionDetail)
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
    editAdvertisementPosition() {
      this.modalViewLoading = true;
      editAdvertisementPosition(this.advertisementPositionDetail)
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
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.storeDetail.storeImage = null;
      this.storeDetail.storeImage = fileList[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
