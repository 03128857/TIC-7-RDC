/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini Client successfully initialized on backend server.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini features will run in Demo/Simulation mode.");
}

// --- API ENDPOINTS ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// 1. Generate Ad Copy (Headline, Description, Colors, Image Prompt)
app.post("/api/gemini/generate-ad", async (req, res) => {
  const { brandName, productDescription, websiteUrl, callToAction, stylePreset } = req.body;

  if (!brandName || !productDescription) {
    return res.status(400).json({ error: "Le nom de la marque et la description sont requis." });
  }

  if (!ai) {
    // Simulated/Demo response if Gemini Key is missing
    console.log("Running in simulated mode for Ad copy generation.");
    const demoPayloads: Record<string, any> = {
      vibrant: {
        headline: "Innovez dès aujourd'hui !",
        subheading: "L'outil créatif pour propulser vos projets scolaires.",
        description: `Découvrez la puissance de ${brandName}. ${productDescription.slice(0, 80)}... Conçu pour les élèves créatifs de la 7ème année.`,
        buttonText: callToAction || "Essayer Maintenant",
        primaryColor: "#ec4899", // Pink
        secondaryColor: "#3b82f6", // Blue
        backgroundColor: "#1e1b4b", // Dark Indigo
        textColor: "#ffffff",
        imagePrompt: `A vibrant, modern, isometric 3D illustration of educational tech devices with floating icons representing learning and artificial intelligence, glowing accents, clean vector graphic style.`
      },
      minimalist: {
        headline: "La simplicité réinventée.",
        subheading: "Élégance, pureté et efficacité au service de vos idées.",
        description: `Explorez la simplicité de ${brandName}. ${productDescription.slice(0, 80)}... Un design pensé pour l'essentiel.`,
        buttonText: callToAction || "En savoir plus",
        primaryColor: "#111827", // Dark Gray
        secondaryColor: "#6b7280", // Gray
        backgroundColor: "#f9fafb", // Off-white
        textColor: "#111827",
        imagePrompt: `A sleek, elegant minimalist flat-lay design showing a stylish laptop, a clean notebook and a single cup of coffee, high-contrast black and white visual aesthetic, professional corporate layout.`
      }
    };
    const selectedPreset = demoPayloads[stylePreset] || demoPayloads["vibrant"];
    return res.json(selectedPreset);
  }

  try {
    const prompt = `
      You are an expert advertising copywriter and graphic designer.
      Generate banner ad assets and colors for a product/brand based on these inputs:
      - Brand Name: "${brandName}"
      - Product Description: "${productDescription}"
      - Target Website URL: "${websiteUrl || 'not provided'}"
      - Style Preset requested: "${stylePreset}" (Options: modern, vibrant, minimalist, corporate, playful, tech)
      - Call to Action button text requested: "${callToAction || 'Automatic'}"

      Generate a cohesive marketing payload with:
      1. headline: Catchy punchy headline (max 40 characters).
      2. subheading: Supporting subtitle (max 65 characters).
      3. description: A clear marketing description or value proposition (max 120 characters).
      4. buttonText: Perfect call to action text (max 20 characters).
      5. primaryColor: Hex code for the primary brand color.
      6. secondaryColor: Hex code for secondary accent color.
      7. backgroundColor: Hex code for the ad background (must contrast perfectly with text).
      8. textColor: Hex code for the primary text (must be highly readable against the background).
      9. imagePrompt: A detailed, high-quality image generation prompt matching the brand style and product description. It must describe a clean, professional, context-appropriate composition (avoid text or words inside the generated image, focus on symbolic visual metaphors).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "headline",
            "subheading",
            "description",
            "buttonText",
            "primaryColor",
            "secondaryColor",
            "backgroundColor",
            "textColor",
            "imagePrompt"
          ],
          properties: {
            headline: { type: Type.STRING },
            subheading: { type: Type.STRING },
            description: { type: Type.STRING },
            buttonText: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error generating ad copy:", error);
    res.status(500).json({ error: "Erreur lors de la génération de l'annonce par l'IA.", details: error.message });
  }
});

// 2. Generate Image using Gemini Image Models
app.post("/api/gemini/generate-image", async (req, res) => {
  const { prompt, aspectRatio, imageSize, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Le prompt de l'image est requis." });
  }

  // Determine standard model to use based on requested model or guidelines
  const selectedModel = model || "gemini-3.1-flash-image";
  const selectedAspectRatio = aspectRatio || "1:1";
  const selectedImageSize = imageSize || "1K";

  if (!ai) {
    // If Gemini key is missing, return a high-quality placeholder image representing the prompt
    console.log("Running in simulated mode for Image generation.");
    // Generate a beautiful, clean abstract placeholder pattern based on keywords
    const seed = encodeURIComponent(prompt.slice(0, 15));
    // Let's return a nice picsum URL that works directly in <img> referrerPolicy="no-referrer"
    // To pretend it's a generated base64, we will fetch it or just return a structure with simulated url
    // For local reliability, we can return a SVG or a direct placeholder URL
    const demoUrl = `https://picsum.photos/seed/${seed}/800/600`;
    return res.json({ imageUrl: demoUrl, isSimulated: true });
  }

  try {
    console.log(`Generating image using ${selectedModel} (Ratio: ${selectedAspectRatio}, Size: ${selectedImageSize})`);
    
    // Call Gemini Image Generator as defined in the skill guidelines
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: selectedAspectRatio,
          imageSize: selectedImageSize
        }
      }
    });

    let base64Image = "";
    const parts = response.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (!base64Image) {
      // Check if there was any text feedback or if the response failed
      const feedbackText = parts.find(p => p.text)?.text || "No image part returned.";
      throw new Error(`Failed to retrieve generated image bytes. feedback: ${feedbackText}`);
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;
    res.json({ imageUrl, isSimulated: false });
  } catch (error: any) {
    console.error("Error generating image:", error);
    // Graceful fallback to placeholder image on quota or billing issues
    const seed = encodeURIComponent(prompt.slice(0, 12));
    const fallbackUrl = `https://picsum.photos/seed/${seed}/800/600`;
    res.json({ 
      imageUrl: fallbackUrl, 
      isSimulated: true,
      warning: "Note: Utilisation d'un visuel de démonstration (clé API de test ou limite atteinte)." 
    });
  }
});

// 3. Pedagogical Assistant Chat (EduCompagnon)
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, lessonContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Le message est requis." });
  }

  if (!ai) {
    // Simulated Pedagogical Chat Bot
    console.log("Running in simulated mode for chat.");
    let reply = "Bonjour ! Je suis ton tuteur virtuel EduCompagnon. Comment puis-je t'aider aujourd'hui dans ton cours de MTIC ?";
    const textLower = message.toLowerCase();
    
    // Check if they are asking for a procedure
    const isProcedureRequest = textLower.includes("procédure") || 
                              textLower.includes("comment faire") || 
                              textLower.includes("comment") || 
                              textLower.includes("étape") || 
                              textLower.includes("guide") ||
                              textLower.includes("créer") ||
                              textLower.includes("renommer") ||
                              textLower.includes("allumer") ||
                              textLower.includes("démarrer") ||
                              textLower.includes("copier") ||
                              textLower.includes("coller");

    if (isProcedureRequest) {
      if (textLower.includes("dossier") || textLower.includes("créer")) {
        reply = `Voici la **Procédure pour créer un dossier** sur ton ordinateur :

1. 💻 **Fais un clic droit** avec ta souris sur un espace vide du Bureau ou dans une fenêtre.
2. 📁 Dans le menu qui apparaît, glisse ta souris sur l'option **"Nouveau"**.
3. 🆕 Clique ensuite sur **"Dossier"** dans le sous-menu. Un nouveau dossier va apparaître avec le nom en surbrillance.
4. ✍️ **Saisis le nom** de ton choix avec le clavier (par exemple : "Mes Devoirs").
5. ⌨️ Appuie sur la touche **Entrée (Enter)** de ton clavier pour enregistrer le nom !

C'est super facile, n'est-ce pas ? Essaie sur ton ordinateur !`;
      } else if (textLower.includes("renommer") || textLower.includes("nom")) {
        reply = `Voici la **Procédure pour renommer un dossier ou un fichier** :

1. 🔍 **Sélectionne le fichier ou le dossier** en cliquant une fois dessus avec le bouton gauche de la souris.
2. 🖱️ **Fais un clic droit** sur l'icône du fichier ou du dossier.
3. ✏️ Dans le menu qui s'ouvre, clique sur **"Renommer"** (ou sur l'icône en forme de crayon sous Windows 11).
4. ✍️ **Saisis le nouveau nom** de ton choix avec ton clavier.
5. ⌨️ Appuie sur la touche **Entrée (Enter)** pour valider !

💡 *Astuce de pro :* Tu peux aussi cliquer une fois sur le fichier et appuyer sur la touche **F2** de ton clavier pour aller plus vite !`;
      } else if (textLower.includes("copier") || textLower.includes("coller")) {
        reply = `Voici la **Procédure pas à pas pour copier et coller** du texte ou un fichier :

1. 🖱️ **Sélectionne le texte** en maintenant le clic gauche enfoncé et en faisant glisser la souris, ou sélectionne le fichier.
2. 📋 **Fais un clic droit** sur la sélection et choisis **"Copier"** (ou appuie sur les touches **Ctrl + C** en même temps).
3. 📍 Positionne ton curseur à l'endroit où tu veux mettre le texte (par exemple dans Word), ou ouvre le dossier de destination.
4. 📄 **Fais un clic droit** dans cet espace vide et choisis **"Coller"** (ou appuie sur les touches **Ctrl + V** en même temps).

C'est magique ! Le texte ou le fichier est maintenant dupliqué à son nouvel emplacement.`;
      } else if (textLower.includes("allumer") || textLower.includes("démarrer") || textLower.includes("ordinateur")) {
        reply = `Voici la **Procédure pour allumer et démarrer un ordinateur de bureau** :

1. 🔌 **Vérifie les branchements :** Assure-toi que l'unité centrale et l'écran sont bien branchés à la prise de courant.
2. 🖥️ **Allume l'écran :** Appuie sur le bouton d'alimentation situé à l'avant ou sous l'écran (un petit voyant lumineux s'allumera).
3. ⚡ **Allume l'unité centrale :** Appuie sur le gros bouton d'alimentation (Power) situé sur la face avant de l'unité centrale.
4. ⏳ **Patiente :** L'ordinateur va effectuer ses tests et charger le système d'exploitation (comme Windows).
5. 👤 **Connecte-toi :** Si un mot de passe ou un profil est demandé, choisis ton compte et valide pour accéder au Bureau !`;
      } else {
        reply = `Tu as besoin d'une procédure étape par étape ? C'est une excellente idée pour apprendre !

Dis-moi exactement ce que tu cherches à faire (par exemple : créer un dossier, renommer un document, copier-coller du texte, ou démarrer la machine) et je te donnerai la procédure précise de A à Z !`;
      }
    } else {
      if (textLower.includes("informatique")) {
        reply = "L'informatique est une science merveilleuse ! C'est la contraction de 'Information' et 'Automatique'. Sais-tu quel est le rôle principal d'un ordinateur pour traiter cette information ? Pose-moi aussi une question pour avoir une procédure pratique (par ex: 'procédure pour créer un dossier') !";
      } else if (textLower.includes("hardware") || textLower.includes("matériel")) {
        reply = "Le matériel (Hardware), c'est tout ce que tu peux toucher physiquement ! Par exemple l'écran, le clavier, la souris, et l'unité centrale. Je peux t'expliquer la procédure pour connecter un périphérique si tu me le demandes !";
      } else if (textLower.includes("software") || textLower.includes("logiciel")) {
        reply = "Le logiciel (Software), c'est la partie logique, intangible de l'ordinateur. Par exemple, Windows ou Word ! Ce sont des programmes écrits en code. Tu as besoin de la procédure pour lancer ou utiliser l'un d'eux ? Demande-moi !";
      } else if (textLower.includes("aide") || textLower.includes("exercice") || textLower.includes("bloqué")) {
        reply = "Pas de panique ! Dis-moi à quelle étape de l'exercice tu es bloqué. Si tu as besoin d'une procédure spécifique pour ton travail pratique, écris simplement ta demande (ex: 'donne-moi la procédure de copier-coller') !";
      } else if (textLower.includes("bonjour") || textLower.includes("salut")) {
        reply = "Salut à toi, jeune élève de la 7ème année ! Prêt à devenir un as de l'informatique ? Pose-moi tes questions sur la leçon, ou demande-moi n'importe quelle procédure informatique de ton choix !";
      } else {
        reply = "C'est une excellente question ! Dans le cadre de notre cours de MTIC, n'oublie pas d'observer les définitions clés. Sache que je peux aussi te donner la procédure étape par étape pour n'importe quelle manipulation pratique ! Demande-le moi simplement.";
      }
    }
    return res.json({ text: reply });
  }

  try {
    const systemInstruction = `
      You are 'EduCompagnon', an incredibly encouraging, warm, and highly specialized pedagogical AI tutor for 7th-grade (7ème année de l'Éducation de Base) IT students in the Democratic Republic of Congo (RDC).
      
      Your rules:
      1. Always speak in clear, simple, warm French appropriate for a 11-13 year old student.
      2. Explain computer science, internet, and word processing concepts using vivid real-life examples from RDC (e.g., comparing data vs information with grades list or marketplace receipts).
      3. Encourage the student constantly, use phrases like "Excellent !", "Bonne question !", "Tu y es presque !".
      4. Crucial procedural guideline:
         - ONLY IF the student explicitly asks for a procedure, a guide, or how to do something (e.g., "comment créer un dossier", "procédure pour copier-coller", "comment démarrer un PC", "guide pour renommer", etc.), you must provide a beautifully structured, step-by-step numbered guide (Procédure étape par étape). Use markdown, numbered points, and helpful illustrative emojis (💻, 📁, 🖱️, ✍️, ⌨️) to list the precise practical steps.
         - If they ask general informational questions or concept definitions, answer them clearly and pedagogically, and remind them friendly at the end that they can also ask you for any step-by-step procedure they'd like to learn!
         - Keep response size perfectly adapted for a young middle school student to follow without getting overwhelmed.
      
      Current Lesson Context:
      - Title: "${lessonContext?.title || 'Informatique générale'}"
      - Objectives: "${(lessonContext?.objectives || []).join(' | ')}"
      - Summary: "${(lessonContext?.summary || []).join(' | ')}"
    `;

    // Process history into correct format for chats
    // Default chat structure using ai.chats.create
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const response = await chat.sendMessage({
      message: message
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in pedagogical chat:", error);
    res.status(500).json({ error: "Erreur de l'assistant virtuel.", details: error.message });
  }
});

// 4. AI Homework Correction
app.post("/api/gemini/correct-homework", async (req, res) => {
  const { title, question, corregiType, points, studentAnswer } = req.body;

  if (!question || !studentAnswer) {
    return res.status(400).json({ error: "La question et la réponse de l'élève sont requises." });
  }

  const maxPoints = Number(points) || 20;

  if (!ai) {
    // Simulated/Demo grading
    console.log("Running in simulated mode for homework correction.");
    const wordsInAnswer = studentAnswer.toLowerCase().split(/\s+/).length;
    let score = Math.min(maxPoints, Math.max(10, Math.floor(12 + Math.random() * 6)));
    if (wordsInAnswer < 5) score = Math.min(10, maxPoints);
    
    let feed = "Bonne tentative ! L'explication est correcte dans l'ensemble. Pour obtenir tous les points, veillez à détailler davantage vos exemples, en particulier pour les périphériques d'entrée.";
    if (score >= 17) {
      feed = "Excellent travail ! Les notions sont parfaitement assimilées et les exemples fournis sont très pertinents et précis. Félicitations !";
    }

    return res.json({
      grade: score,
      comment: feed
    });
  }

  try {
    const prompt = `
      Tu es un enseignant assistant en informatique pour la 7ème année d'éducation de base en République Démocratique du Congo (RDC).
      Ta tâche est de corriger le devoir d'un élève.
      
      Détails du Devoir :
      - Titre : "${title || "Devoir"}"
      - Question posée : "${question}"
      - Corrigé type de l'enseignant (critères de réussite) : "${corregiType || "Non spécifié"}"
      - Points maximum : ${maxPoints}
      
      Réponse fournie par l'élève :
      - "${studentAnswer}"
      
      Évalue la réponse de l'élève de manière juste, constructive et encourageante.
      Donne une note sur ${maxPoints} sous forme d'un nombre entier ou décimal simple.
      Rédige un commentaire court (2 ou 3 phrases en français) destiné à l'élève pour expliquer sa note et lui dire comment s'améliorer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["grade", "comment"],
          properties: {
            grade: { 
              type: Type.NUMBER,
              description: `La note attribuée à l'élève, entre 0 et ${maxPoints}.`
            },
            comment: { 
              type: Type.STRING,
              description: "Commentaire pédagogique bienveillant et constructif en français."
            }
          }
        }
      }
    });

    const data = JSON.parse((response.text || "{}").trim());
    res.json({
      grade: Math.min(maxPoints, Math.max(0, Number(data.grade) || 10)),
      comment: data.comment || "Travail bien reçu et évalué."
    });
  } catch (error: any) {
    console.error("Error in AI homework correction:", error);
    res.status(500).json({ error: "Erreur lors de l'évaluation automatique par l'IA.", details: error.message });
  }
});


// --- VITE DEV SERVER & PRODUCTION STATIC SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server middleware in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    // Static asset serving in production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build serving mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application running on port ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer();
