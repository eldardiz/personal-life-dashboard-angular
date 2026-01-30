export interface TrackerModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  color: string;
}

export interface TrackerEntry {
  id: string;
  moduleId: string;
  date: Date;
  value: any;
  notes?: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
  theme: string;
  selectedModules: string[];
}
