import DashboardLayout from '@/app/(dashboard)/layout';

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
