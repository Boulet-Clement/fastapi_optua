// /app/components/AuthForm.tsx
import Input from './Input';
import Link from 'next/link';
import React from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>

        <form className="flex flex-col">
          {mode === 'register' && (
            <Input type="text" label="Nom complet" placeholder="Votre nom" />
          )}
          <Input type="email" label="Email" placeholder="Votre email" />
          <Input type="password" label="Mot de passe" placeholder="Votre mot de passe" />
          {mode === 'register' && (
            <Input
              type="password"
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
            />
          )}

          <button
            type="submit"
            className={`mt-4 text-white py-2 rounded-md transition ${
              mode === 'login' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          {mode === 'login' ? (
            <>
              Pas de compte?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                Inscrivez-vous
              </Link>
            </>
          ) : (
            <>
              Vous avez déjà un compte?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Connectez-vous
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
