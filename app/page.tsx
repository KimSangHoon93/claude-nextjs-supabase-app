import { createClient } from "@/lib/supabase/server";
import MobileShell from "@/components/mobile-shell";
import HomeLanding from "@/components/gather/home-landing";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <MobileShell>
      <HomeLanding isLoggedIn={!!user} />
    </MobileShell>
  );
}
