<template>
  <a href="/隧道设计资料.pdf" download="downloaded-document.pdf">下载文档</a>
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
            <span
              style="color: #4d97f7"
              v-show="!item.name.includes('pdf')"
              @click="() => openFile(item.name)"
              >{{ item.name }}</span
            >
            <span style="color: #4d97f7">
              <a
                :href="`/${item.name}`"
                v-show="item.name.includes('pdf')"
                :download="item.name"
                >{{ item.name }}</a
              >
            </span>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
  <n-modal v-model:show="showDialog" :title="dialogTitle" preset="card" :show-icon="false">
    <n-card size="huge" :bordered="false" role="dialog" aria-modal="true">
      <img :src="`/src/assets/files/${dialogTitle}`" alt="" srcset="" />
    </n-card>
  </n-modal>
  <VuePdfApp
    pdf="/src/assets/files/1.pdf"
    :page-scale="pageScale"
    :theme="theme"
    :width="viewerWidth"
    height="600px"
    style="height: 600px"
    @pages-rendered="handlePagesRendered"
  />
</template>

<script setup>
  import { Document, ArchiveOutline, Image } from '@vicons/ionicons5';
  import { ref, computed } from 'vue';

  const showDialog = ref(false);
  const dialogTitle = ref('');
  const files = [
    {
      name: 'IMG_1.jpg',
    },
    {
      name: 'IMG_2.jpg',
    },
    {
      name: 'IMG_3.jpg',
    },
    {
      name: 'IMG_4.jpg',
    },
    {
      name: 'IMG_5.jpg',
    },
    {
      name: 'IMG_7.jpg',
    },
    {
      name: 'IMG_8.jpg',
    },
    {
      name: 'IMG_9.jpg',
    },
    {
      name: '隧道设计资料.pdf',
    },
  ];

  const pdfUrl = ref('/src/assets/files/1.pdf'); // 替换为你的 PDF 文件路径
  const pageScale = ref('page-fit'); // 页面缩放比例
  const theme = ref('dark'); // 预览主题
  const viewerWidth = computed(() => '100%'); // 预览容器宽度
  const viewerHeight = computed(() => '600px'); // 预览容器高度

  const handlePagesRendered = (pdfApp) => {
    console.log('PDF pages rendered', pdfApp);
    // 你可以在这里处理页面渲染完成后的逻辑
  };

  function openFile(file) {
    dialogTitle.value = file;
    showDialog.value = true;
    fetch('/隧道设计资料.pdf');
    // window.open('/files/IMG_1.jpg', '_blank');
  }
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
