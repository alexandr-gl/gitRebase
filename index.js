import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  AsyncStorage,
  DatePickerIOS,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import styles from './style';
import BackArrow from '../../../../assets/images/BackArrow.png';
import ModalCam from '../../../Common/containers/Camera';
import ModalGallery from '../../../Common/containers/Camera/Gallery';
import GalleryIco from '../../../../assets/images/PhoneGallery.png';
import connect from './connect';
import BackArrowIco from '../../../../assets/images/ArrowBack.png';
import FormPicker from '../../../Common/components/picker';
import { GENDER_KEYS_PROFILE, PICKER_KEYS } from '../../../Core/constatnts';

class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camVisible: false,
      galVisible: false,
      choosenAvatar: null,
      fullName: '',
      userName: '',
      birthday: '',
      gender: '',
      aboutYou: '',
      uid: '',
      avatarWasChanged: false,
      datePickerVisible: false,
      genderPickerVisible: false,
      chosenGender: 'Male',
    };
    this.renderCamera = this.renderCamera.bind(this);
    this.renderModalCam = this.renderModalCam.bind(this);
    this.onChangeInputHandler = this.onChangeInputHandler.bind(this);
    this.prepareUserData = this.prepareUserData.bind(this);
    this.onChangePickerValue = this.onChangePickerValue.bind(this);
    this.setDate = this.setDate.bind(this);
    // this.onChangePickerVisible = this.onChangeDatepickerVisible.bind(this);
    // this.setNavigationParams = this.setNavigationParams.bind(this);
  }

  componentDidMount() {
    this.setNavigationParams();
    this.getUserData();
  }

  setNavigationParams() {
    const { navigation } = this.props;
    navigation.setParams({
      prepareUserData: this.prepareUserData,
    });
  }

  getUserData = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userData'));
      console.log('User >>>', user);
      this.setState({
        uid: user._user.uid,
        fullName: user.fullName,
        userName: user.username,
        birthday: user.birthday,
        // gender: '',
        aboutYou: user.aboutYou,
        choosenAvatar: user.choosenAvatar,
      })
    } catch (error) {
      console.log('Get userdata err >>>', error);
    }
  }

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
      choosenAvatar: image.selected,
      avatarWasChanged: true,
    });
  }

  static navigationOptions = ({ navigation }) => {
    console.log('navigation >>>', navigation);
    if (navigation.state.params) {
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
          <TouchableOpacity onPress={navigation.state.params.prepareUserData}>
            <Text>Done</Text>
          </TouchableOpacity>
        ),
        headerStyle: styles.headerInDialog,
      };
    }
    return null;
  };

  prepareUserData() {
    const { choosenAvatar, fullName, userName, aboutYou, uid, avatarWasChanged, birthday, chosenGender } = this.state;
    console.log('Choosen ava', choosenAvatar);
    const userDataForUpdate = {
      fullName,
      username: userName,
      choosenAvatar,
      aboutYou,
      birthday,
      gender: chosenGender,
      avatarWasChanged,
    }
    this.props.updateUserData(uid, userDataForUpdate);
  }

  onChangeInputHandler(text, field) {
    console.log('onChangeInputHandler >>>', text, field);
    this.setState({
      [field]: text,
    });
  }

  hasPic() {
    if (this.state.choosenAvatar) {
      return (
        <Image
          source={{ uri: this.state.choosenAvatar}}
          style={styles.changePhotoPic}
        />
      );
    }
    return (
      <View style={styles.changePhotoPic} />
    );
  }

  showDatePicker = () => {
    // console.log('Wanna see date', this.state.birthday);
    if (this.state.datePickerVisible) {
      return (
        <View style={styles.datePickerContainer}>
          <DatePickerIOS
            initialDate={new Date(Date.parse(this.state.birthday))}
            onDateChange={this.setDate}
            mode={'date'}
          />
        </View>
      );
    }
    return null;
  }

  setDate(newDate) {
    console.log('new date', newDate);
    const { birthday } = this.state;
    this.setState({
      // birthday: moment(newDate).format('DD/MM/YYYY'),
      birthday: newDate.toDateString(),
    });
  }

  onChangePickerVisible = (type) => {
    this.setState({
      [type]: !this.state[type],
    });
  }

  onChangePickerValue(type, value) {
    this.setState({ [PICKER_KEYS[type]]: value });
  }

  changeVisible() {

  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView style={styles.mainContainer}>
        {this.renderCamera()}
        {this.modalGallery()}
          <View style={styles.changePhotoContainer}>
            <TouchableOpacity
              style={styles.changePhoto}
              onPress={this.renderModalCam}
            >
            {this.hasPic()}
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
                <TextInput
                  placeholder='Full Name'
                  onChangeText={(text) => this.onChangeInputHandler(text, 'fullName')}
                  value={this.state.fullName}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.sectionPoint}>
                <Text style={styles.sectionPointTitle}>Username</Text>
                <TextInput
                  placeholder='Username'
                  onChangeText={(text) => this.onChangeInputHandler(text, 'username')}
                  value={this.state.userName}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.sectionPoint}>
                <Text style={styles.sectionPointTitle}>Birthday</Text>
                <TouchableOpacity onPress={() => this.onChangePickerVisible('datePickerVisible')}>
                  <Text style={styles.textInput}>{moment(this.state.birthday).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>
              </View>
              {this.showDatePicker()}
              <View style={styles.sectionPoint}>
                <Text style={styles.sectionPointTitle}>Gender</Text>
                <TouchableOpacity onPress={() => this.onChangePickerVisible('genderPickerVisible')}>
                  <Text style={styles.textInput}>{this.state.chosenGender}</Text>
                </TouchableOpacity>
              </View>
              <FormPicker
                values={GENDER_KEYS_PROFILE}
                visibility={this.state.genderPickerVisible}
                type="genderPickerVisible"
                changeVisible={this.onChangePickerVisible}
                onChangePickerValue={this.onChangePickerValue}
                selVal={this.state.chosenGender}
                deviderStyle={styles.deviderStyle}
              />
            </View>
          </View>

          <View style={styles.sectionListConatainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeader}>About You</Text>
              </View>
              <TextInput
                placeholder='Introduce yourself'
                style={[styles.introduceInput, styles.textInput]}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => this.onChangeInputHandler(text, 'aboutYou')}
                value={this.state.aboutYou}
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
                  <Text style={styles.textInput}>Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(EditUserProfile);
