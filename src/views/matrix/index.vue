<template>
  <div class="matrix-container">
    <n-card title="隶属度矩阵选择">
      <div class="select-container">
        <n-select v-model:value="selectedMatrix" :options="options" />
        <div class="btns">
          <n-button quaternary circle color="green">
            <template #icon>
              <n-icon><CreateOutline /></n-icon>
            </template>
          </n-button>
          <n-button quaternary circle color="blue">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
          </n-button>
          <n-button quaternary circle color="red">
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <n-h4 prefix="bar">
        <n-text> 预览 </n-text>
      </n-h4>
      <div class="matrix-table-container">
        <div>
          <span class="font-bold r-icon">R</span>
          <span> = </span>
        </div>
        <n-table :single-line="false">
          <thead>
            <tr> </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in matrixData[0].data" :key="index">
              <td v-for="(item, index) in data">{{ item }}</td>
            </tr>
          </tbody>
          <div class="prefix"></div>
          <div class="suffix"></div>
        </n-table>
      </div>
    </n-card>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { CreateOutline, AddOutline, TrashOutline } from '@vicons/ionicons5'

  const matrixData = ref([
    {
      name: '等差为0.28的三角形分布矩阵',
      data: [
        ['0.4310', '0.3103', '0.1897', '0.0690', '0.0000'],
        ['0.2368', '0.3289', '0.2368', '0.1477', '0.0526'],
        ['0.1325', '0.2169', '0.3012', '0.2169', '0.1325'],
        ['0.0526', '0.1477', '0.1897', '0.3289', '0.2368'],
        ['0.0000', '0.0690', '0.1897', '0.3103', '0.4310'],
      ],
    },
  ]);
  const selectedMatrix = ref('');
  const options = computed(() => {
    return matrixData.value.map((item) => ({ label: item.name, key: item.name }));
  });

  onMounted(() => {
    selectedMatrix.value = options.value[0]?.key;
  });
</script>

<style lang="less" scoped>
  .matrix-container {
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
  }
  :deep(.n-card) {
    height: 100%;
  }
  .select-container {
    max-width: 530px;
    display: flex;
    justify-content: space-between;
    .n-select {
      flex: 1;
      margin-right: 20px;
    }
  }
  .matrix-table-container {
    max-width: 530px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .r-icon {
      position: relative;
      &::before {
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        top: -1px;
        background-color: black;
      }
    }
  }
  :deep(.n-table) {
    max-width: 500px;
    border: none !important;
    position: relative;
    td {
      border: none;
      text-align: center;
    }
    .suffix {
      position: absolute;
      top: 0;
      right: 0;
      border: 2px solid #1f2225;
      border-left: none;
      width: 14px;
      height: 100%;
    }
    .prefix {
      position: absolute;
      top: 0;
      left: 0;
      border: 2px solid #1f2225;
      border-right: none;
      width: 14px;
      height: 100%;
    }
  }
</style>
