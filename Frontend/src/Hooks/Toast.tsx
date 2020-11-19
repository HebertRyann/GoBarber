import React, { createContext, useContext, useCallback, useState } from 'react';
import ToastContainer from '../components/ToatsContainer/index';
import { uuid } from 'uuidv4';

interface   ToastContextData{
  addToast(message: Omit<ToastMessage,'id'>): void;
  removeToast(id: string): void;
}

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const addToast = useCallback(({ title, type, description }: Omit<ToastMessage,'id'>) => {
    const id = uuid();
    const toast = {
      id,
      title,
      type,
      description,
    };
    setMessages(state => [...state,toast])
  },[]);

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id))
  },[]);
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages}/>
    </ToastContext.Provider>

  );
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if(!context){
    throw new Error('useToast must be used whitin a ToastProvider')
  }
  return context;
}

export { ToastProvider, useToast }; 