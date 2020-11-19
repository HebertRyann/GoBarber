import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast'
import { Container } from './styles';
import { ToastMessage } from '../../Hooks/Toast'

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messageWithTrasitions = useTransition(messages, message => message.id, {
    from: {right: '-120%'},
    enter: {right: '0%'},
    leave: {right: '-120%'}
  });
  return (
    <Container >
      {messageWithTrasitions.map(({ key, item, props }) => (
        <Toast  key={key} message={item} style={props}>
        
      </Toast>
      ))}
    </Container>
  )
};

export default ToastContainer;