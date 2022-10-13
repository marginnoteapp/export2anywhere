import { ISection, CellViewType } from "~/typings"
import lang from "./lang"

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: "本插件为 OhMyMN 系列插件。",
      link: "https://github.com/marginnoteapp/metadata"
    },
    {
      type: CellViewType.PlainText,
      label: lang.website,
      link: "https://ohmymn.marginnote.cn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.core_team,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: lang.intro,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
