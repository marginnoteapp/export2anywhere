import magicaction4card from "./magicaction4card"
import export2anki from "./export2anki"
import export2devonthink from "./export2devonthink"
import export2flomo from "./export2flomo"
import export2obsidian from "./export2obsidian"
import addon from "./addon"
import { CellViewType } from "~/enum"
import { MN } from "~/sdk"
import { ISection } from "~/typings"

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
      label: `OhMyMN ${MN.isZH ? "官网：" : "Website: "}ohmymn.marginnote.cn`,
      link: "https://ohmymn.marginnote.cn"
    },
    {
      type: CellViewType.PlainText,
      label: `${MN.isZH ? "核心开发团队：" : "Core Team: "}ourongxing，Bryan`,
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: MN.isZH
        ? "OhMyMN 是 MarginNote 插件控制面板及开发框架。OhMyMN 完全开源，官方支持，欢迎参与。"
        : "OhMyMN is MarginNote addon control panel and development framework.OhMyMN is completely open source, officially supported, welcome to join.",
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
