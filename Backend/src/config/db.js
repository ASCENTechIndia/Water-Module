const oracledb = require("oracledb");
const env = require("./env");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

const pools = new Map();
const poolPromises = new Map();

function getDbProfile(dbName = env.DB_DEFAULT_NAME || "db1") {
  const profile = env[dbName];

  if (!profile || !profile.user || !profile.password) {
    throw new Error(
      `Invalid or unconfigured DB profile: ${dbName}`
    );
  }

  return {
    user: profile.user,
    password: profile.password,
    connectString: env.DB_CONNECT_STRING,
  };
}

async function initDB(dbName = env.DB_DEFAULT_NAME || "db1") {
  // Already initialized
  if (pools.has(dbName)) {
    return pools.get(dbName);
  }

  // Initialization already in progress
  if (poolPromises.has(dbName)) {
    return poolPromises.get(dbName);
  }

  const poolPromise = (async () => {
    try {
      const profile = getDbProfile(dbName);

      const pool = await oracledb.createPool({
        user: profile.user,
        password: profile.password,
        connectString: profile.connectString,

        poolAlias: `pool_${dbName}`,

        poolMin: env.config?.oracle?.poolMin || 2,
        poolMax: env.config?.oracle?.poolMax || 20,
        poolIncrement: env.config?.oracle?.poolIncrement || 2,
        poolTimeout: env.config?.oracle?.poolTimeout || 60,
      });

      pools.set(dbName, pool);

      return pool;
    } catch (error) {
      // Allow retry if pool creation failed
      poolPromises.delete(dbName);

      throw error;
    }
  })();

  poolPromises.set(dbName, poolPromise);

  return poolPromise;
}

async function getConnection(
  dbName = env.DB_DEFAULT_NAME || "db1"
) {
  const pool = await initDB(dbName);

  return pool.getConnection();
}

async function closeDBPools() {
  for (const [dbName, pool] of pools.entries()) {
    try {
      await pool.close(10);
    } catch (error) {
      console.error(
        `Error closing pool ${dbName}:`,
        error
      );
    }
  }

  pools.clear();
  poolPromises.clear();
}

module.exports = {
  initDB,
  getConnection,
  closeDBPools,
  getDbProfile,
};