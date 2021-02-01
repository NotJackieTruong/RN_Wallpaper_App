import React, { Component } from 'react';
import { Text, View, SafeAreaView, Image, Dimensions, StyleSheet, TouchableOpacity, Platform, Alert, Button, ScrollView } from 'react-native';
import { PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import WallPaperManager from 'react-native-wallpaper-manager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNIap, {
    InAppPurchase,
    Product,
    ProductPurchase,
    PurchaseError,
    acknowledgePurchaseAndroid,
    purchaseErrorListener,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from 'react-native-iap';
import axios from 'axios'

// product sku's for ios and android
const ImageCode01 = '01_image', ImageCode02 = '02_image', ImageCode03 = '03_image'
const itemSkus = Platform.select({
    ios: [ImageCode01, ImageCode02, ImageCode03],
    android: [ImageCode01, ImageCode02, ImageCode03],

});
// product subscription for ios and android
const itemSubs = Platform.select({ ios: ['test.sub'], android: ['test.sub'] });

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const { height, width } = Dimensions.get('window');
export class FullScreenImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            receipt: '',
            availableItemsMessage: ''
        };
    }

    // component did mount
    // async componentDidMount(): void {
    //     try {
    //         const result = await RNIap.initConnection();
    //         console.log('connection is => ', result);
    //         // await RNIap.consumeAllItemsAndroid();
    //     } catch (err) {
    //         console.log('error in cdm => ', err);
    //     }
    //     purchaseUpdateSubscription = purchaseUpdatedListener(
    //         async (purchase: InAppPurchase | ProductPurchase | SubscriptionPurchase) => {
    //             console.log('purchaseUpdatedListener', purchase);
    //             if (
    //                 purchase.purchaseStateAndroid === 1 &&
    //                 !purchase.isAcknowledgedAndroid
    //             ) {
    //                 try {
    //                     const ackResult = await acknowledgePurchaseAndroid(
    //                         purchase.purchaseToken,
    //                     );
    //                     console.log('ackResult', ackResult);
    //                 } catch (ackErr) {
    //                     console.warn('ackErr', ackErr);
    //                 }
    //             }
    //             this.purchaseConfirmed();
    //             this.setState({ receipt: purchase.transactionReceipt });
    //             purchaseErrorSubscription = purchaseErrorListener(
    //                 (error: PurchaseError) => {
    //                     console.log('purchaseErrorListener', error);
    //                     // alert('purchase error', JSON.stringify(error));
    //                 },
    //             );
    //         },
    //     );
    // }

    // component will unmount
    // componentWillUnmount(): void {
    //     if (purchaseUpdateSubscription) {
    //         purchaseUpdateSubscription.remove();
    //         purchaseUpdateSubscription = null;
    //     }
    //     if (purchaseErrorSubscription) {
    //         purchaseErrorSubscription.remove();
    //         purchaseErrorSubscription = null;
    //     }
    //     RNIap.endConnection()
    // }


    // get item

    getItems = async (price): void => {
        try {
            console.log('itemSkus[0]', itemSkus);
            const products = await RNIap.getProducts(itemSkus)
            console.log('products: ', products)
            await this.setState({ productList: products })
            // products[0] ? this.requestPurchase(products[0].id) : null
            switch (price) {
                case 0.3:
                    await this.requestPurchase[itemSkus[0]]
                    break;
                case 0.5:
                    await this.requestPurchase[itemSkus[1]]
                    break;
                case 0.9:
                    await this.requestPurchase[itemSkus[2]]
                    break;
                default:
                    await this.requestPurchase[itemSkus[0]]
                    break;
            }
        } catch (err) {
            console.log('getItems || purchase error => ', err);
        }
    };

    // get subscriptions
    getSubscriptions = async (): void => {
        try {
            const products = await RNIap.getSubscriptions(itemSubs);
            console.log('Products => ', products);
            this.setState({ productList: products });
        } catch (err) {
            console.log('getSubscriptions error => ', err);
        }
    };

    // get available purchases
    getAvailablePurchases = async (): void => {
        try {
            const purchases = await RNIap.getAvailablePurchases();
            console.info('Available purchases => ', purchases);
            if (purchases && purchases.length > 0) {
                this.setState({
                    availableItemsMessage: `Got ${purchases.length} items.`,
                    receipt: purchases[0].transactionReceipt,
                });
            }
        } catch (err) {
            console.warn(err.code, err.message);
            console.log('getAvailablePurchases error => ', err);
        }
    };

    // request purchase
    requestPurchase = async (sku): void => {
        try {
            await RNIap.requestPurchase(sku).then(purchase => {
                this.purchaseConfirmed(purchase)
            }).catch(error => {
                console.error(error)
            })
        } catch (err) {
            console.log('requestPurchase error => ', err);
        }
    };

    // request subscription
    requestSubscription = async (sku) => {
        try {
            await RNIap.requestSubscription(sku);
        } catch (err) {
            alert(err.toLocaleString());
        }
    };

    // purchase confirm
    purchaseConfirmed = (purchase) => {
        //you can code here for what changes you want to do in db on purchase successfull
        console.log('Purchase successfully!')
    }

    // requestCameraPermission = async ( image ) => {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.CAMERA,
    //         {
    //           title: 'Cool Photo App Camera Permission',
    //           message:
    //             'Cool Photo App needs access to your camera ' +
    //             'so you can take awesome pictures.',
    //           buttonNeutral: 'Ask Me Later',
    //           buttonNegative: 'Cancel',
    //           buttonPositive: 'OK'
    //         }
    //       );
    //       if ( granted === PermissionsAndroid.RESULTS.GRANTED ) {
    //         console.log( 'You can use the camera' );
    //       } else {
    //         console.log( 'Camera permission denied' );
    //       }
    //     } catch ( err ) {
    //       console.log( err );
    //     }
    //     this.downloadFile( image );

    //   };

    requestPermission(image) {

        console.log('Requesting Permission for camera and storage');
        requestMultiple('android' === Platform.OS ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] : [PERMISSIONS.IOS.CAMERA])
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log(
                            'This feature is not available (on this device / in this context)',
                        );
                        break;
                    case RESULTS.DENIED:
                        console.log(
                            'The permission has not been requested / is denied but requestable',
                        );
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
        this.downloadFile(image);
    }

    downloadFile(image) {
        console.log('DownloadFile', image.urls.regular);
        var imageExt = image.urls.regular.split('.').pop()
        console.log('ext: ', imageExt)

        RNFS.downloadFile({
            fromUrl: image.urls.regular,

            //toFile: '/Users/Aman.Kalra/Desktop/Codechef'+image.id+'.jpg'
            toFile: `${RNFS.DocumentDirectoryPath}${image.id}.${imageExt}`

            //`${RNFS.DocumentDirectoryPath}/${image.id}.jpg`
        }).promise.then(({ r }) => {

            CameraRoll.saveToCameraRoll(`${RNFS.DocumentDirectoryPath}${image.id}.${imageExt}`, 'photo')
                .then(r => {
                    console.log('Image saved to gallery'),
                        Alert.alert(
                            'Success',
                            'Image saved to Gallery',
                        );
                }
                )
                .catch((err) => console.log(err));
            console.log('File saved successfully', `${RNFS.DocumentDirectoryPath}${image.id}.${imageExt}`);
        });
    }

    setAsWallpaper(image) {
        console.log('setAsWallppaper');
        WallPaperManager.setWallpaper({ uri: image.urls.regular }, (res) =>
            console.log(res));
        Alert.alert(
            'Success',
            'Image set as wallpaper successfully',
        );
    }

    likePhoto(image) {
        try {
            const url = `https://api.unsplash.com/photos/${image.id}/like`;
            axios.post(url, {
                headers: {
                    Authorization: "Client-ID 896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295"
                }
            }).then(photo => {
                console.log('like photo')
            }).catch(error => {
                console.error(error)
            })
        } catch (error) {
            console.error(error)

        }


    }

    tryingNavigation() {
        console.log('tryingNavigation');
        this.props.navigation.navigate('Demo', {
            images: this.state.images,
        });

    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        const image = this.props.route.params.data;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Image
                        style={{ height: '100%', width: 'auto' }}

                        source={{ uri: image.urls.regular }}

                    //source = {{ uri: image.urls.raw + '&w=40&h=700' }}
                    />
                </View>
                <ScrollView style={{ backgroundColor: `${image.primary ? image.primary : '#232d36'}`, height: '30%', maxHeight: '30%', overflow: 'scroll' }}>
                    <View style={{ backgroundColor: `${image.dark ? image.dark : '#1c222a'}`, paddingVertical: 16 }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18, marginLeft: 50 }}>{image.id}</Text>
                        <Text style={{ ...styles.text, marginLeft: 50 }}>{image.user.username}</Text>
                    </View>
                    {image.isPurchased || image.price === 0 ? (
                        <View style={{ flexDirection: 'row', paddingVertical: 16, justifyContent: 'space-around' }}>
                            <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => this.requestPermission(image)}>
                                <MaterialCommunityIcons name="cloud-download" size={36} color={'white'} />
                                <Text style={{ color: 'white' }} > Save to Gallery</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.button} activeOpacity={0.4} onPress={() => this.likePhoto(image)}>
                            <MaterialCommunityIcons name="thum-up-outline" size={36} color={'white'} />
                            <Text style={{ color: 'white' }} > Like</Text>
                        </TouchableOpacity> */}
                            {'android' === Platform.OS ?
                                <TouchableOpacity style={styles.button} activeOpacity={0.4} onPress={() => this.setAsWallpaper(image)}>
                                    <MaterialCommunityIcons name="wallpaper" size={36} color={'white'} />
                                    <Text style={{ color: 'white' }}> Set as Wallpaper </Text>
                                </TouchableOpacity> : null}
                        </View>
                    ) : (
                            <TouchableOpacity style={{ ...styles.purchaseButton, backgroundColor: `${image.light ? image.light : '#2196F3'}` }} onPress={() => { this.getItems(image.price) }}>
                                <Text style={{ ...styles.text, textAlign: 'center' }}>Buy this image for only {image.price}$</Text>
                                {/* <Button style={{ elevation: 0 }} color={image.light ? image.light : '#2196F3'} title={`Buy this wallpaper for only ${image.price}$`} onPress={() => { this.getItems() }}></Button> */}

                            </TouchableOpacity>

                        )}


                    <Text style={{ ...styles.text, marginLeft: 25, marginRight: 25 }}>{image.description ? image.description : 'Description about the wallpaper'}</Text>
                    <View style={styles.photoDetailsContainer}>
                        <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#536879' }}>
                            <View style={styles.textIcon}>
                                <MaterialCommunityIcons name="thumb-up-outline" style={styles.textIcon_icon} />
                                <Text style={styles.textIcon_text}>Likes: {image.likes}</Text>

                            </View>
                            <View style={styles.textIcon}>
                                <MaterialCommunityIcons name="calendar-text-outline" style={styles.textIcon_icon} />
                                <Text style={styles.textIcon_text}>Date: {this.formatDate(image.created_at)}</Text>
                            </View>

                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={styles.textIcon}>
                                <MaterialCommunityIcons name="fullscreen" style={styles.textIcon_icon} />
                                <Text style={styles.textIcon_text}>{image.width}x{image.height}</Text>

                            </View>
                            <View style={styles.textIcon}>
                                <MaterialCommunityIcons name="cash" style={styles.textIcon_icon} />
                                <Text style={styles.textIcon_text}>{image.price ? image.price : 0}$</Text>

                            </View>
                        </View>

                    </View>



                </ScrollView>


            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    controls: {
        backgroundColor: 'white',
        flexDirection: 'row'

        // left: 0,
        // right: 0,
        // bottom: 100,
        // marginBottom: 10,
        // height: 80
    },
    button: {

        // backgroundColor: '#335EFF',
        // paddingLeft: 10,
        // paddingBottom: 10,
        // paddingRight: 10,
        // paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 15
    },
    photoDetailsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 16,
        justifyContent: 'flex-start',
    },
    textIcon: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    textIcon_icon: {
        fontSize: 25,
        marginRight: 10,
        color: 'white'
    },
    textIcon_text: {
        color: 'white',
        fontSize: 15,
        marginTop: 3
    },
    purchaseButton: {
        marginVertical: 20,
        marginHorizontal: 50,
        paddingVertical: 14,
        height: 48,
        width: '80%',
        borderRadius: 4,
        // backgroundColor: '#2196F3',
    }

});
