export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Post {
    id: string;
    title: string;
    body: string;
    author: { id: string; username: string } | string;
    created_at: string;
    tags?: string[];
    image?: {
        url: string;
        public_id?: string;
        width?: number;
        height?: number;
    };
    likes_count?: number;
    is_liked?: boolean;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
