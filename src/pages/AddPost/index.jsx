import React, {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {Navigate, useNavigate, useParams} from "react-router-dom";


export const AddPost = () => {
    const navigate = useNavigate()

    const [text123, setText] = React.useState('');
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const {id} = useParams()
    const isEditing = Boolean(id)
    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData()
            formData.append('image', event.target.files[0])
            const {data} = await axios.post('/uploads', formData)
            setImageUrl(data.url)
        } catch (err) {
            console.warn(err)
            alert('Ошибка при загрузке файла')
        }
    };

    const inputFileRef = useRef(null)
    const onClickRemoveImage = () => {
        setImageUrl('')
    };

    const onChange = React.useCallback((text123) => {
        setText(text123);
    }, []);

    const onSubmit = async () => {
        try {
            const fields = {
                title,
                imageUrl,
                tags,
                text123
            }
            const {data} = isEditing ? await axios.put(`/posts/${id}`, fields) : await axios.post('/posts', fields)
            const postId = isEditing ? id : data._id
            navigate(`/posts/${postId}`)
        } catch (err) {
            console.warn(err)
            alert('Ошибка при создании статьи')
        }
    }
    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    )

    useEffect(() => {
        if (id) {
            axios.get(`posts/${id}`).then(({data}) => {
                setTitle(data.title)
                setText(data.text123)
                setImageUrl(data.imageUrl)
                setTags(data.tags)
            })
        }
    }, [])

    if (!window.localStorage.getItem('token')) {
        return <Navigate to='/'/>
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={imageUrl} alt="Uploaded"/>
                </>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
                variant="standard"
                placeholder="Тэги"
                value={tags}
                onChange={e => setTags(e.target.value)}
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={text123}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
