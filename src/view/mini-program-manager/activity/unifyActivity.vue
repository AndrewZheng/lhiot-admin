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
        @on-sale="handleSwitch"
        @on-relevance="handleSetting"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Row>
            <Input
              v-model="searchRowData.activityName"
              placeholder="活动名称"
              class="search-input mr5"
              style="width: auto"
              clearable
            ></Input>
            <Select
              v-model="searchRowData.activityType"
              placeholder="活动类型"
              style="padding-right: 5px; width: 130px"
              @on-change="handCouponType"
            >
              <Option
                v-for="(item, index) in activityTypeEnum"
                :key="index"
                :value="item.indexName"
                class="ptb2-5"
              >
                {{ item.indexValue }}
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
            @click="handleCreate"
          >
            <Icon type="md-add" />添加
          </Button>
        </div>
      </tables>
      <div style="margin: 10px;overflow: hidden">
        <Row type="flex" justify="end">
          <Page
            :total="total"
            :current="searchRowData.page"
            :page-size="searchRowData.rows"
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
                {{ activitiesDetail.id }}
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
                {{ activitiesDetail.activityName }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动类型:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.activityType | activityTypeFilter(activityTypeEnum) }}
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
                {{ activitiesDetail.startTime }}
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
                {{ activitiesDetail.endTime }}
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
              <i-col v-if="activitiesDetail.status === 'VALID'" span="18">
                <tag color="success">
                  {{ "有效" | imageStatusFilter }}
                </tag>
              </i-col>
              <i-col v-else-if="activitiesDetail.status === 'INVALID'" span="18">
                <tag color="error">
                  {{ "无效" | imageStatusFilter }}
                </tag>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-show="activitiesDetail.activityType==='COLLECT_WORD_ACTIVITY'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                默认次数:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.defaultCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                分享次数:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.shareCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                消耗积分:
              </i-col>
              <i-col span="18" class="text-center">
                {{ activitiesDetail.consumPoints }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                抽奖次数:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.lotteryDrawCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'" class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                中奖最大次数:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.rewardMaxCount }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <!-- <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">宣传图片:</i-col>
              <i-col span="18">
                <img :src="activitiesDetail.banner" style="width: 150px" />
              </i-col>
            </Row>
          </i-col>
        </Row> -->
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">
                活动规则:
              </i-col>
              <i-col span="18">
                {{ activitiesDetail.content }}
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
        <i-col>{{ isEdit?'修改活动':'创建活动' }}</i-col>
      </p>
      <div class="modal-content">
        <Form ref="editForm" :model="activitiesDetail" :rules="ruleInline" :label-width="100">
          <Row>
            <i-col span="22">
              <FormItem label="活动名称:" prop="activityName">
                <Input v-model="activitiesDetail.activityName" :readonly="activitiesDetail.isValid"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="22">
              <FormItem label="开始时间:" prop="startTime">
                <DatePicker
                  :value="activitiesDetail.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="开始时间"
                  style="width: 160px"
                  :readonly="activitiesDetail.isValid"
                  @on-change="startTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="22">
              <FormItem label="结束时间:" prop="endTime">
                <DatePicker
                  :value="activitiesDetail.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 160px"
                  :readonly="activitiesDetail.isValid"
                  @on-change="endTimeChange"
                />
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="22">
              <FormItem label="活动类型:" prop="activityType">
                <Select v-model="activitiesDetail.activityType" clearable style="width: 160px">
                  <Option
                    v-for="(item,index) in activityTypeEnum"
                    :key="index"
                    :value="item.indexName"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >
                    {{ item.indexValue }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="activitiesDetail.activityType==='COLLECT_WORD_ACTIVITY'">
            <i-col span="22">
              <FormItem label="默认次数:" prop="defaultCount">
                <InputNumber
                  v-model="activitiesDetail.defaultCount"
                  :min="0"
                  label="默认次数"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="22">
              <FormItem label="分享次数:" prop="shareCount">
                <InputNumber
                  v-model="activitiesDetail.shareCount"
                  :min="0"
                  style="width: 160px"
                  label="分享次数"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'">
            <i-col span="22">
              <FormItem label="消耗积分:" prop="consumPoints">
                <InputNumber
                  v-model="activitiesDetail.consumPoints"
                  :min="0"
                  style="width: 160px"
                  label="消耗积分/次"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'">
            <i-col span="22">
              <FormItem label="抽奖次数:" prop="lotteryDrawCount">
                <InputNumber
                  v-model="activitiesDetail.lotteryDrawCount"
                  :min="0"
                  style="width: 160px"
                  label="抽奖次数"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row v-show="activitiesDetail.activityType==='POINTS_LOTTERY_ACTIVITY'">
            <i-col span="22">
              <FormItem label="中奖最大次数:" prop="rewardMaxCount">
                <InputNumber
                  v-model="activitiesDetail.rewardMaxCount"
                  :min="0"
                  style="width: 160px"
                  label="抽奖次数"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="22">
              <FormItem label="活动状态:" prop="status">
                <Select v-model="activitiesDetail.status" clearable style="width: 160px">
                  <Option
                    v-for="(item,index) in couponStatusEnum"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 100%"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <!-- <Row>
            <FormItem label="活动图片:" prop="banner">
              <Input v-show="false" v-model="activitiesDetail.banner" style="width: auto"></Input>
              <div v-for="item in uploadListMain" :key="item.url" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <div>
                    <img :src="item.url" />
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
          </Row> -->
          <Row>
            <i-col span="22">
              <FormItem label="活动规则:" prop="content">
                <Input
                  v-model="activitiesDetail .content"
                  :rows="6"
                  placeholder="活动规则"
                  type="textarea"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">
          关闭
        </Button>
        <Button :loading="modalViewLoading" type="primary" @click="handleSubmit('editForm')">
          确定
        </Button>
      </div>
    </Modal>

    <!-- 活动关联 -->
    <Modal v-model="modalRelevance" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '添加七夕活动关联' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <!-- 集字关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesCouponCon"
            v-model="collectWordSetting"
            :columns="collectWordColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-delete="handleDelCollection"
            @on-edit="handleCollectWordEdit"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('COLLECTION_SETTING')"
                >
                  <Icon type="md-add" />&nbsp;集字配置
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 券关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesCouponCon"
            v-model="couponConfigManageRelations"
            :columns="couponCondataColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-delete="handleDelRelevance"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('HOLIDAY_ACTIVITY_COUPON')"
                >
                  <Icon type="md-add" />&nbsp;关联活动优惠券
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="modalRelevance = false">
          关闭
        </Button>
      </div>
    </Modal>

    <!-- 券列表 -->
    <Modal v-model="modalAddCoupun" :width="1000" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ "关联优惠券" }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tablesCouponTemplate"
            v-model="couponTemplateData"
            :columns="templateColumns"
            highlight-row
            border
            searchable
            search-place="top"
            @on-current-change="handleTemplateChange"
          ></tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="couponTemplateTotal"
                :current="searchTemplateRowData.page"
                :page-size="searchTemplateRowData.rows"
                show-sizer
                show-total
                @on-change="changeCouponPage"
                @on-page-size-change="changeCouponPageSize"
              ></Page>
            </Row>
          </div>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">
          关闭
        </Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('HOLIDAY_ACTIVITY_COUPON')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <!-- 集字配置 -->
    <Modal v-model="modalAddCollection" :width="600" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ isCreateStatus?'新增集字配置':'修改集字配置' }}</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="modalCollection"
          :model="collectWordSettingRelation"
          :rules="collectWordRuleInline"
          :label-width="100"
        >
          <Row>
            <i-col span="18">
              <FormItem label="集字名称:" prop="wordKeyName">
                <Input v-model="collectWordSettingRelation.wordKeyName"></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="18">
              <FormItem label="集字发放比例:" prop="wordKeyScale">
                <InputNumber
                  v-model="collectWordSettingRelation.wordKeyScale"
                  :min="0"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="18">
              <FormItem label="排序:" prop="rank">
                <InputNumber
                  v-model="collectWordSettingRelation.rank"
                  :min="0"
                  style="width: 160px"
                ></InputNumber>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleAddClose">
          关闭
        </Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('COLLECTION_SETTING')"
        >
          确定
        </Button>
      </div>
    </Modal>

    <!-- 积分抽奖配置 -->
    <Modal v-model="modalLottery" :width="1200" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ isCreateLottery?'新增抽奖配置':'修改抽奖配置' }}</i-col>
      </p>
      <div class="modal-content">
        <Row>
          <Card>
            <div class="tabChange">
              <b
                :class="topStatus == 'PROD' ? 'hot' : ''"
                data-index="PROD"
                @click="handleTabChange"
              >抽奖商品</b>
              <b
                :class="topStatus == 'COUPON' ? 'hot' : ''"
                data-index="COUPON"
                @click="handleTabChange"
              >优惠券</b>
              <b
                :class="topStatus == 'PSEUDO' ? 'hot' : ''"
                data-index="PSEUDO"
                @click="handleTabChange"
              >谢谢参与</b>
            </div>

            <!-- 积分抽奖商品 -->
            <div v-show="topStatus === 'PROD'">
              <tables
                ref="tables"
                v-model="products"
                :columns="productColumns"
                :loading="tempTableLoading"
                border
                searchable
                search-place="top"
                highlight-row
                @on-current-change="handleRelationChange"
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
                      class="search-btn mr5"
                      type="primary"
                      @click="handleProductSearch"
                    >
                      <Icon type="md-search" />&nbsp;搜索
                    </Button>
                    <Button
                      v-waves
                      class="search-btn"
                      type="info"
                      @click="handleProductClear"
                    >
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>

              <div style="margin: 10px 10px 20px 10px; overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="productTotal"
                    :current="searchProductRowData.page"
                    :page-size="searchProductRowData.rows"
                    :page-size-opts="templatePageOpts"
                    show-sizer
                    show-total
                    @on-change="changeProductPage"
                    @on-page-size-change="changeProductPageSize"
                  ></Page>
                </Row>
              </div>
            </div>

            <!-- 优惠券 -->
            <div v-show="topStatus === 'COUPON'">
              <tables
                ref="tables"
                v-model="coupons"
                :columns="couponColumns"
                :loading="tempTableLoading"
                border
                searchable
                search-place="top"
                highlight-row
                @on-current-change="handleRelationChange"
              >
                <div slot="searchCondition">
                  <Row>
                    <Input
                      v-model="searchCouponRowData.couponName"
                      placeholder="优惠券名称"
                      class="search-input mr5"
                      style="width: auto"
                      clearable
                    ></Input>
                    <Button
                      class="search-btn mr5"
                      type="primary"
                      @click="handleCouponSearch"
                    >
                      <Icon type="md-search" />&nbsp;搜索
                    </Button>
                    <Button
                      v-waves
                      class="search-btn"
                      type="info"
                      @click="handleCouponClear"
                    >
                      <Icon type="md-refresh" />&nbsp;清除
                    </Button>
                  </Row>
                </div>
              </tables>

              <div style="margin: 10px 10px 20px 10px; overflow: hidden">
                <Row type="flex" justify="end">
                  <Page
                    :total="couponsTotal"
                    :current="searchCouponRowData.page"
                    :page-size="searchCouponRowData.rows"
                    :page-size-opts="templatePageOpts"
                    show-sizer
                    show-total
                    @on-change="changeLotteryCouponPage"
                    @on-page-size-change="changeLotteryCouponPageSize"
                  ></Page>
                </Row>
              </div>
            </div>

            <Divider orientation="center">
              抽奖参数配置
            </Divider>

            <Form
              ref="modalCreate"
              :model="addRelationDetail"
              :rules="relationRuleInline"
              :label-width="120"
            >
              <Row class="mb20">
                <i-col span="6">
                  <FormItem label="奖品名称:" prop="rewardName">
                    <Input
                      v-model="addRelationDetail.rewardName"
                      label="排序"
                      style="width: 150px"
                      clearable
                    ></Input>
                  </FormItem>
                </i-col>
                <i-col span="5">
                  <FormItem label="中奖比例:" prop="rewardScale">
                    <InputNumber
                      v-model="addRelationDetail.rewardScale"
                      style="padding-right: 5px; width: 120px"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="5">
                  <FormItem label="排序:" prop="rank">
                    <Input
                      v-model="addRelationDetail.rank"
                      :min="0"
                      label="排序"
                      style="width: 100px"
                    ></Input>
                  </FormItem>
                </i-col>
              </Row>
              <Row class="mb20">
                <i-col span="5">
                  <FormItem label="中奖图片:" prop="rewardImg">
                    <Input
                      v-show="false"
                      v-model="addRelationDetail.rewardImg"
                      style="width: auto"
                    ></Input>
                    <div
                      v-for="item in uploadListMain"
                      :key="item.url"
                      class="demo-upload-list"
                    >
                      <template v-if="item.status === 'finished'">
                        <div>
                          <img :src="item.url">
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
                      @on-success="handleSuccessMain"
                    >
                      <div
                        slot="content"
                        style="width: 58px; height: 58px; line-height: 58px"
                      >
                        <Icon type="ios-camera" size="20"></Icon>
                      </div>
                    </IViewUpload>
                  </FormItem>
                </i-col>
                <i-col span="5">
                  <Button
                    v-show="proFlag === true"
                    v-waves
                    :loading="addTempDataLoading"
                    span="4"
                    class="search-btn ml15"
                    type="primary"
                    @click="addTempData('modalCreate')"
                  >
                    <Icon type="md-add" />&nbsp;关联抽奖商品/券
                  </Button>
                </i-col>
              </Row>
            </Form>*Tips：请先选择要关联的商品/券，然后输入关联配置信息，添加完成后可在下方表格修改.
          </Card>
        </Row>

        <Divider orientation="center">
          已关联抽奖商品/券
        </Divider>
        <tables
          v-model="relationProducts"
          :columns="relationColumns"
          :loading="tempTableLoading"
          border
          @on-sale="handleSwitchStatus"
          @on-view="handleRelevanceView"
          @on-edit="handleRelevanceEdit"
        ></tables>
      </div>
      <div slot="footer">
        <Button @click="handleLotteryClose">关闭
        </Button>
        <!-- <Button
          type="primary"
          @click="handleRelevanceAdd('COLLECTION_SETTING')"
        >
          确定
        </Button> -->
      </div>
    </Modal>

    <!-- 修改关联商品/券详情 -->
    <Modal
      v-model="modalRelevanceEdit"
      :mask-closable="false"
      :width="1000"
      draggable
    >
      <p slot="header">
        <i-col>修改关联商品/券关联</i-col>
      </p>
      <div class="modal-content">
        <Form
          ref="editRelevanceForm"
          :model="updateRelationDetail"
          :rules="relationRuleInline"
          :label-width="120"
        >
          <Row class="mb20">
            <i-col span="7">
              <FormItem label="奖品名称:" prop="rewardName">
                <Input
                  v-model="updateRelationDetail.rewardName"
                  label="排序"
                  style="width: 150px"
                  clearable
                ></Input>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="中奖比例:" prop="rewardScale">
                <InputNumber
                  v-model="updateRelationDetail.rewardScale"
                  style="padding-right: 5px; width: 120px"
                ></InputNumber>
              </FormItem>
            </i-col>
            <i-col span="6">
              <FormItem label="排序:" prop="rank">
                <Input
                  v-model="updateRelationDetail.rank"
                  :min="0"
                  label="排序"
                  style="width: 100px"
                ></Input>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <FormItem label="中奖图片:" prop="rewardImg">
                <Input
                  v-show="false"
                  v-model="updateRelationDetail.rewardImg"
                  style="width: auto"
                ></Input>
                <div
                  v-for="item in uploadListMainRelation"
                  :key="item.url"
                  class="demo-upload-list"
                >
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url">
                      <div class="demo-upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleUploadView(item)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleRelationRemoveMain(item)"
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
                  ref="uploadMainRelation"
                  :default-list="defaultListMain"
                  :image-size="imageSize"
                  @on-success="handleRelationSuccessMain"
                >
                  <div
                    slot="content"
                    style="width: 58px; height: 58px; line-height: 58px"
                  >
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditRelevanceClose">
          关闭
        </Button>
        <Button
          type="primary"
          @click="handleconfirmEdit"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import _ from 'lodash';
import IViewUpload from '_c/iview-upload';
import {
  getUnifyActivityPages,
  updateUnifyActivity,
  createUnifyActivity,
  createActiviyRelation,
  getUnifyActivity,
  getCouponPagess,
  getProductStandardsPages,
  getSystemParameter,
  updateUnifyActivityRelevance,
  deleteUnifyActivityRelevance,
  deleteWollectWordRelevance,
  createUnifyActivityRelevance,
  createWollectWordRelevance,
  updateWollectWordRelevance
} from '@/api/mini-program';
import uploadMixin from '@/mixins/uploadMixin';
import tableMixin from '@/mixins/tableMixin.js';
import {
  couponStatusConvert,
  couponTypeConvert,
  prizeTypeConvert,
  expandTypeConvert
} from '@/libs/converStatus';
import {
  couponStatusEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  validDateTypeEnum,
  userScopeEnum,
  prizeTypeEnum,
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  relationStoreTypeEnum
} from '@/libs/enumerate';
import {
  fenToYuanDot2,
  compareCouponData
} from '@/libs/util';

const activitiesDetail = {
  activityName: '',
  activityType: '',
  banner: null,
  content: '',
  createTime: null,
  createUser: '',
  endTime: null,
  extendedJsonStr: null,
  startTime: null,
  status: 'VALID',
  defaultCount: null, // 集字活动-默认次数
  shareCount: null,
  consumPoints: null, // 抽奖活动-每次消耗积分
  lotteryDrawCount: null, // 抽奖活动-抽奖次数
  rewardMaxCount: null, // 抽奖活动-中奖最大次数
  isValid: null
};

const relationDetail = {
  id: 0,
  activityId: 0,
  standardId: 0,
  peopleNumber: '',
  isEdit: false,
  status: '',
  createTime: '',
  updateTime: '',
  rank: '',
  activityLimit: '',
  productStandard: {},
  couponConfigManage: {},
  couponConfigId: 0,
  type: 'PROD',
  rewardImg: '',
  rewardScale: 0,
  rewardName: '',
  extendedJsonStr: null
};

const productDetail = {
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
  description: '',
  shelvesStatus: null,
  applyType: null,
  productName: '',
  createUser: null,
  image: '',
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

const activitySettingRelation = {
  activitySettingId: '',
  couponFee: '',
  couponName: '',
  couponStatus: '',
  couponType: '',
  effectiveEndTime: '',
  effectiveStartTime: '',
  minBuyFee: '',
  rank: '',
  relationId: '',
  relationType: '',
  source: '',
  status: ''
};

const collectWordSettingRelation = {
  activitySettingId: '',
  rank: 0,
  wordKeyName: '',
  wordKeyScale: 0
};

const roleRowData = {
  status: '',
  activityName: null,
  activityType: null, // 七夕集字-COLLECT_WORD_ACTIVITY 积分抽奖-POINTS_LOTTERY_ACTIVITY
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
};

// 优惠券
const templateRowData = {
  couponBusinessType: 'HOLIDAY_ACTIVITY_COUPON',
  page: 1,
  rows: 10,
  sidx: 'createTime',
  sort: 'desc'
};

const productRowData = {
  applyType: null,
  sectionName: null,
  productName: null,
  barcode: null,
  shelvesStatus: 'VALID',
  productType: 'POINTS_LOTTERY_PRODUCT',
  page: 1,
  rows: 5
};

const couponRowData = {
  couponName: '',
  couponBusinessType: 'POINTS_LOTTERY_COUPON',
  page: 1,
  rows: 5,
  couponStatus: 'VALID',
  sidx: 'createTime',
  sort: 'desc'
};

const templateColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 90
  },
  {
    title: '券类型',
    align: 'center',
    key: 'couponType',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'FREIGHT_COUPON') {
        return (
          <div>
            <tag color='blue'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    minWidth: 130,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    key: 'minBuyFee',
    align: 'center',
    minWidth: 120,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    minWidth: 120,
    render(h, params) {
      if (params.row.maxDiscountFee) {
        return <div>{fenToYuanDot2(params.row.maxDiscountFee)}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '券状态',
    key: 'couponStatus',
    align: 'center',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === 'VALID') {
        return (
          <div>
            <tag color='success'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === 'INVALID') {
        return (
          <div>
            <tag color='error'>
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    }
  }
  // {
  //   title: "创建时间",
  //   align: "center",
  //   minWidth: 120,
  //   key: "createTime",
  // },
];

const productColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '规格ID',
    key: 'id',
    minWidth: 60,
    align: 'center'
  },
  {
    title: '商品条码',
    key: 'barcode',
    minWidth: 70,
    align: 'center'
  },
  {
    title: '商品编码',
    key: 'productCode',
    align: 'center',
    minWidth: 120
  },
  {
    title: '商品名称',
    key: 'productName',
    minWidth: 160,
    align: 'center'
  },
  {
    title: '商品规格',
    key: 'specification',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '商品单位',
    key: 'productUnit',
    minWidth: 80,
    align: 'center'
  },
  {
    title: '售卖价格',
    key: 'salePrice',
    minWidth: 80,
    align: 'center',
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.salePrice);
      return <div>{amount}</div>;
    }
  },
  {
    title: '商品类型',
    minWidth: 120,
    key: 'productType',
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.productType === 'DISCOUNT_PRODUCT') {
        return (
          <div>
            <tag color='magenta'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'PULL_NEW_PRODUCT') {
        return (
          <div>
            <tag color='orange'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'SECKILL_PRODUCT') {
        return (
          <div>
            <tag color='blue'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'NEW_TRY_PRODUCT') {
        return (
          <div>
            <tag color='blue'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'ASSIST_PRODUCT') {
        return (
          <div>
            <tag color='green'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else if (row.productType === 'POINTS_LOTTERY_PRODUCT') {
        return (
          <div>
            <tag color='green'>
              {expandTypeConvert(row.productType).label}
            </tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color='cyan'>{'普通商品'}</tag>
          </div>
        );
      }
    }
  }
];

const couponColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '优惠券名称',
    key: 'couponName',
    align: 'center',
    minWidth: 130
  },
  {
    title: '优惠券类型',
    align: 'center',
    key: 'couponType',
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === 'FULL_CUT_COUPON') {
        return (
          <div>
            <tag color='magenta'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'DISCOUNT_COUPON') {
        return (
          <div>
            <tag color='orange'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'CASH_COUPON') {
        return (
          <div>
            <tag color='cyan'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === 'FREIGHT_COUPON') {
        return (
          <div>
            <tag color='blue'>{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    }
  },
  {
    title: '优惠/折扣额度',
    align: 'center',
    key: 'couponFee',
    minWidth: 80,
    render(h, params) {
      const { row } = params;
      if (row.couponType === 'DISCOUNT_COUPON') {
        return <div>{row.couponFee / 10 + '折'}</div>;
      } else {
        return <div>{fenToYuanDot2(row.couponFee)}</div>;
      }
    }
  },
  {
    title: '最小购买金额',
    key: 'minBuyFee',
    align: 'center',
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    }
  },
  {
    title: '最高优惠金额',
    align: 'center',
    key: 'maxDiscountFee',
    minWidth: 60,
    render(h, params) {
      const { row } = params;
      if (row.maxDiscountFee != null) {
        return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
      } else {
        return <div>{'N/A'}</div>;
      }
    }
  },
  {
    title: '券来源',
    align: 'center',
    key: 'source',
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === 'SMALL') {
        return <div>小程序</div>;
      } else if (row.source === 'HD') {
        return <div>海鼎</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '生效时间',
    key: 'effectiveStartTime',
    align: 'center',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
        return <div>{row.effectiveStartTime}</div>;
      } else if (
        row.source === 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.beginDay}</div>;
      } else if (row.source === 'HD') {
        return <div>{row.effectiveStartTime}</div>;
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '失效时间',
    key: 'effectiveEndTime',
    align: 'center',
    minWidth: 90,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.source === 'SMALL' && row.validDateType === 'FIXED_DATE') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else if (
        row.source === 'SMALL' &&
        row.validDateType === 'UN_FIXED_DATE'
      ) {
        return <div>{row.endDay}</div>;
      } else if (row.source === 'HD') {
        if (!compareCouponData(row.effectiveEndTime)) {
          return <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>;
        } else {
          return <div>{row.effectiveEndTime}</div>;
        }
      } else {
        return <div>N/A</div>;
      }
    }
  }
];

const relationTempColumns = [
  {
    title: '商品/券名称',
    key: 'rewardName',
    minWidth: 130,
    align: 'center',
    render: (h, params, vm) => {
      const { row } = params;
      const str = JSON.parse(row.extendedJsonStr);
      return <div>{str.rewardName}</div>;
    }
  },
  {
    title: '商品价格/券额度',
    key: 'salePrice',
    minWidth: 120,
    align: 'center',
    render(h, params) {
      const { row } = params;
      if (row.relationType === 'PROD') {
        return (
          <div>{fenToYuanDot2(row.productStandard.salePrice)}</div>
        );
      } else if (row.relationType === 'COUPON') {
        if (row.couponConfigManage.couponType === 'DISCOUNT_COUPON') {
          return <div>{row.couponConfigManage.couponFee / 10 + '折'}</div>;
        } else {
          return <div>{fenToYuanDot2(row.couponConfigManage.couponFee)}</div>;
        }
      }
    }
  },
  {
    title: '商品/券类型',
    align: 'center',
    key: 'couponType',
    width: 140,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.relationType === 'COUPON') {
        if (row.couponConfigManage.couponType === 'FULL_CUT_COUPON') {
          return (
            <div>
              <tag color='magenta'>
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === 'DISCOUNT_COUPON') {
          return (
            <div>
              <tag color='orange'>
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === 'CASH_COUPON') {
          return (
            <div>
              <tag color='cyan'>
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        } else if (row.couponConfigManage.couponType === 'FREIGHT_COUPON') {
          return (
            <div>
              <tag color='blue'>
                {couponTypeConvert(row.couponConfigManage.couponType).label}
              </tag>
            </div>
          );
        }
        return <div>{row.couponConfigManage.couponType}</div>;
      } else if (row.relationType === 'PROD') {
        if (
          row.productStandard.productType === 'POINTS_LOTTERY_PRODUCT'
        ) {
          return (
            <div>
              <tag color='green'>{expandTypeConvert(row.productStandard.productType).label}
              </tag>
            </div>
          );
        }
      }
    }
  },
  {
    title: '券来源',
    align: 'center',
    minWidth: 100,
    key: 'source',
    render: (h, params, vm) => {
      const { row } = params;
      if (row.relationType === 'COUPON') {
        if (row.couponConfigManage.source === 'SMALL') {
          return <div>小程序</div>;
        } else if (row.couponConfigManage.source === 'HD') {
          return <div>海鼎</div>;
        }
      } else {
        return <div>N/A</div>;
      }
    }
  },
  {
    title: '中奖比例',
    align: 'center',
    minWidth: 100,
    key: 'rewardScale',
    render: (h, params, vm) => {
      const { row } = params;
      const str = JSON.parse(row.extendedJsonStr);
      return <div>{str.rewardScale}</div>;
    }
  },
  {
    title: '中奖图片',
    align: 'center',
    minWidth: 100,
    key: 'rewardImg',
    render: (h, params, vm) => {
      const { row } = params;
      const str = JSON.parse(row.extendedJsonStr);
      return <div>{<img src={str.rewardImg} height='60' width='60' />}</div>;
    }
  },
  {
    title: '排序',
    key: 'rank',
    align: 'center',
    minWidth: 60
  },
  {
    title: '状态',
    align: 'center',
    key: 'status',
    minWidth: 60,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === 'ON') {
        return (
          <div>
            <tag color='success'>{'上架'}</tag>
          </div>
        );
      } else if (row.status === 'OFF') {
        return (
          <div>
            <tag color='error'>{'下架'}</tag>
          </div>
        );
      } else {
        return (
          <div>
            <tag color='primary'>{row.status}</tag>
          </div>
        );
      }
    }
  }
];

export default {
  components: {
    Tables,
    IViewUpload
  },
  filters: {
    activityTypeFilter(value, enums) {
      if (!value) return 'N/A';
      const type = enums.find(item => item.indexName === value);
      return type ? type.indexValue : 'N/A';
    }
  },
  mixins: [tableMixin, uploadMixin],
  data() {
    return {
      defaultListMain: [],
      uploadListMain: [],
      uploadListMainRelation: [],
      couponConfigManageRelations: [],
      collectWordSetting: [],
      couponTemplateData: [],
      relationProducts: [],
      activityTypeEnum: [],
      products: [],
      coupons: [],
      templatePageOpts: [5, 10],
      modalRelevance: false,
      modalRelevanceEdit: false,
      modalAddCoupun: false,
      modalAddCollection: false,
      modalLottery: false,
      modalRelevanceLoading: false,
      addTempDataLoading: false,
      tempTableLoading: false,
      isCreateStatus: true,
      isCreateLottery: true,
      proFlag: true,
      couponTemplateTotal: 0,
      productTotal: 0,
      couponsTotal: 0,
      activitySettingId: null,
      activityIsValid: null,
      topStatus: 'PROD',
      prizeTypeEnum,
      couponStatusEnum,
      couponTypeEnum,
      couponScopeEnum,
      couponUseLimitEnum,
      validDateTypeEnum,
      userScopeEnum,
      teamBuyStatusEnum,
      teamBuyTypeEnum,
      rewardActivitySettingEnum,
      relationStoreTypeEnum,
      templateColumns: templateColumns,
      ruleInline: {
        activityName: [{ required: true, message: '请输入活动名称' }],
        status: [{ required: true, message: '请选择活动状态' }],
        // banner: [{ required: true, message: "请添加活动图片" }],
        content: [{ required: true, message: '请输入活动规则' }],
        startTime: [{ required: true, message: '请选择活动开始时间' }],
        endTime: [{ required: true, message: '请选择活动结束时间' }],
        defaultCount: [{ required: false, message: '请输入默认次数' }],
        shareCount: [{ required: true, message: '请输入分享次数' }]
      },
      collectWordRuleInline: {
        wordKeyName: [{ required: true, message: '请输入集字名称' }],
        wordKeyScale: [{ required: true, message: '请输入集字发放比例' }],
        rank: [{ required: true, message: '请添加排序' }]
      },
      relationRuleInline: {
        rewardScale: [
          { required: true, message: '请输入中奖比例' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        rank: [
          { required: true, message: '请输入排序' },
          {
            validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[-1-9]\d*$/.test(value)) {
                errors.push(new Error('必须为非零整数'));
              }
              callback(errors);
            }
          }
        ],
        rewardImg: [{ required: false, message: '请上传中奖图片' }]
      },
      columns: [
        {
          title: '活动ID',
          align: 'center',
          key: 'id',
          minWidth: 90
        },
        {
          title: '活动名称',
          align: 'center',
          key: 'activityName',
          minWidth: 260
        },
        {
          title: '开始时间',
          align: 'center',
          key: 'startTime',
          minWidth: 120
        },
        {
          title: '结束时间',
          align: 'center',
          key: 'endTime',
          minWidth: 180,
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style='color:red'>{row.endTime + '已过期'}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          }
        },
        {
          title: '默认次数',
          align: 'center',
          minWidth: 100,
          key: 'defaultCount',
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.defaultCount}</div>;
          }
        },
        {
          title: '分享次数',
          align: 'center',
          minWidth: 100,
          key: 'shareCount',
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.shareCount}</div>;
          }
        },
        {
          title: '消耗积分',
          align: 'center',
          minWidth: 100,
          key: 'consumPoints',
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.consumPoints}</div>;
          }
        },
        {
          title: '抽奖次数',
          align: 'center',
          minWidth: 100,
          key: 'lotteryDrawCount',
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.lotteryDrawCount}</div>;
          }
        },
        {
          title: '中奖最大次数',
          align: 'center',
          minWidth: 120,
          key: 'rewardMaxCount',
          render: (h, params, vm) => {
            const { row } = params;
            const str = JSON.parse(row.extendedJsonStr);
            return <div>{str.rewardMaxCount}</div>;
          }
        },
        {
          title: '活动状态',
          align: 'center',
          key: 'status',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'VALID') {
              return (
                <div>
                  <tag color='success'>
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            } else if (row.status === 'INVALID') {
              return (
                <div>
                  <tag color='error'>
                    {couponStatusConvert(row.status).label}
                  </tag>
                </div>
              );
            }
            return (
              <div>
                <tag color='primary'>{'N/A'}</tag>
              </div>
            );
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 200,
          key: 'handle',
          options: ['onSale', 'view', 'edit', 'settings']
        }
      ],
      // 优惠券
      couponCondataColumns: [
        {
          title: '券名称',
          align: 'center',
          key: 'couponName',
          minWidth: 100
        },
        {
          title: '券类型',
          align: 'center',
          key: 'couponType',
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponType === 'FULL_CUT_COUPON') {
              return (
                <div>
                  <tag color='magenta'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'DISCOUNT_COUPON') {
              return (
                <div>
                  <tag color='orange'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'CASH_COUPON') {
              return (
                <div>
                  <tag color='cyan'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponType === 'FREIGHT_COUPON') {
              return (
                <div>
                  <tag color='blue'>
                    {couponTypeConvert(row.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponType}</div>;
          },
          minWidth: 90
        },
        {
          title: '优惠/折扣额度',
          align: 'center',
          key: 'couponFee',
          minWidth: 120,
          render(h, params) {
            const { row } = params;
            if (row.couponType === 'DISCOUNT_COUPON') {
              return <div>{row.couponFee / 10 + '折'}</div>;
            } else {
              return <div>{fenToYuanDot2(row.couponFee)}</div>;
            }
          }
        },
        {
          title: '最小购买金额',
          align: 'center',
          key: 'minBuyFee',
          minWidth: 130,
          render(h, params) {
            return h('div', fenToYuanDot2(params.row.minBuyFee));
          }
        },
        {
          title: '最高优惠金额',
          align: 'center',
          key: 'maxDiscountFee',
          minWidth: 130,
          render(h, params) {
            const { row } = params;
            if (row.maxDiscountFee != null) {
              return <div>{fenToYuanDot2(row.maxDiscountFee)}</div>;
            } else {
              return <div>{'N/A'}</div>;
            }
          }
        },
        {
          title: '生效时间',
          key: 'effectiveStartTime',
          align: 'center',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
              return <div>{row.effectiveStartTime}</div>;
            } else if (
              row.source == 'SMALL' &&
              row.validDateType === 'UN_FIXED_DATE'
            ) {
              return <div>{row.beginDay}</div>;
            } else if (row.source == 'HD') {
              return <div>{row.effectiveStartTime}</div>;
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '失效时间',
          key: 'effectiveEndTime',
          align: 'center',
          minWidth: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.source == 'SMALL' && row.validDateType === 'FIXED_DATE') {
              if (!compareCouponData(row.effectiveEndTime)) {
                return (
                  <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>
                );
              } else {
                return <div>{row.effectiveEndTime}</div>;
              }
            } else if (
              row.source == 'SMALL' &&
              row.validDateType === 'UN_FIXED_DATE'
            ) {
              return <div>{row.endDay}</div>;
            } else if (row.source == 'HD') {
              if (!compareCouponData(row.effectiveEndTime)) {
                return (
                  <div style='color:red'>{row.effectiveEndTime + '已过期'}</div>
                );
              } else {
                return <div>{row.effectiveEndTime}</div>;
              }
            } else {
              return <div>N/A</div>;
            }
          }
        },
        {
          title: '排序',
          align: 'center',
          minWidth: 70,
          key: 'rank',
          render(h, params) {
            const { row } = params;
            return h('div', row.rank);
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          minWidth: 70,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === 'ON') {
              return (
                <div>
                  <tag color='success'>{'上架'}</tag>
                </div>
              );
            } else if (row.status === 'OFF') {
              return (
                <div>
                  <tag color='error'>{'下架'}</tag>
                </div>
              );
            }
            return <div>{'N/A'}</div>;
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 70,
          key: 'handle',
          options: ['delete']
        }
      ],
      collectWordColumns: [
        {
          title: '集字名称',
          align: 'center',
          key: 'wordKeyName'
        },
        {
          title: '集字发放比例',
          align: 'center',
          key: 'wordKeyScale',
          render(h, params) {
            const { row } = params;
            return h('div', row.wordKeyScale + '%');
          }
        },
        {
          title: '排序',
          align: 'center',
          key: 'rank',
          render(h, params) {
            const { row } = params;
            return h('div', row.rank);
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 90,
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      relationColumns: [
        ...relationTempColumns,
        {
          title: '操作',
          align: 'center',
          minWidth: 120,
          key: 'handle',
          options: ['onSale', 'edit']
        }
      ],
      productColumns: _.cloneDeep(productColumns),
      couponColumns: _.cloneDeep(couponColumns),
      searchRowData: _.cloneDeep(roleRowData),
      activitiesDetail: _.cloneDeep(activitiesDetail),
      addRelationDetail: _.cloneDeep(relationDetail),
      updateRelationDetail: _.cloneDeep(relationDetail),
      productDetail: _.cloneDeep(productDetail),
      searchProductRowData: _.cloneDeep(productRowData),
      searchCouponRowData: _.cloneDeep(couponRowData),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      activitySettingRelation: _.cloneDeep(activitySettingRelation),
      collectWordSettingRelation: _.cloneDeep(collectWordSettingRelation)
    };
  },
  mounted() {
    this.getTableData();
    this.getSystemParameters();
  },
  created() {},
  methods: {
    startTimeChange(value, date) {
      this.activitiesDetail.startTime = value;
    },
    endTimeChange(value, date) {
      this.activitiesDetail.endTime = value;
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(roleRowData);
      this.getTableData();
    },
    resetSearchProductRowData() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    resetSearchCouponRowData() {
      this.searchCouponRowData = _.cloneDeep(couponRowData);
      this.getCouponTableData();
    },
    resetModalCreate() {
      this.addRelationDetail.rewardScale = 0;
      this.addRelationDetail.rank = '';
      this.addRelationDetail.rewardImg = '';
      this.addRelationDetail.rewardName = '';
      this.uploadListMain = [];
      this.$refs.modalCreate.resetFields();
    },
    resetFields() {
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
    },
    getSystemParameters() {
      const code = 'ACTIVITY_SETTING';
      getSystemParameter(code)
        .then((res) => {
          this.activityTypeEnum = res.systemSettings;
        })
    },
    // 统一活动 CRUD
    getTableData() {
      getUnifyActivityPages(this.searchRowData)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearSearchLoading = false;
        });
    },
    handCouponType(value) {
      this.searchRowData.page = 1;
      this.searchLoading = true;
      this.searchRowData.activityType = value;
      this.getTableData();
    },
    handleSwitch(params) {
      this.activitiesDetail = this._.cloneDeep(params.row);
      this.activitiesDetail.status = params.row.status === 'VALID' ? 'INVALID' : 'VALID';
      this.updateUnifyActivity();
    },
    handleSetting(params) {
      this.activitySettingId = params.row.id;
      this.activityIsValid = params.row.isValid;
      if (params.row.activityType === 'COLLECT_WORD_ACTIVITY') {
        this.getUnifyActivity(this.activitySettingId);
        this.modalRelevance = true;
      } else if (params.row.activityType === 'POINTS_LOTTERY_ACTIVITY') {
        this.getProductTableData();
        this.getCouponTableData();
        this.getRelationTableData();
        this.topStatus = 'PROD';
        this.addRelationDetail.type = 'PROD';
        this.modalLottery = true;
      }
    },
    handleCreate() {
      this.resetFields();
      this.tempModalType = this.modalType.create;
      this.activitiesDetail = _.cloneDeep(activitiesDetail);
      this.activitiesDetail.activityType = this.searchRowData.activityType ? this.searchRowData.activityType : '';
      this.modalEdit = true;
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.activitiesDetail = _.cloneDeep(params.row);
      this.extendedJsonStr2Obj(params.row.extendedJsonStr);
      this.activitiesDetail.content = this.activitiesDetail.content.replace(/&/g, '\n');
      this.modalView = true;
    },
    handleEdit(params) {
      this.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activitiesDetail = _.cloneDeep(params.row);
      this.extendedJsonStr2Obj(params.row.extendedJsonStr);
      this.activitiesDetail.content = this.activitiesDetail.content.replace(/&/g, '\n');
      this.modalEdit = true;
    },
    handleSubmit(name) {
      console.log(`before submit activitiesDetail: `, this.activitiesDetail);
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 根据活动类型做二次表单校验
          if (this.activitiesDetail.activityType === 'COLLECT_WORD_ACTIVITY') {
            if (!this.activitiesDetail.defaultCount) {
              this.$Message.error('请输入默认次数');
              return;
            }
          } else if (this.activitiesDetail.activityType === 'POINTS_LOTTERY_ACTIVITY') {
            if (!this.activitiesDetail.consumPoints) {
              this.$Message.error('请输入每次消耗积分');
              return;
            }
            if (!this.activitiesDetail.lotteryDrawCount) {
              this.$Message.error('请输入抽奖次数');
              return;
            }
            if (!this.activitiesDetail.lotteryDrawCount) {
              this.$Message.error('请输入中奖最大次数');
              return;
            }
          }
          // 活动规则换行用“&”拼接
          this.activitiesDetail.content = this.activitiesDetail.content.replace(/\n|\r/g, '&');
          this.obj2ExtendedJsonStr();
          if (this.isCreate) {
            // 添加状态
            this.createUnifyActivity();
          } else if (this.isEdit) {
            // 编辑状态
            this.updateUnifyActivity();
          }
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createUnifyActivity() {
      this.modalViewLoading = true;
      createUnifyActivity(this.activitiesDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('创建成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    updateUnifyActivity() {
      this.modalViewLoading = true;
      updateUnifyActivity(this.activitiesDetail)
        .then((res) => {
          this.modalEdit = false;
          this.$Message.success('修改成功!');
          this.getTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    obj2ExtendedJsonStr() {
      const extendedData = {};
      extendedData.shareCount = this.activitiesDetail.shareCount;// 公共属性
      if (this.activitiesDetail.activityType === 'COLLECT_WORD_ACTIVITY') {
        extendedData.defaultCount = this.activitiesDetail.defaultCount;
      } else if (this.activitiesDetail.activityType === 'POINTS_LOTTERY_ACTIVITY') {
        extendedData.consumPoints = this.activitiesDetail.consumPoints;
        extendedData.lotteryDrawCount = this.activitiesDetail.lotteryDrawCount;
        extendedData.rewardMaxCount = this.activitiesDetail.rewardMaxCount;
      }
      this.activitiesDetail.extendedJsonStr = JSON.stringify(extendedData);
    },
    extendedJsonStr2Obj(extendedJsonStr) {
      const extendedObj = JSON.parse(extendedJsonStr);
      this.activitiesDetail.shareCount = extendedObj.shareCount;// 公共属性
      if (this.activitiesDetail.activityType === 'COLLECT_WORD_ACTIVITY') {
        this.activitiesDetail.defaultCount = extendedObj.defaultCount;
      } else if (this.activitiesDetail.activityType === 'POINTS_LOTTERY_ACTIVITY') {
        this.activitiesDetail.consumPoints = extendedObj.consumPoints;
        this.activitiesDetail.lotteryDrawCount = extendedObj.lotteryDrawCount;
        this.activitiesDetail.rewardMaxCount = extendedObj.rewardMaxCount;
      }
    },
    // 集字活动-获取券列表
    getTemplateTableData() {
      getCouponPagess(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
        });
    },
    // 集字活动-查看活动关联信息
    getUnifyActivity(id) {
      getUnifyActivity(id)
        .then((res) => {
          this.couponConfigManageRelations = res.activitySettingRelations;
          this.collectWordSetting = res.collectWordSettings;
        })
    },
    // 集字活动-删除券关联配置
    handleDelRelevance(params) {
      if (this.activityIsValid) {
        this.$Message.info('活动进行中不允许修改!');
      } else {
        this.activitySettingRelation = this._.cloneDeep(params.row);
        this.deleteUnifyActivityRelevance(this.activitySettingRelation);
      }
    },
    // 集字活动-删除字关联配置
    handleDelCollection(params) {
      if (this.activityIsValid) {
        this.$Message.info('活动进行中不允许修改!');
      } else {
        this.collectWordSettingRelation = this._.cloneDeep(params.row);
        this.deleteWollectWordRelevance(this.collectWordSettingRelation);
      }
    },
    // 集字活动 - 统一关闭
    handleAddClose() {
      this.modalAddCoupun = false;
      this.modalAddCollection = false;
    },
    // 集字活动-创建券或字关联配置
    relevanceAllocation(value) {
      this.searchTemplateRowData = _.cloneDeep(templateRowData);
      this.collectWordSettingRelation = _.cloneDeep(collectWordSettingRelation);
      if (value === 'HOLIDAY_ACTIVITY_COUPON') {
        let couponNum = 0;
        // 列表只允许有一张券
        for (const val of this.couponConfigManageRelations) {
          if (val.status === 'ON') {
            couponNum++;
          }
        }
        if (couponNum == 0) {
          this.getTemplateTableData();
          this.modalAddCoupun = true;
        } else {
          this.$Message.info('当前存在有效的优惠券(只允许关联一张)!');
          return;
        }
      } else if (value === 'COLLECTION_SETTING') {
        this.isCreateStatus = true;
        this.modalAddCollection = true;
        this.collectWordSettingRelation.activitySettingId = this.activitySettingId;
      }
    },
    // 集字活动-券列表点击行数据
    handleTemplateChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.activitySettingRelation.relationId = currentTemplate.id;
      this.activitySettingRelation.status = 'ON';
      this.activitySettingRelation.relationType = 'HOLIDAY_ACTIVITY_COUPON';
      this.activitySettingRelation.activitySettingId = this.activitySettingId;
      this.activitySettingRelation.rank = 1;
    },
    changeCouponPage(page) {
      this.searchTemplateRowData.page = page;
      this.getTemplateTableData();
    },
    changeCouponPageSize(pageSize) {
      this.searchTemplateRowData.page = 1;
      this.searchTemplateRowData.rows = pageSize;
      this.getTemplateTableData();
    },
    deleteUnifyActivityRelevance(data) {
      deleteUnifyActivityRelevance(data)
        .then((res) => {
          this.getUnifyActivity(this.activitySettingId);
          this.$Message.success('删除成功!');
        })
        .finally(() => {});
    },
    deleteWollectWordRelevance(data) {
      deleteWollectWordRelevance(data)
        .then((res) => {
          this.getUnifyActivity(this.activitySettingId);
          this.$Message.success('删除成功!');
        })
        .finally(() => {});
    },
    // 集字活动-创建关联统一方法
    handleRelevanceAdd(value) {
      if (value === 'HOLIDAY_ACTIVITY_COUPON') {
        if (
          !this.activitySettingRelation.activitySettingId &&
          !this.activitySettingRelation.relationId
        ) {
          this.$Message.error('请先关联活动配置!');
          return;
        }
        createUnifyActivityRelevance(this.activitySettingRelation)
          .then((res) => {
            this.modalAddCoupun = false;
            this.getUnifyActivity(this.activitySettingId);
            this.activitySettingRelation = this._.cloneDeep(
              activitySettingRelation
            );
            this.$Message.success('添加成功!');
          })
          .finally(() => {
            this.modalRelevanceLoading = false;
          });
      } else if (value === 'COLLECTION_SETTING') {
        if (this.isCreateStatus) {
          createWollectWordRelevance(this.collectWordSettingRelation)
            .then((res) => {
              this.modalAddCollection = false;
              this.getUnifyActivity(this.activitySettingId);
              this.collectWordSettingRelation = this._.cloneDeep(
                collectWordSettingRelation
              );
              this.$Message.success('添加成功!');
            })
            .finally(() => {
              this.modalRelevanceLoading = false;
            });
        } else {
          // 修改
          updateWollectWordRelevance(this.collectWordSettingRelation)
            .then((res) => {
              this.modalAddCollection = false;
              this.getUnifyActivity(this.activitySettingId);
              this.collectWordSettingRelation = this._.cloneDeep(
                collectWordSettingRelation
              );
              this.$Message.success('修改成功!');
            })
            .finally(() => {
              this.modalRelevanceLoading = false;
            });
        }
      }
    },
    // 集字活动-修改
    handleCollectWordEdit(params) {
      if (this.activityIsValid) {
        this.$Message.info('活动进行中不允许修改!');
      } else {
        this.isCreateStatus = false;
        this.collectWordSettingRelation = _.cloneDeep(params.row);
        this.modalAddCollection = true;
      }
    },
    // 抽奖活动-查看活动关联信息
    getRelationTableData() {
      if (!this.activitySettingId) return;
      getUnifyActivity(this.activitySettingId)
        .then((res) => {
          const relations = res.activitySettingRelations;
          // 设置行是否可编辑
          relations.forEach((item) => { item.isEdit = false; });
          this.relationProducts = relations;
        })
    },
    // 抽奖活动-获取商品规格列表
    getProductTableData() {
      this.tempTableLoading = true;
      getProductStandardsPages(this.searchProductRowData)
        .then((res) => {
          this.products = res.rows;
          this.productTotal = res.total;
        }).finally(() => {
          this.tempTableLoading = false;
          this.searchLoading = false;
        });
    },
    // 抽奖活动- 获取优惠券列表
    getCouponTableData() {
      this.tempTableLoading = true;
      getCouponPagess(this.searchCouponRowData)
        .then((res) => {
          this.coupons = res.rows;
          this.couponsTotal = res.total;
        }).finally(() => {
          this.tempTableLoading = false;
          this.searchLoading = false;
        });
    },
    // 抽奖活动-设置中奖图片列表
    setDefaultUploadList(res) {
      if (res.rewardImg != null) {
        const map = { status: 'finished', url: 'url' };
        const mainImgArr = [];
        map.url = res.rewardImg;
        mainImgArr.push(map);
        this.$refs.uploadMainRelation.setDefaultFileList(mainImgArr);
        this.uploadListMainRelation = mainImgArr;
      }
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.addRelationDetail.rewardImg = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.addRelationDetail.rewardImg = null;
      this.addRelationDetail.rewardImg = fileList[0].url;
    },
    handleRelationRemoveMain(file) {
      this.$refs.uploadMainRelation.deleteFile(file);
      this.updateRelationDetail.rewardImg = null;
    },
    handleRelationSuccessMain(response, file, fileList) {
      this.uploadListMainRelation = fileList;
      this.updateRelationDetail.rewardImg = null;
      this.updateRelationDetail.rewardImg = fileList[0].url;
    },
    // 抽奖活动-关闭弹窗
    handleLotteryClose() {
      this.modalLottery = false;
    },
    handleTabChange(e) {
      const index = e.currentTarget.dataset.index;
      if (this.topStatus === index) { return; }
      this.topStatus = index;
      this.addRelationDetail.type = this.topStatus;
    },
    onProductSelectionAll(selection) {
      this.addRelationDetail.standardId = selection
        .map((item) => item.id.toString())
        .join(',');
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
    changeLotteryCouponPage(page) {
      this.searchCouponRowData.page = page;
      this.getCouponTableData();
    },
    changeLotteryCouponPageSize(pageSize) {
      this.searchCouponRowData.page = 1;
      this.searchCouponRowData.rows = pageSize;
      this.getCouponTableData();
    },
    handleProductSearch() {
      this.searchProductRowData.page = 1;
      this.getProductTableData();
    },
    handleProductClear() {
      // 重置数据
      this.resetSearchProductRowData();
      this.page = 1;
      this.pageSize = 10;
      this.handleProductSearch();
    },
    handleCouponSearch() {
      this.searchCouponRowData.page = 1;
      this.getCouponTableData();
    },
    handleCouponClear() {
      // 重置数据
      this.resetSearchCouponRowData();
      this.page = 1;
      this.pageSize = 10;
      this.handleCouponSearch();
    },
    // 创建活动关联
    addTempData(name) {
      if (this.addRelationDetail.type === 'PROD') {
        if (this.addRelationDetail.standardId === 0) {
          this.$Message.error('请选择一个要关联的商品或券!');
          return;
        }
      }
      if (this.addRelationDetail.type === 'COUPON') {
        if (this.addRelationDetail.couponConfigId === 0) {
          this.$Message.error('请选择一个要关联的商品或券!');
          return;
        }
      }
      // TODO: 新增抽奖比例不能大于100的校验 + 上架的奖品数量不能大于8，也不能小于8
      if (this.relationProducts.length > 0) {
        const onRelations = this.relationProducts.filter(item => item.status === 'ON');
        if (onRelations.length === 8) {
          this.$Message.error('请先下架一个奖品，才能完成新奖品的添加');
          return;
        }
        let rewardScaleTotal = 0;
        onRelations.forEach((item) => {
          const { rewardScale } = JSON.parse(item.extendedJsonStr);
          rewardScaleTotal += rewardScale;
        });
        console.log(`rewardScaleTotal: ${rewardScaleTotal}`);
        // 如果已上架的奖品比例加上要添加的奖品比例大于100
        // if (rewardScaleTotal + this.addRelationDetail.rewardScale > 100) {
        //   this.$Message.error('当前奖品比例大于100，请调整比例再添加');
        //   return;
        // }
      }

      this.$refs[name].validate((valid) => {
        if (valid) {
          this.createRelation();
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    createRelation() {
      this.modalViewLoading = true;
      // 组装创建关联所需数据
      const extendedData = {};
      extendedData.rewardScale = this.addRelationDetail.rewardScale;
      extendedData.rewardImg = this.addRelationDetail.rewardImg;
      extendedData.rewardName = this.addRelationDetail.rewardName;

      this.addRelationDetail.relationType = this.addRelationDetail.type;
      if (this.addRelationDetail.type === 'PROD') {
        this.addRelationDetail.relationId = this.addRelationDetail.standardId;
      } else if (this.addRelationDetail.type === 'COUPON') {
        this.addRelationDetail.relationId = this.addRelationDetail.couponConfigId;
        extendedData.rewardImg = this.addRelationDetail.rewardImg ? this.addRelationDetail.rewardImg : 'http://resource.shuiguoshule.com.cn/product_image/h5/2021-05-25/hldTEwbampfh9UJTh3vL.png';
      } else {
        this.addRelationDetail.relationId = null;
        extendedData.rewardImg = this.addRelationDetail.rewardImg ? this.addRelationDetail.rewardImg : 'http://resource.shuiguoshule.com.cn/product_image/h5/2021-05-25/OPb5D5fJNPGd3BsK1dgl.png';
        this.addRelationDetail.status = 'ON';
      }

      this.addRelationDetail.activitySettingId = this.activitySettingId;
      this.addRelationDetail.extendedJsonStr = JSON.stringify(extendedData);
      console.log(`addRelationDetail before submit: `, this.addRelationDetail);
      createActiviyRelation(this.addRelationDetail)
        .then((res) => {
          this.$Message.success('创建成功!');
          this.resetModalCreate();
          this.getRelationTableData();
        })
        .finally(() => {
          this.modalViewLoading = false;
        });
    },
    handleRelevanceView(params) {
      this.activitiesRelevanceDetail = _.cloneDeep(params.row);
      if (params.row.type === 'PROD') {
        this.activitiesProductDetail = _.cloneDeep(params.row.productStandard);
        this.discountPrice = _.cloneDeep(
          params.row.productStandard.productStandardExpand.discountPrice / 100
        );
      } else if (params.row.type === 'COUPON') {
        this.activitiesCouponDetail = _.cloneDeep(
          params.row.couponConfigManage
        );
      }
      this.modalRelevanceView = true;
    },
    handleSwitchStatus(params) {
      params.row.status = params.row.status === 'ON' ? 'OFF' : 'ON';
      this.tempTableLoading = true;
      updateUnifyActivityRelevance(params.row)
        .then((res) => {
          this.$Message.info('修改成功');
          this.modalRelevanceEdit = false;
          this.getRelationTableData();
        })
      this.tempTableLoading = false;
      this.$set(params.row, 'isEdit', false);
    },
    handleconfirmEdit() {
      // TODO: 修改抽奖比例时不能大于100的校验
      // if (this.relationProducts.length > 0) {
      //   const onRelations = this.relationProducts.filter(item => item.status === 'ON');
      //   let rewardScaleTotal = 0;
      //   onRelations.forEach((item) => {
      //     const { rewardScale } = JSON.parse(item.extendedJsonStr);
      //     rewardScaleTotal += rewardScale;
      //   });
      //   console.log(`upadate rewardScaleTotal: ${rewardScaleTotal}`);
      //   // 如果已上架的奖品比例加上要添加的奖品比例大于100
      //   if (rewardScaleTotal + this.updateRelationDetail.rewardScale > 100) {
      //     this.$Message.error('当前奖品比例大于100，请调整比例再修改');
      //     return;
      //   }
      // }
      this.$refs.editRelevanceForm.validate((valid) => {
        if (valid) {
          this.updateRelation();
        } else {
          this.$Message.error('请完善信息!');
        }
      });
    },
    updateRelation() {
      // 组装创建关联所需数据
      const extendedData = {};
      extendedData.rewardScale = this.updateRelationDetail.rewardScale;
      extendedData.rewardImg = this.updateRelationDetail.rewardImg;
      extendedData.rewardName = this.updateRelationDetail.rewardName;
      if (this.updateRelationDetail.type === 'PSEUDO') {
        extendedData.rewardImg = 'http://resource.shuiguoshule.com.cn/product_image/h5/2021-05-25/OPb5D5fJNPGd3BsK1dgl.png';// 默认谢谢惠顾照片
      }
      this.updateRelationDetail.extendedJsonStr = JSON.stringify(extendedData);
      console.log(`addRelationDetail before submit: `, this.updateRelationDetail);
      updateUnifyActivityRelevance(this.updateRelationDetail)
        .then((res) => {
          this.$Message.info('修改成功');
          this.modalRelevanceEdit = false;
          this.getRelationTableData();
        })
    },
    // modalHandleDelete(params) {
    //   this.tempTableLoading = true;
    //   deleteAssistProductRelation({ ids: params.row.id })
    //     .then((res) => {
    //       this.relationProducts = this.relationProducts.filter(
    //         (item, index) => index !== params.row.initRowIndex
    //       );
    //       this.getRelationTableData();
    //     })
    //     .finally((res) => {
    //       this.tempTableLoading = false;
    //     });
    // },
    handleRelevanceClose() {
      this.activitiesRelevanceDetail = {};
      this.activitiesProductDetail = {};
      this.activitiesCouponDetail = {};
      this.modalRelevanceView = false;
    },
    handleRelevanceEdit(params) {
      this.updateRelationDetail = _.cloneDeep(params.row);
      const extendedObj = JSON.parse(this.updateRelationDetail.extendedJsonStr);
      this.updateRelationDetail.rewardImg = extendedObj.rewardImg;
      this.updateRelationDetail.rewardScale = extendedObj.rewardScale;
      this.updateRelationDetail.rewardName = extendedObj.rewardName;
      this.setDefaultUploadList(this.updateRelationDetail);
      this.modalRelevanceEdit = true;
    },
    handleEditRelevanceClose() {
      this.modalRelevanceEdit = false;
      this.uploadListMainRelation = [];
    },
    handleRelationChange(currentRow, oldCurrentRow) {
      const relationRow = this.relationProducts;
      // 如果当前tab为商品
      if (this.addRelationDetail.type === 'PROD') {
        const pro = relationRow.find(item => item.relationId == currentRow.id);
        if (pro) {
          this.proFlag = false;
          this.$Message.error('活动商品已存在');
        } else {
          this.proFlag = true;
        }
        this.addRelationDetail.standardId = currentRow.id;
        this.addRelationDetail.productStandard = currentRow;
        this.addRelationDetail.couponConfigManage = null;
        this.addRelationDetail.couponConfigId = null;
        this.addRelationDetail.status = 'ON';
        this.addRelationDetail.rewardImg = currentRow.image; // 默认读取商品主图为中奖图片
      } else if (this.addRelationDetail.type === 'COUPON') {
        const coupon = relationRow.find(item => item.relationId == currentRow.id);
        if (coupon) {
          this.proFlag = false;
          this.$Message.error('活动优惠券已存在');
        } else {
          this.proFlag = true;
        }
        this.addRelationDetail.couponConfigId = currentRow.id;
        this.addRelationDetail.couponConfigManage = currentRow;
        this.addRelationDetail.productStandard = null;
        this.addRelationDetail.standardId = null;
        this.addRelationDetail.status = 'ON';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tabChange {
  height: 50px;
  width: 230px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border: 1px solid rgb(232, 234, 236);
  border-radius: 10px 10px 0 0;
  b {
    display: block;
    width: 113px;
    height: 48px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
}

.hot {
  display: inline-block;
  // color: red;
  background: rgb(245, 247, 249);
}
</style>
