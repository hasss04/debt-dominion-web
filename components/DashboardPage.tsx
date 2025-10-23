import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { User } from '../services/types';
import Spinner from './Spinner';
import { SearchIcon } from './icons';

const DashboardPage: React.FC = () => {
    const { user: currentUser, getAllUsers, updateUserRole, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!authLoading) {
                try {
                    setLoading(true);
                    const allUsers = await getAllUsers();
                    setUsers(allUsers);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUsers();
    }, [getAllUsers, authLoading]);

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.displayName?.toLowerCase().includes(filter.toLowerCase()) ||
            u.email?.toLowerCase().includes(filter.toLowerCase())
        );
    }, [users, filter]);

    const handleRoleChangeClick = (user: User, role: User['role']) => {
        setSelectedUser(user);
        setNewRole(role);
        setShowConfirm(true);
    };

    const confirmRoleChange = async () => {
        if (selectedUser && newRole) {
            await updateUserRole(selectedUser.uid, newRole);
            setUsers(prevUsers => prevUsers.map(u =>
                u.uid === selectedUser.uid ? { ...u, role: newRole } : u
            ));
        }
        setShowConfirm(false);
        setSelectedUser(null);
        setNewRole(null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold font-serif mb-2 text-slate-900 dark:text-brand-light">Admin Dashboard</h1>
            <p className="text-brand-medium mb-8">Manage user roles and permissions.</p>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl">
                <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                     <input
                        type="text"
                        placeholder="Filter users by name or email..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full max-w-sm bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 pl-10 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                {loading || authLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="overflow-x-auto hidden md:block">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">User</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Role</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.uid}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={user.photoURL || ''} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{user.displayName}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">UID: {user.uid}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.uid !== currentUser?.uid ? (
                                                    user.role === 'admin' ? (
                                                        <button onClick={() => handleRoleChangeClick(user, 'member')} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                            Make Member
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleRoleChangeClick(user, 'admin')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                            Make Admin
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Current User</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user.uid} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img className="h-12 w-12 rounded-full" src={user.photoURL || ''} alt="" />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{user.displayName}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                                        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-300 uppercase mb-2">Actions</h4>
                                        {user.uid !== currentUser?.uid ? (
                                            user.role === 'admin' ? (
                                                <button onClick={() => handleRoleChangeClick(user, 'member')} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 w-full text-left p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                                                    Make Member
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRoleChangeClick(user, 'admin')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 w-full text-left p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                                                    Make Admin
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-slate-400 dark:text-slate-500 text-sm p-2">Current User</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
             {showConfirm && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="role-confirm-title"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 id="role-confirm-title" className="text-lg font-bold font-serif text-slate-900 dark:text-white">Confirm Role Change</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {newRole === 'admin'
                                ? <>Are you sure you want to make <span className="font-bold text-slate-900 dark:text-slate-100">{selectedUser?.displayName}</span> an admin?</>
                                : <>Are you sure you want to remove admin privileges from <span className="font-bold text-slate-900 dark:text-slate-100">{selectedUser?.displayName}</span>?</>
                            }
                        </p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                                Cancel
                            </button>
                            <button onClick={confirmRoleChange} className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
