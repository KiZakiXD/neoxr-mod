const cheerio = require('cheerio');
const axios = require('axios');

exports.CKata = async (query) => {
  try {
    const res = await axios.get(`https://kbbi.web.id/${query}`);
    const $ = cheerio.load(res.data);
    const arti = $('div#d1').text().trim();

    if (!arti) {
      return {
        creator: global.creator || 'Follow Instagtam : @iamkizakixd',
        status: false,
      };
    }

    return {
      creator: global.creator || 'Follow Instagtam : @iamkizakixd',
      status: true,
      arti: arti,
    };
  } catch (err) {
    console.error(err);
    return {
      creator: global.creator || 'Follow Instagtam : @iamkizakixd',
      status: false,
    };
  }
};
