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
      sort: 3,
      hidden: () => sessionStorage.getItem('isAdmin') !== 'true'
    },
    children: [
      {
        path: 'indicator-setting',
        name: 'indicator-setting',
        meta: {
          title: '指标管理',
        },
        component: () => import('@/views/indicator/setting.vue'),
      },
    ],
  },
];

export default routes;
