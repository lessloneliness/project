import { React, useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { auth, db } from '../firebase';
import { Circle } from 'react-native-progress';
import { calculateMatch } from '../utils/calculateMatch';
import {
  collection,
  query,
  arrayUnion,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';

const AddUserScreen = () => {
  const navigation = useNavigation(); // must if we want to use navigation
  const { params } = useRoute();
  const [list, setList] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'users'));
    getDocs(q)
      .then((snapshot) => {
        const docList = [];
        snapshot.forEach((doc) => {
          if (doc.data().Email != auth.currentUser?.email)
            // all the user but not with the courrent user
            docList.push(doc.data());
        });
        setList(docList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const AddFriend = async (myfriend, IdFriend) => {
    console.log('User 222232: ', auth.currentUser?.email);

    const meRef = doc(db, 'users', user.uid);
    await updateDoc(meRef, {
      Friends: arrayUnion(myfriend), // add matan to my friend
    });

    const friendRef = doc(db, 'users', IdFriend);
    await updateDoc(friendRef, {
      Friends: arrayUnion(auth.currentUser?.email), // add cuurent user (hadar) to matan array
    });
  };

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          marginTop: 30,
          alignItems: 'center',
        }}
      >
        <Text style={styles.text}>ALL THE USER IN THE APP</Text>
        <View style={styles.container}>
          {list.map((person) => {
            const match = calculateMatch(
              params.bio,
              person.Bio,
              params.hobbies,
              person.HobbiesId
            );
            return (
              <View key={person.Id} style={styles.itemContainer}>
                <Text style={styles.item}>Email: {person.Email}</Text>
                <Text style={styles.item}>Bio: {person.Bio}</Text>
                <View style={styles.bioContainer}>
                  <Circle
                    textStyle={{ fontSize: 18 }}
                    size={50}
                    progress={match}
                    showsText={true}
                    formatText={() => `${(match * 100).toFixed()}%`}
                  />
                  <TouchableOpacity
                    onPress={() => AddFriend(person.Email, person.Id)}
                    style={[styles.button3, styles.buttonOutline]}
                  >
                    <Text style={styles.buttonOutlineText}>Send request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Home')}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginBottom: 5,
  },
  itemContainer: {
    marginBottom: 5,
    borderBottomWidth: 1,
  },
  item: {
    padding: 2,
    fontSize: 15,
    marginTop: 0,
    marginBottom: 5,
  },
  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    //backgroundColor: 'red',
    padding: 5,
    alignContent: 'center',
  },
  headerText: {
    fontSize: 30,
  },
  formContainer: {
    width: '100%',
    height: '60%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    width: '75%',
    height: '15%',
    fontSize: 15,
    borderWidth: 1,
  },
  text: {
    fontSize: 23,
    color: 'green',
    fontStyle: 'italic',
    marginTop: 0,
    marginBottom: 33,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'red',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  button3: {
    backgroundColor: 'white',
    width: '80%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
    borderWidth: 1,
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: 'black',
    width: '40%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  Image: {
    width: 70,
    height: 70,
    borderRadius: 230 / 2,
    overflow: 'hidden',
    marginBottom: '1%',
    marginHorizontal: '1%',
    marginVertical: '0%',
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 0,
    padding: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    marginHorizontal: '7%',
  },

  textArea: {
    height: 70,
    justifyContent: 'flex-start',
  },
});
