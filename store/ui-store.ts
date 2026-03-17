import { create } from "zustand"

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  setSidebarCollapsed: (v: boolean) => void
  setMobileSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void

  // Alerts / notifications
  unreadAlertCount: number
  unreadMessageCount: number
  setUnreadAlerts: (n: number) => void
  setUnreadMessages: (n: number) => void
  incrementAlerts: () => void
  clearAlerts: () => void

  // Active page
  activePage: string
  setActivePage: (page: string) => void

  // Global toast / banner
  banner: { message: string; type: "success" | "warning" | "error" | "info" } | null
  setBanner: (banner: UIStore["banner"]) => void
  clearBanner: () => void

  // Language
  language: "en" | "hi"
  setLanguage: (lang: "en" | "hi") => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  unreadAlertCount: 5,
  unreadMessageCount: 2,
  setUnreadAlerts: (n) => set({ unreadAlertCount: n }),
  setUnreadMessages: (n) => set({ unreadMessageCount: n }),
  incrementAlerts: () => set(s => ({ unreadAlertCount: s.unreadAlertCount + 1 })),
  clearAlerts: () => set({ unreadAlertCount: 0 }),

  activePage: "",
  setActivePage: (page) => set({ activePage: page }),

  banner: null,
  setBanner: (banner) => set({ banner }),
  clearBanner: () => set({ banner: null }),

  language: "en",
  setLanguage: (language) => set({ language }),
}))
