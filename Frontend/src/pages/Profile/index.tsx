/* eslint-disable camelcase */
import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../Hooks/Toast';
import { useAuth } from '../../Hooks/Auth';

interface ProfileDataForm {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileDataForm) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('email obrigatorio').email('digite um email valido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatorio'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatorio'),
          otherwise: Yup.string(),
        }).oneOf([Yup.ref('password'), undefined], 'As senhas informadas são Diferentes')
      });
      await schema.validate(data, { abortEarly: false });

      const { email, name, password, old_password, password_confirmation } = data;

      const formData = {
        name,
        email,
        ...(old_password
          ? {
            old_password, password,
            password_confirmation
          } : {})
      };

      const respose = await api.put('/profile', formData);

      updateUser(respose.data);

      history.push('/dashboard')
      addToast({
        type: 'success',
        title: 'Perfil Atualizado',
        description: 'Suas Alteraçoes foram atualizadas com Sucesso'
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {

        const errros = getValidationErrors(err)

        formRef.current?.setErrors(errros);
        return;
      }

      addToast({
        title: 'Erro na Atualizaçao',
        type: 'error',
        description: 'Erro ao Fazer a Atualizaçao do seu Perfil Tente Novamente'
      });
    }


  }, [addToast, history]);

  const handleAvatarChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const data = new FormData();
      data.append('avatar', event.target.files[0]);
      api.patch('users/avatar', data).then((response) => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar Atualizado'
        })
      })
    }

  }, [addToast, updateUser])

  return (
    <Container>
      <header>
        <div>

          <Link to="/dashboard">
            <FiArrowLeft size={24} />
          </Link>
        </div>
      </header>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={{
          name: user.name,
          email: user.email
        }}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera size={20} />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input name="old_password" icon={FiLock} type="password" placeholder="Senha Atual" constainerStyle={{ marginTop: 24 }} />
          <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirma Nova Senha" />
          <Button type="submit">Confirma Alteraçoes</Button>
        </Form>
      </Content>

    </Container>
  );
}


export default Profile;