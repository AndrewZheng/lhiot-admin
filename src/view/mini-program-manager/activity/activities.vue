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
        @on-sale="handleSwitch"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityCode"
              placeholder="活动编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Button
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
          </Row>
        </div>
        <div slot="operations">
          <Button
            v-waves
            :loading="createLoading"
            type="success"
            class="mr5"
            @click="addActivities"
          >
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
        <span>活动信息详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动ID:
              </i-col>
              <i-col span="18">
                {{ activityDetail.id }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动编码:
              </i-col>
              <i-col span="18">
                {{ activityDetail.activityCode }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动名称:
              </i-col>
              <i-col span="18">
                {{ activityDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动状态:
              </i-col>
              <i-col v-if="activityDetail.onOff === 'ON'" span="18">
                <tag color="success">
                  {{ "开启" | imageStatusFilter }}
                </tag>
              </i-col>
              <i-col v-else-if="activityDetail.onOff === 'OFF'" span="18">
                <tag color="error">
                  {{ "关闭" | imageStatusFilter }}
                </tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动链接:
              </i-col>
              <i-col span="18">
                {{ activityDetail.activityUrl }}
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">
          关闭
        </Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改活动':'创建活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="activityDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="18">
            <FormItem label="活动编码:" prop="activityCode">
              <Input v-model="activityDetail.activityCode"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动名称:" prop="activityName">
              <Input v-model="activityDetail.activityName"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动状态:" prop="onOff">
              <Select v-model="activityDetail.onOff" clearable>
                <Option
                  v-for="(item,index) in imageStatusEnum"
                  :key="index"
                  :value="item.value"
                  class="ptb2-5"
                  style="padding-left: 5px;width: 100%"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动详情链接:" prop="activityUrl">
              <Input v-model="activityDetail.activityUrl"></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  deleteActivities,
  getActivitiesPages,
  editActivities,
  createActivities
} from '@/api/mini-program';
import tableMixin from '@/mixins/tableMixin.js';
import { imageStatusConvert } from '@/libs/converStatus';
import { imageStatusEnum } from '@/libs/enumerate';

const activityDetail = {
  id: 0,
  activityCode: '',
  activityName: '',
  onOff: '',
  activityUrl: ''
};

const rowData = {
  activityCode: null,
  activityName: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      imageStatusEnum,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '活动ID',
          align: 'center',
          key: 'id',
          width: 100
        },
        {
          title: '活动编码',
          align: 'center',
          key: 'activityCode'
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName'
        },
        {
          title: '活动状态',
          align: 'center',
          width: 120,
          key: 'onOff',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.onOff === 'ON') {
              return (
                <div>
                  <tag color='success'>
                    {imageStatusConvert(row.onOff).label}
                  </tag>
                </div>
              );
            } else if (row.onOff === 'OFF') {
              return (
                <div>
                  <tag color='error'>{imageStatusConvert(row.onOff).label}</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.onOff}</tag>
              </div>
            );
          }
        },
        {
          title: '活动详情链接',
          align: 'center',
          key: 'activityUrl',
          width: 130
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          key: 'handle',
          options: ['onSale', 'view', 'edit', 'delete']
        }
      ],
      ruleInline: {
        activityCode: [{ required: true, message: '请输入活动编码' }],
        activityName: [{ required: true, message: '请输入活动名称' }],
        onOff: [{ required: true, message: '请选择活动状态' }]
      },
      searchRowData: _.cloneDeep(rowData),
      activityDetail: _.cloneDeep(activityDetail)
    };
  },
  mounted() {
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(rowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.activityDetail.storeImage = null;
    },
    getTableData() {
      this.loading = true;
      getActivitiesPages(this.searchRowData)
        .then(res => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handleSwitch(params) {
      this.activityDetail = this._.cloneDeep(params.row);
      this.activityDetail.onOff = params.row.onOff === 'ON' ? 'OFF' : 'ON';
      this.editActivities();
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.activityDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activityDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.createActivities();
          } else if (this.isEdit) {
            this.editActivities();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createActivities() {
      this.modalEditLoading = true;
      createActivities(this.activityDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    editActivities() {
      this.modalEditLoading = true;
      editActivities(this.activityDetail)
        .then(res => {
          this.modalEdit = false;
          this.$Message.success('操作成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    addActivities() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.activityDetail = _.cloneDeep(activityDetail);
      this.modalEdit = true;
    },
    deleteTable(ids) {
      deleteActivities({
        ids
      })
        .then(res => {
          const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.searchRowData.page === totalPage &&
            this.searchRowData.page !== 1
          ) {
            this.searchRowData.page -= 1;
          }
          this.tableDataSelected = [];
          this.getTableData();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
