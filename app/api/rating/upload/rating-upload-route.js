import { NextResponse } from "next/server";
import imagekit from "@/app/configs/ImageKit";
import { getAuth } from "@clerk/nextjs/server";

const MAX_FILES = 3;
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per photo

// Upload review photos, returns their links
export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll("images");

        if (files.length === 0) {
            return NextResponse.json({ images: [] });
        }
        if (files.length > MAX_FILES) {
            return NextResponse.json({ error: `maximum ${MAX_FILES} photos` }, { status: 400 });
        }

        for (const file of files) {
            if (!file.type?.startsWith("image/")) {
                return NextResponse.json({ error: "only image files are allowed" }, { status: 400 });
            }
            if (file.size > MAX_SIZE) {
                return NextResponse.json({ error: "each photo must be under 5 MB" }, { status: 400 });
            }
        }

        const images = await Promise.all(files.map(async (file, index) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: `review-${userId}-${Date.now()}-${index}.jpg`,
                folder: "reviews",
            });
            return imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1024" }
                ]
            });
        }));

        return NextResponse.json({ images });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
