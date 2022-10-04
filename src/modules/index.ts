import magicaction4card from "./magicaction4card"
import export2anki from "./export2anki"
import export2devonthink from "./export2devonthink"
import export2flomo from "./export2flomo"
import export2obsidian from "./export2obsidian"
import addon from "./addon"
import { CellViewType } from "~/enum"
import { ISection } from "~/typings"
import lang from "~/lang"

export const modules = {
  export2anki,
  export2devonthink,
  export2flomo,
  export2obsidian
}

export const constModules = { addon, magicaction4card }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: "本插件为 OhMyMN 系列插件。",
      link: "https://ohmymn.marginnote.cn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.more.website,
      link: "https://ohmymn.marginnote.cn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.more.core_team,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.more.intro,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
