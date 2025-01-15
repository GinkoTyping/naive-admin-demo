import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CompassOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/assessment',
    name: 'Assessment',
    redirect: '/assessment/assessment_index',
    component: Layout,
    meta: {
      icon: renderIcon(CompassOutline),
      sort: 6,
    },
    children: [
      {
        path: 'index',
        name: 'assessment_index',
        meta: {
          title: '安全评估',
        },
        component: () => import('@/views/assessment/index.vue'),
      },
    ],
  },
];

export default routes;
