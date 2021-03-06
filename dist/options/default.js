"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const tools_1 = require("../utils/tools");
const tools_2 = require("./../utils/tools");
exports.default = {
    title: config_1.default.title,
    description: config_1.default.description,
    author: config_1.default.author,
    useCommitlint: false,
    usePrecommit: false,
    useCommitizen: false,
    useCHANGELOG: false,
    cssinjs: false,
    frameworkType: tools_1.FrameworkType.React,
    projectLanguage: tools_1.Language.JavaScript,
    license: tools_2.OpenSourceLicenseType.MIT,
    proVersion: '1.0.0',
    manger: 'npm',
    isContinue: false,
};
