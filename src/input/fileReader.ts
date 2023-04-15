import * as fs from "fs"
import * as log from "../output/log"

export interface SQLFile {
    file: string,
    content: string
}

const readFileContent = async (directory: string, file: string): Promise<SQLFile> => {
    const filepath = `${directory}/${file}`
    try {
        const content = await fs.promises.readFile(filepath)
        return { file, content: content.toString() }
    } catch (error) {
        log.error(`Failed to read file: ${filepath}`)
        log.error(error)
        process.exit(1)
    }

}

export const readSqlFiles = async (directory: string): Promise<SQLFile[]> => {
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
        process.exit(1)
    }
}