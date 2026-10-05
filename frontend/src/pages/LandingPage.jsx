import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlaySquare, Video, Search, Heart, ListVideo, LayoutDashboard, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-bg-surface p-6 hover:bg-bg-elevated transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
    )
}

function LandingPage() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-bg-base/0 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center max-w-3xl">
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <PlaySquare className="h-12 w-12 text-accent" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
                            VideoSocial
                        </h1>
                    </div>
                    <p className="mb-10 text-lg sm:text-xl text-text-secondary leading-relaxed">
                        A modern video sharing platform built as a full-stack college project. Share your moments, discover content, and connect with creators.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link 
                            to="/register" 
                            className="flex-1 sm:flex-none inline-flex justify-center items-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                        >
                            Get Started
                        </Link>
                        <Link 
                            to="/login" 
                            className="flex-1 sm:flex-none inline-flex justify-center items-center rounded-full border border-white/10 bg-bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary hover:bg-bg-elevated transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-text-primary">Platform Features</h2>
                    <p className="mt-4 text-text-secondary">Fully functional backend and frontend integration.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={Video}
                        title="Video Playback"
                        description="Upload videos with thumbnails and watch them with our custom video player."
                    />
                    <FeatureCard 
                        icon={Search}
                        title="Search & Discovery"
                        description="Search for videos by title or description to find exactly what you're looking for."
                    />
                    <FeatureCard 
                        icon={Heart}
                        title="Likes & Comments"
                        description="Interact with content by liking videos and leaving comments for the creators."
                    />
                    <FeatureCard 
                        icon={Users}
                        title="Subscriptions"
                        description="Subscribe to your favorite channels and build your own audience."
                    />
                    <FeatureCard 
                        icon={ListVideo}
                        title="Playlists"
                        description="Organize videos into custom playlists to watch later or share with others."
                    />
                    <FeatureCard 
                        icon={LayoutDashboard}
                        title="Creator Dashboard"
                        description="Manage your channel, edit your videos, track views, and monitor your subscribers."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center text-sm text-text-muted mt-auto">
                <p>Built for educational purposes. VideoSocial © {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}

export default LandingPage
