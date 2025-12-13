import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User, Mail, Calendar, CreditCard, Key, Bell, Shield, LogOut } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="gradient-text mb-2">User Profile</h2>
          <p className="text-[#6B7280]">Manage your account settings and preferences</p>
        </div>
        <Button variant="secondary" size="medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">ST</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Sarah Thompson</h3>
                <p className="text-[#6B7280] mb-2">sarah@example.com</p>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Pro Plan</Badge>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
              <Button variant="primary" size="small">
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#F9FAFB] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm text-[#6B7280]">Member Since</span>
                </div>
                <p className="font-semibold text-[#1F2937]">Dec 1, 2025</p>
              </div>

              <div className="p-3 bg-[#F9FAFB] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm text-[#6B7280]">Billing Cycle</span>
                </div>
                <p className="font-semibold text-[#1F2937]">Monthly</p>
              </div>

              <div className="p-3 bg-[#F9FAFB] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm text-[#6B7280]">Posts Created</span>
                </div>
                <p className="font-semibold text-[#1F2937]">450 / 500</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#8B5CF6]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Full Name"
                defaultValue="Sarah Thompson"
              />
              <Input
                label="Email Address"
                type="email"
                defaultValue="sarah@example.com"
                icon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
              <Button variant="primary" size="medium">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8B5CF6]" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Password
                </label>
                <Button variant="ghost" size="small">
                  Change Password
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Two-Factor Authentication
                </label>
                <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                  <span className="text-sm text-[#6B7280]">Not Enabled</span>
                  <Button variant="primary" size="small">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                  Active Sessions
                </label>
                <div className="space-y-2">
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#1F2937]">MacBook Pro</p>
                        <p className="text-xs text-[#9CA3AF]">San Francisco, CA • Current session</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#8B5CF6]" />
              API Keys
            </CardTitle>
            <Button variant="primary" size="small">
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border-2 border-[#E5E7EB] rounded-lg hover:border-[#8B5CF6] transition-colors">
              <div className="flex-1">
                <p className="font-medium text-[#1F2937] mb-1">Production Key</p>
                <p className="text-sm font-mono text-[#6B7280]">sk_live_••••••••••••xyz</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Created: Dec 1, 2025 • Last used: 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="small">Copy</Button>
                <Button variant="ghost" size="small">Revoke</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8B5CF6]" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'posts', label: 'Post Publishing Notifications', enabled: true },
              { id: 'analytics', label: 'Weekly Analytics Reports', enabled: true },
              { id: 'billing', label: 'Billing & Payment Alerts', enabled: true },
              { id: 'features', label: 'New Features & Updates', enabled: false }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                <span className="text-sm text-[#1F2937]">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#8B5CF6]" />
              Subscription & Billing
            </CardTitle>
            <Button variant="primary" size="small">
              Upgrade Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="mb-4">Current Plan</h5>
              <div className="p-4 bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-xl">
                <h4 className="text-[#7C3AED] mb-2">Pro Plan</h4>
                <p className="text-3xl font-bold text-[#7C3AED] mb-1">$99<span className="text-lg font-normal">/month</span></p>
                <p className="text-sm text-[#7C3AED] mb-4">Billed monthly</p>
                
                <div className="space-y-2 text-sm text-[#7C3AED]">
                  <p>✓ 500 posts per month</p>
                  <p>✓ 1,500 AI generations</p>
                  <p>✓ Advanced analytics</p>
                  <p>✓ Priority support</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-4">Billing Information</h5>
              <div className="space-y-3">
                <div className="p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Next Billing Date</p>
                  <p className="font-semibold text-[#1F2937]">January 1, 2026</p>
                </div>
                <div className="p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Payment Method</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#1F2937]">•••• •••• •••• 4242</p>
                    <Button variant="ghost" size="small">Update</Button>
                  </div>
                </div>
                <div className="p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Billing History</p>
                  <Button variant="ghost" size="small">View Invoices</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-[#FEE2E2]">
        <CardHeader>
          <CardTitle className="text-[#EF4444]">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1F2937] mb-1">Pause Subscription</p>
                <p className="text-sm text-[#6B7280]">Temporarily pause your subscription without losing data</p>
              </div>
              <Button variant="ghost" size="small" className="text-[#F59E0B] hover:bg-[#FEF3C7]">
                Pause
              </Button>
            </div>

            <div className="border-t border-[#FEE2E2] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#EF4444] mb-1">Delete Account</p>
                  <p className="text-sm text-[#6B7280]">Permanently delete your account and all associated data</p>
                </div>
                <Button variant="ghost" size="small" className="text-[#EF4444] hover:bg-[#FEE2E2]">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
