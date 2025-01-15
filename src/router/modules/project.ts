import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BookOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/project',
    name: 'Project',
    redirect: '/project/index',
    component: Layout,
    meta: {
      title: '工程项目信息',
      icon: renderIcon(BookOutline),
      sort: 2,
    },
    children: [
      {
        path: 'index',
        name: 'project_index',
        meta: {
          title: '工程项目信息',
        },
        component: () => import('@/views/project/index.vue'),
      },
    ],
  },
];

export default routes;
