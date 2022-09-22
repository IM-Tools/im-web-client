<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import Recorder from 'js-audio-recorder'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/chat'
const recorder = ref()
recorder.value = new Recorder()
const emit = defineEmits(['closeVoice','sendVoice'])
function closeVoice() {
  emit('closeVoice')
}
onBeforeUnmount(() => {
  recorder.value.destroy().then(() => {
    recorder.value = null
  })
})
// 开始录音
const isStart = ref(false)
const isRecord = ref(false)
function startRecord() {
  if (isStart.value) {
    ElMessage({
      message: '正在录音',
      type: 'warning',
    })
    return
  }
  recorder.value.start().then(() => {
    isStart.value = true
  })
}
// 结束录音
function overRecord() {
  recorder.value.stop()
  const blob = recorder.value.getWAVBlob() //获取wav格式音频数据
  const newbolb = new Blob([blob], { type: 'audio/wav' })
  const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
  uploadFile({ file: fileOfBlob }).then((res) => {
    console.log(res);
    const url = res.file_url
    if(!url){
      ElMessage({
        message: '发送录音失败',
        type: 'warning',
      })
      emit('closeVoice')
      return
    }
    emit('sendVoice',url)
    emit('closeVoice')
  })
}
// 暂停/继续录音
function pauseRecord() {
  if (!isStart.value) {
    ElMessage({
      message: '请先开始录音',
      type: 'warning',
    })
    return
  }
  if (isRecord.value) {
    recorder.value.resume()
  } else {
    recorder.value.pause()
  }
}
// 监听音频输入
const voiceNum = ref<number>(1)
recorder.value.onprogress = function (params: any) {
  voiceNum.value = parseFloat(params.vol) * 1.6
}
</script>

<template>
  <div class="voice">
    <div class="point">
      <div class="close" @click="closeVoice">
        <el-icon><Close /></el-icon>
      </div>
      <div class="box" :style="{ height: voiceNum + 'px' }">
        <div class="num one"></div>
        <div class="num two"></div>
        <div class="num three"></div>
        <div class="num four"></div>
        <div class="num five"></div>
        <div class="num six"></div>
        <div class="num seven"></div>
        <div class="num eight"></div>
        <div class="num nine"></div>
      </div>
    </div>
    <div class="tool">
      <ul>
        <li @click="startRecord">开始录音</li>
        <li @click="pauseRecord" v-if="isStart">{{ isRecord ? '继续录音' : '暂停录音' }}</li>
        <li @click="closeVoice">取消录音</li>
        <li @click="overRecord">发送录音</li>
      </ul>
    </div>
  </div>
  <div class="mask" @click="closeVoice"></div>
</template>

<style scoped lang="less">
.voice {
  width: 500px;
  height: 280px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 2001;
  .point {
    width: 100%;
    height: 220px;
    position: relative;
    box-sizing: border-box;
    padding: 0 30px;
    .close {
      width: 22px;
      height: 22px;
      font-size: 22px;
      position: absolute;
      top: 6px;
      right: 6px;
      cursor: pointer;
      &:hover {
        color: #ec2a2a;
      }
    }
    .box {
      position: absolute;
      width: 300px;
      height: 160px;
      left: 100px;
      bottom: 10px;
    }
    .num {
      width: 15px;
      height: 1px;
      position: absolute;
      bottom: 25px;
      background-color: #4eb0ff;
    }
    .one {
      left: 30px;
      // max-height: 100px;
      animation: musicWave 0.5s infinite linear both alternate;
    }
    .two {
      left: 55px;
      animation: musicWave 0.6s infinite linear both alternate;
    }
    .three {
      left: 80px;
      animation: musicWave 0.7s infinite linear both alternate;
    }
    .four {
      left: 105px;
      animation: musicWave 0.8s infinite linear both alternate;
    }
    .five {
      left: 130px;
      animation: musicWave 0.7s infinite linear both alternate;
    }
    .six {
      left: 155px;
      animation: musicWave 0.6s infinite linear both alternate;
    }
    .seven {
      left: 180px;
      animation: musicWave 0.5s infinite linear both alternate;
    }
    .eight {
      left: 205px;
      animation: musicWave 0.45s infinite linear both alternate;
    }
    .nine {
      left: 230px;
      animation: musicWave 0.4s infinite linear both alternate;
    }
  }
  .tool {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 0 30px;
    ul {
      width: 100%;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      li {
        padding: 0 15px;
        height: 35px;
        border-radius: 5px;
        background-color: #5188ff;
        color: #fff;
        line-height: 35px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
@keyframes musicWave {
  0% {
    height: 1px;
  }
  100% {
    height: 100%;
  }
}
</style>
