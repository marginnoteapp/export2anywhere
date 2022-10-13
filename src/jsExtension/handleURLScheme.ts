import queryString from "query-string"
import { dataSourceIndex } from "~/dataSource"
import lang from "./lang"
import { showHUD } from "marginnote"
import { IRowButton } from "~/typings"
import magicActionHandler from "./magicActionHandler"
import { switchPanel } from "./switchPanel"

export default async function (params: string) {
  try {
    // marginnote3app://addon/metadata?action=renameTitle&option=1&content=1
    // marginnote3app://addon/metadata?action=switchPanel
    const { action, option, content } = queryString.parse(params)
    if (!action) throw lang.no_action
    if (action === "switchPanel") {
      switchPanel()
      return
    }
    const [sec, row] = dataSourceIndex.magicaction4card[action as string]
    if (sec === undefined || row === undefined) throw lang.action_not_exist
    if (option !== null && !Number.isInteger(Number(option)))
      throw lang.option_interger
    const opt = option === null ? undefined : Number(option)
    await magicActionHandler(
      self.dataSource[sec].rows[row] as IRowButton,
      opt,
      content === null ? undefined : String(content)
    )
  } catch (e) {
    showHUD(String(e), 2)
    console.error(e)
  }
}
