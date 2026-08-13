import { useState } from "react";
import { TextInput, PasswordInput, Checkbox, Button, Stack, Title, Paper, Alert } from "@mantine/core";
import { supabase } from "../api/supabase";

const rememberedEmailKey = "creadores-web-remembered-email";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem(rememberedEmailKey) ?? "");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(() => Boolean(localStorage.getItem(rememberedEmailKey)));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos");
      return;
    }
    if (rememberPassword) localStorage.setItem(rememberedEmailKey, email);
    else localStorage.removeItem(rememberedEmailKey);
    onLogin();
  };

  return (
    <Stack align="center" justify="center" style={{ height: "100vh" }}>
      <Paper shadow="md" p="xl" w={350}>
        <Title order={2} mb="md">Creadores Web</Title>
        <Stack>
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <Checkbox label="Recordar contraseña" checked={rememberPassword} onChange={(event) => setRememberPassword(event.currentTarget.checked)} />
          {error && <Alert color="red">{error}</Alert>}
          <Button onClick={handleLogin} loading={loading}>
            Entrar
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}