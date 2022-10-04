import { CellViewType } from "~/enum"
import { defineConfig } from "~/profile"
import { checkPlainText, checkRegArray, string2RegArray } from "~/utils"
import {
  showHUD,
  HUDController,
  getAllTags,
  getExcerptText,
  getAllCommnets,
  getAllText
} from "~/sdk"
import { lang } from "./lang"
import { FilterCards } from "./typings"

const { help, option, intro, label, link, hud } = lang

export default defineConfig({
  name: "MagicAction for Card",
  key: "magicaction4card",
  intro,
  link,
  settings: [
    {
      key: "smartSelection",
      type: CellViewType.Switch,
      label: label.smart_selection
    },
    {
      key: "defaultMergeText",
      type: CellViewType.Input,
      help: "合并卡片内文字时的前后修饰，默认添加序号和换行（$&代表每一段），点击查看自定义方法。                 ",
      link: "https://ohmymn.marginnote.cn/guide/modules/magicaction4card.html#%E5%90%88%E5%B9%B6%E5%8D%A1%E7%89%87%E5%86%85%E6%96%87%E5%AD%97",
      check({ input }) {
        checkPlainText(input)
        if (!input.includes("$&")) throw "缺少 $&"
      }
    }
  ],
  actions4card: [
    {
      key: "manageProfile",
      type: CellViewType.Button,
      label: label.manage_profile,
      option: option.manage_profile,
      help: help.manage_profile,
      method: () => {
        return
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: label.filter_cards,
      option: option.filter_cards,
      key: "filterCards",
      method({ nodes, content, option }) {
        if (!content) {
          showHUD(hud.none_card)
          return []
        }
        const regGroup = string2RegArray(content)
        const customSelectedNodes = nodes.filter(node => {
          const title = node.noteTitle ?? ""
          const searchContent = (() => {
            switch (option) {
              case FilterCards.Title:
                return title
              case FilterCards.Tag:
                return getAllTags(node).join(" ")
              case FilterCards.Excerpt:
                return getExcerptText(node).ocr.join("\n")
              case FilterCards.Comment:
                return getAllCommnets(node).nopic.join("\n")
              default:
                return `${title}\n${getAllText(node)}`
            }
          })()
          return regGroup.some(regs =>
            regs.every(reg => reg.test(searchContent))
          )
        })
        if (customSelectedNodes.length) {
          HUDController.show(hud.is_clicked)
          return customSelectedNodes
        } else {
          showHUD(hud.none_card)
          return []
        }
      },
      check({ input }) {
        checkRegArray(input)
      }
    }
  ]
})
