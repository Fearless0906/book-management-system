"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { UserList } from "@/components/UserList";
import { AddUserDialog } from "@/components/modals/AddUserDialog";
import { EditUserDialog } from "@/components/modals/EditUserDialog";
import { Plus, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage library users and permissions
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title="No Users Found"
            description="Add your first user to get started with the library management system."
            icon={UserCheck}
            buttonText="Add User"
            onButtonClick={() => setAddDialogOpen(true)}
          />
        ) : (
          <UserList
            users={users}
            onEditUser={handleEditUser}
            onUserDeleted={handleUserDeleted}
          />
        )}
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onUserAdded={handleUserAdded}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={handleUserUpdated}
        user={selectedUser}
      />
    </DashboardLayout>
  );
}
