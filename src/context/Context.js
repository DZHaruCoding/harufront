import { createContext } from 'react';
import { settings } from '../config';

const AppContext = createContext(settings);

export const EmailContext = createContext({ emails: [] });

export const FeedContext = createContext({ feeds: [] });

export const AuthWizardContext = createContext({ user: {} });

export const ChatContext = createContext();

export const KanbanContext = createContext({ KanbanColumns: [], kanbanTaskCards: [] });

export const ProfileContext = createContext({ Profile : []})

export const ActivityContext = createContext({ activityLog: [] });
export const ProductContext = createContext({ products: [] });
export const TaskContext = createContext({ task: [] });

export default AppContext;
