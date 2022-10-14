import chalk from 'chalk';
import fs from 'fs'
import moments from 'moment-timezone';


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
    private path:string;
    private time_zone:string;

    constructor(path:string)
    {
        //load the config data to the class
        const config_data = load_config(path);

        if(config_data)
        {
            this.path = config_data.path;
            //set the locale 
            this.time_zone = moments.tz(config_data.time_zone).locale();
            moments.locale(moments.tz(config_data.time_zone).locale());
        }else{

            process.exit();
        }
    }

    //find the data about the line of the code, name of the file and the column
    private line_finder(e:Error)
    {
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
        const file_data = this.line_finder(new Error);

        //Finding the error time
        const time = moments().toLocaleString()
        const error_time = new Date(time);
        log(
            chalk.red.bold.bgYellowBright(`⚠️   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column} ⚠️`)
        )
    }

    //show a message 
    show(message:string)
    {
        const file_data = this.line_finder(new Error);

        //Finding the message time
        const time = moments().toLocaleString()
        const error_time = new Date(time);
        log(
            chalk.white.bold.bgGreenBright(`💭   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column}   💭`)
        ) 
    }

    error(message:string)
    {
        const file_data = this.line_finder(new Error);

        //Finding the message time
        const time = moments().toLocaleString()
        const error_time = new Date(time);
        log(
            chalk.bgRedBright.bold.red(`❌   [${error_time.toLocaleDateString()}:${error_time.toLocaleTimeString()}]     ${message}     @${file_data.filepath.split("\\").pop()}:${file_data.line}-${file_data.column}   ❌`)
        ) 
    }

}

export default DLogger;