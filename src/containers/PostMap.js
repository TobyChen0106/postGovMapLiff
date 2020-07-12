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
import Typography from '@material-ui/core/Typography';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import Divider from '@material-ui/core/Divider';
import k from "../assets/3k.svg"
import p from "../assets/people.svg"
import postOffcieImage from "../assets/post-office-icon.png";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// Liff
const liff = window.liff;

const useStyles = (theme) => ({
    root: {

    },
    loading: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0058a3",
        display: "flex",
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
        // marginLeft: "2%",
        // marginRight: "2%",
        width: "100%",
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
    mainInfoTypographyHolder:{
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
            postData: []
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
                    return (Math.pow(cardboPosition.lat - a.position.lat, 2) + Math.pow(cardboPosition.lng - a.position.lng, 2))
                        - (Math.pow(cardboPosition.lat - b.position.lat, 2) + Math.pow(cardboPosition.lng - b.position.lng, 2));
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
                        this.createNotification("error", "無法載入資料", "請確認網路連線狀況");
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
                        // dataDate.setHours(dataDate.getHours() - 8);

                        const id = prePostData.findIndex(p => p.storeCd === postData[i].storeCd)
                        if (id != -1) {
                            prePostData[id].p_waitingUpdateTime = p_waitingDate;
                            prePostData[id].s_waitingUpdateTime = s_waitingDate;
                            prePostData[id].postDataUpdateTime = dataDate;
                            prePostData[id].total = postData[i].total;
                            // prePostData[id].p_nowCalling = postData[i].p_nowCalling;
                            prePostData[id].number_plate_now = postData[i].number_plate_now;
                            prePostData[id].number_plate_total = postData[i].number_plate_total;
                        }
                    }
                    this.setState({ postData: prePostData })
                }
            });
        }, 500);
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
                        return (Math.pow(success.coords.latitude - a.position.lat, 2) + Math.pow(success.coords.longitude - a.position.lng, 2))
                            - (Math.pow(success.coords.latitude - b.position.lat, 2) + Math.pow(success.coords.longitude - b.position.lng, 2));
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
                        return (Math.pow(cardboPosition.lat - a.position.lat, 2) + Math.pow(cardboPosition.lng - a.position.lng, 2))
                            - (Math.pow(cardboPosition.lat - b.position.lat, 2) + Math.pow(cardboPosition.lng - b.position.lng, 2));
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
                        return (Math.pow(newCenter.lat - a.position.lat, 2) + Math.pow(newCenter.lng - a.position.lng, 2))
                            - (Math.pow(newCenter.lat - b.position.lat, 2) + Math.pow(newCenter.lng - b.position.lng, 2));
                    }
                )
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
        this.setState({ focusedMark: id });
        const newfocusedMark = this.state.markers.find(m => m.index === id)
        if (newfocusedMark) {
            const newCenter = newfocusedMark.position;
            this.setState(pre => {
                return ({
                    markers: pre.markers.sort(
                        function compareDistnace(a, b) {
                            return (Math.pow(newCenter.lat - a.position.lat, 2) + Math.pow(newCenter.lng - a.position.lng, 2))
                                - (Math.pow(newCenter.lat - b.position.lat, 2) + Math.pow(newCenter.lng - b.position.lng, 2));
                        }
                    )
                })
            });
        }
    }

    handleGps = (e) => {
        e.preventDefault();
        const map = this.mapRef.current.leafletElement;
        map.flyTo(this.state.userLocation, 15);
    }

    render() {
        const { classes } = this.props;

        const markers = this.state.markers.filter((m, i) => i < 50).map((i, id) => {
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
                <Card className={classes.carouselCard} key={`${id}`}>
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
                                {` 三倍券存量: ${this.state.postData[i.index].total === -1 ? ` 無資料` : this.state.postData[i.index].total}`}
                                <Typography style={{ fontSize: "0.8rem" }} className={classes.mainInfoTypography}>
                                    {this.state.postData[i.index].total === -1 ? `` :
                                        `(${this.state.postData[i.index].postDataUpdateTime.getMonth() + 1}/${this.state.postData[i.index].postDataUpdateTime.getDate()} 
                                ${this.state.postData[i.index].postDataUpdateTime.getHours()}:${this.state.postData[i.index].postDataUpdateTime.getMinutes()} 更新)`}
                                </Typography>
                            </div>

                            <div className={classes.mainInfoHolder}>
                                <img aria-label="現在叫號" style={{ width: 15, height: 15 }} src={p} />
                                {`現在叫號: ${this.state.postData[i.index].number_plate_now === -1 ? ` 無資料` : this.state.postData[i.index].number_plate_now}`}
                                <Typography style={{ fontSize: "0.8rem" }} className={classes.mainInfoTypography}>
                                    {this.state.postData[i.index].number_plate_now === -1 ? `` :
                                        `(${this.state.postData[i.index].s_waitingUpdateTime.getMonth() + 1}/${this.state.postData[i.index].s_waitingUpdateTime.getDate()} 
                                    ${this.state.postData[i.index].s_waitingUpdateTime.getHours()}:${this.state.postData[i.index].s_waitingUpdateTime.getMinutes()} 更新)`
                                    }
                                </Typography>
                            </div>
                            <div className={classes.mainInfoHolder}>
                                <img aria-label="發放號碼" style={{ width: 15, height: 15 }} src={p} />
                                {`  發放號碼: ${this.state.postData[i.index].number_plate_total === -1 ? ` 無資料` : this.state.postData[i.index].number_plate_total}`}
                                <Typography style={{ fontSize: "0.8rem" }} className={classes.mainInfoTypography}>
                                    {this.state.postData[i.index].number_plate_total === -1 ? `` :
                                        `(${this.state.postData[i.index].p_waitingUpdateTime.getMonth() + 1}/${this.state.postData[i.index].p_waitingUpdateTime.getDate()} 
                                    ${this.state.postData[i.index].p_waitingUpdateTime.getHours()}:${this.state.postData[i.index].p_waitingUpdateTime.getMinutes()} 更新)`
                                    }
                                </Typography>
                            </div>
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            {memo}
                        </Typography>

                        <Divider variant="middle" className={classes.Divider} />

                        <Typography variant="body2" color="textSecondary" component="p">
                            {`地址: ${this.state.postData[i.index].addr}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {`聯絡電話: ${this.state.postData[i.index].tel}   郵遞區號: ${this.state.postData[i.index].zipCd} `}
                        </Typography>

                        {/* <Divider variant="middle" className={classes.Divider} /> */}

                        <Typography variant="body2" color="textSecondary" component="p">
                            {`資料來源 : `}
                            <a href="https://www.moeasmea.gov.tw/masterpage-tw">經濟部中小企業處</a>
                            {` `}
                            <a href="https://www.post.gov.tw/post/internet/index.jsp">中華郵政</a>
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
                    <ReactLoading type={'cubes'} color={'#ffffff'} height={'90vw'} width={'90vw'} />
                </div>
            );
        }
        else {
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
                    <NotificationContainer />
                </>
            )
        }
    }
};
export default withStyles(useStyles)(PostMap)