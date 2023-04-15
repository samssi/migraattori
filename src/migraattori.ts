import {postgresJs, sql} from "./db/driver/postgresJs";
import {readSqlFiles, SQLFile} from "./input/fileReader";
import {DatabaseDriver} from "./db/driver";
import * as log from "./output/log"

const runMigrations = async (driver: DatabaseDriver) => {
    const migrationFiles = await readSqlFiles("sql")
    const establishmentFiles = await readSqlFiles("base/sql/postgres")
    await driver.establishMigrationDatabase(establishmentFiles)
    await driver.migrationTransaction(migrationFiles)
    await driver.closeConnection()
}

const main = async () => {
    log.info("Migraattori starting...")
    await runMigrations(postgresJs)
    log.info("Migraattori executed successfully...")
}

(async function() {
    await main();
}());