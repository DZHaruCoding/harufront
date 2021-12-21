import { createContext, useState } from 'react';
import { settings } from '../config';

const AppContext = createContext(settings);

export const EmailContext = createContext({ emails: [] });

export const FeedContext = createContext({ feeds: [] });

export const AuthWizardContext = createContext({ user: {} });

export const ChatContext = createContext();

export const KanbanContext = createContext({ KanbanColumns: [], kanbanTaskCards: [] });

export const ActivityContext = createContext({ activityLog: [] });
export const ProductContext = createContext({ products: [] });
export const TaskContext = createContext({ task: [] });

export const DateContext = createContext({ onDateSetting: (a, b) => {}, dateSet: { start: '', end: '' } });

export const Store = props => {
  const [dateSet, setDateSet] = useState({ state: '', end: '' });

  const onDateSetting = (start, end) => {
    if (start && end) {
      const startDay =
        start.getFullYear().toString() + `.` + (start.getMonth() + 1).toString() + `.` + start.getDate().toString;
      const endDay = end.getFullYear().toString() + `.` + (end.getDate() + 1).toString() + `.` + end.getDate().toString;
      return setDateSet({ start: startDay, end: endDay });
    } else {
      return;
    }
  };
};

export default AppContext;
