import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ErpDataModel } from "@/lib/models/ErpData";
import { buildSeedData } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const DOC_KEY = "main";

/**
 * POST /api/seed
 * Force-reseeds the ERP dataset, overwriting whatever currently exists in
 * MongoDB with a fresh copy of `src/lib/seed-data.ts`. Used by
 * Settings → Data Management → "Reset Data".
 */
export async function POST() {
  try {
    await connectToDatabase();

    const freshData = buildSeedData();

    const updated = await ErpDataModel.findOneAndUpdate(
      { key: DOC_KEY },
      { key: DOC_KEY, data: freshData },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "ERP demo data has been reseeded successfully.",
      data: updated?.data,
      updatedAt: updated?.updatedAt,
    });
  } catch (error) {
    console.error("[POST /api/seed] failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to reseed ERP data." },
      { status: 500 }
    );
  }
}
