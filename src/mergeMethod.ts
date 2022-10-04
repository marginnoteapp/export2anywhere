import lang from "./lang"
import { showHUD } from "./sdk"
import { modules, constModules } from "./modules"
import { ICheckMethod, IActionMethod4Text, IActionMethod4Card } from "./typings"
import { IAllProfile } from "./profile"
export type ModuleKeyType = Exclude<keyof IAllProfile, "additional"> | "more"
type AutoModuleKeyType = Include<ModuleKeyType, "auto">

export const { actions4card, actions4text, checkers } = Object.values({
  ...constModules,
  ...modules
}).reduce(
  (acc, module) => {
    module.settings.length &&
      module.settings.forEach(k => {
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    module.actions4card?.length &&
      module.actions4card.forEach(k => {
        acc.actions4card[k.key] = k.method
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    module.actions4text?.length &&
      module.actions4text.forEach(k => {
        acc.actions4text[k.key] = k.method
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    return acc
  },
  {
    actions4card: {} as Record<string, IActionMethod4Card>,
    actions4text: {} as Record<string, IActionMethod4Text>,
    checkers: {} as Record<string, ICheckMethod>
  }
)
export const moduleKeys = Object.values(modules).reduce((acc, cur) => {
  acc.push(cur.key)
  return acc
}, [] as ModuleKeyType[])

export function isModuleON(key: ModuleKeyType) {
  const { quickSwitch } = self.globalProfile.addon
  const index = moduleKeys.indexOf(key)
  return index === -1 || quickSwitch.includes(index)
}

export async function checkInputCorrect(
  input: string,
  key: string
): Promise<boolean> {
  try {
    if (checkers[key]) {
      await checkers[key]({ input })
    }
  } catch (err) {
    showHUD(err ? String(err) : lang.input_error, 3)
    return false
  }
  return true
}

function isModuleAutoON(key: AutoModuleKeyType) {
  const { quickSwitch } = self.globalProfile.addon
  return (
    quickSwitch.includes(moduleKeys.indexOf(key)) &&
    //@ts-ignore
    (self.globalProfile[key]?.on ??
      //@ts-ignore
      self.docProfile[key]?.on ??
      //@ts-ignore
      self.notebookProfile[key]?.on ??
      false)
  )
}
