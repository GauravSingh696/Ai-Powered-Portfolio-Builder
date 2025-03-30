import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req) {
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const pdfData = await pdfParse(fileBuffer);

        return NextResponse.json({ 
            message: "File uploaded and parsed successfully", 
            text: pdfData.text 
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
