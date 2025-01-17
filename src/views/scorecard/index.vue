<template>
  <div class="score-container">
    <n-card class="info mb-2" title="打分说明" v-if="pageSettings.showInfo">
      <n-p>
        尊敬的专家，您好。请您参考相关工程资料，根据您的认知与实际工作经验填写左侧表格，对不同指标类型之间进行比较，并依据其相对某一类型的重要性进行评分。其中，𝑖表示指标类型所在的行数，j表示列数，aij表示第i行指标类型相对于第j列指标类型的权重。打分分值采用3个标度，具体取值参考下表。
      </n-p>

      <n-p style="text-align: center"> 判断矩阵标度定义 </n-p>
      <n-table class="info-table" :single-line="false">
        <thead>
          <tr>
            <th>Aij标度</th>
            <th>含义</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0</td>
            <td>I没有J重要</td>
          </tr>
          <tr>
            <td>1</td>
            <td>I与J同等重要</td>
          </tr>
          <tr>
            <td>2</td>
            <td>I比J重要</td>
          </tr>
        </tbody>
      </n-table>
      <n-p>
        填写样例：某专家认为，对于隧道排水系统来说，人员因素的影响小于管理因素的影响，因此在人员因素这一行，对应管理因素这一列，依据附表1的标度定义填写0。如果管理因素对排水系统的影响程度大于环境因素对排水系统的影响程度，则在第二行管理因素对应环境因素的位置填写2，其余表格按照此类推。
      </n-p>
    </n-card>
    <n-card class="content" :title="pageSettings.titleName">
      <n-collapse>
        <n-collapse-item title="一级指标 打分表" name="1">
          <div class="table-container" v-for="table in level0Tables" :key="table.tableKey">
            <n-h4 prefix="bar">
              <n-text type="primary">
                {{ `${table.tableName}` }}
              </n-text>
            </n-h4>
            <n-data-table :columns="table.columns" :data="table.data" />
          </div>
        </n-collapse-item>
        <n-collapse-item title="二级指标 打分表" name="2">
          <n-collapse-item
            v-for="tableList in sortLevelTableByParent(level1Tables)"
            :title="`比较“${tableList.menuName}”的内部因素的重要程度`"
            :name="tableList.menuName"
          >
            <div class="table-container" v-for="table in tableList.children" :key="table.tableKey">
              <n-h4 prefix="bar">
                <n-text type="primary">
                  {{ `${table.tableName}` }}
                </n-text>
              </n-h4>
              <n-data-table :columns="table.columns" :data="table.data" />
            </div>
          </n-collapse-item>
        </n-collapse-item>
        <n-collapse-item title="三级指标 打分表" name="3">
          <n-collapse-item
            v-for="tableList in sortLevelTableByParent(level2Tables)"
            :title="`比较“${tableList.menuName}”的内部因素的重要程度`"
            :name="tableList.menuName"
          >
            <div class="table-container" v-for="table in tableList.children" :key="table.tableKey">
              <n-h4 prefix="bar">
                <n-text type="primary">
                  {{ table.tableName }}
                </n-text>
              </n-h4>
              <n-data-table :columns="table.columns" :data="table.data" />
            </div>
          </n-collapse-item>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<script setup>
  import { NInput } from 'naive-ui';
  import { computed, h, onActivated, onMounted, ref } from 'vue';

  import { useUserStore } from '@/store/modules/user';
  const userStore = useUserStore();
  const indicators = userStore.indicators;
  const level0Data = ref([]);
  const level1Data = ref([]);
  const level2Data = ref([]);

  const level0Tables = ref([]);
  const level1Tables = ref([]);
  const level2Tables = ref([]);

  const pageSettings = computed(() => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    return isAdmin
      ? { showInfo: isAdmin, titleName: '打分表管理' }
      : { showInfo: !isAdmin, titleName: '专家评分' };
  });

  const sortLevelTableByParent = computed(() => {
    return (list) => {
      return list.reduce((pre, cur) => {
        const found = pre.find((item) => item.menuName === cur.parentLabel);
        if (found) {
          found.children.push(cur);
        } else {
          pre.push({ menuName: cur.parentLabel, children: [cur] });
        }
        return pre;
      }, []);
    };
  });
  function sortTableByLevel(nodes, parentNode = null, currentLevel = -1) {
    const siblings = nodes.map((node) => node.label);
    nodes.forEach((node) => {
      if (node.level === currentLevel) {
        node.siblings = siblings;
        if (parentNode) {
          node.parentLabel = parentNode.label;
          node.parentKey = parentNode.key;
        }
        if (currentLevel === 0) {
          level0Data.value.push(node);
        } else if (currentLevel === 1) {
          level1Data.value.push(node);
        } else if (currentLevel === 2) {
          level2Data.value.push(node);
        }
      }
      if (node.children) {
        sortTableByLevel(node.children, node, currentLevel + 1);
      }
    });
  }

  function markTableIndex() {
    level0Data.value = level0Data.value.map((item, index) => ({ ...item, index: index + 1 }));
    level1Data.value = level1Data.value.map((item, index) => ({
      ...item,
      index: index + 1 + level0Data.value.length,
    }));
    level2Data.value = level2Data.value.map((item, index) => ({
      ...item,
      index: index + 1 + level0Data.value.length + level1Data.value.length,
    }));
  }

  const tables = ref([]);
  function createTableByLevel(dataList) {
    return dataList.reduce((pre, cur, index) => {
      const output = {
        tableName: '',
        tableKey: cur.key,
        parentLabel: cur.parentLabel,
        highlightIndex: 0,
        data: [],
        columns: [],
      };
      if (cur.level === 0) {
        output.tableName = `对${cur.label}重要性判断矩阵`;
      } else {
        output.tableName = `以“${cur.label}”为标准，比较“${cur.parentLabel}”的内部因素的重要程度`;
      }

      output.highlightIndex = cur.siblings.findIndex((label) => label === cur.label);
      output.data = getTableData(cur);
      output.columns = getColumns(cur, output.data);

      pre.push(output);
      return pre;
    }, []);
  }
  function initData() {
    sortTableByLevel(indicators);
    markTableIndex();
    level0Tables.value = createTableByLevel(level0Data.value);
    level1Tables.value = createTableByLevel(level1Data.value);
    level2Tables.value = createTableByLevel(level2Data.value);
  }

  onMounted(() => {
    initData();
  });

  function getTableData(node) {
    function getItemData(rowIndex) {
      return node.siblings.reduce((pre, cur) => {
        pre[cur] = scoreData[`${node.key}-${rowIndex}-${cur}`]
          ? Number(scoreData[`${node.key}-${rowIndex}-${cur}`])
          : null;
        return pre;
      }, {});
    }

    return node.siblings.map((item, index) => {
      const baseData = getItemData(index);
      baseData[item] = 1;
      baseData.root = item;
      return baseData;
    });
  }

  function getColumns(node, tableData) {
    const output = node.siblings.map((item) => ({
      title: item,
      key: item,
      className: node.label === item ? 'highlight' : '',
      render(row, index) {
        return row.root === item
          ? h('p', { style: { textAlign: 'center' } }, '1')
          : h(NInput, {
              type: 'number',
              min: 0,
              max: 2,
              value: scoreData[`${node.key}-${index}-${item}`],
              onUpdateValue(v) {
                tableData[index][item] = v;
                updateScoreFromSession(node.key, index, item, v);
              },
            });
      },
    }));
    output.unshift({
      title: '',
      key: 'root',
      align: 'center',
      render(row, index) {
        return row.root === node.label
          ? h('p', { style: { textAlign: 'center', color: 'red', fontWeight: 'bold' } }, row.root)
          : h('p', { style: { textAlign: 'center' } }, row.root);
      },
    });
    return output;
  }

  let scoreData = getScoreFromSession();
  function getScoreFromSession() {
    if (sessionStorage.getItem('score')) {
      return JSON.parse(sessionStorage.getItem('score'));
    } else {
      sessionStorage.setItem('score', JSON.stringify({}));
      return {};
    }
  }

  function updateScoreFromSession(tableKey, rowIndex, columnKey, value) {
    if (scoreData) {
      scoreData[`${tableKey}-${rowIndex}-${columnKey}`] = value;
      sessionStorage.setItem('score', JSON.stringify(scoreData));
    }
  }
</script>

<style lang="less" scoped>
  :deep(.info-table) {
    thead th {
      text-align: center;
    }
  }
  .score-container {
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
  }
  :deep(.content.n-card) {
    flex: 1;
  }
  .table-container {
    margin-bottom: 30px;
  }
  :deep(.n-data-table-th.highlight) {
    color: red !important;
    font-weight: bold;
  }
  td {
    text-align: center;
  }
</style>
