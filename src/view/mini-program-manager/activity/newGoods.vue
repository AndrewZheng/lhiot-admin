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
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-view="handleView"
        @on-relevance="handleSetting"
        @on-sale="onSale"
        @on-select-all="onSelectionAll"
        @on-selection-change="onSelectionChange"
      >
        <div slot="searchCondition">
          <Input
            v-model="searchRowData.title"
            placeholder="活动标题"
            class="search-input mr5"
            style="width: 100px"
            clearable
          ></Input>
          <Select
            v-model="searchRowData.status"
            placeholder="活动状态"
            class="mr5"
            style="width: 120px"
            clearable
          >
            <Option
              v-for="(item,index) in statusTypeEnum"
              :key="index"
              :value="item.value"
              class="ptb2-5"
            >{{ item.label }}</Option>
          </Select>
          <DatePicker
            v-model="searchRowData.beginTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始时间起"
            class="search-input"
            style="width: 150px"
            @on-change="beginTimeChange"
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
          <Button
            v-waves
            :search-loading="searchLoading"
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
          <Button v-waves type="success" class="mr5" @click="handleCreate">
            <Icon type="md-add" />添加
          </Button>
          <!-- <Poptip
            confirm
            placement="bottom"
            style="width: 100px"
            title="您确认删除选中的内容吗?"
            @on-ok="poptipOk"
          >
            <Button type="error" class="mr5">
              <Icon type="md-trash" />批量删除
            </Button>
          </Poptip>-->
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
        <span>新品上市活动详情</span>
      </p>
      <div class="modal-content">
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动标题:</i-col>
              <i-col span="18">{{ activityNewProducts.title }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">开始时间:</i-col>
              <i-col span="18">
                {{ activityNewProducts.beginTime = this.$moment(
                activityNewProducts.beginTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">结束时间:</i-col>
              <i-col span="18">
                {{ activityNewProducts.endTime = this.$moment(
                activityNewProducts.endTime
                ).format("YYYY-MM-DD HH:mm:ss") }}
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">活动状态:</i-col>
              <i-col span="18" v-if="activityNewProducts.status=='ON'">{{ "上架" }}</i-col>
              <i-col span="18" v-else>{{ "下架" }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">主题色号:</i-col>
              <i-col span="18">{{ activityNewProducts.mainColour }}</i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">主题图片:</i-col>
              <i-col v-show="activityNewProducts.mainImage" span="6">
                <div class="demo-upload-list">
                  <img :src="activityNewProducts.mainImage" />
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">分享图片:</i-col>
              <i-col v-show="activityNewProducts.shareImage" span="6">
                <div class="demo-upload-list">
                  <img :src="activityNewProducts.shareImage" />
                </div>
              </i-col>
            </Row>
          </i-col>
        </Row>
        <Row class-name="mb20">
          <i-col span="24">
            <Row>
              <i-col span="6">分享文案:</i-col>
              <i-col span="18">
                <Input
                  :v-if="activityNewProducts.shareText"
                  :rows="3"
                  :value="activityNewProducts.shareText"
                  type="textarea"
                ></Input>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="modalEdit" :mask-closable="false">
      <p slot="header">
        <span>{{ isCreate?'创建新品上市活动':'编辑新品上市活动' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
        <Form ref="editForm" :label-width="100" :model="activityNewProducts" :rules="ruleInline">
          <Row>
            <FormItem label="活动标题:" prop="title">
              <Input v-model="activityNewProducts.title" placeholder="请输入活动标题" style="width: 300px"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="有效期起:" prop="beginTime">
              <DatePicker
                :value="activityNewProducts.beginTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期起"
                class="search-input"
                style="width: 300px"
                :readonly="editStatus"
                @on-change="activityNewProducts.beginTime=$event"
              />
            </FormItem>
          </Row>
          <Row>
            <!-- editStatus -->
            <FormItem label="有效期止:" prop="endTime">
              <DatePicker
                :value="activityNewProducts.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="有效期止"
                class="search-input"
                style="width: 300px"
                :readonly="editStatus"
                @on-change="activityNewProducts.endTime=$event"
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem label="活动状态:" prop="status">
              <Select
                v-model="activityNewProducts.status"
                class="search-col mr5"
                placeholder="请选择活动状态"
                style="width:300px"
                clearable
              >
                <Option
                  v-for="item in statusTypeEnum"
                  :key="item.value"
                  :value="item.value"
                  class="ptb2-5"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="主题色号:" prop="mainColour">
              <Input
                v-model="activityNewProducts.mainColour"
                placeholder="请输入主题色号"
                style="width: 300px"
              ></Input>
            </FormItem>
          </Row>
          <Row>
            <i-col span="12">
              <FormItem label="主题图片(推荐尺寸为xx*xx(单位:px)):" prop="mainImage">
                <Input v-show="false" v-model="activityNewProducts.mainImage" style="width: auto"></Input>
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
                  file-dir="task"
                  @on-success="handleSuccessMain"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="分享图片(推荐尺寸为xx*xx(单位:px)):" prop="shareImage">
                <Input v-show="false" v-model="activityNewProducts.shareImage" style="width: auto"></Input>
                <div v-for="item in uploadListBanner" :key="item.url" class="demo-upload-list">
                  <template v-if="item.status === 'finished'">
                    <div>
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleUploadView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveBanner(item)"></Icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <IViewUpload
                  ref="uploadBanner"
                  :default-list="defaultListBanner"
                  :image-size="imageSize"
                  group-type="activity_image"
                  file-dir="task"
                  @on-success="handleSuccessBanner"
                >
                  <div slot="content" style="width:58px;height:58px;line-height:58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </IViewUpload>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <FormItem label="分享文案:" prop="shareText">
              <Input
                v-model="activityNewProducts.shareText"
                placeholder="请输入分享文案"
                style="width: 300px"
                type="textarea"
              ></Input>
            </FormItem>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleEditClose">关闭</Button>
        <Button :loading="modalEditLoading" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
    <!-- 活动关联 -->
    <Modal v-model="modalRelevance" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '添加新品上市活动关联' }}</span>
      </p>
      <div class="modal-content" style="margin-top: 20px">
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
            @on-sale="onRelevanceSale"
            @on-edit="handleEditRank"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('NEW_COUPON')"
                >
                  <Icon type="md-add" />&nbsp;关联活动券
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 新品尝鲜关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesNewProduct"
            v-model="activitySeckillRelations"
            :columns="activitySeckillColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-sale="onRelevanceSale"
            @on-edit="handleEditRank"
          >
            <div slot="searchCondition">
              <Row>
                <Button v-waves type="success" class="mr5" @click="relevanceAllocation('NEW_TRY')">
                  <Icon type="md-add" />&nbsp;关联新品尝鲜活动
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 普通商品关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="tablesProductStandard"
            v-model="productStandardRelations"
            :columns="productStandardColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-sale="onRelevanceSale"
            @on-edit="handleEditRank"
          >
            <div slot="searchCondition">
              <Row>
                <Button v-waves type="success" class="mr5" @click="relevanceAllocation('NEW_PROD')">
                  <Icon type="md-add" />&nbsp;关联普通商品
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 拼团关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="activityTeambuyProduct"
            v-model="activityTeambuyRelations"
            :columns="activityTeambuyColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-sale="onRelevanceSale"
            @on-edit="handleEditRank"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('NEW_TEAM_BUY')"
                >
                  <Icon type="md-add" />&nbsp;关联拼团活动
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
        <!-- 预售关联 -->
        <Card style="margin-bottom:16px">
          <tables
            ref="activityPreProduct"
            v-model="activityPreSaleRelations"
            :columns="activityPreSaleColumns"
            :search-area-column="16"
            :operate-area-column="8"
            editable
            searchable
            border
            highlight-row
            search-place="top"
            @on-sale="onRelevanceSale"
            @on-edit="handleEditRank"
          >
            <div slot="searchCondition">
              <Row>
                <Button
                  v-waves
                  type="success"
                  class="mr5"
                  @click="relevanceAllocation('NEW_PRE_SALE')"
                >
                  <Icon type="md-add" />&nbsp;关联预售活动
                </Button>
              </Row>
            </div>
          </tables>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="handleRelevanceClose">关闭</Button>
      </div>
    </Modal>
    <!-- 券列表 -->
    <Modal v-model="modalAddCoupun" :width="1000" :z-index="1000" :mask-closable="false">
      <p slot="header">
        <i-col>{{ "关联新品券" }}</i-col>
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
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('NEW_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 新品尝鲜 -->
    <Modal v-model="modalAddNewProduct" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '关联新品尝鲜活动'}}</span>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tables"
            v-model="newProductTableData"
            :columns="newProductColumns"
            :search-area-column="18"
            :operate-area-column="6"
            search-place="top"
            searchable
            highlight-row
            border
            @on-current-change="handleNewProductChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchNewProductRowData.title"
                  placeholder="活动标题"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <DatePicker
                  v-model="searchNewProductRowData.beginTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  class="search-input mr5"
                  style="width: 170px"
                  placeholder="开始时间"
                  @on-change="edBeginTimeChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchNewProductRowData.endTime"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 170px"
                  class="mr5"
                  @on-change="edFinishTimeChange"
                />
                <Button class="search-btn mr5" type="primary" @click="handleNewProductSearch">
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button v-waves class="search-btn" type="info" @click="hanldeNewProductClear">
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="newProductTotal"
                :current="searchNewProductRowData.page"
                show-sizer
                show-total
                @on-change="changeNewProductPage"
                @on-page-size-change="changeNewProductPageSize"
              ></Page>
            </Row>
          </div>
        </Row>
      </div>
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('NEW_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 普通商品 -->
    <Modal v-model="modalAddproduct" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '关联普通商品'}}</span>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tables"
            :columns="productColumns"
            v-model="productData"
            search-place="top"
            searchable
            highlight-row
            border
            @on-current-change="handleProductChange"
          >
            <div slot="searchCondition">
              <Row>
                <Input
                  v-model="searchProductRowData.barcode"
                  placeholder="商品条码"
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
                  :loading="searchLoading"
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
                  @click="hanldeProductClear"
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
        </Row>
      </div>
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('NEW_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 拼团商品 -->
    <Modal v-model="modalAddTeambuy" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '关联拼团活动'}}</span>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tables"
            v-model="teambuyTableData"
            :columns="teambuyColumns"
            :search-area-column="20"
            :operate-area-column="6"
            search-place="top"
            searchable
            highlight-row
            border
            @on-current-change="handleteambuyChange"
          >
            <div slot="searchCondition">
              <Row>
                <Select
                  v-model="searchteambuyRowData.status"
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
                  v-model="searchteambuyRowData.activityName"
                  placeholder="活动名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Input
                  v-model="searchteambuyRowData.content"
                  placeholder="活动内容"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <DatePicker
                  v-model="searchteambuyRowData.startTimeBegin"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效时间起"
                  class="mr5"
                  style="width: 160px"
                  @on-change="createTimeStartChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchteambuyRowData.startTimeEnd"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="有效时间止"
                  class="mr5"
                  style="width: 160px"
                  @on-change="createTimeEndChange"
                />
                <Button class="search-btn mr5" type="primary" @click="handleteambuySearch">
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button v-waves class="search-btn" type="info" @click="handleteambuyClear">
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="teambuyTotal"
                :current="searchteambuyRowData.page"
                show-sizer
                show-total
                @on-change="changeteambuyPage"
                @on-page-size-change="changeteambuyPageSize"
              ></Page>
            </Row>
          </div>
        </Row>
      </div>
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('NEW_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <!-- 预售商品 -->
    <Modal v-model="modalAddPresell" :mask-closable="false" :width="1200">
      <p slot="header">
        <span>{{ '关联预售活动'}}</span>
      </p>
      <div class="modal-content">
        <Row>
          <tables
            ref="tablesPresell"
            v-model="PresellTableData"
            :columns="PresellColumns"
            :search-area-column="22"
            :operate-area-column="6"
            search-place="top"
            searchable
            highlight-row
            border
            @on-current-change="handlePresellChange"
          >
            <div slot="searchCondition">
              <Row>
                <Select
                  v-model="searchPresellRowData.status"
                  placeholder="活动状态"
                  style="padding-right: 5px;width: 80px"
                  clearable
                >
                  <Option
                    v-for="(item,index) in activityStatus"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 80px"
                  >{{ item.label }}</Option>
                </Select>
                <Select
                  v-model="searchPresellRowData.startedFlag"
                  placeholder="是否开始"
                  style="padding-right: 5px;width: 90px"
                  clearable
                >
                  <Option
                    v-for="(item,index) in startedFlagStatus"
                    :key="index"
                    :value="item.value"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 90px"
                  >{{ item.label }}</Option>
                </Select>
                <Select
                  v-model="searchPresellRowData.validDateType"
                  placeholder="时间类型"
                  style="padding-right: 5px;width: 90px"
                  clearable
                >
                  <Option
                    v-for="(item,index) in validDateTypeEnum"
                    :value="item.value"
                    :key="index"
                    class="ptb2-5"
                    style="padding-left: 5px;width: 90px"
                  >{{ item.label }}</Option>
                </Select>
                <Input
                  v-model="searchPresellRowData.activityName"
                  placeholder="活动名称"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <Input
                  v-model="searchPresellRowData.content"
                  placeholder="活动内容"
                  class="search-input mr5"
                  style="width: auto"
                  clearable
                ></Input>
                <DatePicker
                  v-model="searchPresellRowData.startTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="有效时间起"
                  class="mr5"
                  style="width: 160px"
                  @on-change="PresellTimeStartChange"
                />
                <i>-</i>
                <DatePicker
                  v-model="searchPresellRowData.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="有效时间止"
                  class="mr5"
                  style="width: 160px"
                  @on-change="PresellTimeEndChange"
                />
                <Button class="search-btn mr5" type="primary" @click="handlePresellSearch">
                  <Icon type="md-search" />&nbsp;搜索
                </Button>
                <Button v-waves class="search-btn mr5" type="info" @click="handlePresellClear">
                  <Icon type="md-refresh" />&nbsp;清除
                </Button>
              </Row>
            </div>
          </tables>
          <div style="margin: 10px;overflow: hidden">
            <Row type="flex" justify="end">
              <Page
                :total="PresellTotal"
                :current="searchPresellRowData.page"
                show-sizer
                show-total
                @on-change="changePresellPage"
                @on-page-size-change="changePresellPageSize"
              ></Page>
            </Row>
          </div>
        </Row>
      </div>
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleAddClose">关闭</Button>
        <Button
          :loading="modalRelevanceLoading"
          type="primary"
          @click="handleRelevanceAdd('NEW_COUPON')"
        >确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalEditRank" :mask-closable="false">
      <p slot="header">
        <span>{{ '修改新品上市活动关联排序'}}</span>
      </p>
      <Form :model="ActivityNewProductsRelation" :label-width="60">
        <Row>
          <i-col span="6">
            <FormItem label="排序:" prop="rank">
              <InputNumber v-model="ActivityNewProductsRelation.rank" clearable style="width: 80px"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleEditRankClose">关闭</Button>
        <Button type="primary" @click="submitEditRank()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from "_c/tables";
import IViewUpload from "_c/iview-upload";
import {
  getNewProductsPages,
  updateNewProducts,
  deleteNewProducts,
  createNewProducts,
  deletePicture,
  getNewProductsRelevance,
  createNewProductsRelevance,
  updateNewProductsRelevance,
  // 券列表
  getCouponPagess,
  // 商品列表
  getProductStandardsPages,
  // 新品尝鲜
  getSeckillPages,
  // 拼团
  getTeamBuyPages,
  // 预售
  getPresellPages,
} from "@/api/mini-program";
import tableMixin from "@/mixins/tableMixin.js";
import searchMixin from "@/mixins/searchMixin.js";
import deleteMixin from "@/mixins/deleteMixin.js";
import uploadMixin from "@/mixins/uploadMixin.js";
import { taskTypeEnum } from "@/libs/enumerate";
import {
  couponStatusConvert,
  couponTypeConvert,
  couponScopeConvert,
  couponUseLimitConvert,
  userScopeConvert,
  customPlanStatusConvert,
  imageStatusConvert,
  teamBuyStatusConvert,
} from "@/libs/converStatus";
import {
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
} from "@/libs/enumerate";
import {
  compareData,
  getSmallCouponActivity,
  fenToYuanDot2,
  fenToYuanDot2Number,
  yuanToFenNumber,
  replaceByTag,
  replaceByTab,
  HdDiscount,
  compareCouponData,
  secondsToDate,
} from "@/libs/util";

const activityNewProducts = {
  beginTime: "",
  createTime: "",
  endTime: "",
  mainColour: "",
  mainImage: "",
  relationValues: "",
  shareImage: "",
  shareText: "",
  status: "",
  title: "",
};

const ActivityNewProductsRelevance = {
  activityId: null,
  rank: 0,
  relationId: null,
  relationType: "",
  status: "ON",
};
const searchRowData = {
  beginTime: "",
  endTime: "",
  status: "",
  title: "",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};

const templateRowData = {
  couponBusinessType: "ACTIVITY_NEW_SHELF_COUPON",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};
const productRowData = {
  productStandardId: "",
  productId: "",
  barcode: "",
  productCode: "",
  productName: "",
  shelvesStatus: "VALID",
  minPrice: "",
  maxPrice: "",
  page: 1,
  rows: 10,
  expandType: "IGNORE_TYPE",
};

const teambuyRowData = {
  status: "on",
  activityName: null,
  startTimeBegin: null,
  startTimeEnd: null,
  page: 1,
  rows: 10,
  sidx: "rank",
  sort: "asc",
  content: "",
};

//
const PresellRowData = {
  startTime: null,
  endTime: null,
  status: "VALID",
  activityName: null,
  content: null,
  page: 1,
  rows: 10,
  sidx: "rank",
  sort: "asc",
  validDateType: null,
  startedFlag: "true",
};
const newproductRowData = {
  beginTime: null,
  endTime: null,
  title: "",
  activityType: "NEW_TRY_ACTIVITY",
  page: 1,
  rows: 10,
  sidx: "createTime",
  sort: "desc",
};
const templateColumns = [
  {
    type: "index",
    width: 60,
    align: "center",
  },
  {
    title: "优惠券名称",
    key: "couponName",
    align: "center",
    minWidth: 80,
  },
  {
    title: "优惠券类型",
    align: "center",
    key: "couponType",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponType === "FULL_CUT_COUPON") {
        return (
          <div>
            <tag color="magenta">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "DISCOUNT_COUPON") {
        return (
          <div>
            <tag color="orange">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "CASH_COUPON") {
        return (
          <div>
            <tag color="cyan">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      } else if (row.couponType === "FREIGHT_COUPON") {
        return (
          <div>
            <tag color="blue">{couponTypeConvert(row.couponType).label}</tag>
          </div>
        );
      }
      return <div>{row.couponType}</div>;
    },
  },
  {
    title: "优惠/折扣额度",
    align: "center",
    key: "couponFee",
    minWidth: 50,
    render(h, params) {
      const { row } = params;
      if (row.couponType === "DISCOUNT_COUPON") {
        return <div>{row.couponFee / 10 + "折"}</div>;
      } else {
        return <div>{fenToYuanDot2(params.row.couponFee)}</div>;
      }
    },
  },
  {
    title: "最小购买金额",
    key: "minBuyFee",
    align: "center",
    minWidth: 80,
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.minBuyFee)}</div>;
    },
  },
  {
    title: "最高优惠金额",
    align: "center",
    key: "maxDiscountFee",
    minWidth: 80,
    render(h, params) {
      if (params.row.maxDiscountFee) {
        return <div>{fenToYuanDot2(params.row.maxDiscountFee)}</div>;
      } else {
        return <div>{"N/A"}</div>;
      }
    },
  },
  {
    title: "优惠券状态",
    key: "couponStatus",
    align: "center",
    minWidth: 80,
    render: (h, params, vm) => {
      const { row } = params;
      if (row.couponStatus === "VALID") {
        return (
          <div>
            <tag color="success">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      } else if (row.couponStatus === "INVALID") {
        return (
          <div>
            <tag color="error">
              {couponStatusConvert(row.couponStatus).label}
            </tag>
          </div>
        );
      }
      return <div>{row.couponStatus}</div>;
    },
  },
  {
    title: "创建时间",
    align: "center",
    minWidth: 120,
    key: "createTime",
  },
];
const productColumns = [
  {
    title: "商品条码",
    key: "barcode",
    minWidth: 120,
    align: "center",
  },
  {
    title: "规格ID",
    key: "id",
    align: "center",
    minWidth: 90,
  },
  {
    title: "商品名称",
    key: "productName",
    minWidth: 100,
    align: "center",
  },
  {
    title: "商品规格",
    key: "specification",
    minWidth: 80,
    align: "center",
  },
  {
    title: "商品单位",
    key: "productUnit",
    minWidth: 80,
    align: "center",
  },
  {
    title: "商品价格",
    key: "price",
    minWidth: 80,
    align: "center",
    render(h, params, vm) {
      const amount = fenToYuanDot2(params.row.price);
      return <div>{amount}</div>;
    },
  },
  {
    title: "起购份数",
    key: "startNum",
    minWidth: 80,
    align: "center",
  },
];
// 拼团
const teambuyColumns = [
  {
    title: "活动名称",
    key: "activityName",
    align: "center",
    fixed: "left",
    minWidth: 200,
  },
  {
    title: "活动状态",
    align: "center",
    key: "status",
    minWidth: 90,
    render: (h, params) => {
      const { row } = params;
      if (row.status == "on") {
        return (
          <div>
            <tag color="success">{teamBuyStatusConvert(row.status).label}</tag>
          </div>
        );
      } else if (row.status == "off") {
        return (
          <div>
            <tag color="error">{teamBuyStatusConvert(row.status).label}</tag>
          </div>
        );
      } else if (row.status == "expire") {
        return (
          <div>
            <tag color="warning">{teamBuyStatusConvert(row.status).label}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.status}</tag>
        </div>
      );
    },
  },
  {
    title: "活动内容",
    align: "center",
    minWidth: 160,
    key: "content",
  },
  {
    title: "有效期起",
    align: "center",
    minWidth: 160,
    key: "startTime",
  },
  {
    title: "有效期止",
    align: "center",
    minWidth: 160,
    key: "endTime",
    render(h, params) {
      if (!compareCouponData(params.row.endTime)) {
        return <div style="color:red">{params.row.endTime + "已过期"}</div>;
      } else {
        return <div>{params.row.endTime}</div>;
      }
    },
  },
  {
    title: "商品库存",
    align: "center",
    minWidth: 90,
    key: "productNum",
  },
  {
    title: "活动价",
    minWidth: 80,
    key: "activityPrice",
    align: "center",
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
    },
  },
  {
    title: "团长优惠",
    align: "center",
    minWidth: 90,
    key: "tourDiscount",
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.tourDiscount)}</div>;
    },
  },
  {
    title: "成团有效时长",
    align: "center",
    minWidth: 110,
    key: "validSeconds",
    render(h, params) {
      return <div>{secondsToDate(params.row.validSeconds)}</div>;
    },
  },
  {
    title: "提货截至时间",
    align: "center",
    minWidth: 160,
    key: "deliveryEndTime",
  },
  {
    title: "规格ID",
    align: "center",
    minWidth: 90,
    key: "standardId",
  },
  {
    title: "规格描述",
    align: "center",
    minWidth: 120,
    key: "standardDesc",
    tooltip: true,
  },
  {
    title: "限购次数",
    align: "center",
    minWidth: 90,
    key: "triesLimit",
  },
  {
    title: "排序",
    align: "center",
    minWidth: 80,
    key: "rank",
  },
  {
    title: "是否模拟成团",
    align: "center",
    minWidth: 120,
    key: "robot",
    render: (h, params) => {
      const { row } = params;
      if (row.robot === "on") {
        return (
          <div>
            <tag color="success">{teamBuyStatusConvert(row.robot).label}</tag>
          </div>
        );
      } else if (row.robot === "off") {
        return (
          <div>
            <tag color="error">{teamBuyStatusConvert(row.robot).label}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.robot}</tag>
        </div>
      );
    },
  },
];
// 预售
const PresellColumns = [
  {
    title: "活动名称",
    key: "activityName",
    align: "center",
    fixed: "left",
    minWidth: 200,
  },
  {
    title: "活动状态",
    align: "center",
    key: "status",
    minWidth: 90,
    render: (h, params) => {
      const { row } = params;
      if (row.status == "VALID") {
        return (
          <div>
            <tag color="success">{"上架"}</tag>
          </div>
        );
      } else if (row.status == "INVALID") {
        return (
          <div>
            <tag color="error">{"下架"}</tag>
          </div>
        );
      }
      return <div>{"N/A"}</div>;
    },
  },
  {
    title: "是否开始",
    align: "center",
    key: "startedFlag",
    minWidth: 90,
    render: (h, params) => {
      const { row } = params;
      if (row.startedFlag) {
        return (
          <div>
            <tag color="success">{"是"}</tag>
          </div>
        );
      } else if (!row.startedFlag) {
        return (
          <div>
            <tag color="error">{"否"}</tag>
          </div>
        );
      }
      return <div>{"N/A"}</div>;
    },
  },
  {
    title: "活动内容",
    align: "center",
    minWidth: 160,
    key: "content",
  },
  {
    title: "活动开始时间",
    align: "center",
    minWidth: 160,
    key: "startTime",
  },
  {
    title: "活动结束时间",
    align: "center",
    minWidth: 160,
    key: "endTime",
    render(h, params) {
      if (!compareCouponData(params.row.endTime)) {
        return <div style="color:red">{params.row.endTime + "已过期"}</div>;
      } else {
        return <div>{params.row.endTime}</div>;
      }
    },
  },
  {
    title: "商品库存",
    align: "center",
    minWidth: 90,
    key: "invNum",
  },
  {
    title: "原价",
    minWidth: 80,
    key: "originalPrice",
    align: "center",
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.originalPrice)}</div>;
    },
  },
  {
    title: "活动价",
    minWidth: 80,
    key: "activityPrice",
    align: "center",
    render(h, params) {
      return <div>{fenToYuanDot2(params.row.activityPrice)}</div>;
    },
  },
  {
    title: "提货开始时间",
    align: "center",
    minWidth: 160,
    key: "deliveryStartTime",
    render(h, params) {
      if (params.row.deliveryStartTime) {
        return <div>{params.row.deliveryStartTime.split(" ")[0]}</div>;
      }
    },
  },
  {
    title: "提货截止时间",
    align: "center",
    minWidth: 160,
    key: "deliveryEndTime",
    render(h, params) {
      if (params.row.deliveryEndTime) {
        return <div>{params.row.deliveryEndTime.split(" ")[0]}</div>;
      }
    },
  },
  {
    title: "几天后开始提货",
    align: "center",
    minWidth: 160,
    key: "beginDay",
    render(h, params) {
      if (params.row.beginDay === 0) {
        return <div>{"N/A"}</div>;
      }
      return <div>{params.row.beginDay}</div>;
    },
  },
  {
    title: "规格描述",
    align: "center",
    minWidth: 120,
    key: "standardDesc",
    tooltip: true,
  },
  {
    title: "限购次数",
    align: "center",
    minWidth: 90,
    key: "triesLimit",
  },
  {
    title: "排序",
    align: "center",
    minWidth: 80,
    key: "rank",
  },
];

const newProductColumns = [
  {
    title: "活动ID",
    align: "center",
    key: "id",
  },
  {
    title: "活动标题",
    align: "center",
    key: "title",
  },
  {
    title: "开始时间",
    align: "center",
    key: "beginTime",
  },
  {
    title: "结束时间",
    align: "center",
    key: "endTime",
    width: 200,
    render: (h, params, vm) => {
      const { row } = params;
      if (!compareCouponData(row.endTime)) {
        return <div style="color:red">{row.endTime + "已过期"}</div>;
      } else {
        return <div>{row.endTime}</div>;
      }
    },
  },
  {
    title: "活动状态",
    align: "center",
    key: "status",
    render: (h, params, vm) => {
      const { row } = params;
      if (row.status === "ON") {
        return (
          <div>
            <tag color="success">{imageStatusConvert(row.status).label}</tag>
          </div>
        );
      } else if (row.status === "OFF") {
        return (
          <div>
            <tag color="error">{imageStatusConvert(row.status).label}</tag>
          </div>
        );
      }
      return (
        <div>
          <tag color="primary">{row.status ? row.status : "N/A"}</tag>
        </div>
      );
    },
  },
  {
    title: "活动每人限购份数",
    align: "center",
    key: "userActivityLimit",
  },
];
export default {
  components: {
    Tables,
    IViewUpload,
  },
  mixins: [tableMixin, searchMixin, deleteMixin, uploadMixin],
  data() {
    return {
      taskTypeEnum,
      ids: [],
      defaultListMain: [],
      uploadListMain: [],
      defaultListBanner: [],
      uploadListBanner: [],
      oldPicture: [],
      newPicture: [],
      save: [],
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
      activityPreSaleRelations: [],
      activitySeckillRelations: [],
      activityTeambuyRelations: [],
      productStandardRelations: [],
      couponConfigManageRelations: [],
      couponTemplateData: [],
      productData: [],
      teambuyTableData: [],
      productTotal: 0,
      newProductTableData: [],
      newProductTotal: 0,
      teambuyTableData: [],
      teambuyTotal: 0,
      PresellTableData: [],
      PresellTotal: 0,
      activityId: null,
      couponTemplateTotal: 0,
      modalEditLoading: false,
      modalRelevance: false,
      modalAddCoupun: false,
      modalAddproduct: false,
      modalAddTeambuy: false,
      modalAddPresell: false,
      modalAddNewProduct: false,
      modalEditRank: false,
      editStatus: false,
      modalRelevanceLoading: false,
      templatePageOpts: [5, 10],
      templateColumns: templateColumns,
      productColumns: productColumns,
      teambuyColumns: teambuyColumns,
      PresellColumns: PresellColumns,
      newProductColumns: newProductColumns,
      searchRowData: this._.cloneDeep(searchRowData),
      activityNewProducts: this._.cloneDeep(activityNewProducts),
      ActivityNewProductsRelation: this._.cloneDeep(
        ActivityNewProductsRelevance
      ),
      searchTemplateRowData: _.cloneDeep(templateRowData),
      searchProductRowData: _.cloneDeep(productRowData),
      searchNewProductRowData: _.cloneDeep(newproductRowData),
      searchteambuyRowData: _.cloneDeep(teambuyRowData),
      searchPresellRowData: _.cloneDeep(PresellRowData),
      statusTypeEnum: [
        { label: "上架", value: "ON" },
        { label: "下架", value: "OFF" },
      ],
      activityStatus: [
        { label: "上架", value: "VALID" },
        { label: "下架", value: "INVALID" },
      ],
      startedFlagStatus: [
        { label: "是", value: "true" },
        { label: "否", value: "false" },
      ],
      validDateTypeEnum: [
        {
          label: "绝对时间",
          value: "FIXED_DATE",
        },
        {
          label: "相对时间",
          value: "UN_FIXED_DATE",
        },
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "ID",
          align: "center",
          key: "id",
          width: 60,
        },
        {
          title: "活动标题",
          align: "center",
          key: "title",
        },
        {
          title: "主题图片",
          key: "mainImage",
          align: "center",
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.mainImage} height="60" width="60" />;
            return <div>{str}</div>;
          },
        },
        {
          title: "有效期起",
          align: "center",
          key: "beginTime",
          width: 160,
        },
        {
          title: "有效期止",
          align: "center",
          key: "endTime",
          width: 160,
          render: (h, params, vm) => {
            const { row } = params;
            if (!compareCouponData(row.endTime)) {
              return <div style="color:red">{row.endTime + "已过期"}</div>;
            } else {
              return <div>{row.endTime}</div>;
            }
          },
        },
        {
          title: "活动状态",
          align: "center",
          key: "status",
          width: 100,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{row.status}</div>;
          },
        },
        {
          title: "主题色号",
          align: "center",
          width: 120,
          key: "mainColour",
        },
        {
          title: "分享文案",
          align: "center",
          key: "shareText",
        },
        {
          title: "分享图片",
          align: "center",
          key: "shareImage",
          render: (h, params, vm) => {
            const { row } = params;
            const str = <img src={row.shareImage} height="60" width="60" />;
            return <div>{str}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 80,
          key: "handle",
          options: ["onSale", "view", "edit", "settings"],
        },
      ],
      // 优惠券
      couponCondataColumns: [
        {
          title: "券名称",
          align: "center",
          key: "couponName",
          minWidth: 70,
          render(h, params) {
            const { row } = params;
            return h("div", row.couponConfigManage.couponName);
          },
        },
        {
          title: "券类型",
          align: "center",
          key: "couponType",
          render: (h, params, vm) => {
            const { row } = params;
            if (row.couponConfigManage.couponType === "FULL_CUT_COUPON") {
              return (
                <div>
                  <tag color="magenta">
                    {couponTypeConvert(row.couponConfigManage.couponType).label}
                  </tag>
                </div>
              );
            } else if (
              row.couponConfigManage.couponType === "DISCOUNT_COUPON"
            ) {
              return (
                <div>
                  <tag color="orange">
                    {couponTypeConvert(row.couponConfigManage.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponConfigManage.couponType === "CASH_COUPON") {
              return (
                <div>
                  <tag color="cyan">
                    {couponTypeConvert(row.couponConfigManage.couponType).label}
                  </tag>
                </div>
              );
            } else if (row.couponConfigManage.couponType === "FREIGHT_COUPON") {
              return (
                <div>
                  <tag color="blue">
                    {couponTypeConvert(row.couponConfigManage.couponType).label}
                  </tag>
                </div>
              );
            }
            return <div>{row.couponConfigManage.couponType}</div>;
          },
          minWidth: 40,
        },
        {
          title: "优惠/折扣额度",
          align: "center",
          key: "couponFee",
          minWidth: 50,
          render(h, params) {
            const { row } = params;
            if (row.couponConfigManage.couponType === "DISCOUNT_COUPON") {
              return <div>{row.couponConfigManage.couponFee / 10 + "折"}</div>;
            } else {
              return (
                <div>{fenToYuanDot2(row.couponConfigManage.couponFee)}</div>
              );
            }
          },
        },
        {
          title: "最小购买金额",
          align: "center",
          key: "minBuyFee",
          minWidth: 40,
          render(h, params) {
            return h(
              "div",
              fenToYuanDot2(params.row.couponConfigManage.minBuyFee)
            );
          },
        },
        {
          title: "最高优惠金额",
          align: "center",
          key: "maxDiscountFee",
          minWidth: 40,
          render(h, params) {
            const { row } = params;
            if (row.couponConfigManage.maxDiscountFee != null) {
              return (
                <div>
                  {fenToYuanDot2(row.couponConfigManage.maxDiscountFee)}
                </div>
              );
            } else {
              return <div>{"N/A"}</div>;
            }
          },
        },
        {
          title: "生效时间",
          key: "effectiveStartTime",
          align: "center",
          minWidth: 40,
          render: (h, params, vm) => {
            const { row } = params;
            if (
              row.couponConfigManage.source == "SMALL" &&
              row.couponConfigManage.validDateType === "FIXED_DATE"
            ) {
              return <div>{row.couponConfigManage.effectiveStartTime}</div>;
            } else if (
              row.couponConfigManage.source == "SMALL" &&
              row.couponConfigManage.validDateType === "UN_FIXED_DATE"
            ) {
              return <div>{row.couponConfigManage.beginDay}</div>;
            } else if (row.couponConfigManage.source == "HD") {
              return <div>{row.couponConfigManage.effectiveStartTime}</div>;
            } else {
              return <div>N/A</div>;
            }
          },
        },
        {
          title: "失效时间",
          key: "effectiveEndTime",
          align: "center",
          minWidth: 90,
          render: (h, params, vm) => {
            const { row } = params;
            if (
              row.couponConfigManage.source == "SMALL" &&
              row.couponConfigManage.validDateType === "FIXED_DATE"
            ) {
              if (!compareCouponData(row.couponConfigManage.effectiveEndTime)) {
                return (
                  <div style="color:red">
                    {row.couponConfigManage.effectiveEndTime + "已过期"}
                  </div>
                );
              } else {
                return <div>{row.couponConfigManage.effectiveEndTime}</div>;
              }
            } else if (
              row.couponConfigManage.source == "SMALL" &&
              row.couponConfigManage.validDateType === "UN_FIXED_DATE"
            ) {
              return <div>{row.couponConfigManage.endDay}</div>;
            } else if (row.couponConfigManage.source == "HD") {
              if (!compareCouponData(row.couponConfigManage.effectiveEndTime)) {
                return (
                  <div style="color:red">
                    {row.couponConfigManage.effectiveEndTime + "已过期"}
                  </div>
                );
              } else {
                return <div>{row.couponConfigManage.effectiveEndTime}</div>;
              }
            } else {
              return <div>N/A</div>;
            }
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 30,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["onSale", "edit"],
        },
      ],
      // 新品尝鲜活动
      activitySeckillColumns: [
        {
          title: "活动ID",
          align: "center",
          key: "id",
          render(h, params) {
            const { row } = params;
            return h("div", row.activitySeckill.id);
          },
        },
        {
          title: "活动名称",
          align: "center",
          key: "productName",
          render(h, params) {
            const { row } = params;
            return h("div", row.activitySeckill.title);
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 30,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["onSale", "edit"],
        },
      ],
      productStandardColumns: [
        {
          title: "规格ID",
          align: "center",
          key: "id",
          render(h, params) {
            const { row } = params;
            return h("div", row.productStandard.id);
          },
        },
        {
          title: "商品名称",
          align: "center",
          key: "productName",
          render(h, params) {
            const { row } = params;
            return h("div", row.productStandard.productName);
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 30,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["onSale", "edit"],
        },
      ],
      // 拼团活动
      activityTeambuyColumns: [
        {
          title: "活动ID",
          align: "center",
          key: "id",
          render(h, params) {
            const { row } = params;
            return h("div", row.activityTeambuy.id);
          },
        },
        {
          title: "活动名称",
          align: "center",
          key: "productName",
          render(h, params) {
            const { row } = params;
            return h("div", row.activityTeambuy.activityName);
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 30,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["onSale", "edit"],
        },
      ],
      activityPreSaleColumns: [
        {
          title: "活动ID",
          align: "center",
          key: "id",
          render(h, params) {
            const { row } = params;
            return h("div", row.activityPreSale.id);
          },
        },
        {
          title: "活动名称",
          align: "center",
          key: "productName",
          render(h, params) {
            const { row } = params;
            return h("div", row.activityPreSale.activityName);
          },
        },
        {
          title: "排序",
          align: "center",
          key: "rank",
          render(h, params) {
            const { row } = params;
            return h("div", row.rank);
          },
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          minWidth: 30,
          render: (h, params, vm) => {
            const { row } = params;
            if (row.status === "ON") {
              return (
                <div>
                  <tag color="success">{"上架"}</tag>
                </div>
              );
            } else if (row.status === "OFF") {
              return (
                <div>
                  <tag color="error">{"下架"}</tag>
                </div>
              );
            }
            return <div>{"N/A"}</div>;
          },
        },
        {
          title: "操作",
          align: "center",
          minWidth: 90,
          key: "handle",
          options: ["onSale", "edit"],
        },
      ],
      // 普通商品
      ruleInline: {
        title: { required: true, message: "请输入活动标题" },
        beginTime: { required: true, message: "请输入活动开始时间" },
        endTime: { required: true, message: "请输入活动结束时间" },
        status: { required: true, message: "请选择活动状态" },
        mainColour: { required: true, message: "请输入主题色号" },
        mainImage: { required: true, message: "请上传主题图片" },
        shareImage: { required: true, message: "请上传分享图片" },
        shareText: { required: true, message: "请输入分享文案" },
      },
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {},
  methods: {
    getTableData() {
      this.loading = true;
      getNewProductsPages(this.searchRowData)
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
    //查看活动关联
    getNewProductsRelevance(id) {
      getNewProductsRelevance(id)
        .then((res) => {
          (this.activityPreSaleRelations = res.activityPreSaleRelations),
            (this.activitySeckillRelations = res.activitySeckillRelations),
            (this.activityTeambuyRelations = res.activityTeambuyRelations),
            (this.productStandardRelations = res.productStandardRelations),
            (this.couponConfigManageRelations =
              res.couponConfigManageRelations);
        })
        .finally(() => {});
    },
    //修改活动关联
    updateNewProductsRelevance(data) {
      updateNewProductsRelevance(data)
        .then((res) => {
          this.getNewProductsRelevance(this.activityId);
          this.$Message.success("更新成功!");
        })
        .finally(() => {});
    },
    resetFields() {
      this.$refs.editForm.resetFields();
    },
    resetSearchRowData() {
      this.searchRowData = _.cloneDeep(searchRowData);
    },
    handleCreate() {
      this.editStatus = false;
      this.$refs.editForm.resetFields();
      this.uploadListMain = [];
      this.uploadListBanner = [];
      this.tempModalType = this.modalType.create;
      this.activityNewProducts = activityNewProducts;
      this.modalEdit = true;
    },
    handleEdit(params) {
      this.editStatus = !compareCouponData(params.row.beginTime);
      this.$refs.editForm.resetFields();
      this.tempModalType = this.modalType.edit;
      this.activityNewProducts = this._.cloneDeep(params.row);
      if (this.activityNewProducts.taskRuleDesc) {
        this.activityNewProducts.taskRuleDesc = this.activityNewProducts.taskRuleDesc.replace(
          /&/g,
          "\n"
        );
      }
      this.modalEdit = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.createTableRow();
          } else if (this.isEdit) {
            this.editTableRow();
          }
        } else {
          this.$Message.error("请完善活动信息!");
        }
      });
    },
    editTableRow() {
      this.modalEditLoading = true;
      updateNewProducts(this.activityNewProducts)
        .then((res) => {
          this.modalEdit = false;
          this.getTableData();
          this.$Message.success("修改成功!");
          this.resetFields();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    createTableRow() {
      createNewProducts(this.activityNewProducts)
        .then((res) => {})
        .finally((res) => {
          this.modalEdit = false;
          this.getTableData();
          this.$Message.success("创建成功!");
          this.resetFields();
        })
        .finally(() => {
          this.modalEditLoading = false;
        });
    },
    deleteTable(ids) {
      this.loading = true;
      deleteNewProducts({
        ids,
      })
        .then((res) => {
          const totalPage = Math.ceil(this.total / this.pageSize);
          if (
            this.tableData.length === this.tableDataSelected.length &&
            this.page === totalPage &&
            this.page !== 1
          ) {
            this.page -= 1;
          }
          this.tableDataSelected = [];
          this.$Message.success("删除成功!");
          this.getTableData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 设置编辑商品的图片列表
    setDefaultUploadList(res) {
      if (res.mainImage != null) {
        const map = { status: "finished", url: "url" };
        const mainImgArr = [];
        map.url = res.mainImage;
        mainImgArr.push(map);
        this.$refs.uploadMain.setDefaultFileList(mainImgArr);
        this.uploadListMain = mainImgArr;
      }
    },
    handleEditClose() {
      this.oldPicture = [];
      this.newPicture = [];
      this.modalEdit = false;
    },
    handleRemoveMain(file) {
      this.$refs.uploadMain.deleteFile(file);
      this.activityNewProducts.mainImage = null;
    },
    handleRemoveBanner(file) {
      this.$refs.uploadBanner.deleteFile(file);
      this.activityNewProducts.shareImage = null;
    },
    handleSuccessMain(response, file, fileList) {
      this.uploadListMain = fileList;
      this.activityNewProducts.mainImage = null;
      this.activityNewProducts.mainImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    handleSuccessBanner(response, file, fileList) {
      this.uploadListBanner = fileList;
      this.activityNewProducts.shareImage = null;
      this.activityNewProducts.shareImage = fileList[0].url;
      this.newPicture.push(fileList[0].url);
      this.oldPicture = this.save;
    },
    beginTimeChange(value, date) {
      this.searchRowData.beginTime = value;
    },
    endTimeChange(value, date) {
      this.searchRowData.endTime = value;
    },
    edBeginTimeChange(value) {
      this.searchNewProductRowData.beginTime = value;
    },
    edFinishTimeChange(value) {
      this.searchNewProductRowData.endTime = value;
    },
    activityStatusChange(value, date) {
      if (value === "expire" || value === "off") {
        this.searchteambuyRowData.sidx = "start_time";
        this.searchteambuyRowData.sort = "desc";
      }
    },
    onSale(params) {
      this.activityNewProducts = this._.cloneDeep(params.row);
      if (params.row.status === "ON") {
        this.activityNewProducts.status = "OFF";
      } else {
        this.activityNewProducts.status = "ON";
      }
      this.loading = true;
      this.editTableRow();
    },
    // 商品 分页
    changeProductPage(page) {
      this.searchProductRowData.page = page;
      this.getProductTableData();
    },
    changeProductPageSize(pageSize) {
      this.searchProductRowData.page = 1;
      this.searchProductRowData.rows = pageSize;
      this.getProductTableData();
    },
    //新品尝鲜活动分页
    changeNewProductPage(page) {
      this.searchNewProductRowData.page = page;
      this.getSeckillPages();
    },
    changeNewProductPageSize(pageSize) {
      this.searchNewProductRowData.page = 1;
      this.searchNewroductRowData.rows = pageSize;
      this.getSeckillPages();
    },
    //拼团分页
    changeteambuyPage(page) {
      this.searchteambuyRowData.page = page;
      this.getTeamBuyPages();
    },
    changeteambuyPageSize(pageSize) {
      this.searchteambuyRowData.page = 1;
      this.searchteambuyRowData.rows = pageSize;
      this.getTeamBuyPages();
    },
    // 预售分页 changePresellPage
    changePresellPage(page) {
      this.searchPresellRowData.page = page;
      this.getPresellPages();
    },
    changePresellPageSize(pageSize) {
      this.searchPresellRowData.page = 1;
      this.searchPresellRowData.rows = pageSize;
      this.getPresellPages();
    },
    createTimeStartChange(value, date) {
      this.searchteambuyRowData.startTimeBegin = value || null;
    },
    createTimeEndChange(value, date) {
      this.searchteambuyRowData.startTimeEnd = value || null;
    },
    // 预售时间
    PresellTimeStartChange(value, date) {
      this.searchPresellRowData.startTime = value || null;
    },
    PresellTimeEndChange(value, date) {
      this.searchPresellRowData.endTime = value || null;
    },
    handleProductSearch() {
      this.getProductTableData();
    },
    hanldeProductClear() {
      this.searchProductRowData = _.cloneDeep(productRowData);
      this.getProductTableData();
    },
    // 拼团
    handleteambuySearch() {
      this.getTeamBuyPages();
    },
    handleteambuyClear() {
      this.searchteambuyRowData = _.cloneDeep(teambuyRowData);
      this.getTeamBuyPages();
    },
    // 预售
    handlePresellSearch() {
      this.getPresellPages();
    },
    handlePresellClear() {
      this.searchPresellRowData = _.cloneDeep(PresellRowData);
      this.getTeamBuyPages();
    },
    // 新品尝鲜
    handleNewProductSearch() {
      this.getSeckillPages();
    },
    hanldeNewProductClear() {
      this.searchNewProductRowData = _.cloneDeep(newproductRowData);
      this.getSeckillPages();
    },
    handleView(params) {
      this.resetFields();
      this.tempModalType = this.modalType.view;
      this.activityNewProducts = _.cloneDeep(params.row);
      this.modalView = true;
    },
    handleSetting(params) {
      this.activityId = params.row.id;
      this.getNewProductsRelevance(params.row.id);
      this.modalRelevance = true;
    },
    handleRelevanceClose() {
      this.modalRelevance = false;
    },
    // 添加活动券
    relevanceAllocation(value) {
      (this.searchTemplateRowData = _.cloneDeep(templateRowData)),
        (this.searchProductRowData = _.cloneDeep(productRowData)),
        (this.searchNewProductRowData = _.cloneDeep(newproductRowData)),
        (this.searchteambuyRowData = _.cloneDeep(teambuyRowData)),
        (this.searchPresellRowData = _.cloneDeep(PresellRowData)),
        (this.ActivityNewProductsRelation = this._.cloneDeep(
          ActivityNewProductsRelevance
        ));
      if (value === "NEW_COUPON") {
        let couponNum = 0;
        // 列表只允许有一张券
        for (let val of this.couponConfigManageRelations) {
          if (val.status === "ON") {
            couponNum++;
          }
        }
        if (couponNum == 0) {
          this.getTemplateTableData();
          this.modalAddCoupun = true;
        } else {
          this.$Message.info("当前存在有效的新品券(只允许关联一张)!");
          return;
        }
      } else if (value === "NEW_TRY") {
        this.getSeckillPages();
        this.modalAddNewProduct = true;
      } else if (value === "NEW_PROD") {
        this.getProductTableData();
        this.modalAddproduct = true;
      } else if (value === "NEW_TEAM_BUY") {
        this.getTeamBuyPages();
        this.modalAddTeambuy = true;
      } else if (value === "NEW_PRE_SALE") {
        this.getPresellPages();
        this.modalAddPresell = true;
      }
    },
    //统一关闭
    handleAddClose() {
      this.modalAddCoupun = false;
      this.modalAddproduct = false;
      this.modalAddNewProduct = false;
      this.modalAddTeambuy = false;
      this.modalAddPresell = false;
      this.ActivityNewProductsRelation = this._.cloneDeep(
        ActivityNewProductsRelevance
      );
    },
    //统一上下架
    onRelevanceSale(params) {
      console.log("上下架", params.row);

      let couponNum = 0;
      for (let val of this.couponConfigManageRelations) {
        if (
          params.row.relationType === "NEW_COUPON" &&
          params.row.status === "OFF"
        ) {
          if (val.status === "ON") {
            couponNum++;
          }
          if (couponNum === 1) {
            this.$Message.info("当前存在有效的新品券!");
            return;
          }
        }
      }

      this.ActivityNewProductsRelation = this._.cloneDeep(params.row);
      if (params.row.status === "ON") {
        this.ActivityNewProductsRelation.status = "OFF";
      } else {
        this.ActivityNewProductsRelation.status = "ON";
      }
      this.updateNewProductsRelevance(this.ActivityNewProductsRelation);
    },
    // 统一修改排序
    handleEditRank(params) {
      this.modalEditRank = true;
      this.rankStatus = false;
      this.ActivityNewProductsRelation = this._.cloneDeep(params.row);
    },
    submitEditRank() {
      this.updateNewProductsRelevance(this.ActivityNewProductsRelation);
      this.modalEditRank = false;
    },
    handleEditRankClose() {
      this.modalEditRank = false;
    },
    // 券列表
    getTemplateTableData() {
      getCouponPagess(this.searchTemplateRowData)
        .then((res) => {
          this.couponTemplateData = res.rows;
          this.couponTemplateTotal = res.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //商品列表
    getProductTableData() {
      getProductStandardsPages(this.searchProductRowData).then((res) => {
        this.productData = res.rows;
        this.productTotal = res.total;
      });
    },
    // 拼团列表
    getTeamBuyPages() {
      getTeamBuyPages(this.searchteambuyRowData).then((res) => {
        this.teambuyTableData = res.rows;
        this.teambuyTotal = res.total;
      });
    },
    //新品尝鲜活动
    getSeckillPages() {
      getSeckillPages(this.searchNewProductRowData)
        .then((res) => {
          this.newProductTableData = res.rows;
          this.newProductTotal = res.total;
        })
        .catch((error) => {});
    },
    //预售活动
    getPresellPages() {
      getPresellPages(this.searchPresellRowData)
        .then((res) => {
          this.PresellTableData = res.rows;
          this.PresellTotal = res.total;
        })
        .catch((error) => {
          console.log(error);
        });
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
    handleTemplateChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.ActivityNewProductsRelation.relationId = currentTemplate.id;
      this.ActivityNewProductsRelation.status = "ON";
      this.ActivityNewProductsRelation.relationType = "NEW_COUPON";
      this.ActivityNewProductsRelation.activityId = this.activityId;
    },
    handleProductChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.ActivityNewProductsRelation.relationId = currentTemplate.id;
      this.ActivityNewProductsRelation.status = "ON";
      this.ActivityNewProductsRelation.relationType = "NEW_PROD";
      this.ActivityNewProductsRelation.activityId = this.activityId;
    },
    handleNewProductChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.ActivityNewProductsRelation.relationId = currentTemplate.id;
      this.ActivityNewProductsRelation.status = "ON";
      this.ActivityNewProductsRelation.relationType = "NEW_TRY";
      this.ActivityNewProductsRelation.activityId = this.activityId;
    },
    handleteambuyChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.ActivityNewProductsRelation.relationId = currentTemplate.id;
      this.ActivityNewProductsRelation.status = "ON";
      this.ActivityNewProductsRelation.relationType = "NEW_TEAM_BUY";
      this.ActivityNewProductsRelation.activityId = this.activityId;
    },
    handlePresellChange(currentRow, oldCurrentRow) {
      const currentTemplate = currentRow;
      this.ActivityNewProductsRelation.relationId = currentTemplate.id;
      this.ActivityNewProductsRelation.status = "ON";
      this.ActivityNewProductsRelation.relationType = "NEW_PRE_SALE";
      this.ActivityNewProductsRelation.activityId = this.activityId;
    },
    handleRelevanceAdd() {
      if (
        !this.ActivityNewProductsRelation.activityId &&
        !this.ActivityNewProductsRelation.relationId
      ) {
        this.$Message.error("请先关联活动配置!");
        return;
      }
      createNewProductsRelevance(this.ActivityNewProductsRelation)
        .then((res) => {
          this.modalAddCoupun = false;
          this.modalAddproduct = false;
          this.modalAddNewProduct = false;
          this.modalAddTeambuy = false;
          this.modalAddPresell = false;
          this.getNewProductsRelevance(this.activityId);
          this.ActivityNewProductsRelation = this._.cloneDeep(
            ActivityNewProductsRelevance
          );
          this.$Message.success("添加成功!");
        })
        .finally(() => {
          this.modalRelevanceLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.img {
  margin-top: 0.25rem !important;
  vertical-align: middle;
}
</style>

