import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import logo from '../assets/logo.png'
import og from '../assets/og.png'
import { Button } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    background: {
        postion: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0058a3",
    },
    root: {
        // marginTop: "10vh",
        // marginBottom: "10vh",
        // marginLeft: "10vw",
        // marginRight: "10vw",
        width: "100vw",
        height: "100vh",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function RecipeReviewCard() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    return (

        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar} src={logo}>
                        C
          </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        {/* <MoreVertIcon /> */}
                    </IconButton>
                }
                title="卡伯地圖 v1.2 注意事項"
                subheader="2020/7/5"
            />
            <CardMedia
                className={classes.media}
                image={og}
                title="Paella dish"
            />
            <CardContent>
                <Typography variant="body1" color="textSecondary" component="p">
                    1. 卡伯郵局地圖需要您目前的所在位置，以定位出離您最近的郵局。若不提供定位資訊仍可以使用郵局地圖。
                </Typography>
                <Typography variant="body1" color="textSecondary" component="p">
                    3. 目前卡伯地圖地圖支援Line內建瀏覽器及 Chrome 瀏覽器。若已經點選拒絕提供位置資訊而後反悔，可以至 Chrome 瀏覽器以無痕視窗開啟以下連結
                    <a href="https://map.cardbo.info">https://map.cardbo.info</a>，以使用本服務。
                </Typography>
                <Typography variant="body1" color="textSecondary" component="p">
                    4. 除了使用者位置資訊之外，卡伯郵局地圖不會取得任何使用者的資料，請放心使用。
                </Typography>
            </CardContent>
            <Link to="/">
                <Button fullWidth={true} variant="contained" color="primary" style={{ backgroundColor: "#0058a3" }}>
                    回到郵局地圖
                </Button>
            </Link>
        </Card>

    );
}