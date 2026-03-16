import { NextResponse } from "next/server";

import { requireApiSession } from "@/server/http/api-session";
import { getVaultAdapter } from "@/server/vault";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireApiSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { slug } = await params;
    const product = await getVaultAdapter().getProduct(slug);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
