import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Post, AddComment, CommentsBlock, SideBlock} from "../components";
import axios from '../axios';
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()

    const [commentsData, setCommentsData] = useState()
    const [isLoadingComments, setIsLoadingComments] = useState(true)
    const [commentsCount, setCommentsCount] = useState()

    const [update, setUpdate]= useState()

    useEffect(() => {
        axios.get(`/posts/${id}`).then(res => {
            setData(res.data)
            setIsLoading(false)
        }).catch((err) => {
            console.warn(err)
            alert('Ошибка при получении статьи')
        })
        axios.get(`/posts/${id}/comments`).then(res => {
            setCommentsData(res.data)
            setCommentsCount(res.data.length)
            setIsLoadingComments(false)
        })
    }, [])

    useEffect(() => {
        axios.get(`/posts/${id}/comments`).then(res => {
            setCommentsData(res.data)
            setCommentsCount(res.data.length)
            setIsLoadingComments(false)
        })
    }, [update])

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost/>
    }
    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                children={data.text123}
                imageUrl={data.imageUrl}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={commentsCount}
                tags={data.tags}
                isFullPost>
                <ReactMarkdown children={data.text123}/>
            </Post>
            <SideBlock>
                {commentsData ? <CommentsBlock
                    commentsCount={commentsCount}
                    commentsData={commentsData}
                    isLoading={isLoadingComments}
                /> : <SideBlock title="Комментарии 0"/>}
                <AddComment setUpdate={setUpdate} />
            </SideBlock>
        </>);
};


