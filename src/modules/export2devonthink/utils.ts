import type { MbBookNote } from "marginnote"
import { ExportMethod } from "./typings"

export function getDtContent(
  node: MbBookNote,
  params: Record<string, string | boolean>,
  addTags: number[],
  tags: string
) {
  return ""
}

export async function getContent(node: MbBookNote, option: number) {
  const {
    title,
    comment,
    addTags,
    tags,
    destination,
    htmlsource,
    pdfsource,
    mdtext,
    txtext,
    hide,
    referrer,
    width,
    paginated,
    exportMethod
  } = self.globalProfile.export2devonthink
  switch (exportMethod[0]) {
    case ExportMethod.PDF: {
    }
    case ExportMethod.HTML: {
    }
    case ExportMethod.Markdown: {
    }
    case ExportMethod.Text: {
    }
    default:
      return ""
  }
}
