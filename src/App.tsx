import React, { useState } from 'react';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { WeeklyTimeline } from './components/Dashboard/WeeklyTimeline';
import { QuickStats } from './components/Dashboard/QuickStats';
import { ActivityFeed } from './components/Dashboard/ActivityFeed';
import { UserProfile } from './components/Dashboard/UserProfile';
import { ContentLibrary } from './components/Pages/ContentLibrary';
import { CalendarView } from './components/Pages/CalendarView';
import { TemplatesPage } from './components/Pages/TemplatesPage';
import { SettingsPage } from './components/Pages/SettingsPage';
import { AllActivity } from './components/Pages/AllActivity';
import { DraftsPage } from './components/Pages/DraftsPage';
import { BackButton } from './components/ui/BackButton';
import { RadarPage } from './components/Radar/RadarPage';
import { MixerPage } from './components/Mixer/MixerPage';
import { EditorPage } from './components/Editor/EditorPage';
import { TimelinePage } from './components/Timeline/TimelinePage';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserManagement } from './components/Admin/UserManagement';
import { Button } from './components/ui/button';
import { Modal, ModalContent } from './components/ui/Modal';
import { CheckCircle, Sparkles } from 'lucide-react';

type AppMode = 'user' | 'admin';
type UserPage = 'dashboard' | 'create' | 'content' | 'calendar' | 'templates' | 'settings' | 'profile' | 'activity' | 'drafts';
type FlowStep = 'radar' | 'mixer' | 'editor' | 'timeline';
type AdminTab = 'dashboard' | 'users';

// Pages that are in the left menu (primary navigation)
const menuPages = ['dashboard', 'create', 'content', 'calendar', 'templates', 'settings'];

// Define parent pages for smart back navigation
const pageParents: Record<string, string> = {
  'profile': 'settings',
  'activity': 'dashboard',
  'drafts': 'calendar'
};

export default function App() {
  // App Mode (User vs Admin)
  const [appMode, setAppMode] = useState<AppMode>('user');
  
  // Navigation History for back button
  const [navigationHistory, setNavigationHistory] = useState<UserPage[]>(['dashboard']);
  const [currentPage, setCurrentPage] = useState<UserPage>('dashboard');
  
  // Flow State
  const [activeFlow, setActiveFlow] = useState<FlowStep | null>(null);
  const [sourceData, setSourceData] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Admin State
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Smart Navigation Handler
  const handleNavigate = (page: string) => {
    const newPage = page as UserPage;
    
    // Add to history only if it's different from current
    if (newPage !== currentPage) {
      setNavigationHistory([...navigationHistory, currentPage]);
    }
    
    setCurrentPage(newPage);
    setActiveFlow(null);
  };

  // Smart Back Button Handler
  const handleBack = () => {
    if (navigationHistory.length > 0) {
      // Go back to previous page in history
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentPage(previousPage);
    } else if (pageParents[currentPage]) {
      // If no history, go to logical parent
      setCurrentPage(pageParents[currentPage] as UserPage);
    } else {
      // Default to dashboard
      setCurrentPage('dashboard');
    }
  };

  // Determine if back button should be shown
  const showBackButton = !menuPages.includes(currentPage);

  // Flow Handlers
  const handleStartCampaign = () => {
    setActiveFlow('radar');
  };

  const handleRadarSelect = (mode: string, data: any) => {
    setSourceData({ mode, ...data });
    setActiveFlow('mixer');
  };

  const handleMixerComplete = (content: any) => {
    setGeneratedContent(content);
    setActiveFlow('editor');
  };

  const handleEditorProceed = (content: any) => {
    setGeneratedContent(content);
    setActiveFlow('timeline');
  };

  const handleTimelineActivate = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setActiveFlow(null);
      setCurrentPage('dashboard');
      setNavigationHistory(['dashboard']);
      setSourceData(null);
      setGeneratedContent(null);
    }, 3000);
  };

  const handleCloseFlow = () => {
    setActiveFlow(null);
    setSourceData(null);
    setGeneratedContent(null);
  };

  // Render User Mode
  if (appMode === 'user') {
    return (
      <>
        <DashboardLayout
          onCreateCampaign={handleStartCampaign}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        >
          {/* Show back button for non-menu pages */}
          {showBackButton && (
            <BackButton 
              onClick={handleBack}
              label={`Back to ${pageParents[currentPage] || 'Dashboard'}`}
            />
          )}

          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <>
              <WeeklyTimeline onViewCalendar={() => handleNavigate('calendar')} />
              <QuickStats onNavigate={handleNavigate} />
              <ActivityFeed onViewAll={() => handleNavigate('activity')} />
              
              {/* Demo Mode Switcher */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-xl">
                <h5 className="text-[#7C3AED] mb-2">🎨 Interactive Demo</h5>
                <p className="text-sm text-[#7C3AED] mb-4">
                  Explore all features: Create campaigns, manage content, view calendar, drafts, and switch to admin mode.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" onClick={handleStartCampaign}>
                    <Sparkles className="w-4 h-4" />
                    Create Campaign
                  </Button>
                  <Button variant="secondary" onClick={() => handleNavigate('content')}>
                    View Content Library
                  </Button>
                  <Button variant="ghost" onClick={() => handleNavigate('drafts')}>
                    View Drafts
                  </Button>
                  <Button variant="ghost" onClick={() => setAppMode('admin')}>
                    Switch to Admin Panel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Create Content */}
          {currentPage === 'create' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="gradient-text mb-3">Start Creating Content</h2>
              <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
                Launch the content creation workflow to transform trends into multi-platform posts
              </p>
              <Button variant="primary" size="large" onClick={handleStartCampaign}>
                <Sparkles className="w-5 h-5" />
                Create New Campaign
              </Button>
            </div>
          )}

          {/* Content Library */}
          {currentPage === 'content' && <ContentLibrary />}

          {/* Calendar */}
          {currentPage === 'calendar' && <CalendarView onNavigate={handleNavigate} />}

          {/* Templates */}
          {currentPage === 'templates' && <TemplatesPage />}

          {/* Settings */}
          {currentPage === 'settings' && <SettingsPage />}

          {/* User Profile */}
          {currentPage === 'profile' && <UserProfile />}

          {/* All Activity */}
          {currentPage === 'activity' && <AllActivity />}

          {/* Drafts */}
          {currentPage === 'drafts' && <DraftsPage />}
        </DashboardLayout>

        {/* Flow Modals */}
        <RadarPage
          isOpen={activeFlow === 'radar'}
          onClose={handleCloseFlow}
          onProceed={handleRadarSelect}
        />

        <MixerPage
          isOpen={activeFlow === 'mixer'}
          sourceData={sourceData}
          onComplete={handleMixerComplete}
        />

        <EditorPage
          isOpen={activeFlow === 'editor'}
          generatedContent={generatedContent}
          onClose={handleCloseFlow}
          onProceedToSchedule={handleEditorProceed}
        />

        <TimelinePage
          isOpen={activeFlow === 'timeline'}
          content={generatedContent}
          onClose={handleCloseFlow}
          onActivate={handleTimelineActivate}
        />

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          size="medium"
          showClose={false}
        >
          <ModalContent>
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center animate-pulse-glow">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="gradient-text mb-3">Campaign Activated! 🎉</h2>
              <p className="text-[#6B7280] mb-6">
                Your content has been scheduled successfully. All 7 posts will be published automatically across 4 platforms this week.
              </p>
              <div className="bg-[#D1FAE5] rounded-xl p-4 text-sm text-[#065F46]">
                <p className="font-semibold mb-2">✓ What happens next:</p>
                <ul className="text-left space-y-1 ml-4">
                  <li>• Posts will publish at optimal times</li>
                  <li>• You'll receive notifications for each post</li>
                  <li>• Analytics will be available in 24 hours</li>
                </ul>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Render Admin Mode
  return (
    <>
      <AdminLayout activeTab={adminTab} onTabChange={(tab) => setAdminTab(tab as AdminTab)}>
        {/* Demo Mode Switcher */}
        <div className="mb-6 p-4 bg-gradient-to-br from-[#DDD6FE] to-[#F3E8FF] rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h5 className="text-[#7C3AED] mb-1">🎨 Admin Panel Demo</h5>
              <p className="text-sm text-[#7C3AED]">
                Explore admin features: User management, analytics, templates, and API configuration
              </p>
            </div>
            <Button variant="secondary" size="small" onClick={() => setAppMode('user')}>
              Switch to User Dashboard
            </Button>
          </div>
        </div>

        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'users' && <UserManagement />}
      </AdminLayout>
    </>
  );
}
