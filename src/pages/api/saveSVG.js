import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
    let payload;

    try {
        payload = await request.json();
    } catch (error) {
        console.error("saveSVG: invalid JSON", error);
        return new Response(JSON.stringify({ success: false, error: "Invalid JSON payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { name, code_svg, chat_history } = payload ?? {};

    if (!name || !code_svg) {
        return new Response(
            JSON.stringify({ success: false, error: "Missing name or code_svg" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const data = {
        name,
        code_svg,
        chat_history: chat_history ?? "[]",
    };

    console.log("Received data to save:", data);

 try {
        const record = await pb.collection("svgs").create(data);
        console.log("SVG saved", record);
        console.log("SVG saved with ID:", record.id);

        return new Response(JSON.stringify({ success: true, id: record.id }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error saving SVG:", error);
        return new Response(
            JSON.stringify({ success: false, error: error?.message || "PocketBase error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
