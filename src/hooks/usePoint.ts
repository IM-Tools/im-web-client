export default function () {
  function getPoint(e: any) {
    let x = 0, y= 0
    if(e.pageX + 300 > window.innerWidth){
      x = e.pageX - 300
    } else{
      x = e.pageX
    }
    if(e.pageY + 180 > window.innerHeight){
      y = e.pageX - 180
    } else{
      y = e.pageY
    }
    const point = {
      x: x + 'px',
      y: y + 'px'
    }
    return point
  }
  return {
    getPoint
  }

}
