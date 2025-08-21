export const userPreferencesServiceTemplate = () => `import { encrypt } from "@/utils/encrypt";
import { decrypt } from "@/utils/decrypt";

const STORAGE_KEY = "cs_user_preferences";
const ENCRYPTION_KEY = "cs_studio_prefs_2024";

export interface UserPreferences {
  modules: {
    selectedModule?: string;
  };
  tabs: {
    [pageName: string]: string;
  };
  sidebar: {
    sectionStates: Record<string, boolean>;
    searchTerm?: string;
  };
  [key: string]: any;
}

const defaultPreferences: UserPreferences = {
  modules: {},
  tabs: {},
  sidebar: {
    sectionStates: {},
    searchTerm: "",
  },
};

class UserPreferencesService {
  private preferences: UserPreferences;
  private initialized = false;

  constructor() {
    this.preferences = { ...defaultPreferences };
    this.init();
  }

  private init() {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const decrypted = decrypt(stored, ENCRYPTION_KEY);
        if (decrypted) {
          this.preferences = {
            ...defaultPreferences,
            ...JSON.parse(decrypted),
          };
        }
      }
    } catch (error) {
      console.warn("Failed to load user preferences:", error);
    }

    this.initialized = true;
  }

  private save() {
    if (typeof window === "undefined" || !this.initialized) return;

    try {
      const serialized = JSON.stringify(this.preferences);
      const encrypted = encrypt(serialized, ENCRYPTION_KEY);
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error("Failed to save user preferences:", error);
    }
  }

  getSelectedModule(): string | undefined {
    return this.preferences.modules.selectedModule;
  }

  setSelectedModule(module: string) {
    this.preferences.modules.selectedModule = module;
    this.save();
  }

  getActiveTab(pageName: string): string | undefined {
    return this.preferences.tabs[pageName];
  }

  setActiveTab(pageName: string, tabValue: string) {
    this.preferences.tabs[pageName] = tabValue;
    this.save();
  }

  getSidebarSectionState(sectionKey: string): boolean {
    return this.preferences.sidebar.sectionStates[sectionKey] || false;
  }

  setSidebarSectionState(sectionKey: string, isOpen: boolean) {
    this.preferences.sidebar.sectionStates[sectionKey] = isOpen;
    this.save();
  }

  getAllSidebarSectionStates(): Record<string, boolean> {
    return { ...this.preferences.sidebar.sectionStates };
  }

  setSidebarSearchTerm(searchTerm: string) {
    this.preferences.sidebar.searchTerm = searchTerm;
    this.save();
  }

  getSidebarSearchTerm(): string {
    return this.preferences.sidebar.searchTerm || "";
  }

  get<T>(key: string): T | undefined {
    const keys = key.split(".");
    let current: any = this.preferences;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return current as T;
  }

  set(key: string, value: any) {
    const keys = key.split(".");
    let current: any = this.preferences;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== "object") {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
    this.save();
  }

  clear() {
    this.preferences = { ...defaultPreferences };
    this.save();
  }

  getAll(): UserPreferences {
    return { ...this.preferences };
  }
}

export const userPreferencesService = new UserPreferencesService();`;