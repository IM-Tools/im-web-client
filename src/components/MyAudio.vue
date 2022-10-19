<script setup lang="ts">
import { onMounted, ref } from 'vue'
const props = defineProps({
  imgUrl: {
    type: String,
    required: true,
  },
  isOwn: {
    type: Boolean,
    required: true,
  },
})
const isAnimation = ref(false)
const duration = ref('0')
onMounted(() => {
  const audio = new Audio(props.imgUrl)
  audio.oncanplay = () => {
    duration.value = audio.duration.toFixed(2)
  }
})
function playAudio() {
  isAnimation.value = true
  const audio = new Audio(props.imgUrl)
  audio.onended = () => {
    isAnimation.value = false
  }
  audio.oncanplay = () => {
    audio.play()
  }
}
</script>

<template>
  <div
    class="audio-warp"
    :class="{ own: isOwn, animation: isAnimation }"
    @click="playAudio"
  >
    <div class="box">
      <div class="wifi-symbol">
        <div class="first"></div>
        <div class="second"></div>
        <div class="three"></div>
      </div>
    </div>
    <div class="num">{{ duration }}''</div>
  </div>
  <audio :src="imgUrl" style="display: none" controls></audio>
</template>

<style scoped lang="less">
.audio-warp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  .box {
    width: 35px;
    height: 25px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .wifi-symbol {
    width: 35px;
    height: 25px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .first,
  .second,
  .three {
    width: 5px;
    height: 25px;
    display: flex;
    align-items: center;
  }
  .first {
    margin-right: -1px;
    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      background-color: #333;
      border-radius: 50%;
    }
  }
  .second {
    width: 7px;
    height: 12px;
    overflow: hidden;
    position: relative;
    transform: rotate(28deg);

    &::before {
      content: '';
      display: block;
      width: 15px;
      height: 15px;
      border: 2px solid #333;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .three {
    width: 7px;
    height: 20px;
    overflow: hidden;
    position: relative;
    transform: rotate(14deg);
    &::before {
      content: '';
      display: block;
      width: 25px;
      height: 25px;
      border: 2px solid #333;
      border-radius: 50%;
      position: absolute;
      top: -2px;
      right: 0;
    }
  }
}
.own {
  flex-direction: row-reverse;
  background-color: #6084e7;
  box-shadow: 0 0 5px #89a3eb;
  .box {
    transform: rotate(180deg);
  }
  .first {
    &::before {
      content: '';
      background-color: #fff;
    }
  }
  .second {
    &::before {
      content: '';
      border: 2px solid #fff;
    }
  }
  .three {
    &::before {
      content: '';
      border: 2px solid #fff;
    }
  }
  .num {
    color: #fff;
  }
}
.animation {
  .second {
    animation: fadeInOut 1s infinite 0.2s;
  }
  .three {
    animation: fadeInOut 1s infinite 0.4s;
  }
}
@keyframes fadeInOut {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    opacity: 1; /*结尾状态 透明度为1*/
  }
}
</style>
