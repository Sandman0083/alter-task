const db = require("../configs/db");
async function generateInsertStatement(tableName, req) {
  // Extract column names
  const columns = Object.keys(req.body);
  const values = Object.values(req.body);

  // Generate SQL query with placeholders
  const columnList = columns.map((column) => `\`${column}\``).join(", ");
  const placeholders = columns.map(() => "?").join(", ");

  // Final SQL query
  const sql = `INSERT INTO \`${tableName}\` (${columnList}) VALUES (${placeholders});`;
  await db(sql, values);

  // return sql;
}

async function generateUpdateStatement(tableName, req, whereCondition) {
  const updateColumns = Object.keys(req.body).filter(
    (key) => key !== whereCondition
  );
  const updateValues = updateColumns.map((key) => req.body[key]);

  const whereConditionValue = req.body[whereCondition];

  const setClause = updateColumns
    .map((column) => `\`${column}\` = ?`)
    .join(", ");

  const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`${whereCondition}\` = ?;`;

  const finalValues = [...updateValues, whereConditionValue];
  console.log("Final Query:", sql);
  console.log("Values:", finalValues);

  await db(sql, finalValues);
}

module.exports = { generateInsertStatement, generateUpdateStatement };
