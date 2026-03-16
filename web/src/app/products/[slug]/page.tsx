import { notFound } from "next/navigation";

import { ProductWorkspace } from "@/components/product-workspace";
import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAppSession();
  const { slug } = await params;

  try {
    const product = await getVaultAdapter().getProduct(slug);
    return <ProductWorkspace product={product} />;
  } catch {
    notFound();
  }
}
