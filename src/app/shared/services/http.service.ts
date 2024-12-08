import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    readonly #httpClient = inject(HttpClient);
    readonly #apiUrl = environment.apiUrl;

    /**
     * Generic HTTP GET request
     * @param endpoint API endpoint relative to base URL
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    get<T>(endpoint: string, params?: { [param: string]: string | number | boolean }): Observable<T> {
        return this.#httpClient.get<T>(this.buildUrl(endpoint), {
            params: this.buildParams(params),
        });
    }

    /**
     * Generic HTTP POST request
     * @param endpoint API endpoint relative to base URL
     * @param body Payload to be sent
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    post<T, R = any>(
        endpoint: string,
        body: T,
        params?: { [param: string]: string | number | boolean }
    ): Observable<R> {
        return this.#httpClient.post<R>(this.buildUrl(endpoint), body, {
            params: this.buildParams(params),
        });
    }

    /**
     * Generic HTTP PUT request
     * @param endpoint API endpoint relative to base URL
     * @param body Payload to be sent
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    put<T, R = any>(
        endpoint: string,
        body: T,
        params?: { [param: string]: string | number | boolean }
    ): Observable<R> {
        return this.#httpClient.put<R>(this.buildUrl(endpoint), body, {
            params: this.buildParams(params),
        });
    }

    /**
     * Generic HTTP DELETE request
     * @param endpoint API endpoint relative to base URL
     * @param params Optional query parameters
     * @returns Observable of the response
     */
    delete<T>(endpoint: string, params?: { [param: string]: string | number | boolean }): Observable<T> {
        return this.#httpClient.delete<T>(this.buildUrl(endpoint), {
            params: this.buildParams(params),
        });
    }

    /**
     * Helper method to construct full URLs
     * @param endpoint Relative API endpoint
     * @returns Full URL
     */
    private buildUrl(endpoint: string): string {
        return `${this.#apiUrl}/${endpoint}`;
    }

    /**
     * Helper method to construct HttpParams from an object
     * @param params Object containing query parameters
     * @returns HttpParams
     */
    private buildParams(params?: { [param: string]: string | number | boolean | string[] }): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                const value = params[key];
                if (Array.isArray(value)) {
                    httpParams = httpParams.append(key, value.join(','));
                } else {
                    httpParams = httpParams.append(key, String(value));
                }
            });
        }
        return httpParams;
    }
}
