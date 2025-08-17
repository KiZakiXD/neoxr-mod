const axios = require('axios');
const FormData = require('form-data');
const fs = require("node:fs");

async function Upload(imageBuffer) {
    try {
        const form = new FormData();
        form.append('file', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        const headers = {
            ...form.getHeaders(),
            'Content-Length': form.getLengthSync()
        };

        const response = await axios.post('https://www.pic.surf/upload.php', form, { headers });
        const identifier = response.data.identifier;
        return `https://www.pic.surf/${identifier}`;
    } catch (error) {
        throw new Error(`Upload gagal: ${error.response ? error.response.data : error.message}`);
    }
}

module.exports = { Upload }
