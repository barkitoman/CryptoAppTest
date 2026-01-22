export const colors = {
    light: {
        primary: '#2563EB', // Blue 600
        background: '#F1F5F9', // Slate 100
        card: '#FFFFFF', // White
        text: '#0F172A', // Slate 900
        subtext: '#64748B', // Slate 500
        border: '#E2E8F0', // Slate 200
        error: '#EF4444', // Red 500
        success: '#10B981', // Emerald 500
        tint: '#2563EB',
    },
    dark: {
        primary: '#3B82F6', // Blue 500
        background: '#0F172A', // Slate 900
        card: '#1E293B', // Slate 800
        text: '#F8FAFC', // Slate 50
        subtext: '#94A3B8', // Slate 400
        border: '#334155', // Slate 700
        error: '#F87171', // Red 400
        success: '#34D399', // Emerald 400
        tint: '#FFFFFF',
    },
};

export type ThemeColors = typeof colors.light;
