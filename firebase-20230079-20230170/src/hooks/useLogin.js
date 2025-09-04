import { signInWithEmailAndPassword } from 'firebase/auth';

export function useLogin(auth) {
  const login = async ({ email, password }) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred;
  };
  return login;
}