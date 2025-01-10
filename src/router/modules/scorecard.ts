import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { NewspaperOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/scorecard',
    name: 'Scorecard',
    redirect: '/scorecard/preview-card',
    component: Layout,
    meta: {
      title: '打分表管理',
      icon: renderIcon(NewspaperOutline),
      sort: 3,
    },
    children: [
      {
        path: 'preview-card',
        name: 'preview-card',
        meta: {
          title: '打分表管理',
        },
        component: () => import('@/views/scorecard/index.vue'),
      },
    ],
  },
];

export default routes;
