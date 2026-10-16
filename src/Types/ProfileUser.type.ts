export interface ProfileType {
    _id: string;
    id: string;
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    cover: string;
    createdAt: string;
    bookmarks: string[];
    bookmarksCount: number;
    followers: string[];
    followersCount: number;
    following: string[];
    followingCount: number;
}