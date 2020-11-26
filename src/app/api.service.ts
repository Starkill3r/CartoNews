import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_KEY = '73a7ef5c9f3b465aa7e6c6be41671497';

  constructor(private httpClient: HttpClient) { }

  getNews(){
    return this.httpClient.get(`http://newsapi.org/v2/top-headlines?sources=google-news-br&apiKey=${this.API_KEY}`);
  }
}
