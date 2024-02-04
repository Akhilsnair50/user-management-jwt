import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadServiceService {
  PATH_OF_API = 'http://localhost:9090/upload';

  constructor(private httpClient:HttpClient ) { }

  uploadImage(file:File , userName:string){
    const formData :FormData = new FormData();

    formData.append('file',file);
    formData.append('userName',userName);

   // Set the timeout value in milliseconds
   const timeoutValue = 100000; // 10 seconds

   return this.httpClient.post(this.PATH_OF_API, formData, { observe: 'response' }).pipe(
     timeout(timeoutValue)
   );
  }
}
