"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
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
            //set the locale 
            this.time_zone = moment_timezone_1.default.tz(config_data.time_zone).locale();
            moment_timezone_1.default.locale(moment_timezone_1.default.tz(config_data.time_zone).locale());
        }
        else {
            process.exit();
        }
    }
    //find the data about the line of the code, name of the file and the column
    line_finder(e) {
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
        const file_data = this.line_finder(new Error);
        //Finding the error time
        const time = moment_timezone_1.default().toLocaleString();
        const error_time = new Date(time);
        log(chalk_1.default.red.bold.bgYellowBright(`⚠️   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column} ⚠️`));
    }
    //show a message 
    show(message) {
        const file_data = this.line_finder(new Error);
        //Finding the message time
        const time = moment_timezone_1.default().toLocaleString();
        const error_time = new Date(time);
        log(chalk_1.default.white.bold.bgGreenBright(`💭   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column}   💭`));
    }
    error(message) {
        const file_data = this.line_finder(new Error);
        //Finding the message time
        const time = moment_timezone_1.default().toLocaleString();
        const error_time = new Date(time);
        log(chalk_1.default.bgRedBright.bold.red(`❌   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column}   ❌`));
    }
}
exports.default = DLogger;
