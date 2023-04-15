import * as fs from "fs"
import * as log from "../output/log"

export interface SQLFile {
    file: string,
    content: string,
    version: string
}

const extractVersionNumber = (filename: string) => {
    const validVersionString = /v(.[0-9]*?)\__/.test(filename)
    const version = filename.substring(1).replace(/__.*/, "")

    if (!validVersionString) {
        throw new Error('Invalid filename! Failed to parse version number from the filename')
    }

    return version
}

const readFileContent = async (directory: string, file: string): Promise<SQLFile> => {
    const filepath = `${directory}/${file}`
    try {
        const content = await fs.promises.readFile(filepath)
        const version = extractVersionNumber(file)
        return { file, content: content.toString(), version }
    } catch (error) {
        log.error(`Failed to read file: ${filepath}`)
        log.error(error)
        process.exit(1)
    }

}

export const readSqlFiles = async (directory: string, logFiles?: boolean): Promise<SQLFile[]> => {
    try {
        const directoryContents = await fs.promises.readdir(directory)
        logFiles && log.debug(`Read following directory contents from directory '/${directory}':\n${directoryContents.join("\n")}`)

        const contents = await Promise
            .all(directoryContents
            .map(filename => readFileContent(directory, filename)))

        // log.debug(`Migration file contents: ${JSON.stringify(contents, null, 2)}`)
        return contents
    }
    catch (error) {
        log.error("Failed to read SQL directory!")
        log.error(error)
        process.exit(1)
    }
}