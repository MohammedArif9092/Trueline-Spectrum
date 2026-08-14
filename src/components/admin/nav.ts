/** Admin sidebar navigation structure. */
export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; icon: string; links: NavLink[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Content",
    icon: "FileText",
    links: [
      { label: "All Articles", href: "/admin/articles" },
      { label: "New Article", href: "/admin/articles/new" },
      { label: "Drafts", href: "/admin/articles?status=DRAFT" },
      { label: "Pending Review", href: "/admin/articles?status=PENDING" },
      { label: "Scheduled", href: "/admin/articles?status=SCHEDULED" },
      { label: "Published", href: "/admin/articles?status=PUBLISHED" },
    ],
  },
  {
    label: "Research",
    icon: "FlaskConical",
    links: [
      { label: "All Research", href: "/admin/research" },
      { label: "New Research", href: "/admin/research/new" },
    ],
  },
  {
    label: "Events",
    icon: "CalendarDays",
    links: [
      { label: "All Events", href: "/admin/events" },
      { label: "New Event", href: "/admin/events/new" },
    ],
  },
  {
    label: "Organizations",
    icon: "Building2",
    links: [
      { label: "All Organizations", href: "/admin/organizations" },
      { label: "New Organization", href: "/admin/organizations/new" },
    ],
  },
  {
    label: "Magazine",
    icon: "BookOpen",
    links: [
      { label: "All Editions", href: "/admin/magazines" },
      { label: "New Edition", href: "/admin/magazines/new" },
    ],
  },
  {
    label: "Taxonomy",
    icon: "Tags",
    links: [
      { label: "Categories", href: "/admin/categories" },
      { label: "Authors", href: "/admin/authors" },
    ],
  },
  {
    label: "Site",
    icon: "LayoutDashboard",
    links: [
      { label: "Homepage", href: "/admin/homepage" },
      { label: "Premium Plans", href: "/admin/plans" },
      { label: "Advertisements", href: "/admin/ads" },
      { label: "Media Library", href: "/admin/media" },
      { label: "Newsletter", href: "/admin/newsletter" },
      { label: "Audit Log", href: "/admin/audit" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];
