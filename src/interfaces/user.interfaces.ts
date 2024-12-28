import { Observable } from "rxjs";

export interface UserService {
    GetUser(data: { userId: string }): Observable<any>;
    CreateUser(data: { userId: string; userName: string }): Observable<any>;
    Update(data: { userId: string; userName: string }): Observable<any>;
}