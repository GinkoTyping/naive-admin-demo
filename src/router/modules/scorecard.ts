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
      icon: renderIcon(NewspaperOutline),
      sort: 3,
      title: () => {
        return sessionStorage.getItem('isAdmin') === 'true' ? '打分表管理' : '专家评分';
      },
    },
    children: [
      {
        path: 'preview-card',
        name: 'preview-card',
        meta: {
          title: () => {
            return sessionStorage.getItem('isAdmin') === 'true' ? '打分表管理' : '专家评分';
          },
        },
        component: () => import('@/views/scorecard/index.vue'),
      },
    ],
  },
];

export default routes;
