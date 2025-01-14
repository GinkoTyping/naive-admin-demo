import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ScanOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/matrix',
    name: 'Matrix',
    redirect: '/matrix/matrix-setting',
    component: Layout,
    meta: {
      title: '矩阵管理',
      icon: renderIcon(ScanOutline),
      sort: 5,
      hidden: () => sessionStorage.getItem('isAdmin') !== 'true'
    },
    children: [
      {
        path: 'matrix-setting',
        name: 'matrix-setting',
        meta: {
          title: '矩阵管理',
        },
        component: () => import('@/views/matrix/index.vue'),
      },
    ],
  },
];

export default routes;
