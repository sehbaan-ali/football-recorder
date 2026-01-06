import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  Text,
  Label,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    padding: '32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: '4px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '16px',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

export function Login() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
      } else {
        // Successful login - redirect to dashboard
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Button
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          onClick={() => navigate('/')}
          style={{ marginBottom: '16px' }}
        >
          Back
        </Button>
        <div className={styles.header}>
          <div className={styles.title}>Football Recorder</div>
          <Text className={styles.subtitle}>Login</Text>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(_, data) => setEmail(data.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(_, data) => setPassword(data.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <Text className={styles.error}>{error}</Text>
          )}

          <Button
            appearance="primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className={styles.footer}>
          <Text>Admin access only</Text>
        </div>
      </Card>
    </div>
  );
}
