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
} from 'react-native';
import styles from './style';
import BackArrow from '../../../../assets/images/BackArrow.png';
import ModalCam from '../../../Common/containers/Camera';
import Gallery from '../../../Common/containers/Camera/Gallery';
import GalleryIco from '../../../../assets/images/PhoneGallery.png';
import connect from './connect';

class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camVisible: false,
    };
    this.renderCamera = this.renderCamera.bind(this);
    this.renderModalCam = this.renderModalCam.bind(this);
  }

  renderModalCam() {
    const { camVisible } = this.state;
    this.setState({
      camVisible: !camVisible,
    });
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
        <View style={styles.changePhotoContainer}>
          <TouchableOpacity
            style={styles.changePhoto}
            onPress={this.renderModalCam}
          >
            <View style={styles.changePhotoPic}></View>
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