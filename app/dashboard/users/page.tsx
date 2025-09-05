"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { UsersTable } from "@/components/UsersTable";
import { AddUserDialog } from "@/components/modals/AddUserDialog";
import { EditUserDialog } from "@/components/modals/EditUserDialog";
import { Plus, UserCheck, Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { deleteUser, fetchUsers } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import useFetch from "@/helpers/useFetch";
import { User, PaginatedResponse } from "@/types/types";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchUsersCallback = useCallback(() => {
    return fetchUsers({
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch]);

  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useFetch(fetchUsersCallback, [debouncedSearch]);

  const users = userData?.users || [];

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUserAdded = () => {
    refetch();
  };

  const handleUserUpdated = () => {
    refetch();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCcw
                className={`h-4 w-4 transition-transform ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500">Error loading users</div>
        ) : users.length === 0 && !loading && !searchTerm ? (
          <EmptyState
            title="No Users Found"
            description="Add your first user to get started with the library management system."
            icon={UserCheck}
            buttonText="Add User"
            onButtonClick={() => setAddDialogOpen(true)}
          />
        ) : (
          <UsersTable
            users={users}
            loading={loading}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        <AddUserDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onUserAdded={handleUserAdded}
        />

        {selectedUser && (
          <EditUserDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onUserUpdated={handleUserUpdated}
            user={selectedUser}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
