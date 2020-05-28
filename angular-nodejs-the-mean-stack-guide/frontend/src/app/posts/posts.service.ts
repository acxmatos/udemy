import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return { ...this.posts.find((p) => p.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        // Navigate will make post-list component to fetch
        // posts from the database, so we don't need this code
        // portion anymore. Kept for learning purposes
        //
        // const post: Post = {
        //   id: responseData.post.id,
        //   title,
        //   content,
        //   imagePath: responseData.post.imagePath,
        // };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.patch(BACKEND_URL + id, postData).subscribe((response) => {
      // Navigate will make post-list component to fetch
      // posts from the database, so we don't need this code
      // portion anymore. Kept for learning purposes
      //
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
      // const post: Post = {
      //   id,
      //   title,
      //   content,
      //   imagePath: '', // response.imagePath,
      // };
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    // The delete promise returned will be subscribed in the
    // post-list component, and the data will be refetched
    // from there. Kept for learning purposes
    //
    // this.http
    //   .delete('http://localhost:3000/api/posts/' + postId)
    //   .subscribe(() => {
    //     const updatedPosts = this.posts.filter((post) => post.id !== postId);
    //     this.posts = updatedPosts;
    //     this.postsUpdated.next([...this.posts]);
    //   });
    return this.http.delete(BACKEND_URL + postId);
  }
}
