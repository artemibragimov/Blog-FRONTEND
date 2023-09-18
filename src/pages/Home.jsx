import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import {useDispatch, useSelector} from "react-redux";
import {Post} from '../components';
import {fetchPosts} from "../redux/slices/posts";
import {FormControlLabel, Switch} from "@mui/material";

export const Home = () => {

    const dispatch = useDispatch()
    const {posts} = useSelector(state => state.posts)
    const userData = useSelector(state => state.auth.data)
    const isPostLoading = posts.status === 'loading'
    let sort = false

    const handleChange = (event, sort) => {
        dispatch(fetchPosts(sort))
    };

    useEffect(() => {
        dispatch(fetchPosts(false))
    }, [])

    return (
        <>
            <FormControlLabel
                control={
                    <Switch value={!sort} onChange={handleChange} name="gilad"/>
                }
                label="Сортировать по популярности"
            />

            <Grid container spacing={4}>
                <Grid xs={12} item>
                    {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) => (

                        isPostLoading ? (
                            <Post key={index} isLoading={true}/>
                        ) : (
                            <Post
                                _id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                tags={obj.tags}
                                commentsCount={obj.commentsCount}
                                isEditable={userData?._id === obj.user._id}
                            />)
                    ))}
                </Grid>
            </Grid>
        </>
    );
};
