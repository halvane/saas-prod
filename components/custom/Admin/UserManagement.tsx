import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Search, Download, MoreVertical, Mail, Edit, Trash2, User, CreditCard, ExternalLink, Plus } from 'lucide-react';
import { updateUserCredits, updateUserPlan, createUserWithStripe } from '@/app/(admin)/admin/actions';
import { toast } from 'sonner';

interface UserManagementProps {
  users: any[];
}

export function UserManagement({ users }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ credits: 0, plan: '' });
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    stripeCustomerId: '',
    stripeSubscriptionId: '',
    planName: 'Free',
    subscriptionStatus: 'active',
    credits: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.password || !createForm.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithStripe(createForm);
      toast.success('User created successfully');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        role: 'member',
        stripeCustomerId: '',
        stripeSubscriptionId: '',
        planName: 'Free',
        subscriptionStatus: 'active',
        credits: 0
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({ credits: user.credits || 0, plan: user.plan || 'Free' });
    setIsEditing(false);
    setShowUserModal(true);
  };

  const handleSave = async () => {
    if (!selectedUser?.teamId) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        updateUserCredits(selectedUser.teamId, Number(editForm.credits)),
        updateUserPlan(selectedUser.teamId, editForm.plan)
      ]);
      toast.success('User updated successfully');
      setShowUserModal(false);
      // Ideally we'd refresh the data here, but Next.js server actions + revalidatePath should handle it on next render
      // Since this is a client component receiving props, we might need a router.refresh() or similar if the parent doesn't re-render
      // But for now let's rely on the user closing/reopening or page refresh
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      Active: 'success',
      Trial: 'info',
      Paused: 'warning'
    };
    return variants[status] || 'info';
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="gradient-text mb-2">User Management</h2>
          <p className="text-[#6B7280]">Manage all user accounts and subscriptions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by email..."
              icon={<Search className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filters omitted for brevity */}
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1F2937]">{user.name}</p>
                        <p className="text-sm text-[#6B7280]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-[#DDD6FE] text-[#7C3AED] rounded-full text-sm font-medium">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {user.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {user.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title={isEditing ? "Edit User" : "User Profile"}
          size="large"
        >
          <ModalContent>
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-[#E5E7EB]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">{selectedUser.name}</h4>
                  <p className="text-sm text-[#6B7280] mb-2">{selectedUser.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{selectedUser.plan} Plan</Badge>
                    <Badge variant={getStatusBadge(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plan</label>
                    <select 
                      className="w-full mt-1 border rounded-md p-2"
                      value={editForm.plan}
                      onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                    >
                      <option value="Free">Free</option>
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Credits</label>
                    <Input 
                      type="number" 
                      value={editForm.credits}
                      onChange={(e) => setEditForm({...editForm, credits: Number(e.target.value)})}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Usage Stats */}
                  <div>
                    <h5 className="mb-3 text-[#1F2937]">📊 Usage & Credits</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F9FAFB] rounded-lg">
                        <p className="text-sm text-[#6B7280] mb-1">Available Credits</p>
                        <p className="text-2xl font-bold text-[#1F2937]">{selectedUser.credits}</p>
                      </div>
                      <div className="p-4 bg-[#F9FAFB] rounded-lg">
                        <p className="text-sm text-[#6B7280] mb-1">Plan Status</p>
                        <p className="text-2xl font-bold text-[#1F2937] capitalize">{selectedUser.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Billing */}
                  <div>
                    <h5 className="mb-3 text-[#1F2937]">💰 Billing</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Current Plan:</span>
                        <span className="font-medium text-[#1F2937]">{selectedUser.plan}</span>
                      </div>
                      {selectedUser.stripeCustomerId && (
                        <div className="mt-4">
                          <a 
                            href={`https://dashboard.stripe.com/customers/${selectedUser.stripeCustomerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B5CF6] hover:underline flex items-center gap-1"
                          >
                            View in Stripe <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowUserModal(false)}>
              Close
            </Button>
            {isEditing ? (
              <Button variant="primary" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            )}
          </ModalFooter>
        </Modal>
      )}

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User">
        <ModalContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="********"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'admin', label: 'Admin' }
                  ]}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-4">Stripe & Plan Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan</label>
                  <Select
                    value={createForm.planName}
                    onChange={(e) => setCreateForm({ ...createForm, planName: e.target.value })}
                    options={[
                      { value: 'Free', label: 'Free' },
                      { value: 'Pro', label: 'Pro' },
                      { value: 'Business', label: 'Business' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Credits</label>
                  <Input
                    type="number"
                    value={createForm.credits}
                    onChange={(e) => setCreateForm({ ...createForm, credits: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Stripe Customer ID</label>
                <Input
                  value={createForm.stripeCustomerId}
                  onChange={(e) => setCreateForm({ ...createForm, stripeCustomerId: e.target.value })}
                  placeholder="cus_..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Stripe Subscription ID</label>
                <Input
                  value={createForm.stripeSubscriptionId}
                  onChange={(e) => setCreateForm({ ...createForm, stripeSubscriptionId: e.target.value })}
                  placeholder="sub_..."
                />
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
