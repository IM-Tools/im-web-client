<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { menuType } from '../type'
const props = defineProps({
  position: {
    type: Object,
    default() {
      return {
        positionY: 0,
        positionX: 0,
      }
    },
  },
  show: {
    type: Boolean,
    default: false,
  },
  menuList: {
    type: Array<menuType>,
    default() {
      return [
        { name: '操作', method: () => console.log(111) },
        { name: '删除', method: () => console.log(222) },
      ]
    },
  },
  val: {
    type: Object,
    default() {
      return {}
    },
  },
})
const isMenu = ref(true)
isMenu.value = props.show
// 菜单点击
function menuClick(list: menuType) {
  if (list.name == '置顶') {
    list.method(props.val, 1)
  } else {
    list.method(props.val, 0)
  }
  isMenu.value = false
}
onMounted(() => {
  document.addEventListener('click', closeMeun)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeMeun)
})
function closeMeun() {
  isMenu.value = false
}
</script>
<template>
  <div
    class="custom-menu"
    :style="{ top: position.positionY + 'px', left: position.positionX + 'px' }"
    v-if="isMenu"
  >
    <div class="list">
      <ul>
        <li
          v-for="(list, index) in menuList"
          @click="menuClick(list)"
          :key="index"
        >
          {{ list.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="less">
.custom-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  background-color: #fff;
  z-index: 9999;
  border: 1px solid #eee;
  .list {
    ul {
      li {
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
}
</style>
