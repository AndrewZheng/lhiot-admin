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
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.description"
              placeholder="套餐周期描述"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
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
              <Icon type="md-refresh" />&nbsp;清除条件
            </Button>
          </Row>
        </div>
        <div slot="operations">
          <Button v-waves type="success" class="mr5" @click="handleAdd">
            <Icon type="md-add" />创建
          </Button>
          <Button type="error" class="mr5" @click="handleDeleteBatch">
            <Icon type="md-trash" />删除
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
            @on-page-size-change="changePageSize"
          ></Page>
        </Row>
      </div>
    </Card>

    <Modal v-model="modalView" :mask-closable="false">
      <p slot="header">
        <span>规格基础数据</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">套餐规格描述:</i-col>
              <i-col span="20">{{ rowData.description }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">套餐规格数量:</i-col>
              <i-col span="20">{{ rowData.quantity }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="4">套餐规格配图:</i-col>
              <i-col span="20">
                <img :src="rowData.image" style="width: 390px; height:160px" >
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :mask-closable="false" :z-index="1000">
      <p slot="header">
        <span>{{ tempModalType===modalType.edit ?'修改规格基础数据':'创建规格基础数据' }}</span>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="rowData" :rules="ruleInline" :label-width="110">
          <Row>
            <Col span="13">
            <FormItem label="套餐规格描述:" prop="description">
              <Input v-model="rowData.description" placeholder="套餐规格描述"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="15">
            <FormItem label="套餐规格数量:" prop="quantity">
              <InputNumber
                v-model="rowData.quantity"
                :min="1"
                placeholder="套餐规格数量"
                style="width:150px"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="套餐规格配图: 建议尺寸;400x400(单位:px):" prop="image">
              <Input v-show="false" v-model="rowData.image" style="width: auto"></Input>
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
              <IViewUpload
                ref="uploadMain"
                :default-list="defaultListMain"
                :image-size="imageSize"
                @on-success="handleSuccessMain"
              >
                <div slot="content">
                  <Button type="primary">上传图片</Button>
                </div>
              </IViewUpload>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('modalEdit','innerModalEdit')"
        >确定</Button>
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="View Image">
      <img :src="imgUploadViewItem" style="width: 100%" >
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import {
  getCustomPlanSpecificationStandardsPages,
  deleteCustomPlanSpecificationStandard,
  addCustomPlanSpecificationStandard,
  editCustomPlanSpecificationStandard
} from '@/api/fruitermaster';
import tableMixin from '@/mixins/tableMixin.js';
import uploadMixin from '@/mixins/uploadMixin';
import IViewUpload from '_c/iview-upload';

const customPlanSpecificationStandard = {
  description: '',
  id: 0,
  image: '',
  quantity: 0
};

const roleRowData = {
  description: '',
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
      modalViewLoading: false,
      model: [],
      customPlanSectionData: [],
      topRuleInline: false,
      ruleInline: {
        description: [{ required: true, message: '请填写描述' }],
        image: [{ required: true, message: '请上传图片' }],
        quantity: [
          { required: true, message: '请填写数量' },
          { message: '必须为非零整数', pattern: /^[1-9]\d*$/ }
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
          title: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '套餐周期配图',
          align: 'center',
          key: 'image',
          render: (h, params, vm) => {
            const { row } = params;
            const str = (
              <img
                src={row.image}
                style='margin-top:5px'
                height='100'
                width='250'
                margin-top='10px'
              />
            );
            return <div>{str}</div>;
          }
        },
        {
          title: '套餐周期描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '套餐周期数量',
          align: 'center',
          key: 'quantity'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          options: ['view', 'edit', 'delete']
        }
      ],
      uploadListMain: [],
      defaultListMain: [],
      searchRowData: this._.cloneDeep(roleRowData),
      rowData: customPlanSpecificationStandard,
      modalEdit: false,
      exportType: 'xlsx',
      downloadLoading: false,
      ids: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.rowData.id === 0) {
            this.modalViewLoading = true;
            this.loading = true;
            addCustomPlanSpecificationStandard(this.rowData)
              .then(res => {
                this.$Message.success('创建成功!');
                this.getTableData();
                this.modalEdit = false;
              })
              .finally(res => {
                this.modalViewLoading = false;
              });
          } else {
            this.modalViewLoading = true;
            this.loading = true;
            editCustomPlanSpecificationStandard(this.rowData)
              .then(res => {
                this.$Message.success('修改成功!');
                this.getTableData();
                this.modalEdit = false;
              })
              .finally(res => {
                this.modalViewLoading = false;
              });
          }
        } else {
          this.$Message.warn('请完善周套餐/月套餐信息');
        }
      });
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.rowData.image = null;
      this.rowData.image = fileList[0].url;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.rowData.image = null;
    },
    handleView(params) {
      this.tempModalType = this.modalType.view;
      this.rowData = params.row;
      this.modalView = true;
    },
    handleAdd() {
      this.$refs.modalEdit.resetFields();
      this.tempModalType = this.modalType.create;
      this.rowData = customPlanSpecificationStandard;
      this.uploadListMain = [];
      this.modalEdit = true;
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
    },
    resetSearchRowData() {
      this.clearSearchLoading = true;
      this.searchRowData = this._.cloneDeep(roleRowData);
      this.getTableData();
    },
    handleEdit(params) {
      this.tempModalType = this.modalType.edit;
      this.rowData = _.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.$refs.modalEdit.resetFields();
      this.modalEdit = true;
    },
    setDefaultUploadList(res) {
      if (res.image != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.image;
        if (this.$refs.uploadMain) {
          mainImgArr.push(map);
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        }
        this.uploadListMain = mainImgArr;
      }
    },
    getTableData() {
      getCustomPlanSpecificationStandardsPages(this.searchRowData)
        .then(res => {
          this.tableData = res.array;
          this.total = res.total;
        })
        .finally(res => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    deleteTable(ids) {
      this.loading = true;
      deleteCustomPlanSpecificationStandard({
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
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleDeleteBatch() {
      if (this.ids.length !== 0) {
        const ids = this.ids;
        deleteCustomPlanSpecificationStandard({
          ids
        })
          .then(res => {
            const totalPage = Math.ceil(
              this.total / this.searchRowData.pageSize
            );
            if (
              this.tableData.length === this.tableDataSelected.length &&
              this.searchRowData.page === totalPage &&
              this.searchRowData.page !== 1
            ) {
              this.searchRowData.page -= 1;
            }
            this.tableDataSelected = [];
            this.getTableData();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$Message.error('请至少选择一行记录');
      }
    },
    onSelectionChange(selection) {
      this.ids = selection.map(item => item.id.toString());
      console.log('选择变化,当前页选择ids:' + this.ids);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
