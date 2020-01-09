import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reciepe } from './reciepe.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BackendUrl = environment.apiUrl + '/reciepe';

@Injectable({ providedIn: 'root' })
export class ReciepeService {

  constructor(private http: HttpClient) { }

  getReciepes(currentPageSize: number, currentPage: number) {
    const queryParams = `?pagesize=${currentPageSize}&page=${currentPage}`;
    return this.http.get<{ message: string, reciepes: any, maxCount: number }>(BackendUrl + queryParams)
      .pipe(
        map(responseData => {
          return {
            reciepes: responseData.reciepes.map(r => {
              const reciepe: Reciepe = {
                id: r._id,
                title: r.title,
                content: r.content,
                type: r.type,
                created_on: r.created_on,
                isActive: r.isActive,
                imagePath: r.imagePath,
                createdBy: r.createdBy
              };
              return reciepe;
            }),
            message: responseData.message,
            count: responseData.maxCount,
          };
        })
      );
  }

  postReciepe(reciepe: Reciepe, image: File) {
    const postData = new FormData();
    postData.append('title', reciepe.title);
    postData.append('content', reciepe.content);
    postData.append('type', reciepe.type);
    postData.append('image', image, reciepe.title);
    return this.http.post<{ message: string }>(BackendUrl, postData);
  }

  editReciepe(reciepeId: string, reciepe: Reciepe, image: File | string) {
    let postData: FormData | Reciepe;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('title', reciepe.title);
      postData.append('content', reciepe.content);
      postData.append('type', reciepe.type);
      postData.append('image', image, reciepe.title);
    } else {
      postData = {id: reciepeId, title: reciepe.title, content: reciepe.content, type: reciepe.type,
      imagePath: image, createdBy: null};
    }
    return this.http.put<{ message: string }>(`${BackendUrl}/${reciepeId}`, postData);
  }

  getReciepeById(reciepeId: string) {
    return this.http.get<{ reciepe: any }>(`${BackendUrl}/${reciepeId}`)
      .pipe(
        map(responseData => {
          const reciepe: Reciepe = {
            id: responseData.reciepe._id,
            title: responseData.reciepe.title,
            content: responseData.reciepe.content,
            type: responseData.reciepe.type,
            imagePath: responseData.reciepe.imagePath,
            createdBy: responseData.reciepe.createdBy
          };
          return reciepe;
        })
      );
  }

  deleteReciepe(reciepeId: string) {
    return this.http.delete(`${BackendUrl}/${reciepeId}`);
  }

}
