<script setup lang="ts">
import emotion from './emoji'
const emit = defineEmits(['onSelectEmoji'])
function onSelectEmoji(emoji: any) {
  emit('onSelectEmoji', emoji)
}
</script>

<template>
  <div class="emotion">
    <ul>
      <li v-for="emo in emotion" :key="emo.codes" @click="onSelectEmoji(emo.char)">
        {{ emo.char}}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.emotion{
  width: 100%;
  height: 300px;
  background-color: var(--dialog-bgColor);
  box-shadow: 0 0px 1px var(--border-color);
  border-radius: 5px;
  position: relative;
  &::after{
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-right: 2px solid var(--border-color);
    border-bottom: 2px solid var(--border-color);
    transform: rotateZ(45deg);
    position: absolute;
    bottom: -8px;
    left: 73px;
    background-color: var(--dialog-bgColor);
  }
  ul{
    display: flex;
    flex-wrap: wrap;
    padding: 10px 5px 10px 10px;
    font-size: 23px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    li{
      width: 40px;
      height: 40px;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover{
        background-color: #eee;
        font-size: 26px;
      }
    }
  }
}
</style>
