export enum ThemeType {
  Light = 0,
  Dark = 1,
}

export interface SystemSettings {
  id?: string;
  userId: string;
  theme: ThemeType;
  boardBgType: 'template' | 'custom' | 'color';
  boardBgUrl?: string;
  boardBgColor?: string;
  boardBgName?: string;
}
