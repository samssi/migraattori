import postgres from "postgres";

export const sql = postgres({
    host: "192.168.1.100",
    port: 5432,
    database: "test",
    username: "migraattori",
    password: "migraattori"
})