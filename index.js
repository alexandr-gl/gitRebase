import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Image,
  Modal,
  AsyncStorage,
} from 'react-native';
import styles from './style';
import BackArrow from '../../../../assets/images/BackArrow.png';
import ModalCam from '../../../Common/containers/Camera';
import ModalGallery from '../../../Common/containers/Camera/Gallery';
import GalleryIco from '../../../../assets/images/PhoneGallery.png';
import connect from './connect';
import BackArrowIco from '../../../../assets/images/ArrowBack.png';

class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camVisible: false,
      galVisible: false,
      choosenAvatar: null,
    };
    this.renderCamera = this.renderCamera.bind(this);
    this.renderModalCam = this.renderModalCam.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    // let userData = this.getUserData()
  }

  // getUserData = async() => {
  //   try {
  //     const value = await AsyncStorage.getItem('userData');
  //     if (value !== null) {
  //       // We have data!!
  //       console.log('&&&&&>>>>>>>', value);
  //     }
  //    } catch (error) {
  //      // Error retrieving data
  //    }
  // }

  renderModalCam() {
    const { camVisible } = this.state;
    this.setState({
      camVisible: !camVisible,
    });
  }

  captureImage = (photo, type) => {
    const { camVisible } = this.state;
    console.log('Photo >>>', photo);
    if (type) {
      this.setState({ camVisible: !camVisible });
    }
  }

  renderGallery = () => {
    return (
      <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={this.toggleGallery}>
        <Image
          style={{ flex: 1, justifyContent: 'center' }}
          source={GalleryIco}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }


  toggleGallery = () => {
    const { galVisible, camVisible } = this.state;
    console.log('Toggle gallery>>>>', galVisible);
    this.setState({
      galVisible: !galVisible,
      camVisible: !camVisible,
    });
  }

  renderCamera() {
    const { camVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        hardwareAccelerated
        visible={camVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <ModalCam
          callback={this.captureImage}
          onSendPicture={this.onSendPicture}
          renderGallery={this.renderGallery}
        />
      </Modal>
    );
  }

  modalGallery = () => {
    const { galVisible } = this.state;
    return (
      <Modal
        hardwareAccelerated
        animationType="slide"
        transparent={false}
        visible={galVisible}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.galleryHeader}>
            <TouchableOpacity onPress={() => {
              this.setState({
                galVisible: false,
                camVisible: true,
              });
            }}
            >
              <Image style={styles.dialogBack} source={BackArrowIco} />
            </TouchableOpacity>
            <Text style={styles.galleryHeaderText}>Choose photo</Text>
            <View style={styles.fakeView} />
          </View>
          <ModalGallery onPickImage={this.onPickImage} />
        </View>
      </Modal>
    );
  }

  onPickImage = (image) => {
    console.log('Wanna see image', image);
    this.setState({
      camVisible: false,
      galVisible: false,
      choosenAvatar: image,
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={styles.dialogHeader}>
          <Text>Edit Profile</Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity
          underlayColor="#fff"
          onPress={() => {
            navigation.goBack();
            // navigation.state.params.onGoBack();
          }}
        >
          <Image style={styles.dialogBack} source={BackArrow} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
      headerStyle: styles.headerInDialog,
    };
  };

  render() {
    // console.log('CHECK EDIT PROFILE PROPS>>>', this.props);
    return (
      <ScrollView style={styles.mainContainer}>
      {this.renderCamera()}
      {this.modalGallery()}
        <View style={styles.changePhotoContainer}>
          <TouchableOpacity
            style={styles.changePhoto}
            onPress={this.renderModalCam}
          >
            <View style={styles.changePhotoPic}>

            </View>
            <Text style={styles.changePhotoText}>Change profile photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionListConatainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>General</Text>
            </View>
            <View style={styles.sectionPoint}>
              <Text style={styles.sectionPointTitle}>Full Name</Text>
              <TextInput placeholder='Full Name'/>
            </View>
            <View style={styles.sectionPoint}>
              <Text style={styles.sectionPointTitle}>Username</Text>
              <TextInput placeholder='Username'/>
            </View>
            <View style={styles.sectionPoint}>
              <Text style={styles.sectionPointTitle}>Birthday</Text>
              <TouchableOpacity>
                <Text>Date should be there</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionPoint}>
              <Text style={styles.sectionPointTitle}>Gender</Text>
              <TouchableOpacity>
                <Text>Gender should be there</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionListConatainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>About You</Text>
            </View>
            <TextInput
              placeholder='Introduce yourself'
              style={styles.introduceInput}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.sectionListConatainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Location</Text>
            </View>
            <View style={styles.sectionPoint}>
              <Text style={styles.sectionPointTitle}>Hometown</Text>
              <TouchableOpacity>
                <Text>Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(EditUserProfile);