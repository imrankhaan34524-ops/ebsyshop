import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import imagekit from "@/app/configs/ImageKit";
import authSeller from "@/middlewears/authSeller";
import { getAuth } from "@clerk/nextjs/server";

// Add a new product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        // Get the data from the form
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const images = formData.getAll("images");
        const saleEndsAtRaw = formData.get("saleEndsAt");

        if (!name || !description || !mrp || !price || !category || images.length < 1) {
            return NextResponse.json({ error: "missing product details" }, { status: 400 });
        }

        // Optional: sale end date (needs MRP higher than price, and a future date)
        let saleEndsAt = null;
        if (saleEndsAtRaw) {
            const date = new Date(saleEndsAtRaw);

            if (isNaN(date.getTime())) {
                return NextResponse.json({ error: "invalid sale end date" }, { status: 400 });
            }
            if (date <= new Date()) {
                return NextResponse.json({ error: "sale end date must be in the future" }, { status: 400 });
            }
            if (mrp <= price) {
                return NextResponse.json({ error: "for a sale, MRP must be higher than the price" }, { status: 400 });
            }

            saleEndsAt = date;
        }

        // Uploading images to ImageKit
        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            });
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1024" }
                ]
            });
            return url;
        }));

        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId,
                saleEndsAt
            }
        });

        return NextResponse.json({ message: "Product added successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// Get all products for a seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const products = await prisma.product.findMany({ where: { storeId } });

        return NextResponse.json({ products });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}