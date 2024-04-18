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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ClientModule } from '../client/client.module';
import { GroupListModule } from '../group-list/group-list.module';
import { NavigationModule } from '../navigation/navigation.module';
import { RestModule } from '../rest/rest.module';
import { ConnectionGroupComponent } from './components/connection-group/connection-group.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { GuacRecentConnectionsComponent } from './components/guac-recent-connections/guac-recent-connections.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
    declarations: [
        GuacRecentConnectionsComponent,
        ConnectionComponent,
        ConnectionGroupComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        TranslocoModule,
        GroupListModule,
        NavigationModule,
        ClientModule,
        RestModule,
        RouterModule
    ],
    exports: [
        HomeComponent,
    ]
})
export class HomeModule {
}
