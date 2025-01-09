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
      sort: 4,
    },
    children: [
      {
        path: 'matrix-setting',
        name: 'matrix-setting',
        meta: {
          title: '矩阵管理',
        },
        component: () => import('@/views/form/basicForm/index.vue'),
      },
    ],
  },
];

export default routes;
