'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Eye, Search, CreditCard } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { usersAPI } from '@/lib/api';
import { User } from '@/lib/types';
import EditUserModal from '../EditUserModal'; // Import the EditUserModal
import UserDetailsModal from './UserDetailsModal'; // You need to create this or remove the View button

const UserTable = () => {
  const { data: users, loading, error, execute: refreshUsers } = useFetch<User[]>(usersAPI.getAll);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        refreshUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleSaveUser = async (data: Partial<User>) => {
    try {
      if (selectedUser) {
        await usersAPI.update(selectedUser.id, data);
        refreshUsers();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const filteredUsers = users?.filter((user: User) => {
    return (
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  if (loading) return (
    <div className="bg-card rounded-lg shadow border border-border p-8">
      <div className="text-center text-muted-foreground">Loading users...</div>
    </div>
  );

  if (error) return (
    <div className="bg-card rounded-lg shadow border border-border p-8">
      <div className="text-center text-destructive">Error: {error}</div>
    </div>
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'trainer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getMembershipBadgeColor = (membershipName: string) => {
    switch (membershipName) {
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'premium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pro': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">Users ({users?.length || 0})</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=random`}
                          alt={user.full_name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.gender} • {user.height ? `${user.height}cm` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{user.email}</div>
                    <div className="text-sm text-muted-foreground">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipBadgeColor(user.membership_types.name)}`}>
                        {user.membership_types.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${user.membership_types.price}/mo
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewClick(user)}
                        className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-primary/10 rounded"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="text-success hover:text-success/80 transition-colors p-1 hover:bg-success/10 rounded"
                        title="Edit User"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {users?.length === 0 ? 'No users found' : 'No users match your search'}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* View User Modal - You need to create this component */}
      {/* {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )} */}
    </>
  );
};

export default UserTable;