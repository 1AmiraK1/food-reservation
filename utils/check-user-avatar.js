const fs = require('fs');
const path = require('path');

const checkUserImage = (avatar) => {
  if (!avatar) return '/image/profile.jpg';

  const filePath = path.join(__dirname, '../public', avatar);

  if (!fs.existsSync(filePath)) {
    return '/image/profile.jpg';
  }
  return avatar.startsWith('/image') ? avatar : '/image/uploads/profile/' + avatar;
};

module.exports = { checkUserImage };
