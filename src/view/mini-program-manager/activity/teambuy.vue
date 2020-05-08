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
        highlight-row
        search-place="top"
        @on-delete="handleDelete"
        @on-view="handleView"
        @on-edit="handleEdit"
        @on-current-change="onCurrentChange"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Select
              v-model="searchRowData.status"
              placeholder="活动状态"
              style="padding-right: 5px;width: 100px"
              clearable
              @on-change="activityStatusChange"
            >
              <Option
                v-for="(item,index) in teamBuyStatusEnum"
                :value="item.value"
                :key="index"
                class="ptb2-5"
                style="padding-left: 5px;width: 100px"
              >{{ item.label }}</Option>
            </Select>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Input
              v-model="searchRowData.content"
              placeholder="活动内容"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <DatePicker
              v-model="searchRowData.startTimeBegin"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="有效时间起"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeStartChange"
            />
            <i>-</i>
            <DatePicker
              v-model="searchRowData.startTimeEnd"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="有效时间止"
              class="mr5"
              style="width: 160px"
              @on-change="createTimeEndChange"
            />
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
          <div class="ml15 mt10">
            <i style="color:red">*</i> 选中单条数据再点击添加,可复制当前数据
          </div>
        </div>
        <div slot="operations">
          <Button v-waves :loading="createLoading" type="success" class="mr5" @click="addStore">
            <Icon type="md-add" />添加
          </Button>
          <Button
            v-waves
            :loading="exportExcelLoading"
            type="primary"
            class="mr5"
            @click="handleDownload"
          >
            <Icon type="md-download" />导出
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

    <Modal v-model="modalView" :mask-closable="false" :width="720">
      <p slot="header">
        <span>团购活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">团购活动编号:</i-col>
              <i-col span="18">{{ teambuyDetail.id }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动类型:</i-col>
              <i-col span="18">{{ teambuyDetail.teamBuyType | teamBuyTypeFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">活动名称:</i-col>
              <i-col span="18">{{ teambuyDetail.activityName }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">创建时间:</i-col>
              <i-col span="18">{{ teambuyDetail.createTime }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">活动内容:</i-col>
              <i-col span="18">{{ teambuyDetail.content }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18">{{ teambuyDetail.status | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">排序序号:</i-col>
              <i-col span="18">{{ teambuyDetail.rank }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动banner:</i-col>
              <i-col span="18">
                <img :src="teambuyDetail.banner" style="width: 100%" >
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">有效期起:</i-col>
              <i-col span="18">
                {{ this.teambuyDetail.startTime = this.$moment(
                  this.teambuyDetail.startTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <!-- {{ teambuyDetail.endTime }} -->
              <i-col span="6">有效期止:</i-col>
              <i-col span="18">
                {{ this.teambuyDetail.endTime = this.$moment(
                  this.teambuyDetail.endTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <!-- {{ teambuyDetail.deliveryEndTime }} -->
              <i-col span="6">提货截止时间:</i-col>
              <i-col span="18">
                {{ this.teambuyDetail.deliveryEndTime = this.$moment(
                  this.teambuyDetail.deliveryEndTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">成团有效时长:</i-col>
              <i-col span="18">{{ teambuyDetail.validSeconds }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">成团人数:</i-col>
              <i-col span="18">{{ teambuyDetail.fullUserNum }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">参团信息列表:</i-col>
              <i-col span="18">{{ teambuyDetail.joinInfoStatus | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">是否模拟成团:</i-col>
              <i-col span="18">{{ teambuyDetail.robot | teamBuyStatusFilter }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">状态多少秒:</i-col>
              <i-col span="18">{{ teambuyDetail.robotStartSecond }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">商品规格:</i-col>
              <i-col span="18">{{ teambuyDetail.standardId }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">规格描述:</i-col>
              <i-col span="18">{{ teambuyDetail.standardDesc }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">原价:</i-col>
              <i-col span="18">{{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">活动价:</i-col>
              <i-col span="18">{{ teambuyDetail.activityPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">团长优惠:</i-col>
              <i-col span="18">{{ teambuyDetail.tourDiscount | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">限购次数:</i-col>
              <i-col span="18">{{ teambuyDetail.triesLimit }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">库存数量:</i-col>
              <i-col span="18">{{ teambuyDetail.productNum }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">已售份数:</i-col>
              <i-col span="18">{{ teambuyDetail.saleQuantity }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">单人团购价格:</i-col>
              <i-col span="18">{{ teambuyDetail.singleTeambuyPrice | fenToYuanDot2Filters }}</i-col>
            </Row>
          </i-col>
          <i-col span="12">
            <Row>
              <i-col span="6">红包活动设置:</i-col>
              <i-col
                span="18"
              >{{ teambuyDetail.rewardActivitySetting | rewardActivitySettingFilter }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="12">
            <Row>
              <i-col span="6">关联门店:</i-col>
              <i-col span="18">{{ relationStore }}</i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>

    <Modal v-model="modalEdit" :z-index="1000" :width="800" :mask-closable="false">
      <p slot="header">
        <i-col>{{ tempModalType === modalType.edit?'修改团购活动':'创建团购活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="teambuyDetail" :rules="ruleInline" :label-width="130">
          <Row v-show="tempModalType===modalType.edit">
            <i-col span="12">
              <FormItem label="团购ID:" prop="id">{{ teambuyDetail.id }}</FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="创建时间:" prop="createTime">{{ teambuyDetail.createTime }}</FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动名称:" prop="activityName">
                <Input
                  v-model="teambuyDetail.activityName"
                  :readonly="teambuyDetail.status==='on'"
                  style="width: 200px"
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动类型:" prop="teamBuyType">
                <Select v-model="teambuyDetail.teamBuyType" style="width: 200px">
                  <Option
                    v-for="item in teamBuyTypeEnum"
                    :value="item.value"
                    :key="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="活动内容:" prop="content">
                <Input v-model="teambuyDetail.content" style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动状态:" prop="status">
                <Select v-model="teambuyDetail.status" style="width: 200px">
                  <Option
                    v-for="item in activityStatus"
                    :value="item.value"
                    :key="item.value"
                    :disabled="tempModalType === modalType.create && item.value=='expire'"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="排序序号:" prop="rank">
                <InputNumber v-model="teambuyDetail.rank" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem :label-width="130" label="活动Banner 推荐尺寸750*304(单位:px):" prop="banner">
                <Input v-show="false" v-model="teambuyDetail.banner" style="width: auto"></Input>
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
                  group-type="activity_image"
                  file-dir="activity"
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
            <!-- :readonly="tempModalType === modalType.edit" -->
            <!-- :readonly="tempModalType === modalType.edit" -->
            <!-- :readonly="tempModalType === modalType.edit" -->
            <!--
                    <Row>
              <Col span="18">
                <FormItem label="有效期起:" prop="beginTime">
                  <DatePicker
                    v-model="registerDetail.beginTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="有效期起"
                    class="search-input"
                    style="width: 170px"
                    @on-change="beginTimeChange"
                  />
                </FormItem>
              </Col>
            </Row>
            -->
            <i-col span="12">
              <FormItem label="有效期起:" prop="startTime">
                <DatePicker
                  v-model="teambuyDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期起"
                  class="search-input"
                  style="width: 200px"
                  @on-change="startTimeChange"
                />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="有效期止:" prop="endTime">
                <DatePicker
                  v-model="teambuyDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效期止"
                  class="search-input"
                  style="width: 200px"
                  @on-change="endTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="提货截止时间:" prop="deliveryEndTime">
                <DatePicker
                  v-model="teambuyDetail.deliveryEndTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="提货截止时间"
                  class="search-input"
                  style="width: 200px"
                  @on-change="deliveryEndTimeChange"
                />
              </FormItem>
            </i-col>
            <!-- <i-col span="12">
              <FormItem
                label="提货开始时间:"
                prop="deliveryStartTime"
                v-if="tempModalType===modalType.create||groupStatus==='off'"
              >
                <DatePicker
                  v-model="teambuyDetail.deliveryStartTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="提货开始时间"
                  class="search-input"
                  style="width: 200px"
                  @on-change="deliveryStartTimeChange"
                />
              </FormItem>
              <FormItem
                v-else
                label="提货开始时间:"
                prop="deliveryStartTime"
              >{{ teambuyDetail.deliveryStartTime | couponScopeFilter }}</FormItem>
            </i-col>-->
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="成团人数:" prop="fullUserNum">
                <InputNumber :min="0" v-model="teambuyDetail.fullUserNum" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="成团有效时长:" prop="validSeconds">
                <!-- TODO 后期插件修改 -->
                <!-- <TimePicker type="time" placeholder="成团有效时长" style="width: 200px" @on-change=""></TimePicker> -->
                <InputNumber
                  :min="0"
                  v-model="teambuyDetail.hour"
                  :readonly="tempModalType === modalType.edit"
                  style="width: 60px"
                  @on-change="validSecondsChange"
                ></InputNumber>&nbsp;时
                <InputNumber
                  :min="0"
                  v-model="teambuyDetail.minute"
                  :readonly="tempModalType === modalType.edit"
                  style="width: 60px"
                  @on-change="validSecondsChange"
                ></InputNumber>&nbsp;分
                <InputNumber
                  :min="0"
                  v-model="teambuyDetail.second"
                  :readonly="tempModalType === modalType.edit"
                  style="width: 60px"
                  @on-change="validSecondsChange"
                ></InputNumber>&nbsp;秒
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="是否模拟成团:" prop="robot">
                <Select v-model="teambuyDetail.robot" style="width: 200px">
                  <Option
                    v-for="item in teamBuyStatus"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.value=='expire'"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="参团信息列表:" prop="joinInfoStatus">
                <Select v-model="teambuyDetail.joinInfoStatus" style="width: 200px">
                  <Option
                    v-for="item in teamBuyStatus"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.value=='expire'"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="商品规格:" prop="standardId">
                <Input v-model="teambuyDetail.standardId" readonly="readonly" style="width: 200px">
                <Button
                  v-show="tempModalType !== modalType.edit"
                  slot="append"
                  icon="ios-search"
                  @click="handleRelation"
                ></Button>
                </Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="多少秒后虚位补齐:" prop="robotStartSecond">
                <Input v-model="teambuyDetail.robotStartSecond" style="width: 200px"></Input>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="规格描述:" prop="standardDesc">
                <Input v-model="teambuyDetail.standardDesc" style="width: 585px"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="原价:">
                {{ teambuyDetail.originalPrice | fenToYuanDot2Filters }}
                <!-- <InputNumber
                :min="0"
                :value="originalPriceComputed"
                readonly="readonly"
                placeholder="原价"
                style="width: 200px"
                @on-change="originalPriceInputNumberOnchange"></InputNumber>-->
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="活动价:" prop="activityPrice">
                <InputNumber
                  :min="0"
                  :value="activityPriceComputed"
                  placeholder="活动价"
                  style="width: 200px"
                  @on-change="activityPriceInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="团长优惠:" prop="tourDiscount">
                <InputNumber
                  :min="0"
                  :value="tourDiscountComputed"
                  placeholder="团长优惠"
                  style="width: 200px"
                  @on-change="tourDiscountInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="限购次数:" prop="triesLimit">
                <InputNumber
                  :min="0"
                  v-model="teambuyDetail.triesLimit"
                  style="width: 200px"
                  placeholder="默认999"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="库存数量:" prop="productNum">
                <InputNumber
                  v-model="teambuyDetail.productNum"
                  placeholder="库存数量"
                  style="width: 200px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="已售份数:" prop="saleQuantity">
                <InputNumber :min="0" v-model="teambuyDetail.saleQuantity" style="width: 200px"></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col v-if="teambuyDetail.teamBuyType!=='OLD_AND_NEW'" span="12">
              <FormItem label="单人团购价格:" prop="singleTeambuyPrice">
                <InputNumber
                  :min="0"
                  :value="singleTeambuyPriceComputed"
                  placeholder="单人团购价格"
                  style="width: 200px"
                  @on-change="singleTeambuyPriceInputNumberOnchange"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="红包活动设置:" prop="rewardActivitySetting">
                <Select v-model="teambuyDetail.rewardActivitySetting" style="width: 200px">
                  <Option
                    v-for="item in rewardActivitySettingEnum"
                    :value="item.value"
                    :key="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="关联门店:">
                <Select v-model="teambuyDetail.relationStoreType" style="width: 200px">
                  <Option
                    v-for="item in relationStoreTypeEnum"
                    :value="item.value"
                    :key="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px"
                    @click.native="selectStore(item)"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="showStoreList">
            <i-col span="24">
              <FormItem label="门店列表:">
                <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                  <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll"
                  >全选/反选</Checkbox>
                </div>
                <CheckboxGroup v-model="storeIds" @on-change="checkAllGroupChange">
                  <Checkbox
                    v-for="item in storeList"
                    ref="checkBox"
                    :key="item.storeId"
                    :label="item.storeId"
                  >{{ item.storeName }}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </i-col>
          </Row>
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

    <Modal v-model="modalProduct" :width="1200" title="关联商品" footer-hide>
      <Card>
        <tables
          ref="products"
          v-model="productData"
          :columns="productColumns"
          :loading="loading"
          editable
          searchable
          border
          search-place="top"
          @on-row-click="onRowClick"
        >
          <div slot="searchCondition">
            <Row>
              <Input
                v-model="searchProductRowData.productCode"
                placeholder="商品编码"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Input
                v-model="searchProductRowData.productName"
                placeholder="商品名称"
                class="search-input mr5"
                style="width: auto"
                clearable
              ></Input>
              <Button
                :searchLoading="searchLoading"
                class="search-btn mr5"
                type="primary"
                @click="handleProductSearch"
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
        <div style="margin: 10px;overflow: hidden">
          <Row type="flex" justify="end">
            <Page
              :total="productTotal"
              :current="searchProductRowData.page"
              show-sizer
              show-total
              @on-change="changeProductPage"
              @on-page-size-change="changeProductPageSize"
            ></Page>
          </Row>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import IViewUpload from '_c/iview-upload';
import _ from 'lodash';
import {
  deleteTeamBuy,
  getTeamBuyPages,
  editTeamBuy,
  createTeamBuy,
  getStorePages,
  getProductStandardsPages,
  deletePicture
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import deleteMixin from '@/mixins/deleteMixin.js';
import tableMixin from '@/mixins/tableMixin.js';
import searchMixin from '@/mixins/searchMixin.js';
import {
  teamBuyStatusConvert,
  customPlanStatusConvert
} from '@/libs/converStatus';
import {
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  compareData,
  secondsToDate
} from '@/libs/util';

const teambuyDetail = {
  remainingProductNum: 0,
  triesLimit: 999, // 默认限购次数999
  teamGuaranteeURL: '',
  storeId: 0,
  storeIds: '',
  singleTeambuyPrice: null,
  originalPrice: null,
  saleQuantity: 0,
  createTime: '',
  teamBuyType: 'ORDINARY_TEAM', // 默认普通团
  teamBuyNum: 0,
  rewardActivitySetting: 'DISABLE', // 默认红包活动关闭
  joinInfoStatus: 'on', // 默认参团信息列表状态开启
  teamResultEnum: null,
  id: 0,
  activityName: '',
  content: '',
  status: 'off', // 默认活动关闭
  rank: 0,
  startTime: null,
  endTime: null,
  deliveryEndTime: null,
  deliveryStartTime: null,
  banner: '',
  totalNum: 0,
  activityPrice: null,
  tourDiscount: null,
  fullUserNum: 0,
  standardId: 0,
  validSeconds: null,
  standardDesc: '',
  fullTeambuyCount: 0,
  robot: 'off', // 默认关闭模拟成团
  teamBuys: null,
  productStandard: null,
  leftTime: '',
  productNum: 0,
  robotStartSecond: 0,
  hour: null,
  minute: null,
  second: null,
  relationStoreType: 'ALL',
  content: ''
};

const roleRowData = {
  status: 'on',
  activityName: null,
  startTimeBegin: null,
  startTimeEnd: null,
  page: 1,
  rows: 10,
  sidx: 'rank',
  sort: 'asc',
  content: ''
};

const productStandardDetail = {
  id: 0,
  productId: 0,
  barcode: '',
  specification: '',
  standardQty: 0,
  unitId: 0,
  productUnit: '',
  price: 0,
  salePrice: 0,
  rank: 0,
  description: null,
  shelvesStatus: null,
  applyType: '',
  productName: '',
  createUser: null,
  image: null,
  productDescription: '',
  productCode: '',
  baseProductName: '',
  baseProductDescription: '',
  groupId: 0,
  groupName: '',
  sourceCode: '',
  baseImage: '',
  smallImage: '',
  largeImage: '',
  status: '',
  baseUnitId: 0,
  baseUnit: '',
  baseBarcode: '',
  hdSkuid: '',
  videoUrl: '',
  videoImage: '',
  baseQty: 0,
  limitQty: 0,
  queryStatus: null,
  invEnough: null,
  invNum: null,
  saleCount: null,
  positionName: null,
  dbId: null
};

const productRowData = {
  productId: '',
  barcode: '',
  productCode: '',
  productName: '',
  shelvesStatus: 'VALID',
  minPrice: '',
  maxPrice: '',
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
      ruleInline: {
        rank: [
          { required: true, message: '请输入排序序号' },
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
        activityName: [{ required: true, message: '请输入活动名称' }],
        teamBuyType: [{ required: true, message: '请选择活动类型' }],
        content: [{ required: true, message: '请输入活动内容' }],
        status: [{ required: true, message: '请选择活动状态' }],
        banner: [{ required: true, message: '请上传活动banner ' }],
        startTime: [{ required: true, message: '请输入有效期起' }],
        endTime: [{ required: true, message: '请输入有效期止' }],
        deliveryEndTime: [{ required: true, message: '请输入提货截止时间' }],
        validSeconds: [{ required: true, message: '请输入成团有效时长' }],
        fullUserNum: [
          { required: true, message: '请输入成团人数' },
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
        joinInfoStatus: [{ required: true, message: '请选择参团信息列表状态' }],
        robot: [{ required: true, message: '请选择是否模拟成团' }],
        robotStartSecond: [
          { required: true, message: '请填写状态多少秒:' },
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
        standardId: [{ required: true, message: '请选择商品规格' }],
        standardDesc: [{ required: true, message: '请输入规格描述' }],
        originalPrice: [
          { required: true, message: '请输入商品原价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        activityPrice: [
          { required: true, message: '请输入商品活动价' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        tourDiscount: [{ required: true, message: '请选择团长优惠' }],
        triesLimit: [
          { required: true, message: '请输入限购次数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        productNum: [
          { required: true, message: '请选择库存数量' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        saleQuantity: [
          { required: true, message: '请输入已售份数' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-0-9]+$/.test(value)) {
                errors.push(new Error('必须为整数'));
              }
              callback(errors);
            }
          }
        ],
        singleTeambuyPrice: [
          { required: true, message: '请输入单人团购价格' },
          {
            message: '必须为大于0的数字',
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
          }
        ],
        rewardActivitySetting: [
          { required: true, message: '请选择红包活动设置' }
        ]
      },
      defaultListMain: [],
      uploadListMain: [],
      activityStatus: [
        { label: '未开始', value: 'off' },
        { label: '进行中', value: 'on' },
        { label: '已结束', value: 'expire' }
      ],
      teamBuyStatus: [
        { label: '关闭', value: 'off' },
        { label: '开启', value: 'on' }
      ],
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      groupStatus: '',
      flagShipList: [],
      storeList: [],
      storeIds: [],
      oldPicture: [],
      newPicture: [],
      save: [],
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '活动名称',
          key: 'activityName',
          align: 'center',
          fixed: 'left',
          minWidth: 200
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'status',
          minWidth: 90,
          render: (h, params) => {
            const { row } = params;
            if (row.status == 'on') {
              return (
                <div>
                  <tag color='success'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status == 'off') {
              return (
                <div>
                  <tag color='error'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status == 'expire') {
              return (
                <div>
                  <tag color='warning'>
                    {teamBuyStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.status}</tag>
              </div>
            );
          }
        },
        {
          title: '活动内容',
          align: 'center',
          minWidth: 160,
          key: 'content'
        },
        {
          title: '有效期起',
          align: 'center',
          minWidth: 160,
          key: 'startTime'
        },
        {
          title: '有效期止',
          align: 'center',
          minWidth: 160,
          key: 'endTime'
        },
        {
          title: '商品库存',
          align: 'center',
          minWidth: 90,
          key: 'productNum'
        },
        {
          title: '活动价',
          minWidth: 80,
          key: 'activityPrice',
          align: 'center',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
          }
        },
        {
          title: '团长优惠',
          align: 'center',
          minWidth: 90,
          key: 'tourDiscount',
          render(h, params) {
            return <div>{fenToYuanDot2(params.row.tourDiscount)}</div>;
          }
        },
        {
          title: '成团有效时长',
          align: 'center',
          minWidth: 110,
          key: 'validSeconds',
          render(h, params) {
            return <div>{secondsToDate(params.row.validSeconds)}</div>;
          }
        },
        {
          title: '提货截至时间',
          align: 'center',
          minWidth: 160,
          key: 'deliveryEndTime'
        },
        {
          title: '规格描述',
          align: 'center',
          minWidth: 120,
          key: 'standardDesc',
          tooltip: true
        },
        {
          title: '限购次数',
          align: 'center',
          minWidth: 90,
          key: 'triesLimit'
        },
        {
          title: '排序',
          align: 'center',
          minWidth: 80,
          key: 'rank'
        },
        {
          title: '是否模拟成团',
          align: 'center',
          minWidth: 120,
          key: 'robot',
          render: (h, params) => {
            const { row } = params;
            if (row.robot === 'on') {
              return (
                <div>
                  <tag color='success'>
                    {teamBuyStatusConvert(row.robot).label}
                  </tag>
                </div>
              );
            } else if (row.robot === 'off') {
              return (
                <div>
                  <tag color='error'>
                    {teamBuyStatusConvert(row.robot).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{row.robot}</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          minWidth: 120,
          align: 'center',
          fixed: 'right',
          key: 'handle',
          options: ['view', 'edit']
        }
      ],
      productColumns: [
        // {
        //   type: "selection",
        //   key: "",
        //   minWidth: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: '规格ID',
          align: 'center',
          key: 'id',
          minWidth: 80
        },
        {
          title: '商品条码',
          key: 'barcode',
          align: 'center',
          minWidth: 80
        },
        {
          title: '商品编号',
          key: 'productCode',
          align: 'center',
          minWidth: 130
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'productName',
          minWidth: 150
        },
        {
          title: '商品规格',
          align: 'center',
          key: 'specification',
          minWidth: 100
        },
        {
          title: '商品单位',
          align: 'center',
          minWidth: 100,
          key: 'productUnit'
        },
        {
          title: '商品原价',
          align: 'center',
          minWidth: 120,
          key: 'price',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.price);
            return <div>{amount}</div>;
          }
        },
        {
          title: '优惠价格',
          align: 'center',
          minWidth: 120,
          key: 'salePrice',
          render(h, params, vm) {
            const amount = fenToYuanDot2(params.row.salePrice);
            return <div>{amount}</div>;
          }
        },
        {
          title: '商品状态',
          align: 'center',
          minWidth: 100,
          key: 'shelvesStatus',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.shelvesStatus === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            } else if (row.shelvesStatus === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {customPlanStatusConvert(row.shelvesStatus).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>
                  {customPlanStatusConvert(row.shelvesStatus).label}
                </tag>
              </div>
            );
          }
        },
        {
          title: '商品排序',
          align: 'center',
          minWidth: 100,
          key: 'rank'
        }
      ],
      productData: [],
      productTotal: 0,
      loading: true,
      modalProduct: false,
      createLoading: false,
      modalViewLoading: false,
      exportExcelLoading: false,
      showStoreList: false,
      indeterminate: false,
      checkAll: false,
      currentTableRowSelected: null,
      tableDataSelected: [],
      searchRowData: _.cloneDeep(roleRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      productDetail: _.cloneDeep(productStandardDetail),
      teambuyDetail: _.cloneDeep(teambuyDetail)
    };
  },
  computed: {
    originalPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.originalPrice);
    },
    activityPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.activityPrice);
    },
    singleTeambuyPriceComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.singleTeambuyPrice);
    },
    tourDiscountComputed() {
      return fenToYuanDot2Number(this.teambuyDetail.tourDiscount);
    },
    relationStore() {
      if (!this.teambuyDetail.storeIds) {
        return '全部门店';
      }
      const ids = this.teambuyDetail.storeIds
        .substring(1, this.teambuyDetail.storeIds.length - 1)
        .split('][');
      const list = this.storeList;
      let str = '';
      if (list.length > 0) {
        ids.forEach(id => {
          const item = list.find(item => item.storeId == id);
          str += item.storeName + ',';
        });
        return str.substring(0, str.length - 1);
      }
    }
  },
  watch: {
    numberInput(v) {
      if (String(v).indexOf('.') > 0) this.teambuyDetail.hour = '';
      this.$nextTick(() => {
        this.testInput = String(v).replace(/\D/g, '');
      });
    }
  },
  mounted() {
    this.searchRowData = _.cloneDeep(roleRowData);
    this.getTableData();
    this.getStore();
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
      this.uploadListMain = [];
      this.teambuyDetail.banner = null;
    },
    handleSubmit() {
      const _this = this;
      // if (_this.oldPicture.length > 0) {
      //   const urls = {
      //     urls: _this.oldPicture
      //   };
      //   _this.deletePicture(urls);
      // }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (
            _this.teambuyDetail.teamBuyType === 'OLD_AND_NEW' &&
            _this.teambuyDetail.fullUserNum <= 1
          ) {
            _this.$Message.error('老带新团成团人数必须大于1');
            return;
          }
          if (
            compareData(
              _this.teambuyDetail.startTime,
              _this.teambuyDetail.endTime
            )
          ) {
            _this.$Message.error('结束时间必须大于开始时间!');
            return;
          }
          if (
            compareData(
              _this.teambuyDetail.endTime,
              _this.teambuyDetail.deliveryEndTime
            )
          ) {
            _this.$Message.error('提货截止时间必须大于有效期止时间!');
            return;
          }
          if (
            _this.teambuyDetail.robotStartSecond >
            _this.teambuyDetail.validSeconds
          ) {
            _this.$Message.error('虚位补齐时间不能超过成团有效时长!');
            return;
          }
          if (
            parseInt(_this.teambuyDetail.productNum) %
              parseInt(_this.teambuyDetail.fullUserNum) !==
            0
          ) {
            _this.$Message.error('商品份额必须被成团人数整除!');
            return;
          }
          if (
            _this.teambuyDetail.relationStoreType === 'PART' &&
            (_this.teambuyDetail.storeIds == null ||
              _this.teambuyDetail.storeIds === '')
          ) {
            _this.$Message.error('选择部分门店时必须选择至少一个门店!');
            return;
          }
          if (
            _this.teambuyDetail.productNum < _this.teambuyDetail.fullUserNum
          ) {
            _this.$Message.error('库存数量不能小于成团人数!');
            return;
          }
          if (
            _this.teambuyDetail.tourDiscount >=
            _this.teambuyDetail.activityPrice
          ) {
            _this.$Message.error('团长优惠不能大于等于活动金额!');
            return;
          }
          // if (this.teambuyDetail.activityPrice > this.teambuyDetail.originalPrice) {
          //   this.$Message.info('活动价不能高于商品原价');
          //   return;
          // }
          // if (this.teambuyDetail.singleTeambuyPrice > this.teambuyDetail.originalPrice) {
          //   this.$Message.error('单人团购价格不能大于原价');
          //   return;
          // }
          var numRe = new RegExp(/^[0-9]+$/);
          if (!numRe.test(_this.teambuyDetail.validSeconds)) {
            _this.$Message.error('成团有效时长不能为小数');
            return;
          }
          // 活动格式转换Formart
          if (_this.teambuyDetail.startTime.indexOf('GMT') > 0) {
            _this.teambuyDetail.startTime = _this
              .$moment(_this.teambuyDetail.startTime)
              .format('yyyy-MM-dd HH:mm:ss');
            console.log(
              'startTime after format',
              _this.teambuyDetail.startTime
            );
          }

          if (_this.teambuyDetail.endTime.indexOf('GMT') > 0) {
            _this.teambuyDetail.endTime = _this
              .$moment(_this.teambuyDetail.endTime)
              .format('yyyy-MM-dd HH:mm:ss');
            console.log('endTime after format', _this.teambuyDetail.endTime);
          }

          if (_this.teambuyDetail.deliveryEndTime.indexOf('GMT') > 0) {
            _this.teambuyDetail.deliveryEndTime = _this
              .$moment(_this.teambuyDetail.deliveryEndTime)
              .format('yyyy-MM-dd HH:mm:ss');
            console.log(
              'endTime after format',
              _this.teambuyDetail.deliveryEndTime
            );
          }

          if (_this.tempModalType === _this.modalType.create) {
            // 添加状态
            _this.createStore();
          } else if (_this.tempModalType === _this.modalType.edit) {
            // 编辑状态
            _this.editStore();
          }
        } else {
          _this.$Message.error('请完善信息!');
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
    createStore() {
      this.modalViewLoading = true;
      this.teambuyDetail.id = null; // 新建时不需要传递id
      createTeamBuy(this.teambuyDetail)
        .then(res => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .catch(() => {
          this.modalViewLoading = false;
          this.modalEdit = false;
          this.getTableData();
        });
    },
    editStore() {
      this.modalViewLoading = true;
      if (this.teambuyDetail.startTime.indexOf('T') > -1) {
        this.teambuyDetail.startTime = this.$moment(
          this.teambuyDetail.startTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.teambuyDetail.endTime.indexOf('T') > -1) {
        this.teambuyDetail.endTime = this.$moment(
          this.teambuyDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.teambuyDetail.deliveryEndTime.indexOf('T') > -1) {
        this.teambuyDetail.deliveryEndTime = this.$moment(
          this.teambuyDetail.deliveryEndTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      editTeamBuy(this.teambuyDetail)
        .then(res => {
          this.getTableData();
          this.modalEdit = false;
          this.modalViewLoading = false;
        })
        .catch(() => {
          this.modalEdit = false;
          this.getTableData();
          this.modalViewLoading = false;
        });
    },
    // 选取一条数据
    onCurrentChange(currentRow, oldCurrentRow) {
      this.currentTableRowSelected = currentRow;
      // console.log("当前数据", this.currentTableRowSelected);
    },
    addStore() {
      this.resetFields();
      if (this.tempModalType !== this.modalType.create) {
        this.tempModalType = this.modalType.create;
        this.teambuyDetail = _.cloneDeep(teambuyDetail);
      }
      if (this.currentTableRowSelected) {
        var secondTime = parseInt(this.currentTableRowSelected.validSeconds);
        var minuteTime = 0;
        var hourTime = 0;
        if (secondTime >= 60) {
          minuteTime = parseInt(secondTime / 60);
          secondTime = parseInt(secondTime % 60);
          if (minuteTime >= 60) {
            hourTime = parseInt(minuteTime / 60);
            minuteTime = parseInt(minuteTime % 60);
          }
        }
        this.currentTableRowSelected.id = null;
        this.currentTableRowSelected.createTime = null;
        this.currentTableRowSelected.standardId = null;
        this.currentTableRowSelected.originalPrice = null;
        this.currentTableRowSelected.banner = null;
        this.currentTableRowSelected.status = null;
        this.currentTableRowSelected.rank = null;
        this.currentTableRowSelected.activityPrice = null;
        this.currentTableRowSelected.singleTeambuyPrice = null;
        this.currentTableRowSelected.relationStoreType = 'ALL';
        this.currentTableRowSelected.hour = hourTime;
        this.currentTableRowSelected.minute = minuteTime;
        this.currentTableRowSelected.second = secondTime;
        this.teambuyDetail = _.cloneDeep(this.currentTableRowSelected);
      }

      this.getStore();
      this.modalEdit = true;
    },
    // 删除
    handleDelete(params) {
      this.tableDataSelected = [];
      this.tableDataSelected.push(params.row);
      this.deleteTable(params.row.storeId);
    },
    deleteTable(ids) {
      this.loading = true;
      deleteTeamBuy({
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
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.banner != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.banner;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleEdit(params) {
      this.save = [];
      this.save.push(params.row.banner);
      this.groupStatus = '';
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.teambuyDetail = _.cloneDeep(params.row);
      this.groupStatus = this.teambuyDetail.status;
      this.setDefaultUploadList(this.teambuyDetail);
      if (this.teambuyDetail.validSeconds > 0) {
        this.teambuyDetail.hour = parseInt(
          this.teambuyDetail.validSeconds / 3600
        );
        this.teambuyDetail.minute = parseInt(
          (this.teambuyDetail.validSeconds % 3600) / 60
        );
        this.teambuyDetail.second =
          (this.teambuyDetail.validSeconds % 3600) % 60;
      }
      if (
        this.teambuyDetail.storeIds !== null &&
        this.teambuyDetail.storeIds !== ''
      ) {
        this.showStoreList = true;
        this.teambuyDetail.relationStoreType = 'PART';
        const storeIds = this.teambuyDetail.storeIds
          .substring(1, this.teambuyDetail.storeIds.length - 1)
          .split('][');
        console.log('storeIds before edit:', storeIds);
        storeIds.forEach(element => {
          this.storeIds.push(parseInt(element));
        });
        // 全选/反选按钮的样式
        if (
          this.storeIds.length > 0 &&
          this.storeIds.length !== this.storeList.length
        ) {
          this.indeterminate = true;
        }
      } else {
        this.showStoreList = false;
        this.teambuyDetail.relationStoreType = 'ALL'; // storeIds为''默认关联的门店则是全部门店
      }
      this.modalEdit = true;
    },
    handleDownload() {
      this.exportExcelLoading = true;
      getTeamBuyPages(this.searchRowData).then(res => {
        const tableData = res.rows;
        // 表格数据导出字段翻译
        tableData.forEach(item => {
          item['groupId'] = item['groupName'];
          item['status'] = teamBuyStatusConvert(item['status']).label;
          item['activityPrice'] = (item['activityPrice'] / 100.0).toFixed(2);
          item['tourDiscount'] = (item['tourDiscount'] / 100.0).toFixed(2);
          item['robot'] = teamBuyStatusConvert(item['robot']).label;
        });
        this.$refs.tables.handleDownload({
          filename: `拼团活动信息-${new Date().valueOf()}`,
          data: tableData
        });
        this.exportExcelLoading = false;
      });
    },
    getTableData() {
      if (!this.searchRowData.status) {
        this.searchRowData.sidx = 'start_time';
        this.searchRowData.sort = 'desc';
      }
      getTeamBuyPages(this.searchRowData)
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
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.teambuyDetail.storeImage = null;
    },
    // 商品主图
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.teambuyDetail.banner = null;
      this.teambuyDetail.banner = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    startTimeChange(value, date) {
      console.log('change start value:', value);
      this.teambuyDetail.startTime = value;
      if (this.teambuyDetail.startTime.indexOf('T') > -1) {
        this.teambuyDetail.startTime = this.$moment(
          this.teambuyDetail.startTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    endTimeChange(value, date) {
      console.log('change end value:', value);
      this.teambuyDetail.endTime = value;
      if (this.teambuyDetail.endTime.indexOf('T') > -1) {
        this.teambuyDetail.endTime = this.$moment(
          this.teambuyDetail.endTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    createTimeStartChange(value, date) {
      this.teambuyDetail.startTimeBegin = value || null;
    },
    createTimeEndChange(value, date) {
      this.teambuyDetail.startTimeEnd = value || null;
    },
    deliveryEndTimeChange(value, date) {
      this.teambuyDetail.deliveryEndTime = value;
      if (this.teambuyDetail.deliveryEndTime.indexOf('T') > -1) {
        this.teambuyDetail.deliveryEndTime = this.$moment(
          this.teambuyDetail.deliveryEndTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    deliveryStartTimeChange(value, date) {
      this.teambuyDetail.deliveryStartTime = value;
      if (this.teambuyDetail.deliveryStartTime.indexOf('T') > -1) {
        this.teambuyDetail.deliveryStartTime = this.$moment(
          this.teambuyDetail.deliveryStartTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    activityStatusChange(value, date) {
      if (value === 'expire' || value === 'off') {
        this.searchRowData.sidx = 'start_time';
        this.searchRowData.sort = 'desc';
      }
    },
    validSecondsChange() {
      const hour = this.teambuyDetail.hour * 60 * 60;
      const minute = this.teambuyDetail.minute * 60;
      const second = this.teambuyDetail.second;
      this.teambuyDetail.validSeconds = hour + minute + second;
    },
    originalPriceInputNumberOnchange(value) {
      this.teambuyDetail.originalPrice = yuanToFenNumber(value);
    },
    activityPriceInputNumberOnchange(value) {
      this.teambuyDetail.activityPrice = yuanToFenNumber(value);
    },
    singleTeambuyPriceInputNumberOnchange(value) {
      this.teambuyDetail.singleTeambuyPrice = yuanToFenNumber(value);
    },
    tourDiscountInputNumberOnchange(value) {
      this.teambuyDetail.tourDiscount = yuanToFenNumber(value);
    },
    selectStore(options) {
      if (options.value === 'ALL') {
        this.showStoreList = false;
      } else if (options.value === 'PART') {
        this.showStoreList = true;
      }
    },
    // TODO 选择门店id方法
    getStore() {
      getStorePages({ page: 1, rows: -1 })
        .then(res => {
          this.storeList = res.rows;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        const allIds = [];
        this.storeList.forEach(item => {
          allIds.push(item.storeId);
        });
        this.storeIds = allIds;
      } else {
        this.storeIds = [];
      }
    },
    onRowClick(row, index) {
      // 给团购活动赋值
      this.teambuyDetail.standardId = row.id;
      this.teambuyDetail.originalPrice = row.price;
      this.modalProduct = false;
    },
    checkAllGroupChange(data) {
      if (data.length === this.storeList.length) {
        this.indeterminate = false;
        this.checkAll = true;
        this.teambuyDetail.storeIds = ''; // 全选存空字符串
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
        this.teambuyDetail.storeIds = '[' + data.join('][') + ']';
        console.log('storeIds before submit:', this.teambuyDetail.storeIds);
      } else {
        this.indeterminate = false;
        this.checkAll = false;
        this.teambuyDetail.storeIds = '';
      }
    },
    handleRelation() {
      this.getProductTableData();
      this.modalProduct = true;
    },
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData)
        .then(res => {
          this.productData = res.rows;
          this.productTotal = res.total;
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
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.searchLoading = true;
      this.getProductTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置商品搜索数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.clearSearchLoading = true;
      this.handleProductSearch();
    },
    onSelectionAll(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    },
    onSelectionChange(selection) {
      this.tableDataSelected = selection;
      if (selection.length === 1) {
        this.currentTableRowSelected = selection[0];
      } else {
        this.currentTableRowSelected = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
