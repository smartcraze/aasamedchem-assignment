import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  revalidateTag("products", {});
  revalidateTag("orders", {});
  revalidateTag("users", {});
  return NextResponse.json({ revalidated: true });
}
