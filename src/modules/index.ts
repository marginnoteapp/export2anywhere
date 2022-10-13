import magicaction4card from "./magicaction4card"
import export2anki from "./export2anki"
import export2devonthink from "./export2devonthink"
import export2flomo from "./export2flomo"
import export2obsidian from "./export2obsidian"
import addon from "./addon"

export const optionalModules = {
  export2anki,
  export2flomo,
  export2obsidian,
  export2devonthink
}

export const requiredModules = { addon, magicaction4card }
