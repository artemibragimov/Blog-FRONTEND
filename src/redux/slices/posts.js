import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('/post/fetchPosts',
    async (sort) => {
        const {data} = await axios.get(`/posts?sort=${sort}`)
        return data
    })
export const fetchRemovePost = createAsyncThunk('/post/fetchRemovePost',
    async (id) => {
        await axios.delete(`/posts/${id}`)
    })

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    }
}

const postsSlise = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSort: (state) => {
            state.query.sort = !state.query.sort
        }
    },
    extraReducers: {
        // Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload
            state.posts.status = 'loaded'
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = []
            state.posts.status = 'error'
        },
        // Удаление статей
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        }
    }
})

export const {setSort} = postsSlise.actions
export const postReduser = postsSlise.reducer