import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioForm from "../../PortfolioForm";

export default async function EditPortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="admin-page">
      <h1 className="admin-title">Edit: {item.title}</h1>
      <PortfolioForm initialData={item} />
    </div>
  );
}
