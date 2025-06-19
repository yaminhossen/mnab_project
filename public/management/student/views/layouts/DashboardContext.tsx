// DashboardContext.tsx
import { createContext } from 'react';

interface DashboardContextType {
    loading: boolean;
}

export const DashboardContext = createContext<DashboardContextType>({
    loading: true,
});
