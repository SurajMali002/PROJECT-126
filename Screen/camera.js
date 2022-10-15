import * as React from "react"
import {Button, View,Image,Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{    
    state={
        image:null,
    }
   
    render(){
        let{image}=this.state
        return(
            <View style={{flex:1 ,justifyContent:"center", alignItem:"center"}}>
                <Button 
                title="Pick an Image From Camera Roll"
                onPress={this._pickImage}/>
            </View>
            )

        
    
    }

    ComponentDidMount(){
        this.getPermission()
    }

    getPermission=async()=>{
        if(Platform.OS !== "web"){
            const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("sorry we need Camera Roll permissions")
        
            }
        }
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        let filename=uri.split("/")[uri.split("/").length-1]
        let type=`image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload={
            uri:uri,
            name:filename,
            type:type
        }
        data.append("digit",fileToUpload)
        fetch("https://99d0-2401-4900-5bab-379d-5874-1f3e-3c87-f1.in.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/form-data"},
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("success: ",result)
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    _pickImage=async()=>{
        try{
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1,

            });
            if(!result.cancelled){
                this.setState({image:result.data})
                console.log(result.uri)
                this.uploadImage(result.uri)
            
            }

        }
        catch(E){
            console.log(E)
        }
    }
}