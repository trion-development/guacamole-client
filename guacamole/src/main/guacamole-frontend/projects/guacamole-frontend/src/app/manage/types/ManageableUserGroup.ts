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

import { UserGroup } from '../../rest/types/UserGroup';

/**
 * A pairing of an {@link UserGroup} with the identifier of its corresponding
 * data source.
 */
export class ManageableUserGroup {

    /**
     * The unique identifier of the data source containing this user.
     */
    dataSource: string;

    /**
     * The @link{UserGroup} object represented by this ManageableUserGroup
     * and contained within the associated data source.
     */
    userGroup: UserGroup;


    /**
     * Creates a new ManageableUserGroup. This constructor initializes the properties of the
     * new ManageableUserGroup with the corresponding properties of the given template.
     *
     * @param template
     *     The object whose properties should be copied within the new
     *     ManageableUserGroup.
     */
    constructor(template: ManageableUserGroup) {
        this.dataSource = template.dataSource;
        this.userGroup = template.userGroup;
    }
}