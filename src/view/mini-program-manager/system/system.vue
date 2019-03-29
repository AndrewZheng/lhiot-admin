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
            >
            </Input>
            <Input
              v-model="searchRowData.description"
              placeholder="描述"
              class="search-input mr5"
              style="width: auto"
              clearable
            >
            </Input>
            <Button :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add"/>
            创建
          </Button>
          <Poptip
            confirm
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
          <Page
            :total="total"
            :current="searchRowData.page"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <Modal
      v-model="modalView"
      :mask-closable="false"
    >
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
              <i-col span="20">{{ systemDetail.description }}</i-col>
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
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalEdit"
      style="z-index: 1000"
    >
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改系统参数':'创建系统参数' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="systemDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <Col span="12">
            <FormItem label="键:" prop="indexName">
              <Input v-model="systemDetail.indexName" placeholder="键"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="值:" prop="indexValue">
              <Input v-model="systemDetail.indexValue" placeholder="值"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="描述:" prop="description">
              <Input v-model="systemDetail.description" placeholder="描述"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="分类id:" prop="categoryId">
              <InputNumber :min="0" v-model="systemDetail.categoryId" placeholder="分类id"></InputNumber>
            </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import {
  deleteSystemSetting,
  getSystemSettingPages,
  editSystemSetting,
  createSystemSetting
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const systemDetail = {
  id: 0,
  indexName: '',
  indexValue: '',
  description: '',
  categoryId: 0
};

const roleRowData = {
  indexName: null,
  indexValue: null,
  categoryId: null,
  description: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [uploadMixin, deleteMixin, tableMixin, searchMixin],
  data() {
    return {
      ruleInline: {
        indexName: [
          { required: true, message: '请选择键' }
        ],
        indexValue: [
          { required: true, message: '请选择值' }
        ],
        // 后期分类做完 取消注释
        // categoryId: [
        //   { required: true, message: '请输入分类ID' },
        //   { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
        // ],
        description: [
          { required: true, message: '请输入描述' }
        ]
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
          width: 80
        },
        {
          title: '键',
          key: 'indexName'
        },
        {
          title: '值',
          key: 'indexValue'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '分类id',
          key: 'categoryId'
        },
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      systemDetail: _.cloneDeep(systemDetail)
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {
  },
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStore();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editStore();
          }
        } else {
          this.$Message.error('请完善商品的信息!');
        }
      });
    },
    createStore() {
      this.modalViewLoading = true;
      createSystemSetting(this.systemDetail).then(res => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
      }).catch(() => {
        this.modalViewLoading = false;
        this.modalEdit = false;
      });
    },
    editStore() {
      this.modalViewLoading = true;
      editSystemSetting(this.systemDetail).then(res => {
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      }).catch(() => {
        this.modalEdit = false;
        this.modalViewLoading = false;
      });
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.systemDetail = _.cloneDeep(systemDetail)
      }
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.id);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteSystemSetting({
        ids
      }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(err => {
        console.log(err);
        this.loading = false;
      });
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.systemDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.systemDetail = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    getTableData() {
      getSystemSettingPages(this.searchRowData).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
