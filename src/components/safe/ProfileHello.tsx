import { useAuthCtx } from '../../providers/AuthProvider';

export default function ProfileHello() {
  const { user } = useAuthCtx();
  return <span>{user ? `Hello, ${user.email}`  : 'Hello, guest'}</span>;
}
