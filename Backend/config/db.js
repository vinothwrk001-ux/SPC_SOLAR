const mongoose = require('mongoose');

// Default MongoDB Atlas Connection URI
const ATLAS_URI = 'mongodb+srv://spctechnologycoimbatore_db_user:cydxOLUpRgL47RxI@cluster0.izowxop.mongodb.net/spcsolar?retryWrites=true&w=majority';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/spcsolar';

/**
 * Determines whether to connect to Local MongoDB or Atlas Cloud
 * @param {string} [inputUri] - Optional override URI
 * @returns {{ uri: string, isLocal: boolean, label: string }}
 */
const resolveMongoUri = (inputUri) => {
  const uri = (inputUri || process.env.MONGO_URI || '').trim();

  // If no URI is provided, default to Atlas
  if (!uri) {
    return {
      uri: ATLAS_URI,
      isLocal: false,
      label: 'MongoDB Atlas (Default)'
    };
  }

  // If localhost or 127.0.0.1 is found, connect locally
  const isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');
  if (isLocal) {
    return {
      uri,
      isLocal: true,
      label: 'Local MongoDB'
    };
  }

  // Otherwise, connect to Atlas / remote MongoDB
  let atlasUri = uri;
  // Ensure database name 'spcsolar' is included if missing in Atlas URI
  if (atlasUri.startsWith('mongodb+srv://')) {
    const [base, query] = atlasUri.split('?');
    if (base.endsWith('/')) {
      atlasUri = `${base}spcsolar${query ? `?${query}` : '?retryWrites=true&w=majority'}`;
    }
  }

  return {
    uri: atlasUri,
    isLocal: false,
    label: 'MongoDB Atlas'
  };
};

const connectDB = async (customUri) => {
  const { uri, label } = resolveMongoUri(customUri);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ [MongoDB] Connected successfully to ${label}!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error (${label}): ${error.message}`);
    console.log(`🔄 [MongoDB] Retrying connection in 5 seconds...`);
    setTimeout(() => connectDB(customUri), 5000);
  }
};

module.exports = connectDB;
module.exports.resolveMongoUri = resolveMongoUri;

