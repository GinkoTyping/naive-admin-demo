import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { HomeOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/home',
    component: Layout,
    meta: {
      title: '主页',
      icon: renderIcon(HomeOutline),
      sort: 1,
    },
    children: [
      {
        path: 'home',
        name: 'system_home',
        meta: {
          title: '主页',
        },
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
];

export default routes;
