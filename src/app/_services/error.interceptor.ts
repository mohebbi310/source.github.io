import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.error.stateCode === 201) {
                        return throwError(error.error.message);
                    }

                    if (error.error.stateCode === 202) {
                        return throwError(error.error.message);
                    }

                    if (error.error.stateCode === 500) {
                        return throwError(error.error.message);
                    }

                    if (error.error.status === 400) {
                        let msg = error.error.title + '\n';
                        if (typeof error.error.errors.MobileNumber !== 'undefined') {
                            for (let index = 0; index < error.error.errors.MobileNumber.length; index++) {
                                msg += error.error.errors.MobileNumber[index] + '\n';
                            }
                        }
                        if (typeof error.error.errors.NationalCode !== 'undefined') {
                            for (let index = 0; index < error.error.errors.NationalCode.length; index++) {
                                msg += error.error.errors.NationalCode[index] + '\n';
                            }
                        }
                        return throwError(msg);
                    }

                    const applicationError = error.headers.get('Application-Error');
                    if (applicationError) {
                        console.error(applicationError);
                        return throwError(applicationError);
                    }
                }
            })
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
