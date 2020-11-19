import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import SignUpBackground from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  width: 100%;
  max-width: 700px;
  align-items: center;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }to {
    opacity: 1;
    transform: translateX(0);
  }

`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;
  form {
    margin: 80px 0px;
    text-align: center;
    width: 340px
  }
  h1{ 
    margin-bottom: 24px;
  }

  a {
    display: block;
    color: #F4EDE8;
    text-decoration: none;
    transition: color 0.2s;
    margin-top: 24px;

    &:hover {
      color: ${shade(0.2, '#F4EDE8')};
    }
  }

  > a {
    display: flex;
    align-items: center;
    color: #ff9000;
    text-decoration: none;
    transition: color 0.2s;
    margin-top: 24px;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${SignUpBackground}) no-repeat center;
  background-size: cover;
`;