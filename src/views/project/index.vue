<template>
  <div class="project-container">
    <n-card title="工程项目信息">
      <n-list bordered hoverable clickable>
        <template #header>
          <span class="font-bold">当前文件列表</span>
        </template>
        <template #footer>
          <n-upload
            multiple
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :max="5"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <ArchiveOutline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </template>
        <n-list-item v-for="item in files" :key="item.name">
          <template #prefix>
            <n-icon v-if="item.name.includes('pdf')"><Document /></n-icon>
            <n-icon v-else><Image /></n-icon>
          </template>
          <n-thing> 
          <span style="color: #4d97f7;">{{ item.name }}</span>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>

<script setup>
  import { Document, ArchiveOutline, Image } from '@vicons/ionicons5';

  const files = [
    {
      name: '项目简介.pdf',
    },
    {
      name: '项目现场图片1.png',
    },    {
      name: '项目现场图片2.png',
    },

    ];
</script>

<style lang="less" scoped>
  .project-container {
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
  }
  :deep(.n-card) {
    height: 100%;
  }
</style>
