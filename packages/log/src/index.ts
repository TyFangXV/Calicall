import chalk from 'chalk';
import fs from 'fs'

const log = console.log;

//Scan for the Config file
const load_config = (path:string) => {
    try {
        //check if the config file exist
        if(fs.existsSync("./logger.config.json"))
        {
            const bufferData = fs.readFileSync(path + "/logger.config.json")
            const data = JSON.parse(`${bufferData}`);

            /*Validate and process the data given*/

            //check for the log folder
            if(!fs.existsSync(`${data.path}/logs`)) fs.mkdirSync(`${data.path}/${data.log_folder}`);

            //check if the timezone is valid
            const isValidTimeZone = (tz:string) => {
                if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
                    throw new Error('Time zones are not available in this environment');
                }
            
                try {
                    Intl.DateTimeFormat(undefined, {timeZone: tz});
                    return true;
                }
                catch (ex) {
                    return false;
                }
            }

            if(!isValidTimeZone(data.time_zone)) {log(chalk.bgYellow("Invalid timezone")); process.exit()} 

            return data;
        }else{
            log(chalk.red("No config file detected!!!"));
            process.exit();
        }
    } catch (error) {
        log(chalk.bgRedBright(chalk.yellow(`Error while loading config :- ${error}`)))
    }
}


class DLogger {
    path:string;
    time_zone:string;

    constructor(path:string)
    {
        //load the config data to the class
        const config_data = load_config(path);

        if(config_data)
        {
            this.path = config_data.path;
            this.time_zone = config_data.time_zone;
        }else{

            process.exit();
        }
    }


    private line_finder()
    {
        const e = new Error();
        const regex = /\((.*):(\d+):(\d+)\)$/
        const stack = e.stack as string;
        const match = regex.exec(stack.split("\n")[2]) as RegExpExecArray;
        return {
          filepath: match[1],
          line: match[2],
          column: match[3]
        };
    }

    warn(message:string)
    {
        const file_data = this.line_finder();
        const error_time = new Date(this.time_zone)
        log(
            `
             [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}] 
            ${message}
            `
        )
    }


}

export default DLogger;