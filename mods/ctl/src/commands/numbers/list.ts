import '../../config'
import Numbers from '@fonos/numbers'
import { CLIError } from '@oclif/errors'
import { Command, flags as oclifFlags } from '@oclif/command'
import inquirer from 'inquirer'
import { CommonPB, NumbersPB } from '@fonos/core'
const Table = require('easy-table')
const moment = require('moment')

export default class ListCommand extends Command {
  static description = `list registered numbers
  ...
  List the registered numbers
  `

  static flags = {
    size: oclifFlags.integer({
      char: 's',
      default: 25,
      description: 'number of result per page'
    })
  }

  static aliases = ['numbers:ls']

  async run () {
    const { flags } = this.parse(ListCommand)
    try {
      const numbers = new Numbers()
      let firstBatch = true
      let pageToken = '1'
      const pageSize = flags.size
      const view: CommonPB.View = CommonPB.View.BASIC
      while (true) {
        // Get a list
        const result: any = await numbers.listNumbers({
          pageSize,
          pageToken,
          view
        })
        const list = result.getNumbersList()
        pageToken = result.getNextPageToken()

        // Dont ask this if is the first time or empty data
        if (list.length > 0 && !firstBatch) {
          const answer: any = await inquirer.prompt([
            { name: 'q', message: 'More', type: 'confirm' }
          ])
          if (!answer.q) break
        }

        const t = new Table()

        list.forEach((number: NumbersPB.Number) => {
          t.cell('Ref', number.getRef())
          t.cell('Provider Ref', number.getProviderRef())
          t.cell('E164 Number', number.getE164Number())
          t.cell('AOR Link', number.getAorLink() || '--')
          t.cell('Ingress App', number.getIngressApp() || '--')
          t.newRow()
        })

        if (list.length > 0) console.log(t.toString())

        firstBatch = false
        if (!pageToken) break
      }
    } catch (e) {
      throw new CLIError(e.message)
    }
  }
}