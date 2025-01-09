import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProfileOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/indicator',
    name: 'Indicator',
    redirect: '/indicator/indicator-setting',
    component: Layout,
    meta: {
      title: '指标管理',
      icon: renderIcon(ProfileOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'indicator-setting',
        name: 'indicator-setting',
        meta: {
          title: '指标设置',
        },
        component: () => import('@/views/indicator/setting.vue'),
      },
      {
        path: 'indicator-model',
        name: 'indicator-model',
        meta: {
          title: '指标模型',
        },
        component: () => import('@/views/form/stepForm/stepForm.vue'),
      }
    ],
  },
];

export default routes;
