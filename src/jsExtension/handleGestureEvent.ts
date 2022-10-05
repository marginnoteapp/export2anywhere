import { PanelControl } from "~/modules/addon/typings"
import { GestureHandler, UIView } from "~/typings"
import { UISwipeGestureRecognizerDirection } from "~/enum"
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

const initGesture = {
  swipe(
    touchNumber: number,
    direction: UISwipeGestureRecognizerDirection,
    action: string
  ) {
    const swipe = new UISwipeGestureRecognizer(self, `on${action}:`)
    swipe.numberOfTouchesRequired = touchNumber
    swipe.direction = direction
    return swipe
  },
  tap(touchNumber: number, tapNumber: number, action: string) {
    const tap = new UITapGestureRecognizer(self, `on${action}:`)
    tap.numberOfTapsRequired = tapNumber
    tap.numberOfTouchesRequired = touchNumber
    return tap
  }
}

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

const onDoubleClickOnTableView: GestureHandler = () => {
  const { panelControl } = self.globalProfile.addon
  if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
}

export default {
  onDoubleClickOnTableView
}
