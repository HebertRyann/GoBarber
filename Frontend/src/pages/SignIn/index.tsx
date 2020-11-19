import React, { useRef, useCallback, useContext } from "react";
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../Hooks/Auth';
import { useToast } from '../../Hooks/Toast';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { SignIn, user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('email obrigatorio').email('digite um email valido'),
        password: Yup.string().required('senha obrigatoria'),
      });
      await schema.validate(data, { abortEarly: false });

      await SignIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard')

    } catch (err) {
      if (err instanceof Yup.ValidationError) {

        const errros = getValidationErrors(err)

        formRef.current?.setErrors(errros);

        return;
      }

      addToast({
        title: 'Erro na Autenticaçao',
        type: 'error',
        description: 'Ocorreu um Erro ao fazer login'
      });

    }


  }, [SignIn, addToast, history]);
  return (
    <Container>
      <Content>
        <AnimationContainer>

          <img src={logoImg} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Logon</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
            <Button type="submit">Entrar</Button>
            <Link to="/forgot-password">Esqueci Minha Senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
          Criar Conta
          </Link>

        </AnimationContainer>
      </Content>
      <Background />

    </Container>
  );
}

export default SignIn;