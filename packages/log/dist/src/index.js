"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const log = console.log;
//Scan for the Config file
const load_config = (path) => {
    try {
        //check if the config file exist
        if (fs_1.default.existsSync("./logger.config.json")) {
            const bufferData = fs_1.default.readFileSync(path + "/logger.config.json");
            const data = JSON.parse(`${bufferData}`);
            /*Validate and process the data given*/
            //check for the log folder
            if (!fs_1.default.existsSync(`${data.path}/logs`))
                fs_1.default.mkdirSync(`${data.path}/${data.log_folder}`);
            //check if the timezone is valid
            const isValidTimeZone = (tz) => {
                if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
                    throw new Error('Time zones are not available in this environment');
                }
                try {
                    Intl.DateTimeFormat(undefined, { timeZone: tz });
                    return true;
                }
                catch (ex) {
                    return false;
                }
            };
            if (!isValidTimeZone(data.time_zone)) {
                log(chalk_1.default.bgYellow("Invalid timezone"));
                process.exit();
            }
            return data;
        }
        else {
            log(chalk_1.default.red("No config file detected!!!"));
            process.exit();
        }
    }
    catch (error) {
        log(chalk_1.default.bgRedBright(chalk_1.default.yellow(`Error while loading config :- ${error}`)));
    }
};
class DLogger {
    constructor(path) {
        //load the config data to the class
        const config_data = load_config(path);
        if (config_data) {
            this.path = config_data.path;
            this.time_zone = config_data.time_zone;
        }
        else {
            process.exit();
        }
    }
    line_finder() {
        const e = new Error();
        const regex = /\((.*):(\d+):(\d+)\)$/;
        const stack = e.stack;
        const match = regex.exec(stack.split("\n")[2]);
        return {
            filepath: match[1],
            line: match[2],
            column: match[3]
        };
    }
    warn(message) {
        const file_data = this.line_finder();
        const error_time = new Date(this.time_zone);
        log(`
             [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}] 
            ${message}
            `);
    }
}
exports.default = DLogger;
