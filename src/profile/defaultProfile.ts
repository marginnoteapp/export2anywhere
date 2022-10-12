import { MN } from "marginnote"
import { Addon } from "~/addon"
import { RewriteCase } from "./typings"

const defaultGlobalProfile = {
  addon: {
    quickSwitch: [],
    panelControl: [],
    panelPosition: [0],
    panelHeight: [1],
    autoBackup: false,
    backupID: ""
  },
  magicaction4card: {
    smartSelection: false,
    defaultMergeText: `%["1"]. $&\\n\\n`
  },
  export2flomo: {
    exportMethod: [1],
    flomoAPI: "",
    exportContent: "",
    templateFlomo: [0],
    showTemplate: true,
    addTags: [0],
    tagTemplate: "{{#tags}}#{{.}} {{/tags}}#{{notebook.title}} #MarginNote",
    flomoTemplate1: "{{excerpts.ocr.0}}",
    flomoTemplate2: "",
    flomoTemplate3: ""
  },
  export2anki: {
    exportMethod: [1],
    ankiConnectAPI: "",
    profileName: MN.isZH ? "账户1" : "User 1",
    jumpBack: true,
    allowRepeat: true,
    addTags: [0],
    autoSync: [0],
    tagTemplate: "{{#tags}}#{{.}} {{/tags}}#{{notebook.title}} #MarginNote",
    showTemplate: [1],
    modelName1: "",
    field11: "",
    field12: "",
    field13: "",
    field14: "",
    field15: "",
    field16: "",
    field17: "",
    field18: "",
    field19: "",
    modelName2: "",
    field21: "",
    field22: "",
    field23: "",
    field24: "",
    field25: "",
    field26: "",
    field27: "",
    field28: "",
    field29: "",
    modelName3: "",
    field31: "",
    field32: "",
    field33: "",
    field34: "",
    field35: "",
    field36: "",
    field37: "",
    field38: "",
    field39: ""
  },
  export2devonthink: {
    exportMethod: [0],
    showTemplate: true,
    title: "{{notebook.title}}",
    comment: "",
    addTags: [0],
    tags: "{{#tags}}{{.}},{{/tags}},{{notebook.title}},MarginNote",
    destination: "",
    htmlsource: "",
    pdfsource: "",
    mdtext: "{{allText}}",
    txtext: "{{allText}}",
    hide: false,
    referrer: "",
    width: "",
    paginated: false
  },
  export2obsidian: {
    // exportMethod:[0],
    vault: "",
    fileName: "",
    contentMethod: [0],
    imgprocess: [0],
    imgsize: "100",
    writeMethod: [0]
  },
  additional: {
    lastVision: Addon.version
  }
}

// Each document has a independent profile
const defaultDocProfile = {
  addon: {
    rest: [0]
  }
}

const defaultNotebookProfile = {
  addon: {
    profile: [0]
  },
  export2anki: {
    deckName: "{{notebook.title}}",
    defaultTemplate: [0]
  },
  export2flomo: {
    defaultTemplate: [0]
  }
}
export const rewriteSelection: RewriteCase[] = []
export { defaultGlobalProfile, defaultDocProfile, defaultNotebookProfile }
