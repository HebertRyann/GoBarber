import React, { useRef, useCallback, useContext, useState } from "react";
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../Hooks/Toast';
import api from "../../services/api";

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('email obrigatorio').email('digite um email valido'),
      });
      await schema.validate(data, { abortEarly: false });

      await api.post('/password/forgot', {
        email: data.email
      });
      addToast({
        type: 'success',
        title: 'E-mail de Recuperaçao enviado',
        description: `Enviamos um email de recuperaçao da sua senha para o email: ${data.email}`
      })

    } catch (err) {
      if (err instanceof Yup.ValidationError) {

        const errros = getValidationErrors(err)

        formRef.current?.setErrors(errros);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na Recuperaçao da senha',
        description: 'Ocorreu um Erro ao tentar Recuperar a sua senha tente novamente'
      });

    } finally {
      setLoading(false);
    }


  }, [addToast, history]);
  return (
    <Container>
      <Content>
        <AnimationContainer>

          <img src={logoImg} />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>
          <Link to="/signin">
            <FiLogIn />
          Voltar ao Login
          </Link>

        </AnimationContainer>
      </Content>
      <Background />

    </Container>
  );
}

export default ForgotPassword;