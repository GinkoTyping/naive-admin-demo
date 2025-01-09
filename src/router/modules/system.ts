import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { HomeOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/menu',
    component: Layout,
    meta: {
      title: '主页',
      icon: renderIcon(HomeOutline),
      sort: 1,
    },
    children: [
      {
        path: 'menu',
        name: 'system_menu',
        meta: {
          title: '主页',
        },
        component: () => import('@/views/system/menu/menu.vue'),
      },
    ],
  },
];

export default routes;
