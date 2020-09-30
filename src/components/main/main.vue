<template>
  <Layout style="height: 100%" class="main">
    <Sider
      :width="256"
      :collapsed-width="64"
      v-model="collapsed"
      :style="{overflow: 'hidden'}"
      hide-trigger
      collapsible
      class="left-sider"
    >
      <side-menu
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        :menu-list="menuList"
        accordion
        @on-select="turnToPage"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" key="max-logo" :src="maxLogo">
          <img v-show="collapsed" key="min-logo" :src="minLogo">
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
          <System :system="systemCurrent" :system-list="systemList" style="margin-right: 10px;"/>
          <!-- <language :lang="local" style="margin-right: 10px;" @on-lang-change="setLocal"/> -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              :list="tagNavList"
              @input="handleClick"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <div class="copyright-area">
              <p class="copyright">Copyright©2020 All Rights Reserved 湖南绿航恰果果农产品有限公司 版权所有
                <a href="http://beian.miit.gov.cn">湘ICP备16000524号</a>
              </p>
              <p class="address"><Icon type="ios-pin" /> 地址：长沙市岳麓区麓谷企业广场F3栋21楼</p>
              <p class="phone"><Icon type="ios-call" /> 电话：400-612-0088</p>
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import TagsNav from './components/tags-nav';
import User from './components/user';
import System from './components/system';
import Fullscreen from './components/fullscreen';
import Language from './components/language';
import { mapMutations, mapActions } from 'vuex';
import { getNewTagList, getNextRoute, routeEqual, getSystemHomeName } from '@/libs/util';
import minLogo from '@/assets/images/logo-min.jpg';
import maxLogo from '@/assets/images/lhiot_logo.jpg';
import './main.less';
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User,
    System
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    };
  },
  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    },
    cacheList() {
      return this.tagNavList.length
        ? this.tagNavList
          .filter(item => !(item.meta && item.meta.notCache))
          .map(item => item.name)
        : [];
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    systemList() {
      return this.$store.getters.systemList;
    },
    local() {
      return this.$store.state.app.local;
    },
    systemCurrent() {
      return this.$store.getters.systemCurrent;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.addTag({
      route: this.$store.state.app.homeRoute
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
  },
  methods: {
    ...mapMutations(['setBreadCrumb', 'setTagNavList', 'addTag', 'setLocal']),
    ...mapActions(['handleLogin']),
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type === 'all') {
        const name = getSystemHomeName();
        this.turnToPage(name);
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route);
          this.$router.push(nextRoute);
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    }
  }
};
</script>
