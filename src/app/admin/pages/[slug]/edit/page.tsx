import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageForm from "../../PageForm";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold font-heading mb-8">
        Edit: {page.title}
      </h1>
      <PageForm
        initialData={{
          ...page,
          content: page.content ?? "",
          slugKey: page.slug,
        }}
      />
    </div>
  );
}
