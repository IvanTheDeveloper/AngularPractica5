import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor() { }

  uploadFile(filePath: string, file: File): Promise<any> {
    const storageRef = firebase.storage().ref(filePath)
    return storageRef.put(file).then((snapshot) => snapshot.ref.getDownloadURL())
  }

  deleteFile(filePath: string): Promise<any> {
    const storageRef = firebase.storage().refFromURL(filePath)
    return storageRef.delete()
  }

}