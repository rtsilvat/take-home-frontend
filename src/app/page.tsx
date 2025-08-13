"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Container, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { login } from "@/API/API";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async () => {
      return login(email, password);
    },
    onSuccess: (data) => {
      sessionStorage.setItem("access_token", data.access_token);
      router.push("/list_users");
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : String(e);
      setError(message || "Login failed");
    },
  });

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }}>
        <TextField label="E-mail" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loginMutation.isPending}>Enviar</Button>
      </Box>
      <Dialog open={!!error} onClose={() => setError(null)}>
        <DialogTitle>Erro</DialogTitle>
        <DialogContent>{error}</DialogContent>
        <DialogActions>
          <Button onClick={() => setError(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
