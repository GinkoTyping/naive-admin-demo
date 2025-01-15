<template>
  <div class="matrix-container">
    <n-card title="隶属度矩阵选择">
      <div class="select-container">
        <n-select v-model:value="selectedMatrix" :options="options" />
        <div class="btns">
          <n-button quaternary circle color="green" @click="isEdit = !isEdit">
            <template #icon>
              <n-icon v-show="!isEdit"><CreateOutline /></n-icon>
              <n-icon v-show="isEdit"><CheckmarkCircle /></n-icon>
            </template>
          </n-button>
          <n-button quaternary circle color="blue" @click="showDialog = !showDialog">
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
            <tr v-for="(data, index) in selectedData" :key="index">
              <td v-for="(item, index) in data">
                <n-input v-model:value="item.value" v-show="isEdit" clearable />
                <span v-show="!isEdit">{{ item.value }}</span>
              </td>
            </tr>
          </tbody>
          <div class="prefix"></div>
          <div class="suffix"></div>
        </n-table>
      </div>
    </n-card>
  </div>
  <n-modal
    v-model:show="showDialog"
    title="新增矩阵"
    preset="dialog"
    negative-text="取消"
    positive-text="确认"
    :show-icon="false"
    @positive-click="handleSubmit"
    @negative-click="handleClose"
  >
    <!-- 表单内容 -->
    <n-form ref="formRef" :model="formData" :rules="rules">
      <n-form-item label="名称" path="label">
        <n-input v-model:value="formData.label" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { CreateOutline, AddOutline, TrashOutline, CheckmarkCircle } from '@vicons/ionicons5';

  const isEdit = ref(false);
  const showDialog = ref(false);
  function handleSubmit() {
    if (formData.value.label) {
      matrixData.value.push({
        name: formData.value.label,
        key: Date.now(),
        data: [
          [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
          [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
          [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
          [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
          [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
        ],
      });
      showDialog.value = false;
    }
  }
  function handleClose() {}
  const formData = ref({
    label: '',
    key: '',
  });
  const defaultMatrixData = [
    [
      { value: '0.4310' },
      { value: '0.3103' },
      { value: '0.1897' },
      { value: '0.0690' },
      { value: '0.0000' },
    ],
    [
      { value: '0.2368' },
      { value: '0.3289' },
      { value: '0.2368' },
      { value: '0.1477' },
      { value: '0.0526' },
    ],
    [
      { value: '0.1325' },
      { value: '0.2169' },
      { value: '0.3012' },
      { value: '0.2169' },
      { value: '0.1325' },
    ],
    [
      { value: '0.0526' },
      { value: '0.1477' },
      { value: '0.1897' },
      { value: '0.3289' },
      { value: '0.2368' },
    ],
    [
      { value: '0.0000' },
      { value: '0.0690' },
      { value: '0.1897' },
      { value: '0.3103' },
      { value: '0.4310' },
    ],
  ];
  const matrixData = ref([
    {
      name: '等差为0.28的三角形分布矩阵',
      key: '0',
      data: defaultMatrixData,
    },
  ]);
  const selectedMatrix = ref('0');
  const selectedData = computed(() => {
    return matrixData.value.find((item) => item.key === selectedMatrix.value)?.data;
  });
  const options = computed(() => {
    return matrixData.value.map((item) => ({ label: item.name, value: item.key }));
  });

  onMounted(() => {
    selectedMatrix.value = matrixData.value[0]?.key;
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
    max-width: 630px;
    display: flex;
    justify-content: space-between;
    .n-select {
      flex: 1;
      margin-right: 20px;
    }
  }
  .matrix-table-container {
    max-width: 630px;
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
    max-width: 600px;
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
