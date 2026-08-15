/**
 * Trueline Spectrum — database seed.
 * Populates the CMS with illustrative sample editorial content so the public
 * site and admin panel are fully navigable. All content here is sample/demo
 * material (not real reporting) and is safe to delete and replace via the CMS.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRIMARY_CATEGORIES, HOMEPAGE_SECTIONS } from "../src/lib/constants";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function img(seed: string, w = 1200, h = 675) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}
function daysAhead(n: number) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

function body(paras: string[]) {
  return paras.map((p) => `<p>${p}</p>`).join("\n");
}

const LOREM = [
  "India's knowledge economy is entering a decisive phase as universities, research centres and industry converge around applied innovation. Institutions are rethinking how discovery moves from the laboratory to the market, and the pace of collaboration has accelerated sharply over the past year.",
  "At the centre of this shift is a new generation of researchers and founders who treat technology transfer as a first-class discipline. Incubation centres, corporate innovation units and global capability centres are building shared roadmaps that were unthinkable a decade ago.",
  "The implications reach far beyond a single sector. Education leaders are aligning curricula with emerging skills, industry is investing in deep-tech capability, and public research is being reframed as national infrastructure. Trueline Spectrum examines what this means for the ecosystem.",
  "What emerges is a picture of an ecosystem maturing in real time — one where measurable outcomes, responsible governance and long-horizon investment increasingly define success. The organisations that adapt fastest are already setting the standard for the rest to follow.",
];

async function main() {
  console.log("Seeding Trueline Spectrum…");

  // Clean (idempotent reseed) ------------------------------------------------
  await prisma.articleTag.deleteMany();
  await prisma.magazinePage.deleteMany();
  await prisma.article.deleteMany();
  await prisma.research.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.magazine.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.premiumPlan.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.tickerItem.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.admin.deleteMany();

  // Admin --------------------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@truelinespectrum.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.admin.create({
    data: {
      email: adminEmail,
      name: "Editorial Owner",
      passwordHash,
      role: "OWNER",
    },
  });
  console.log(`  admin: ${adminEmail} / ${adminPassword}`);

  // Categories ---------------------------------------------------------------
  const categoryMap: Record<string, string> = {};
  for (const [i, c] of PRIMARY_CATEGORIES.entries()) {
    const cat = await prisma.category.create({
      data: {
        name: c.name,
        slug: slugify(c.name),
        section: c.section,
        order: i,
        description: `${c.name} coverage from Trueline Spectrum.`,
      },
    });
    categoryMap[c.name] = cat.id;
  }

  // Authors ------------------------------------------------------------------
  const authorsData = [
    { name: "Ananya Rao", title: "Senior Editor, Research & Innovation" },
    { name: "Vikram Nair", title: "Editor, Technology & AI" },
    { name: "Priya Menon", title: "Correspondent, Education" },
    { name: "Rahul Desai", title: "Correspondent, Industry & Startups" },
  ];
  const authors = [];
  for (const a of authorsData) {
    authors.push(
      await prisma.author.create({
        data: {
          name: a.name,
          slug: slugify(a.name),
          title: a.title,
          bio: `${a.name} covers ${a.title.split(", ")[1]} for Trueline Spectrum.`,
          avatar: img(`author-${slugify(a.name)}`, 200, 200),
        },
      })
    );
  }

  // Tags ---------------------------------------------------------------------
  const tagNames = [
    "AI", "Machine Learning", "Semiconductors", "Deep Tech", "NEP",
    "NIRF", "GCC", "Funding", "Sustainability", "Quantum", "Robotics",
    "Higher Education", "Manufacturing", "Innovation", "Patents",
  ];
  const tags: Record<string, string> = {};
  for (const t of tagNames) {
    const tag = await prisma.tag.create({
      data: { name: t, slug: slugify(t) },
    });
    tags[t] = tag.id;
  }

  // Articles -----------------------------------------------------------------
  type A = {
    title: string;
    subtitle: string;
    category: string;
    author: number;
    tags: string[];
    featured?: boolean;
    trending?: boolean;
    premium?: boolean;
    priority?: number;
    days: number;
  };
  const articles: A[] = [
    {
      title: "India's AI Innovation Ecosystem Enters a New Phase of Scale",
      subtitle:
        "Compute capacity, applied research and enterprise adoption are converging to reshape the national AI landscape.",
      category: "Artificial Intelligence",
      author: 1, tags: ["AI", "Deep Tech", "Innovation"],
      featured: true, trending: true, priority: 100, days: 1,
    },
    {
      title: "A Research Breakthrough in Energy-Efficient Semiconductor Design",
      subtitle:
        "A university-industry team reports a materials advance that could cut chip power consumption significantly.",
      category: "Research",
      author: 0, tags: ["Semiconductors", "Deep Tech", "Patents"],
      trending: true, priority: 90, days: 2,
    },
    {
      title: "GCC Growth in India Accelerates as Global Firms Deepen R&D",
      subtitle:
        "Global capability centres are shifting from cost bases to innovation hubs across major Indian cities.",
      category: "GCC",
      author: 3, tags: ["GCC", "Manufacturing", "Innovation"],
      trending: true, priority: 85, days: 2,
    },
    {
      title: "How Deep-Tech Startups Are Rewriting the Innovation Playbook",
      subtitle:
        "Founders building in semiconductors, space and biotech are attracting a new class of patient capital.",
      category: "Startups",
      author: 3, tags: ["Funding", "Deep Tech", "Innovation"],
      featured: false, trending: true, priority: 80, days: 3,
    },
    {
      title: "Universities Realign Curricula with the Skills of the AI Era",
      subtitle:
        "Institutions are embedding applied AI, ethics and interdisciplinary projects into core programmes.",
      category: "Education",
      author: 2, tags: ["Higher Education", "NEP", "AI"],
      premium: true, priority: 70, days: 3,
    },
    {
      title: "The Quiet Rise of Quantum Research Collaborations",
      subtitle:
        "National labs and universities are forming consortia to pursue quantum computing and sensing.",
      category: "Research",
      author: 0, tags: ["Quantum", "Deep Tech"],
      priority: 60, days: 4,
    },
    {
      title: "Manufacturing's Digital Transformation Reaches the Factory Floor",
      subtitle:
        "Industry 4.0 pilots are graduating into full deployments across auto and electronics clusters.",
      category: "Manufacturing",
      author: 3, tags: ["Manufacturing", "Innovation", "Sustainability"],
      priority: 55, days: 5,
    },
    {
      title: "NIRF and Global Rankings: What the Latest Data Signals",
      subtitle:
        "A closer look at how research output and outcomes are reshaping institutional standing.",
      category: "Rankings",
      author: 2, tags: ["NIRF", "Higher Education"],
      priority: 50, days: 5,
    },
    {
      title: "Robotics Labs Move From Demonstrations to Deployment",
      subtitle:
        "Autonomous systems are finding real footing in logistics, agriculture and inspection.",
      category: "Technology",
      author: 1, tags: ["Robotics", "AI", "Innovation"],
      priority: 45, days: 6,
    },
    {
      title: "Patents Surge as Institutions Professionalise Tech Transfer",
      subtitle:
        "Dedicated IP cells are helping campuses convert research into protected, licensable assets.",
      category: "Patents",
      author: 0, tags: ["Patents", "Innovation"],
      premium: true, priority: 40, days: 7,
    },
    {
      title: "Sustainability Becomes a Core Metric for Industrial Innovation",
      subtitle:
        "Decarbonisation targets are pulling clean technology into the centre of industrial strategy.",
      category: "Industry",
      author: 3, tags: ["Sustainability", "Manufacturing"],
      priority: 35, days: 8,
    },
    {
      title: "Student Innovators Take Centre Stage at National Project Expos",
      subtitle:
        "Campus expos are becoming a pipeline for early-stage deep-tech ventures.",
      category: "Student Achievements",
      author: 2, tags: ["Higher Education", "Innovation"],
      priority: 30, days: 9,
    },
    {
      title: "Machine Learning Moves Closer to the Edge",
      subtitle:
        "Efficient models and specialised silicon are pushing intelligence onto constrained devices.",
      category: "Technology",
      author: 1, tags: ["Machine Learning", "AI", "Semiconductors"],
      priority: 25, days: 10,
    },
    {
      title: "Incubation Centres Rethink How They Support Founders",
      subtitle:
        "The best programmes are shifting from real estate to genuine capability building.",
      category: "Entrepreneurship",
      author: 3, tags: ["Funding", "Innovation"],
      priority: 20, days: 11,
    },
  ];

  for (const a of articles) {
    const slug = slugify(a.title);
    const article = await prisma.article.create({
      data: {
        title: a.title,
        slug,
        subtitle: a.subtitle,
        excerpt: a.subtitle,
        content: body(LOREM),
        featuredImage: img(slug),
        imageCaption: "Representative image. Trueline Spectrum.",
        authorId: authors[a.author].id,
        createdById: admin.id,
        categoryId: categoryMap[a.category] ?? null,
        status: "PUBLISHED",
        featured: !!a.featured,
        trending: !!a.trending,
        premium: !!a.premium,
        priority: a.priority ?? 0,
        readingMinutes: 4 + (a.priority ? Math.round(a.priority / 40) : 0),
        views: Math.round(400 + (a.priority ?? 0) * 12),
        publishedAt: daysAgo(a.days),
        seoTitle: a.title,
        seoDescription: a.subtitle,
        tags: {
          create: a.tags
            .filter((t) => tags[t])
            .map((t) => ({ tagId: tags[t] })),
        },
      },
    });
    void article;
  }

  // One draft + one pending, to exercise the workflow in the admin panel
  await prisma.article.create({
    data: {
      title: "Draft: Emerging Standards for Responsible AI in Enterprises",
      slug: "draft-responsible-ai-standards",
      subtitle: "A working draft on governance frameworks.",
      content: body(LOREM.slice(0, 2)),
      featuredImage: img("draft-responsible-ai"),
      authorId: authors[1].id,
      createdById: admin.id,
      categoryId: categoryMap["Artificial Intelligence"],
      status: "DRAFT",
    },
  });
  await prisma.article.create({
    data: {
      title: "Pending: The Next Wave of University-Industry Partnerships",
      slug: "pending-university-industry-partnerships",
      subtitle: "Submitted for editorial review.",
      content: body(LOREM.slice(0, 3)),
      featuredImage: img("pending-university-industry"),
      authorId: authors[2].id,
      createdById: admin.id,
      categoryId: categoryMap["Education"],
      status: "PENDING",
    },
  });

  // Research -----------------------------------------------------------------
  const research = [
    {
      title: "Low-Power Neuromorphic Architecture for On-Device Learning",
      summary:
        "A neuromorphic design demonstrates substantial energy savings for continual on-device learning workloads.",
      cat: "research", inst: "Indian Institute of Science ecosystem (sample)",
      researchers: "Sample Research Group", pub: "Preprint, 2026", featured: true,
    },
    {
      title: "Perovskite-Silicon Tandem Cells Cross a New Efficiency Threshold",
      summary:
        "A tandem photovoltaic result points toward lower-cost, higher-efficiency solar manufacturing.",
      cat: "publication", inst: "National Research Consortium (sample)",
      researchers: "Materials Science Team", pub: "Journal of Applied Energy (sample)",
    },
    {
      title: "Patent Granted for a Scalable Green-Hydrogen Catalyst",
      summary:
        "A newly granted patent covers a catalyst that reduces the energy needed for hydrogen electrolysis.",
      cat: "patent", inst: "University Innovation Cell (sample)",
      researchers: "Chemistry Department", pub: "Patent filing (sample)",
    },
    {
      title: "An Open Framework for Reproducible Climate Modelling",
      summary:
        "Researchers release an open toolkit aimed at making regional climate models reproducible.",
      cat: "innovation", inst: "Interdisciplinary Research Centre (sample)",
      researchers: "Computational Science Group", pub: "Open source, 2026", featured: true,
    },
    {
      title: "Advances in Biodegradable Electronics for Medical Sensing",
      summary:
        "A study reports transient electronic sensors that safely dissolve after their diagnostic use.",
      cat: "research", inst: "Biomedical Engineering Lab (sample)",
      researchers: "Bioelectronics Team", pub: "Preprint, 2026",
    },
  ];
  for (const r of research) {
    await prisma.research.create({
      data: {
        title: r.title,
        slug: slugify(r.title),
        summary: r.summary,
        content: body(LOREM.slice(0, 3)),
        researchCategory: r.cat,
        institution: r.inst,
        researchers: r.researchers,
        publicationInfo: r.pub,
        featuredImage: img(`research-${slugify(r.title)}`),
        status: "PUBLISHED",
        featured: !!r.featured,
        publishedAt: daysAgo(Math.round(Math.random() * 0 + research.indexOf(r) + 1)),
      },
    });
  }

  // Events -------------------------------------------------------------------
  const events = [
    { name: "National Summit on AI & Industry 2026", cat: "conference", loc: "Bengaluru", mode: "hybrid", in: 14, featured: true },
    { name: "Faculty Development Programme on Applied Data Science", cat: "fdp", loc: "Online", mode: "online", in: 21 },
    { name: "Deep-Tech Startup Expo", cat: "expo", loc: "Hyderabad", mode: "in-person", in: 30, featured: true },
    { name: "Research Methodology Workshop", cat: "workshop", loc: "Chennai", mode: "in-person", in: 9 },
    { name: "Innovation & Entrepreneurship Hackathon", cat: "hackathon", loc: "Pune", mode: "in-person", in: 40 },
    { name: "Webinar: The Future of Semiconductor Talent", cat: "webinar", loc: "Online", mode: "online", in: 5 },
  ];
  for (const e of events) {
    await prisma.event.create({
      data: {
        name: e.name,
        slug: slugify(e.name),
        startDate: daysAhead(e.in),
        endDate: daysAhead(e.in + 1),
        time: "09:30 AM IST",
        location: e.loc,
        mode: e.mode,
        description:
          "A sample event listing managed through the Trueline Spectrum CMS. Full agenda and speakers to be announced.",
        organizer: "Trueline Spectrum (sample listing)",
        registrationUrl: "https://example.com/register",
        image: img(`event-${slugify(e.name)}`),
        category: e.cat,
        status: "PUBLISHED",
        featured: !!e.featured,
      },
    });
  }

  // Organizations ------------------------------------------------------------
  const orgs = [
    { name: "Aurora Institute of Technology", type: "university", loc: "Bengaluru, India", featured: true },
    { name: "Meridian College of Engineering", type: "college", loc: "Chennai, India" },
    { name: "National Centre for Advanced Materials", type: "research-center", loc: "Pune, India", featured: true },
    { name: "Catalyst Incubation Hub", type: "incubation", loc: "Hyderabad, India" },
    { name: "Nimbus Robotics", type: "startup", loc: "Bengaluru, India", featured: true },
    { name: "Helios Semiconductors", type: "company", loc: "Gurugram, India" },
    { name: "Vanta Global Capability Centre", type: "gcc", loc: "Hyderabad, India" },
    { name: "Quantia Labs", type: "startup", loc: "Pune, India" },
  ];
  for (const o of orgs) {
    await prisma.organization.create({
      data: {
        name: o.name,
        slug: slugify(o.name),
        type: o.type,
        logo: img(`org-logo-${slugify(o.name)}`, 240, 240),
        coverImage: img(`org-cover-${slugify(o.name)}`),
        description:
          `${o.name} is a sample organisation profile managed by the Trueline Spectrum editorial team. ` +
          "Profiles collect achievements, related coverage, research and events in one place.",
        location: o.loc,
        website: "https://example.com",
        contactEmail: "contact@example.com",
        founded: "2016",
        achievements:
          "Recognised for innovation and research excellence (sample).\nActive industry and academic collaborations (sample).",
        status: "PUBLISHED",
        featured: !!o.featured,
      },
    });
  }

  // Magazines ----------------------------------------------------------------
  const magazines = [
    {
      title: "June 2026 Edition", month: "June", year: 2026, current: true,
      theme: "AI, Innovation & the Future of Industry",
      desc: "Our flagship edition maps how artificial intelligence, research and industry are converging across the ecosystem.",
    },
    {
      title: "May 2026 Edition", month: "May", year: 2026, current: false,
      theme: "The Research-to-Market Engine",
      desc: "How institutions are turning discovery into deployable innovation.",
    },
    {
      title: "April 2026 Edition", month: "April", year: 2026, current: false,
      theme: "Building the Deep-Tech Nation",
      desc: "A special issue on semiconductors, space and advanced manufacturing.",
    },
  ];
  const tocTitles = [
    "Cover", "Editor's Note", "Cover Story: The AI-Industry Convergence",
    "Research Spotlight", "Education Feature", "Startup Profiles",
    "Industry Analysis", "Events & Calendar", "Closing Perspective",
  ];
  for (const m of magazines) {
    const mag = await prisma.magazine.create({
      data: {
        editionTitle: m.title,
        slug: slugify(`${m.month}-${m.year}-edition`),
        month: m.month,
        year: m.year,
        coverImage: img(`magazine-${slugify(m.month)}-${m.year}`, 800, 1100),
        description: m.desc,
        theme: m.theme,
        status: "PUBLISHED",
        isCurrent: m.current,
        featured: m.current,
        publishedAt: m.current ? daysAgo(2) : daysAgo(35 * magazines.indexOf(m)),
      },
    });
    for (let p = 0; p < tocTitles.length; p++) {
      await prisma.magazinePage.create({
        data: {
          magazineId: mag.id,
          pageNumber: p + 1,
          title: tocTitles[p],
          image:
            p === 0
              ? img(`magazine-${slugify(m.month)}-${m.year}`, 800, 1100)
              : img(`magpage-${slugify(m.month)}-${m.year}-${p}`, 800, 1100),
          body:
            "Sample magazine page content for the online reader. This text supports search and accessibility inside the digital reader.",
          isSection: false,
        },
      });
    }
  }

  // Premium plans (display only) --------------------------------------------
  const plans = [
    {
      name: "Free", price: "₹0", interval: null, order: 0, highlighted: false,
      tagline: "Essential access to public journalism",
      features: [
        "Public articles", "Selected magazine content", "News & updates",
        "Research highlights", "Events calendar",
      ],
    },
    {
      name: "Premium Monthly", price: "₹499", interval: "month", order: 1, highlighted: true,
      tagline: "Full access, billed monthly",
      features: [
        "All Free benefits", "Premium articles", "Complete digital magazine access",
        "Premium research reports", "Exclusive editorial content", "Premium insights",
      ],
    },
    {
      name: "Premium Annual", price: "₹4,499", interval: "year", order: 2, highlighted: false,
      tagline: "Best value, billed annually",
      features: [
        "All Premium benefits", "Full annual access", "Priority editorial newsletters",
        "Complete magazine archive", "Better value than monthly",
      ],
    },
  ];
  for (const p of plans) {
    await prisma.premiumPlan.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        priceLabel: p.price,
        interval: p.interval,
        tagline: p.tagline,
        features: JSON.stringify(p.features),
        highlighted: p.highlighted,
        order: p.order,
      },
    });
  }

  // Homepage sections --------------------------------------------------------
  for (const [i, s] of HOMEPAGE_SECTIONS.entries()) {
    await prisma.homepageSection.create({
      data: { key: s.key, title: s.title, enabled: true, order: i },
    });
  }

  // Ticker items -------------------------------------------------------------
  const ticker = [
    "India's AI innovation ecosystem enters a new phase of scale",
    "Energy-efficient semiconductor research breakthrough reported",
    "GCC growth accelerates as global firms deepen R&D",
    "Deep-tech startups attract a new class of patient capital",
    "Universities realign curricula with the AI era",
  ];
  for (const [i, label] of ticker.entries()) {
    await prisma.tickerItem.create({
      data: { label, order: i, href: "/news" },
    });
  }

  // Advertisement placeholders ----------------------------------------------
  const ads = ["header", "homepage", "article", "sidebar", "magazine"];
  for (const [i, placement] of ads.entries()) {
    await prisma.advertisement.create({
      data: {
        name: `${placement[0].toUpperCase()}${placement.slice(1)} Placement`,
        placement,
        active: true,
        priority: i,
      },
    });
  }

  // Site settings ------------------------------------------------------------
  const settings: Record<string, string> = {
    siteName: "Trueline Spectrum",
    tagline: "A Monthly Science & Technology Magazine",
    contactEmail: "truelinebiomed@gmail.com",
    footerAbout:
      "Trueline Spectrum is a professional digital magazine and media platform connecting education, research, technology, industry and innovation.",
    social_linkedin: "https://www.linkedin.com",
    social_x: "https://x.com",
    social_youtube: "",
    // Founder / Leadership (About page). Name/title left blank for the admin to
    // enter genuine details; message is a safe, non-biographical placeholder.
    founderName: "",
    founderTitle: "Founder, Trueline Spectrum",
    founderMessage:
      "Trueline Spectrum was founded on a simple conviction: that the work of researchers, educators, technologists and entrepreneurs deserves to be told with clarity, rigour and respect.\n\nWe built this monthly edition to connect the people and institutions shaping education, research, technology, industry and innovation — and to make their ideas accessible to a wider community.\n\nEvery issue is an invitation to look closely at how knowledge moves from the laboratory to the world, and to imagine what we can build together.",
    founderPhoto: "/founder/founder.jpg",
    founderLinkedin: "",
    founderEmail: "truelinebiomed@gmail.com",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({ data: { key, value } });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
