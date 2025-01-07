

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

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { getBrowserLang } from '@ngneat/transloco';
import { GuacEventService } from 'guacamole-frontend-lib';
import * as jstz from 'jstz';
import { filter } from 'rxjs';
import { GuacFrontendEventArguments } from '../../events/types/GuacFrontendEventArguments';
import { DEFAULT_LANGUAGE } from '../../locale/service/translation.service';
import { LocalStorageService } from '../../storage/local-storage.service';
import { Preferences } from '../types/Preferences';

/**
 * The storage key of Guacamole preferences within local storage.
 */
const GUAC_PREFERENCES_STORAGE_KEY = 'GUAC_PREFERENCES';

/**
 * A service for setting and retrieving browser-local preferences. Preferences
 * may be any JSON-serializable type.
 */
@Injectable({
    providedIn: 'root'
})
export class PreferenceService {

    /**
     * All currently-set preferences, as name/value pairs. Each property name
     * corresponds to the name of a preference.
     */
    preferences: Preferences;

    /**
     * All valid input method type names.
     */
    inputMethods = {

        /**
         * No input method is used. Keyboard events are generated from a
         * physical keyboard.
         *
         * @constant
         */
        NONE: 'none',

        /**
         * Keyboard events will be generated from the Guacamole on-screen
         * keyboard.
         *
         * @constant
         */
        OSK: 'osk',

        /**
         * Keyboard events will be generated by inferring the keys necessary to
         * produce typed text from an IME (Input Method Editor) such as the
         * native on-screen keyboard of a mobile device.
         *
         * @constant
         */
        TEXT: 'text'

    };

    private window: Window;

    constructor(private localStorageService: LocalStorageService,
                private guacEventService: GuacEventService<GuacFrontendEventArguments>,
                @Inject(DOCUMENT) private document: Document,
                private router: Router) {
        this.window = this.document.defaultView as Window;

        this.preferences = {
            emulateAbsoluteMouse: true,
            inputMethod         : this.inputMethods.NONE,
            language            : this.getDefaultLanguageKey(),
            timezone            : this.getDetectedTimezone()
        };

        // Get stored preferences from localStorage
        const storedPreferences = this.localStorageService.getItem(GUAC_PREFERENCES_STORAGE_KEY);
        if (storedPreferences)
            this.preferences = { ...this.preferences, ...storedPreferences };

        // Persist settings when window is unloaded
        this.window.addEventListener('unload', this.save);


        // Persist settings upon navigation
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.save());


        // Persist settings upon logout
        this.guacEventService.on('guacLogout')
            .subscribe(() => {
                this.save();
            });
    }

    /**
     * Returns the key of the language currently in use within the browser.
     * This is not necessarily the user's desired language, but is rather the
     * language user by the browser's interface.
     *
     * @returns
     *     The key of the language currently in use within the browser.
     */
    getDefaultLanguageKey(): string {

        // Pull browser language, falling back to English
        return getBrowserLang() || DEFAULT_LANGUAGE;

    }

    /**
     * Return the timezone detected for the current browser session
     * by the JSTZ timezone library.
     *
     * @returns
     *     The name of the currently-detected timezone in IANA zone key
     *     format (Olson time zone database).
     */
    getDetectedTimezone(): string {
        return jstz.determine().name();
    }

    /**
     * Persists the current values of all preferences, if possible.
     */
    save() {
        this.localStorageService.setItem(GUAC_PREFERENCES_STORAGE_KEY, this.preferences);
    }

}
