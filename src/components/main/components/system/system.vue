<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="switchSystem">
      <span>{{ system.name }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in systemList" :name="item | obj2Json" :key="item.id">{{item.name}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { PcLockr, enums } from '@/util/';

export default {
  name: 'System',
  props: {
    system: {
      type: Object,
      required: false,
      default: function () {
        return { name: '' };
      }
    },
    systemList: {
      type: Array,
      required: true
    }
  },
  filters: {
    obj2Json(value) {
      if (!value) return;
      return JSON.stringify(value);
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['setCurrentSystem']),
    ...mapActions(['handleLogOut', 'getRouteListById']),
    switchSystem(item) {
      const obj= JSON.parse(item);
      console.log('current at', obj.code);
      // 更新system本地缓存的值
      if (PcLockr.get(enums.SYSTEM) != null) {
        PcLockr.delete(enums.SYSTEM);
      }
      PcLockr.set(enums.SYSTEM, item);
      // 更新systemName
      this.setCurrentSystem(this.systemList);
      // 分发Action根据选择的系统id重新生成左边的菜单
      this.getRouteListById(obj.id).then(() => {
        this.$router.addRoutes(this.$store.getters.getActualRouter);
        this.$router.push({
          name: 'home'
        });
      });
    }
  }
};
</script>
