import {
  defineEventHandlers,
  eventHandlerController,
  isThisWindow,
  showHUD
} from "marginnote"
import { Addon } from "~/addon"
import { layoutViewController } from "~/JSExtension/switchPanel"
import lang from "~/lang"
import { saveProfile } from "~/profile"
import handleURLScheme from "./handleURLScheme"
import handleMagicAction from "./magicActionHandler"

const panelEvents = [
  { event: Addon.key + "InputOver", handler: "onInputOver" },
  { event: Addon.key + "ButtonClick", handler: "onButtonClick" },
  { event: Addon.key + "SelectChange", handler: "onSelectChange" },
  { event: Addon.key + "SwitchChange", handler: "onSwitchChange" }
] as const

const events = ["AddonBroadcast"] as const

export const eventHandlers = eventHandlerController([...panelEvents, ...events])

export default defineEventHandlers<
  typeof events[number] | typeof panelEvents[number]["handler"]
>({
  async onButtonClick(sender) {
    if (!isThisWindow(sender)) return
    // For magicaction
    console.log("Click a button", "event")
    const { row } = sender.userInfo
    await handleMagicAction(row)
  },
  async onSwitchChange(sender) {
    if (!isThisWindow(sender)) return
    console.log("Switch the switch", "event")
    const { name, key, status } = sender.userInfo
    await saveProfile(name, key, status)
  },
  async onSelectChange(sender) {
    if (!isThisWindow(sender)) return
    console.log("Change the selection", "event")
    const { name, key, selections } = sender.userInfo
    switch (key) {
      case "panelPosition":
        layoutViewController(undefined, selections[0])
        break
      case "panelHeight":
        layoutViewController(selections[0])
        break
    }
    await saveProfile(name, key, selections)
  },
  async onInputOver(sender) {
    if (!isThisWindow(sender)) return
    console.log("Input", "event")
    const { name, key } = sender.userInfo
    let { content } = sender.userInfo as { content: string }
    showHUD(content ? lang.input_saved : lang.input_clear)
    switch (key) {
      case "pageOffset": {
        const [a, b] = content.split(/\s*-\s*/).map(k => Number(k))
        content = b === undefined ? content : String(a - b)
        break
      }
    }
    await saveProfile(name, key, content)
  },
  async onAddonBroadcast(sender) {
    console.log("Addon broadcast", "event")
    const { message } = sender.userInfo
    const params = message.replace(new RegExp(`^${Addon.key}\\?`), "")
    if (message !== params) {
      await handleURLScheme(params)
    }
  }
})
