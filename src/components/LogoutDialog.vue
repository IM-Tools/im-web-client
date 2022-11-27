<template>
    <el-dialog
      v-model="dialogVisible"
      title="用户下线"
      width="30%"
      :before-close="handleClose"
    >
    <svg t="1669520624725" class="icon" viewBox="0 0 1102 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3420" width="32" height="32"><path d="M587.01666666 788.11c-1.29 0-2.34-1.05-2.34-2.35v-59.98c0-1.3-1.05-2.35-2.35-2.35h-55.31c-1.3 0-2.35 1.05-2.35 2.35v59.98c0 1.3-1.05 2.35-2.35 2.35H169.02666666c-16.57 0-30 13.43-30 30 0 8.29 3.36 15.79 8.79 21.21 5.43 5.43 12.93 8.79 21.21 8.79h353.3c1.3 0 2.36 1.05 2.36 2.34v63.06c0 1.3 1.04 2.35 2.35 2.35h55.31c1.29 0 2.34-1.05 2.34-2.35v-63.06c0-1.3 1.05-2.35 2.35-2.35h218.88l-59.99-59.99H587.01666666zM962.55666666 796.9c-5.43-5.43-12.93-8.79-21.21-8.79h-25.72l48.96 48.96a29.916 29.916 0 0 0 6.76-18.97c0-8.28-3.36-15.78-8.79-21.2zM633.98666666 676.17l-29.89-29.89h-424.4c-14.52 0-26.29-11.54-26.29-25.76V195.59l-30.21-30.21v482.47c0 15.64 12.93 28.32 28.89 28.32h481.9zM971.30666666 136.21c-4.15-2.28-8.95-3.57-14.05-3.57h-697.1l29.91 29.91H929.66666666c14.51 0 26.28 11.54 26.28 25.76v432.21c0 14.23-11.77 25.76-26.28 25.76H773.79666666l29.89 29.89h153.56c15.96 0 28.89-12.68 28.89-28.32V160.97c0.01-10.65-5.97-19.92-14.83-24.76z" fill="#1296db" p-id="3421"></path><path d="M577.49666666 619.68L181.48666666 223.67V596c0 13.08 10.6 23.68 23.68 23.68h372.33zM927.86666666 595.99V212.82c0-13.08-10.6-23.68-23.68-23.68H316.65666666l430.54 430.54h156.99c13.07 0 23.68-10.6 23.68-23.69zM180.45666666 95.36c-11.72-11.72-30.71-11.72-42.43 0-11.72 11.72-11.72 30.71 0 42.43l790.35 790.35c11.72 11.72 30.71 11.72 42.43 0 11.72-11.72 11.72-30.71 0-42.43L180.45666666 95.36z" fill="#1296db" p-id="3422"></path></svg> <span>你的账号在异地登录了 登录地址: {{logoutInfo.pro}} {{logoutInfo.city}}。 ip:{{logoutInfo.ip}}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false"> <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          关闭
        </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { mainStore } from '@/store'
  import { computed } from '@vue/reactivity'
  import { useRouter } from 'vue-router'
  const dialogVisible = ref(true)
  const router = useRouter()
  const store = mainStore()
  const logoutInfo = computed(() => store.logoutInfo)
  const handleClose = (done: () => void) => {
    ElMessageBox.confirm('退出登录')
      .then(() => {
        router.push({path:"/login"})
        done()
      })
      .catch(() => {
        // catch error
      })
  }
  </script>
  <style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>
  