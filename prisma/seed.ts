import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { randomUUID } from 'crypto';

// initialize Prisma Client with the PostgreSQL driver adapter
const adapter = new PrismaPg({
  connectionString:
    'postgresql://postgres:root@localhost:5432/cms-project?schema=public',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Components ---
  // 1. Create children components first (Image, H1, Button)
  const image = await prisma.component.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'Image',
      nameAR: 'صورة',
      index: 1,
    },
  });

  const h1 = await prisma.component.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'H1',
      nameAR: 'عنوان',
      index: 2,
    },
  });

  const button = await prisma.component.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'Button',
      nameAR: 'زر',
      index: 3,
    },
  });

  // 2. Create parent component "Card" with children
  const card = await prisma.component.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'Card',
      nameAR: 'بطاقة',
      index: 1,
      children: {
        connect: [{ id: image.id }, { id: h1.id }, { id: button.id }],
      },
    },
  });

  // --- Page ---
  const homePage = await prisma.page.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'home',
      nameAR: 'الرئيسية',
      isVisible: true,
      index: 1,
    },
  });

  // --- Sections ---
  const heroSection = await prisma.section.create({
    data: {
      uuid: randomUUID(),
      nameEN: 'Hero',
      nameAR: 'بطولية',
      index: 1,
      pageId: homePage.id,
    },
  });

  // --- SectionComponent (placement of Card in Hero section) ---
  await prisma.sectionComponent.create({
    data: {
      uuid: randomUUID(),
      sectionId: heroSection.id,
      componentId: card.id,
      index: 1,
      componentData: {
        image: {
          src: 'https://example.com/hero.jpg',
          alt: 'Hero image',
        },
        title: {
          text: 'Welcome to our CMS',
        },
        button: {
          label: 'Learn more',
          url: '/about',
        },
      },
      componentSettings: {
        layout: 'centered',
        background: 'dark',
      },
    },
  });

  console.log('Seeder finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
