<template>
  <div class="indicator-container">
    <n-card class="tree-container" title="指标设置">
      <n-tree
        block-line
        :data="indicators"
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
  import { NIcon, NButton, NTag, useDialog, useMessage } from 'naive-ui';
  import { CreateOutline, TrashOutline, AddOutline } from '@vicons/ionicons5';
  import { defineComponent, h, ref, computed, onMounted } from 'vue';
  import { useDebounceFn, tryOnUnmounted } from '@vueuse/core';
  import { TreeChart } from 'echarts/charts';

  import echarts from '@/utils/lib/echarts';
  import { useEventListener } from '@/hooks/event/useEventListener';
  import { useUserStore } from '@/store/modules/user';

  const dialog = useDialog();
  const message = useMessage();
  const userStore = useUserStore();
  const indicators = userStore.indicators;

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
      buttons.push(
        h(
          NIcon,
          {
            title: '删除',
            onClick: (e) => {
              e.stopPropagation();
              formMode.value = 'delete';
              formData.value.key = param.option.key;
              formData.value.label = '';

              dialog.warning({
                title: '删除指标',
                content: `确定删除指标： ${param.option.label}？`,
                positiveText: '确定',
                negativeText: '取消',
                draggable: true,
                onPositiveClick: () => {
                  modifyLableByKey(param.option.label, param.option.key, 'delete');
                  message.success('删除成功。');
                },
                onNegativeClick: () => {
                  message.error('删除操作取消。');
                },
              });
            },
          },
          { default: () => h(TrashOutline) }
        )
      );
    }
    return h('div', { style: { display: 'flex', gap: '8px' } }, buttons);
  }

  echarts.use([TreeChart]);
  let chartInstance;

  let chartData = [];

  function updateChartData() {
    updateGraphics = true;

    function mapName(itemData) {
      if (itemData.level <= 0) {
        return itemData.label;
      }
      let output = '';
      for (let i = 0; i < itemData.label.length; i++) {
        output += i === itemData.label.length - 1 ? itemData.label[i] : itemData.label[i] + '\n';
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
    chartData = indicators.map((item) => mapChart(item));

    chartInstance.setOption({
      series: [
        {
          type: 'tree',
          data: chartData,
          initialTreeDepth: 4,
          left: '2%',
          right: '2%',
          top: '2%',
          bottom: '22%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          edgeShape: 'polyline',
          symbolSize: 0,
          lineStyle: {
            width: 3, // 设置线条宽度为2像素
          },
          label: {
            normal: {
              formatter: function (params) {
                return params.data.level <= 0 ? `{hor|${params.name}}` : `{ver|${params.name}}`;
              },
              verticalAlign: 'top',
              color: '#1C75D2',
              borderColor: '#1C75D2',
              borderWidth: 2,
              rich: {
                hor: {
                  verticalAlign: 'center',
                  align: 'center',
                  fontSize: 16,
                  fontWeight: 'bolder',
                  padding: [6, 6, 6, 6],
                  borderColor: '#1C75D2',
                  borderWidth: 1,
                  backgroundColor: 'white',
                },
                ver: {
                  height: 10,
                  width: 10,
                  verticalAlign: 'top',
                  align: 'center',
                  fontSize: 14,
                  padding: 4,
                  backgroundColor: 'white',
                },
              },
            },

            // position: 'bottom',
            // rotate: 0,
            // verticalAlign: 'top',
            // align: 'center',
            // fontSize: 15,
            // padding: [7, 4, 7, 4],
          },
          // leaves: {
          //   label: {
          //     position: 'bottom',
          //     rotate: 0,
          //     verticalAlign: 'top',
          //     align: 'center',
          //     fontSize: 15,
          //   },
          // },
          animationDurationUpdate: 750,
        },
      ],
      graphic: [],
    });
  }

  function getBoxGraphics() {
    const graphic = [];
    const seriesModel = chartInstance.getModel().getSeriesByIndex(0);
    const dataIndices = seriesModel.getData().mapArray(function (idx) {
      return idx;
    });

    dataIndices.forEach(function (idx) {
      const data = seriesModel.getData().getItemModel(idx);
      const boundingRect = seriesModel.getData().getItemLayout(idx);

      let width = 70;
      if (data.option.level === -1) {
        width = 280;
      }

      if (boundingRect && data.option.level <= 0) {
        const labelRect = {
          shape: {
            x: boundingRect.x + 26 - width / 2, // 根据label位置调整
            y: boundingRect.y + 23, // 根据label位置调整
            width, // label宽度加padding
            height: 30, // label高度加padding
          },
          style: {
            fill: 'rgba(255, 255, 255, 0.7)', // 方框颜色及透明度
            stroke: '#000', // 方框边框颜色
            lineWidth: 1,
          },
          type: 'rect',
        };
        // 将方框添加到graphic组件中
        graphic.push(labelRect);
      }
    });
    return graphic;
  }

  let resizeFn = resize;
  resizeFn = useDebounceFn(resize, 200);
  function resize() {
    chartInstance?.resize();
    updateGraphics = true;
  }
  const { removeEvent } = useEventListener({
    el: window,
    name: 'resize',
    listener: resizeFn,
  });
  let removeResizeFn = removeEvent;
  let updateGraphics = false;
  onMounted(() => {
    chartInstance = echarts.init(document.querySelector('#chartRef'));

    // 绘制方块
    chartInstance.on('finished', function () {
      // if (updateGraphics) {
      //   chartInstance.setOption({ graphic: getBoxGraphics() });
      //   updateGraphics = false;
      // }
    });

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
        modifyLableByKey(formData.value.label, formData.value.key, formMode.value);

        sessionStorage.removeItem('score');

        showDialog.value = false;
        message.success('操作成功。');
      }
    });
  };

  const handleClose = () => {
    showDialog.value = false;
    formData.value.key = '';
    formData.value.label = '';
  };

  function modifyLableByKey(label, key, mode) {
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
      findByKey(indicators);
      if (mode === 'edit') {
        foundNode.label = label;
      } else if (mode === 'create') {
        if (!foundNode.children?.length) {
          foundNode.children = [];
        }
        foundNode.children.push({
          label,
          key: label + '_' + Date.now(),
          level: foundNode.level + 1,
        });
      } else {
        foundNode.toDelete = true;
        removeFromData();
      }

      updateChartData();
    } else {
      throw new Error('名称不能为空');
    }
  }

  function removeFromData() {
    let parentNode;
    let removeIndex;
    function findNull(list) {
      if (list?.length) {
        list.some((item, index) => {
          if (item.toDelete) {
            parentNode = list;
            removeIndex = index;
            return true;
          }
          return findNull(item.children);
        });
      }
      return false;
    }
    findNull(indicators);
    parentNode.splice(removeIndex, 1);
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
    width: 20%;
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
