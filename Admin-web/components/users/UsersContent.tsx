'use client';

import React, { useState } from 'react';
import UserTable from './UserTable';
import { Plus } from 'lucide-react';
import AddUserModal from '@/components/AddUserModal';
import EditUserModal from '@/components/EditUserModal';
import { usersAPI } from '@/lib/api';
import { User } from '@/lib/types';

const UsersContent = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddSuccess = () => {
    // Refresh the user table
    // You'll need to pass a refresh function to UserTable
    window.location.reload(); // Simple refresh
    // Or better: use a state management solution
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (data: Partial<User>) => {
    if (!selectedUser) return;
    
    try {
      await usersAPI.update(selectedUser.id, data);
      // Refresh or update state
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>
      
      <UserTable onEditClick={handleEditClick} />
      
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default UsersContent;