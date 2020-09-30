<template>
  <div class="m-role">
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
        :search-area-column="16"
        :operate-area-column="6"
        editable
        searchable
        border
        search-place="top"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-sale="handleStatus"
        @on-delete="handleDelete"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.title"
            placeholder="广告名称"
            class="search-input mr5"
            style="width: 150px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.advertmentPosition"
            :disable="selectDisable"
            class="search-col mr5"
            placeholder="广告位置"
            style="width: 150px"
            clearable
          >
            <Option
              v-for="item in advPositionEnum"
              :key="item.value"
              :value="item.value"
              class="pt5 pb5 pl15"
              >{{ item.label }}</Option
            >
          </Select>
          <Select
            v-model="searchRowData.vaild"
            class="search-col mr5"
            placeholder="广告状态"
            style="width: 90px"
            clearable
          >
            <Option
              v-for="item in activityStatusEnum"
              :key="item.value"
              :value="item.value"
              class="ptb2-5"
              >{{ item.label }}</Option
            >
          </Select>
          <Select
            v-model="searchRowData.advertmentType"
            class="search-col mr5"
            placeholder="广告类型"
            style="width: 90px"
            clearable
          >
            <Option
              v-for="item in advertmentList"
              :key="item.value"
              :value="item.value"
              class="ptb2-5"
              >{{ item.label }}</Option
            >
          </Select>
          <Button
            v-waves
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
          <Button v-waves type="success" class="mr5" @click="addChildren">
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
      <div style="margin: 10px; overflow: hidden">
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

    <Modal v-model="modalView" :mask-closable="false" :width="600">
      <p slot="header">
        <span>广告详情</span>
      </p>
      <div class="modal-content">
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告位置:</i-col>
              <i-col span="16">{{
                advertisementDetail.advertmentPosition | advPositionFilter
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告名称:</i-col>
              <i-col span="16">{{ advertisementDetail.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">内容描述:</i-col>
              <i-col span="16">{{ advertisementDetail.contentDesc }}</i-col>
            </Row>
          </i-col>
        </Row>-->
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告图:</i-col>
              <i-col
                span="16"
                v-if="advertisementDetail.advertmentType === 'IMAGE'"
              >
                <img
                  :src="advertisementDetail.advertmentImage"
                  style="width: 100%; height: auto"
                />
              </i-col>
              <i-col span="16" v-else>N/A</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告状态:</i-col>
              <i-col span="16">{{
                advertisementDetail.vaild === "yes" ? "有效" : "无效"
              }}</i-col>
            </Row>
          </i-col>
          <!-- <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">广告序号:</i-col>
              <i-col span="16">{{ advertisementDetail.rankNo }}</i-col>
            </Row>
          </i-col>-->
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接类型:</i-col>
              <i-col span="16">{{
                advertisementDetail.linkType | advertisementLinkTypeFilter
              }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">链接目标:</i-col>
              <i-col span="16">{{ advertisementDetail.linkUrl }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">有效时间:</i-col>
              <i-col span="16">{{ advertisementDetail.beginTime }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">失效时间:</i-col>
              <i-col span="16">{{ advertisementDetail.endTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row :gutter="8" type="flex" align="middle" class-name="mb10">
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">创建时间:</i-col>
              <i-col span="16">{{ advertisementDetail.createAt }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row
          :gutter="8"
          type="flex"
          align="middle"
          class-name="mb10"
          v-if="
            advertisementDetail.advertmentType === 'VIDEO' &&
            advertisementDetail.advertmentImage
          "
        >
          <i-col span="12">
            <Row :gutter="8" type="flex" align="middle" class-name="mb10">
              <i-col span="8">视频预览:</i-col>
              <video
                class="video_box"
                :src="advertisementDetail.advertmentImage"
                controls="controls"
              ></video>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :width="750" :mask-closable="false">
      <p slot="header">
        <span>{{
          tempModalType === modalType.edit ? "修改广告" : "创建广告"
        }}</span>
      </p>
      <div class="modal-content">
        <Form
          ref="editForm"
          :model="advertisementDetail"
          :rules="ruleInline"
          :label-width="90"
        >
          <Row>
            <i-col span="12">
              <FormItem label="广告名:" prop="title">
                <Input
                  v-model="advertisementDetail.title"
                  placeholder="广告名"
                  style="width: 220px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="广告位置:" prop="advertmentPosition">
                <Select
                  v-model="advertisementDetail.advertmentPosition"
                  style="width: 200px"
                >
                  <Option
                    v-for="item in advPositionEnum"
                    :key="item.value"
                    :value="item.value"
                    class="pt5 pb5 pl15"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="链接地址:" prop="linkUrl">
                <Input
                  v-model="advertisementDetail.linkUrl"
                  placeholder="http://"
                  style="width: 220px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="广告状态:" prop="vaild">
                <Select
                  v-model="advertisementDetail.vaild"
                  style="width: 200px"
                >
                  <Option
                    v-for="(item, index) in vaild"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <!-- <Row>
            <i-col span="12">
              <FormItem label="链接类型:" prop="linkType">
                <Select
                  v-model="advertisementDetail.linkType"
                  style="width: 200px"
                  @on-change="advertiseLinkTypeChange"
                >
                  <Option
                    v-for="(item,index) in linkType"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <Row span="24" align="middle" type="flex">
                <FormItem label="链接目标:" prop="advertisementRelation">
                  <Row v-if="isTargetLink">
                    <Input v-model="advertisementDetail.advertisementRelation" style="width:200px;"></Input>
                  </Row>
                  <Row v-else>
                    <i-col span="24">
                      <Input
                        v-model="advertisementDetail.advertisementRelationText"
                        :disabled="advertisementDetail.linkType !== 'EXTERNALLINK'"
                      >
                        <Button
                          v-waves
                          slot="append"
                          :loading="searchModalTableLoading"
                          class="search-btn"
                          type="primary"
                          @click="searchAdvertisementRelation"
                        >
                          <Icon type="md-search" />&nbsp;搜索
                        </Button>
                      </Input>
                    </i-col>
                  </Row>
                </FormItem>
              </Row>
            </i-col>
          </Row>-->
          <Row>
            <i-col span="12">
              <FormItem label="开始时间:">
                <DatePicker
                  :value="advertisementDetail.beginTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="开始时间"
                  style="width: 200px"
                  @on-change="startTimeChange"
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="结束时间:">
                <DatePicker
                  :value="advertisementDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 200px"
                  @on-change="endTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="广告类型:" prop="advertmentType">
                <Select
                  v-model="advertisementDetail.advertmentType"
                  style="width: 200px"
                  disabled
                >
                  <Option
                    v-for="(item, index) in advertmentList"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </i-col>
            <i-col
              span="12"
              v-if="advertisementDetail.advertmentType == 'IMAGE'"
            >
              <FormItem
                :label-width="80"
                label="广告图片:建议尺寸(790*338)"
                prop="advertmentImage"
              >
                <div>
                  <Input
                    v-show="false"
                    v-model="advertisementDetail.advertmentImage"
                    style="width: auto"
                  ></Input>
                  <div
                    v-for="item in uploadListMain"
                    :key="item.url"
                    class="demo-upload-list"
                  >
                    <template v-if="item.status === 'finished'">
                      <div>
                        <img :src="item.url" />
                        <div class="demo-upload-list-cover">
                          <Icon
                            type="ios-eye-outline"
                            @click.native="handleUploadView(item)"
                          ></Icon>
                          <Icon
                            type="ios-trash-outline"
                            @click.native="handleRemoveMain(item)"
                          ></Icon>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <Progress
                        v-if="item.showProgress"
                        :percent="item.percentage"
                        hide-info
                      ></Progress>
                    </template>
                  </div>
                  <IViewUpload
                    ref="uploadMain"
                    :default-list="defaultListMain"
                    :image-size="imageSize"
                    group-type="activity_image"
                    file-dir="activity"
                    @on-success="handleSuccessMain"
                  >
                    <div
                      slot="content"
                      style="width: 58px; height: 58px; line-height: 58px"
                    >
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </IViewUpload>
                </div>
              </FormItem>
            </i-col>
            <!-- 上传视频 -->
            <i-col span="12" v-else>
              <FormItem
                :label-width="80"
                label="广告视频:(格式限.MP4&.AVI、大小200M)"
                prop="advertmentImage"
              >
                <div>
                  <Input
                    v-show="false"
                    v-model="advertisementDetail.advertmentImage"
                    style="width: auto"
                  ></Input>
                  <VideoUpload
                    ref="uploadMainVideo"
                    :default-list="defaultListMainVideo"
                    :image-size="204800"
                    group-type="other_file"
                    file-dir="publicity_video"
                    @on-success="handleSuccessMainVideo"
                  >
                    <div
                      slot="content"
                      style="width: 58px; height: 58px; line-height: 58px"
                    >
                      <Icon type="md-videocam" size="20"></Icon>
                    </div>
                  </VideoUpload>
                </div>
              </FormItem>
            </i-col>
          </Row>
          <Row
            v-if="
              advertisementDetail.advertmentType === 'VIDEO' &&
              advertisementDetail.advertmentImage
            "
          >
            <i-col span="22">
              <FormItem label="视频预览:">
                <video
                  class="video_box"
                  :src="advertisementDetail.advertmentImage"
                  controls="controls"
                ></video>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button
          :loading="modalViewLoading"
          type="primary"
          @click="handleSubmit('editForm')"
          >确定</Button
        >
      </div>
    </Modal>

    <Modal v-model="uploadVisible" title="图片预览">
      <img :src="imgUploadViewItem" style="width: 100%" />
    </Modal>

    <Modal
      v-model="relationTargetShow"
      :mask-closable="false"
      :width="1200"
      title="关联商品规格"
    >
      <div class="modal-content">
        Tips：点击要选择的行
        <tables
          ref="tables"
          v-model="tempModalTableData"
          :columns="tempColumns"
          border
          searchable
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchRelationRowData.productCode"
                placeholder="商品编码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchRelationRowData.productName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :loading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleRelationSearch"
              >
                <Icon type="md-search" />&nbsp;搜索
              </Button>
              <Button
                v-waves
                :loading="clearSearchLoading"
                class="search-btn"
                type="info"
                @click="handleProductClear"
              >
                <Icon type="md-refresh" />&nbsp;清除
              </Button>
            </Row>
          </div>
        </tables>

        <div style="margin: 10px; overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="relationTotal"
              :current="searchRelationRowData.page"
              show-sizer
              show-total
              @on-change="changeRelationPage"
              @on-page-size-change="changeRelationPageSize"
            ></Page>
          </Row>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import VideoUpload from "_c/video-upload";

import {
  getAdvertisementPositionPages,
  createAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  getAdvertisementPages,
  getProductStandardsPages,
  deletePicture,
} from "@/api/wholesale";
import deleteMixin from "@/mixins/deleteMixin.js";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import uploadMixin from "@/mixins/uploadMixin";

import { compareData } from "@/libs/util";
import {
  linkType,
  linkTypeEnum,
  advPositionEnum,
  activityStatusEnum,
} from "@/libs/enumerate";
import {
  advPositionConvert,
  couponStatusConvert,
  activityStatusConvert,
  advertisementLinkTypeConvert,
} from "@/libs/converStatus";
import { miniGoodsStandardColumns } from "@/libs/columns";

const advertisementDetail = {
  id: 0,
  beginTime: null,
  endTime: null,
  createAt: null,
  positionId: 0,
  relationId: 0,
  isPermanent: "OFF",
  linkType: null, // 可扩展字段
  rankNo: 0, // 可扩展字段
  advertisementRelation: "", // 可扩展字段
  advertisementRelationText: "", // 可扩展字段
  advertmentImage: null,
  advertmentPosition: "", // poppup-首页弹窗 top-顶部轮播图 flashsale-限时抢购 bottom-底部banner图
  linkUrl: "",
  title: "",
  vaild: "",
  advertmentType: "IMAGE",
};

const roleRowData = {
  title: "",
  vaild: "",
  advertmentPosition: "",
  advertmentType: "",
  page: 1,
  rows: 10,
};

const relationRowData = {
  productCode: null,
  productName: null,
  shelvesStatus: "VALID",
  page: 1,
  rows: 10,
};

export default {
  components: {
    Tables,
    IViewUpload,
    VideoUpload,
  },
  mixins: [deleteMixin, tableMixin, searchMixin, uploadMixin],
  data() {
    return {
      advPositionEnum,
      activityStatusEnum,
      modalViewLoading: false,
      searchModalTableLoading: false,
      relationTargetShow: false,
      selectDisable: true,
      advertisementList: [],
      defaultListMainVideo: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      ruleInline: {
        title: [{ required: true, message: "请输入广告名称" }],
        vaild: [{ required: true, message: "请选择广告状态" }],
        linkType: [{ required: true, message: "请选择链接类型" }],
        beginTime: [{ required: true, message: "请选择开始时间" }],
        endTime: [{ required: true, message: "请选择结束时间" }],
        advertisementRelation: [{ required: true, message: "请填写链接目标" }],
        advertmentPosition: [{ required: true, message: "请选择广告位置" }],
        advertmentType: [{ required: true, message: "请选择广告类型" }],
        rankNo: [
          { required: true, message: "请输入序号" },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[0-9]\d*$/.test(value)) {
                errors.push(new Error("必须为整数"));
              }
              callback(errors);
            },
          },
        ],
      },
      linkType: [
        {
          value: linkType.GOODSINFO,
          label: "商品详情",
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns,
        },
        {
          value: linkType.INVITEACTIVE,
          label: "邀请有礼",
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns,
        },
        {
          value: linkType.FLASHACTIVE,
          label: "抢购商品",
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns,
        },
        {
          value: linkType.RECHARGE,
          label: "充值页面",
          api: getProductStandardsPages,
          columns: miniGoodsStandardColumns,
        },
        { value: linkType.EXTERNALLINK, label: "外部链接" },
        { value: linkType.INTERNALLINK, label: "内部链接" },
        { value: linkType.TABLINK, label: "底部导航" },
      ],
      advertmentList: [
        { label: "图片", value: "IMAGE" },
        { label: "视频", value: "VIDEO" },
      ],
      tempColumns: [],
      linkTypeEnum,
      tempModalTableData: [],
      relationTypeKeys: [],
      vaild: [
        { label: "有效", value: "yes" },
        { label: "无效", value: "no" },
      ],
      validityTimeList: [{ label: "定时生效", value: "OFF" }],
      columns: [
        {
          type: "selection",
          key: "",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          title: "ID",
          align: "center",
          key: "id",
          sortable: true,
          minWidth: 80,
        },
        {
          title: "图片",
          align: "center",
          width: 140,
          key: "advertmentImage",
          // render: (h, params, vm) => {
          //   const { row } = params;
          //   if (row.advertmentType === "IMAGE") {
          //     const str = (
          //       <img src={row.advertmentImage} height="60" width="100" />
          //     );
          //     return <div>{str}</div>;
          //   } else {
          //     return (
          //       <div>
          //         <img
          //           src="http://resource.shuiguoshule.com.cn/product_image/2020-09-03/KKXxT02hdey9P4buqx3d.jpg"
          //           height="60"
          //           width="100"
          //         />
          //       </div>
          //     );
          //   }
          // },
        },
        {
          title: "广告名称",
          align: "center",
          minWidth: 150,
          key: "title",
        },
        {
          title: "广告位置",
          align: "center",
          minWidth: 120,
          key: "advertmentPosition",
          render: (h, params, vm) => {
            const { row } = params;
            const str = "M/A";
            switch (row.advertmentPosition) {
              case "poppup":
                return <div>{advPositionConvert(row.advertmentPosition)}</div>;
              case "top":
                return <div>{advPositionConvert(row.advertmentPosition)}</div>;
              case "flashsale":
                return <div>{advPositionConvert(row.advertmentPosition)}</div>;
              case "bottom":
                return <div>{advPositionConvert(row.advertmentPosition)}</div>;
              default:
                return <div>{str}</div>;
            }
          },
        },
        {
          title: "创建时间",
          align: "center",
          minWidth: 180,
          key: "createAt",
        },
        {
          title: "开始时间",
          align: "center",
          minWidth: 180,
          key: "beginTime",
        },
        {
          title: "结束时间",
          align: "center",
          minWidth: 180,
          key: "endTime",
        },
        {
          title: "状态",
          align: "center",
          minWidth: 90,
          key: "vaild",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.vaild === "yes") {
              return (
                <div>
                  <tag color="success">{activityStatusConvert(row.vaild)}</tag>
                </div>
              );
            } else if (row.vaild === "no") {
              return (
                <div>
                  <tag color="error">{activityStatusConvert(row.vaild)}</tag>
                </div>
              );
            }
            return (
              <div>
                <tag color="primary">{row.vaild}</tag>
              </div>
            );
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 200,
          key: "handle",
          options: ["onSale", "view", "edit", "delete"],
        },
      ],
      defaultListMain: [],
      uploadListMain: [],
      searchRowData: _.cloneDeep(roleRowData),
      advertisementDetail: _.cloneDeep(advertisementDetail),
      searchRelationRowData: _.cloneDeep(relationRowData),
      tempContent: null,
      tempImage: null,
      relationTotal: 0,
    };
  },
  computed: {
    isTargetLink() {
      return (
        this.advertisementDetail.linkType === "EXTERNALLINK" ||
        this.advertisementDetail.linkType === "INTERNALLINK" ||
        this.advertisementDetail.linkType === "TABLINK"
      );
    },
    // validityPeriodComputed() {
    //   if (
    //     !this.advertisementDetail.endTime &&
    //     !this.advertisementDetail.beginTime
    //   ) {
    //     return "永久有效";
    //   } else {
    //     return (
    //       this.advertisementDetail.beginTime +
    //       "--" +
    //       this.advertisementDetail.endTime
    //     );
    //   }
    // }
  },
  created() {
    this.getTableData();
  },
  methods: {
    advertiseTypeChange(value) {
      if (value === "TEXT") {
        if (this.$refs.uploadMain) {
          this.$refs.uploadMain.clearFileList();
        }
        this.uploadListMain = [];
      } else if (value === "IMAGE") {
        if (this.tempImage != null) {
          const map = { status: "finished", url: "url" };
          const mainImgArr = [];
          map.url = this.tempImage;
          mainImgArr.push(map);
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          }
          this.uploadListMain = mainImgArr;
        } else {
          if (this.$refs.uploadMain) {
            this.$refs.uploadMain.clearFileList();
          }
          this.uploadListMain = [];
        }
        this.advertisementDetail.content = this.tempImage;
      }
    },
    deleteTable(ids) {
      this.loading = true;
      deleteAdvertisement({
        ids,
      })
        .then((res) => {
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
    startTimeChange(value, date) {
      this.advertisementDetail.beginTime = value;
    },
    endTimeChange(value, date) {
      this.advertisementDetail.endTime = value;
    },
    handleSubmit(name) {
      // if (this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: this.oldPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.advertisementDetail.isPermanent === "OFF") {
            if (this.advertisementDetail.beginTime === "") {
              this.$Message.error("请填写开始时间!");
              return;
            }
            if (this.advertisementDetail.endTime === "") {
              this.$Message.error("请填写结束时间!");
              return;
            }
            if (
              compareData(
                this.advertisementDetail.beginTime,
                this.advertisementDetail.endTime
              )
            ) {
              this.$Message.error("结束时间必须大于开始时间!");
              return;
            }
          }
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    handleEditClose() {
      // if (this.newPicture.length > 0) {
      //   const urls = {
      //     urls: this.newPicture
      //   };
      //   this.deletePicture(urls);
      // }
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    // deletePicture(urls) {
    //   deletePicture({
    //     urls
    //   })
    //     .then(res => {})
    //     .catch(() => {});
    // },
    editTableRow() {
      this.modalViewLoading = true;
      editAdvertisement({
        ...this.advertisementDetail,
      }).then((res) => {
        this.resetFields();
        this.modalEdit = false;
        this.modalViewLoading = false;
        this.getTableData();
      });
    },
    createTableRow() {
      this.modalViewLoading = true;
      createAdvertisement(this.advertisementDetail).then((res) => {
        this.modalViewLoading = false;
        this.modalEdit = false;
        this.$Message.success("创建成功!");
        this.resetFields();
        this.getTableData();
      });
    },
    searchAdvertisementRelation() {
      if (
        this.advertisementDetail.linkType === null ||
        this.advertisementDetail.linkType === ""
      ) {
        this.$Message.warning("请填写链接类型");
        return;
      }
      this.getRelationTable();
    },
    getRelationTable() {
      this.searchModalTableLoading = true;
      const tempObj = this.linkType.find((item) => {
        return item.value === this.advertisementDetail.linkType;
      });
      console.log(tempObj);
      if (tempObj) {
        this.tempColumns = tempObj.columns;
        console.log(this.tempColumns);
        tempObj.api(this.searchRelationRowData).then((res) => {
          this.searchModalTableLoading = false;
          this.relationTargetShow = true;
          this.tempModalTableData = res.rows;
          this.relationTotal = res.total;
        });
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.uploadListMain = [];
      this.advertisementDetail.advertmentImage = null;
    },
    resetFields() {
      this.tempImage = null;
      this.$refs.editForm.resetFields();
      if (this.$refs.uploadMain) {
        this.$refs.uploadMain.clearFileList();
      }
      this.uploadListMain = [];
      this.advertisementDetail = _.cloneDeep(advertisementDetail);
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.advertisementDetail.advertmentImage = null;
      this.advertisementDetail.advertmentImage = fileList[0].url;
      this.tempImage = fileList[0].url;
    },
    handleSuccessMainVideo(response, file, fileList) {
      this.advertisementDetail.advertmentImage = null;
      this.advertisementDetail.advertmentImage = fileList[0].url;
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
      this.advertisementDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.$refs.editForm.resetFields();
      this.tempImage = null;
      this.tempModalType = this.modalType.edit;
      this.advertisementDetail = _.cloneDeep(params.row);
      this.setDefaultUploadList(params.row);
      this.modalEdit = true;
    },
    setDefaultUploadList(res) {
      if (res.advertmentType === "IMAGE") {
        if (res.advertmentImage != null) {
          const map = { status: "finished", url: "url" };
          const mainImgArr = [];
          map.url = res.advertmentImage;
          mainImgArr.push(map);
          this.$refs.uploadMain.setDefaultFileList(mainImgArr);
          this.uploadListMain = mainImgArr;
        }
      }
    },
    advertiseLinkTypeChange(value) {
      this.advertisementDetail.linkType = value;
      console.log(value);
    },
    advertiseTimeChange() {},
    getTableData() {
      getAdvertisementPages(this.searchRowData).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        this.searchLoading = false;
        this.clearSearchLoading = false;
      });
    },
    onRowClick(row, index) {
      if (this.advertisementDetail.linkType === linkType.GOODSINFO) {
        this.advertisementDetail.advertisementRelationText = row.productName;
      } else {
        this.advertisementDetail.advertisementRelationText = row.name;
      }
      this.advertisementDetail.advertisementRelation = row.id;
      this.relationTargetShow = false;
    },
    changeRelationPage(page) {
      this.searchRelationRowData.page = page;
      this.getRelationTable();
    },
    changeRelationPageSize(pageSize) {
      this.searchRelationRowData.page = 1;
      this.searchRelationRowData.rows = pageSize;
      this.getRelationTable();
    },
    handleRelationSearch() {
      this.searchRelationRowData.page = 1;
      this.searchLoading = true;
      this.getRelationTable();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleRelationSearch();
    },
    handleStatus(params) {
      this.advertisementDetail = _.cloneDeep(params.row);
      this.advertisementDetail.vaild =
        params.row.vaild === "yes" ? "no" : "yes";
      this.editTableRow();
    },
    relationTextChange(event) {
      this.advertisementDetail.advertisementRelation = event;
    },
  },
};
</script>

<style lang="scss" scoped>
.video_box {
  width: 300px;
  height: 200px;
}
</style>
