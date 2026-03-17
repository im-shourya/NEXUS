"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

interface EditModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
    profile: any
    onSuccess: () => void
}

export function EditProfileModal({ isOpen, onClose, user, profile, onSuccess }: EditModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Local state for the editable fields
    const [fullName, setFullName] = useState(user?.fullName || "")
    const [phone, setPhone] = useState(user?.phone || "")
    const [sport, setSport] = useState(profile?.sport || "")
    const [position, setPosition] = useState(profile?.position_role || "")
    const [city, setCity] = useState(profile?.city || "")
    const [stateName, setStateName] = useState(profile?.state || "")
    const [height, setHeight] = useState(profile?.height_cm || "")
    const [weight, setWeight] = useState(profile?.weight_kg || "")

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userUpdates: {
                        full_name: fullName,
                        phone: phone
                    },
                    profileUpdates: {
                        sport,
                        position_role: position,
                        city,
                        state: stateName,
                        height_cm: height ? parseInt(height) : null,
                        weight_kg: weight ? parseInt(weight) : null
                    }
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update profile")
            }

            // Automatically refresh the store by resetting or just firing onSuccess which will trigger a refetch
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl bg-[var(--nx-bg2)] rounded-2xl border border-[var(--nx-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--nx-border)] shrink-0">
                    <h2 className="text-xl font-bold text-[var(--nx-text1)]">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--nx-text3)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg3)] rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-[var(--nx-red)]/10 border border-[var(--nx-red)]/20 text-[var(--nx-red)] text-sm">
                            {error}
                        </div>
                    )}

                    <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--nx-text2)] uppercase tracking-wider">Basic Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--nx-text2)] uppercase tracking-wider">Athletic Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Sport</label>
                                    <select
                                        value={sport}
                                        onChange={(e) => setSport(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    >
                                        <option value="">Select Sport</option>
                                        <option value="FOOTBALL">Football</option>
                                        <option value="CRICKET">Cricket</option>
                                        <option value="BASKETBALL">Basketball</option>
                                        <option value="ATHLETICS">Athletics</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Position / Role</label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        placeholder="e.g. Striker (LWF)"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="e.g. 175"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g. 68"
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--nx-text2)] uppercase tracking-wider">Location</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">City</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[var(--nx-text2)]">State</label>
                                    <input
                                        type="text"
                                        value={stateName}
                                        onChange={(e) => setStateName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--nx-bg)] border border-[var(--nx-border)] text-[var(--nx-text1)] focus:border-[var(--nx-green)] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--nx-border)] bg-[var(--nx-bg3)] flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-medium text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:bg-[var(--nx-bg)] border border-transparent hover:border-[var(--nx-border)] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-profile-form"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 focus:ring-4 focus:ring-[var(--nx-green)]/20 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}
