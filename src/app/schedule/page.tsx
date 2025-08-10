import { schedule } from "@/lib/data";
import { SchedulePageClient } from "@/components/schedule-page-client";

export default function SchedulePage() {
  return <SchedulePageClient initialSchedule={schedule} />;
}
