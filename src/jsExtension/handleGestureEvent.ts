import { defineGestureHandlers, initGesture } from "marginnote"
import { PanelControl } from "~/modules/addon/typings"
import { closePanel } from "./switchPanel"

// Not support Mac
// Cannot access self unless use function
export const gestureHandlers = () =>
  gestureHandlerController([
    {
      view: self.settingViewController.tableView!,
      gesture: initGesture.tap(1, 2, "DoubleClickOnTableView")
    }
  ])

function gestureHandlerController(
  handlerList: {
    view: UIView
    gesture: UIGestureRecognizer
  }[]
): {
  add: () => void
  remove: () => void
} {
  const add = () => {
    handlerList.forEach(v => {
      v.view.addGestureRecognizer(v.gesture)
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      v.view.removeGestureRecognizer(v.gesture)
    })
  }
  return { add, remove }
}

export default defineGestureHandlers({
  onDoubleClickOnTableView() {
    const { panelControl } = self.globalProfile.addon
    if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
  }
})
