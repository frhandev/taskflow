import NewTask from "@/components/tasks/NewTask";
export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ due?: string }>;
}) {
  const { due } = await searchParams;
  const initialDate =
    due && /^\d{4}-\d{2}-\d{2}$/.test(due) && Number.isFinite(Date.parse(due))
      ? due
      : undefined;
  return <NewTask initialDate={initialDate} />;
}
