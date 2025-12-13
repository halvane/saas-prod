'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Settings, Palette, Globe, Bell, Shield, Zap, Share2, Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { connectSocialMedia, getConnectedAccounts } from '@/app/(dashboard)/settings/actions';
import { toast } from 'sonner';

export function SettingsPage() {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectedAccounts, setConnectedAccounts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await getConnectedAccounts();
      setConnectedAccounts(accounts);
    };
    fetchAccounts();
  }, []);

  const handleConnectSocial = async () => {
    setIsConnecting(true);
    try {
      const url = await connectSocialMedia();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error('Failed to connect social media');
    } finally {
      setIsConnecting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-600" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4 text-blue-600" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4 text-blue-700" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4 text-black" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4 text-red-600" />;
    return <Globe className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="gradient-text mb-2">Settings</h2>
        <p className="text-[#6B7280]">Configure your application preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#8B5CF6]" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Workspace Name"
              defaultValue="Sarah's Creative Studio"
            />
            <Select
              label="Default Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
            />
            <Select
              label="Timezone"
              options={[
                { value: 'pst', label: 'Pacific Time (PST)' },
                { value: 'est', label: 'Eastern Time (EST)' },
                { value: 'utc', label: 'UTC' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#EC4899]" />
            Social Media Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Connect your social media accounts to enable auto-posting.
            </p>
            
            {connectedAccounts.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {connectedAccounts.map((account) => (
                  <div 
                    key={account.platform} 
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {getPlatformIcon(account.platform)}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900 capitalize">{account.platform}</span>
                      <span className="text-[10px] text-gray-500">{account.username}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-2" />
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={handleConnectSocial} 
              disabled={isConnecting}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white"
            >
              {isConnecting ? 'Connecting...' : 'Connect Accounts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#8B5CF6]" />
            Brand DNA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Brand Colors (comma separated)"
              placeholder="#8B5CF6, #7C3AED, #A78BFA"
            />
            <Select
              label="Default Tone"
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'casual', label: 'Casual & Friendly' },
                { value: 'inspiring', label: 'Inspiring' },
                { value: 'educational', label: 'Educational' }
              ]}
            />
            <Input
              label="Target Audience"
              placeholder="e.g., Young professionals, 25-35"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#8B5CF6]" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              label="AI Model"
              options={[
                { value: 'gpt4', label: 'GPT-4 (Recommended)' },
                { value: 'gpt35', label: 'GPT-3.5 (Faster)' },
                { value: 'custom', label: 'Custom Model' }
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Content Safety
              </label>
              <div className="space-y-2">
                {[
                  { id: 'moderation', label: 'Enable content moderation', enabled: true },
                  { id: 'nsfw', label: 'Filter NSFW content', enabled: true },
                  { id: 'controversial', label: 'Warn about controversial topics', enabled: false }
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="large">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
