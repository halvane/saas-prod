import { getAdminStats, getAllUsers } from './actions';
import { AdminClientPage } from '@/components/custom/Admin/AdminClientPage';

export default async function AdminPage() {
  const stats = await getAdminStats();
  const users = await getAllUsers();

  return <AdminClientPage stats={stats} users={users} />;
}
