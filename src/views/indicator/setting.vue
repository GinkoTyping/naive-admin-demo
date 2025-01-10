<template>
  <div class="indicator-container">
    <n-card class="tree-container" title="指标设置">
      <n-tree
        block-line
        :data="defaultData"
        :default-expanded-keys="['root']"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        expand-on-click
      />
    </n-card>
    <n-card class="model-container" title="指标模型">
      <div id="chartRef" style="width: 100%; height: 100%"></div>
    </n-card>
  </div>
  <n-modal
    v-model:show="showDialog"
    :title="dialogTitle"
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
  import { NIcon, NButton, NTag, useMessage } from 'naive-ui';
  import { CreateOutline, TrashOutline, AddOutline } from '@vicons/ionicons5';
  import { defineComponent, h, ref, computed, onMounted } from 'vue';
  import { useDebounceFn, tryOnUnmounted } from '@vueuse/core';
  import { TreeChart } from 'echarts/charts';

  import echarts from '@/utils/lib/echarts';
  import { useEventListener } from '@/hooks/event/useEventListener';

  const defaultData = ref([
    {
      label: '季冻区隧道排水系统完好度评估指标体系',
      key: 'root',
      level: -1,
      children: [
        {
          label: '人员因素',
          key: '人员因素',
          level: 0,
          children: [
            {
              label: '外部人员',
              key: '人员因素-外部人员',
              level: 1,
              children: [{ label: '蓄意破坏', key: '人员因素-外部人员-蓄意破坏', level: 2 }],
            },
            {
              label: '运维人员',
              key: '人员因素-运维人员',
              level: 1,
              children: [
                { label: '专业水平', key: '人员因素-运维人员-专业水平', level: 2 },
                { label: '安全意识', key: '人员因素-运维人员-安全意识', level: 2 },
                { label: '工作年限', key: '人员因素-运维人员-工作年限', level: 2 },
                { label: '责任意识', key: '人员因素-运维人员-责任意识', level: 2 },
                { label: '教育水平', key: '人员因素-运维人员-教育水平', level: 2 },
                { label: '培训状况', key: '人员因素-运维人员-培训状况', level: 2 },
              ],
            },
          ],
        },
        {
          label: '管理因素',
          key: '管理因素',
          level: 0,
          children: [
            { label: '管道数据完整度', key: '管理因素-管道数据完整度', level: 1 },
            { label: '历史事故次数', key: '管理因素-历史事故次数', level: 1 },
            { label: '维护管理水平', key: '管理因素-维护管理水平', level: 1 },
            { label: '操作规程', key: '管理因素-操作规程', level: 1 },
            { label: '应急预案', key: '管理因素-应急预案', level: 1 },
          ],
        },
        {
          label: '管道因素',
          key: '管道因素',
          level: 0,
          children: [
            {
              label: '管道本体',
              key: '管道因素-管道本体',
              level: 1,
              children: [
                { label: '管道直径', key: '管道因素-管道本体-管道直径', level: 2 },
                { label: '运行时间', key: '管道因素-管道本体-运行时间', level: 2 },
                { label: '管道材质', key: '管道因素-管道本体-管道材质', level: 2 },
                { label: '管道长度', key: '管道因素-管道本体-管道长度', level: 2 },
                { label: '管道埋深', key: '管道因素-管道本体-管道埋深', level: 2 },
                { label: '管道壁厚', key: '管道因素-管道本体-管道壁厚', level: 2 },
                { label: '检查井密度', key: '管道因素-管道本体-检查井密度', level: 2 },
              ],
            },
            {
              label: '施工缺陷',
              key: '管道因素-施工缺陷',
              level: 1,
              children: [
                { label: '管道施工质量', key: '管道因素-管道本体-管道施工质量', level: 2 },
                { label: '接头处施工质量', key: '管道因素-管道本体-接头处施工质量', level: 2 },
              ],
            },
            {
              label: '保护措施',
              key: '管道因素-保护措施',
              level: 1,
              children: [
                { label: '防腐措施', key: '管道因素-管道本体-防腐措施', level: 2 },
                { label: '防变形措施', key: '管道因素-管道本体-防变形措施', level: 2 },
              ],
            },
          ],
        },
        {
          label: '缺陷因素',
          key: '缺陷因素',
          level: 0,
          children: [
            { label: '裂缝', key: '管理因素-裂缝', level: 1 },
            { label: '错口', key: '管理因素-错口', level: 1 },
            { label: '腐蚀', key: '管理因素-腐蚀', level: 1 },
            { label: '破损', key: '管理因素-破损', level: 1 },
            { label: '侵入', key: '管理因素-侵入', level: 1 },
            { label: '积冰', key: '管理因素-积冰', level: 1 },
            { label: '障碍物', key: '管理因素-障碍物', level: 1 },
            { label: '沉淀物', key: '管理因素-沉淀物', level: 1 },
          ],
        },
        {
          label: '环境因素',
          key: '环境因素',
          level: 0,
          children: [
            {
              label: '腐蚀',
              key: '环境因素-腐蚀',
              level: 1,
              children: [
                { label: '水中的硫酸盐含量', key: '环境因素-腐蚀-水中的硫酸盐含量', level: 2 },
                { label: '水中的碳酸根含量', key: '环境因素-腐蚀-水中的碳酸根含量', level: 2 },
                { label: '水的PH值', key: '环境因素-腐蚀-水的PH值', level: 2 },
                { label: '水的流速', key: '环境因素-腐蚀-水的流速', level: 2 },
                { label: '过水断面面积', key: '环境因素-腐蚀-过水断面面积', level: 2 },
              ],
            },
            {
              label: '地质影响',
              key: '环境因素-地质影响',
              level: 1,
              children: [
                { label: '管道上方荷载', key: '环境因素-地质影响-管道上方荷载', level: 2 },
                { label: '封冻期时长', key: '环境因素-地质影响-封冻期时长', level: 2 },
              ],
            },
            {
              label: '不可抗力',
              key: '环境因素-不可抗力',
              level: 1,
              children: [
                { label: '地震烈度区划', key: '环境因素-不可抗力-地震烈度区划', level: 2 },
                { label: '强降雨概率', key: '环境因素-不可抗力-强降雨概率', level: 2 },
              ],
            },
          ],
        },
      ],
    },
  ]);

  function renderPrefix(param) {
    if (param.option.level === 0) {
      return h(NButton, { text: true, type: 'primary' }, { default: () => 'I级' });
    }
    if (param.option.level === 1) {
      return h(NButton, { text: true, type: 'primary' }, { default: () => 'II级' });
    }
    if (param.option.level === 2) {
      return h(NButton, { text: true, type: 'primary' }, { default: () => 'III级' });
    }
  }

  function renderSuffix(param) {
    const buttons = [
      h(
        NIcon,
        {
          title: '编辑',
          onClick: (e) => {
            e.stopPropagation();
            dialogTitle.value = '编辑信息';
            formMode.value = 'edit';
            formData.value.key = param.option.key;
            formData.value.label = param.option.label;
            showDialog.value = true;
          },
        },
        { default: () => h(CreateOutline) }
      ),
    ];
    if (param.option.level !== 2) {
      let createText;
      if (param.option.level === -1) {
        createText = '创建一级指标';
      } else if (param.option.level === 0) {
        createText = '创建二级指标';
      } else {
        createText = '创建三级指标';
      }
      buttons.unshift(
        h(
          NIcon,
          {
            title: createText,
            onClick: (e) => {
              e.stopPropagation();
              formMode.value = 'create';
              dialogTitle.value = createText;
              formData.value.key = param.option.key;
              formData.value.label = '';
              showDialog.value = true;
            },
          },
          {
            default: () => h(AddOutline),
          }
        )
      );
    }
    if (param.option.level !== -1) {
      buttons.push(h(NIcon, { title: '删除' }, { default: () => h(TrashOutline) }));
    }
    return h('div', { style: { display: 'flex', gap: '8px' } }, buttons);
  }

  echarts.use([TreeChart]);
  let chartInstance;

  let chartData = [];

  function updateChartData() {
    function mapName(itemData) {
      if (itemData.level <= 0) {
        return itemData.label;
      }
      let output = '';
      for (let i = 0; i < itemData.label.length; i++) {
        output += itemData.label[i] + '\n';
      }
      return output;
    }

    function mapChart(itemData) {
      return {
        ...itemData,
        name: mapName(itemData),
        children: itemData.children?.map((child) => mapChart(child)) ?? [],
      };
    }
    chartData = defaultData.value.map((item) => mapChart(item));

    chartInstance.setOption({
      series: [
        {
          type: 'tree',
          data: chartData,
          initialTreeDepth: 4,
          left: '2%',
          right: '2%',
          top: '2%',
          bottom: '18%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          edgeShape: 'polyline',
          label: {
            position: 'bottom',
            rotate: 0,
            verticalAlign: 'top',
            align: 'center',
            fontSize: 14,
          },
          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'top',
              align: 'center',
              fontSize: 14,
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    });
  }

  let resizeFn = resize;
  resizeFn = useDebounceFn(resize, 200);
  function resize() {
    chartInstance?.resize();
  }
  const { removeEvent } = useEventListener({
    el: window,
    name: 'resize',
    listener: resizeFn,
  });
  let removeResizeFn = removeEvent;

  onMounted(() => {
    chartInstance = echarts.init(document.querySelector('#chartRef'));
    updateChartData();
  });

  function disposeInstance() {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  }
  tryOnUnmounted(disposeInstance);

  //#region 弹出层
  const showDialog = ref(false);
  const formData = ref({
    label: '',
    key: '',
  });
  const formRef = ref(null);
  const dialogTitle = ref('');
  const rules = {
    label: { required: true, message: '请填写名称' },
  };
  const formMode = ref('');

  const handleSubmit = () => {
    formRef.value.validate((error) => {
      if (error) {
        console.log('表单验证失败');
        showDialog.value = true;
      } else {
        console.log('表单数据:', formData.value);
        updateInsertLableByKey(formData.value.label, formData.value.key, formMode.value);
        showDialog.value = false;
      }
    });
  };

  const handleClose = () => {
    showDialog.value = false;
    formData.value.key = '';
    formData.value.label = '';
  };

  function updateInsertLableByKey(label, key, mode) {
    if (label) {
      let foundNode;
      function findByKey(list) {
        if (list?.length) {
          return list.find((listItem) => {
            if (listItem.key === key) {
              foundNode = listItem;
              return true;
            }
            return findByKey(listItem.children);
          });
        }
        return false;
      }
      findByKey(defaultData.value);
      if (mode === 'edit') {
        foundNode.label = label;
      } else {
        if (!foundNode.children?.length) {
          foundNode.children = [];
        }
        foundNode.children.push({
          label,
          key: label + '_' + Date.now(),
          level: foundNode.level + 1,
        });
      }

      updateChartData();
    } else {
      throw new Error('名称不能为空');
    }
  }
  //#endregion
</script>

<style lang="less" scoped>
  :deep(.n-tree) {
    height: 100%;
    overflow-y: auto;
  }
  .indicator-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 120px);
  }
  :deep(.tree-container) {
    min-width: 300px;
    max-width: 500px;
    width: 30%;
    height: 100%;
    margin-right: 20px;
    .n-card__content {
      max-height: calc(100% - 70px) !important;
      .n-icon:hover {
        color: #2d8cf0;
      }
    }
  }
  .model-container {
    flex: 1;
    height: 100%;
  }
</style>
