import { Platform } from "react-native";

function isIOS(){
    return Platform.OS==='ios';
}
export {isIOS};