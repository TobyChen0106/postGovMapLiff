import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';
import { LatLng } from 'leaflet';
import {
    Map,
    Marker,
    TileLayer,
    Tooltip,
} from 'react-leaflet'
import PostOfficeMaker from '../components/PostOfficeMaker';
import UserMaker from '../components/UserMaker';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Parser from 'html-react-parser';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import Divider from '@material-ui/core/Divider';
import k from "../assets/3k.svg"
import p from "../assets/people.svg"
import postOffcieImage from "../assets/post-office-icon.png";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Modal from '@material-ui/core/Modal';
import CancelIcon from '@material-ui/icons/Cancel';
// Liff
const liff = window.liff;

const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const useStyles = (theme) => ({
    root: {

    },
    loading: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0058a3",
        display: "flex col",
        alignItems: "center",
        justifyContent: "center",
    },
    contentHolder: {
        margin: "5vw",
    },
    actionHolder: {
        padding: "5vw",
    },
    commentHolder: {
        padding: "5vw",
    },
    carouselHolder: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "10.5rem",
        zIndex: "500",
    },
    carouselCard: {
        // margin: "5%",
        marginLeft: "2%",
        marginRight: "2%",
        width: "96%",
        height: "10rem",
        overflow: "scroll",
    },
    gps: {
        borderRadius: "50%",
        margin: "1rem",
        width: "4rem",
        height: "4rem",
        position: "fixed",
        bottom: "10rem",
        right: 0,
        zIndex: "600",
    },
    gpsIcon: {
        // backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
        bottom: "11rem",
        right: 0,
        // zIndex: "601",
    },
    markers: {
        zIndex: "1000",
    },
    mainInfoTypographyHolder: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem"
    },
    mainInfoHolder: {
        display: "flex column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    mainInfoTypography: {
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
    },
    CardContent: {
        paddingTop: 0,
        textAlign: "center"
    },
    Divider: {
        margin: "1rem",
    },
    modalTextFieldHolder: {
        width: "90vw",
        maxHeight: "90vh",
        backgroundColor: "#fff",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "scroll",
    },
    Setting: {
        textAlign: "center",
        maxWidth: "100%",
        fontSize: "5vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "18vw",
        padding: "5px",
    },
    SettingText: {
        textAlign: "center",
        width: "60%",
        fontSize: "14vw",
        overflow: "scroll",
    },
    warningInfo: {
        padding: "10vw",
        color: "#fff"
    }
});



const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        // slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        // slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        // slidesToSlide: 1 // optional, default to 1.
    }
};



class PostMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            allMarkers: [],
            userLocation: new LatLng(25.042229, 121.5651594),
            centerLocation: new LatLng(25.042229, 121.5651594),
            loading: true,
            focusedMark: undefined,
            fetchData: false,
            locationAvailable: false,
            geoErrorCode: 0,
            userData: undefined,
            redirect: false,
            postData: [],
            modalOpen: false,
        }
        this.carouselRef = React.createRef();
        this.mapRef = React.createRef();
        this.autopan = true;
    }

    componentWillMount = () => {
        fetch('/api/getData').catch(function (error) {
            console.log("[Error] " + error);
        }).then(
            res => {
                if (res.ok) {
                    this.setState({ fetchData: true });
                    return res.json()
                }
                else {
                    this.createNotification("error", "無法載入資料", "請確認網路連線狀況");
                    return null;
                }
            }
        ).then((data) => {
            const postData = data ? data : require('./PostData.json');
            for (var i = 0; i < postData.length; ++i) {
                var s_waitingDate = new Date(postData[i].number_plate_updateTime);
                var p_waitingDate = new Date(postData[i].number_plate_updateTime);
                var dataDate = new Date(postData[i].postDataUpdateTime);
                dataDate.setHours(dataDate.getHours() - 8);
                dataDate = dataDate > p_waitingDate ? dataDate : p_waitingDate;
                // s_waitingDate.setHours(s_waitingDate.getHours() - 8);
                // p_waitingDate.setHours(p_waitingDate.getHours() - 8);
                // dataDate.setHours(dataDate.getHours() - 8);
                postData[i].s_waitingUpdateTime = s_waitingDate;
                postData[i].p_waitingUpdateTime = p_waitingDate;
                postData[i].postDataUpdateTime = dataDate;
            }

            const cardboPosition = this.state.userLocation;
            var allMarkers = postData.map((v, id) => ({ position: new LatLng(v.latitude, v.longitude), id: id })).sort(
                function compareDistnace(a, b) {
                    return (Math.abs(cardboPosition.lat - a.position.lat) + Math.abs(cardboPosition.lng - a.position.lng))
                        - (Math.abs(cardboPosition.lat - b.position.lat) + Math.abs(cardboPosition.lng - b.position.lng));
                }
            );
            this.setState(
                { postData: postData, allMarkers: allMarkers }
            );
            this.getUserLocation();

            // setTimeout(() => {
            //     if (this.state.userLocation === new LatLng(25.042229, 121.5651594)) {
            //         console.log("haha")
            //         this.displayMarkers();
            //         this.setState({ loading: false });
            //         this.createNotification("error", "無法取得使用者位置資訊", "請求遭到拒絕，請確認已開啟定位功能。點擊以獲得更多資訊。");
            //     }
            // }, 1000);

            // if (user) {
            //     this.getUserLocation();
            // } else {

            //     this.createNotification("warning", "點一下授權", "卡伯郵局地圖需要您現在的位置以提供定位");
            // }
            // if (navigator.permissions) {
            //     navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            //         if (permissionStatus.state === "prompt") {
            //             this.createNotification("warning", "點一下授權", "卡伯郵局地圖需要您現在的位置以提供定位")
            //         } else {
            //             this.getUserLocation();
            //         }
            //     });
            // } else {
            //     this.getUserLocation();
            // }

        });
    }

    componentDidMount = () => {
        setInterval(() => {
            fetch('/api/getData').catch(function (error) {
                console.log("[Error] " + error);
            }).then(
                res => {
                    if (res.ok) {
                        this.setState({ fetchData: true });
                        return res.json()
                    }
                    else {
                        // this.createNotification("error", "無法載入資料", "請確認網路連線狀況");
                        return null;
                    }
                }
            ).then((data) => {
                // const postData = data ? data : require('./PostData.json');
                if (data) {
                    const postData = data;
                    var prePostData = this.state.postData;
                    for (var i = 0; i < postData.length; ++i) {
                        var p_waitingDate = new Date(postData[i].number_plate_updateTime);
                        // p_waitingDate.setHours(p_waitingDate.getHours() - 8);
                        var s_waitingDate = new Date(postData[i].number_plate_updateTime);
                        // s_waitingDate.setHours(s_waitingDate.getHours() - 8);

                        var dataDate = new Date(postData[i].postDataUpdateTime);
                        dataDate.setHours(dataDate.getHours() - 8);
                        dataDate = dataDate > p_waitingDate ? dataDate : p_waitingDate;
                        // dataDate.setHours(dataDate.getHours() - 8);

                        const id = prePostData.findIndex(p => p.storeCd === postData[i].storeCd)
                        if (id != -1) {
                            prePostData[id].p_waitingUpdateTime = p_waitingDate;
                            prePostData[id].s_waitingUpdateTime = s_waitingDate;
                            prePostData[id].postDataUpdateTime = dataDate;
                            prePostData[id].total = postData[i].total;
                            prePostData[id].number_plate_now = postData[i].number_plate_now;
                            prePostData[id].number_plate_total = postData[i].number_plate_total;
                        }
                    }
                    this.setState({ postData: prePostData })
                }
            });
        }, 10000);
    }

    createNotification = (type, title, message) => {
        console.log(type, title, message)
        switch (type) {
            case 'info':
                NotificationManager.info(message, title, 2000);
                break;
            case 'success':
                NotificationManager.success(message, title, 2000);
                break;
            case 'warning':
                NotificationManager.warning(message, title, 2000000, () => { this.getUserLocation(); });
                break;
            case 'error':
                NotificationManager.error(message, title, 10000, () => {
                    this.setState({ redirect: true },
                        // setTimeout(this.setState({ redirect: false }), 100)
                    );
                });
                break;
        }
    }

    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            success => {
                const postData = this.state.postData
                this.setState({
                    userLocation: new LatLng(success.coords.latitude, success.coords.longitude),
                    centerLocation: new LatLng(success.coords.latitude, success.coords.longitude),
                });

                var allMarkers = postData.map((v, id) => ({ position: new LatLng(v.latitude, v.longitude), id: id })).sort(
                    function compareDistnace(a, b) {
                        return (Math.abs(success.coords.latitude - a.position.lat) + Math.abs(success.coords.longitude - a.position.lng))
                            - (Math.abs(success.coords.latitude - b.position.lat) + Math.abs(success.coords.longitude - b.position.lng));
                    }
                );
                this.setState(
                    { allMarkers: allMarkers },
                    () => {
                        this.setState({ loading: false }, () => { this.displayMarkers(); });
                    }
                );
            },
            error => {
                const postData = this.state.postData
                const cardboPosition = this.state.userLocation;
                var allMarkers = postData.map((v, id) => ({ position: new LatLng(v.latitude, v.longitude), id: id })).sort(
                    function compareDistnace(a, b) {
                        return (Math.abs(cardboPosition.lat - a.position.lat) + Math.abs(cardboPosition.lng - a.position.lng))
                            - (Math.abs(cardboPosition.lat - b.position.lat) + Math.abs(cardboPosition.lng - b.position.lng));
                    }
                );

                this.setState(
                    { allMarkers: allMarkers },
                    () => {
                        this.setState({ loading: false }, () => { this.displayMarkers(); });
                    }
                );

                switch (error.code) {
                    // PERMISSION_DENIED
                    case 1:
                        this.setState({ geoErrorCode: 1 });
                        this.createNotification("error", "無法取得使用者位置資訊", "請確認已開啟定位功能。點擊以獲得更多資訊。");
                        break
                    // POSITION_UNAVAILABLE
                    case 2:
                        this.setState({ geoErrorCode: 2 });
                        this.createNotification("error", "無法取得使用者位置資訊", "請確認已開啟定位功能。點擊以獲得更多資訊。");
                        break
                    // TIMEOUT
                    case 3:
                        this.setState({ geoErrorCode: 3 });
                        this.createNotification("error", "無法取得使用者位置資訊", "請確認已開啟定位功能。點擊以獲得更多資訊。");
                        break
                    default:
                        this.setState({ geoErrorCode: 2 });
                        this.createNotification("error", "無法取得使用者位置資訊", "請確認已開啟定位功能。點擊以獲得更多資訊。");
                        break
                }
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        navigator.geolocation.watchPosition(
            success => {
                this.setState({
                    userLocation: new LatLng(success.coords.latitude, success.coords.longitude),
                });
            },
            error => { },
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
    }

    displayMarkers = () => {
        setTimeout(() => {
            const map = this.mapRef.current.leafletElement;
            const markers = this.state.allMarkers.map(
                (m, i) => map.getBounds().contains(m.position) ? { index: m.id, position: m.position } : undefined).filter(x => x);

            if (markers.length === 0) return

            var newCenter = this.state.userLocation;
            const findCenterMarkId = markers.findIndex(m => m.index === this.state.focusedMark);

            if (!this.state.focusedMark || (markers.length > 0 && findCenterMarkId === -1)) {
                this.setState({
                    focusedMark: markers[0].index
                });
                newCenter = markers[0].position;
            } else {
                newCenter = markers[findCenterMarkId].position;
            }

            this.setState({
                markers: markers.sort(
                    function compareDistnace(a, b) {
                        return (Math.abs(newCenter.lat - a.position.lat) + Math.abs(newCenter.lng - a.position.lng))
                            - (Math.abs(newCenter.lat - b.position.lat) + Math.abs(newCenter.lng - b.position.lng));
                    }
                ).filter((m, i) => i < 30)
            })
        }, 300);
    }

    onCarouselChange = (currentSlide) => {
        const id = currentSlide - 2 < 0 ? this.state.markers.length + currentSlide - 2 : currentSlide - 2;
        this.setState({
            focusedMark: this.state.markers[id].index
        });
    }

    handleMarkerClick = (id) => {
        if (id === this.state.focusedMark) {
            this.setState({ modalOpen: true })
        } else {
            this.setState({ focusedMark: id });
            const newfocusedMark = this.state.markers.find(m => m.index === id)
            if (newfocusedMark) {
                const newCenter = newfocusedMark.position;
                this.setState(pre => {
                    return ({
                        markers: pre.markers.sort(
                            function compareDistnace(a, b) {
                                return (Math.abs(newCenter.lat - a.position.lat) + Math.abs(newCenter.lng - a.position.lng))
                                    - (Math.abs(newCenter.lat - b.position.lat) + Math.abs(newCenter.lng - b.position.lng));
                            }
                        )
                    })
                });
            }
        }
    }

    handleGps = (e) => {
        e.preventDefault();
        const map = this.mapRef.current.leafletElement;
        map.flyTo(this.state.userLocation, 15);
    }

    handleCloseModal = (e) => {
        e.preventDefault();
        this.setState({ modalOpen: false });
    }
    handleCarouselClick = (e) => {
        e.preventDefault();
        this.setState({ modalOpen: true });
    }
    render() {
        const { classes } = this.props;

        const markers = this.state.markers.map((i, id) => {
            const makerIcon = PostOfficeMaker(this.state.postData[i.index].total, this.state.postData[i.index].number_plate_now, this.state.postData[i.index].number_plate_total,
                i.index === this.state.focusedMark ? "#AA3939" : undefined);
            const popup = (i.index === this.state.focusedMark) ? (
                <Tooltip direction='top' offset={[0, -55]} opacity={1} permanent>
                    <span>{this.state.postData[i.index].storeNm}</span>
                </Tooltip>) : null;
            const zindex = (i.index === this.state.focusedMark) ? 1500 : 500;
            return (
                <Marker
                    zIndexOffset={zindex}
                    id={`m-${this.state.postData[i.index].storeCd}`}
                    position={i.position}
                    onClick={(e) => this.handleMarkerClick(i.index)}
                    icon={makerIcon}
                    key={`${id}`}>
                    {popup}
                </Marker>
            )
        });

        const carouselCards = this.state.markers.map((i, id) => {
            const memo = this.state.postData[i.index].busiMemo ? Parser("備註: " + this.state.postData[i.index].busiMemo) : undefined;
            return (
                <Card className={classes.carouselCard} key={`${id}`} onClick={this.handleCarouselClick}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="中華郵政" className={classes.avatar} src={postOffcieImage}>
                                郵
                            </Avatar>
                        }
                        action={
                            <>
                                {/* <IconButton aria-label="settings" >
                                    <MoreVertIcon />
                                </IconButton> */}
                            </>
                        }
                        title={this.state.postData[i.index].storeNm}
                        subheader={Parser(this.state.postData[i.index].busiTime)}
                    />
                    <CardContent className={classes.CardContent}>
                        <Typography variant="body2" className={classes.mainInfoTypographyHolder}>
                            <div className={classes.mainInfoHolder}>
                                <img aria-label="三倍券存量" style={{ width: 15, height: 15 }} src={k} />
                                {` 三倍券存量:`} <br />
                                {` ${this.state.postData[i.index].total === undefined ? `無資料` : this.state.postData[i.index].total}`}
                            </div>

                            <div className={classes.mainInfoHolder}>
                                <img aria-label="現在叫號" style={{ width: 15, height: 15 }} src={p} />
                                {`現在叫號:`} <br />
                                {` ${this.state.postData[i.index].number_plate_now === undefined ? ` 無資料` : this.state.postData[i.index].number_plate_now}`}
                            </div>
                            <div className={classes.mainInfoHolder}>
                                <img aria-label="發放號碼" style={{ width: 15, height: 15 }} src={p} />
                                {`  發放號碼:`} <br />
                                {`${this.state.postData[i.index].number_plate_total === undefined ? ` 無資料` : this.state.postData[i.index].number_plate_total}`}
                            </div>
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            {memo}
                        </Typography>


                    </CardContent>
                </Card >
            )
        });

        if (this.state.redirect) {
            return <Redirect push to="/info" />;
        }
        else if (this.state.loading) {
            return (
                <div className={classes.loading}>
                    <div className={classes.warningInfo}>
                        {Parser(require('./readme.json').info)}
                    </div>
                    <ReactLoading type={'cubes'} color={'#ffffff'} height={'90vw'} width={'90vw'} />
                </div>
            );
        }
        else {
            const memo = !this.state.focusedMark ? null : this.state.postData[this.state.focusedMark].busiMemo ? Parser("備註資訊: " + this.state.postData[this.state.focusedMark].busiMemo) : null;
            const modal = this.state.focusedMark ? (
                <Card className={classes.modalTextFieldHolder}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="中華郵政" className={classes.avatar} src={postOffcieImage}>
                                郵
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings" onClick={this.handleCloseModal}>
                                <CancelIcon />
                            </IconButton>
                        }
                        title={this.state.postData[this.state.focusedMark].storeNm}
                        subheader={Parser(this.state.postData[this.state.focusedMark].busiTime)}
                    />
                    <CardContent>
                        <div className={classes.Setting}>
                            三倍券<br />存量
                                <div className={classes.SettingText}>
                                {` ${this.state.postData[this.state.focusedMark].total === undefined ? `無資料` : this.state.postData[this.state.focusedMark].total}`}
                            </div>
                        </div >

                        <div className={classes.Setting}>
                            {`現  在`}<br />{`叫  號`}
                            <div className={classes.SettingText}>
                                {` ${this.state.postData[this.state.focusedMark].number_plate_now === undefined ? `無資料` : this.state.postData[this.state.focusedMark].number_plate_now}`}
                            </div>
                        </div >
                        <div className={classes.Setting}>
                            已發放<br />號碼
                                <div className={classes.SettingText}>
                                {` ${this.state.postData[this.state.focusedMark].number_plate_total === undefined ? `無資料` : this.state.postData[this.state.focusedMark].number_plate_total}`}
                            </div>
                        </div >
                        <Typography variant="body2" className={classes.mainInfoTypography}>
                            {this.state.postData[this.state.focusedMark].number_plate_now === -1 ? `` :
                                `(${this.state.postData[this.state.focusedMark].postDataUpdateTime.getMonth() + 1}/${this.state.postData[this.state.focusedMark].postDataUpdateTime.getDate()} 
                                    ${pad(this.state.postData[this.state.focusedMark].postDataUpdateTime.getHours(), 2)}:${pad(this.state.postData[this.state.focusedMark].postDataUpdateTime.getMinutes(), 2)} 更新)`
                            }
                        </Typography>
                        {/* <Typography variant="body2" className={classes.mainInfoTypography}>
                            {this.state.postData[this.state.focusedMark].number_plate_now === -1 ? `` :
                                `(${this.state.postData[this.state.focusedMark].s_waitingUpdateTime.getMonth() + 1}/${this.state.postData[this.state.focusedMark].s_waitingUpdateTime.getDate()} 
                                    ${pad(this.state.postData[this.state.focusedMark].s_waitingUpdateTime.getHours(), 2)}:${pad(this.state.postData[this.state.focusedMark].s_waitingUpdateTime.getMinutes(), 2)} 更新)`
                            }
                        </Typography> */}
                        <Divider variant="middle" className={classes.Divider} />

                        <Typography variant="body2" color="textSecondary" component="p">
                            {memo}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            {`地址: ${this.state.postData[this.state.focusedMark].addr}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {`聯絡電話: ${this.state.postData[this.state.focusedMark].tel}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {`郵遞區號: ${this.state.postData[this.state.focusedMark].zipCd}`}
                        </Typography>

                        {/* <Divider variant="middle" className={classes.Divider} /> */}

                        <Typography variant="body2" color="textSecondary" component="p">
                            {`資料來源 : `}
                            <a href="https://www.moeasmea.gov.tw/masterpage-tw">經濟部中小企業處</a>
                            {` `}
                            <a href="https://www.post.gov.tw/post/internet/index.jsp">中華郵政</a>
                        </Typography>
                    </CardContent>
                </Card>) : null;
            return (
                <>
                    <Map
                        autopanstart={this.onautopanstart}
                        onMoveEnd={() => this.displayMarkers()}
                        ref={this.mapRef}
                        center={this.state.centerLocation}
                        zoom={15}
                        style={{ height: '100vh' }}
                        preferCanvas={true}
                    // markerZoomAnimation={false}
                    >

                        <TileLayer
                            attribution="&amp;copy <a target=&quot;_blank&quot; href=&quot;https:www.cardbo.info&quot;>卡伯 </a> 提供"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={this.state.userLocation} icon={UserMaker} zIndexOffset={600}>
                        </Marker>
                        {markers}
                    </Map>
                    <Button className={classes.gps} style={{ backgroundColor: "#fff" }} variant="contained" onClick={e => this.handleGps(e)}>
                        <GpsFixedIcon className={classes.gpsIcon} />
                    </Button >
                    <div className={classes.carouselHolder}>
                        <Carousel
                            ref={this.carouselRef}
                            style={{ height: "100%" }}
                            swipeable={true}
                            draggable={false}
                            showDots={false}
                            responsive={responsive}
                            ssr={true} // means to render carousel on server-side.
                            infinite={true}
                            // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                            // autoPlaySpeed={1000}
                            keyBoardControl={true}
                            // customTransition="all .5"
                            transitionDuration={650}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}

                            deviceType={this.props.deviceType}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"

                            afterChange={(previousSlide, { currentSlide, onMove }) => this.onCarouselChange(currentSlide)}
                        >
                            {carouselCards}
                        </Carousel>;
                    </div>
                    <Modal
                        open={this.state.modalOpen}
                        onClose={this.handleCloseModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >

                        {modal}
                    </Modal>
                    <NotificationContainer />

                </>
            )
        }
    }
};
export default withStyles(useStyles)(PostMap)