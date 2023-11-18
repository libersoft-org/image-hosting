const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { Common } = require('./common.js');

class API {
 constructor() {
  this.apiMethods = {
   upload: this.upload
  };
 }

 async processAPI(name, params) {
  //console.log('API request: ', name);
  //console.log('Parameters: ', params);
  const method = this.apiMethods[name];
  if (method) return await method.call(this, params);
  else return { error: 1, message: 'API not found' };
 }

 upload(p = {}) {
  if (!p || !p.type) return { error: 1, message: 'Error while upload' }
  const ext = this.getExtByMIME(p.type);
  if (!ext) return { error: 2, message: 'Unknown MIME type' }
  const file = this.getRandomHash() + '.' + ext;
  if (!this.base64ToFile(p.data, path.join(Common.settings.other.data, file))) return { error: 3, message: 'Error while writing the file to storage' }
  return { error: 0, id: p.id, file: file }
 }

 getRandomHash() {
  return crypto.createHash('sha1').update(crypto.randomBytes(20).toString('hex')).digest('hex');
 }

 getExtByMIME(mime) {
  const mimeMap = {
   'image/apng': 'apng',
   'image/avif': 'avif',
   'image/bmp': 'bmp',
   'image/gif': 'gif',
   'image/vnd.microsoft.icon': 'ico',
   'image/jpeg': 'jpg',
   'image/png': 'png',
   'image/svg+xml': 'svg',
   'image/tiff': 'tif',
   'image/webp': 'webp',
  };
  return mimeMap[mime] || null;
 }

 async base64ToFile(base64data, filePath) {
  try {
   const data = Buffer.from(base64data, 'base64');
   await fs.mkdir(path.dirname(filePath), { recursive: true });
   await fs.writeFile(filePath, data);
   return true;
  } catch {
   return false;
  }
 }
}

module.exports = API;
