import User from '../models/User.js';
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
console.log("🔥 Webhook HIT - request received");
    console.log("HEADERS:", req.headers);

    try {
        // Crée une instance Svix avec ton secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);

        // Headers pour la vérification Svix
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // ✅ Vérification Svix uniquement en production
        if (process.env.NODE_ENV === "production") {
            await whook.verify(req.body, headers);
        } else {
            console.log("⚡ Skipping Svix verification (local development)");
        }

        // Parsing du body (raw buffer de express.raw)
        const parsedBody = typeof req.body === "string" 
            ? JSON.parse(req.body)
            : JSON.parse(req.body.toString("utf8"));

        console.log("BODY:", parsedBody);

        const { data, type } = parsedBody;

        // Gestion des événements selon le type
        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    userName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };
                await User.create(userData);
                console.log(`✅ User created: ${userData.userName}`);
                break;
            }

            case "user.updated": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    userName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };
                await User.findOneAndUpdate({ clerkId: data.id }, userData);
                console.log(`✏️ User updated: ${userData.userName}`);
                break;
            }

            case "user.deleted": {
                // Pas besoin de récupérer email/nom, juste l'ID suffit
                const deletedUser = await User.findOneAndDelete({ clerkId: data.id });
                if (deletedUser) {
                    console.log(`🗑️ User deleted: ${deletedUser.userName}`);
                } else {
                    console.log(`🗑️ User with ID ${data.id} not found in DB`);
                }
                break;
            }

            default:
                console.log(`ℹ️ Event type not handled: ${type}`);
                break;
        }

        res.json({ success: true, message: "Webhook processed successfully" });

    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
