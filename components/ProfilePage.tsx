
import React, { useState, useRef, ChangeEvent } from 'react';
import { useAuth } from './AuthContext';
import { SunIcon, MoonIcon, UserIcon } from './icons';
import type { Theme } from '../services/types';

const ProfilePage: React.FC = () => {
    const { user, theme, setTheme, updateUser } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
    };
    
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ displayName, photoURL: photoPreview });
        alert('Profile updated successfully!');
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold font-serif mb-8 text-slate-900 dark:text-brand-light">Profile Settings</h1>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl mb-8">
                <h2 className="text-xl font-bold font-serif mb-6 text-slate-800 dark:text-brand-light">Personal Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                        <div className="relative">
                            <button type="button" onClick={handleAvatarClick} className="relative w-24 h-24 rounded-full group">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                                ): (
                                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <UserIcon className="w-12 h-12 text-slate-500" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    Change
                                </div>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                        <div className="flex-grow w-full">
                             <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full bg-slate-200 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                    </div>
                     <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
                 <h2 className="text-xl font-bold font-serif mb-4 text-slate-800 dark:text-brand-light">Theme Preference</h2>
                 <p className="text-sm text-slate-600 dark:text-brand-medium mb-4">Choose how Debt & Dominion looks to you.</p>
                 <div className="flex gap-4">
                     <button
                        onClick={() => handleThemeChange('light')}
                        className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${theme === 'light' ? 'border-brand-primary bg-orange-50 dark:bg-orange-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
                     >
                         <SunIcon className="w-5 h-5"/> Light
                     </button>
                     <button
                        onClick={() => handleThemeChange('dark')}
                        className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'border-brand-primary bg-orange-50 dark:bg-orange-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
                     >
                         <MoonIcon className="w-5 h-5"/> Dark
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default ProfilePage;