const cloudinary = require('cloudinary').v2;

function configureCloudinary() {
  const {
    CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  } = process.env;

  // 1. If CLOUDINARY_URL is provided directly (e.g. cloudinary://key:secret@cloudname)
  if (CLOUDINARY_URL && CLOUDINARY_URL.startsWith('cloudinary://')) {
    cloudinary.config({
      cloudinary_url: CLOUDINARY_URL,
      secure: true,
    });
    return { enabled: true, cloudinary };
  }

  // 2. If separate environment variables are provided
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    // Avoid placeholder values
    if (
      CLOUDINARY_CLOUD_NAME.includes('your_') ||
      CLOUDINARY_API_KEY.includes('your_') ||
      CLOUDINARY_API_SECRET.includes('your_')
    ) {
      return { enabled: false, cloudinary: null };
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME.trim(),
      api_key: CLOUDINARY_API_KEY.trim(),
      api_secret: CLOUDINARY_API_SECRET.trim(),
      secure: true,
    });
    return { enabled: true, cloudinary };
  }

  return { enabled: false, cloudinary: null };
}

async function verifyCloudinaryConnection() {
  const { enabled, cloudinary: instance } = configureCloudinary();
  if (!enabled) {
    return { enabled: false, message: 'Cloudinary not configured. Using Local Media Storage.' };
  }
  try {
    const res = await instance.api.ping();
    return { enabled: true, status: res.status, message: 'Connected to Cloudinary successfully!' };
  } catch (err) {
    return { enabled: false, error: err.message, message: `Cloudinary ping failed: ${err.message}` };
  }
}

module.exports = { configureCloudinary, verifyCloudinaryConnection };

