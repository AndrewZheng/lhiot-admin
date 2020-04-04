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
        @on-edit="handleEdit"
        @on-delete="handleDelete"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.area"
              placeholder="区域编码"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.areaName"
              placeholder="区域名称"
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
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStoreArea">
            <Icon type="md-add" />添加
          </Button>
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

    <!-- 修改 -->
    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <span>门店区域信息</span>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="storeArea" :rules="ruleInline" :label-width="80">
          <Row>
            <i-col span="24">
              <FormItem label="区域编码:" prop="area" style="width:300px">
                <Input v-model="storeArea.area"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="区域名称:" prop="areaName" style="width:300px">
                <Input v-model="storeArea.areaName"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';

import {
  deleteStoreArea,
  getStoreAreaPages,
  editStoreArea,
  createStoreArea
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';

const storeArea = {
  area: '',
  areaName: '',
  createTime: '',
  id: 0
};

const rowData = {
  aera: '',
  areaName: '',
  sidx: 'id',
  sort: 'asc',
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
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(rowData),
      storeArea: _.cloneDeep(storeArea),
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'id',
          align: 'center',
          minWidth: 40
        },
        {
          title: '区域编码',
          key: 'area',
          align: 'center',
          minWidth: 100
        },
        {
          title: '区域名称',
          align: 'center',
          key: 'areaName',
          minWidth: 150
        },
        {
          title: '创建时间',
          align: 'center',
          minWidth: 130,
          key: 'createTime'
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 230,
          key: 'handle',
          options: ['edit']
        }
      ],
      ruleInline: {
        area: [
          { required: true, message: '请输入区域编码' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        areaName: [{ required: true, message: '请输入区域名称' }]
      }
    };
  },
  mounted() {
    this.searchRowData = _.cloneDeep(rowData);
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
    },
    getTableData() {
      this.loading = true;
      this.searchLoading = true;
      this.clearSearchLoading = true;
      getStoreAreaPages(this.searchRowData)
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
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.storeArea = _.cloneDeep(params.row);
      this.modalEdit = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createStoreArea();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editStoreArea();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createStoreArea() {
      this.modalViewLoading = true;
      createStoreArea(this.storeArea)
        .then(res => {
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
        });
    },
    editStoreArea() {
      this.modalViewLoading = true;
      editStoreArea(this.storeArea)
        .then(res => {
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalEdit = false;
          this.modalViewLoading = false;
        });
    },
    addStoreArea() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.storeArea = _.cloneDeep(storeArea);
      }
      this.modalEdit = true;
    },
    deleteTable(ids) {
      this.loading = true;
      deleteStoreArea({
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>