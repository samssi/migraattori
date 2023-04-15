import {sql} from "./db/postgresDb";
import {readSqlFiles} from "./input/fileReader";
import {PostgresType, TransactionSql} from "postgres";

const fileMigrations = async (sql: TransactionSql<Record<string, PostgresType>>) => {
    const sqlFiles = await readSqlFiles("sql")

    for (const sqlFile of sqlFiles) {
        await sql.unsafe(sqlFile.content)
    }

}

const migrationTransaction = async () => {
    await sql.begin(async sql => {
        await fileMigrations(sql)
    })
}



const main = async () => {
    console.log("Migraattori starting...")
    await migrationTransaction()
    await sql.end()
}

(async function() {
    await main();
}());