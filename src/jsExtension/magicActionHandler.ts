import {
  getNodeTree,
  getSelectNodes,
  HUDController,
  MbBookNote,
  popup,
  showHUD,
  UIAlertViewStyle,
  undoGroupingWithRefresh
} from "marginnote"
import lang from "./lang"
import { actions4card, checkInputCorrect } from "~/merged"
import { PanelControl } from "~/modules/addon/typings"
import { getMNLinkValue, manageProfileAction } from "~/profile"
import { CellViewType, IRowButton } from "~/typings"
import { closePanel } from "./switchPanel"

export default async (row: IRowButton, option?: number, content?: string) => {
  if (option !== undefined && content !== undefined) {
    // Allowed to be empty
    if (
      content === "" ||
      (content && (await checkInputCorrect(content, row.key)))
    ) {
      await handleMagicAction({
        key: row.key,
        option,
        content
      })
      return
    }
  } else if (option !== undefined) {
    await handleMagicAction({ key: row.key, option })
  } else
    switch (row.type) {
      case CellViewType.ButtonWithInput:
        while (1) {
          const { option, content } = await popup(
            {
              title: row.label,
              message: row.help ?? "",
              type: UIAlertViewStyle.PlainTextInput,
              // It is better to have only two options, because then the last option will be automatically selected after the input
              buttons: row.option ? row.option : [lang.sure]
            },
            ({ alert, buttonIndex }) => ({
              content: alert.textFieldAtIndex(0).text,
              option: buttonIndex
            })
          )
          if (option === -1) return
          const text = content ? getMNLinkValue(content) : ""
          // Allowed to be empty
          if (
            text === "" ||
            (text && (await checkInputCorrect(text, row.key)))
          ) {
            await handleMagicAction({
              key: row.key,
              option,
              content: text
            })
            return
          }
        }
      case CellViewType.Button:
        const { option } = await popup(
          {
            title: row.label,
            message: row.help ?? "",
            type: UIAlertViewStyle.Default,
            buttons: row.option ?? [lang.sure]
          },
          ({ buttonIndex }) => ({
            option: buttonIndex
          })
        )
        if (option === -1) return
        await handleMagicAction({
          key: row.key,
          option
        })
    }
}

const handleMagicAction = async ({
  key,
  option,
  content = ""
}: {
  key: string
  option: number
  content?: string
}) => {
  try {
    let nodes: MbBookNote[] = []
    key != "filterCard" &&
      self.globalProfile.addon.panelControl.includes(
        PanelControl.CompleteClose
      ) &&
      closePanel()

    if (self.customSelectedNodes.length) {
      nodes = self.customSelectedNodes
      self.customSelectedNodes = []
      HUDController.hidden()
    } else {
      nodes = getSelectNodes()
      if (key === "manageProfile") {
        if (option > 1) await manageProfileAction(nodes[0], option)
        else {
          if (!nodes.length) {
            showHUD(lang.not_select_card)
            return
          }
          await manageProfileAction(nodes[0], option)
        }
        return
      } else {
        if (!nodes.length) {
          showHUD(lang.not_select_card)
          return
        }
        // The need for the same level is to avoid the situation where both parent and descendant nodes are selected,
        // which leads to duplicate processing.
        const isHavingChildren = nodes.every(
          node =>
            nodes[0].parentNote === node.parentNote && node?.childNotes?.length
        )

        const noNeedSmartSelection =
          key === "renameTitle" && /#\[(.+)\]/.test(content)

        if (
          self.globalProfile.magicaction4card.smartSelection &&
          isHavingChildren &&
          !noNeedSmartSelection
        ) {
          const { option } = await popup(
            {
              title: lang.smart_select.title,
              message:
                nodes.length > 1
                  ? lang.smart_select.cards_with_children
                  : lang.smart_select.card_with_children,
              type: UIAlertViewStyle.Default,
              buttons: lang.smart_select.$option4,
              canCancel: false
            },
            ({ buttonIndex }) => ({
              option: buttonIndex
            })
          )

          if (option !== 0) {
            const { onlyChildren, onlyFirstLevel, allNodes } = nodes
              .slice(1)
              .reduce((acc, node) => {
                const { onlyChildren, onlyFirstLevel, allNodes } =
                  getNodeTree(node)
                acc.allNodes.push(...allNodes)
                acc.onlyChildren.push(...onlyChildren)
                acc.onlyFirstLevel.push(...onlyFirstLevel)
                return acc
              }, getNodeTree(nodes[0]))
            nodes = [onlyFirstLevel, onlyChildren, allNodes][option - 1]
          }
        }
      }
    }
    switch (key) {
      case "filterCard":
        self.customSelectedNodes = actions4card.filterCard!({
          content,
          nodes,
          option
        })
        break
      default:
        undoGroupingWithRefresh(() => {
          actions4card[key]({
            content,
            nodes,
            option
          })
        })
    }
  } catch (err) {
    console.error(String(err))
  }
}
