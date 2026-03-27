import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdSlot from '@/components/AdSlot'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Top leaderboard ad */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
        <AdSlot variant="banner" />
      </div>

      {/* Main content + sidebar */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Page content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>

          {/* Sidebar ads (desktop only) */}
          <aside className="hidden xl:flex flex-col gap-5 w-72 shrink-0">
            <AdSlot variant="sidebar" />
            <AdSlot variant="sidebar" />
          </aside>
        </div>
      </div>

      {/* Pre-footer ad */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4">
        <AdSlot variant="banner" />
      </div>

      <Footer />
    </div>
  )
}
