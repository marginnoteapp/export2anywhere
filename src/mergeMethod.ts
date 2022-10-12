import lang from "./lang"
import { modules, constModules } from "./modules"
import { ICheckMethod, IActionMethod4Card } from "./typings"
import { IAllProfile } from "./profile"
import { showHUD } from "marginnote"
export type ModuleKeyType = Exclude<keyof IAllProfile, "additional"> | "more"

export const { actions4card, checkers } = Object.values({
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
    return acc
  },
  {
    actions4card: {} as Record<string, IActionMethod4Card>,
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
