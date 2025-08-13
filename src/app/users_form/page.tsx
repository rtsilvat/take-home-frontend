"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, updateUser, type UpsertUserPayload } from "@/API/API";

function UsersFormInner() {
  const router = useRouter();
  const search = useSearchParams();
  const idParam = search.get("id");
  const userId = idParam ? parseInt(idParam, 10) : null;
  const isEdit = !!userId;
  const qc = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId as number),
    enabled: isEdit,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [flagActive, setFlagActive] = useState(true);
  const [expirationAt, setExpirationAt] = useState<string | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setEmail(userData.email);
      setPassword(userData.password);
      setName(userData.name);
      setFlagActive(userData.flag_active);
      setExpirationAt(userData.expiration_at ? userData.expiration_at.substring(0, 10) : "");
    }
  }, [userData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: UpsertUserPayload = {
        email,
        password,
        name,
        flag_active: flagActive,
        expiration_at: expirationAt ? expirationAt : null,
      };
      if (isEdit && userId) {
        return updateUser(userId, payload);
      }
      return createUser(payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] });
      router.push("/list_users");
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : String(e)),
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>{isEdit ? "Editar Usuário" : "Criar Usuário"}</Typography>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}>
        <TextField label="E-mail" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Senha" type="text" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <TextField label="Nome" type="text" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormControlLabel control={<Checkbox checked={flagActive} onChange={(e) => setFlagActive(e.target.checked)} />} label="Ativo" />
        <TextField label="Data de Expiração" type="date" fullWidth margin="normal" value={expirationAt} onChange={(e) => setExpirationAt(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={saveMutation.isPending}>{isEdit ? "Salvar" : "Criar"}</Button>
        <Button type="button" variant="text" sx={{ mt: 2, ml: 2 }} onClick={() => router.push("/list_users")}>Cancelar</Button>
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

export default function UsersFormPage() {
  return (
    <Suspense fallback={null}>
      <UsersFormInner />
    </Suspense>
  );
}


