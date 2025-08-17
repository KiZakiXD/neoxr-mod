const fs = require('fs');
const stable = require('json-stable-stringify');

module.exports = class LocalDB {
   constructor(db) {
      this.file = db || 'database';
   }

   fetch = async () => {
      try {
         if (!fs.existsSync(`./${this.file}.json`)) return {};
         const json = JSON.parse(fs.readFileSync(`./${this.file}.json`, 'utf-8'));
         
         // Validasi
         if (!json || typeof json !== 'object') {
            console.error('[LocalDB] Invalid data format in database file.');
            return this.restoreBackup(); 
         }
         return json || {};
      } catch (e) {
         console.error(`[LocalDB] Error fetching database: ${e.message}`);
         return this.restoreBackup(); 
      }
   };

   // Nyimpen
   save = async (data) => {
      try {
         const database = data || global.db;

         // Validasi sebelum nyimpen 
         if (!database || typeof database !== 'object') {
            console.error('[LocalDB] Invalid database structure. Aborting save.');
            return;
         }

         const tempFile = `./${this.file}.tmp`;
         fs.writeFileSync(tempFile, stable(database), { flag: 'w' }); 
         fs.renameSync(tempFile, `./${this.file}.json`); 
         fs.writeFileSync(`./${this.file}.bak`, stable(database), { flag: 'w' }); // Backup Database
      } catch (e) {
         console.error(`[LocalDB] Error saving database: ${e.message}`);
      }
   };

   // Kalau Db Rusak / Eror Ini Buat Restore Otomatis 
   restoreBackup = () => {
      try {
         if (!fs.existsSync(`./${this.file}.bak`)) {
            console.error('[LocalDB] Backup file not found. Returning empty database.');
            return {};
         }

         const backup = JSON.parse(fs.readFileSync(`./${this.file}.bak`, 'utf-8'));
         console.warn('[LocalDB] Restoring database from backup.');
         return backup || {};
      } catch (e) {
         console.error(`[LocalDB] Error restoring backup: ${e.message}`);
         return {};
      }
   };
};
