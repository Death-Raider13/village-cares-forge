import { Analytics } from './Analytics';
import { UserManagement } from './UserManagement';
import { ContentManager } from './ContentManager';

export const EnhancedAdminPanel = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Analytics />
            <UserManagement />
            <ContentManager />
        </div>
    );
};