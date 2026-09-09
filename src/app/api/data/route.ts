import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ErpDataModel } from "@/lib/models/ErpData";
import { seedData } from "@/lib/seed-data";
import type { ErpData } from "@/lib/types";

export const dynamic = "force-dynamic";

const DOC_KEY = "main";

/**
 * GET /api/data
 * Returns the full ERP dataset. If no document exists yet in MongoDB
 * (first run on a fresh database), it is auto-seeded from
 * `src/lib/seed-data.ts` and then returned.
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const storeKey = request.nextUrl.searchParams.get("store") || DOC_KEY;

    let doc = await ErpDataModel.findOne({ key: storeKey }).lean();

    if (!doc && storeKey === "main") {
      const created = await ErpDataModel.create({ key: storeKey, data: seedData });
      doc = created.toObject();
    } else if (!doc) {
      // For specialized stores that don't exist yet, return empty object
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: doc.data as ErpData, updatedAt: doc.updatedAt });
  } catch (error) {
    console.error(`[GET /api/data] failed:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load ERP data." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/data
 * Replaces the full ERP dataset with the JSON body `{ data: ErpData }`.
 * Used by the client after any create/update/delete mutation to persist
 * the whole document back to MongoDB (upsert semantics — creates the
 * document if it doesn't exist yet).
 */
export async function PUT(request: NextRequest) {
  try {
    const storeKey = request.nextUrl.searchParams.get("store") || DOC_KEY;
    const body = await request.json();
    const nextData = body?.data;

    if (!nextData || typeof nextData !== "object") {
      return NextResponse.json({ success: false, error: "Request body must include a `data` object." }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await ErpDataModel.findOneAndUpdate(
      { key: storeKey },
      { key: storeKey, data: nextData },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, data: updated?.data as ErpData, updatedAt: updated?.updatedAt });
  } catch (error) {
    console.error("[PUT /api/data] failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save ERP data." },
      { status: 500 }
    );
  }
}
