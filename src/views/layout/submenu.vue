<template>
  <a-sub-menu :key="menuInfo.id" v-bind="$attrs">
    <template #icon>
      <span>
        <i :class="menuInfo.icon"></i>
      </span>
    </template>
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children">
      <sub-menu v-if="item.children&&item.children.length>0" :key="item.path" :menuInfo="item" />
      <a-menu-item v-else :key="item.path">
        <router-link :to="{ path: item.path }">
          <span>{{ item.title }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  name: "subMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>