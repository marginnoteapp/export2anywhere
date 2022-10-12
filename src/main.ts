import { getObjCClassDeclar } from "marginnote"
import { Addon } from "~/addon"
import handleReceivedEvent from "~/jsExtension/handleReceivedEvent"
import lifeCycle from "~/jsExtension/lifeCycle"
import switchPanel from "~/jsExtension/switchPanel"
import handleGestureEvent from "./jsExtension/handleGestureEvent"

JSB.newAddon = mainPath => {
  Addon.path = mainPath
  return JSB.defineClass(
    getObjCClassDeclar(Addon.title, "JSExtension"),
    {
      ...lifeCycle.instanceMethods,
      ...switchPanel,
      ...handleReceivedEvent,
      ...handleGestureEvent
    },
    lifeCycle.classMethods
  )
}
