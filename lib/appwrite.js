import { Client, Account, ID, Databases, Avatars, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: 'com.syed.auro',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTIONS_ID,
    videosCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEOS_ID,
    storageId: process.env.EXPO_PUBLIC_STORAGE_ID
}

const {endpoint, platform, projectId, 
       databaseId, userCollectionId, 
       videosCollectionId, storageId} = appwriteConfig
// Init your React Native SDK
const client = new Client();
client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)
;
const database = new Databases(client)
const account = new Account(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export const registerUser = async (username, email, password) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username)

        if (!newAccount) throw new Error("Account failed to create")

        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password)
        const newUser = await database.createDocument(
            databaseId, userCollectionId,
            ID.unique(), {username: username, email: email, avatar: avatarUrl, accountId: newAccount.$id})
        return newUser
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        console.log(session)
        return session
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if (!currentAccount) throw Error
        const user = await database.listDocuments(
            databaseId, userCollectionId, 
            [Query.equal("accountId", [currentAccount.$id])])
        if (!user) throw Error
        return user.documents[0]
    } catch (error) {
        console.log(error.message)
    }
}

export const getAllPosts = async () => {
    try {
        const videos = await database.listDocuments(databaseId, videosCollectionId, [])
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const videos = await database.listDocuments(databaseId, videosCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))])
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getQueriedPost = async (query) => {
    try {
        const videos = await database.listDocuments(
            databaseId, videosCollectionId, 
            [Query.or([Query.contains('title', query), Query.contains('prompt', query)])])
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getPostsForProfile = async () => {
    try {
        const accountData = await account.get()
        const userResult = await database.listDocuments(databaseId, userCollectionId, [Query.equal('accountId', [accountData.$id])])
        if (!userResult)
            throw new Error('User not found')
        const user = userResult.documents[0]
        const videos = await database.listDocuments(
            databaseId, videosCollectionId, [Query.equal('users', [user.$id])])
        return {posts: videos.documents, user}
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const result = await account.deleteSession('current')
        if (result)
            console.log("Successfully logged out")
            return true
        if (!result) throw new Error("Failed to logout user.")
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getFilePreview = async (id, type) => {
    let fileUrl;
    try {
        if (type.includes('video')) {
            fileUrl = storage.getFileView(storageId, id)
        } else if (type.includes('image')) {
            fileUrl = storage.getFilePreview(storageId, id)
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) {
            throw new Error("No file")
        }
        return fileUrl
    } catch (error) {
        console.log("Error occured during getFileView")
        console.log(error)
        throw new Error(error)
    }
}
export const uploadFile = async (file) => {
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = {
        name: file.fileName,
        type: file.type,
        size: file.fileSize,
        uri: file.uri
    }
    try {
        const uploadedFile = await storage.createFile(storageId, ID.unique(), asset)
        const fileUrl = await getFilePreview(uploadedFile.$id, asset.type)
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    console.log("Calling with Form...")
    console.log(form)
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'thumbnail')
        ])
        const newPost = await database.createDocument(databaseId, videosCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            users: form.user.$id
        })
        return newPost
    } catch (error) {
        throw new Error(error)
    }
}