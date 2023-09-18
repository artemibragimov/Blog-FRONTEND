import React from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";
import {useParams} from "react-router-dom";

export const AddComment = ({setUpdate}) => {
    const {id} = useParams()
    const [text, setText] = React.useState('');
    const onSubmit = async () => {
        try {
            const fields = {
                text
            }
             await axios.post(`/posts/${id}/comments`, fields)
            setUpdate(fields)
            setText('')
        } catch (err) {
            console.warn(err)
            alert('Ошибка при добавлении коментария')
        }
    }

    return (
        <>
            <div className={styles.root}>
                <Avatar
                    classes={{root: styles.avatar}}
                    src="https://mui.com/static/images/avatar/5.jpg"
                />
                <div className={styles.form}>
                    <TextField
                        onChange={e => setText(e.target.value)}
                        label="Написать комментарий"
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                        value={text}
                    />
                    <Button onClick={onSubmit} variant="contained">Отправить</Button>
                </div>
            </div>
        </>
    );
};
