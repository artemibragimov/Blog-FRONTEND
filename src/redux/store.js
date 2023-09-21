import {configureStore} from "@reduxjs/toolkit";
import {postReduser} from "./slices/posts";
import {authReduser} from "./slices/auth";

const store = configureStore({
    reducer: {
        posts: postReduser,
        auth: authReduser
    }
})

export default store