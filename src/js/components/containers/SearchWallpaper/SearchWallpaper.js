import React, { Component } from 'react';
import { View, SafeAreaView, ActivityIndicator, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import axios from 'axios';
import { HomeScreenView } from 'views/homeScreenView';
import { isUndefined } from 'lodash';
import randomMC from 'random-material-color'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const ImageCode01 = '01_image', ImageCode02 = '02_image', ImageCode03 = '03_image'

const pricePackage = [
    {price: 0.1, productCode: ImageCode01, currency: 'dollar'},
    {price: 0.3, productCode: ImageCode02, currency: 'dollar'},
    {price: 0.9, productCode: ImageCode03, currency: 'dollar'},

]

export class SearchWallpaper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            images: [],
            isLoading: true
        };
    }

    getRandomColor() {
        var color = randomMC.getColor()
        console.log('color: ', color)
        return color
    }

    handleFieldChange(key, value) {
        console.log('handleFieldChange', key, value);
        this.setState({
            [key]: value
        });
    }

    searchQuery(param) {
        console.log('param is ', param);
        const query = isUndefined(param) ? this.state.search : param;
        console.log('query word is', query);
        console.log(this.props);
        if ('' !== this.state.search || !isUndefined(param)) {
            const url = `https://api.unsplash.com/search/photos?query=${query}&count=10&client_id=896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295`;
            axios.get(url).then((response) => {
                console.log('Search Request Completed', response.data.results);
                response.data.results = response.data.results.map(image=>{
                    return {...image, ...this.getRandomPrice()}
                })
                this.setState({
                    images: response.data.results,
                    isLoading: false
                });
                this.render()
                // this.renderHomeView();
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                console.log('Network request Completed');
            });
        }
    }

    getRandomPrice = ()=>{
        var index = Math.floor(Math.random() * (pricePackage.length )) + 0
        return pricePackage[index]

    }

    renderHomeView() {
        console.log('renderHomeView');
        this.props.navigation.navigate('SearchResults', {
            images: this.state.images,
        });
    }



    renderResults(images) {
        return (
            <HomeScreenView />
        )
    }

    render() {
        // const data = ['Travel', 'Nature', 'India', 'Sports', 'Planets', 'Bikes', 'Hollywood', 'Cartoons'];
        const searchLogo = { uri: 'https://images.vexels.com/media/users/3/132068/isolated/preview/f9bb81e576c1a361c61a8c08945b2c48-search-icon-by-vexels.png' }
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput placeholder="Search..." placeholderTextColor="white" style={styles.textInput} onChangeText={text => this.handleFieldChange('search', text)} />
                    <TouchableOpacity style={styles.touchableOpacity} onPress={() => { this.searchQuery() }}>
                        <Image source={searchLogo} style={{ width: 25, height: 25, marginVertical: 10, marginHorizontal: 4 }} />
                    </TouchableOpacity>
                </View>
                {this.state.images.length !== 0 ? (
                    // <Text>abc {this.state.images.length}</Text>
                    this.state.isLoading ? (
                        <View style={styles.container}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    ) : (
                            <HomeScreenView
                                {...this.props}
                                images={this.state.images}
                                isLoading={this.state.isLoading}
                                navigation={this.props.navigation}
                            />
                        )

                ) : (
                        // <Text>def {this.state.images.length}</Text>
                        <View style={styles.searchResultContainer}>
                            <Image source={searchLogo} style={styles.image} />
                            <Text style={styles.text}>Search wallpaper by categories, names, etc.</Text>
                        </View>
                    )}

            </SafeAreaView>
            // isEmpty( this.state.images ) ?
            // (
            // <SafeAreaView style={styles.container}>
            //     <TextInput
            //         style={styles.textinput}
            //         onChangeText={text => this.handleFieldChange('search', text)}
            //     />
            //     <TouchableOpacity style={styles.button}>
            //         <Button
            //             onPress={() => this.searchQuery()}
            //             title="Search Wallpaper by Category"
            //             style={styles.textinput}
            //         />
            //     </TouchableOpacity>

            //     <Text style={styles.text}> Top Searches </Text>
            //     <FlatList
            //         data={data}
            //         pagingEnabled
            //         renderItem={({ item }) => (
            //             <TouchableOpacity onPress={() => this.searchQuery(item)}>
            //                 <View style={{
            //                     borderRadius: 20,
            //                     padding: 10,
            //                     width: 120,
            //                     height: 40,
            //                     backgroundColor: '#2b99aa',
            //                     justifyContent: 'center',
            //                     alignItems: 'center',
            //                     margin: 8
            //                 }}>
            //                     <Text style={{ color: '#f5f5f5' }}> {item} </Text>
            //                 </View>
            //             </TouchableOpacity>
            //         )}
            //         numColumns={3}
            //         keyExtractor={(item, index) => 'key' + index + item.key}

            //     />
            // </SafeAreaView>

            // ):
            // <HomeScreenView
            //     { ...this.props }
            //     images = { this.state.images }
            //     isLoading = { this.state.isLoading }
            // />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#1c222a'
        backgroundColor: '#1c222a',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    touchableOpacity: {
        alignItems: "center",
        backgroundColor: "#232d36",
        padding: 10
    },
    textInput: {
        fontSize: 15,
        flex: 1,
        color: 'white',
        backgroundColor: '#232d36',
        paddingHorizontal: 16,
    },
    searchResultContainer: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100
    },
    text: {
        fontSize: 15,
        padding: 10,
        margin: 10,
        color: '#f5f5f5'
    },
    icon: {
        fontSize: 30,
        color: 'white'
    },

});
