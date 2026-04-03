const ImageKit = require('imagekit');

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload image buffer to ImageKit
 * @param {Buffer} buffer - Image buffer from multer
 * @param {string} fileName - Name for the file
 * @param {string} folder - Folder path in ImageKit
 * @returns {Promise} Upload result with url and fileId
 */
exports.uploadToImageKit = (buffer, fileName, folder) => {
  const start = Date.now();
  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ImageKit Upload start: ${(buffer.length / 1024) | 0}KB`);
  }

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: buffer, // Buffer or base64 string
        fileName: fileName,
        folder: folder,
        useUniqueFileName: true,
      },
      (error, result) => {
        if (process.env.NODE_ENV === 'development') {
          const duration = (Date.now() - start) / 1000;
          console.log(`⏱️ ImageKit Upload done: ${duration.toFixed(1)}s`);
        }
        if (error) {
          console.error('ImageKit upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.url,
            fileId: result.fileId,
            filePath: result.filePath,
            name: result.name,
          });
        }
      },
    );
  });
};

/**
 * Delete image from ImageKit by fileId
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise} Deletion result
 */
exports.deleteFromImageKit = async (fileId) => {
  try {
    console.log(`Attempting to delete image with file ID: ${fileId}`);

    const result = await imagekit.deleteFile(fileId);

    console.log(`Deleted image successfully: ${fileId}`);
    return result;
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      console.log('Image not found on ImageKit');
      return null;
    }
    console.error('Error deleting from ImageKit:', error);
    throw error;
  }
};

/**
 * Extract file ID from ImageKit URL
 * @param {string} imageUrl - ImageKit image URL
 * @returns {string|null} File ID or null if not found
 */
exports.extractFileIdFromUrl = (imageUrl) => {
  try {
    // ImageKit URLs typically contain fileId in the path or as a parameter
    // Example: https://ik.imagekit.io/your_id/path/to/image.jpg
    const urlParts = imageUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExtension.split('.')[0];
    return fileName;
  } catch (error) {
    console.error('Error extracting file ID from URL:', error);
    return null;
  }
};

/**
 * Get image details from ImageKit
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise} File details
 */
exports.getImageDetails = async (fileId) => {
  try {
    const result = await imagekit.getFileDetails(fileId);
    return result;
  } catch (error) {
    console.error('Error getting image details from ImageKit:', error);
    throw error;
  }
};

/**
 * List files from ImageKit folder
 * @param {string} path - Folder path
 * @param {number} limit - Number of files to list
 * @returns {Promise} List of files
 */
exports.listFiles = async (path = '/', limit = 100) => {
  try {
    const result = await imagekit.listFiles({
      path: path,
      limit: limit,
    });
    return result;
  } catch (error) {
    console.error('Error listing files from ImageKit:', error);
    throw error;
  }
};

module.exports.imagekit = imagekit;
