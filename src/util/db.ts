// db.js
import postgres from 'postgres'

const sql = postgres(
    `postgres://${process.env.SQL_USER}:${process.env.SQL_PASSWORD}@${process.env.SQL_ADDR}/postgres`
)

export default sql
