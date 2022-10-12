import type { MbBookNote } from "marginnote"
import {
  getExcerptText,
  getAllCommnets,
  getNodeTree,
  getAncestorNodes,
  MN
} from "marginnote"

export function getExcerptNotes(node: MbBookNote) {
  return node.comments.reduce((acc, cur) => {
    cur.type == "TextNote" &&
      cur.text.startsWith("marginnote3app://note/") &&
      acc.push(`[[#^${cur.text.split("note/")[1]}|🔗]]`)
    return acc
  }, [] as string[])
}

export function getAllText(
  node: MbBookNote,
  separator = "\n",
  highlight = true
) {
  // console.log(utils.getExcerptNotes(node),"export2devonthink")
  return [
    ...getExcerptText(node, highlight).md,
    ...getAllCommnets(node).md,
    ...getExcerptNotes(node),
    `[](marginnote3app://note/${node.noteId})`,
    `^${node.noteId}`
  ]
    .join("\n")
    .replace(/\n/g, separator)
}

export function getAllOCR(
  node: MbBookNote,
  separator = "\n",
  highlight = true,
  mdsize = ""
) {
  // console.log(utils.getExcerptNotes(node),"export2devonthink")
  return [
    ...getExcerptText(node, highlight).ocr,
    ...getAllCommnets(node).text,
    ...getExcerptNotes(node),
    `[](marginnote3app://note/${node.noteId})`,
    `^${node.noteId}`
  ]
    .join("\n")
    .replace(/\n/g, separator)
}

export function makeObsidianOutline(
  node: MbBookNote,
  method: number,
  imgprocess: number,
  mdsize = ""
) {
  if (imgprocess == 0) {
    if (method == 0) {
      let res = node.noteTitle
        ? "- " + node.noteTitle + "\n" + getAllText(node, "\n", false) + "\n"
        : "- " + getAllText(node, "\n", false) + "\n"
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllText(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length),
          true
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    } else if (method == 1) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllText(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllText(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true)
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true)
      }
      return res
    } else if (method == 2) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllText(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllText(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllText(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true) +
          "\n"
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllText(node, "\n" + "  ".repeat(parentNotes.length), true) +
          "\n"
      }

      const indent = parentNotes.length
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllText(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length + indent),
          true
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length + indent) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    }
  } else if (imgprocess == 1) {
    if (method == 0) {
      let res = node.noteTitle
        ? "- " +
          node.noteTitle +
          "\n" +
          getAllOCR(node, "\n", false, mdsize) +
          "\n"
        : "- " + getAllOCR(node, "\n", false, mdsize) + "\n"
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllOCR(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length),
          true
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    } else if (method == 1) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllOCR(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllOCR(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true, mdsize)
      }
      return res
    } else if (method == 2) {
      const parentNotes = getAncestorNodes(node)
      let res = ""
      // console.log(parentNotes,"export2devonthink")

      for (let i = 0; i < parentNotes.length; i++) {
        if (i == 0) {
          const groupNoteID =
            parentNotes[parentNotes.length - i - 1].groupNoteId
          const newNote = MN.db.getNoteById(groupNoteID!)
          if (newNote && newNote.noteTitle) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res =
              res +
              "  ".repeat(i) +
              "- " +
              newNote.noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else if (newNote) {
            const titleAndcomment = getAllOCR(
              newNote,
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          } else {
            const titleAndcomment = getAllOCR(
              parentNotes[parentNotes.length - i - 1],
              "\n" + "  ".repeat(i),
              true
            )
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        } else {
          const titleAndcomment = getAllOCR(
            parentNotes[parentNotes.length - i - 1],
            "\n" + "  ".repeat(i),
            true
          )
          if (parentNotes[parentNotes.length - i - 1].noteTitle) {
            res =
              res +
              "  ".repeat(i) +
              "- " +
              parentNotes[parentNotes.length - i - 1].noteTitle +
              "\n" +
              "  ".repeat(i) +
              titleAndcomment +
              "\n"
          } else {
            res = res + "  ".repeat(i) + "- " + titleAndcomment + "\n"
          }
        }
      }

      if (node.noteTitle) {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          node.noteTitle +
          "\n" +
          "  ".repeat(parentNotes.length) +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true) +
          "\n"
      } else {
        res =
          res +
          "  ".repeat(parentNotes.length) +
          "- " +
          getAllOCR(node, "\n" + "  ".repeat(parentNotes.length), true) +
          "\n"
      }

      const indent = parentNotes.length
      const { treeIndex, onlyChildren } = getNodeTree(node)
      // console.log(treeIndex,"export2devonthink")
      for (let i = 0; i < onlyChildren.length; i++) {
        // console.log(treeIndex[i],"export2devonthink")
        const titleAndcomment = getAllOCR(
          onlyChildren[i],
          "\n" + "  ".repeat(treeIndex[i].length + indent),
          true
        )
        if (onlyChildren[i].noteTitle) {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            onlyChildren[i].noteTitle +
            "\n" +
            "  ".repeat(treeIndex[i].length + indent) +
            titleAndcomment +
            "\n"
        } else {
          res =
            res +
            "  ".repeat(treeIndex[i].length + indent) +
            "- " +
            titleAndcomment +
            "\n"
        }
      }
      return res
    }
  }
}
