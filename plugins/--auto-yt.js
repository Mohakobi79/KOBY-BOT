import { ytmp4 } from 'ruhend-scraper';

let handler = async (m, { conn }) => {
    // التحقق من أن الرسالة تحتوي على رابط YouTube صالح
    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeUrlPattern.test(m.text.trim())) {
        return; // إنهاء العملية إذا لم تكن الرسالة تحتوي على رابط صالح
    }

    const videoUrl = m.text.trim();

    // إرسال رسالة "جاري التحميل..."
    const pingMsg = await conn.sendMessage(
        m.chat,
        { text: "⏳ جاري التحميل، الرجاء الانتظار..." },
        { quoted: m }
    );

    try {
        // جلب بيانات الفيديو
        const { title, video, author, description, duration, views, upload } = await ytmp4(videoUrl);

        // تجهيز النص
        let caption = `𝐘𝐎𝐔𝐓𝐔𝐁𝐄\n`;
        caption += `⭔ *Title:* ${title}\n`;
        caption += `⭔ *Author:* ${author}\n`;
        caption += `⭔ *Description:* ${description}\n`;
        caption += `⭔ *Duration:* ${duration}\n`;
        caption += `⭔ *Views:* ${views}\n`;
        caption += `⭔ *Upload:* ${upload}`;

        // إرسال الفيديو
        await conn.sendFile(m.chat, video, `${title}.mp4`, caption, m);

        // تحديث الرسالة
        await conn.sendMessage(
            m.chat,
            { text: "✅ تم إرسال الفيديو بنجاح!" },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error during YouTube download:", error);

        // إخطار المستخدم بالخطأ
        await conn.sendMessage(
            m.chat,
            { text: `⚠️ حدث خطأ أثناء تحميل الفيديو. تأكد من الرابط وحاول مرة أخرى.` },
            { quoted: m }
        );
    }
};

// إعدادات المعالج
handler.tags = ['downloader'];
handler.customPrefix = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/; // قبول الرسائل التي تحتوي على رابط فقط
handler.command = new RegExp(); // بدون أمر محدد

export default handler;