import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, Dimensions, Header, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreenView } from 'views/homeScreenView';
import firestore from '@react-native-firebase/firestore'
const collection = firestore().collection('Wallpaper')

// const Stack = createStackNavigator();

const { height, width } = Dimensions.get('screen');
const ImageCode01 = '01_image', ImageCode02 = '02_image', ImageCode03 = '03_image'

const pricePackage = [
    { price: 0.1, productCode: ImageCode01, currency: 'dollar' },
    { price: 0.3, productCode: ImageCode02, currency: 'dollar' },
    { price: 0.9, productCode: ImageCode03, currency: 'dollar' },

]

export class WallpaperAppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            isLoading: true,
            page: 1,
            lastDoc: null,
        };
        this.renderItem = this.renderItem.bind(this);
    }

    async componentDidMount() {

        // setup first time for pagination in firestore
        await collection.orderBy('urls').limit(1).get().then(response => {
            var images = []
            response.forEach(doc => {
                return images.push({...doc.data(), created_at: doc.data().created_at.toDate(), id: doc.id})
            })
            console.log('firstDoc: ', images)
            var lastDoc = images[images.length - 1]
            console.log('lastDoc: ', lastDoc)
            this.setState({
                lastDoc, images
            })
        })

        // await this.getFirestoreImages(this.state.lastDoc)
        await this.getImages(this.state.page)

    }


    getImages = async (page) => {
        const url = `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295`;
        axios.get(url).then((response) => {
            console.log('Network Request Successful');
            response.data = response.data.map(image => {
                return { ...image, ...this.getRandomPrice() }

            })
            var newArray = this.state.images.concat(response.data)
            this.setState({
                images: newArray,
                isLoading: false
            });
            console.log('Images array is ', this.state.images.length);

        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            console.log('Network request Completed');
        });
    }

    getFirestoreImages = async (lastDoc) => {
        console.log('last doc: ', lastDoc ? lastDoc.urls : null)
        lastDoc ?
            await collection.orderBy('urls').startAfter(lastDoc.urls).limit(1).get().then(response => {
                var array = []
                response.forEach(doc => {
                    array.push({...doc.data(), created_at: doc.data().created_at.toDate(), id: doc.id})
                })
                this.setState({
                    images: this.state.images.concat(array),
                    lastDoc: array[array.length - 1]
                })
            }).catch(error => {
                console.error(error)
            }) : null

    }

    getRandomPrice = () => {
        var index = Math.floor(Math.random() * (pricePackage.length)) + 0
        return pricePackage[index]

    }

    renderItem(image) {
        console.log('Inside renderitem');
        return (
            <View style={{ height, width }}>
                <Image
                    style={{ flex: 1, height: null, width: null }}
                    source={{ uri: image.urls.regular }}
                />
            </View>
        );
    }

    getNewImages = async () => {
        await this.setState({ page: this.state.page + 1 })
        await this.getFirestoreImages(this.state.lastDoc)
        await this.getImages(this.state.page + 1)
    }

    render() {
        return (
            this.state.isLoading ?
                (
                    <View style={styles.container}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) :
                <HomeScreenView
                    {...this.props}
                    images={this.state.images}
                    // images={customImage}
                    isLoading={this.state.isLoading}
                    getImages={() => { this.getNewImages() }}
                />
        );
    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
