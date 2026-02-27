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
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-heading mb-8">
        Edit: {item.title}
      </h1>
      <PortfolioForm initialData={item} />
    </div>
  );
}
