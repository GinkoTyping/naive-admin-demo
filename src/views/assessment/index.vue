<template>
  <div class="assessment-container">
    <n-card title="安全评估">
      <n-steps :current="current as number" :status="currentStatus">
        <n-step title="选择工程" />
        <n-step title="上传打分表" />
        <n-step title="计算风险权重系数" />
        <n-step title="模糊综合评价计算" />
        <n-step title="评价结果" />
      </n-steps>
      <div class="step-container" v-show="current === 3">
        <n-h4 prefix="bar" class="mt-10">
          <n-text type="primary"> 风险计算权重系数结果 </n-text>
        </n-h4>
        <n-collapse>
          <n-collapse-item
            :title="item.name"
            :name="index"
            v-for="(item, index) in resultData"
            :key="index"
          >
            <n-table>
              <thead>
                <tr>
                  <th v-for="column in resultColumns" :key="column" style="width: 16.6%">{{
                    column
                  }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(itemData, index) in item.data" :key="index">
                  <td v-for="item in itemData" :key="item">{{ item }}</td>
                </tr>
              </tbody>
            </n-table>
          </n-collapse-item>
        </n-collapse>
      </div>
      <div class="step-container" v-show="current === 4">
        <n-h4 prefix="bar" class="mt-10">
          <n-text type="primary"> 模糊综合评价 </n-text>
        </n-h4>
        <n-collapse>
          <n-collapse-item
            :title="item.name"
            :name="index"
            v-for="(item, index) in tablesData"
            :key="index"
          >
            <n-table>
              <thead>
                <tr>
                  <th v-for="column in columns" :key="column" style="width: 13.5%">{{ column }}</th>
                  <th>评分</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(itemData, index) in item.data" :key="index">
                  <td v-for="item in itemData" :key="item">{{ item }}</td>
                  <td>
                    <n-input-number
                      :min="0"
                      :max="5"
                      v-model:value="item.values[index]"
                    ></n-input-number>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-collapse-item>
        </n-collapse>
      </div>
      <div class="step-container" v-show="current === 5">
        <n-h4 prefix="bar" class="mt-10">
          <n-text type="primary"> 结果 </n-text>
        </n-h4>
        <n-p class="result" style="font-size: 28px;">
          <p>经过模糊综合评价 该管道</p>
          <br />
          <p>人员因素风险度为: <span>III级风险</span></p>
          <p>管理因素风险度为: <span>III级风险</span></p>
          <p>管道因素风险度为: <span>III级风险</span></p>
          <p>缺陷因素凤险度为: <span>IV级风险</span></p>
          <p>环境因素风险度为: <span>III级风险</span></p>
          <br />
          <p>综上各因素 该管道总体风险度为: <span>III级风险</span></p>
        </n-p>
      </div>
      <div class="flex mt-4">
        <n-button
          secondary
          type="primary"
          class="mr-2"
          v-show="current && current > 3"
          @click="currentRef && currentRef--"
        >
          上一步
        </n-button>
        <n-button type="primary" v-show="current !== 5" @click="goNext"> 下一步 </n-button>
        <n-button type="primary" v-show="current === 5"> 导出报告 </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import type { StepsProps } from 'naive-ui';
  import { ref } from 'vue';

  const currentRef = ref<number | null>(3);
  const current = currentRef;
  const currentStatus = ref<StepsProps['status']>('process');
  const resultColumns = ['影响因素', '权重  wsu'];
  const columns = ['等级', '1', '2', '3', '4', '5'];
  const resultData = ref([
    {
      name: '人员因素',
      data: [
        ['人员因素', 0.2394],
        ['专业水平', 0.0476],
        ['安全意识', 0.1453],
        ['工作年限', 0.1958],
        ['责任意识', 0.2015],
        ['教育水平', 0.2387],
        ['培训状况', 0.1255],
        ['外部破坏', 0.0456],
      ],
    },
    {
      name: '管理因素',
      data: [
        ['管理因素', 0.2377],
        ['管道数据完整度', 0.2553],
        ['历史事故次数', 0.1801],
        ['维护管理水平', 0.2782],
        ['操作规程', 0.1808],
        ['应急预案', 0.1056],
      ],
    },
    {
      name: '管道因素',
      data: [
        ['管道因素', 0.1742],
        ['管道直径', 0.0628],
        ['运行时间', 0.0674],
        ['管道材质', 0.0733],
        ['管道长度', 0.0563],
        ['管道埋深', 0.0466],
        ['管道壁厚', 0.0627],
        ['检查井密度', 0.0594],
        ['管道施工质量', 0.0807],
        ['接头处施工质量', 0.1194],
        ['防腐措施', 0.1693],
        ['防变形措施', 0.2021],
      ],
    },
    {
      name: '缺陷因素',
      data: [
        ['缺陷因素', 0.2019],
        ['裂缝', 0.194],
        ['错口', 0.0897],
        ['腐蚀', 0.1775],
        ['破损', 0.1198],
        ['侵入', 0.1455],
        ['积冰', 0.0824],
        ['障碍物', 0.1299],
        ['沉积物', 0.0612],
      ],
    },
    {
      name: '环境因素',
      data: [
        ['环境因素', 0.1738],
        ['水中硫酸根含量', 0.0574],
        ['水中碳酸根含量', 0.0574],
        ['水的PH值', 0.0569],
        ['水的流速', 0.0508],
        ['过水断面面积', 0.0703],
        ['管道上方荷载', 0.1418],
        ['封冻期时长', 0.3216],
        ['地震烈度区划', 0.1168],
        ['强降雨概率', 0.1271],
      ],
    },
  ]);
  const tablesData = ref([
    {
      name: '人员因素的分类标准',
      value: undefined,
      data: [
        ['人为破坏', '没有破坏', '1次/年', '2次/年', '1次/月', '1次/周'],
        [
          '专业水平',
          '长期从事相关工作并且获奖',
          '长期从事相关工作',
          '有一定操作经验',
          '刚开始学习',
          '没有经验',
        ],
        ['安全意识', '非常好', '尚可', '普通', '缺乏', '无'],
        ['工作年限', '≥10', '[5,10)', '[3,5)', '[1,3)', '<1'],
        ['责任意识', '非常好', '尚可', '普通', '缺乏', '无'],
      ],
      values: [3, 3, 3, 3, 3],
    },
    {
      name: '管理因素的分类标准',
      value: undefined,
      data: [
        ['管道数据完整度', '完备', '基本完备', '缺失部分信息', '缺失大部分信息', '没有'],
        [
          '历史事故次数',
          '没有事故',
          '上一次事故3年之前',
          '2-3年内发生过1起事故',
          '每年发生1起事故',
          '有许多历史事故',
        ],
        [
          '管道维护水平',
          '每季度巡检1次',
          '每半年巡检1次',
          '每年巡检1次',
          '每三年巡检1次',
          '从未巡检',
        ],
        ['操作规程', '详细', '相对详细', '不够详细', '不详细', '无规程'],
        ['应急预案', '详细', '相对详细', '不够详细', '不详细', '没有'],
        ['管道数据完整度', '完备', '基本完备', '缺失部分信息', '缺失大部分信息', '没有'],
      ],
      values: [3, 3, 3, 3, 3, 3],
    },
    {
      name: '管道因素的分类标准',
      value: undefined,
      data: [
        ['管道直径', '≥DN900', '[DN700,DN900)', '[DN500,DN700)', '[DN300,DN500)', 'DN900＜'],
        ['运行时间(年)', '<3', '[3,5)', '[5,8)', '[8,10)', '>10'],
        ['管道长(m)', '<100', '[100,150)', '[150,300)', '[300,500)', '>500'],
        ['检查井间距(m)', '150m', '200m', '250m', '300m', '未设置'],
        ['管道埋深(m)', '≥2.5', '[2,2.5)', '[1,2)', '[0.5,1)', '<0.5'],
        ['管道壁厚(mm)', '≥45', '[35,45)', '[25,35)', '[15,25)', '[5,15)'],
        ['管道材质', 'PE', 'PVC', '铸铁', '钢筋混凝土', '素混凝土'],
        [
          '施工质量',
          '与设计坡度相符',
          '设计坡度的90%',
          '设计坡度的80%',
          '设计坡度的70%',
          '设计坡度的60%',
        ],
        [
          '接口施工质量',
          '未见明显接缝',
          '可见较小接缝',
          '接口处可见较宽接缝',
          '接缝明显',
          '接口处错口',
        ],
        ['防腐措施', '完全合格', '基本合格', '存在一些不合格', '大部分不合格', '无防腐措施'],
        ['防变形措施', '完全合格', '基本合格', '存在一些不合格', '大部分不合格', '无防变形措施'],
      ],
      values: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    },
    {
      name: '缺陷因素的分类标准',
      value: undefined,
      data: [
        [
          '裂缝',
          '未见明显',
          '在管壁上可见细微裂痕',
          '破裂处已成明显间隙',
          '管壁碎裂',
          '管壁多处坍塌',
        ],
        [
          '错口',
          '未见明显错口',
          '管口偏差不大于管壁厚度的1/2',
          '管口偏差为管壁厚度的1/2~1之间',
          '管口偏差为管壁厚度的1~2倍',
          '管口偏差为管壁厚度的2倍以上',
        ],
        [
          '腐蚀',
          '未见明显腐蚀情况',
          '内壁轻微剥落',
          '内壁明显剥落，漏出粗骨料',
          '内壁严重剥落，漏出钢筋',
          '粗骨料或钢筋完全显露',
        ],
        [
          '破损',
          '未见明显破损情况',
          '内壁可见少许菱状缺口，面积小于管道直径的10%',
          '内壁可见一些缺口，粗骨料显露，面积在于管道直径的10%~20%',
          '内壁多处缺口，粗骨料暴露，面积在于管道直径的20%~30%',
          '管道严重破损，漏出钢筋',
        ],
        [
          '侵入',
          '未见明显侵入物',
          '异物在管道内占用面积不大于10%',
          '异物在管道内占用面积在10%~20%',
          '异物在管道内占用面积在20%~30%',
          '异物在管道内占用面积大于30%',
        ],
        [
          '积冰',
          '未见积冰',
          '积冰厚度占过水面积小于10%',
          '积冰厚度占过水面积的10%~20%',
          '积冰厚度占过水面积的20%~30%',
          '积冰厚度占过水面积大于30%',
        ],
        [
          '堆积物',
          '未见明显堆积物',
          '堆积物厚度为管径的20%~30%',
          '堆积物厚度为管径的30%~40%',
          '堆积物厚度为管径的40%~50%',
          '堆积物厚度大于管径的50%',
        ],
        [
          '障碍物',
          '未见明显障碍物',
          '过水面积损失小于15%',
          '过水面积损失在15%~25%',
          '过水面积损失在25%~50%',
          '过水面积损失在50%以上',
        ],
      ],
      values: [3, 3, 3, 3, 3, 3, 3, 3],
    },
    {
      name: '环境因素的分类标准',
      value: undefined,
      data: [
        ['水中硫酸根含量(mg/L)', '<200', '[200,1000)', '[1000,4000)', '[4000,10000)', '>10000'],
        ['水中碳酸根含量(mg/L)', '<15', '[15,30)', '[30,60)', '[60,100)', '>100'],
        ['水的PH值', '>6.5', '[6,6.5)', '[5,6)', '[4.5,5)', '<4.5'],
        ['水的流速(m/s)', '<0.1', '[0.1,0.3)', '[0.3,0.5)', '[0.5,0.8)', '>0.8'],
        ['管道上方荷载', '没有荷载', '较低荷载', '中等荷载', '较大荷载', '极大荷载'],
        ['封冻期时长(天)', '<10', '[10,30)', '[30,60)', '[60,120)', '>120'],
        [
          '地震区划',
          '不在地震断层带内，采取了一些防震措施',
          '位于地震断层带，采取了高标准防震措施',
          '位于地震断层带，防震措施能够抵御基础设防烈度',
          '位于地震断层带，防震措施通常无法抵御基础设防烈度',
          '位于地震断层带，未采取任何防震措施',
        ],
        ['强降雨概率', '<10%', '[10%,20%)', '[20%,50%)', '[50%,80%)', '>80%'],
      ],
      values: [3, 3, 3, 3, 3, 3, 3, 3],
    },
  ]);

  function goNext() {
    if (currentRef.value) {
      currentRef.value++;
    }
  }
</script>
<style lang="less" scoped>
  :deep(.n-steps) {
    .n-step--finish-status .n-step-indicator {
      background-color: #2d8cf0;
      .n-base-icon {
        color: #fff;
      }
    }
  }
  .assessment-container {
    display: flex;
    flex-direction: column;
  }
  :deep(.n-card) {
    height: 100%;
  }
  tr {
    text-align: center;
  }
  .result span {
    color: #2d8cf0;
    text-decoration: underline;
    font-weight: bold;
  }
</style>
