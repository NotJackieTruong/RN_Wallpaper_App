import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import axios from 'axios'
import { HomeScreenView } from 'views/homeScreenView';

const ImageCode01 = '01_image', ImageCode02 = '02_image', ImageCode03 = '03_image'

const pricePackage = [
  { price: 0.1, productCode: ImageCode01, currency: 'dollar' },
  { price: 0.3, productCode: ImageCode02, currency: 'dollar' },
  { price: 0.9, productCode: ImageCode03, currency: 'dollar' },

]
export class CollectionsView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      collections: [],
      collectionId: '',
      isLoading: true,
      photoPage: 1,
      photos: [],
    }
  }

  componentDidMount() {
    this.getCollections(this.state.page)
  }

  getRandomPrice = () => {
    var index = Math.floor(Math.random() * (pricePackage.length)) + 0
    return pricePackage[index]

  }

  getCollections(page) {
    const url = `https://api.unsplash.com/collections?page=${page}&per_page=10&client_id=896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295`;
    axios.get(url).then(results => {
      console.log('Request collection length: ', results.data.length)
      this.setState({
        collections: this.state.collections.concat(results.data),
        isLoading: false
      })
    }).catch(error => {
      console.error(error)
    })
  }

  getCollectionPhotos(id, photoPage) {
    const url = `https://api.unsplash.com/collections/${id}/photos?page=${photoPage}&per_page=20&client_id=896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295`;
    axios.get(url).then(results => {
      console.log('Request collection photo length: ', results.data.length)
      results.data = results.data.map(image=>{
        return {...image, ...this.getRandomPrice()}
      })
      this.setState((prevState, prevProps) => {
        if (prevState.collectionId === '') {
          return {
            collectionId: id,
            photos: this.state.photos.concat(results.data)
          }
        } else if (prevState.collectionId !== id) {
          return {
            collectionId: id,
            photos: results.data
          }
        } else {
          return {
            photos: this.state.photos.concat(results.data)
          }
        }
      })
      // this.setState({
      //   collectionId: id,
      //   photos: this.state.photos.concat(results.data)
      // })
      this.renderHomeView(id, photoPage)
    }).catch(error => {
      console.error(error)
    })

  }

  // componentDidUpdate(prevProps, prevState){
  //   if(prevState.collectionId && this.state.collectionId){
  //     this.setState({
  //       photos: []
  //     })
  //   }
  // }

  renderHomeView(id, photoPage) {
    this.props.navigation.navigate('SearchResults', {
      images: this.state.photos,
      getImages: (id, photoPage) => {
        this.getCollectionPhotos(id, photoPage)
      },
      id,
      photoPage

    });
  }

  handleOnEndReach() {
    this.setState({ page: this.state.page + 1 })
    this.getCollections(this.state.page + 1)
  }

  removeNonAlphabeticalCharacter(input) {
    input = input.replace(/[^0-9a-z]/gi, ' ')
    input = input.charAt(0).toUpperCase() + input.slice(1)
    return input
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        {this.state.isLoading ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
            <FlatList
              data={this.state.collections}
              pagingEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { this.getCollectionPhotos(item.id, this.state.photoPage) }}
                  style={styles.collectionContainer}
                >
                  <Image
                    style={styles.collectionCoverImage}
                    source={{ uri: item.cover_photo.urls.small }}
                    key={item.id}
                  ></Image>
                  <Text style={styles.collectionCoverTitle}>{this.removeNonAlphabeticalCharacter(item.title)}</Text>

                </TouchableOpacity>
              )}
              numColumns={1}
              keyExtractor={item => item.id}
              onEndReached={() => { this.handleOnEndReach(this.props) }}
              onEndReachedThreshold={1}
            />
          )}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: '#1c222a',
    flex: 1
  },
  collectionContainer: {
    marginBottom: 4
  },
  collectionCoverImage: {
    height: 200,
    width: '100%',
  },
  collectionCoverTitle: {
    color: 'white',
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 18,
    bottom: 8,
    left: 4
  },
  collectionCoverDescription: {
    color: 'white',
    position: 'relative',
    fontSize: 15
  }
})