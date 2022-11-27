<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
const count = ref(0)
const dialogVisible = ref(false)


  const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
  }
</script>

<template>
  <div class="home"></div>
  <el-dialog
      v-model="dialogVisible"
      title="用户下线"
      width="30%"
      :before-close="handleClose"
    >
      <span>你的账号在异地登录了</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<style scoped lang="less">
.home{
  width: 100%;
  height: 100%;
  background-color: var(--theme-bgColor);
  border-radius: 3px;
}
</style>