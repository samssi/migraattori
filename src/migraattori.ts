import {sql} from "./db/postgresDb";
import {readSqlFiles, SQLFile} from "./input/fileReader";

interface TargetDatabaseDriver {
    migrationTransaction(sqlFiles: SQLFile[]): Promise<void>
    closeConnection(): Promise<void>
}

const postgresJs: TargetDatabaseDriver = {
    async migrationTransaction(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => {
            for (const sqlFile of sqlFiles) {
                await sql.unsafe(sqlFile.content)
            }
        })
        await sql.end()
    },
    async closeConnection(): Promise<void> {
        await sql.end()
    }
}

const runMigrations = async (driver: TargetDatabaseDriver) => {
    const sqlFiles = await readSqlFiles("sql")
    await driver.migrationTransaction(sqlFiles)
    await driver.closeConnection()
}

const main = async () => {
    console.log("Migraattori starting...")
    await runMigrations(postgresJs)
    console.log("Migraattori executed successfully...")
}

(async function() {
    await main();
}());