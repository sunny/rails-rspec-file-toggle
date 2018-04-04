'use strict';

import { workspace, window } from "vscode";
import { isString } from "util";

export default class ConvertDefinition {
  private constructor(private appDirectory: string, private specDirectory: string, private appSuffix: string | undefined, private specSuffix: string | undefined) {}

  private convertAppToSpec(file: string): string {
    return this.convert(file, this.appDirectory, this.specDirectory, this.appSuffix, this.specSuffix);
  }

  private convertSpecToApp(file: string): string {
    return this.convert(file, this.specDirectory, this.appDirectory, this.specSuffix, this.appSuffix);
  }

  private convert(file: string, fromDirectory: string, toDirectory: string, fromSuffix: string | undefined, toSuffix: string | undefined) {
    const directoryRegex = new RegExp(`^${fromDirectory}/`);
    file = file.replace(directoryRegex, `${toDirectory}/`);
    window.showInformationMessage(file + ',' + fromDirectory + ',' + toDirectory);
    if (isString(fromSuffix) && isString(toSuffix)) {
      if (fromSuffix === '') {
        file += toSuffix;
      } else {
        const suffixRegex = new RegExp(`^${fromDirectory}$`);
        file = file.replace(suffixRegex, toSuffix);
      }
    }
    return file;
  }

  static convertAppToSpec(file: string): string {
    this.all.forEach((definition) => {
      file = definition.convertAppToSpec(file);
    });
    return file;
  }

  static convertSpecToApp(file: string): string {
    this.all.forEach((definition) => {
      file = definition.convertSpecToApp(file);
    });
    return file;
  }

  private static get all(): ConvertDefinition[] {
    if (this._all) { return this._all; }

    const objects = workspace.getConfiguration('railsRspecFileToggle').get<{ [key: string]: string }[]>('convertDefinition') || new Array<{ [key: string]: string }>(0);
    this._all = objects.map((object) => new ConvertDefinition(object['app_directory'] || '', object['spec_directory'] || '', object['app_suffix'], object['spec_suffix']));
    return this._all;
  }

  private static _all: ConvertDefinition[];
}
