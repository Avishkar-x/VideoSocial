import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { updateAccountDetails, changePassword, updateAvatar, updateCoverImage } from "../api/user.api"
import { Link } from "react-router-dom"
import { Loader2, User, Lock, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react"

function Section({ title, children }) {
    return (
        <div className="rounded-xl border border-white/5 bg-bg-surface p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-text-primary border-b border-white/5 pb-3">{title}</h2>
            {children}
        </div>
    )
}

function StatusMsg({ type, message }) {
    if (!message) return null
    const isError = type === "error"
    return (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isError ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
            {isError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {message}
        </div>
    )
}

function AccountSettings() {
    const { user, updateUser } = useAuth()

    // Profile details state
    const [fullName, setFullName] = useState(user?.fullName || "")
    const [email, setEmail] = useState(user?.email || "")
    const [isUpdatingAccount, setIsUpdatingAccount] = useState(false)
    const [accountStatus, setAccountStatus] = useState({ type: "", message: "" })

    // Password state
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isChangingPw, setIsChangingPw] = useState(false)
    const [pwStatus, setPwStatus] = useState({ type: "", message: "" })

    // Avatar state
    const [avatarFile, setAvatarFile] = useState(null)
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
    const [avatarStatus, setAvatarStatus] = useState({ type: "", message: "" })

    // Cover image state
    const [coverFile, setCoverFile] = useState(null)
    const [isUpdatingCover, setIsUpdatingCover] = useState(false)
    const [coverStatus, setCoverStatus] = useState({ type: "", message: "" })

    const handleUpdateAccount = async (e) => {
        e.preventDefault()
        if (!fullName.trim() || !email.trim()) {
            setAccountStatus({ type: "error", message: "Both name and email are required." })
            return
        }
        setIsUpdatingAccount(true)
        setAccountStatus({ type: "", message: "" })
        try {
            const res = await updateAccountDetails(fullName.trim(), email.trim())
            updateUser({ fullName: res.data.fullName, email: res.data.email })
            setAccountStatus({ type: "success", message: "Profile updated successfully." })
        } catch (err) {
            setAccountStatus({ type: "error", message: err?.response?.data?.message || "Update failed." })
        } finally {
            setIsUpdatingAccount(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (!oldPassword || !newPassword) {
            setPwStatus({ type: "error", message: "Both fields are required." })
            return
        }
        setIsChangingPw(true)
        setPwStatus({ type: "", message: "" })
        try {
            await changePassword(oldPassword, newPassword)
            setOldPassword("")
            setNewPassword("")
            setPwStatus({ type: "success", message: "Password changed successfully." })
        } catch (err) {
            setPwStatus({ type: "error", message: err?.response?.data?.message || "Password change failed." })
        } finally {
            setIsChangingPw(false)
        }
    }

    const handleAvatarUpdate = async (e) => {
        e.preventDefault()
        if (!avatarFile) return
        setIsUpdatingAvatar(true)
        setAvatarStatus({ type: "", message: "" })
        try {
            const fd = new FormData()
            fd.append("avatar", avatarFile)
            const res = await updateAvatar(fd)
            updateUser({ avatar: res.data.avatar })
            setAvatarFile(null)
            setAvatarStatus({ type: "success", message: "Avatar updated." })
        } catch (err) {
            setAvatarStatus({ type: "error", message: err?.response?.data?.message || "Avatar update failed." })
        } finally {
            setIsUpdatingAvatar(false)
        }
    }

    const handleCoverUpdate = async (e) => {
        e.preventDefault()
        if (!coverFile) return
        setIsUpdatingCover(true)
        setCoverStatus({ type: "", message: "" })
        try {
            const fd = new FormData()
            fd.append("coverImage", coverFile)
            const res = await updateCoverImage(fd)
            updateUser({ coverImage: res.data.coverImage })
            setCoverFile(null)
            setCoverStatus({ type: "success", message: "Cover image updated." })
        } catch (err) {
            setCoverStatus({ type: "error", message: err?.response?.data?.message || "Cover update failed." })
        } finally {
            setIsUpdatingCover(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
            <div>
                <h1 className="text-xl font-bold text-text-primary">Account Settings</h1>
                <p className="mt-0.5 text-sm text-text-secondary">
                    Manage your profile and security settings. 
                    <Link to={`/c/${user?.username}`} className="ml-2 text-accent hover:underline text-xs">View public profile →</Link>
                </p>
            </div>

            {/* Profile Details */}
            <Section title="Profile Details">
                <form onSubmit={handleUpdateAccount} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>
                    <StatusMsg {...accountStatus} />
                    <button
                        type="submit"
                        disabled={isUpdatingAccount}
                        className="flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors"
                    >
                        {isUpdatingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save changes
                    </button>
                </form>
            </Section>

            {/* Change Password */}
            <Section title="Change Password">
                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            autoComplete="current-password"
                            className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>
                    <StatusMsg {...pwStatus} />
                    <button
                        type="submit"
                        disabled={isChangingPw}
                        className="flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors"
                    >
                        {isChangingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                        Change password
                    </button>
                </form>
            </Section>

            {/* Avatar */}
            <Section title="Profile Picture">
                <form onSubmit={handleAvatarUpdate} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                                {user?.fullName?.[0] || "?"}
                            </div>
                        )}
                        <label className="cursor-pointer rounded-lg border border-white/10 bg-bg-elevated px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated/80 transition-colors">
                            {avatarFile ? avatarFile.name : "Choose image"}
                            <input type="file" accept="image/*" className="hidden" onChange={e => setAvatarFile(e.target.files[0])} />
                        </label>
                    </div>
                    <StatusMsg {...avatarStatus} />
                    <button
                        type="submit"
                        disabled={!avatarFile || isUpdatingAvatar}
                        className="flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors"
                    >
                        {isUpdatingAvatar && <Loader2 className="h-4 w-4 animate-spin" />}
                        Update avatar
                    </button>
                </form>
            </Section>

            {/* Cover Image */}
            <Section title="Cover Image">
                <form onSubmit={handleCoverUpdate} className="flex flex-col gap-4">
                    {user?.coverImage && (
                        <div className="h-24 w-full rounded-xl overflow-hidden bg-bg-elevated">
                            <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <label className="cursor-pointer self-start rounded-lg border border-white/10 bg-bg-elevated px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated/80 transition-colors">
                        {coverFile ? coverFile.name : "Choose image"}
                        <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files[0])} />
                    </label>
                    <StatusMsg {...coverStatus} />
                    <button
                        type="submit"
                        disabled={!coverFile || isUpdatingCover}
                        className="flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60 transition-colors"
                    >
                        {isUpdatingCover && <Loader2 className="h-4 w-4 animate-spin" />}
                        Update cover
                    </button>
                </form>
            </Section>
        </div>
    )
}

export default AccountSettings
