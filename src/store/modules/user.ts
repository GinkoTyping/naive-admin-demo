import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  username: string;
  email: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
  indicators: any[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
    indicators: [
      {
        label: '季冻区隧道排水系统完好度评估指标体系',
        key: 'root',
        level: -1,
        children: [
          {
            label: '人员因素',
            key: '人员因素',
            level: 0,
            children: [
              {
                label: '运维人员',
                key: '人员因素-运维人员',
                level: 1,
                children: [
                  { label: '专业水平', key: '人员因素-运维人员-专业水平', level: 2 },
                  { label: '安全意识', key: '人员因素-运维人员-安全意识', level: 2 },
                  { label: '工作年限', key: '人员因素-运维人员-工作年限', level: 2 },
                  { label: '责任意识', key: '人员因素-运维人员-责任意识', level: 2 },
                  { label: '教育水平', key: '人员因素-运维人员-教育水平', level: 2 },
                  { label: '培训状况', key: '人员因素-运维人员-培训状况', level: 2 },
                ],
              },
              {
                label: '外部人员',
                key: '人员因素-外部人员',
                level: 1,
                children: [{ label: '蓄意破坏', key: '人员因素-外部人员-蓄意破坏', level: 2 }],
              },
            ],
          },
          {
            label: '管理因素',
            key: '管理因素',
            level: 0,
            children: [
              { label: '管道数据完整度', key: '管理因素-管道数据完整度', level: 1 },
              { label: '历史事故次数', key: '管理因素-历史事故次数', level: 1 },
              { label: '维护管理水平', key: '管理因素-维护管理水平', level: 1 },
              { label: '操作规程', key: '管理因素-操作规程', level: 1 },
              { label: '应急预案', key: '管理因素-应急预案', level: 1 },
            ],
          },
          {
            label: '管道因素',
            key: '管道因素',
            level: 0,
            children: [
              {
                label: '管道本体',
                key: '管道因素-管道本体',
                level: 1,
                children: [
                  { label: '管道直径', key: '管道因素-管道本体-管道直径', level: 2 },
                  { label: '运行时间', key: '管道因素-管道本体-运行时间', level: 2 },
                  { label: '管道材质', key: '管道因素-管道本体-管道材质', level: 2 },
                  { label: '管道长度', key: '管道因素-管道本体-管道长度', level: 2 },
                  { label: '管道埋深', key: '管道因素-管道本体-管道埋深', level: 2 },
                  { label: '管道壁厚', key: '管道因素-管道本体-管道壁厚', level: 2 },
                  { label: '检查井密度', key: '管道因素-管道本体-检查井密度', level: 2 },
                ],
              },
              {
                label: '施工缺陷',
                key: '管道因素-施工缺陷',
                level: 1,
                children: [
                  { label: '管道施工质量', key: '管道因素-管道本体-管道施工质量', level: 2 },
                  { label: '接头处施工质量', key: '管道因素-管道本体-接头处施工质量', level: 2 },
                ],
              },
              {
                label: '保护措施',
                key: '管道因素-保护措施',
                level: 1,
                children: [
                  { label: '防腐措施', key: '管道因素-管道本体-防腐措施', level: 2 },
                  { label: '防变形措施', key: '管道因素-管道本体-防变形措施', level: 2 },
                ],
              },
            ],
          },
          {
            label: '缺陷因素',
            key: '缺陷因素',
            level: 0,
            children: [
              { label: '裂缝', key: '管理因素-裂缝', level: 1 },
              { label: '错口', key: '管理因素-错口', level: 1 },
              { label: '腐蚀', key: '管理因素-腐蚀', level: 1 },
              { label: '破损', key: '管理因素-破损', level: 1 },
              { label: '侵入', key: '管理因素-侵入', level: 1 },
              { label: '积冰', key: '管理因素-积冰', level: 1 },
              { label: '障碍物', key: '管理因素-障碍物', level: 1 },
              { label: '沉淀物', key: '管理因素-沉淀物', level: 1 },
            ],
          },
          {
            label: '环境因素',
            key: '环境因素',
            level: 0,
            children: [
              {
                label: '腐蚀',
                key: '环境因素-腐蚀',
                level: 1,
                children: [
                  { label: '水中的硫酸盐含量', key: '环境因素-腐蚀-水中的硫酸盐含量', level: 2 },
                  { label: '水中的碳酸根含量', key: '环境因素-腐蚀-水中的碳酸根含量', level: 2 },
                  { label: '水的PH值', key: '环境因素-腐蚀-水的PH值', level: 2 },
                  { label: '水的流速', key: '环境因素-腐蚀-水的流速', level: 2 },
                  { label: '过水断面面积', key: '环境因素-腐蚀-过水断面面积', level: 2 },
                ],
              },
              {
                label: '地质影响',
                key: '环境因素-地质影响',
                level: 1,
                children: [
                  { label: '管道上方荷载', key: '环境因素-地质影响-管道上方荷载', level: 2 },
                  { label: '封冻期时长', key: '环境因素-地质影响-封冻期时长', level: 2 },
                ],
              },
              {
                label: '不可抗力',
                key: '环境因素-不可抗力',
                level: 1,
                children: [
                  { label: '地震烈度区划', key: '环境因素-不可抗力-地震烈度区划', level: 2 },
                  { label: '强降雨概率', key: '环境因素-不可抗力-强降雨概率', level: 2 },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { result, code } = response;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, result.token, ex);
        storage.set(CURRENT_USER, result, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(result.token);
        this.setUserInfo(result);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const data = await getUserInfoApi();
      const { result } = data;
      if (result.permissions && result.permissions.length) {
        const permissionsList = result.permissions;
        this.setPermissions(permissionsList);
        this.setUserInfo(result);
      } else {
        throw new Error('getInfo: permissionsList must be a non-null array !');
      }
      this.setAvatar(result.avatar);
      return result;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
