<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span>{{ system.name }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in systemList" :name="item.code" :key="item.id" @on-click="switchSystem(item)">{{item.name}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
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
  computed: {},
  methods: {
    ...mapActions(['handleLogOut']),
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            });
          });
          break;
      }
    },
    switchSystem(item) {
      console.log('current system is', item.code);
      // 更新system本地缓存的值
      // 重新生成左边的菜单
    }
  }
};
</script>
