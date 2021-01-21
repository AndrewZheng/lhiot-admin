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
        @on-sale="onOff"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动标题"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间起"
              class="search-input"
              style="width: 150px"
              @on-change="startTimeChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.endTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间止"
              class="search-input mr5"
              style="width: 150px"
              @on-change="endTimeChange"
            />
            <Select
              v-model="searchRowData.onOff"
              placeholder="活动状态"
              style="padding-right: 5px;width: 100px"
              clearable
            >
              <Option
                v-for="(item,index) in imageStatusEnum"
                :key="index"
                :value="item.value"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >
                {{ item.label }}
              </Option>
            </Select>
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
            @click="addRandomDiscount"
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
        <span>随机立减活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动名称:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.activityName }}
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
              <i-col v-if="randomDiscountDetail.onOff === 'ON'" span="16">
                <tag color="success">
                  {{ "有效" }}
                </tag>
              </i-col>
              <i-col v-else-if="randomDiscountDetail.onOff === 'OFF'" span="16">
                <tag color="error">
                  {{ "无效" }}
                </tag>
              </i-col>
              <i-col v-else-if="randomDiscountDetail.onOff === null" span="16">
                {{ "N/A" }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                开始时间:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.startTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                结束时间:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.endTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                最低立减金额:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.minFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                最高立减金额:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.maxFee | fenToYuanDot2Filters }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建人:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.createUser }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                创建时间:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.createTime }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                更新时间:
              </i-col>
              <i-col span="18">
                {{ randomDiscountDetail.updateTime }}
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

    <Modal v-model="modalEdit" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType===modalType.edit?'修改随机立减活动':'创建随机立减活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="modalEdit" :model="randomDiscountDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="18">
            <FormItem label="活动名称:" prop="activityName">
              <Input v-model="randomDiscountDetail.activityName" placeholder="活动名称"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="活动状态:" prop="onOff">
              <Select v-model="randomDiscountDetail.onOff" clearable>
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
            <FormItem label="开启时间:" prop="startTime">
              <DatePicker
                v-model="randomDiscountDetail.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期起"
                class="search-input"
                style="width: 170px"
                @on-change="startTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="结束时间:" prop="endTime">
              <DatePicker
                v-model="randomDiscountDetail.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期止"
                class="search-input"
                style="width: 170px"
                @on-change="endTimeChange"
              />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="最低立减金额:" prop="minFee">
              <InputNumber
                :min="0"
                :value="minFeeComputed"
                placeholder="最低立减金额"
                style="width: 170px"
                @on-change="minFeeInputNumberOnChange"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="最高立减金额:" prop="maxFee">
              <InputNumber
                :min="0"
                :value="maxFeeComputed"
                placeholder="最高立减金额"
                style="width: 170px"
                @on-change="maxFeeInputNumberOnChange"
              ></InputNumber>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('modalEdit')">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteRandomDiscount,
  getRandomDiscountPages,
  editRandomDiscount,
  createRandomDiscount
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import { couponStatusConvert, imageStatusConvert } from '@/libs/converStatus';
import { couponStatusEnum, imageStatusEnum } from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareData
} from '@/libs/util';

const randomDiscountDetail = {
  id: 0,
  activityName: '',
  startTime: null,
  endTime: null,
  onOff: null,
  minFee: 0,
  maxFee: 0,
  createTime: null,
  updateTime: null,
  createUser: ''
};

const roleRowData = {
  activityName: null,
  startTime: null,
  endTime: null,
  onOff: null,
  page: 1,
  rows: 10
};

export default {
  components: {
    Tables,
    IViewUpload
  },
  mixins: [uploadMixin, tableMixin],
  data() {
    return {
      ruleInline: {
        activityName: [{ required: true, message: '请输入活动名称' }],
        minFee: [
          { required: true, message: '请输入最低立减金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        maxFee: [
          { required: true, message: '请输入最高立减金额' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        onOff: [{ required: true, message: '请选择活动状态' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }]
      },
      defaultListMain: [],
      uploadListMain: [],
      areaList: [],
      couponStatusEnum,
      imageStatusEnum,
      columns: [
        {
          type: 'selection',
          align: 'center',
          width: 60,
          align: 'center'
        },
        {
          title: '主键ID',
          align: 'center',
          key: 'id'
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName'
        },
        {
          title: '活动状态',
          key: 'onOff',
          align: 'center',
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
            return <div>{row.onOff}</div>;
          }
        },
        {
          title: '活动开启时间',
          align: 'center',
          key: 'startTime',
          width: 160
        },
        {
          title: '活动结束时间',
          align: 'center',
          key: 'endTime',
          width: 160
        },
        {
          title: '最低立减金额',
          align: 'center',
          key: 'minFee'
        },
        {
          title: '最高立减金额',
          align: 'center',
          key: 'maxFee'
        },
        {
          title: '创建人',
          align: 'center',
          key: 'createUser'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          width: 160
        },
        {
          title: '更新时间',
          align: 'center',
          key: 'updateTime',
          width: 160
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 80,
          key: 'handle',
          options: ['onSale', 'view', 'edit', 'delete']
        }
      ],
      createLoading: false,
      modalViewLoading: false,
      searchRowData: _.cloneDeep(roleRowData),
      randomDiscountDetail: _.cloneDeep(randomDiscountDetail)
    };
  },
  computed: {
    minFeeComputed() {
      return fenToYuanDot2Number(this.randomDiscountDetail.minFee);
    },
    maxFeeComputed() {
      return fenToYuanDot2Number(this.randomDiscountDetail.maxFee);
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
  },
  created() {},
  methods: {
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetFields() {
      this.$refs.modalEdit.resetFields();
      // this.$refs.uploadMain.clearFileList();
      this.uploadListMain = [];
      this.randomDiscountDetail.shareImageUrl = null;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            compareData(
              this.randomDiscountDetail.startTime,
              this.randomDiscountDetail.endTime
            )
          ) {
            this.$Message.error('结束时间必须大于开始时间!');
            return;
          } else if (
            this.randomDiscountDetail.minFee > this.randomDiscountDetail.maxFee
          ) {
            this.$Message.error('最低立减金额不能大于最高立减金额');
            return;
          }
          if (this.isCreate) {
            // 添加状态
            this.createRandomDiscount();
          } else if (this.isEdit) {
            // 编辑状态
            this.editRandomDiscount();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRandomDiscount() {
      this.modalViewLoading = true;
      createRandomDiscount(this.randomDiscountDetail)
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
    editRandomDiscount() {
      this.modalViewLoading = true;
      editRandomDiscount(this.randomDiscountDetail)
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
    addRandomDiscount() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.randomDiscountDetail = _.cloneDeep(randomDiscountDetail);
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
      deleteRandomDiscount({
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
      this.randomDiscountDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.randomDiscountDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(this.randomDiscountDetail);
      this.modalEdit = true;
    },
    getTableData() {
      getRandomDiscountPages(this.searchRowData)
        .then(res => {
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
    onOff(params) {
      this.randomDiscountDetail = this._.cloneDeep(params.row);
      if (params.row.onOff === 'ON') {
        this.randomDiscountDetail.onOff = 'OFF';
      } else {
        this.randomDiscountDetail.onOff = 'ON';
      }
      this.loading = true;
      this.editRandomDiscount();
    },
    startTimeChange(value, date) {
      this.randomDiscountDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.randomDiscountDetail.endTime = value;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.randomDiscountDetail.shareImageUrl = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.randomDiscountDetail.shareImageUrl = null;
      this.randomDiscountDetail.shareImageUrl = fileList[0].url;
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.shareImageUrl != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.shareImageUrl;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    minFeeInputNumberOnChange(value) {
      this.randomDiscountDetail.minFee = yuanToFenNumber(value);
    },
    maxFeeInputNumberOnChange(value) {
      this.randomDiscountDetail.maxFee = yuanToFenNumber(value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
