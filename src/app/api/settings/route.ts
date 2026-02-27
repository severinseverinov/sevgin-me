import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "singleton",
        emailAddress: "contact@sevginserbest.com",
        footerTagline: "Building for the web.",
      },
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { profileImageUrl, githubUrl, linkedinUrl, twitterUrl, emailAddress, footerTagline } = body;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { profileImageUrl, githubUrl, linkedinUrl, twitterUrl, emailAddress, footerTagline },
    create: {
      id: "singleton",
      profileImageUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      emailAddress: emailAddress ?? "contact@sevginserbest.com",
      footerTagline: footerTagline ?? "Building for the web.",
    },
  });

  return NextResponse.json(settings);
}
