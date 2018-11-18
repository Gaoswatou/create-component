import * as glob from 'glob'
import * as _ from 'lodash'
import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import utils, { exec, LogType } from '../../utils/index'
import { log } from '../../utils/log'
import { FrameworkType, Language, OpenSourceLicenseType } from '../../utils/tools'

export interface IOptions {
  proName: string
  proPath: string
  dest: string
  projectType: string
  frameworkType: FrameworkType
  projectLanguage: Language
  title: string
  license: OpenSourceLicenseType
  useCommitlint: boolean
}

export class InitCommand {
  constructor(public options: IOptions) {}

  async run() {
    await this.copyScaffold()

    await this.npmInstall()

    // 提示使用
    log.newline()
    log.msg(LogType.TIP, `项目创建完成`)
  }

  private async copyScaffold() {
    const { proName, proPath, projectLanguage, frameworkType } = this.options

    const extraOptions = {
      year: utils.getYear(),
    }

    const allOptions = _.merge(this.options, extraOptions)
    console.log(allOptions)
    const scaffoldType = {
      FrameworkType: frameworkType,
      Language: projectLanguage,
    }

    // 内存管理
    const store = memFs.create()
    const fsEditor = editor.create(store)

    const globOptions = {
      globOptions: {
        dot: true,
      },
    }
    // 拷贝脚手架
    fsEditor.copyTpl(utils.getScaffoldPath(scaffoldType), proPath, allOptions, {}, globOptions)

    await fsEditor.copyTpl(utils.getLicensePath(this.options.license), proPath, allOptions)

    if (this.options.useCommitlint) {
      await fsEditor.copyTpl(utils.getCommitLintPackagePath(), proPath, {}, {}, globOptions)
    }
    return new Promise((resolve, reject) => {
      // 保存
      fsEditor.commit(() => {
        log.newline()
        log.msg(LogType.CREATE, `项目 "${proName}" in "${proPath}"`)

        const files = glob.sync('**', {
          cwd: proPath,
          dot: true,
        })
        files.forEach(file => log.msg(LogType.COPY, file))

        log.msg(LogType.COMPLETE, '项目已创建完成')
        resolve()
      })
    })
  }

  private async npmInstall() {
    const { proPath } = this.options
    // 执行 npm install
    log.newline()
    log.msg(LogType.RUN, '命令：npm install')
    log.msg(LogType.INFO, '安装中, 请耐心等待...')
    await exec('npm', ['install'], true, {
      cwd: proPath,
    })
  }
}
