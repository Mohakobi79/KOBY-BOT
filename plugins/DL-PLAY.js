import yts from 'yt-search'; // Pastikan Anda sudah menginstal yt-search

const handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukkan judul lagu', m);
    m.reply(wait);
    
    let res;
    try {
        res = await yts(text);
    } catch (error) {
        console.error(error); // Log error ke konsol untuk debugging
        return conn.reply(m.chat, 'Terjadi kesalahan saat melakukan pencarian, silahkan coba lagi nanti', m);
    }

    if (!res || !res.videos || res.videos.length === 0) {
        return conn.reply(m.chat, 'Tidak ada hasil ditemukan', m);
    }

    let hsl = res.videos[0]; // Ambil video pertama dari hasil pencarian
    let url = hsl.url;
    let thumbnail = hsl.thumbnail;
    let title = hsl.title;
    let duration = hsl.timestamp;
    let views = hsl.views;
    let author = hsl.author.name;

    try {
        // Mengirim gambar thumbnail dengan informasi detail
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: `*Judul:* ${title}\n*Durasi:* ${duration}\n*Views:* ${views}\n*Author:* ${author}\n*Link:* ${url}`,
        }, { quoted: m });

        // Mengirim audio menggunakan sendMessage
        await conn.sendMessage(m.chat, {
            audio: { url: `http://alibaka.botwaaa.web.id:8081/yt/dl?url=${encodeURIComponent(url)}` },
            mimetype: 'audio/mp4',
            ptt: true, // Set true jika ingin mengirim sebagai pesan suara
        }, { quoted: m });

        
    } catch (e) {
        console.error(e); // Log error ke konsol untuk debugging
        return conn.reply(m.chat, 'Terjadi kesalahan saat memuat data, silahkan coba lagi nanti', m);
    }
};

handler.help = ["play <judul lagu>"];
handler.tags = ["downloader"];
handler.command = ["play"];

export default handler;