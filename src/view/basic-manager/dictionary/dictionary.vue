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
        @on-edit="handleEdit"
        @on-delete="handleDelete"
        @on-relevance="addEntries"
      >
        <div slot="searchCondition">
          <Row>
            <Input v-model="searchRowData.dictionaryCode" placeholder="字典编码" class="search-input mr5" style="width: 200px" clearable></Input>
            <Button v-waves :loading="searchLoading" class="search-btn mr5" type="primary" @click="handleSearch">
              <Icon type="md-search"/>&nbsp;搜索
            </Button>
            <Button v-waves :loading="clearSearchLoading" class="search-btn" type="info" @click="handleClear">
              <Icon type="md-refresh"/>&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
            <Icon type="md-add"/>
            创建
          </Button>
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
            @on-page-size-change="changePageSize"></Page>
        </Row>
      </div>
    </Card>

    <!-- 查询详情 -->
    <Modal v-model="modalView" :mask-closable="false" :width="700">
      <p slot="header">
        <span>数据字典详情</span>
      </p>
      <div class="modal-content">
        <Row>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="6">字典名称:</i-col>
              <i-col span="16">{{ dictionaryDetail.name }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="6">字典编码:</i-col>
              <i-col span="16">{{ dictionaryDetail.code }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="6">字典描述:</i-col>
              <i-col span="16">{{ dictionaryDetail.description }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-if="dictionaryDetail.entries" class-name="mb10">
          <tables
            :columns="tempColumnsView"
            v-model="dictionaryDetail.entries"
            border
          ></tables>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <!-- 新增/修改数据字典 -->
    <Modal v-model="modalEdit" :mask-closable="false" :width="700">
      <p slot="header">
        <span>{{ dictionaryDetail.id == ''?'创建数据字典':'编辑数据字典' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="dictionaryDetail" :rules="ruleInline" :label-width="80">
          <Row>
            <i-col span="12">
              <FormItem label="父级字典:" prop="parentId">
                <Select
                  :remote="true"
                  :filterable="true"
                  :remote-method="remoteMethod"
                  :loading="dictionaryLoading"
                  v-model="dictionaryDetail.parentId"
                  :label="dictionaryDetail.code"
                  :placeholder="dictionaryDetail.parentId == 0 ? '0' : dictionaryDetail.parentId + ''"
                  style="width: 200px"
                  clearable
                >
                  <Option
                    v-for="(option, index) in optionsDictionary"
                    :value="option.id"
                    :key="index"
                    class="pb5 pt5 pl15"
                    @click.native="selectIndex(option)">
                    {{ option.code }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="字典名称:" prop="name">
                <Input v-model="dictionaryDetail.name" placeholder="字典名称" class="search-input mr5" style="width: 200px" ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="字典编码:" prop="code">
                <Input v-model="dictionaryDetail.code" :disabled="dictionaryDetail.id == '' ? false : true" placeholder="字典编码" class="search-input mr5" style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="字典描述:" prop="description">
                <Input v-model="dictionaryDetail.description" placeholder="字典描述" class="search-input mr5" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose('modalEdit')">关闭</Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">确定
        </Button>
      </div>
    </Modal>

    <!-- 新增/修改数据字典项 -->
    <Modal v-model="modalEntries" :mask-closable="false" :width="700">
      <p slot="header">
        <span>数据字典项管理</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEntries" :model="entry" :rules="ruleInEntry" :label-width="90">
          <Row>
            <i-col span="12">
              <FormItem label="字典编码:" prop="dictCode">{{ entry.dictCode }}
                <!-- <Input v-model="" placeholder="字典编码" class="search-input mr5" style="width: 200px"></Input> -->
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="字典项名称:" prop="name">
                <Input v-model="entry.name" placeholder="字典项名称" class="search-input mr5" style="width: 200px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="字典项编码:" prop="code">
                <Input v-model="entry.code" placeholder="字典项编码" class="search-input mr5" style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="排序序号:" prop="sort">
                <!-- <InputNumber :min="1" v-model="entry.sort" class="ml20"></InputNumber> -->
                <InputNumber :min="1" v-model="entry.sort" placeholder="排序序号" class="search-input mr5" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="附加参数:" prop="attach">
                <Input v-model="entry.attach" placeholder="字典编码" class="search-input mr5" style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Button v-waves :loading="addEntryLoading" span="4" class="search-btn ml20" type="primary" @click="addEntry('modalEntries')">
                <Icon type="md-add"/>&nbsp;添加
              </Button>
            </i-col>
          </Row>
          <tables
            :columns="tempColumnsView"
            v-model="dictionaryDetail.entries"
            :loading="tempTableLoading"
            border
            @on-delete="modalHandleDelete"
            @on-inline-edit="modalHandleEdit"
            @on-inline-save="modalHandleSave"
          ></tables>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEntriesClose">关闭</Button>
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { getDictionaryPages, getDictionary, createDictionary, deleteDictionary, editDictionary, createDictionaryEntry, deleteDictionaryEntry, editDictionaryEntry } from '@/api/basic';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import deleteMixin from '@/mixins/deleteMixin.js';

const dictionaryDetail = {
  'children': [
    null
  ],
  'code': '',
  'description': '',
  'entries': [
    {
      'attach': '',
      'code': '',
      'dictCode': '',
      'id': 0,
      'name': '',
      'sort': 1
    }
  ],
  'id': 0,
  'name': '',
  'parentId': 0
};

const entry = {
  'attach': '',
  'code': '',
  'dictCode': '',
  'id': 0,
  'name': '',
  'sort': 1
}

const commonTempColumns = [
  {
    title: '字典项名称',
    key: 'name',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('Input', {
            props: {
              value: params.row.name
            },
            on: {
              input: function(event) {
                params.row.name = event;
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.name);
      }
    }
  },
  {
    title: '字典项编码',
    key: 'code',
    minWidth: 100
  },
  {
    title: '排序',
    key: 'sort',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('InputNumber', {
            props: {
              value: params.row.sort
            },
            on: {
              input: function(event) {
                if (event > 0) {
                  params.row.sort = event;
                }
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.sort);
      }
    }
  },
  {
    title: '附加参数',
    key: 'attach',
    minWidth: 100,
    render: (h, params) => {
      if (params.row.isEdit) {
        return h('div', [
          h('Input', {
            props: {
              value: params.row.attach
            },
            on: {
              input: function(event) {
                params.row.attach = event;
              }
            }
          })
        ]);
      } else {
        return h('div', params.row.attach);
      }
    }
  }
];

const roleRowData = {
  includeChildren: true,
  dictionaryCode: '',
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables
  },
  mixins: [tableMixin, searchMixin, deleteMixin],
  data() {
    return {
      ruleInline: {
        name: [{ required: true, message: '请填写字典名称' }],
        code: [{ required: true, message: '请填写字典编码' }],
        description: [{ required: true, message: '请填写字典描述' }]
      },
      ruleInEntry: {
        dictCode: [{ required: true, message: '请填写字典编码' }],
        code: [{ required: true, message: '请填写字典项编码' }],
        name: [{ required: true, message: '请填写字典项名称' }],
        sort: [
          { required: true, message: '请输入序号' },
          { validator(rule, value, callback, source, options) {
            const errors = [];
            if (!/^[0-9]\d*$/.test(value)) {
              errors.push(new Error('必须为整数'));
            }
            callback(errors);
          } }]
      },
      tempColumnsView: [
        ...commonTempColumns,
        {
          title: '操作',
          minWidth: 100,
          key: 'handle',
          options: ['inlineEdit', 'delete']
        }
      ],
      columns: [
        {
          title: 'id',
          key: 'id',
          minWidth: 100
        },
        {
          title: '父级id',
          key: 'parentId',
          minWidth: 100
        },
        {
          title: '字典名称',
          key: 'name',
          minWidth: 150
        },
        {
          title: '字典编码',
          key: 'code',
          minWidth: 150
        },
        {
          title: '字典描述',
          key: 'description',
          minWidth: 150
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'handle',
          options: ['view', 'edit', 'delete', 'relevance']
        }
      ],
      options: [
        {
          title: '操作',
          minWidth: 80,
          key: 'handle',
          options: ['delete']
        }
      ],
      modalViewLoading: false,
      tempDetailList: [],
      searchRowData: this._.cloneDeep(roleRowData),
      dictionaryDetail: dictionaryDetail,
      entry: entry,
      optionsDictionary: [],
      dictionaryLoading: false,
      modalEntries: false,
      modalEntriesLoading: false,
      addEntryLoading: false,
      tempTableLoading: false,
      beforeEditEntry: {}
    };
  },
  computed: {
    modalTypeComputed() {
      return this.tempModalType === this.modalType.view;
    },
    tableColumnComputed() {
      if (this.modalTypeComputed) {
        return this.postageRuleTableColumns;
      } else {
        console.log(this.postageRuleTableColumns.concat(this.options));
        return this.postageRuleTableColumns.concat(this.options);
      }
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleDelete(params) {
      this.loading = true;
      deleteDictionary({ code: params.row.code }).then(res => {
        const totalPage = Math.ceil(this.total / this.searchRowData.pageSize);
        if (this.tableData.length == this.tableDataSelected.length && this.searchRowData.page === totalPage && this.searchRowData.page !== 1) {
          this.searchRowData.page -= 1;
        }
        this.tableDataSelected = [];
        this.getTableData();
      }
      ).catch(() => {
        this.loading = false;
      });
    },
    handleSubmit(name) {
      // return;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.tempModalType === this.modalType.create) {
            // 添加状态
            this.createTableRow();
          } else if (this.tempModalType === this.modalType.edit) {
            // 编辑状态
            this.editTableRow();
          }
          console.log(JSON.stringify(this.dictionaryDetail));
        } else {
          this.$Message.error('请完善字典信息!');
        }
      });
    },
    createTableRow() {
      this.modalViewLoading = true;
      this.loading = true;
      createDictionary(this.dictionaryDetail).then(res => {
        this.modalViewLoading = false;
        this.loading = false;
        this.modalEdit = false;
        this.$Message.success('创建成功!');
        this.getTableData();
        this.$refs['modalEdit'].resetFields();
      }).catch(() => {
        this.modalViewLoading = false;
        this.loading = false;
        this.modalEdit = true;
      });
    },
    editTableRow() {
      this.modalViewLoading = true;
      this.loading = true;
      editDictionary(this.dictionaryDetail).then(res => {
        this.modalViewLoading = false;
        this.loading = false;
        this.$Message.success('编辑成功!');
        this.modalEdit = false;
        this.getTableData();
        this.$refs['modalEdit'].resetFields();
      }).catch(res => {
        this.modalViewLoading = false;
        this.loading = false;
        this.modalEdit = true;
      });
    },
    handleAdd() {
      this.tempModalType = this.modalType.create;
      this.dictionaryDetail = dictionaryDetail;
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.dictionaryDetail = this._.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.dictionaryDetail = this._.cloneDeep(params.row);
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    getTableData() {
      getDictionaryPages(this.searchRowData).then(res => {
        this.tableData = res.array;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      }).catch(() => {
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.handleSearchAutoComplete(query);
      } else {
        this.optionsDictionary = [];
      }
    },
    handleSearchAutoComplete(value) {
      this.dictionaryLoading = true;
      getDictionaryPages({
        page: '1',
        rows: '5',
        dictionaryCode: value + ''
      }).then(res => {
        if (res.array.length > 0) {
          this.optionsDictionary.length = 0;
          this.optionsDictionary = this.optionsDictionary.concat(res.array);
        }
        this.dictionaryLoading = false;
      });
    },
    selectIndex(options) {
      this.dictionaryDetail.parentId = options.id;
    },
    addEntries(params) {
      this.dictionaryDetail = this._.cloneDeep(params.row);
      this.dictionaryDetail.entries.forEach(element => {
        element.isEdit = false;
      });
      this.entry.dictCode = params.row.code;
      this.modalEntries = true;
    },
    addEntry(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modalEntriesLoading = true;
          createDictionaryEntry(this.entry).then(res => {
            this.modalEntriesLoading = false;
            this.$Message.success('创建成功!');
            this.getTableData();
            const obj = this._.cloneDeep(this.entry);
            obj.isEdit = false;
            this.dictionaryDetail.entries.push(obj);
            this.entry = {};
            this.entry.dictCode = obj.dictCode;
            this.entry.sort = 1;
            this.$refs[name].resetFields();
          }).catch(() => {
            this.modalEntriesLoading = false;
            this.loading = false;
          });
        } else {
          this.$Message.error('请完善字典信息!');
        }
      });
    },
    modalHandleEdit(params) {
      this.$set(params.row, 'isEdit', true);
      this.beforeEditEntry = this._.cloneDeep(params.row);
    },
    // 行内编辑保存
    modalHandleSave(params) {
      if (JSON.stringify(this.beforeEditEntry) !== JSON.stringify(params.row)) {
        if (params.row.dictCode !== null && params.row.code !== null && params.row.name !== null) {
          this.tempTableLoading = true;
          editDictionaryEntry(params.row).then(res => {
            this.$Message.success('修改成功!');
            this.getTableData();
          }).catch(() => {
            this.tempTableLoading = false;
          }).finally(res => {
            this.tempTableLoading = false;
            this.$set(params.row, 'isEdit', false);
          });
        } else {
          this.$Message.error('请完善信息!');
        }
      } else {
        this.$set(params.row, 'isEdit', false);
      }
    },
    modalHandleDelete(params) {
      this.tempTableLoading = true;
      deleteDictionaryEntry({ dictCode: params.row.dictCode, code: params.row.code }).then(res => {
        this.tempTableLoading = false;
        this.$Message.success('删除成功!');
        this.dictionaryDetail.entries = params.tableData.filter((item, index) => index !== params.row.initRowIndex);
        this.getTableData();
      }).catch(() => {
        this.tempTableLoading = false;
      });
    },
    handleEntriesClose() {
      this.loading = false;
      this.modalEntries = false;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
