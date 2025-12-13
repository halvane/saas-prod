import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Search, Download, MoreVertical, Mail, Edit, Trash2, User } from 'lucide-react';

const mockUsers = [
  {
    id: '1',
    email: 'sarah@example.com',
    plan: 'Pro',
    status: 'Active',
    usage: '450/500',
    created: 'Dec 1',
    name: 'Sarah Thompson'
  },
  {
    id: '2',
    email: 'marcus@agency.com',
    plan: 'Business',
    status: 'Active',
    usage: '1200/2000',
    created: 'Nov 15',
    name: 'Marcus Williams'
  },
  {
    id: '3',
    email: 'john@startup.io',
    plan: 'Starter',
    status: 'Paused',
    usage: '50/100',
    created: 'Oct 22',
    name: 'John Doe'
  },
  {
    id: '4',
    email: 'emily@blog.net',
    plan: 'Pro',
    status: 'Trial',
    usage: '80/500',
    created: 'Dec 10',
    name: 'Emily Chen'
  },
  {
    id: '5',
    email: 'alex@shop.com',
    plan: 'Free',
    status: 'Active',
    usage: '15/50',
    created: 'Dec 8',
    name: 'Alex Rivera'
  }
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleViewUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      Active: 'success',
      Trial: 'info',
      Paused: 'warning'
    };
    return variants[status] || 'info';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="gradient-text mb-2">User Management</h2>
        <p className="text-[#6B7280]">Manage all user accounts and subscriptions</p>
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
          <Select
            options={[
              { value: 'all', label: 'All Plans' },
              { value: 'free', label: 'Free' },
              { value: 'starter', label: 'Starter' },
              { value: 'pro', label: 'Pro' },
              { value: 'business', label: 'Business' }
            ]}
            defaultValue="all"
          />
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'trial', label: 'Trial' },
              { value: 'paused', label: 'Paused' }
            ]}
            defaultValue="all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="small">
            <User className="w-4 h-4" />
            Add User
          </Button>
          <Button variant="ghost" size="small">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
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
                    {user.usage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {user.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">
            Showing 1-5 of 1,247 users
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="small">← Previous</Button>
            <Button variant="ghost" size="small">1</Button>
            <Button variant="primary" size="small">2</Button>
            <Button variant="ghost" size="small">3</Button>
            <Button variant="ghost" size="small">Next →</Button>
          </div>
        </div>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="User Profile"
          size="large"
        >
          <ModalContent>
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-[#E5E7EB]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
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

              {/* Usage Stats */}
              <div>
                <h5 className="mb-3 text-[#1F2937]">📊 Usage This Month</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F9FAFB] rounded-lg">
                    <p className="text-sm text-[#6B7280] mb-1">Posts Created</p>
                    <p className="text-2xl font-bold text-[#1F2937]">{selectedUser.usage}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg">
                    <p className="text-sm text-[#6B7280] mb-1">AI Generations</p>
                    <p className="text-2xl font-bold text-[#1F2937]">1,200 / 1,500</p>
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div>
                <h5 className="mb-3 text-[#1F2937]">💰 Billing</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Current Plan:</span>
                    <span className="font-medium text-[#1F2937]">{selectedUser.plan} ($99/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Next Billing:</span>
                    <span className="font-medium text-[#1F2937]">Jan 1, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Payment Method:</span>
                    <span className="font-medium text-[#1F2937]">•••• 4242</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowUserModal(false)}>
              Close
            </Button>
            <Button variant="secondary">
              <Mail className="w-4 h-4" />
              Send Email
            </Button>
            <Button variant="primary">
              <Edit className="w-4 h-4" />
              Edit User
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
