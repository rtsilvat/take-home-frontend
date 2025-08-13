"use client";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Box, Container, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getUsers, type User, deleteUser } from "@/API/API";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function fetchUsers(): Promise<User[]> { return getUsers(); }

export default function ListUsersPage() {
  ModuleRegistry.registerModules([AllCommunityModule]);
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      { headerName: "ID", field: "id", width: 90 },
      { headerName: "E-mail", field: "email", flex: 1 },
      { headerName: "Nome", field: "name", flex: 1 },
      { headerName: "Ativo", field: "flag_active", width: 120 },
      { headerName: "Expiração", field: "expiration_at", flex: 1 },
      { headerName: "Criado em", field: "insert_at", flex: 1 },
      { headerName: "Atualizado em", field: "update_at", flex: 1 },
      {
        headerName: "Ações",
        width: 140,
        cellRenderer: (p: { data: User }) => {
          const u = p.data;
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" onClick={() => router.push(`/users_form?id=${u.id}`)} aria-label="edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmId(u.id)} aria-label="delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [router],
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>Lista de Usuários</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={() => router.push('/users_form')}>Novo Usuário</Button>
          <Button variant="contained" color="warning" onClick={() => { sessionStorage.removeItem('access_token'); router.push('/'); }}>Sair</Button>
        </Box>
      </Box>
      {isLoading && <Typography>Carregando...</Typography>}
      {isError && <Typography color="error">{String(error)}</Typography>}
      {data && (
        <Box className="ag-theme-quartz" sx={{ height: 500, width: "100%" }}>
          <AgGridReact theme="legacy" rowData={data} columnDefs={columnDefs} pagination />
        </Box>
      )}
      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir o usuário {confirmId}?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button color="error" onClick={async () => { if (confirmId) { await deleteUser(confirmId); setConfirmId(null); await refetch(); } }}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}


