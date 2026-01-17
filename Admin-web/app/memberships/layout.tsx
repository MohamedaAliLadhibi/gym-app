import MainLayout from '@/components/layout/MainLayout';

export default function MembershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
