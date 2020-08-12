<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="switchSystem">
      <span>{{ system.name }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in systemList" :key="item.id" :name="item | obj2Json">
          {{ item.name }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { PcLockr, enums } from '@/util/';
import {
  getSystemHomeName,
  setTagNavListInLocalstorage,
  getTagNavListFromLocalstorage
} from '@/libs/util';

export default {
  name: 'System',
  filters: {
    obj2Json(value) {
      if (!value) return;
      return JSON.stringify(value);
    }
  },
  props: {
    system: {
      type: Object,
      required: false,
      default: function() {
        return { name: '' };
      }
    },
    systemList: {
      type: Array,
      required: true
    }
  },
  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList;
    }
  },
  methods: {
    ...mapMutations(['setBreadCrumb', 'setCurrentSystem', 'setTagNavList']),
    ...mapActions(['handleLogOut', 'getRouteListById']),
    switchSystem(item) {
      const obj = JSON.parse(item);
      console.log('current at', obj.code);
      // 更新system本地缓存的值
      if (PcLockr.get(enums.SYSTEM) != null) {
        PcLockr.delete(enums.SYSTEM);
      }
      PcLockr.set(enums.SYSTEM, item);
      const name = getSystemHomeName();
      const tagNavListLocal = getTagNavListFromLocalstorage();
      if (tagNavListLocal.length > 0) {
        const newTagNavList = []
        setTagNavListInLocalstorage(newTagNavList);
        this.setTagNavList(newTagNavList);
      }
      // 更新systemName
      this.setCurrentSystem(this.systemList);
      // 分发Action根据选择的系统id重新生成左边的菜单
      this.getRouteListById(obj.id).then(() => {
        this.$router.addRoutes(this.$store.getters.getActualRouter);
        this.$router.push({ name: name });
        this.setBreadCrumb(this.$route);
      });
    }
  }
};
</script>
