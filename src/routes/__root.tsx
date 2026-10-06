import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import "../styles.css";

const CustomCursor = lazy(() =>
  import("@/components/CustomCursor").then((m) => ({ default: m.CustomCursor }))
);
const Chatbot = lazy(() =>
  import("@/components/Chatbot").then((m) => ({ default: m.Chatbot }))
);
const WhatsAppButton = lazy(() =>
  import("@/components/WhatsAppButton").then((m) => ({ default: m.WhatsAppButton }))
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <div className="mt-4 text-sm text-muted-foreground/80 overflow-auto bg-surface-2 p-4 rounded text-left">
          {error.message}
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              reset();
              router.invalidate();
            }}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const path = location.pathname;
    let title = "Viso Group | #1 Security Consultancy in Saudi Arabia (KSA) | HCIS Approved";
    let desc = "Viso Group (Vision of Solutions for Security Consultations Co. Ltd.) is Saudi Arabia's premier HCIS-certified security consultancy firm. Specializing in physical security engineering, HCIS Directive compliance, risk assessment, master planning, & certified technical translation in Riyadh, Jeddah, & Kingdom-wide.";

    if (path === "/about") {
      title = "About Viso Group | Premier Security Consultancy & Vision in KSA";
      desc = "Learn about Viso Group (Vision of Solutions for Security Consultations Co. Ltd.), Saudi Arabia's trusted partner for HCIS physical security engineering & certified translation.";
    } else if (path.startsWith("/security")) {
      title = "HCIS Security Consultancy & Engineering Services in KSA | Viso Group";
      desc = "Comprehensive HCIS Directive 1-5 compliance, physical security master planning, PIDS design, and risk assessments for critical infrastructure in Saudi Arabia.";
    } else if (path.startsWith("/translation")) {
      title = "Certified Technical Translation Services in Saudi Arabia | Viso Group";
      desc = "Certified legal, engineering, and technical translation services in Riyadh, Jeddah, & Kingdom-wide by Viso Group.";
    } else if (path.startsWith("/projects")) {
      title = "Major Security & Infrastructure Projects in Saudi Arabia | Viso Group";
      desc = "Explore Viso Group's mega security projects across Saudi Aramco, NEOM, NWC, Ma'aden, and Royal Commission for Riyadh City.";
    } else if (path.startsWith("/clients")) {
      title = "Tier-1 Government & Enterprise Clients | Viso Group Saudi Arabia";
      desc = "Viso Group proudly serves Saudi Aramco, NEOM, NWC, Siemens, Ritz Carlton, and leading KSA government authorities.";
    } else if (path.startsWith("/career")) {
      title = "Careers & Jobs at Viso Group | Join Saudi Security Leaders";
      desc = "Build your career with Viso Group in Riyadh, KSA. Explore job openings for security consultants, engineers, and translators.";
    } else if (path.startsWith("/contact")) {
      title = "Contact Viso Group | Riyadh & KSA Security Consultants";
      desc = "Get in touch with Viso Group for security consultations, HCIS compliance reviews, and certified translation requests in Saudi Arabia.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    }
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <CustomCursor showRotatingRing={!isAdmin} />
      </Suspense>
      <Outlet />
      {!isAdmin && (
        <Suspense fallback={null}>
          {/* <Chatbot /> */}
          <WhatsAppButton />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
