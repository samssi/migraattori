import postgres from "postgres";
import {SQLFile} from "../../input/fileReader";
import {DatabaseDriver, defaultMigrationSchemaName, migrationHistoryTableName} from "../driver";
import * as log from "../../output/log"

export const sql = postgres({
    host: "192.168.1.100",
    port: 5432,
    database: "test",
    username: "migraattori",
    password: "migraattori"
})

const executeSqlFiles = async (sql: postgres.TransactionSql<Record<string, postgres.PostgresType>>, sqlFiles: SQLFile[]) => {
    for (const sqlFile of sqlFiles) {
        await sql.unsafe(sqlFile.content)
    }
}

const migrationTablesPresent = async (schemaName: string, tableName: string) => {
    interface Result {
        exists: boolean
    }

    const [result] = await sql<[Result?]>`SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = ${ schemaName }
        AND table_name   = ${ tableName }
    )`
    if (!result) {
        throw new Error("Couldn't access migraattori schema/tables...")
    }

    return result.exists
}

export const postgresJs: DatabaseDriver = {
    async establishMigrationDatabase(sqlFiles: SQLFile[]): Promise<void> {
        const continueMigrations = await migrationTablesPresent(defaultMigrationSchemaName, migrationHistoryTableName)

        if (continueMigrations) {
            log.debug("Migration tables present. Continuing on with the migrations")
        } else {
            await sql.begin(async sql => {
                log.info("First run of migraattori detected. Establishing migraattori schema and system tables...")
                await executeSqlFiles(sql, sqlFiles);
            })
        }
    },

    async migrationTransaction(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => {
            log.info("Running migrations")
            await executeSqlFiles(sql, sqlFiles);
        })
    },
    async closeConnection(): Promise<void> {
        await sql.end()
    }
}