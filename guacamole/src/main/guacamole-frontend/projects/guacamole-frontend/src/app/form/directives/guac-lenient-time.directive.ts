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
import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A directive which modifies the parsing and formatting of a form control value when used
 * on an HTML5 date input field, relaxing the otherwise strict parsing and
 * validation behavior. The behavior of this directive for other input elements
 * is undefined.
 */
@Directive({
    selector : '[guacLenientTime]',
    providers: [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GuacLenientTimeDirective),
            multi      : true
        }
    ]
})
export class GuacLenientTimeDirective implements ControlValueAccessor {

    /**
     * Callback function that has to be called when the control's value changes in the UI.
     *
     * @param value
     *    The new value of the control.
     */
    private onChange!: (value: any) => void;

    /**
     * Callback function that has to be called when the control's value changes in the UI.
     */
    private onTouched!: () => void;

    constructor(private renderer: Renderer2, private el: ElementRef) {
    }

    /**
     * Called by the forms API to write to the view when programmatic changes from model to view are requested.
     * Formats the date value as "yyyy-MM-dd" and sets the value of the input element.
     *
     * @param value
     *     The new value for the input element.
     */
    writeValue(value: any): void {
        const formattedValue = value ? this.format(value) : '';
        this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
    }

    /**
     * Form control will be updated when the input loses focus.
     */
    @HostListener('blur', ['$event.target.value'])
    onInput(value: string): void {
        const parsedValue = this.parse(value);
        this.onChange(parsedValue);
        this.onTouched();
    }

    /**
     * Parse time strings leniently.
     *
     * @param viewValue
     *     The time string to parse.
     */
    parse(viewValue: string): Date | null {

        // If blank, return null
        if (!viewValue)
            return null;

        // Match basic time pattern
        const match = /([0-9]*)(?::([0-9]*)(?::([0-9]*))?)?(?:\s*(a|p))?/.exec(viewValue.toLowerCase());
        if (!match)
            return null;

        // Determine hour, minute, and second based on pattern
        let hour = parseInt(match[1] || '0');
        let minute = parseInt(match[2] || '0');
        let second = parseInt(match[3] || '0');

        // Handle AM/PM
        if (match[4]) {

            // Interpret 12 AM as 00:00 and 12 PM as 12:00
            if (hour === 12)
                hour = 0;

            // Increment hour to evening if PM
            if (match[4] === 'p')
                hour += 12;

        }

        // Wrap seconds and minutes into minutes and hours
        minute += second / 60;
        second %= 60;
        hour += minute / 60;
        minute %= 60;

        // Constrain hours to 0 - 23
        hour %= 24;

        // Convert to Date object
        const parsedDate = new Date(Date.UTC(1970, 0, 1, hour, minute, second));
        if (isNaN(parsedDate.getTime()))
            return null;

        return parsedDate;

    }

    /**
     *  Format date strings as "yyyy-MM-dd".
     *
     * @param modelValue
     *     The date to format.
     */
    format(modelValue: Date | null): string {
        return modelValue ? formatDate(modelValue, 'HH:mm:ss', 'en-US', 'UTC') : '';
    }

}