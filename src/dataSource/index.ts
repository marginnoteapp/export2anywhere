import { requiredModules, optionalModules } from "~/modules"
import { ModuleKeyType } from "~/merged"
import { ISection, IConfig, IRow } from "~/typings"
import { CellViewType } from "~/typings"
import { serialSymbols } from "~/utils"
import lang from "./lang"
import { more } from "./more"

const genSection = (config: IConfig<ModuleKeyType>): ISection => {
  const rows: IRow[] = [
    {
      type: CellViewType.PlainText,
      label: config.intro,
      link: config.link
    }
  ]
  for (const setting of config.settings) {
    //@ts-ignore magic hack
    rows.push(setting)
    if (setting.help) {
      switch (setting.type) {
        case CellViewType.MuiltSelect:
        case CellViewType.Select:
        case CellViewType.Switch:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
          break
        case CellViewType.InlineInput:
        case CellViewType.Input:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
      }
    }
  }
  return {
    header: config.name,
    key: config.key as ModuleKeyType,
    rows
  }
}

const genDataSource = (
  configs: IConfig<ModuleKeyType>[],
  magicaction4card: IConfig<"magicaction4card">
) => {
  const dataSource: ISection[] = []
  const moduleNameList: { key: string[]; name: string[] } = {
    key: [],
    name: []
  }
  const actions4card =
    magicaction4card.actions4card?.map(k => ({
      ...k,
      module: "magicaction4card" as ModuleKeyType,
      moduleName: "MagicAction For Card"
    })) ?? []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    if (config.actions4card?.length)
      actions4card.push(
        ...config.actions4card.map(k => ({
          ...k,
          moduleName: config.name,
          module: config.key as ModuleKeyType,
          help:
            lang.magicaction_from_which_module(config.name) +
            (k.help ? k.help : "")
        }))
      )
  })
  dataSource.forEach((sec, index) => {
    if (index) {
      moduleNameList.key.push(sec.key)
      moduleNameList.name.push(sec.header)
    }
  })

  const Action4CardSection = genSection(
    magicaction4card as IConfig<ModuleKeyType>
  )
  Action4CardSection.rows.push(...actions4card)

  // 更新 quickSwitch 为 moduleList
  const [AddonSection] = dataSource
  for (const row of AddonSection.rows) {
    if (row.type == CellViewType.MuiltSelect && row.key == "quickSwitch")
      row.option = moduleNameList.name.map(
        (value, index) =>
          serialSymbols.hollow_circle_number[index] + " " + value
      )
  }

  dataSource.splice(1, 0, Action4CardSection)
  dataSource.push(more)
  return {
    dataSource,
    moduleNameList
  }
}

function genDataSourceIndex(dataSource: ISection[]) {
  return dataSource.reduce((acc, sec, secIndex) => {
    acc[sec.key] = sec.rows.reduce((acc, row, rowIndex) => {
      if (row.type != CellViewType.PlainText) {
        acc[row.key] = [secIndex, rowIndex]
      }
      return acc
    }, {} as Record<string, [number, number]>)
    return acc
  }, {} as Record<ModuleKeyType, Record<string, [number, number]>>)
}

const { addon, magicaction4card } = requiredModules
export const { dataSource: dataSourcePreset, moduleNameList } = genDataSource(
  [addon, ...Object.values(optionalModules)] as IConfig<ModuleKeyType>[],
  magicaction4card
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
