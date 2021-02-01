import randomColor from 'random-material-color';
import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Image, FlatList, Dimensions, Header, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colorArray = [
    { primary: '#F44336', dark: '#D32F2F', light: '#E57373' },
    { primary: '#E91E63', dark: '#C2185B', light: '#F06292' },
    { primary: '#9C27B0', dark: '#7B1FA2', light: '#BA68C8' },
    { primary: '#673AB7', dark: '#512DA8', light: '#9575CD' },
    { primary: '#3F51B5', dark: '#303F9F', light: '#7986CB' },
    { primary: '#2196F3', dark: '#1976D2', light: '#64B5F6' },
    { primary: '#03A9F4', dark: '#0288D1', light: '#4FC3F7' },
    { primary: '#00BCD4', dark: '#0097A7', light: '#4DD0E1' },
    { primary: '#009688', dark: '#00796B', light: '#4DB6AC' },
    { primary: '#4CAF50', dark: '#388E3C', light: '#81C784' },
    { primary: '#FF9800', dark: '#F57C00', light: '#FFB74D' },
    { primary: '#795548', dark: '#5D4037', light: '#A1887F' },

]



export class HomeScreenView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: []
        }

    }
    handleOnEndReach = (props) => {
        console.log('Reach the end.');
        var collectionId = props.id
        var collectionPhotoPage = props.photoPage
        props.getImages ? (collectionId && collectionPhotoPage ? props.getImages(collectionId, collectionPhotoPage + 1) : props.getImages()) : null
    }

    getRandomColor = () => {
        var index = Math.floor(Math.random() * (colorArray.length - 1)) + 0
        return colorArray[index]
    }



    componentDidMount() {
        // var newImageArray = this.props.images.map(image=>{
        //     var color = this.getRandomColor()
        //     return {...image, primary: color.primary, dark: color.dark}
        // })
        console.log('1st image price: ', this.props.images[0].price)
        this.setState({ images: this.props.images })

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.images !== this.props.images) {
            console.log('update component')
            // this.render()
        } else {
            console.log('didnt update component')
        }
    }


    render() {
        const { isLoading, images, navigation } = this.props;
        console.log('image length: ', images[0] ? images[0].id : null)
        { console.log('this.props.images: ', this.props.images.length) }

        return (
            <View style={{ backgroundColor: '#1c222a' }}>
                <FlatList
                    data={images}
                    pagingEnabled
                    renderItem={({ item }) => {
                        const color = this.getRandomColor()
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('FullScreenImageView', {
                                    data: { ...item, ...color }
                                })}
                                key={item.id}
                            >
                                <View style={{ height: 260, width: 190, margin: 8 }}>
                                    <Image
                                        style={{ height: '100%', width: '100%' }}
                                        source={{ uri: item.urls.small }}
                                        key={item.id}
                                    ></Image>
                                    <Text style={{ color: 'white', position: 'absolute', left: 12, bottom: 12 }}>{item.price}$</Text>

                                    {/* <View style={{ backgroundColor: color.primary, width: '100%', height: 50, position: 'absolute', bottom: 0,}}>

                                    </View> */}
                                </View>

                            </TouchableOpacity>
                        )
                    }}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    // ListFooterComponent={() => <ReloadButton />}
                    // style={{marginBottom: 30}}
                    onEndReached={() => { this.handleOnEndReach(this.props) }}
                    onEndReachedThreshold={1}
                />
            </View>
            // <View>
            //     <Text>Abc def ghi</Text>
            // </View>
        )
    }
}