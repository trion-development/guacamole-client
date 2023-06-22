/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { NotificationModule } from './notification/notification.module';
import { FormModule } from './form/form.module';
import { NavigationModule } from './navigation/navigation.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationInterceptor } from './auth/interceptor/authentication.interceptor';
import { ErrorHandlingInterceptor } from './rest/interceptor/error-handling.interceptor';
import { LocaleModule } from './locale/locale.module';
import { DefaultHeadersInterceptor } from './index/config/default-headers.interceptor';
import { ListModule } from './list/list.module';
import { SettingsModule } from './settings/settings.module';
import { CommonModule } from '@angular/common';
import { ManageModule } from './manage/manage.module';
import { HomeModule } from './home/home.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        LocaleModule,
        AppRoutingModule,
        HttpClientModule,
        NavigationModule,
        NotificationModule,
        FormModule,
        LoginModule,
        ListModule,
        SettingsModule,
        ManageModule,
        HomeModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: DefaultHeadersInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}