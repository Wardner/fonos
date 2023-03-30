import "../../config";
import {CLIError} from "@oclif/errors";
import {Command} from "@oclif/command";
import {cli} from "cli-ux";
import {getProjectConfig, hasProjectConfig} from "../../config";
const Agents = require("@fonoster/agents");
const inquirer = require("inquirer");

export default class UpdateCommand extends Command {
  static args = [{name: "ref"}];
  static description = `update a Fonoster Agent
  ...
  Update a Fonoster Agent
  `;
  async run() {
    if (!hasProjectConfig()) {
      throw new CLIError("you must set a default project");
    }
    console.log("This utility will help you update an existing Agent");
    console.log("Press ^C at any time to quit.");

    const {args} = this.parse(UpdateCommand);
    const agents = new Agents(getProjectConfig());
    const agent = await agents.getAgent(args.ref);

    const answers = await inquirer.prompt([
      {
        name: "name",
        message: "friendly name",
        type: "input",
        default: agent.name
      },
      {
        name: "secret",
        message: "secret",
        type: "password",
        mask: true
      },
      {
        name: "privacy",
        message: "privacy",
        type: "list",
        choices: ["None", "Private"],
        default: agent.privacy
      },
      {
        name: "confirm",
        message: "ready?",
        type: "confirm"
      }
    ]);

    answers.ref = args.ref;

    if (!answers.confirm) {
      console.log("Aborted");
    } else {
      try {
        cli.action.start(`Updating agent ${answers.name}`);

        await agents.updateAgent(answers);
        await cli.wait(1000);

        cli.action.stop("Done");
      } catch (e) {
        cli.action.stop();
        throw new CLIError(e.message);
      }
    }
  }
}
