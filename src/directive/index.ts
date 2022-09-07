
import { CustomMenuBox } from './customMenu/index'
let instance: any = null
export const customMenu = (app: any) => {
  app.directive('customMenu', {
    // 当被绑定的元素插入到 DOM 中时……
    mounted(el: any, binding: any) {
      console.log('binding',binding);
      // 取消默认的浏览器自带右键菜单
      window.oncontextmenu = function (e) {
        e.preventDefault()
      }
      el.oncontextmenu = function (e: any) {
        // 防止重复显示
        if (instance) {
          document.body.removeChild(instance.parent)
          instance.instance.unmount()
          instance = null
        }
        const positionX = e.pageX
        const positionY = e.pageY
        // 判断显示置顶，还是取消置顶
        // if(binding.value.val.top_status === 0){
        //   binding.value.menuLists[0].name = '置顶'
        // } else{
        //   binding.value.menuLists[0].name = '取消置顶'
        // }
        instance = CustomMenuBox({
          show: true,
          position: { positionX, positionY },
          menuList: binding.value.menuLists,
          val: binding.value.val
        })
      }
    }
  })
}
