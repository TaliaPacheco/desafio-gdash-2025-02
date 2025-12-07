
const config = {
  mongodb: {
    url: "mongodb://mongodb:27017",
    databaseName: "weatherDB",

    options: {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  lockCollectionName: "changelog_lock",

  lockTtl: 0,

  migrationFileExtension: ".ts",

  useFileHash: false,

  moduleSystem: 'commonjs',
};

module.exports = config;
