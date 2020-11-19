import React, { useRef, useCallback, useContext } from "react";
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useHistory, useLocation } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../Hooks/Auth';
import { useToast } from '../../Hooks/Toast';
import api from "../../services/api";

interface ResetPasswordFormData {
  password_confirmation: string;
  password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { SignIn, user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('senha obrigatoria'),
        password_confirmation: Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'As senhas informadas são Diferentes')
      });
      await schema.validate(data, { abortEarly: false });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if (!token) {
        throw new Error()
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      })


      history.push('/')

    } catch (err) {
      if (err instanceof Yup.ValidationError) {

        const errros = getValidationErrors(err)

        formRef.current?.setErrors(errros);

        return;
      }

      addToast({
        title: 'Erro ao Resetar sua Senha',
        type: 'error',
        description: 'Ocorreu um Erro ao Resetar sua Senha tente novamente'
      });

    }


  }, [addToast, history, location.search]);
  return (
    <Container>
      <Content>
        <AnimationContainer>

          <img src={logoImg} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Logon</h1>
            <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
            <Input name="password_confirmation" icon={FiMail} type="password" placeholder="Confirmaçao da Senha" />
            <Button type="submit">Alterar Senha</Button>
          </Form>


        </AnimationContainer>
      </Content>
      <Background />

    </Container>
  );
}

export default ResetPassword;