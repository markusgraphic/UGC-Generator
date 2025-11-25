

import { SceneStructure } from './types';

export const SCENE_STRUCTURES: SceneStructure[] = [
  {
    id: 'problem-solution',
    name: 'Problem/Solution (Default)',
    description: 'Classic marketing funnel: hook, problem, solution, CTA.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang ahli strategi konten untuk iklan video media sosial. Buat rencana konten untuk video ${sceneCount} adegan dengan struktur "Problem/Solution" untuk produk bernama "${productName}".
      Struktur dasarnya adalah: Hook -> Masalah -> Solusi -> Ajakan Bertindak (CTA). Sebarkan konsep ini secara merata di ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membuat video UGC (User-Generated Content) yang otentik dan menarik.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek.
      Setiap objek dalam array harus memiliki enam kunci STRING:
      1. "title": Judul singkat untuk adegan (misal: "Masalah Kulit Kusam").
      2. "description": Deskripsi singkat tentang tujuan adegan (misal: "Menunjukkan masalah yang dihadapi audiens").
      3. "script": Naskah voice-over dalam Bahasa Indonesia yang kasual dan singkat (maksimal 30 kata).
      4. "image_prompt": Prompt visual yang detail untuk AI generator gambar (rasio aspek 9:16). Jelaskan subjek, latar belakang, dan gaya. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks atau logo apa pun pada gambar.
      5. "video_prompt": Saran prompt animasi video yang singkat (misal: "Animasi zoom in perlahan pada produk").
      6. "overlay_text": Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan (maksimal 1 kalimat singkat).`
  },
  {
    id: 'fashion-lifestyle',
    name: 'Fashion / Lifestyle',
    description: 'Showcase apparel or accessories in stylish settings.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang direktur kreatif untuk merek fashion. Buat rencana konten untuk video fashion ${sceneCount} adegan yang menampilkan produk "${productName}".
      Struktur yang disarankan: Tampilan Penuh -> Detail Bahan -> Gaya Hidup -> CTA. Adaptasikan dan kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membuat video yang stylish dan aspirasional.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia kasual, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  },
   {
    id: 'digital-service',
    name: 'Digital / Service',
    description: 'Perfect for apps, software, or service-based offerings.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang manajer pemasaran produk digital. Buat rencana konten untuk video ${sceneCount} adegan yang mempromosikan layanan atau aplikasi "${productName}".
      Struktur yang disarankan: Masalah "Sebelum" -> Pengenalan UI -> Hasil "Sesudah" -> CTA. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membuat video penjelasan yang jelas dan meyakinkan.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia jelas, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  },
   {
    id: 'food-beverage',
    name: 'Food / Beverage',
    description: 'Tempting shots for food products or restaurants.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang fotografer makanan dan videografer. Buat rencana konten untuk video ${sceneCount} adegan yang membuat "${productName}" terlihat sangat lezat.
      Struktur yang disarankan: Menggugah Selera -> Detail Produk -> Momen Menikmati -> CTA. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membuat video yang menggugah selera dan tak tertahankan.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia deskriptif, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  },
  {
    id: 'vlog-review',
    name: 'Vlog Ulasan Natural',
    description: 'Gaya ulasan produk yang jujur dan otentik.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang konten kreator yang ahli dalam ulasan produk. Buat rencana konten untuk video ulasan bergaya vlog ${sceneCount} adegan untuk produk "${productName}".
      Struktur yang disarankan: Perkenalan -> Kesan Pertama -> Demo Fitur -> Rekomendasi. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membuat ulasan yang terasa jujur, dapat dipercaya, dan personal.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia santai, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  },
  {
    id: 'unboxing',
    name: 'Unboxing Produk',
    description: 'Menangkap keseruan membuka produk baru.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang influencer unboxing. Buat rencana konten untuk video unboxing ${sceneCount} adegan yang seru untuk produk "${productName}".
      Struktur yang disarankan: Paket Tiba -> Momen Membuka -> Detail Produk -> Ekspresi Gembira. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Menangkap dan membagikan kegembiraan saat membuka produk baru.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia antusias, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  },
  {
    id: 'storytelling-camera',
    name: 'Storytelling (Depan Kamera)',
    description: 'Membangun koneksi personal melalui cerita.',
    requiredParts: ['product', 'model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang pencerita yang handal. Buat rencana konten untuk video storytelling ${sceneCount} adegan di mana "${productName}" adalah bagian penting dari cerita.
      Struktur yang disarankan: Hook Cerita -> Titik Balik (Penemuan) -> Transformasi -> Rekomendasi Personal. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membangun koneksi emosional dengan audiens melalui cerita yang menyentuh.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia personal, maks 30 kata), "image_prompt", "video_prompt", dan "overlay_text".

      Untuk "image_prompt", berikan instruksi yang sangat detail dengan ATURAN KETAT berikut:
      1.  KONSISTENSI: Pastikan visual model (tokoh) dan produk (jika ditampilkan) KONSISTEN di semua adegan.
      2.  LATAR LOKAL: Gunakan latar belakang yang khas dan familiar di INDONESIA (misalnya: interior rumah modern, kafe lokal, atau pemandangan alam Indonesia yang relevan).
      3.  FIGUR LOKAL: Jika ada figur tambahan yang dibutuhkan, pastikan mereka juga terlihat seperti orang INDONESIA.
      4.  VISUAL: Jelaskan subjek, latar belakang, gaya, dan komposisi (rasio aspek 9:16).
      5.  STERIL: JANGAN sertakan teks atau logo apa pun pada gambar.

      Untuk "overlay_text", berikan saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan (maksimal 1 kalimat singkat).`
  },
  {
    id: 'talking-head-awareness',
    name: 'Talking Head (Awareness)',
    description: 'Gaya personal untuk membangun brand awareness, bukan jualan.',
    requiredParts: ['model'],
    planningPrompt: (productName, additionalBrief, sceneCount) => `Anda adalah seorang ahli komunikasi yang membangun brand awareness. Buat rencana konten untuk video "talking head" ${sceneCount} adegan yang berfokus pada topik terkait "${productName}", bukan untuk jualan langsung.
      Struktur yang disarankan: Sapaan & Hook -> Insight Utama -> Koneksi Personal -> Ajakan Interaksi. Kembangkan struktur ini untuk ${sceneCount} adegan.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}

      Tujuan: Membangun komunitas dan koneksi dengan audiens secara otentik.

      Kembalikan objek JSON yang valid HANYA dengan satu kunci: "scenes".
      Nilai dari "scenes" harus berupa array dari ${sceneCount} objek dengan enam kunci STRING: "title", "description", "script" (Bahasa Indonesia tulus, maks 30 kata), "image_prompt" (detail, 9:16, tanpa teks/logo), "video_prompt" (saran animasi), dan "overlay_text" (Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau menyorot fitur kunci yang relevan dengan tujuan adegan - maksimal 1 kalimat singkat).`
  }
];