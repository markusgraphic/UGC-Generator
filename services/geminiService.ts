import { GoogleGenAI, Part, Type, Modality, GenerateContentResponse } from "@google/genai";
import { SceneStructure } from "../types";

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateUgcPlan = async (
    planningPrompt: string,
    sceneCount: number
): Promise<any[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            scenes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        script: { type: Type.STRING },
                        image_prompt: { type: Type.STRING },
                        video_prompt: { type: Type.STRING },
                        overlay_text: { type: Type.STRING },
                    },
                    required: ['title', 'description', 'script', 'image_prompt', 'video_prompt', 'overlay_text']
                }
            }
        },
        required: ['scenes']
    };

    const response = await ai.models.generateContent({
        model,
        contents: planningPrompt,
        config: { responseMimeType: "application/json", responseSchema }
    });

    const data = JSON.parse(response.text);
    if (!data.scenes || !Array.isArray(data.scenes) || data.scenes.length !== sceneCount) {
        console.error(`Invalid AI response structure. Expected ${sceneCount} scenes, but got:`, data);
        throw new Error(`AI memberikan respon tidak valid. Diharapkan ${sceneCount} adegan, tetapi tidak diterima.`);
    }
    return data.scenes;
};


export const generateUgcImages = async (
  imagePrompts: string[],
  imageParts: { product: Part, model?: Part }
): Promise<string[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    
    const allParts = [imageParts.product];
    if (imageParts.model) {
        allParts.push(imageParts.model);
    }

    const imagePromises = imagePrompts.map(prompt => 
        ai.models.generateContent({
            model,
            contents: { parts: [...allParts, { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        }).catch(err => {
            console.error("Image generation failed for a scene:", err);
            return { error: true, message: err.message, details: err.details };
        })
    );

    const responses = await Promise.all(imagePromises);

    return responses.map((response, index) => {
        if ('error' in response) {
           throw new Error(`Pembuatan gambar gagal untuk adegan ${index + 1}.`);
        }
        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (!imagePart?.inlineData) {
            console.error("Image generation response was missing inlineData:", JSON.stringify(response, null, 2));
            throw new Error(`Pembuatan gambar gagal untuk adegan ${index + 1}.`);
        }
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    });
};

export const regenerateSingleImage = async (
    imagePrompt: string,
    imageParts: { product: Part, model?: Part }
): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    
    const allParts = [imageParts.product];
    if (imageParts.model) {
        allParts.push(imageParts.model);
    }

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [...allParts, { text: imagePrompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (!imagePart?.inlineData) {
        console.error("Image regeneration response was missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error('Gagal membuat ulang gambar.');
    }
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
};

export const generateVoiceOver = async (fullScript: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-preview-tts';

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Dengan nada yang ceria dan ramah dalam Bahasa Indonesia kasual, bacakan naskah berikut: ${fullScript}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly, consistent voice
                },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!audioPart?.inlineData?.data) {
        throw new Error('Gagal membuat voice over.');
    }
    return `data:audio/mpeg;base64,${audioPart.inlineData.data}`;
};

export const generateVideoFromImage = async (
  imageBase64: string,
  animationPrompt: string,
  script: string,
  withBackgroundMusic: boolean
): Promise<string> => {
    const ai = getAiClient();
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const imageData = imageBase64.split(',')[1];
    
    const baseInstructions = `INSTRUKSI PENTING: Pastikan video mengisi seluruh bingkai rasio aspek 9:16 tanpa bar hitam. Gayanya harus sederhana dan otentik, seperti video UGC (User-Generated Content) sungguhan. Hindari transisi sinematik yang berlebihan, zoom dramatis, atau efek kompleks. Jangan tambahkan teks, logo, atau watermark. Video harus terlihat realistis seolah direkam dengan kamera sungguhan, hindari gerakan aneh atau tidak wajar. ${withBackgroundMusic ? 'Tambahkan musik latar yang subtle dan pas dengan mood.' : 'Jangan tambahkan musik latar atau efek suara apa pun.'}`;

    const fullPrompt = `Berdasarkan gambar yang diberikan, buat klip video pendek. Naskah voice-over untuk adegan ini adalah: "${script}". Animasi yang diinginkan adalah: "${animationPrompt}". ${baseInstructions}`;

    if (!window.aistudio || !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
        if (!(await window.aistudio.hasSelectedApiKey())) {
            throw new Error("Kunci API belum dipilih. Mohon pilih kunci API di panel pengaturan.");
        }
    }

    let operation;
    try {
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: fullPrompt,
            image: {
                imageBytes: imageData,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
    } catch(e: any) {
        if (e.message.includes("API key not valid")) {
             throw new Error("Kunci API tidak valid. Mohon pilih kunci API yang valid.");
        }
        throw e;
    }


    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    // Check for errors in the operation result
    if (operation.error) {
        console.error("Video generation operation failed:", operation.error);
        throw new Error(`Pembuatan video gagal: ${operation.error.message || 'Kesalahan tidak diketahui pada server AI'}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        console.error("No video link found in operation response:", operation);
        throw new Error('Pembuatan video gagal atau tidak mengembalikan tautan. Kemungkinan konten diblokir oleh filter keamanan.');
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        console.error("Video download failed:", errorText);
        if (errorText.includes("Requested entity was not found.")) {
            throw new Error("Entitas tidak ditemukan. Kunci API Anda mungkin tidak valid.");
        }
        throw new Error(`Gagal mengunduh video yang dihasilkan. Status: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
   
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (!imagePart?.inlineData) {
        console.error("Image regeneration response was missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error('Gagal membuat ulang gambar.');
    }
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
};

export const generatePersonalBrandingContent = async (
    comments: string,
    referenceScript: string,
    additionalBrief: string,
    sceneCount: number
): Promise<{ scenes: { script: string, imagePrompt: string, overlay: string }[], images: string[] }> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';

    const prompt = `Anda adalah seorang ahli strategi konten media sosial yang berspesialisasi dalam personal branding.
    Analisis skrip referensi berikut untuk memahami hook, struktur, nada suara, dan gaya bicaranya: "${referenceScript}".
    Analisis komentar-komentar dari postingan sebelumnya ini untuk memahami pertanyaan, masalah, dan minat audiens: "${comments}".
    Berdasarkan analisis Anda, dan mengikuti instruksi tambahan ini (${additionalBrief || 'Tidak ada'}), buat konten untuk video gaya "talking-head" dengan ${sceneCount} adegan.
    Tujuannya adalah membangun merek pribadi dan melibatkan audiens berdasarkan masukan mereka.
    
    Kembalikan objek JSON yang valid yang hanya berisi satu kunci: "scenes".
    Nilai dari "scenes" harus berupa array dari ${sceneCount} objek.
    Setiap objek dalam array harus memiliki tiga kunci STRING:
    1. "script": Naskah voice-over yang singkat dan menarik (maksimal 30 kata).
    2. "imagePrompt": Prompt visual yang sangat detail untuk generator gambar AI (rasio aspek 9:16). Jelaskan ekspresi, pose, dan latar belakang orang tersebut dengan jelas. PENTING: Jangan sertakan teks atau logo apa pun pada gambar.
    3. "overlay": Saran teks overlay dalam Bahasa Indonesia yang kasual dan natural. Teks ini harus berfungsi sebagai hook, ringkasan naskah, atau poin kunci yang menarik untuk audiens (maksimal 1 kalimat singkat).`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            scenes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        script: { type: Type.STRING },
                        image_prompt: { type: Type.STRING },
                        overlay: { type: Type.STRING },
                    },
                    required: ['script', 'image_prompt', 'overlay']
                }
            }
        },
        required: ['scenes']
    };

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    });

    const responseData = JSON.parse(response.text);

    const scenesFromAI = responseData.scenes;
    if (!scenesFromAI || !Array.isArray(scenesFromAI) || scenesFromAI.length !== sceneCount) {
        console.error(`Invalid AI response structure. Expected an array of ${sceneCount} scenes, but got:`, JSON.stringify(responseData, null, 2));
        throw new Error(`AI gagal menghasilkan struktur data yang valid. Harap coba lagi.`);
    }

    const scenesData: { script: string, imagePrompt: string, overlay: string }[] = [];
    for (let i = 0; i < scenesFromAI.length; i++) {
        const scene = scenesFromAI[i];
        const imagePrompt = scene.image_prompt;

        if (!imagePrompt || typeof imagePrompt !== 'string' || imagePrompt.trim() === '') {
            console.error(`Incomplete AI response for PB scene ${i + 1}: 'image_prompt' is missing or empty. Full response:`, JSON.stringify(responseData, null, 2));
            throw new Error(`AI gagal menghasilkan prompt gambar yang valid untuk Adegan ${i + 1}. Respon tidak lengkap atau salah format.`);
        }

        scenesData.push({
            script: scene.script || '',
            imagePrompt: imagePrompt,
            overlay: scene.overlay || '',
        });
    }

    const imagePromises = scenesData.map(scene => generateImageFromPrompt(scene.imagePrompt).catch(err => {
        console.error("Image generation failed for a PB scene:", err);
        return { error: true, message: err.message };
    }));
    
    const imageResults = await Promise.all(imagePromises);
    const images = imageResults.map((result, index) => {
        if (typeof result === 'object' && result.error) {
            throw new Error(`Pembuatan gambar gagal untuk adegan PB ${index + 1}.`);
        }
        return result as string;
    });

    return { scenes: scenesData, images };
};


export { fileToGenerativePart };
