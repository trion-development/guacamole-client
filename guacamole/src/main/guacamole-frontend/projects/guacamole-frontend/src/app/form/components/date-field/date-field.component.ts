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

import { formatDate } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FormFieldBaseComponent } from '../form-field-base/form-field-base.component';

/**
 * Component to display date fields.
 */
@Component({
    selector     : 'guac-date-field',
    templateUrl  : './date-field.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DateFieldComponent extends FormFieldBaseComponent implements OnInit, OnChanges {

    /**
     * The ID value that should be used to associate
     * the relevant input element with the label provided by the
     * guacFormField component, if there is such an input element.
     */
    @Input() fieldId?: string;

    /**
     * Internal form control that holds the typed value
     * of the field.
     */
    typedControl: FormControl<Date | null> = new FormControl<Date | null>(null);

    constructor(private destroyRef: DestroyRef) {
        super();
    }

    /**
     * Initializes the component by setting up value change listeners for the `control` and `typedControl`
     * form controls.
     */
    ngOnInit(): void {
        // Set initial value of the typed control
        const initialValue: Date | null = this.control?.value ? this.parseDate(this.control.value) : null;
        this.typedControl.setValue(initialValue, { emitEvent: false });

        // Update typed value when model is changed
        this.control?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                const newTypedValue = value ? this.parseDate(value) : null;
                this.typedControl.setValue(newTypedValue, { emitEvent: false });
            });

        // Update string value in model when typed value is changed
        this.typedControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(typedValue => {
                const newValue = typedValue ? formatDate(typedValue, 'yyyy-MM-dd', 'en-US', 'UTC') : '';
                this.control?.setValue(newValue);
            });
    }

    /**
     * Apply disabled state to typed value form control.
     */
    ngOnChanges(changes: SimpleChanges): void {

        if (changes['disabled']) {

            const disabled: boolean = changes['disabled'].currentValue;
            this.setDisabledState(this.typedControl, disabled);

        }
    }

    /**
     * Parses the date components of the given string into a Date with only the
     * date components set. The resulting Date will be in the UTC timezone,
     * with the time left as midnight. The input string must be in the format
     * YYYY-MM-DD (zero-padded).
     *
     * @param str
     *     The date string to parse.
     *
     * @returns
     *     A Date object, in the UTC timezone, with only the date components
     *     set.
     */
    parseDate(str: string): Date | null {

        // Parse date, return blank if invalid
        const parsedDate = new Date(str + 'T00:00Z');
        if (isNaN(parsedDate.getTime()))
            return null;

        return parsedDate;

    }

}