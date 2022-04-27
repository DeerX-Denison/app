import * as Buttons from '@Components/Buttons';
// import { UserContext } from '@Contexts';
// import { useProfile } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, /*useContext*/ } from 'react';
import {View , TextInput} from 'react-native';
import { ListingsStackParamList } from 'types';
interface Props {
	route: RouteProp<ListingsStackParamList, 'Report'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Report'>;
}

const Report: FC<Props> = ({ route}) => {
	// const { userInfo } = useContext(UserContext);
	// const { profile: displayUserProfile } = useProfile(route.params.uid);
  const [textInputValue, setTextInputValue] = React.useState('');
  console.log(textInputValue);
	return (
		<View>
      <TextInput
        style={{ 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        }}
        onChangeText={text => setTextInputValue(text)}
        value={textInputValue}
        placeholder="Please explain your report"
      />
      <View style={tw('flex', 'justify-center')}>
        <Buttons.Primary
          title="Submit"
          onPress={() => {
            console.log("Submitted!!!!");
          }}
          size={'sm'}
        />
        <Buttons.Primary
          title="Discard"
          onPress={() => {
            setTextInputValue('');
            console.log("Discard your submission!!!!!");
          }}
          size={'sm'}
        />
      </View>
    </View>
  )};

export default Report;
