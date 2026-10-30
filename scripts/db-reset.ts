/**
 * Re-creates the database from src/data (catalogue + products).
 *   npm run db:reset            → wipes products/categories/ranges and re-seeds (keeps enquiries)
 *   npm run db:reset -- --all   → deletes the whole database file, including enquiries
 *
 * NOTE: This script is disabled for MySQL. Use the admin panel to manage data.
 */
console.log("db-reset.ts is disabled for MySQL. Use the admin panel to manage data.");
process.exit(0);
