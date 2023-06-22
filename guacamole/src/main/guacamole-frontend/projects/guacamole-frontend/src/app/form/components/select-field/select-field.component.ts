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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormFieldBaseComponent, getFieldOption } from '../form-field-base/form-field-base.component';

/**
 * Component for select fields.
 */
@Component({
    selector: 'guac-select-field',
    templateUrl: './select-field.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SelectFieldComponent extends FormFieldBaseComponent implements OnChanges {

    /**
     * The ID value that should be used to associate
     * the relevant input element with the label provided by the
     * guacFormField component, if there is such an input element.
     */
    @Input() fieldId?: string;

    /**
     * @borrows FormFieldBaseComponent.getFieldOption
     */
    protected readonly getFieldOption = getFieldOption;

    /**
     * Apply disabled state to form control.
     */
    ngOnChanges(changes: SimpleChanges): void {

        if (changes['disabled']) {

            const disabled: boolean = changes['disabled'].currentValue;
            this.setDisabledState(this.control, disabled);

        }
    }
}