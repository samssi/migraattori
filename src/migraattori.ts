import {sql} from "./db/postgres-db";
import * as fs from "fs";
import * as path from "path";
import * as log from "./output/log"

interface SQLFile {
    file: string,
    content: string
}

const readFileContent = async (directory: string, file: string): Promise<SQLFile> => {
    const filepath = `${directory}/${file}`
    const content = await fs.promises.readFile(filepath)
    return { file, content: content.toString() }
}

const readSqlFiles = async (directory: string) => {
    try {
        const directoryContents = await fs.promises.readdir(directory)
        log.debug(`Read following directory contents from directory '/${directory}':\n${directoryContents.join("\n")}`)
        const contents = await Promise
            .all(directoryContents
            .map(filename => readFileContent(directory, filename)))

        log.debug(`Migration file contents: ${JSON.stringify(contents, null, 2)}`)

        return contents
    }
    catch (error) {
        log.error("Failed to read SQL directory!")
        log.error(error)
    }
}

const main = async () => {
    console.log("Migraattori starting...")
    await readSqlFiles("sql")
}

(async function() {
    await main();
}());