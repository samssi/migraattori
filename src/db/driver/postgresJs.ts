import postgres from "postgres";
import {SQLFile} from "../../input/fileReader";
import {DatabaseDriver} from "../driver";

export const sql = postgres({
    host: "192.168.1.100",
    port: 5432,
    database: "test",
    username: "migraattori",
    password: "migraattori"
})

const executeSqlFiles = async (sqlFiles: SQLFile[]) => {
    for (const sqlFile of sqlFiles) {
        await sql.unsafe(sqlFile.content)
    }
}

export const postgresJs: DatabaseDriver = {
    async establishMigrationDatabase(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => await executeSqlFiles(sqlFiles))
    },

    async migrationTransaction(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => await executeSqlFiles(sqlFiles))
    },
    async closeConnection(): Promise<void> {
        await sql.end()
    }
}