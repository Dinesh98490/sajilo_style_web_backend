const ApiError = require("../utils/api_error");
const ApiResponse = require("../utils/api_response");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Product = require("../models/product");
const Category = require("../models/category");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateKnowledgeBase = async () => {
    let context = "";

    try {
        const recentProducts = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("categoryId", "title");

        context += "🆕 NEW ARRIVALS:\n";
        if (recentProducts.length > 0) {
            recentProducts.forEach(prod => {
                context += `- Title: ${prod.title}, Category: ${prod.categoryId?.title || "N/A"}, Color: ${prod.color}, Size: ${prod.size}, Price: Rs. ${prod.price.toLocaleString()}\n`;
            });
        } else {
            context += "No new shoes in the catalog currently.\n";
        }

        const categories = await Category.find({});
        context += "\n👟 CATEGORIES:\n";
        if (categories.length > 0) {
            context += categories.map(cat => `- ${cat.title}`).join("\n") + "\n";
        } else {
            context += "No categories available.\n";
        }

    } catch (err) {
        console.error("Error generating knowledge base:", err);
        context += "\nNote: Live product data could not be retrieved.\n";
    }

    return context;
};

const systemPrompt = `You are StyleBot, the friendly assistant for SajiloStyle — an online shoe store in Nepal.

You help users:
• Find shoes
• Understand shipping, return, and payment policies
• Get styling advice

👋 Start every conversation with:
"Hey there! 👋 I'm StyleBot from SajiloStyle. Looking for the perfect pair of shoes today?"

🛍️ Use the latest inventory and categories to recommend products.

🎯 FAQ responses:

❓ How to place an order?
"Browse, select size and color, then click 'Add to Cart' and checkout. Easy and fast!"

❓ Do you offer returns?
"Yes! Return within 7 days if the shoes are unused and in original condition."

❓ Payment options?
"We support Cash on Delivery, Esewa, Khalti, and bank transfers."

❓ Do you ship everywhere?
"We currently deliver inside Nepal. Delivery in Kathmandu Valley is free for orders above Rs. 3000."

---

[Insert 🆕 NEW ARRIVALS here]
[Insert 👟 CATEGORIES here]
`;

const handleChatQuery = async (req, res) => {
    try {
        const { query, history = [] } = req.body;

        if (!query) {
            throw new ApiError(400, "Query is required.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const knowledgeBase = await generateKnowledgeBase();
        const fullSystemPrompt = systemPrompt + knowledgeBase;

        const formattedHistory = history.map(item => ({
            role: item.role,
            parts: [{ text: item.text }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: fullSystemPrompt }] },
                { role: "model", parts: [{ text: "Got it! I'm StyleBot and ready to help with all things SajiloStyle!" }] },
                ...formattedHistory,
            ],
            generationConfig: {
                maxOutputTokens: 250,
            },
        });

        const result = await chat.sendMessage(query);
        const text = result.response.text();

        return res.status(200).json(new ApiResponse(200, { reply: text }, "Chatbot responded successfully."));
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json(new ApiError(500, error.message || "Internal chatbot error."));
    }
};

module.exports = handleChatQuery;
