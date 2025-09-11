'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/forms/inputs/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const trans = useTranslations('Auth');
  const locale = useLocale();

  const password = watch('password', '');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url =
        mode === 'login'
          ? 'http://localhost:8000/auth/login'
          : 'http://localhost:8000/auth/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // très important
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || 'Erreur lors de la requête');
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        // Stockage du token
        localStorage.setItem('token', result.token);
        alert('Connexion réussie !');
        router.push('/dashboard'); // redirection après login
      } else {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        router.push(`/${locale}/login`);
      }
    } catch (err) {
      console.error('Erreur fetch :', err);
      alert('Erreur lors de la connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? trans('login') : trans('register')}
        </h1>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {mode === 'register' && (
            <>
              <Input
                type="text"
                label="Nom complet"
                placeholder="Votre nom"
                {...register('name', { required: 'Le nom est requis' })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </>
          )}

          <Input
            type="email"
            label="Email"
            placeholder="Votre email"
            {...register('email', {
              required: 'L’email est requis',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input
            type="password"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            {...register('password', { required: 'Le mot de passe est requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {mode === 'register' && (
            <>
              <Input
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
                {...register('confirmPassword', {
                  required: 'La confirmation est requise',
                  validate: (value: string | undefined) =>
                    value === password || 'Les mots de passe ne correspondent pas'
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className={`mt-4 text-white py-2 rounded-md transition ${
              mode === 'login' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          {mode === 'login' ? (
            <>
              {trans('noAccount')+ ' '}
              <Link href={`/${locale}/register`} className="text-blue-500 hover:underline">
                {trans('registerHere')}
              </Link>
            </>
          ) : (
            <>
              {trans('alreadyHaveAccount')+ ' '}
              <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
                {trans('loginHere')}
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
