import { mainStore } from '@/store';
export default function useTheme(){
  const store = mainStore()
  // 主题列表
  const themeList = store.themeList
  function changeThemeColor(theme: string){
    store.setTheme(theme)
  }
  return{
    themeList,
    changeThemeColor
  }
}