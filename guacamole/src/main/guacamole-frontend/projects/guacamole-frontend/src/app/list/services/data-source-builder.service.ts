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

import { Injectable } from '@angular/core';
import { DataSourceBuilder } from '../types/DataSourceBuilder';
import { FilterService } from './filter.service';
import { PaginationService } from './pagination.service';
import { SortService } from './sort.service';

/**
 * A service that allows to create a DataSource instance by using a builder.
 * A data source can be configured with a filter, a sort order and pagination.
 */
@Injectable({
    providedIn: 'root'
})
export class DataSourceBuilderService {

    /**
     * Inject required services.
     */
    constructor(private sortService: SortService,
                private filterService: FilterService,
                private paginationService: PaginationService) {
    }

    /**
     * Creates a new DataSourceBuilder.
     */
    getBuilder<TData>(): DataSourceBuilder<TData> {
        return new DataSourceBuilder<TData>(this.sortService, this.filterService, this.paginationService);
    }
}