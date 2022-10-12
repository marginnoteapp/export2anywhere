import { defineConfig } from "~/profile"
import { checkRegArray, string2RegArray, doc } from "~/utils"
import {
  showHUD,
  HUDController,
  getAllTags,
  getExcerptText,
  getAllCommnets,
  getAllText
} from "marginnote"
import { lang } from "./lang"
import { FilterCards } from "./typings"
import { CellViewType } from "~/typings"

export default defineConfig({
  name: "MagicAction for Card",
  key: "magicaction4card",
  intro: lang.intro,
  link: doc("magicaction4card"),
  settings: [
    {
      key: "smartSelection",
      type: CellViewType.Switch,
      label: lang.smart_selection.label,
      help: lang.smart_selection.help
    }
  ],
  actions4card: [
    {
      key: "manageProfile",
      type: CellViewType.Button,
      label: lang.manage_profile.label,
      option: lang.manage_profile.$option4,
      help: lang.manage_profile.help,
      method: () => {
        console.log()
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: lang.filter_cards.label,
      option: lang.filter_cards.$option5,
      key: "filterCard",
      method({ nodes, content, option }) {
        if (!content) {
          showHUD(lang.none_card)
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
                return getExcerptText(node).text.join("\n")
              case FilterCards.Comment:
                return getAllCommnets(node).text.join("\n")
              default:
                return `${title}\n${getAllText(node)}`
            }
          })()
          return regGroup.some(regs =>
            regs.every(reg => reg.test(searchContent))
          )
        })
        if (customSelectedNodes.length) {
          HUDController.show(lang.is_selected)
          return customSelectedNodes
        } else {
          showHUD(lang.none_card)
          return []
        }
      },
      check({ input }) {
        checkRegArray(input)
      }
    }
  ]
})
